/**
 * 分类状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as categoryApi from '@/api/category';
import { CategoryVO, CategoryType } from '@/types/api';

// TODO: 创建 src/api/category.ts
// 需要先创建 API 文件，然后才能完成这个 store

export const useCategoryStore = defineStore('category', () => {
  // 状态
  const categories = ref<CategoryVO[]>([]);
  const loading = ref(false);

  // 获取分类列表
  async function fetchCategories(): Promise<void> {
    loading.value = true;
    try {
      // TODO: 调用分类 API
      // categories.value = await categoryApi.listCategories();
    } catch (error) {
      console.error('获取分类列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 创建分类
  async function createCategory(data: any): Promise<boolean> {
    try {
      // TODO: 调用创建分类 API
      // await categoryApi.createCategory(data);
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('创建分类失败:', error);
      return false;
    }
  }

  // 更新分类
  async function updateCategory(id: number, data: any): Promise<boolean> {
    try {
      // TODO: 调用更新分类 API
      // await categoryApi.updateCategory(id, data);
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('更新分类失败:', error);
      return false;
    }
  }

  // 删除分类
  async function deleteCategory(id: number): Promise<boolean> {
    try {
      // TODO: 调用删除分类 API
      // await categoryApi.deleteCategory(id);
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      return false;
    }
  }

  // 按类型筛选分类
  function getCategoriesByType(type: CategoryType): CategoryVO[] {
    return categories.value.filter(cat => cat.type === type);
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType,
  };
});
