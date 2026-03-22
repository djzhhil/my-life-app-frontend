/**
 * 心愿单相关 API（修复版）
 */

import { request, get, post, put, del } from '@/utils/request';
import { WishlistCreateDTO, WishlistVO, DepositDTO, WishlistDeposit } from '@/types/api';

// ==================== 创建心愿 ====================

export async function createWishlist(data: WishlistCreateDTO): Promise<WishlistVO> {
  return post<WishlistVO>('/wishlist/create', data);
}

// ==================== 获取心愿列表 ====================

export async function listWishlists(params?: {
  status?: number;
  priority?: number;
}): Promise<WishlistVO[]> {
  return get<WishlistVO[]>('/wishlist/list', params);
}

// ==================== 获取心愿详情 ====================

export async function getWishlistDetail(id: number): Promise<WishlistVO> {
  return get<WishlistVO>(`/wishlist/${id}`);
}

// ==================== 更新心愿 ====================

export async function updateWishlist(id: number, data: WishlistCreateDTO): Promise<WishlistVO> {
  return put<WishlistVO>(`/wishlist/${id}`, data);
}

// ==================== 删除心愿 ====================

export async function deleteWishlist(id: number): Promise<void> {
  return del<void>(`/wishlist/${id}`);
}

// ==================== 完成心愿 ====================

export async function completeWishlist(id: number): Promise<void> {
  return post<void>(`/wishlist/${id}/complete`);
}

// ==================== 放弃心愿 ====================

export async function abandonWishlist(id: number): Promise<void> {
  return post<void>(`/wishlist/${id}/abandon`);
}

// ==================== 获取存钱记录 ====================

export async function getDeposits(wishlistId: number): Promise<WishlistDeposit[]> {
  return get<WishlistDeposit[]>(`/wishlist/${wishlistId}/deposits`);
}

// ==================== 存入金币 ====================

export async function deposit(data: DepositDTO): Promise<void> {
  return post<void>('/wishlist/deposit', data);
}

export const wishlistApi = {
  createWishlist,
  listWishlists,
  getWishlistDetail,
  updateWishlist,
  deleteWishlist,
  completeWishlist,
  abandonWishlist,
  getDeposits,
  deposit,
};
