/**
 * 任务状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { taskApi } from '@/api/task';
import { TaskCreateDTO, TaskUpdateDTO, TaskVO, TaskStatus } from '@/types/api';

export const useTaskStore = defineStore('task', () => {
  // 状态
  const tasks = ref<TaskVO[]>([]);
  const loading = ref(false);

  // 统计数据
  const totalCount = computed(() => tasks.value.length);
  const doneCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.DONE).length);
  const pendingCount = computed(() => tasks.value.filter((t) => t.status === TaskStatus.PENDING).length);

  // 获取任务列表
  async function fetchTasks(): Promise<void> {
    loading.value = true;
    try {
      tasks.value = await taskApi.listTask();
    } catch (error) {
      console.error('获取任务列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 创建任务
  async function createTask(data: TaskCreateDTO): Promise<boolean> {
    try {
      await taskApi.createTask(data);
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('创建任务失败:', error);
      return false;
    }
  }

  // 更新任务
  async function updateTask(id: number, data: TaskUpdateDTO): Promise<boolean> {
    try {
      await taskApi.updateTask(id, data);
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('更新任务失败:', error);
      return false;
    }
  }

  // 删除任务
  async function deleteTask(id: number): Promise<boolean> {
    try {
      await taskApi.deleteTask(id);
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('删除任务失败:', error);
      return false;
    }
  }

  // 完成任务
  async function completeTask(id: number): Promise<boolean> {
    try {
      await taskApi.completeTask(id);
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('完成任务失败:', error);
      return false;
    }
  }

  // 筛选任务（旧版本，为了兼容保留）
  function filterTasks(tasks: TaskVO[], status?: TaskStatus | 'all'): TaskVO[] {
    if (!status || status === 'all') {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }

  return {
    tasks,
    loading,
    totalCount,
    doneCount,
    pendingCount,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    filterTasks,
  };
});
