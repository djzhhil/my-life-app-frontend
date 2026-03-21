<template>
  <view
    class="game-icon"
    :class="[`game-icon--${size}`, { 'game-icon--animated': animated, 'game-icon--pulse': pulse }]"
    :style="{ color: color }"
  >
    <text class="game-icon__emoji">{{ emoji || '🎮' }}</text>
    <text v-if="text" class="game-icon__text">{{ text }}</text>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

type IconSize = 'small' | 'medium' | 'large' | 'xlarge';

const props = defineProps({
  emoji: {
    type: String,
    default: '🎮',
  },
  text: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<IconSize>,
    default: 'medium',
  },
  animated: {
    type: Boolean,
    default: false,
  },
  pulse: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.game-icon {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // 尺寸
  &--small {
    .game-icon__emoji {
      font-size: 32rpx;
    }
    .game-icon__text {
      font-size: 20rpx;
    }
  }

  &--medium {
    .game-icon__emoji {
      font-size: 48rpx;
    }
    .game-icon__text {
      font-size: 24rpx;
    }
  }

  &--large {
    .game-icon__emoji {
      font-size: 64rpx;
    }
    .game-icon__text {
      font-size: 28rpx;
    }
  }

  &--xlarge {
    .game-icon__emoji {
      font-size: 80rpx;
    }
    .game-icon__text {
      font-size: 32rpx;
    }
  }

  // 动画
  &--animated {
    .game-icon__emoji {
      animation: bounce 1s ease-in-out infinite;
    }
  }

  &--pulse {
    .game-icon__emoji {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  &__emoji {
    line-height: 1;
  }

  &__text {
    margin-top: 4rpx;
    font-weight: 600;
    color: inherit;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8rpx);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}
</style>
