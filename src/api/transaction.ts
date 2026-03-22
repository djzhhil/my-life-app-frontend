/**
 * 交易记录相关 API（修复版）
 */

import { request, get, post, put, del } from '@/utils/request';
import { TransactionCreateDTO, TransactionVO, TransactionStatisticsVO } from '@/types/api';

// ==================== 列出交易记录 ====================

export async function listTransactions(params?: {
  type?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<TransactionVO[]> {
  return get<TransactionVO[]>('/transaction/list', params);
}

// ==================== 创建交易记录 ====================

export async function createTransaction(data: TransactionCreateDTO): Promise<TransactionVO> {
  return post<TransactionVO>('/transaction/add', data);
}

// ==================== 更新交易记录 ====================

export async function updateTransaction(id: number, data: TransactionCreateDTO): Promise<TransactionVO> {
  return put<TransactionVO>(`/transaction/update/${id}`, data);
}

// ==================== 删除交易记录 ====================

export async function deleteTransaction(id: number): Promise<void> {
  return del<void>(`/transaction/delete/${id}`);
}

// ==================== 获取统计数据 ====================

export async function getStatistics(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<TransactionStatisticsVO> {
  return get<TransactionStatisticsVO>('/transaction/statistics', params);
}

export const transactionApi = {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
};
