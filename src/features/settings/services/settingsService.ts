import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { ApiResponse, TenantProfile, TenantUserItem } from '@/types';
import { CreateTenantUserInput, UpdateSettingsInput } from '../schemas/settingsSchema';

export const settingsService = {
  async getProfile(): Promise<TenantProfile> {
    const res = await apiClient.get<ApiResponse<TenantProfile>>(API_ENDPOINTS.TENANT_PROFILE);
    if (!res.data.data) throw new Error(res.data.message || 'Failed to fetch business profile');
    return res.data.data;
  },

  async updateSettings(input: UpdateSettingsInput): Promise<TenantProfile> {
    const res = await apiClient.put<ApiResponse<TenantProfile>>(
      API_ENDPOINTS.TENANT_SETTINGS,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update settings');
    return res.data.data;
  },

  async uploadLogo(file: File): Promise<{ logo_url: string }> {
    const formData = new FormData();
    formData.append('logo', file);
    const res = await apiClient.post<ApiResponse<{ logo_url: string }>>(
      API_ENDPOINTS.TENANT_LOGO,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to upload logo');
    return res.data.data;
  },

  async deleteLogo(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.TENANT_LOGO);
  },

  // Tenant User Management
  async listTenantUsers(): Promise<TenantUserItem[]> {
    const res = await apiClient.get<ApiResponse<TenantUserItem[]>>(API_ENDPOINTS.TENANT_USERS);
    return res.data.data || [];
  },

  async createTenantUser(input: CreateTenantUserInput): Promise<TenantUserItem> {
    const res = await apiClient.post<ApiResponse<TenantUserItem>>(
      API_ENDPOINTS.TENANT_USERS,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to add user');
    return res.data.data;
  },

  async updateTenantUser(
    id: string,
    input: Partial<CreateTenantUserInput>
  ): Promise<TenantUserItem> {
    const res = await apiClient.put<ApiResponse<TenantUserItem>>(
      `${API_ENDPOINTS.TENANT_USERS}/${id}`,
      input
    );
    if (!res.data.data) throw new Error(res.data.message || 'Failed to update user');
    return res.data.data;
  },

  async deleteTenantUser(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.TENANT_USERS}/${id}`);
  },
};
