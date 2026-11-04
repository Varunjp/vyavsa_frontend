import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, Plan, PlanTransaction, TenantSubscription } from '@/types';

export const subscriptionService = {
  async getCurrentSubscription(): Promise<TenantSubscription> {
    const res = await apiClient.get<ApiResponse<TenantSubscription>>(
      API_ENDPOINTS.TENANT_SUBSCRIPTION
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch subscription');
    return res.data.data;
  },

  async listAvailablePlans(): Promise<Plan[]> {
    const res = await apiClient.get<ApiResponse<Plan[]>>(API_ENDPOINTS.TENANT_SUBSCRIPTION_PLANS);
    return res.data.data || [];
  },

  async purchasePlan(planId: string, paymentMethod: string = 'card'): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.TENANT_PURCHASE_PLAN, {
      plan_id: planId,
      payment_method: paymentMethod,
    });
    return res.data.data;
  },

  async initiateCheckout(planId: string): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.TENANT_CHECKOUT, {
      plan_id: planId,
    });
    return res.data.data;
  },

  async verifyPayment(payload: {
    plan_id: string;
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
  }): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.TENANT_VERIFY_PAYMENT,
      payload
    );
    return res.data.data;
  },

  async cancelSubscription(immediately: boolean = false): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(API_ENDPOINTS.TENANT_CANCEL_SUBSCRIPTION, {
      immediately,
    });
    return res.data.data;
  },

  async listTransactions(
    params: { page?: number; page_size?: number } = {}
  ): Promise<{ data: PlanTransaction[]; pagination?: any }> {
    const res = await apiClient.get<ApiResponse<PlanTransaction[]>>(
      API_ENDPOINTS.TENANT_TRANSACTIONS,
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination,
    };
  },
};
