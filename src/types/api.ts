/**
 * API 类型定义（修复版）
 * 基于后端接口文档 - Phase 1-6 完整版
 */

// ==================== 统一响应格式 ====================

/**
 * 统一响应格式
 */
export interface Result<T = any> {
  code: number; // 200=成功, 400=参数错误, 500=服务器错误
  message: string; // 响应消息
  data: T | null; // 响应数据
}

// ==================== 请求 DTO ====================

/**
 * 用户注册请求 DTO
 */
export interface UserRegisterDTO {
  username: string; // 2-20 字符
  password: string; // 6-30 字符
}

/**
 * 用户登录请求 DTO
 */
export interface UserLoginDTO {
  username: string;
  password: string;
}

/**
 * 创建任务请求 DTO
 */
export interface TaskCreateDTO {
  title: string; // 1-100 字符
  description?: string; // 可选，0-500 字符
  expReward: number; // 1-10000
  coinReward: number; // 1-10000
  category?: number; // 0-5: 通用,学习,工作,运动,生活,创意
  priority?: number; // 1-3: 高,中,低
  dueDate?: string; // 截止日期 (yyyy-MM-dd)
}

/**
 * 任务更新请求 DTO
 */
export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  expReward?: number;
  coinReward?: number;
  category?: number;
  priority?: number;
  dueDate?: string;
}

/**
 * 创建分类请求 DTO
 */
export interface CategoryCreateDTO {
  name: string; // 分类名称
  icon?: string; // 图标
  color?: string; // 颜色（十六进制）
  type: number; // 1=收入, 2=支出
}

/**
 * 创建交易记录请求 DTO（修复版）
 */
export interface TransactionCreateDTO {
  type: number; // 1=收入, 2=支出
  amount: number; // 金额
  categoryId: number; // 分类ID
  description?: string; // 备注
  account: string; // 账户
  date: string; // 交易日期 (yyyy-MM-dd)
}

/**
 * 创建心愿请求 DTO
 */
export interface WishlistCreateDTO {
  title: string; // 心愿标题
  description?: string; // 心愿描述
  targetAmount: number; // 目标金额
  icon?: string; // 图标
  color?: string; // 颜色
  priority?: number; // 优先级 1=高, 2=中, 3=低
  targetDate?: string; // 目标日期 (yyyy-MM-dd)
}

/**
 * 存入金币请求 DTO
 */
export interface DepositDTO {
  wishlistId: number; // 心愿ID
  amount: number; // 存入金额
  note?: string; // 备注
}

// ==================== 响应 VO ====================

/**
 * 用户注册响应 VO（不含 password）
 */
export interface UserVO {
  id: number;
  username: string;
  level: number;
  exp: number;
  coin: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 登录响应 VO
 */
export interface TokenVO {
  token: string; // UUID 格式
}

/**
 * 任务响应 VO
 */
export interface TaskVO {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  expReward: number;
  coinReward: number;
  status: number; // 0=待完成, 1=已完成
  category: number; // 0-5
  priority: number; // 1-3
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

/**
 * 分类响应 VO
 */
export interface CategoryVO {
  id: number;
  userId: number;
  name: string;
  type: number; // 1=收入, 2=支出
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 交易记录响应 VO（修复版）
 */
export interface TransactionVO {
  id: number;
  userId: number;
  type: number; // 1=收入, 2=支出
  amount: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  description: string;
  account: string;
  date: string; // 修复：从 transactionDate 改为 date
  createdAt: string;
}

/**
 * 心愿响应 VO
 */
export interface WishlistVO {
  id: number;
  userId: number;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  progress: number; // 进度百分比
  icon: string;
  color: string;
  priority: number;
  priorityName: string;
  status: number;
  statusName: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

/**
 * 存钱记录
 */
export interface WishlistDeposit {
  id: number;
  wishlistId: number;
  userId: number;
  amount: number;
  note: string;
  createdAt: string;
}

/**
 * 交易统计 VO
 */
export interface TransactionStatisticsVO {
  income: number; // 总收入
  expense: number; // 总支出
  balance: number; // 余额
  count: number; // 交易笔数
  categoryStats: CategoryStatisticVO[]; // 分类统计
  dailyStats: DailyStatisticVO[]; // 日期统计
}

/**
 * 分类统计
 */
export interface CategoryStatisticVO {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  type: number;
  amount: number;
  count: number;
}

/**
 * 日期统计
 */
export interface DailyStatisticVO {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

// ==================== 实体类 ====================

/**
 * 用户实体
 */
export interface User {
  id: number;
  username: string;
  level: number;
  exp: number;
  coin: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 任务实体
 */
export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  expReward: number;
  coinReward: number;
  status: number; // 0=待完成, 1=已完成
  category: number;
  priority: number;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

// ==================== 枚举类型 ====================

/**
 * 任务分类枚举
 */
export enum TaskCategory {
  GENERAL = 0, // 通用
  STUDY = 1,   // 学习
  WORK = 2,    // 工作
  EXERCISE = 3, // 运动
  LIFE = 4,    // 生活
  CREATIVE = 5, // 创意
}

export const TASK_CATEGORY_NAMES: Record<TaskCategory, string> = {
  [TaskCategory.GENERAL]: '通用',
  [TaskCategory.STUDY]: '学习',
  [TaskCategory.WORK]: '工作',
  [TaskCategory.EXERCISE]: '运动',
  [TaskCategory.LIFE]: '生活',
  [TaskCategory.CREATIVE]: '创意',
};

/**
 * 任务分类图标映射
 */
export const TASK_CATEGORY_ICONS: Record<TaskCategory, string> = {
  [TaskCategory.GENERAL]: '📌',
  [TaskCategory.STUDY]: '📚',
  [TaskCategory.WORK]: '💼',
  [TaskCategory.EXERCISE]: '🏃',
  [TaskCategory.LIFE]: '🏠',
  [TaskCategory.CREATIVE]: '🎨',
};

/**
 * 任务分类颜色映射
 */
export const TASK_CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.GENERAL]: '#999999',
  [TaskCategory.STUDY]: '#51cf66',
  [TaskCategory.WORK]: '#339af0',
  [TaskCategory.EXERCISE]: '#fcc419',
  [TaskCategory.LIFE]: '#ff922b',
  [TaskCategory.CREATIVE]: '#9775fa',
};

/**
 * 任务优先级枚举
 */
export enum TaskPriority {
  HIGH = 1,    // 高
  MEDIUM = 2,  // 中
  LOW = 3,     // 低
}

export const TASK_PRIORITY = TaskPriority;

export const TASK_PRIORITY_NAMES: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: '高',
  [TaskPriority.MEDIUM]: '中',
  [TaskPriority.LOW]: '低',
};

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  PENDING = 0, // 待完成
  DONE = 1,    // 已完成
}

export const TASK_STATUS = TaskStatus;

export const TASK_STATUS_NAMES: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: '待完成',
  [TaskStatus.DONE]: '已完成',
};

/**
 * 分类类型枚举
 */
export enum CategoryType {
  INCOME = 1,  // 收入
  EXPENSE = 2, // 支出
}

export const CATEGORY_TYPE_NAMES: Record<CategoryType, string> = {
  [CategoryType.INCOME]: '收入',
  [CategoryType.EXPENSE]: '支出',
};

/**
 * 交易类型枚举
 */
export enum TransactionType {
  INCOME = 1,  // 收入
  EXPENSE = 2, // 支出
}

export const TRANSACTION_TYPE_NAMES: Record<TransactionType, string> = {
  [TransactionType.INCOME]: '收入',
  [TransactionType.EXPENSE]: '支出',
};

/**
 * 心愿优先级枚举
 */
export enum WishlistPriority {
  HIGH = 1,    // 高
  MEDIUM = 2,  // 中
  LOW = 3,     // 低
}

export const WISHLIST_PRIORITY_NAMES: Record<WishlistPriority, string> = {
  [WishlistPriority.HIGH]: '高',
  [WishlistPriority.MEDIUM]: '中',
  [WishlistPriority.LOW]: '低',
};

/**
 * 心愿状态枚举
 */
export enum WishlistStatus {
  IN_PROGRESS = 0, // 进行中
  COMPLETED = 1,   // 已实现
  ABANDONED = 2,   // 已放弃
}

export const WISHLIST_STATUS_NAMES: Record<WishlistStatus, string> = {
  [WishlistStatus.IN_PROGRESS]: '进行中',
  [WishlistStatus.COMPLETED]: '已实现',
  [WishlistStatus.ABANDONED]: '已放弃',
};

