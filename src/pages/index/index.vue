<template>
  <view class="index-container">
    <!-- 用户信息卡片 -->
    <UserInfoCard
      v-if="userStore.userInfo"
      :user-info="userStore.userInfo"
      :total-tasks="taskStore.totalCount"
      :completed-tasks="taskStore.doneCount"
    />

    <!-- 筛选标签 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: taskStore.filter === 'all' }"
        @click="taskStore.setFilter('all')"
      >
        <text>全部</text>
        <text class="count">{{ taskStore.totalCount }}</text>
      </view>
      <view
        class="filter-item"
        :class="{ active: taskStore.filter === 'pending' }"
        @click="taskStore.setFilter('pending')"
      >
        <text>待完成</text>
        <text class="count">{{ taskStore.pendingCount }}</text>
      </view>
      <view
        class="filter-item"
        :class="{ active: taskStore.filter === 'done' }"
        @click="taskStore.setFilter('done')"
      >
        <text>已完成</text>
        <text class="count">{{ taskStore.doneCount }}</text>
      </view>
    </view>

    <!-- 任务列表 -->
    <view class="task-list">
      <view v-if="taskStore.loading" class="loading">
        <text>加载中...</text>
      </view>

      <view v-else-if="taskStore.filteredTasks.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无任务</text>
        <text class="empty-hint">点击下方按钮创建任务</text>
      </view>

      <TaskCard
        v-else
        v-for="task in taskStore.filteredTasks"
        :key="task.id"
        :task="task"
        @complete="handleComplete"
      />
    </view>

    <!-- 创建任务按钮 -->
    <view class="fab" @click="goToCreate">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useTaskStore } from '@/store/task';
import UserInfoCard from '@/components/UserInfoCard.vue';
import TaskCard from '@/components/TaskCard.vue';
import { ROUTES } from '@/types/common';

const userStore = useUserStore();
const taskStore = useTaskStore();

onMounted(() => {
  // 初始化用户信息
  userStore.init();
  // 获取任务列表
  taskStore.fetchTasks();
});

async function handleComplete(id: number) {
  const success = await taskStore.completeTask(id);
  if (success) {
    uni.showToast({ title: '任务完成！', icon: 'success' });
  } else {
    uni.showToast({ title: '操作失败', icon: 'none' });
  }
}

function goToCreate() {
  uni.navigateTo({ url: ROUTES.CREATE });
}
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.filter-bar {
  display: flex;
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.filter-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.2s;

  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    .count {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .count {
    background: #f0f0f0;
    padding: 2rpx 12rpx;
    border-radius: 16rpx;
    font-size: 24rpx;
    margin-left: 8rpx;
  }
}

.task-list {
  .loading,
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
    color: #999;
  }

  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .empty-text {
    font-size: 32rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  .empty-hint {
    font-size: 24rpx;
    color: #999;
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 80rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);

  &-icon {
    font-size: 56rpx;
    color: #fff;
    font-weight: 300;
  }
}
</style>