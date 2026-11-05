import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  ApiResponse,
  Plan,
  PlatformDashboardMetrics,
  PlatformSubscriptionItem,
  PlatformTenantItem,
  PlatformTransactionItem,
} from '@/types';
import {
  CreatePlanInput,
  OnboardTenantInput,
  UpdatePlatformTenantInput,
} from '../schemas/platformSchema';

export const platformService = {
  async getDashboardMetrics(): Promise<PlatformDashboardMetrics> {
    const res = await apiClient.get<ApiResponse<PlatformDashboardMetrics>>(
      API_ENDPOINTS.PLATFORM_METRICS
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch platform metrics');
    return res.data.data;
  },

  // Tenants
  async listTenants(
    params: { page?: number; page_size?: number; status?: string; search?: string } = {}
  ): Promise<{ data: PlatformTenantItem[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<PlatformTenantItem[]>>(
      API_ENDPOINTS.PLATFORM_TENANTS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getTenant(id: string): Promise<any> {
    const res = await apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.PLATFORM_TENANTS}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch tenant details');
    return res.data.data;
  },

  async onboardTenant(input: OnboardTenantInput): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.PLATFORM_TENANTS, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to onboard tenant');
    return res.data.data;
  },

  async updateTenant(id: string, input: UpdatePlatformTenantInput): Promise<any> {
    const res = await apiClient.put<ApiResponse<any>>(
      `${API_ENDPOINTS.PLATFORM_TENANTS}/${id}`,
      input
    );
    return res.data.data;
  },

  async updateTenantStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<any> {
    const res = await apiClient.patch<ApiResponse<any>>(
      `${API_ENDPOINTS.PLATFORM_TENANTS}/${id}/status`,
      { status }
    );
    return res.data.data;
  },

  async changeTenantSubscription(id: string, planId: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      `${API_ENDPOINTS.PLATFORM_TENANTS}/${id}/subscription`,
      { plan_id: planId }
    );
    return res.data.data;
  },

  async updateSubscriptionStatus(
    id: string,
    status: 'active' | 'past_due' | 'expired' | 'cancelled'
  ): Promise<any> {
    const res = await apiClient.patch<ApiResponse<any>>(
      `${API_ENDPOINTS.PLATFORM_SUBSCRIPTIONS}/${id}/status`,
      { status }
    );
    return res.data.data;
  },

  // Plans
  async listPlans(
    params: { page?: number; page_size?: number; status?: string } = {}
  ): Promise<{ data: Plan[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<Plan[]>>(API_ENDPOINTS.PLATFORM_PLANS, { params });
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async getPlan(id: string): Promise<Plan> {
    const res = await apiClient.get<ApiResponse<Plan>>(`${API_ENDPOINTS.PLATFORM_PLANS}/${id}`);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch plan');
    return res.data.data;
  },

  async createPlan(input: CreatePlanInput): Promise<Plan> {
    const res = await apiClient.post<ApiResponse<Plan>>(API_ENDPOINTS.PLATFORM_PLANS, input);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to create plan');
    return res.data.data;
  },

  async updatePlan(id: string, input: Partial<CreatePlanInput>): Promise<Plan> {
    const res = await apiClient.put<ApiResponse<Plan>>(
      `${API_ENDPOINTS.PLATFORM_PLANS}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update plan');
    return res.data.data;
  },

  async archivePlan(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.PLATFORM_PLANS}/${id}`);
  },

  // Platform Subscriptions & Transactions
  async listSubscriptions(
    params: { page?: number; page_size?: number; status?: string } = {}
  ): Promise<{ data: PlatformSubscriptionItem[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<PlatformSubscriptionItem[]>>(
      API_ENDPOINTS.PLATFORM_SUBSCRIPTIONS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },

  async listTransactions(
    params: { page?: number; page_size?: number; status?: string } = {}
  ): Promise<{ data: PlatformTransactionItem[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<PlatformTransactionItem[]>>(
      API_ENDPOINTS.PLATFORM_TRANSACTIONS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },
};
