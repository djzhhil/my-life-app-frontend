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
    <view class="menu-section">
      <view class="menu-section__title">
        <text>我的</text>
      </view>

      <view class="menu-list">
        <view
          class="menu-item"
          @click="goToPage('accounting')"
        >
          <view class="menu-item__left">
            <text class="menu-item__icon">💰</text>
            <text class="menu-item__text">记账</text>
          </view>
          <view class="menu-item__right">
            <text class="menu-item__arrow">›</text>
          </view>
        </view>

        <view
          class="menu-item"
          @click="goToPage('wishlist')"
        >
          <view class="menu-item__left">
            <text class="menu-item__icon">🌟</text>
            <text class="menu-item__text">心愿单</text>
          </view>
          <view class="menu-item__right">
            <text class="menu-item__arrow">›</text>
          </view>
        </view>

        <view
          class="menu-item"
          @click="goToPage('achievements')"
        >
          <view class="menu-item__left">
            <text class="menu-item__icon">🏆</text>
            <text class="menu-item__text">成就</text>
          </view>
          <view class="menu-item__right">
            <text class="menu-item__arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="menu-section">
      <view class="menu-section__title">
        <text>设置</text>
      </view>

      <view class="menu-list">
        <view
          class="menu-item"
          @click="goToPage('settings')"
        >
          <view class="menu-item__left">
            <text class="menu-item__icon">⚙️</text>
            <text class="menu-item__text">设置</text>
          </view>
          <view class="menu-item__right">
            <text class="menu-item__arrow">›</text>
          </view>
        </view>

        <view
          class="menu-item"
          @click="handleAbout"
        >
          <view class="menu-item__left">
            <text class="menu-item__icon">ℹ️</text>
            <text class="menu-item__text">关于</text>
          </view>
          <view class="menu-item__right">
            <text class="menu-item__arrow">›</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 登出按钮 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">
        <text class="logout-btn__icon">👋</text>
        <text class="logout-btn__text">退出登录</text>
      </button>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text class="version-info__text">MyLife v1.0.0</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { useTaskStore } from '@/store/task';
import UserInfoCard from '@/components/UserInfoCard.vue';

const userStore = useUserStore();
const taskStore = useTaskStore();

onMounted(() => {
  // 初始化用户信息
  userStore.init();
  // 获取任务统计数据
  taskStore.fetchTasks();
});

function goToPage(page: string) {
  switch (page) {
    case 'accounting':
      uni.showToast({ title: '记账功能开发中', icon: 'none' });
      break;
    case 'wishlist':
      uni.showToast({ title: '心愿单功能开发中', icon: 'none' });
      break;
    case 'achievements':
      uni.showToast({ title: '成就功能开发中', icon: 'none' });
      break;
    case 'settings':
      uni.showToast({ title: '设置功能开发中', icon: 'none' });
      break;
  }
}

function handleAbout() {
  uni.showModal({
    title: '关于 MyLife',
    content: 'MyLife 是一款生活游戏化管理应用，将日常任务转化为游戏化体验。\n\n版本：1.0.0\n开发者：Hanmosoda',
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
        uni.reLaunch({ url: '/pages/login/login' });
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
  padding-bottom: 40rpx;
}

.menu-section {
  margin-bottom: 24rpx;

  &__title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rpx;
    padding: 0 8rpx;
  }
}

.menu-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 24rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #f8f9fa;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__icon {
    font-size: 36rpx;
    margin-right: 12rpx;
  }

  &__text {
    font-size: 28rpx;
    color: #333;
  }

  &__right {
    display: flex;
    align-items: center;
  }

  &__arrow {
    font-size: 48rpx;
    color: #999;
  }
}

.logout-section {
  margin-top: 48rpx;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  background: #fff;
  border-radius: 48rpx;
  color: #ff6b6b;
  font-size: 28rpx;
  font-weight: 600;
  border: 2rpx solid #ff6b6b;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  &::after {
    border: none;
  }

  &__icon {
    margin-right: 8rpx;
    font-size: 32rpx;
  }

  &__text {
    font-size: 28rpx;
  }

  &:active {
    background: #fff5f5;
  }
}

.version-info {
  margin-top: 48rpx;
  text-align: center;

  &__text {
    font-size: 24rpx;
    color: #999;
  }
}
</style>
