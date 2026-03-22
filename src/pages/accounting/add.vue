<template>
  <view class="add-accounting-page">
    <!-- 类型选择 -->
    <view class="type-selector">
      <view
        :class="['type-tab', { active: form.type === 1 }]"
        @click="handleTypeChange(1)"
      >
        <text>收入</text>
      </view>
      <view
        :class="['type-tab', { active: form.type === 2 }]"
        @click="handleTypeChange(2)"
      >
        <text>支出</text>
      </view>
    </view>

    <!-- 金额输入 -->
    <view class="amount-section">
      <text class="amount-label">金额</text>
      <view class="amount-input-wrapper">
        <text class="amount-symbol">¥</text>
        <input
          class="amount-input"
          v-model="form.amount"
          type="digit"
          placeholder="0.00"
          @input="handleAmountInput"
        />
      </view>
    </view>

    <!-- 分类选择 -->
    <view class="section">
      <view class="section-title">选择分类</view>
      <view class="category-grid">
        <view
          v-for="category in currentCategories"
          :key="category.id"
          :class="['category-item', { active: form.categoryId === category.id }]"
          @click="handleCategoryClick(category)"
        >
          <view
            class="category-icon"
            :style="{ backgroundColor: category.color }"
          >
            <text>{{ category.icon }}</text>
          </view>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </view>
    </view>

    <!-- 账户选择 -->
    <view class="section">
      <view class="section-title">支付方式</view>
      <view class="account-list">
        <view
          v-for="account in accountTypes"
          :key="account.value"
          :class="['account-item', { active: form.account === account.value }]"
          @click="form.account = account.value"
        >
          <text class="account-icon">{{ account.icon }}</text>
          <text class="account-name">{{ account.name }}</text>
          <text
            v-if="form.account === account.value"
            class="account-check"
          >
            ✓
          </text>
        </view>
      </view>
    </view>

    <!-- 日期选择 -->
    <view class="section">
      <view class="section-title">交易日期</view>
      <picker mode="date" :value="form.date" @change="handleDateChange">
        <view class="picker-field">
          <text>{{ formatDate(form.date) }}</text>
          <text class="picker-arrow">›</text>
        </view>
      </picker>
    </view>

    <!-- 备注输入 -->
    <view class="section">
      <view class="section-title">备注（可选）</view>
      <textarea
        class="textarea-field"
        v-model="form.description"
        placeholder="添加备注信息..."
        :maxlength="100"
      />
    </view>

    <!-- 保存按钮 -->
    <view class="save-button" @click="handleSave">
      <text>{{ isEditing ? '保存修改' : '确认添加' }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTransactionStore } from '@/store/transaction';
import { TransactionType } from '@/types/api';

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: number;
}

interface AccountType {
  value: string;
  name: string;
  icon: string;
}

const transactionStore = useTransactionStore();

// 默认分类数据
const defaultCategories: Category[] = [
  // 收入分类
  {
    id: 1,
    name: '工资',
    icon: '💰',
    color: '#51cf66',
    type: 1,
  },
  {
    id: 2,
    name: '奖金',
    icon: '🎁',
    color: '#51cf66',
    type: 1,
  },
  {
    id: 3,
    name: '投资',
    icon: '📈',
    color: '#51cf66',
    type: 1,
  },
  {
    id: 4,
    name: '其他',
    icon: '📦',
    color: '#51cf66',
    type: 1,
  },
  // 支出分类
  {
    id: 5,
    name: '餐饮',
    icon: '🍜',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 6,
    name: '交通',
    icon: '🚗',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 7,
    name: '购物',
    icon: '🛍️',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 8,
    name: '娱乐',
    icon: '🎮',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 9,
    name: '医疗',
    icon: '💊',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 10,
    name: '教育',
    icon: '📚',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 11,
    name: '生活',
    icon: '🏠',
    color: '#ff6b6b',
    type: 2,
  },
  {
    id: 12,
    name: '其他',
    icon: '📦',
    color: '#ff6b6b',
    type: 2,
  },
];

// 账户类型
const accountTypes: AccountType[] = [
  { value: '支付宝', name: '支付宝', icon: '💳' },
  { value: '微信', name: '微信', icon: '💬' },
  { value: '现金', name: '现金', icon: '💵' },
  { value: '银行卡', name: '银行卡', icon: '🏦' },
];

// 表单数据
const form = ref({
  type: 2, // 1=收入, 2=支出
  amount: '',
  categoryId: 5, // 默认选中第一个支出分类
  description: '',
  account: '支付宝',
  date: '',
});

// 编辑模式
const isEditing = ref(false);
const editId = ref<number | null>(null);

// 当前显示的分类
const currentCategories = computed(() => {
  return defaultCategories.filter(cat => cat.type === form.value.type);
});

// 格式化日期
function formatDate(date: string): string {
  if (!date) return '选择日期';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 类型切换
function handleTypeChange(type: number) {
  form.value.type = type;

  // 切换类型时，重置金额
  form.value.amount = '';

  // 切换类型时，选择该类型的第一个分类
  const firstCategory = currentCategories.value[0];
  if (firstCategory) {
    form.value.categoryId = firstCategory.id;
  }
}

// 金额输入处理
function handleAmountInput(e: any) {
  let value = e.detail.value;

  // 只保留数字和小数点
  value = value.replace(/[^\d.]/g, '');

  // 限制最多两位小数
  if (value.includes('.')) {
    const parts = value.split('.');
    parts[1] = parts[1].substring(0, 2);
    value = parts.join('.');
  }

  form.value.amount = value;
}

// 分类点击
function handleCategoryClick(category: Category) {
  form.value.categoryId = category.id;
}

// 日期选择
function handleDateChange(e: any) {
  form.value.date = e.detail.value;
}

// 保存
async function handleSave() {
  // 表单验证
  if (!form.value.amount || parseFloat(form.value.amount) <= 0) {
    uni.showToast({
      title: '请输入有效金额',
      icon: 'none',
    });
    return;
  }

  if (form.value.categoryId === null) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none',
    });
    return;
  }

  if (!form.value.date) {
    uni.showToast({
      title: '请选择日期',
      icon: 'none',
    });
    return;
  }

  uni.showLoading({
    title: isEditing.value ? '保存中...' : '添加中...',
  });

  try {
    const data = {
      type: form.value.type,
      amount: parseFloat(form.value.amount),
      categoryId: form.value.categoryId,
      description: form.value.description || '',
      account: form.value.account,
      date: form.value.date,
    };

    let success = false;

    if (isEditing.value && editId.value) {
      // 更新交易（暂时不支持，因为 store 的 updateTransaction 需要完整数据）
      uni.hideLoading();
      uni.showToast({
        title: '编辑功能暂未实现',
        icon: 'none',
      });
      return;
    } else {
      // 创建交易
      success = await transactionStore.createTransaction(data);
    }

    uni.hideLoading();

    if (success) {
      uni.showToast({
        title: isEditing.value ? '保存成功' : '添加成功',
        icon: 'success',
      });

      // 返回列表页
      setTimeout(() => {
        uni.navigateBack();
      }, 1500);
    } else {
      uni.showToast({
        title: isEditing.value ? '保存失败' : '添加失败',
        icon: 'none',
      });
    }
  } catch (error) {
    uni.hideLoading();
    uni.showToast({
      title: '操作失败',
      icon: 'none',
    });
  }
}

// 初始化
onMounted(() => {
  // 设置默认日期为今天
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  form.value.date = `${year}-${month}-${day}`;

  // 检查是否为编辑模式
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1] as any;
  const options = currentPage.options || {};

  if (options.id) {
    isEditing.value = true;
    editId.value = parseInt(options.id);
    // TODO: 加载交易数据进行编辑
    uni.showToast({
      title: '编辑功能暂未实现',
      icon: 'none',
    });
  }
});
</script>

<style lang="scss" scoped>
.add-accounting-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100rpx;
}

// 类型选择
.type-selector {
  display: flex;
  background: #fff;
  margin-bottom: 24rpx;
}

.type-tab {
  flex: 1;
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  color: #999;
  position: relative;
  transition: all 0.3s;

  &.active {
    color: #667eea;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80rpx;
      height: 4rpx;
      background: #667eea;
      border-radius: 2rpx;
    }
  }
}

// 金额输入
.amount-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24rpx;
}

.amount-input-wrapper {
  display: flex;
  align-items: baseline;
}

.amount-symbol {
  font-size: 64rpx;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  margin-right: 8rpx;
}

.amount-input {
  font-size: 96rpx;
  color: #fff;
  font-weight: 600;
  flex: 1;
}

.amount-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

// 通用区块
.section {
  background: #fff;
  margin-bottom: 24rpx;
  padding: 32rpx;
}

.section-title {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 24rpx;
}

// 分类网格
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rpx 8rpx;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s;

  &.active {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
  }
}

.category-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.category-name {
  font-size: 24rpx;
  color: #666;
}

// 账户列表
.account-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid #f0f0f0;
  background: #fafafa;
  transition: all 0.2s;

  &.active {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
}

.account-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.account-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.account-check {
  font-size: 40rpx;
  color: #667eea;
  font-weight: 600;
}

// 选择器字段
.picker-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #fafafa;
  font-size: 28rpx;
  color: #333;
}

.picker-arrow {
  font-size: 48rpx;
  color: #999;
  font-weight: 300;
}

// 文本框
.textarea-field {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  border-radius: 16rpx;
  background: #fafafa;
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
  box-sizing: border-box;
}

.textarea-field::placeholder {
  color: #ccc;
}

// 保存按钮
.save-button {
  margin: 48rpx 32rpx 0;
  padding: 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
}
</style>
