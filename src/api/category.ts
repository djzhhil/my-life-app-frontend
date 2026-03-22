/**
 * 分类相关 API
 */

import { request, get, post, put, del } from '@/utils/request';
import { CategoryCreateDTO, CategoryVO } from '@/types/api';

// ==================== 获取分类列表 ====================

export async function listCategories(type: number): Promise<CategoryVO[]> {
  return get<CategoryVO[]>('/category/list', { type });
}

// ==================== 添加分类 ====================

export async function createCategory(data: CategoryCreateDTO): Promise<CategoryVO> {
  return post<CategoryVO>('/category/add', data);
}

// ==================== 更新分类 ====================

export async function updateCategory(id: number, data: CategoryCreateDTO): Promise<CategoryVO> {
  return put<CategoryVO>(`/category/update/${id}`, data);
}

// ==================== 删除分类 ====================

export async function deleteCategory(id: number): Promise<void> {
  return del<void>(`/category/delete/${id}`);
}

export const categoryApi = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
