import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  ApiResponse,
  FinancialMetrics,
  TodayOverview,
  DailyStats,
  SalePaymentBreakdown,
  OfficeDashboardData,
} from '@/types';

export const dashboardService = {
  async getFinancialMetrics(): Promise<FinancialMetrics> {
    const res = await apiClient.get<ApiResponse<FinancialMetrics>>(
      API_ENDPOINTS.TENANT_DASHBOARD_METRICS
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch financial metrics');
    return res.data.data;
  },

  async getTodayOverview(): Promise<TodayOverview> {
    const res = await apiClient.get<ApiResponse<TodayOverview>>(
      API_ENDPOINTS.TENANT_DASHBOARD_TODAY
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch today overview');
    return res.data.data;
  },

  async getDailyStats(date?: string): Promise<DailyStats> {
    const res = await apiClient.get<ApiResponse<DailyStats>>(API_ENDPOINTS.TENANT_DAILY_STATS, {
      params: date ? { date } : undefined,
    });
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch daily statistics');
    return res.data.data;
  },

  async getLineSaleBreakdown(date?: string): Promise<SalePaymentBreakdown> {
    const res = await apiClient.get<ApiResponse<SalePaymentBreakdown>>(
      API_ENDPOINTS.LINE_SALES_BREAKDOWN,
      {
        params: date ? { date } : undefined,
      }
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch line sales breakdown');
    return res.data.data;
  },

  async getCounterSaleBreakdown(date?: string): Promise<SalePaymentBreakdown> {
    const res = await apiClient.get<ApiResponse<SalePaymentBreakdown>>(
      API_ENDPOINTS.COUNTER_SALES_BREAKDOWN,
      {
        params: date ? { date } : undefined,
      }
    );
    if (!res.data.data)
      throw new Error(res.data.message || 'Failed to fetch counter sales breakdown');
    return res.data.data;
  },

  async getSalesDashboard(date?: string): Promise<{
    business_date: string;
    currency: string;
    total_cash_collected: string | number;
    total_bank_received: string | number;
    total_sales_count: number;
    total_sales_amount: string | number;
    outstanding_dues: string | number;
  }> {
    const res = await apiClient.get<
      ApiResponse<{
        business_date: string;
        currency: string;
        total_cash_collected: string | number;
        total_bank_received: string | number;
        total_sales_count: number;
        total_sales_amount: string | number;
        outstanding_dues: string | number;
      }>
    >(API_ENDPOINTS.TENANT_DASHBOARD_SALES, {
      params: date ? { date } : undefined,
    });
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch sales dashboard');
    return res.data.data;
  },

  async getOfficeDashboard(date?: string): Promise<OfficeDashboardData> {
    const res = await apiClient.get<ApiResponse<OfficeDashboardData>>(
      API_ENDPOINTS.TENANT_DASHBOARD_OFFICE,
      {
        params: date ? { date } : undefined,
      }
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch office dashboard');
    return res.data.data;
  },
};
