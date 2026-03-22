/**
 * 分类状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { categoryApi } from '@/api/category';

export interface Category {
  id: number;
  name: string;
  type: number;  // 1=收入, 2=支出
  icon: string;
  color: string;
}

export const useCategoryStore = defineStore('category', () => {
  // 状态
  const categories = ref<Category[]>([]);
  const loading = ref(false);

  // 收入分类
  const incomeCategories = computed(() => {
    return categories.value.filter(cat => cat.type === 1);
  });

  // 支出分类
  const expenseCategories = computed(() => {
    return categories.value.filter(cat => cat.type === 2);
  });

  // 获取分类列表
  async function fetchCategories(): Promise<void> {
    loading.value = true;
    try {
      // 获取所有分类
      const incomeList = await categoryApi.listCategories(1);
      const expenseList = await categoryApi.listCategories(2);
      categories.value = [...incomeList, ...expenseList];
    } catch (error) {
      console.error('获取分类列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 根据类型获取分类
  function getCategoriesByType(type: number): Category[] {
    return categories.value.filter(cat => cat.type === type);
  }

  // 根据ID获取分类
  function getCategoryById(id: number): Category | undefined {
    return categories.value.find(cat => cat.id === id);
  }

  // 创建分类
  async function createCategory(data: any): Promise<boolean> {
    try {
      await categoryApi.createCategory(data);
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
      await categoryApi.updateCategory(id, data);
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
      await categoryApi.deleteCategory(id);
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      return false;
    }
  }

  return {
    categories,
    loading,
    incomeCategories,
    expenseCategories,
    fetchCategories,
    getCategoriesByType,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
});
