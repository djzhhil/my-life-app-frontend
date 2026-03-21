<template>
  <view class="progress-bar">
    <!-- 标签 -->
    <view v-if="showLabel" class="progress-bar__label">
      <slot name="label">
        <text class="progress-bar__label__text">{{ formattedValue }}{{ unit }}</text>
        <text v-if="max > 0" class="progress-bar__label__max"> / {{ max }}</text>
      </slot>
    </view>

    <!-- 进度条 -->
    <view
      class="progress-bar__track"
      :style="{ height, backgroundColor: bgColor }"
    >
      <view
        class="progress-bar__fill"
        :class="{ 'progress-bar__fill--animated': animated }"
        :style="{
          width: percentage + '%',
          background: color,
        }"
      >
        <!-- 闪光效果 -->
        <view v-if="animated" class="progress-bar__fill__shine"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, watch, ref, onMounted } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    default: 100,
  },
  color: {
    type: String,
    default: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
  bgColor: {
    type: String,
    default: '#e9ecef',
  },
  height: {
    type: String,
    default: '16rpx',
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: '',
  },
  animated: {
    type: Boolean,
    default: true,
  },
});

const currentPercentage = ref(0);

const percentage = computed(() => {
  const percent = (props.value / props.max) * 100;
  return Math.min(100, Math.max(0, percent));
});

const formattedValue = computed(() => {
  return props.value.toLocaleString();
});

// 动画效果
watch(
  () => percentage.value,
  (newVal) => {
    if (props.animated) {
      animateProgress(newVal);
    } else {
      currentPercentage.value = newVal;
    }
  },
  { immediate: true }
);

function animateProgress(target: number) {
  const start = currentPercentage.value;
  const duration = 500; // 500ms
  const startTime = Date.now();

  function step() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // 缓动函数
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    currentPercentage.value = start + (target - start) * easeOutQuart;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      currentPercentage.value = target;
    }
  }

  requestAnimationFrame(step);
}

onMounted(() => {
  if (props.animated) {
    animateProgress(percentage.value);
  }
});
</script>

<style lang="scss" scoped>
.progress-bar {
  width: 100%;

  &__label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8rpx;
    font-size: 24rpx;

    &__text {
      font-weight: 600;
      color: #333;
    }

    &__max {
      color: #999;
      font-weight: 400;
    }
  }

  &__track {
    width: 100%;
    border-radius: 8rpx;
    overflow: hidden;
  }

  &__fill {
    position: relative;
    height: 100%;
    border-radius: 8rpx;
    transition: width 0.3s ease-out;

    &--animated {
      transition: none;
    }

    &__shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.3) 50%,
        transparent 100%
      );
      animation: shine 2s infinite;
    }
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}
</style>
