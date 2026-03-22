<template>
  <view class="wishlist-card" @click="handleClick">
    <view class="card-header">
      <view class="icon-wrapper" :style="{ backgroundColor: item.color || '#667eea' }">
        <text class="icon">{{ item.icon || '🎯' }}</text>
      </view>
      <view class="title-section">
        <text class="title">{{ item.title }}</text>
        <view class="tags">
          <text class="tag priority" :class="'priority-' + item.priority">
            {{ priorityText }}
          </text>
          <text class="tag status" :class="'status-' + item.status">
            {{ statusText }}
          </text>
        </view>
      </view>
    </view>
    
    <view class="card-body">
      <view class="progress-section">
        <ProgressBar 
          :progress="progress" 
          :size="80"
          :strokeWidth="6"
          :color="'#667eea'"
        />
        <view class="amount-info">
          <text class="current-amount">¥{{ item.currentAmount }}</text>
          <text class="target-amount">/ ¥{{ item.targetAmount }}</text>
        </view>
      </view>
      
      <view class="target-date" v-if="item.targetDate">
        <text>目标日期：{{ formatDate(item.targetDate) }}</text>
      </view>
    </view>
    
    <view class="card-footer">
      <button class="deposit-btn" @click.stop="handleDeposit">
        存入金币
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Wishlist } from '@/api/wishlist'
import ProgressBar from '@/components/ProgressBar.vue'

const props = defineProps<{
  item: Wishlist
}>()

const emit = defineEmits<{
  (e: 'click', item: Wishlist): void
  (e: 'deposit', item: Wishlist): void
}>()

const progress = computed(() => {
  if (props.item.targetAmount <= 0) return 0
  return Math.min(100, Math.round((props.item.currentAmount / props.item.targetAmount) * 100))
})

const priorityText = computed(() => {
  const map = { 1: '高', 2: '中', 3: '低' }
  return map[props.item.priority as keyof typeof map] || '中'
})

const statusText = computed(() => {
  const map = { 0: '进行中', 1: '已实现', 2: '已放弃' }
  return map[props.item.status as keyof typeof map] || '进行中'
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const handleClick = () => {
  emit('click', props.item)
}

const handleDeposit = () => {
  emit('deposit', props.item)
}
</script>

<style lang="scss" scoped>
.wishlist-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .icon-wrapper {
      width: 80rpx;
      height: 80rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      
      .icon {
        font-size: 40rpx;
      }
    }
    
    .title-section {
      flex: 1;
      
      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #fff;
        margin-bottom: 10rpx;
        display: block;
      }
      
      .tags {
        display: flex;
        gap: 10rpx;
        
        .tag {
          font-size: 20rpx;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          
          &.priority-1 {
            background: #ff6b6b;
          }
          &.priority-2 {
            background: #fcc419;
            color: #333;
          }
          &.priority-3 {
            background: #51cf66;
          }
          
          &.status-0 {
            background: rgba(255, 255, 255, 0.2);
          }
          &.status-1 {
            background: #51cf66;
          }
          &.status-2 {
            background: #868e96;
          }
        }
      }
    }
  }
  
  .card-body {
    .progress-section {
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      
      .amount-info {
        margin-left: 30rpx;
        
        .current-amount {
          font-size: 36rpx;
          font-weight: bold;
          color: #ffd43b;
        }
        
        .target-amount {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
    
    .target-date {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  .card-footer {
    margin-top: 20rpx;
    
    .deposit-btn {
      width: 100%;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      background: rgba(255, 255, 255, 0.2);
      border: 2rpx solid rgba(255, 255, 255, 0.3);
      border-radius: 36rpx;
      color: #fff;
      font-size: 28rpx;
      
      &:active {
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>