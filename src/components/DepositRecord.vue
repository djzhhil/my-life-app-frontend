<template>
  <view class="deposit-record">
    <view class="record-item" v-for="(record, index) in records" :key="record.id">
      <view class="timeline-dot"></view>
      <view class="record-content">
        <view class="record-header">
          <text class="amount">+{{ record.amount }} 金币</text>
          <text class="date">{{ formatDate(record.createdAt) }}</text>
        </view>
        <text class="note" v-if="record.note">{{ record.note }}</text>
      </view>
    </view>

    <view class="empty-state" v-if="!records || records.length === 0">
      <text class="empty-text">暂无存钱记录</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Deposit } from '@/api/wishlist'

defineProps<{
  records: Deposit[]
}>()

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<style lang="scss" scoped>
.deposit-record {
  padding: 20rpx 0;

  .record-item {
    display: flex;
    align-items: flex-start;
    padding: 20rpx 0;
    position: relative;

    &:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 16rpx;
      top: 50rpx;
      bottom: 0;
      width: 2rpx;
      background: #e9ecef;
    }

    .timeline-dot {
      width: 34rpx;
      height: 34rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      margin-right: 20rpx;
      margin-top: 6rpx;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .record-content {
      flex: 1;
      background: #f8f9fa;
      border-radius: 16rpx;
      padding: 20rpx;

      .record-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .amount {
          font-size: 32rpx;
          font-weight: bold;
          color: #51cf66;
        }

        .date {
          font-size: 24rpx;
          color: #868e96;
        }
      }

      .note {
        font-size: 26rpx;
        color: #495057;
      }
    }
  }

  .empty-state {
    padding: 60rpx 0;
    text-align: center;

    .empty-text {
      font-size: 28rpx;
      color: #adb5bd;
    }
  }
}
</style>
