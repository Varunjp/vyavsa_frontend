import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Supplier, SupplierStatement } from '@/types';
import { CreateSupplierInput, SupplierPaymentInput } from '../schemas/supplierSchema';

export interface SupplierListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
}

export const supplierService = {
  async listSuppliers(
    params: SupplierListParams = {}
  ): Promise<{ data: Supplier[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Supplier[]>>(API_ENDPOINTS.SUPPLIERS, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getSupplier(id: string): Promise<Supplier> {
    const res = await apiClient.get<ApiResponse<Supplier>>(`${API_ENDPOINTS.SUPPLIERS}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch supplier');
    return res.data.data;
  },

  async createSupplier(input: CreateSupplierInput): Promise<Supplier> {
    const res = await apiClient.post<ApiResponse<Supplier>>(API_ENDPOINTS.SUPPLIERS, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create supplier');
    return res.data.data;
  },

  async updateSupplier(id: string, input: Partial<CreateSupplierInput>): Promise<Supplier> {
    const res = await apiClient.put<ApiResponse<Supplier>>(
      `${API_ENDPOINTS.SUPPLIERS}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update supplier');
    return res.data.data;
  },

  async deleteSupplier(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.SUPPLIERS}/${id}`);
  },

  async getSupplierBalance(id: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.SUPPLIERS}/${id}/balance`);
    return res.data.data;
  },

  async getSupplierStatement(id: string): Promise<SupplierStatement> {
    const res = await apiClient.get<ApiResponse<SupplierStatement>>(
      `${API_ENDPOINTS.SUPPLIERS}/${id}/statement`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch supplier statement');
    return res.data.data;
  },

  async recordPayment(supplierId: string, input: SupplierPaymentInput): Promise<any> {
    const payload: any = {
      supplier_id: supplierId,
      amount: input.amount,
      payment_method: input.payment_method,
      note: input.note,
    };
    if (input.bank_id) {
      payload.bank_id = input.bank_id;
    }
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.SUPPLIERS}/${supplierId}/payments`,
      payload
    );
    return res.data.data;
  },
};
