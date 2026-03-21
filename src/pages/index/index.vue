<template>
  <view class="index-container">
    <!-- 用户信息卡片 -->
    <UserInfoCard
      v-if="userStore.userInfo"
      :user-info="userStore.userInfo"
      :total-tasks="taskStore.totalCount"
      :completed-tasks="taskStore.doneCount"
    />

    <!-- 分类筛选 -->
    <view class="category-filter">
      <scroll-view scroll-x class="category-filter__scroll">
        <view
          class="category-filter__item"
          :class="{ active: selectedCategory === -1 }"
          @click="handleCategoryClick(-1)"
        >
          <text>全部</text>
        </view>
        <view
          v-for="cat in categories"
          :key="cat.value"
          class="category-filter__item"
          :class="{ active: selectedCategory === cat.value }"
          :style="{ color: selectedCategory === cat.value ? cat.color : '' }"
          @click="handleCategoryClick(cat.value)"
        >
          <text>{{ cat.icon }}</text>
          <text>{{ cat.label }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 状态筛选标签 -->
    <view class="filter-bar">
      <view
        class="filter-item"
        :class="{ active: selectedStatus === null }"
        @click="handleStatusClick(null)"
      >
        <text>全部</text>
        <text class="count">{{ taskStore.totalCount }}</text>
      </view>
      <view
        class="filter-item"
        :class="{ active: selectedStatus === 0 }"
        @click="handleStatusClick(0)"
      >
        <text>待完成</text>
        <text class="count">{{ taskStore.pendingCount }}</text>
      </view>
      <view
        class="filter-item"
        :class="{ active: selectedStatus === 1 }"
        @click="handleStatusClick(1)"
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

      <view v-else-if="filteredTasks.length === 0" class="empty">
        <text class="empty-icon">📋</text>
        <text class="empty-text">暂无任务</text>
        <text class="empty-hint">点击下方按钮创建任务</text>
      </view>

      <TaskCard
        v-else
        v-for="task in filteredTasks"
        :key="task.id"
        :task="task"
        @complete="handleComplete"
        @click="handleTaskClick"
      />
    </view>

    <!-- 创建任务按钮 -->
    <view class="fab" @click="goToCreate">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useTaskStore } from '@/store/task';
import UserInfoCard from '@/components/UserInfoCard.vue';
import TaskCard from '@/components/TaskCard.vue';
import { TaskCategory, TASK_CATEGORY_NAMES, TASK_CATEGORY_ICONS, TASK_CATEGORY_COLORS } from '@/types/api';

const userStore = useUserStore();
const taskStore = useTaskStore();

// 分类筛选
const selectedCategory = ref(-1);
const categories = [
  { value: TaskCategory.GENERAL, label: TASK_CATEGORY_NAMES[TaskCategory.GENERAL], icon: TASK_CATEGORY_ICONS[TaskCategory.GENERAL], color: TASK_CATEGORY_COLORS[TaskCategory.GENERAL] },
  { value: TaskCategory.STUDY, label: TASK_CATEGORY_NAMES[TaskCategory.STUDY], icon: TASK_CATEGORY_ICONS[TaskCategory.STUDY], color: TASK_CATEGORY_COLORS[TaskCategory.STUDY] },
  { value: TaskCategory.WORK, label: TASK_CATEGORY_NAMES[TaskCategory.WORK], icon: TASK_CATEGORY_ICONS[TaskCategory.WORK], color: TASK_CATEGORY_COLORS[TaskCategory.WORK] },
  { value: TaskCategory.EXERCISE, label: TASK_CATEGORY_NAMES[TaskCategory.EXERCISE], icon: TASK_CATEGORY_ICONS[TaskCategory.EXERCISE], color: TASK_CATEGORY_COLORS[TaskCategory.EXERCISE] },
  { value: TaskCategory.LIFE, label: TASK_CATEGORY_NAMES[TaskCategory.LIFE], icon: TASK_CATEGORY_ICONS[TaskCategory.LIFE], color: TASK_CATEGORY_COLORS[TaskCategory.LIFE] },
  { value: TaskCategory.CREATIVE, label: TASK_CATEGORY_NAMES[TaskCategory.CREATIVE], icon: TASK_CATEGORY_ICONS[TaskCategory.CREATIVE], color: TASK_CATEGORY_COLORS[TaskCategory.CREATIVE] },
];

// 状态筛选
const selectedStatus = ref<number | null>(null);

// 筛选后的任务列表
const filteredTasks = computed(() => {
  let tasks = taskStore.tasks;

  // 分类筛选
  if (selectedCategory.value !== -1) {
    tasks = tasks.filter((task) => task.category === selectedCategory.value);
  }

  // 状态筛选
  if (selectedStatus.value !== null) {
    tasks = tasks.filter((task) => task.status === selectedStatus.value);
  }

  return tasks;
});

onMounted(() => {
  // 初始化用户信息
  userStore.init();
  // 获取任务列表
  taskStore.fetchTasks();
});

function handleCategoryClick(category: number) {
  selectedCategory.value = category;
}

function handleStatusClick(status: number | null) {
  selectedStatus.value = status;
}

async function handleComplete(id: number) {
  const success = await taskStore.completeTask(id);
  if (success) {
    uni.showToast({ title: '任务完成！', icon: 'success' });
  } else {
    uni.showToast({ title: '操作失败', icon: 'none' });
  }
}

function handleTaskClick(task: any) {
  // TODO: 跳转到任务详情页
  uni.showToast({ title: '功能开发中', icon: 'none' });
}

function goToCreate() {
  uni.navigateTo({ url: '/pages/create/create' });
}
</script>

<style lang="scss" scoped>
.index-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

// 分类筛选
.category-filter {
  background: #fff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  &__scroll {
    display: flex;
    white-space: nowrap;
  }

  &__item {
    display: inline-flex;
    align-items: center;
    padding: 8rpx 20rpx;
    margin-right: 12rpx;
    border-radius: 24rpx;
    font-size: 24rpx;
    color: #666;
    background: #f8f9fa;
    transition: all 0.3s;

    &:last-child {
      margin-right: 0;
    }

    text {
      &:first-child {
        margin-right: 4rpx;
      }
    }

    &.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
  }
}

// 状态筛选
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
