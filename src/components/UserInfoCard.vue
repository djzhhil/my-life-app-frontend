<template>
  <view class="user-card">
    <view class="user-card__header">
      <view class="user-card__avatar">
        <text class="user-card__avatar-text">{{ userInfo.username?.charAt(0)?.toUpperCase() }}</text>
      </view>
      <view class="user-card__info">
        <text class="user-card__name">{{ userInfo.username }}</text>
        <view class="user-card__level">
          <text class="level-badge">LV.{{ userInfo.level }}</text>
        </view>
      </view>
    </view>

    <view class="user-card__stats">
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.exp }}</text>
        <text class="stat-label">经验值</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.coin }}</text>
        <text class="stat-label">金币</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ totalTasks }}</text>
        <text class="stat-label">总任务</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ completedTasks }}</text>
        <text class="stat-label">已完成</text>
      </view>
    </view>

    <!-- 经验值进度条 -->
    <view class="user-card__progress">
      <view class="progress-bar">
        <view class="progress-bar__fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
      <text class="progress-text">{{ progressPercent.toFixed(1) }}%</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface UserInfo {
  id: number;
  username: string;
  level: number;
  exp: number;
  coin: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  userInfo: UserInfo;
  totalTasks?: number;
  completedTasks?: number;
}

const props = withDefaults(defineProps<Props>(), {
  totalTasks: 0,
  completedTasks: 0,
});

// 计算进度（每级需要 100 经验）
const progressPercent = computed(() => {
  if (!props.userInfo) return 0;
  const exp = props.userInfo.exp % 100;
  return (exp / 100) * 100;
});
</script>

<style lang="scss" scoped>
.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 32rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
  }

  &__avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
  }

  &__avatar-text {
    font-size: 40rpx;
    font-weight: 600;
    color: #fff;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: 36rpx;
    font-weight: 600;
    margin-bottom: 8rpx;
    display: block;
  }

  &__level {
    display: inline-block;
  }

  .level-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    font-weight: 500;
  }

  &__stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 24rpx;
  }

  .stat-item {
    text-align: center;
  }

  .stat-value {
    font-size: 36rpx;
    font-weight: 600;
    display: block;
  }

  .stat-label {
    font-size: 22rpx;
    opacity: 0.8;
    margin-top: 4rpx;
    display: block;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .progress-bar {
    flex: 1;
    height: 12rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6rpx;
    overflow: hidden;
  }

  .progress-bar__fill {
    height: 100%;
    background: #fff;
    border-radius: 6rpx;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 22rpx;
    min-width: 80rpx;
    text-align: right;
  }
}
</style>