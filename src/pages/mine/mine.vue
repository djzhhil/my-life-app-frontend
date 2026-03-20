<template>
  <view class="mine-container">
    <!-- 用户信息卡片 -->
    <UserInfoCard
      v-if="userStore.userInfo"
      :user-info="userStore.userInfo"
      :total-tasks="taskStore.totalCount"
      :completed-tasks="taskStore.doneCount"
    />

    <!-- 功能菜单 -->
    <view class="menu-card">
      <view class="menu-item" @click="goToTasks">
        <view class="menu-icon">📋</view>
        <view class="menu-content">
          <text class="menu-title">我的任务</text>
          <text class="menu-desc">查看所有任务</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-divider"></view>

      <view class="menu-item" @click="goToProfile">
        <view class="menu-icon">👤</view>
        <view class="menu-content">
          <text class="menu-title">个人资料</text>
          <text class="menu-desc">编辑个人信息</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-divider"></view>

      <view class="menu-item" @click="showAbout">
        <view class="menu-icon">ℹ️</view>
        <view class="menu-content">
          <text class="menu-title">关于 MyLife</text>
          <text class="menu-desc">版本信息</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view class="stats-card">
      <text class="stats-title">任务统计</text>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ taskStore.totalCount }}</text>
          <text class="stat-label">总任务</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ taskStore.pendingCount }}</text>
          <text class="stat-label">待完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ taskStore.doneCount }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ completionRate }}%</text>
          <text class="stat-label">完成率</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        退出登录
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useTaskStore } from '@/store/task';
import UserInfoCard from '@/components/UserInfoCard.vue';
import { ROUTES } from '@/types/common';

const userStore = useUserStore();
const taskStore = useTaskStore();

onMounted(() => {
  userStore.init();
  taskStore.fetchTasks();
});

// 计算完成率
const completionRate = computed(() => {
  if (taskStore.totalCount === 0) return 0;
  return Math.round((taskStore.doneCount / taskStore.totalCount) * 100);
});

function goToTasks() {
  uni.switchTab({ url: ROUTES.INDEX });
}

function goToProfile() {
  uni.showToast({ title: '功能开发中', icon: 'none' });
}

function showAbout() {
  uni.showModal({
    title: '关于 MyLife',
    content: 'MyLife 任务管理系统 v1.0.0\n\n一个帮助你管理日常任务的工具',
    showCancel: false,
  });
}

function handleLogout() {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({ url: ROUTES.LOGIN });
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.mine-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20rpx;
  padding-bottom: 120rpx;
}

.menu-card {
  background: #fff;
  border-radius: 16rpx;
  margin-top: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
}

.menu-icon {
  font-size: 44rpx;
  margin-right: 20rpx;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  display: block;
}

.menu-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
  display: block;
}

.menu-arrow {
  font-size: 36rpx;
  color: #ccc;
}

.menu-divider {
  height: 1rpx;
  background: #f0f0f0;
  margin-left: 88rpx;
}

.stats-card {
  background: #fff;
  border-radius: 16rpx;
  margin-top: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.stats-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 24rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.stat-item {
  text-align: center;
  padding: 16rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 600;
  color: #667eea;
  display: block;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
  display: block;
}

.logout-section {
  margin-top: 48rpx;
  padding: 0 24rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  background: #fff;
  color: #f44336;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 44rpx;
  border: 2rpx solid #f44336;
}
</style>