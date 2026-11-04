import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import { clearAllTokens, setStoredUser, setTokens } from '@/lib/auth/tokenStorage';
import { ApiResponse, TokenResponse, UserProfile } from '@/types';
import {
  ForgotPasswordInput,
  PlatformLoginInput,
  ResetPasswordInput,
  TenantLoginInput,
  TenantRegisterInput,
  TenantRegisterResponseData,
  VerifyResetOTPInput,
} from '../types';

export const authService = {
  async loginTenant(input: TenantLoginInput): Promise<TokenResponse> {
    const payload: Record<string, string> = {
      email: input.email.trim(),
      password: input.password,
    };
    if (input.tenant_id) {
      payload.tenant_id = input.tenant_id;
    }

    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      API_ENDPOINTS.AUTH_TENANT_LOGIN,
      payload
    );
    const data = res.data.data;
    if (!data) throw new Error(res.data.message || 'Login failed');

    setTokens(data.access_token, data.refresh_token, false);
    setStoredUser(data.user, false);
    return data;
  },

  async loginPlatform(input: PlatformLoginInput): Promise<TokenResponse> {
    const payload = {
      identifier: input.identifier.trim(),
      password: input.password,
    };

    const res = await apiClient.post<ApiResponse<TokenResponse>>(
      API_ENDPOINTS.AUTH_PLATFORM_LOGIN,
      payload
    );
    const data = res.data.data;
    if (!data) throw new Error(res.data.message || 'Platform login failed');

    setTokens(data.access_token, data.refresh_token, true);
    setStoredUser(data.user, true);
    return data;
  },

  async registerTenant(input: TenantRegisterInput): Promise<TenantRegisterResponseData> {
    const res = await apiClient.post<ApiResponse<TenantRegisterResponseData>>(
      API_ENDPOINTS.AUTH_REGISTER,
      input
    );
    const data = res.data.data;
    if (!data) throw new Error(res.data.message || 'Registration failed');

    if (data.tokens) {
      setTokens(data.tokens.access_token, data.tokens.refresh_token, false);
      if (data.tokens.user) {
        setStoredUser(data.tokens.user, false);
      }
    }
    return data;
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<ApiResponse<UserProfile>>(API_ENDPOINTS.AUTH_ME);
    const user = res.data.data;
    if (!user) throw new Error('Failed to retrieve user profile');
    return user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAllTokens();
    }
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<string> {
    const res = await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, input);
    return res.data.message || 'An OTP has been dispatched to your email address.';
  },

  async verifyResetOTP(input: VerifyResetOTPInput): Promise<string> {
    const res = await apiClient.post<ApiResponse<{ reset_token: string }>>(
      API_ENDPOINTS.AUTH_VERIFY_RESET_OTP,
      input
    );
    const resetToken = res.data.data?.reset_token;
    if (!resetToken) throw new Error('Reset token missing from verification response');
    return resetToken;
  },

  async resetPassword(input: ResetPasswordInput): Promise<string> {
    const res = await apiClient.post<ApiResponse<null>>(API_ENDPOINTS.AUTH_RESET_PASSWORD, input);
    return res.data.message || 'Password reset successfully.';
  },
};
