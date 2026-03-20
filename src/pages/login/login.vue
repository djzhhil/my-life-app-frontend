<template>
  <view class="login-container">
    <view class="login-card">
      <view class="login-header">
        <text class="login-title">欢迎回来</text>
        <text class="login-subtitle">MyLife 任务管理</text>
      </view>

      <view class="login-form">
        <view class="form-item">
          <text class="form-label">用户名</text>
          <input
            v-model="form.username"
            class="form-input"
            type="text"
            placeholder="请输入用户名"
            maxlength="20"
          />
        </view>

        <view class="form-item">
          <text class="form-label">密码</text>
          <input
            v-model="form.password"
            class="form-input"
            type="password"
            placeholder="请输入密码"
            maxlength="30"
          />
        </view>

        <button class="login-btn" :loading="loading" @click="handleLogin">
          登录
        </button>

        <view class="login-footer">
          <text>还没有账号？</text>
          <text class="link" @click="goToRegister">立即注册</text>
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
});

const loading = ref(false);

function validate(): boolean {
  if (!form.username.trim()) {
    uni.showToast({ title: '请输入用户名', icon: 'none' });
    return false;
  }
  if (form.username.length < 2) {
    uni.showToast({ title: '用户名至少2个字符', icon: 'none' });
    return false;
  }
  if (!form.password.trim()) {
    uni.showToast({ title: '请输入密码', icon: 'none' });
    return false;
  }
  if (form.password.length < 6) {
    uni.showToast({ title: '密码至少6个字符', icon: 'none' });
    return false;
  }
  return true;
}

async function handleLogin() {
  if (!validate()) return;

  loading.value = true;
  const success = await userStore.login(form.username, form.password);
  loading.value = false;

  if (success) {
    uni.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => {
      uni.reLaunch({ url: ROUTES.INDEX });
    }, 1000);
  } else {
    uni.showToast({ title: '登录失败，请检查用户名和密码', icon: 'none' });
  }
}

function goToRegister() {
  uni.navigateTo({ url: ROUTES.REGISTER });
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.login-card {
  width: 100%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 48rpx;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 48rpx;
}

.login-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #333;
  display: block;
  margin-bottom: 16rpx;
}

.login-subtitle {
  font-size: 28rpx;
  color: #999;
}

.login-form {
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

    &:focus {
      outline: none;
    }
  }
}

.login-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  border: none;
  margin-top: 24rpx;
  cursor: pointer;

  &:active {
    opacity: 0.9;
  }
}

.login-footer {
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