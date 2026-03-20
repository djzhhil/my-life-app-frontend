/**
 * API 类型定义
 * 基于后端接口文档
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

// ==================== 实体类 ====================

/**
 * 用户实体（包含 password，获取用户信息时返回）
 */
export interface User {
  id: number;
  username: string;
  password: string; // ⚠️ 密码字段，仅 Entity 有
  level: number;
  exp: number;
  coin: number;
  createdAt: string; // 格式："yyyy-MM-dd HH:mm:ss"
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
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

// ==================== 任务状态枚举 ====================

export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done',
}

// ==================== 响应类型别名 ====================

// 用户信息响应（直接返回 User Entity）
export type UserInfoResponse = User;

// 任务列表响应（直接返回数组）
export type TaskListResponse = Task[];

// 注册响应（Result<UserVO>）
export type RegisterResponse = Result<UserVO>;

// 登录响应（Result<TokenVO>）
export type LoginResponse = Result<TokenVO>;

// 创建任务响应（Result<Task>）
export type TaskCreateResponse = Result<Task>;

// 完成任务响应（Result<void>）
export type CompleteTaskResponse = Result<void>;