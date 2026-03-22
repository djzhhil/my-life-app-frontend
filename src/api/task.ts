/**
 * 任务相关 API（修复版）
 */

import { request, get, post, put, del } from '@/utils/request';
import { TaskCreateDTO, TaskUpdateDTO, TaskVO } from '@/types/api';

// ==================== 创建任务 ====================

export async function createTask(data: TaskCreateDTO): Promise<TaskVO> {
  return post<TaskVO>('/api/task/create', data);
}

// ==================== 列出任务 ====================

export async function listTask(): Promise<TaskVO[]> {
  return get<TaskVO[]>('/api/task/list');
}

// ==================== 按分类查询任务 ====================

export async function listTaskByCategory(category: number): Promise<TaskVO[]> {
  return get<TaskVO[]>(`/api/task/list/category/${category}`);
}

// ==================== 按优先级查询任务 ====================

export async function listTaskByPriority(priority: number): Promise<TaskVO[]> {
  return get<TaskVO[]>(`/api/task/list/priority/${priority}`);
}

// ==================== 更新任务 ====================

export async function updateTask(id: number, data: TaskUpdateDTO): Promise<TaskVO> {
  return put<TaskVO>(`/api/task/update/${id}`, data);
}

// ==================== 删除任务 ====================

export async function deleteTask(id: number): Promise<void> {
  return del<void>(`/api/task/delete/${id}`);
}

// ==================== 完成任务 ====================

export async function completeTask(id: number): Promise<void> {
  return post<void>(`/api/task/complete/${id}`);
}

export const taskApi = {
  createTask,
  listTask,
  listTaskByCategory,
  listTaskByPriority,
  updateTask,
  deleteTask,
  completeTask,
};
