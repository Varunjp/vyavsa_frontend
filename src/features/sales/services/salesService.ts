import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, CounterSale, LineSale, Product } from '@/types';
import {
  CreateCounterSaleInput,
  CreateLineSaleInput,
  RecordSalePaymentInput,
} from '../schemas/saleSchema';

export interface SalesListParams {
  page?: number;
  page_size?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
  customer_id?: string;
}

export const salesService = {
  // Line Sales
  async listLineSales(
    params: SalesListParams = {}
  ): Promise<{ data: LineSale[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<LineSale[]>>(API_ENDPOINTS.LINE_SALES, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getLineSale(id: string): Promise<LineSale> {
    const res = await apiClient.get<ApiResponse<LineSale>>(`${API_ENDPOINTS.LINE_SALES}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch line sale');
    return res.data.data;
  },

  async createLineSale(input: CreateLineSaleInput): Promise<LineSale> {
    const subtotal = input.items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0
    );
    const payload = {
      ...input,
      subtotal,
      total_amount: subtotal,
      items: input.items.map(item => ({
        product_id: item.product_id || undefined,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: Number(item.quantity) * Number(item.unit_price),
      })),
    };
    const res = await apiClient.post<ApiResponse<LineSale>>(API_ENDPOINTS.LINE_SALES, payload);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create line sale');
    return res.data.data;
  },

  async updateLineSale(id: string, input: Partial<CreateLineSaleInput>): Promise<LineSale> {
    const res = await apiClient.put<ApiResponse<LineSale>>(
      `${API_ENDPOINTS.LINE_SALES}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update line sale');
    return res.data.data;
  },

  async deleteLineSale(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.LINE_SALES}/${id}`);
  },

  async recordLineSalePayment(id: string, input: RecordSalePaymentInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.LINE_SALES}/${id}/payments`,
      input
    );
    return res.data.data;
  },

  async downloadLineSalePDF(id: string): Promise<Blob> {
    const res = await apiClient.get(`${API_ENDPOINTS.LINE_SALES}/${id}/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async getLineSaleBreakdown(params: { from_date?: string; to_date?: string } = {}): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.LINE_SALES_BREAKDOWN, {
      params,
    });
    return res.data.data;
  },

  // Counter Sales
  async listCounterSales(
    params: SalesListParams = {}
  ): Promise<{ data: CounterSale[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<CounterSale[]>>(API_ENDPOINTS.COUNTER_SALES, {
      params,
    });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getCounterSale(id: string): Promise<CounterSale> {
    const res = await apiClient.get<ApiResponse<CounterSale>>(
      `${API_ENDPOINTS.COUNTER_SALES}/${id}`
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch counter sale');
    return res.data.data;
  },

  async createCounterSale(input: CreateCounterSaleInput): Promise<CounterSale> {
    const subtotal = input.subtotal ?? Number(input.price) * Number(input.quantity);
    const total_amount = Math.max(0, subtotal - (input.discount || 0));
    const payload = {
      ...input,
      subtotal,
      total_amount,
    };
    const res = await apiClient.post<ApiResponse<CounterSale>>(
      API_ENDPOINTS.COUNTER_SALES,
      payload
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create counter sale');
    return res.data.data;
  },

  async updateCounterSale(
    id: string,
    input: Partial<CreateCounterSaleInput>
  ): Promise<CounterSale> {
    const res = await apiClient.put<ApiResponse<CounterSale>>(
      `${API_ENDPOINTS.COUNTER_SALES}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update counter sale');
    return res.data.data;
  },

  async deleteCounterSale(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.COUNTER_SALES}/${id}`);
  },

  async recordCounterSalePayment(id: string, input: RecordSalePaymentInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.COUNTER_SALES}/${id}/payments`,
      input
    );
    return res.data.data;
  },

  async downloadCounterSalePDF(id: string): Promise<Blob> {
    const res = await apiClient.get(`${API_ENDPOINTS.COUNTER_SALES}/${id}/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async getCounterSaleBreakdown(
    params: { from_date?: string; to_date?: string } = {}
  ): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.COUNTER_SALES_BREAKDOWN, {
      params,
    });
    return res.data.data;
  },

  // Products lookup
  async listProducts(): Promise<Product[]> {
    const res = await apiClient.get<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS);
    return res.data.data || [];
  },
};
