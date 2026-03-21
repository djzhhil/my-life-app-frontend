/**
 * 任务相关 API（更新版）
 */

import { request, get, post } from '@/utils/request';
import { TaskCreateDTO, TaskUpdateDTO, TaskVO } from '@/types/api';

// ==================== 创建任务 ====================

export async function createTask(data: TaskCreateDTO): Promise<TaskVO> {
  return post<TaskVO>('/task/create', data);
}

// ==================== 列出任务 ====================

export async function listTask(): Promise<TaskVO[]> {
  return get<TaskVO[]>('/task/list');
}

// ==================== 更新任务 ====================

export async function updateTask(id: number, data: TaskUpdateDTO): Promise<TaskVO> {
  return post<TaskVO>(`/task/update/${id}`, data);
}

// ==================== 删除任务 ====================

export async function deleteTask(id: number): Promise<void> {
  return post<void>(`/task/delete/${id}`);
}

// ==================== 完成任务 ====================

export async function completeTask(id: number): Promise<void> {
  return post<void>(`/task/complete/${id}`);
}

export const taskApi = {
  createTask,
  listTask,
  updateTask,
  deleteTask,
  completeTask,
};
