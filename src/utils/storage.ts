/**
 * 本地存储封装
 */

import { STORAGE_KEYS } from '@/types/common';

// ==================== Token 存储 ====================

export function setToken(token: string): void {
  uni.setStorageSync(STORAGE_KEYS.TOKEN, token);
}

export function getToken(): string {
  return uni.getStorageSync(STORAGE_KEYS.TOKEN) || '';
}

export function removeToken(): void {
  uni.removeStorageSync(STORAGE_KEYS.TOKEN);
}

// ==================== 用户信息存储 ====================

export function setUserInfo(userInfo: Record<string, any>): void {
  uni.setStorageSync(STORAGE_KEYS.USER, JSON.stringify(userInfo));
}

export function getUserInfo(): Record<string, any> | null {
  const userStr = uni.getStorageSync(STORAGE_KEYS.USER);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function removeUserInfo(): void {
  uni.removeStorageSync(STORAGE_KEYS.USER);
}

// ==================== 清除所有本地数据 ====================

export function clearAll(): void {
  removeToken();
  removeUserInfo();
}

// ==================== 判断是否已登录 ====================

export function isLoggedIn(): boolean {
  return !!getToken();
}