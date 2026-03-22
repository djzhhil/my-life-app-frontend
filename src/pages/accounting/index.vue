<template>
  <view class="accounting-page">
    <!-- 顶部统计卡片 -->
    <view class="statistics-section">
      <StatCard
        title="收入"
        :value="statistics?.totalIncome || 0"
        icon="↓"
        color="#51cf66"
      />
      <StatCard
        title="支出"
        :value="statistics?.totalExpense || 0"
        icon="↑"
        color="#ff6b6b"
      />
      <StatCard
        title="余额"
        :value="statistics?.balance || 0"
        icon="¥"
        color="#667eea"
      />
    </view>

    <!-- 交易列表 -->
    <view class="transactions-section">
      <!-- 按日期分组 -->
      <view v-if="groupedTransactions.length > 0">
        <view v-for="group in groupedTransactions" :key="group.date" class="transaction-group">
          <!-- 日期标题 -->
          <view class="group-header">
            <text class="group-date">{{ formatDate(group.date) }}</text>
            <text class="group-income" v-if="group.groupIncome > 0">
              +{{ formatAmount(group.groupIncome) }}
            </text>
            <text class="group-expense" v-if="group.groupExpense > 0">
              -{{ formatAmount(group.groupExpense) }}
            </text>
          </view>

          <!-- 交易项 -->
          <view
            v-for="transaction in group.transactions"
            :key="transaction.id"
            class="transaction-item"
            @click="handleTransactionClick(transaction)"
          >
            <!-- 图标 -->
            <view
              class="transaction-icon"
              :style="{ backgroundColor: transaction.categoryColor }"
            >
              <text>{{ getDisplayIcon(transaction.categoryIcon) }}</text>
            </view>

            <!-- 信息 -->
            <view class="transaction-info">
              <view class="transaction-name">{{ transaction.categoryName }}</view>
              <view class="transaction-desc">
                {{ transaction.description || transaction.account }}
              </view>
            </view>

            <!-- 金额 -->
            <view
              class="transaction-amount"
              :class="{
                'transaction-amount--income': transaction.type === 1,
                'transaction-amount--expense': transaction.type === 2,
              }"
            >
              {{ transaction.type === 1 ? '+' : '-'
              }}{{ formatAmount(transaction.amount) }}
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!loading" class="empty-state">
        <text class="empty-icon">💰</text>
        <view class="empty-text">还没有记账记录</view>
        <view class="empty-desc">点击右下角按钮添加第一笔记账</view>
      </view>

      <!-- 加载中 -->
      <view v-else class="loading-state">
        <text>加载中...</text>
      </view>
    </view>

    <!-- FAB 添加按钮 -->
    <view class="fab-button" @click="handleAdd">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { useTransactionStore } from '@/store/transaction';
import { useUserStore } from '@/store/user';
import StatCard from '@/components/StatCard.vue';
import type { TransactionVO } from '@/types/api';

const transactionStore = useTransactionStore();
const userStore = useUserStore();

// 统计数据
const statistics = computed(() => transactionStore.statistics);
const loading = computed(() => transactionStore.loading);

// 防止重复跳转登录页的标记
const isNavigatingToLogin = ref(false);

// 格式化金额
function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

// 格式化日期
function formatDate(date: string): string {
  const today = new Date();
  const targetDate = new Date(date);

  const isToday =
    today.getDate() === targetDate.getDate() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getFullYear() === targetDate.getFullYear();

  if (isToday) {
    return '今天';
  }

  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();
  return `${month}月${day}日`;
}

// 回退图标：如果后端返回的不是 emoji，使用默认图标
function getDisplayIcon(icon: string): string {
  // 检查是否是 emoji（基本是 Unicode 编码）
  const emojiPattern = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  if (emojiPattern.test(icon)) {
    return icon;
  }
  // 如果不是 emoji，根据名称返回默认 emoji
  return '📦';
}

// 按日期分组交易
interface TransactionGroup {
  date: string;
  transactions: TransactionVO[];
  groupIncome: number;
  groupExpense: number;
}

const groupedTransactions = computed(() => {
  const transactions = transactionStore.transactions;
  const groups: Record<string, TransactionGroup> = {};

  transactions.forEach((transaction) => {
    const date = transaction.date.substring(0, 10);

    if (!groups[date]) {
      groups[date] = {
        date,
        transactions: [],
        groupIncome: 0,
        groupExpense: 0,
      };
    }

    groups[date].transactions.push(transaction);

    if (transaction.type === 1) {
      groups[date].groupIncome += transaction.amount;
    } else {
      groups[date].groupExpense += transaction.amount;
    }
  });

  // 转换为数组并按日期倒序
  return Object.values(groups).sort((a, b) => {
    return b.date.localeCompare(a.date);
  });
});

// 点击交易项
function handleTransactionClick(transaction: TransactionVO) {
  uni.showActionSheet({
    itemList: ['编辑', '删除'],
    success: async (res) => {
      if (res.tapIndex === 0) {
        // 编辑
        uni.navigateTo({
          url: `/pages/accounting/add?id=${transaction.id}`,
        });
      } else if (res.tapIndex === 1) {
        // 删除
        uni.showModal({
          title: '确认删除',
          content: '确定要删除这条记账记录吗？',
          success: async (modalRes) => {
            if (modalRes.confirm) {
              uni.showLoading({ title: '删除中...' });
              const success = await transactionStore.deleteTransaction(transaction.id);
              uni.hideLoading();
              if (success) {
                uni.showToast({ title: '删除成功', icon: 'success' });
              } else {
                uni.showToast({ title: '删除失败', icon: 'none' });
              }
            }
          },
        });
      }
    },
  });
}

// 点击添加按钮
function handleAdd() {
  uni.navigateTo({
    url: '/pages/accounting/add',
  });
}

// 加载数据
async function loadData() {
  try {
    // 检查登录状态
    if (!userStore.isLoggedIn()) {
      uni.showToast({
        title: '请先登录',
        icon: 'none',
      });
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/login/login' });
      }, 1500);
      return;
    }
    
    await transactionStore.fetchTransactions();
    await transactionStore.fetchStatistics();
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

onMounted(() => {
  loadData();
});

// 页面显示时重新加载数据（从添加页面返回时）
onShow(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.accounting-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32rpx 24rpx;
  padding-bottom: 160rpx;
}

// 统计卡片
.statistics-section {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;

  view {
    flex: 1;
  }
}

// 交易列表
.transactions-section {
  min-height: 400rpx;
}

.transaction-group {
  margin-bottom: 32rpx;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.group-date {
  font-weight: 500;
}

.group-income {
  color: #51cf66;
  margin-left: 16rpx;
}

.group-expense {
  color: #ff6b6b;
  margin-left: 8rpx;
}

.transaction-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.transaction-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #fff;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.transaction-info {
  flex: 1;
  min-width: 0;
}

.transaction-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.transaction-desc {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.transaction-amount {
  font-size: 32rpx;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 16rpx;

  &--income {
    color: #51cf66;
  }

  &--expense {
    color: #ff6b6b;
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
}

.empty-text {
  font-size: 28rpx;
  margin-bottom: 16rpx;
  color: rgba(255, 255, 255, 0.8);
}

.empty-desc {
  font-size: 24rpx;
}

// 加载中
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
  color: rgba(255, 255, 255, 0.6);
}

// FAB 按钮
.fab-button {
  position: fixed;
  right: 48rpx;
  bottom: 100rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
  z-index: 100;
}

.fab-icon {
  color: #fff;
  font-size: 64rpx;
  font-weight: 300;
  line-height: 1;
}
</style>
