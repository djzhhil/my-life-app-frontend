/**
 * 任务状态管理
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { taskApi } from '@/api/task';
import { useUserStore } from './user';
import { Task, TaskStatus } from '@/types/api';
import { TaskFilter } from '@/types/common';

export const useTaskStore = defineStore('task', () => {
  // 状态
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const filter = ref<TaskFilter>('all');

  // 计算属性
  const filteredTasks = computed(() => {
    if (filter.value === 'all') {
      return tasks.value;
    }
    return tasks.value.filter((task) => task.status === filter.value);
  });

  const pendingCount = computed(() => {
    return tasks.value.filter((task) => task.status === TaskStatus.PENDING).length;
  });

  const doneCount = computed(() => {
    return tasks.value.filter((task) => task.status === TaskStatus.DONE).length;
  });

  const totalCount = computed(() => {
    return tasks.value.length;
  });

  // 获取任务列表
  async function fetchTasks(): Promise<void> {
    loading.value = true;
    try {
      const data = await taskApi.listTask();
      tasks.value = data || [];
    } catch (error) {
      console.error('获取任务列表失败:', error);
      tasks.value = [];
    } finally {
      loading.value = false;
    }
  }

  // 创建任务
  async function createTask(title: string, description: string, expReward: number, coinReward: number): Promise<boolean> {
    try {
      await taskApi.createTask({
        title,
        description,
        expReward,
        coinReward,
      });
      // 刷新任务列表
      await fetchTasks();
      return true;
    } catch (error) {
      console.error('创建任务失败:', error);
      return false;
    }
  }

  // 完成任务
  async function completeTask(id: number): Promise<boolean> {
    const userStore = useUserStore();

    try {
      await taskApi.completeTask(id);
      // 刷新任务列表
      await fetchTasks();
      // 刷新用户信息（获取奖励）
      await userStore.fetchUserInfo();
      return true;
    } catch (error) {
      console.error('完成任务失败:', error);
      return false;
    }
  }

  // 设置筛选条件
  function setFilter(newFilter: TaskFilter) {
    filter.value = newFilter;
  }

  return {
    tasks,
    loading,
    filter,
    filteredTasks,
    pendingCount,
    doneCount,
    totalCount,
    fetchTasks,
    createTask,
    completeTask,
    setFilter,
  };
});