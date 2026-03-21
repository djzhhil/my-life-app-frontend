<template>
  <view class="user-info-card">
    <view class="user-info-card__header">
      <!-- 头像 -->
      <view class="user-info-card__avatar">
        <text class="user-info-card__avatar__text">{{ avatarText }}</text>
      </view>

      <!-- 用户名和等级 -->
      <view class="user-info-card__info">
        <view class="user-info-card__username">{{ userInfo.username }}</view>
        <view class="user-info-card__level">
          <text class="user-info-card__level__icon">🏆</text>
          <text class="user-info-card__level__text">LV{{ userInfo.level }}</text>
          <text class="user-info-card__level__name"> {{ levelConfig.name }}</text>
        </view>
      </view>

      <!-- 成就徽章 -->
      <view class="user-info-card__badge">
        <text class="user-info-card__badge__icon">🎖️</text>
        <text class="user-info-card__badge__text">{{ levelConfig.title }}</text>
      </view>
    </view>

    <!-- 经验值进度 -->
    <view class="user-info-card__exp-section">
      <view class="user-info-card__label">
        <text class="user-info-card__label__icon">⚡</text>
        <text class="user-info-card__label__text">经验值</text>
        <text class="user-info-card__label__value">{{ userInfo.exp }} / {{ levelConfig.maxExp }}</text>
      </view>
      <ProgressBar
        :value="userInfo.exp"
        :max="levelConfig.maxExp"
        color="linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
        height="24rpx"
        :show-label="false"
        :animated="false"
      />
    </view>

    <!-- 金币数量 -->
    <view class="user-info-card__coin-section">
      <view class="user-info-card__label">
        <text class="user-info-card__label__icon">💎</text>
        <text class="user-info-card__label__text">金币</text>
        <text class="user-info-card__label__value">{{ userInfo.coin }}</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="user-info-card__stats">
      <StatCard
        title="总任务"
        :value="totalTasks"
        icon="📋"
        color="#667eea"
      />
      <StatCard
        title="已完成"
        :value="completedTasks"
        icon="✅"
        color="#51cf66"
      />
      <StatCard
        title="完成率"
        :value="completionRate"
        :unit="'%'"
        icon="📊"
        color="#fcc419"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { User } from '@/types/api';
import { getLevelByExp } from '@/types/game';
import ProgressBar from '@/components/ProgressBar.vue';
import StatCard from '@/components/StatCard.vue';

const props = defineProps<{
  userInfo: User;
  totalTasks: number;
  completedTasks: number;
}>();

// 头像文字（取用户名首字母）
const avatarText = computed(() => {
  return props.userInfo.username.charAt(0).toUpperCase();
});

// 等级配置
const levelConfig = computed(() => {
  return getLevelByExp(props.userInfo.exp);
});

// 完成率
const completionRate = computed(() => {
  if (props.totalTasks === 0) return 0;
  return Math.round((props.completedTasks / props.totalTasks) * 100);
});
</script>

<style lang="scss" scoped>
.user-info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 32rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;
  }

  &__avatar {
    width: 96rpx;
    height: 96rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);

    &__text {
      font-size: 40rpx;
      font-weight: 700;
      color: #fff;
    }
  }

  &__info {
    flex: 1;
  }

  &__username {
    font-size: 36rpx;
    font-weight: 700;
    margin-bottom: 8rpx;
  }

  &__level {
    display: flex;
    align-items: center;
    font-size: 24rpx;

    &__icon {
      margin-right: 4rpx;
    }

    &__text {
      font-weight: 600;
      margin-right: 4rpx;
    }

    &__name {
      opacity: 0.9;
    }
  }

  &__badge {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16rpx;
    font-size: 20rpx;
    backdrop-filter: blur(10rpx);

    &__icon {
      margin-right: 4rpx;
    }

    &__text {
      font-weight: 600;
    }
  }

  &__section {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 16rpx;
    backdrop-filter: blur(10rpx);
  }

  &__exp-section {
    margin-bottom: 16rpx;
  }

  &__coin-section {
    margin-bottom: 16rpx;
  }

  &__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 24rpx;
    margin-bottom: 12rpx;

    &__icon {
      margin-right: 6rpx;
    }

    &__text {
      flex: 1;
      font-weight: 600;
    }

    &__value {
      font-weight: 700;
    }
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12rpx;
    margin-top: 24rpx;

    // 重写 StatCard 样式以适应深色背景
    :deep(.stat-card) {
      background: rgba(255, 255, 255, 0.15);
      padding: 16rpx 8rpx;

      &__title {
        color: rgba(255, 255, 255, 0.9);
        font-size: 20rpx;
      }

      &__value {
        &__number {
          color: #fff;
          font-size: 36rpx;
        }

        &__unit {
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }
}
</style>
