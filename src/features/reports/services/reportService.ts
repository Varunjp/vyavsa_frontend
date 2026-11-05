import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse } from '@/types';

export const reportService = {
  // Daily Report
  async getDailyReport(date: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.REPORTS_DAILY, {
      params: { date },
    });
    if (!res.data.data) throw new Error(res.data.message || 'Failed to retrieve daily report');
    return res.data.data;
  },

  async downloadDailyReportPDF(date: string): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_DAILY + '/pdf', {
      params: { date },
      responseType: 'blob',
    });
    return res.data;
  },

  // Sales Report
  async getSalesReport(params: {
    from_date?: string;
    to_date?: string;
    include_items?: boolean;
    include_phone?: boolean;
    include_payment_breakdown?: boolean;
  }): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.REPORTS_SALES, { params });
    return res.data.data;
  },

  async downloadSalesReportPDF(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_SALES + '/pdf', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  async downloadSalesReportExcel(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_SALES + '/excel', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  // Item Report
  async getItemReport(params: { from_date?: string; to_date?: string }): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.REPORTS_ITEMS, { params });
    return res.data.data;
  },

  async downloadItemReportPDF(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_ITEMS + '/pdf', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  async downloadItemReportExcel(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_ITEMS + '/excel', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  // Customer Report
  async getCustomerReport(params: {
    from_date?: string;
    to_date?: string;
    customer_id?: string;
  }): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(API_ENDPOINTS.REPORTS_CUSTOMERS, { params });
    return res.data.data;
  },

  async downloadCustomerReportPDF(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_CUSTOMERS + '/pdf', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  async downloadCustomerReportExcel(params: any): Promise<Blob> {
    const res = await apiClient.get(API_ENDPOINTS.REPORTS_CUSTOMERS + '/excel', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },
};
