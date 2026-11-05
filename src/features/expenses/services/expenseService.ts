import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Expense } from '@/types';
import { CreateExpenseInput } from '../schemas/expenseSchema';

export const expenseService = {
  async listExpenses(
    params: {
      page?: number;
      page_size?: number;
      search?: string;
      from_date?: string;
      to_date?: string;
    } = {}
  ): Promise<{ data: Expense[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Expense[]>>(API_ENDPOINTS.EXPENSES, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getExpense(id: string): Promise<Expense> {
    const res = await apiClient.get<ApiResponse<Expense>>(`${API_ENDPOINTS.EXPENSES}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch expense');
    return res.data.data;
  },

  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const payload: any = {
      item: input.item,
      category: input.category || undefined,
      employee_id: input.employee_id || undefined,
      total_amount: input.amount,
      amount: input.amount,
      payment_method: input.payment_method,
    };
    if (input.payment_method === 'bank' && input.bank_id) {
      payload.bank_payments = [
        {
          bank_account_id: input.bank_id,
          bank_id: input.bank_id,
          amount: input.amount,
          note: input.note,
        },
      ];
    } else {
      payload.cash_amount = input.amount;
    }

    const res = await apiClient.post<ApiResponse<Expense>>(API_ENDPOINTS.EXPENSES, payload);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to record expense');
    return res.data.data;
  },

  async updateExpense(id: string, input: Partial<CreateExpenseInput>): Promise<Expense> {
    const res = await apiClient.put<ApiResponse<Expense>>(`${API_ENDPOINTS.EXPENSES}/${id}`, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update expense');
    return res.data.data;
  },

  async deleteExpense(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.EXPENSES}/${id}`);
  },
};
