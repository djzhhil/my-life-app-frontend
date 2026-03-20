/**
 * 请求封装
 * 基于 uni.request 封装
 */

import { Result } from '@/types/api';
import { getToken } from './storage';

const BASE_URL = 'http://localhost:8080';

// 请求配置
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
}

// 封装请求方法
export function request<T = any>(options: RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    const token = getToken();

    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token,
        ...options.header,
      },
      success: (res) => {
        const data = res.data as any;

        // 检查是否是 Result 格式（有 code 和 message 字段）
        if (data.code !== undefined && data.message !== undefined) {
          if (data.code === 200) {
            // 成功返回 data
            resolve(data.data);
          } else {
            // 业务错误
            uni.showToast({
              title: data.message || '请求失败',
              icon: 'none',
            });
            reject(new Error(data.message || '请求失败'));
          }
        } else {
          // 直接返回数据（如 /task/list 返回 Task[]）
          resolve(data);
        }
      },
      fail: (err) => {
        // 网络错误
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
}

// GET 请求快捷方法
export function get<T = any>(url: string, params?: any): Promise<T> {
  return request<T>({
    url,
    method: 'GET',
    data: params,
  });
}

// POST 请求快捷方法
export function post<T = any>(url: string, data?: any): Promise<T> {
  return request<T>({
    url,
    method: 'POST',
    data,
  });
}

// 导出 BASE_URL（方便其他模块使用）
export { BASE_URL };