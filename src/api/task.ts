/**
 * 任务相关 API
 */

import { request, get, post } from '@/utils/request';
import { TaskCreateDTO, Task, TaskStatus } from '@/types/api';

// ==================== 创建任务 ====================

export async function createTask(data: TaskCreateDTO): Promise<Task> {
  return post<Task>('/task/create', data);
}

// ==================== 列出任务 ====================

export async function listTask(): Promise<Task[]> {
  return get<Task[]>('/task/list');
}

// ==================== 完成任务 ====================

export async function completeTask(id: number): Promise<void> {
  return request({
    url: `/task/complete/${id}`,
    method: 'POST',
  });
}

// ==================== 筛选任务 ====================

export function filterTasks(tasks: Task[], status?: TaskStatus | 'all'): Task[] {
  if (!status || status === 'all') {
    return tasks;
  }
  return tasks.filter((task) => task.status === status);
}

export const taskApi = {
  createTask,
  listTask,
  completeTask,
  filterTasks,
}