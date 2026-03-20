/**
 * 用户状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { userApi } from '@/api/user';
import { setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/storage';
import { User, UserVO } from '@/types/api';

// 用户信息类型（不含密码）
interface UserInfo {
  id: number;
  username: string;
  level: number;
  exp: number;
  coin: number;
  createdAt: string;
  updatedAt: string;
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<UserInfo | null>(null);
  const token = ref<string>('');
  const loading = ref(false);

  // 初始化（从本地存储恢复）
  function init() {
    const storedToken = uni.getStorageSync('mylife_token') || '';
    const storedUser = uni.getStorageSync('mylife_user');
    
    token.value = storedToken;
    if (storedUser) {
      try {
        userInfo.value = JSON.parse(storedUser);
      } catch {
        userInfo.value = null;
      }
    }
  }

  // 登录
  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true;
    try {
      const res = await userApi.login({ username, password });
      
      // 存储 Token
      token.value = res.token;
      setToken(res.token);

      // 获取用户信息
      await fetchUserInfo();
      
      return true;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 注册
  async function register(username: string, password: string): Promise<boolean> {
    loading.value = true;
    try {
      await userApi.register({ username, password });
      return true;
    } catch (error) {
      console.error('注册失败:', error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  // 获取用户信息
  async function fetchUserInfo(): Promise<void> {
    if (!token.value) return;

    try {
      const user = await userApi.getUserInfo();
      // 过滤掉密码字段
      const { password, ...userData } = user;
      userInfo.value = userData;
      setUserInfo(userData);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  }

  // 退出登录
  function logout(): void {
    token.value = '';
    userInfo.value = null;
    removeToken();
    removeUserInfo();
  }

  // 检查是否已登录
  function isLoggedIn(): boolean {
    return !!token.value;
  }

  return {
    userInfo,
    token,
    loading,
    init,
    login,
    register,
    fetchUserInfo,
    logout,
    isLoggedIn,
  };
});