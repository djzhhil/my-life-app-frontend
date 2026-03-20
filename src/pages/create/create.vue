<template>
  <view class="create-container">
    <view class="create-card">
      <view class="form-title">创建新任务</view>

      <view class="form-item">
        <text class="form-label">任务标题 <text class="required">*</text></text>
        <input
          v-model="form.title"
          class="form-input"
          type="text"
          placeholder="请输入任务标题（1-100字符）"
          maxlength="100"
        />
      </view>

      <view class="form-item">
        <text class="form-label">任务描述</text>
        <textarea
          v-model="form.description"
          class="form-textarea"
          placeholder="请输入任务描述（可选，0-500字符）"
          maxlength="500"
          rows="4"
        />
      </view>

      <view class="form-item">
        <text class="form-label">经验奖励 <text class="required">*</text></text>
        <view class="reward-input">
          <button class="reward-btn" @click="decreaseExp">-</button>
          <input
            v-model.number="form.expReward"
            class="reward-value"
            type="number"
          />
          <button class="reward-btn" @click="increaseExp">+</button>
        </view>
        <text class="form-hint">范围：1-10000</text>
      </view>

      <view class="form-item">
        <text class="form-label">金币奖励 <text class="required">*</text></text>
        <view class="reward-input">
          <button class="reward-btn" @click="decreaseCoin">-</button>
          <input
            v-model.number="form.coinReward"
            class="reward-value"
            type="number"
          />
          <button class="reward-btn" @click="increaseCoin">+</button>
        </view>
        <text class="form-hint">范围：1-10000</text>
      </view>

      <view class="preview-card">
        <text class="preview-title">任务预览</text>
        <view class="preview-item">
          <text>💎 总经验奖励：</text>
          <text class="preview-value">{{ form.expReward }}</text>
        </view>
        <view class="preview-item">
          <text>🪙 总金币奖励：</text>
          <text class="preview-value">{{ form.coinReward }}</text>
        </view>
      </view>

      <button class="submit-btn" :loading="loading" @click="handleSubmit">
        创建任务
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTaskStore } from '@/store/task';
import { ROUTES } from '@/types/common';

const taskStore = useTaskStore();

const form = reactive({
  title: '',
  description: '',
  expReward: 100,
  coinReward: 100,
});

const loading = ref(false);

function decreaseExp() {
  if (form.expReward > 1) form.expReward -= 10;
}

function increaseExp() {
  if (form.expReward < 10000) form.expReward += 10;
}

function decreaseCoin() {
  if (form.coinReward > 1) form.coinReward -= 10;
}

function increaseCoin() {
  if (form.coinReward < 10000) form.coinReward += 10;
}

function validate(): boolean {
  const title = form.title.trim();
  if (!title) {
    uni.showToast({ title: '请输入任务标题', icon: 'none' });
    return false;
  }
  if (title.length < 1 || title.length > 100) {
    uni.showToast({ title: '任务标题需1-100字符', icon: 'none' });
    return false;
  }
  if (form.expReward < 1 || form.expReward > 10000) {
    uni.showToast({ title: '经验奖励需1-10000', icon: 'none' });
    return false;
  }
  if (form.coinReward < 1 || form.coinReward > 10000) {
    uni.showToast({ title: '金币奖励需1-10000', icon: 'none' });
    return false;
  }
  return true;
}

async function handleSubmit() {
  if (!validate()) return;

  loading.value = true;
  const success = await taskStore.createTask(
    form.title,
    form.description,
    form.expReward,
    form.coinReward
  );
  loading.value = false;

  if (success) {
    uni.showToast({ title: '创建成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  } else {
    uni.showToast({ title: '创建失败', icon: 'none' });
  }
}
</script>

<style lang="scss" scoped>
.create-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24rpx;
}

.create-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 32rpx;
  text-align: center;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  display: block;
  margin-bottom: 12rpx;

  .required {
    color: #f44336;
  }
}

.form-input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.form-hint {
  font-size: 22rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.reward-input {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12rpx;
  overflow: hidden;
}

.reward-btn {
  width: 88rpx;
  height: 88rpx;
  background: #667eea;
  color: #fff;
  font-size: 40rpx;
  border: none;
  border-radius: 0;
  line-height: 88rpx;
  padding: 0;

  &:active {
    background: #5a6fd6;
  }
}

.reward-value {
  flex: 1;
  height: 88rpx;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.preview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12rpx;
  padding: 24rpx;
  margin: 32rpx 0;
  color: #fff;
}

.preview-title {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  padding: 8rpx 0;
}

.preview-value {
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  margin-top: 16rpx;
}
</style>