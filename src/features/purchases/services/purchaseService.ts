import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Purchase } from '@/types';
import { CreatePurchaseInput, PurchasePaymentInput } from '../schemas/purchaseSchema';

export interface PurchaseListParams {
  page?: number;
  page_size?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const purchaseService = {
  async listPurchases(
    params: PurchaseListParams = {}
  ): Promise<{ data: Purchase[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Purchase[]>>(API_ENDPOINTS.PURCHASES, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getPurchase(id: string): Promise<Purchase> {
    const res = await apiClient.get<ApiResponse<Purchase>>(`${API_ENDPOINTS.PURCHASES}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch purchase');
    return res.data.data;
  },

  async createPurchase(input: CreatePurchaseInput): Promise<Purchase> {
    const payload: any = {
      supplier_id: input.supplier_id || undefined,
      customer_id: input.customer_id || undefined,
      item: input.item,
      quantity: input.quantity,
      total_amount: input.total_amount,
      total_paid: input.total_paid,
    };
    if (input.total_paid > 0) {
      if (input.payment_method === 'bank' && input.bank_id) {
        payload.payments = [
          {
            payment_method: 'bank',
            bank_id: input.bank_id,
            amount: input.total_paid,
          },
        ];
      } else {
        payload.payments = [
          {
            payment_method: 'cash',
            amount: input.total_paid,
          },
        ];
      }
    }
    const res = await apiClient.post<ApiResponse<Purchase>>(API_ENDPOINTS.PURCHASES, payload);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to record purchase');
    return res.data.data;
  },

  async updatePurchase(id: string, input: Partial<CreatePurchaseInput>): Promise<Purchase> {
    const res = await apiClient.put<ApiResponse<Purchase>>(
      `${API_ENDPOINTS.PURCHASES}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update purchase');
    return res.data.data;
  },

  async deletePurchase(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PURCHASES}/${id}`);
  },

  async recordPurchasePayment(id: string, input: PurchasePaymentInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.PURCHASES}/${id}/payments`,
      input
    );
    return res.data.data;
  },
};
