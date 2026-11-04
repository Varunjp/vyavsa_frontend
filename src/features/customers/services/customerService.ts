import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Customer, CustomerStatement } from '@/types';
import {
  AdjustCustomerBalanceInput,
  ApplyAdvanceInput,
  CollectAdvanceInput,
  CollectPaymentInput,
  CreateCustomerInput,
} from '../schemas/customerSchema';

export interface CustomerListParams {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  role?: string;
}

export const customerService = {
  async listCustomers(
    params: CustomerListParams = {}
  ): Promise<{ data: Customer[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Customer[]>>(API_ENDPOINTS.CUSTOMERS, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getCustomer(id: string): Promise<Customer> {
    const res = await apiClient.get<ApiResponse<Customer>>(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch customer');
    return res.data.data;
  },

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    const res = await apiClient.post<ApiResponse<Customer>>(API_ENDPOINTS.CUSTOMERS, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create customer');
    return res.data.data;
  },

  async updateCustomer(id: string, input: Partial<CreateCustomerInput>): Promise<Customer> {
    const res = await apiClient.put<ApiResponse<Customer>>(
      `${API_ENDPOINTS.CUSTOMERS}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update customer');
    return res.data.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
  },

  async getCustomerBalance(id: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.CUSTOMERS}/${id}/balance`);
    return res.data.data;
  },

  async getCustomerStatement(id: string): Promise<CustomerStatement> {
    const res = await apiClient.get<ApiResponse<CustomerStatement>>(
      `${API_ENDPOINTS.CUSTOMERS}/${id}/statement`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch customer statement');
    return res.data.data;
  },

  async collectPayment(customerId: string, input: CollectPaymentInput): Promise<any> {
    const payload: any = {
      customer_id: customerId,
      amount: input.amount,
      payment_method: input.payment_method,
      note: input.note,
    };
    if (input.bank_id) {
      payload.bank_id = input.bank_id;
    }
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.CUSTOMERS}/${customerId}/collections`,
      payload
    );
    return res.data.data;
  },

  async collectAdvance(customerId: string, input: CollectAdvanceInput): Promise<any> {
    const payload: any = {
      customer_id: customerId,
      amount: input.amount,
      payment_method: input.payment_method,
      note: input.note,
    };
    if (input.bank_id) {
      payload.bank_id = input.bank_id;
    }
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.CUSTOMERS}/${customerId}/advances`,
      payload
    );
    return res.data.data;
  },

  async applyAdvanceToDues(customerId: string, input: ApplyAdvanceInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.CUSTOMERS}/${customerId}/apply-advance`,
      input
    );
    return res.data.data;
  },

  async adjustBalance(customerId: string, input: AdjustCustomerBalanceInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.CUSTOMERS}/${customerId}/adjust-balance`,
      input
    );
    return res.data.data;
  },
};
