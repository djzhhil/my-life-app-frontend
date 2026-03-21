<template>
  <view class="stat-card">
    <!-- 图标 -->
    <view class="stat-card__icon" :style="{ color: color }">
      <text v-if="icon">{{ icon }}</text>
      <slot name="icon" v-else></slot>
    </view>

    <!-- 数值 -->
    <view class="stat-card__value">
      <text class="stat-card__value__number">{{ formattedValue }}</text>
      <text v-if="unit" class="stat-card__value__unit">{{ unit }}</text>
    </view>

    <!-- 标题 -->
    <view class="stat-card__title">{{ title }}</view>

    <!-- 趋势 -->
    <view v-if="trend" class="stat-card__trend" :class="`stat-card__trend--${trend}`">
      <text class="stat-card__trend__icon">{{ trendIcon }}</text>
      <text class="stat-card__trend__value">{{ formatTrendValue(trendValue) }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String] as PropType<number | string>,
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#667eea',
  },
  trend: {
    type: String as PropType<'up' | 'down' | 'stable'>,
    default: '',
  },
  trendValue: {
    type: Number,
    default: 0,
  },
});

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    case 'stable':
      return '→';
    default:
      return '';
  }
});

function formatTrendValue(value: number): string {
  if (value === 0) return '-0%';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}
</script>

<style lang="scss" scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

  &__icon {
    font-size: 56rpx;
    margin-bottom: 8rpx;
    font-weight: 600;
  }

  &__value {
    display: flex;
    align-items: baseline;
    justify-content: center;
    margin-bottom: 4rpx;

    &__number {
      font-size: 48rpx;
      font-weight: 700;
      color: #333;
    }

    &__unit {
      font-size: 24rpx;
      color: #999;
      margin-left: 4rpx;
    }
  }

  &__title {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  &__trend {
    display: flex;
    align-items: center;
    font-size: 20rpx;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;

    &--up {
      background: #e6fcf5;
      color: #51cf66;
    }

    &--down {
      background: #fff5f5;
      color: #ff6b6b;
    }

    &--stable {
      background: #f8f9fa;
      color: #999;
    }

    &__icon {
      margin-right: 4rpx;
    }
  }
}
</style>
