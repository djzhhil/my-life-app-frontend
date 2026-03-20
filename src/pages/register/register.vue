<template>
  <view class="register-container">
    <view class="register-card">
      <view class="register-header">
        <text class="register-title">创建账号</text>
        <text class="register-subtitle">加入 MyLife 任务管理</text>
      </view>

      <view class="register-form">
        <view class="form-item">
          <text class="form-label">用户名</text>
          <input
            v-model="form.username"
            class="form-input"
            type="text"
            placeholder="2-20个字符"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="form-label">密码</text>
          <input
            v-model="form.password"
            class="form-input"
            type="password"
            placeholder="6-30个字符"
            maxlength="30"
          />
        </view>

        <view class="form-item">
          <text class="form-label">确认密码</text>
          <input
            v-model="form.confirmPassword"
            class="form-input"
            type="password"
            placeholder="请再次输入密码"
            maxlength="30"
          />
        </view>

        <button class="register-btn" :loading="loading" @click="handleRegister">
          注册
        </button>

        <view class="register-footer">
          <text>已有账号？</text>
          <text class="link" @click="goToLogin">立即登录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useUserStore } from '@/store/user';
import { ROUTES } from '@/types/common';

const userStore = useUserStore();

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);

function validate(): boolean {
  const username = form.username.trim();
  const password = form.password.trim();
  const confirmPassword = form.confirmPassword.trim();

  if (!username) {
    uni.showToast({ title: '请输入用户名', icon: 'none' });
    return false;
  }
  if (username.length < 2 || username.length > 20) {
    uni.showToast({ title: '用户名需2-20个字符', icon: 'none' });
    return false;
  }
  if (!password) {
    uni.showToast({ title: '请输入密码', icon: 'none' });
    return false;
  }
  if (password.length < 6 || password.length > 30) {
    uni.showToast({ title: '密码需6-30个字符', icon: 'none' });
    return false;
  }
  if (password !== confirmPassword) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' });
    return false;
  }
  return true;
}

async function handleRegister() {
  if (!validate()) return;

  loading.value = true;
  const success = await userStore.register(form.username, form.password);
  loading.value = false;

  if (success) {
    uni.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => {
      uni.navigateTo({ url: ROUTES.LOGIN });
    }, 1000);
  } else {
    uni.showToast({ title: '注册失败', icon: 'none' });
  }
}

function goToLogin() {
  uni.navigateBack();
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.register-card {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 48rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.register-header {
  text-align: center;
  margin-bottom: 48rpx;
}

.register-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.register-subtitle {
  font-size: 28rpx;
  color: #999;
}

.register-form {
  .form-item {
    margin-bottom: 32rpx;
  }

  .form-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    display: block;
    margin-bottom: 12rpx;
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
}

.register-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  margin-top: 24rpx;
}

.register-footer {
  text-align: center;
  margin-top: 48rpx;
  font-size: 28rpx;
  color: #999;

  .link {
    color: #667eea;
    margin-left: 8rpx;
    font-weight: 500;
  }
}
</style>