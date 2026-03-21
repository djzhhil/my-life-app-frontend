/**
 * 请求封装（更新版）
 * 基于 uni.request 封装
 * 添加 JWT 认证、401 自动登出等功能
 */

import { Result } from '@/types/api';
import { getToken, setToken, removeToken } from './storage';

const BASE_URL = 'http://localhost:8080';

// 请求配置
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  showLoading?: boolean;  // 是否显示加载中
  showError?: boolean;   // 是否显示错误提示
}

// 封装请求方法
export function request<T = any>(options: RequestOptions): Promise<T> {
  // 显示加载中
  if (options.showLoading !== false) {
    uni.showLoading({ title: '加载中...', mask: true });
  }

  return new Promise((resolve, reject) => {
    const token = getToken();

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.header,
      },
      success: (res) => {
        const data = res.data as any;

        // 401 未授权，自动登出
        if (res.statusCode === 401) {
          removeToken();
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
          });

          // 跳转到登录页
          setTimeout(() => {
            uni.redirectTo({ url: '/pages/login/login' });
          }, 1500);

          reject(new Error('未授权'));
          return;
        }

        // 其他 HTTP 错误
        if (res.statusCode !== 200) {
          if (options.showError !== false) {
            uni.showToast({
              title: `请求失败 (${res.statusCode})`,
              icon: 'none',
            });
          }
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        // 检查是否是 Result 格式（有 code 和 message 字段）
        if (data.code !== undefined && data.message !== undefined) {
          if (data.code === 200) {
            // 成功返回 data
            resolve(data.data);
          } else {
            // 业务错误
            if (options.showError !== false) {
              uni.showToast({
                title: data.message || '请求失败',
                icon: 'none',
              });
            }
            reject(new Error(data.message || '请求失败'));
          }
        } else {
          // 直接返回数据（如 /task/list 返回 Task[]）
          resolve(data);
        }
      },
      fail: (err) => {
        // 网络错误
        if (options.showError !== false) {
          uni.showToast({
            title: '网络错误，请检查网络连接',
            icon: 'none',
          });
        }
        reject(err);
      },
      complete: () => {
        // 隐藏加载中
        uni.hideLoading();
      },
    });
  });
}

// GET 请求快捷方法
export function get<T = any>(url: string, params?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({
    url,
    method: 'GET',
    data: params,
    ...options,
  });
}

// POST 请求快捷方法
export function post<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({
    url,
    method: 'POST',
    data,
    ...options,
  });
}

// PUT 请求快捷方法
export function put<T = any>(url: string, data?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({
    url,
    method: 'PUT',
    data,
    ...options,
  });
}

// DELETE 请求快捷方法
export function del<T = any>(url: string, params?: any, options?: Partial<RequestOptions>): Promise<T> {
  return request<T>({
    url,
    method: 'DELETE',
    data: params,
    ...options,
  });
}

// 导出 BASE_URL（方便其他模块使用）
export { BASE_URL };
