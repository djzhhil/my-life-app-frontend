/**
 * 交易记录状态管理
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as transactionApi from '@/api/transaction';
import { TransactionVO, TransactionStatisticsVO } from '@/types/api';

export const useTransactionStore = defineStore('transaction', () => {
  // 状态
  const transactions = ref<TransactionVO[]>([]);
  const statistics = ref<TransactionStatisticsVO | null>(null);
  const loading = ref(false);

  // 获取交易列表
  async function fetchTransactions(startDate?: string, endDate?: string): Promise<void> {
    loading.value = true;
    try {
      transactions.value = await transactionApi.listTransactions({ startDate, endDate });
    } catch (error) {
      console.error('获取交易列表失败:', error);
    } finally {
      loading.value = false;
    }
  }

  // 创建交易记录
  async function createTransaction(data: any): Promise<boolean> {
    try {
      await transactionApi.createTransaction(data);
      await fetchTransactions();
      await fetchStatistics();
      return true;
    } catch (error) {
      console.error('创建交易记录失败:', error);
      return false;
    }
  }

  // 更新交易记录
  async function updateTransaction(id: number, data: any): Promise<boolean> {
    try {
      await transactionApi.updateTransaction(id, data);
      await fetchTransactions();
      await fetchStatistics();
      return true;
    } catch (error) {
      console.error('更新交易记录失败:', error);
      return false;
    }
  }

  // 删除交易记录
  async function deleteTransaction(id: number): Promise<boolean> {
    try {
      await transactionApi.deleteTransaction(id);
      await fetchTransactions();
      await fetchStatistics();
      return true;
    } catch (error) {
      console.error('删除交易记录失败:', error);
      return false;
    }
  }

  // 获取统计数据
  async function fetchStatistics(startDate?: string, endDate?: string): Promise<void> {
    try {
      statistics.value = await transactionApi.getStatistics({ startDate, endDate });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  }

  return {
    transactions,
    statistics,
    loading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    fetchStatistics,
  };
});
