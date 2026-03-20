<template>
  <view class="task-card" :class="{ 'task-card--done': task.status === 'done' }">
    <view class="task-card__header">
      <text class="task-card__title">{{ task.title }}</text>
      <view class="task-card__badge" :class="statusClass">
        {{ statusText }}
      </view>
    </view>

    <view v-if="task.description" class="task-card__description">
      {{ task.description }}
    </view>

    <view class="task-card__footer">
      <view class="task-card__reward">
        <view class="task-card__reward-item">
          <text class="task-card__icon">💎</text>
          <text>{{ task.expReward }} 经验</text>
        </view>
        <view class="task-card__reward-item">
          <text class="task-card__icon">🪙</text>
          <text>{{ task.coinReward }} 金币</text>
        </view>
      </view>

      <button
        v-if="task.status === 'pending'"
        class="task-card__btn"
        @click="handleComplete"
      >
        完成
      </button>
      <view v-else class="task-card__completed">
        <text>✅ 已完成</text>
      </view>
    </view>

    <view v-if="task.completedAt" class="task-card__time">
      完成于 {{ formatDate(task.completedAt) }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Task, TaskStatus } from '@/types/api';
import { formatDateString } from '@/utils/date';

interface Props {
  task: Task;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'complete', id: number): void;
}>();

// 状态文本
const statusText = computed(() => {
  return props.task.status === TaskStatus.PENDING ? '待完成' : '已完成';
});

// 状态样式类
const statusClass = computed(() => {
  return props.task.status === TaskStatus.PENDING ? 'badge--pending' : 'badge--done';
});

// 格式化日期
function formatDate(dateStr: string) {
  return formatDateString(dateStr, 'yyyy-MM-dd HH:mm');
}

// 完成任务
function handleComplete() {
  uni.showModal({
    title: '确认完成',
    content: `确定要完成"${props.task.title}"吗？`,
    success: (res) => {
      if (res.confirm) {
        emit('complete', props.task.id);
      }
    },
  });
}
</script>

<style lang="scss" scoped>
.task-card {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);

  &--done {
    opacity: 0.7;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    flex: 1;
    margin-right: 16rpx;
  }

  &__badge {
    padding: 4rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 500;

    &--pending {
      background: #e3f2fd;
      color: #1976d2;
    }

    &--done {
      background: #e8f5e9;
      color: #388e3c;
    }
  }

  &__description {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 16rpx;
    line-height: 1.5;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
  }

  &__reward {
    display: flex;
    gap: 24rpx;
  }

  &__reward-item {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #666;
  }

  &__icon {
    margin-right: 6rpx;
  }

  &__btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    font-size: 26rpx;
    padding: 12rpx 32rpx;
    border-radius: 30rpx;
    border: none;
    line-height: 1.5;
  }

  &__completed {
    font-size: 24rpx;
    color: #4caf50;
  }

  &__time {
    font-size: 22rpx;
    color: #999;
    margin-top: 12rpx;
    text-align: right;
  }
}
</style>