<template>
  <view class="task-card" :class="statusClass" @click="handleClick">
    <!-- 分类图标 -->
    <view class="task-card__category" :style="{ color: categoryColor }">
      <text>{{ categoryIcon }}</text>
    </view>

    <!-- 任务信息 -->
    <view class="task-card__content">
      <view class="task-card__title">{{ task.title }}</view>
      <view v-if="task.description" class="task-card__description">
        {{ task.description }}
      </view>

      <!-- 截止日期 -->
      <view v-if="task.dueDate" class="task-card__due">
        <text class="task-card__due__icon">📅</text>
        <text class="task-card__due__text">{{ formatDate(task.dueDate) }}</text>
        <text v-if="isOverdue" class="task-card__due__status--overdue">已逾期</text>
        <text v-else-if="isToday" class="task-card__due__status--today">今天</text>
      </view>

      <!-- 奖励信息 -->
      <view class="task-card__rewards">
        <view class="task-card__reward" :class="priorityClass">
          <text class="task-card__reward__icon">⚡</text>
          <text class="task-card__reward__value">{{ task.expReward }}</text>
        </view>
        <view class="task-card__reward gold">
          <text class="task-card__reward__icon">💎</text>
          <text class="task-card__reward__value">{{ task.coinReward }}</text>
        </view>
      </view>
    </view>

    <!-- 完成按钮 -->
    <view
      v-if="task.status === 0"
      class="task-card__complete"
      @click.stop="handleComplete"
    >
      <text class="task-card__complete__icon">✓</text>
    </view>

    <!-- 已完成标记 -->
    <view v-else class="task-card__completed">
      <text class="task-card__completed__icon">✓</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TaskVO } from '@/types/api';
import { TASK_CATEGORY_ICONS, TASK_PRIORITY_NAMES, TASK_PRIORITY } from '@/types/api';

const props = defineProps<{
  task: TaskVO;
}>();

const emit = defineEmits(['complete', 'click']);

const categoryIcon = computed(() => TASK_CATEGORY_ICONS[props.task.category] || '📌');
const categoryColor = computed(() => {
  const colors = {
    0: '#999',
    1: '#51cf66',
    2: '#339af0',
    3: '#fcc419',
    4: '#ff922b',
    5: '#9775fa',
  };
  return colors[props.task.category] || '#999';
});

const statusClass = computed(() => {
  return {
    'task-card--pending': props.task.status === 0,
    'task-card--done': props.task.status === 1,
  };
});

const priorityClass = computed(() => {
  return {
    'priority--high': props.task.priority === TASK_PRIORITY.HIGH,
    'priority--medium': props.task.priority === TASK_PRIORITY.MEDIUM,
    'priority--low': props.task.priority === TASK_PRIORITY.LOW,
  };
});

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 1) return false;
  const dueDate = new Date(props.task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
});

const isToday = computed(() => {
  if (!props.task.dueDate) return false;
  const dueDate = new Date(props.task.dueDate);
  const today = new Date();
  return (
    dueDate.getDate() === today.getDate() &&
    dueDate.getMonth() === today.getMonth() &&
    dueDate.getFullYear() === today.getFullYear()
  );
});

function formatDate(date: string): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

function handleComplete() {
  emit('complete', props.task.id);
}

function handleClick() {
  emit('click', props.task);
}
</script>

<style lang="scss" scoped>
.task-card {
  display: flex;
  align-items: stretch;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
  }

  &--pending {
    border-left: 4rpx solid #667eea;
  }

  &--done {
    border-left: 4rpx solid #51cf66;
    opacity: 0.7;
  }

  &__category {
    font-size: 48rpx;
    margin-right: 16rpx;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
  }

  &__description {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  &__due {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #999;
    margin-bottom: 12rpx;

    &__icon {
      margin-right: 4rpx;
    }

    &__status--overdue {
      margin-left: 8rpx;
      color: #ff6b6b;
      background: #fff5f5;
      padding: 2rpx 8rpx;
      border-radius: 8rpx;
      font-size: 20rpx;
    }

    &__status--today {
      margin-left: 8rpx;
      color: #fcc419;
      background: #fffbf0;
      padding: 2rpx 8rpx;
      border-radius: 8rpx;
      font-size: 20rpx;
    }
  }

  &__rewards {
    display: flex;
    gap: 12rpx;
  }

  &__reward {
    display: flex;
    align-items: center;
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
    font-size: 24rpx;
    background: #f8f9fa;

    &.priority--high {
      background: #fff5f5;
      color: #ff6b6b;
    }

    &.priority--medium {
      background: #fffbf0;
      color: #fcc419;
    }

    &.priority--low {
      background: #f1f3f5;
      color: #999;
    }

    &.gold {
      background: #fffbf5;
      color: #ffd43b;
    }

    &__icon {
      margin-right: 4rpx;
    }

    &__value {
      font-weight: 600;
    }
  }

  &__complete {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16rpx;

    &__icon {
      font-size: 48rpx;
      color: #fff;
      font-weight: 600;
    }
  }

  &__completed {
    width: 64rpx;
    height: 64rpx;
    background: linear-gradient(135deg, #51cf66 0%, #2f9e44 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16rpx;

    &__icon {
      font-size: 48rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}
</style>
