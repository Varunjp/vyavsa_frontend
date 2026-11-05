import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Bank, BankTransaction, CashTransaction } from '@/types';
import {
  AddCashInput,
  AdjustBankInput,
  AdjustCashInput,
  CreateBankInput,
} from '../schemas/cashBankSchema';

export const cashBankService = {
  // Cash Drawer
  async getCashBalance(): Promise<{ cash_balance: string | number; updated_at: string }> {
    const res = await apiClient.get<
      ApiResponse<{ cash_balance: string | number; updated_at: string }>
    >(API_ENDPOINTS.CASH_BALANCE);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch cash balance');
    return res.data.data;
  },

  async addCash(input: AddCashInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.CASH_ADD, input);
    return res.data.data;
  },

  async adjustCash(input: AdjustCashInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.CASH_ADJUST, input);
    return res.data.data;
  },

  async listCashTransactions(
    params: { page?: number; page_size?: number } = {}
  ): Promise<{ data: CashTransaction[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<CashTransaction[]>>(
      API_ENDPOINTS.CASH_TRANSACTIONS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  // Bank Accounts
  async listBanks(): Promise<Bank[]> {
    const res = await apiClient.get<ApiResponse<Bank[]>>(API_ENDPOINTS.BANKS);
    return res.data.data || [];
  },

  async getBank(id: string): Promise<Bank> {
    const res = await apiClient.get<ApiResponse<Bank>>(`${API_ENDPOINTS.BANKS}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch bank');
    return res.data.data;
  },

  async createBank(input: CreateBankInput): Promise<Bank> {
    const res = await apiClient.post<ApiResponse<Bank>>(API_ENDPOINTS.BANKS, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create bank');
    return res.data.data;
  },

  async updateBank(id: string, input: Partial<CreateBankInput>): Promise<Bank> {
    const res = await apiClient.put<ApiResponse<Bank>>(`${API_ENDPOINTS.BANKS}/${id}`, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update bank');
    return res.data.data;
  },

  async deleteBank(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.BANKS}/${id}`);
  },

  async adjustBankBalance(id: string, input: AdjustBankInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.BANKS}/${id}/adjust-balance`,
      input
    );
    return res.data.data;
  },

  async listBankTransactions(id: string): Promise<BankTransaction[]> {
    const res = await apiClient.get<ApiResponse<BankTransaction[]>>(
      `${API_ENDPOINTS.BANKS}/${id}/transactions`
    );
    return res.data.data || [];
  },
};
