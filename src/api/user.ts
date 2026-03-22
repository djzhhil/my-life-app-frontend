/**
 * 用户相关 API
 */

import { request, get, post } from '@/utils/request';
import {
  UserRegisterDTO,
  UserLoginDTO,
  User,
  UserVO,
  TokenVO,
} from '@/types/api';

// ==================== 用户注册 ====================

export async function register(data: UserRegisterDTO): Promise<UserVO> {
  return post<UserVO>('/api/user/register', data);
}

// ==================== 用户登录 ====================

export async function login(data: UserLoginDTO): Promise<TokenVO> {
  return post<TokenVO>('/api/user/login', data);
}

// ==================== 获取用户信息 ====================

export async function getUserInfo(): Promise<User> {
  return get<User>('/api/user/info');
}

export const userApi = {
  register,
  login,
  getUserInfo,
};
