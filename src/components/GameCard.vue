<template>
  <view
    class="game-card"
    :class="[`game-card--${variant}`, { 'game-card--active': isActive }]"
    :style="{ background: background }"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

// 卡片变体
type CardVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'gold' | 'exp' | 'level';

const props = defineProps({
  variant: {
    type: String as PropType<CardVariant>,
    default: 'default',
  },
  background: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>

<style lang="scss" scoped>
.game-card {
  position: relative;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  // 不同变体的背景渐变
  &--default {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }

  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &--success {
    background: linear-gradient(135deg, #51cf66 0%, #2f9e44 100%);
  }

  &--warning {
    background: linear-gradient(135deg, #fcc419 0%, #f08c00 100%);
  }

  &--danger {
    background: linear-gradient(135deg, #ff6b6b 0%, #f03e3e 100%);
  }

  &--gold {
    background: linear-gradient(135deg, #ffd43b 0%, #fab005 100%);
  }

  &--exp {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &--level {
    background: linear-gradient(135deg, #51cf66 0%, #2f9e44 100%);
  }

  // 激活状态
  &--active {
    transform: scale(1.02);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
  }

  // 点击效果
  &:active {
    transform: scale(0.98);
  }

  // 光晕效果
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }
}
</style>
