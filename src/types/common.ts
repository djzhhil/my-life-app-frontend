/**
 * 通用类型定义
 */

// ==================== 任务状态 ====================

export { TaskStatus } from './api';

// ==================== 用户信息（不含密码） ====================

/**
 * 用户信息（不含密码，用于前端存储和展示）
 */
export interface UserInfo {
  id: number;
  username: string;
  level: number;
  exp: number;
  coin: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== 分页相关 ====================

/**
 * 分页参数
 */
export interface PageParams {
  pageNum?: number;
  pageSize?: number;
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// ==================== 任务筛选 ====================

export type TaskFilter = 'all' | 'pending' | 'done';

// ==================== API 错误 ====================

/**
 * API 错误信息
 */
export interface ApiError {
  code: number;
  message: string;
}

// ==================== 本地存储键 ====================

export const STORAGE_KEYS = {
  TOKEN: 'mylife_token',
  USER: 'mylife_user',
} as const;

// ==================== 路由配置 ====================

export const ROUTES = {
  LOGIN: '/pages/login/login',
  REGISTER: '/pages/register/register',
  INDEX: '/pages/index/index',
  CREATE: '/pages/create/create',
  MINE: '/pages/mine/mine',
} as const;

// ==================== 主题配置 ====================

export const THEME = {
  PRIMARY: '#1989fa',
  SUCCESS: '#07c160',
  WARNING: '#f2826a',
  DANGER: '#ee0a24',
  GRAY: '#969799',
} as const;