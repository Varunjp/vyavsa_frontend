import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import {
  clearAllTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  setTokens,
} from '@/lib/auth/tokenStorage';
import { parseApiError } from '@/lib/errors';
import { ApiResponse, TokenResponse } from '@/types';

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Single-flight refresh token mutex
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If a request already has an Authorization header, preserve it
    if (!config.headers.Authorization) {
      let token = getAccessToken();

      // Proactive refresh: if token is already expired and refresh token is available, refresh before dispatching
      if (token && isTokenExpired(token, 10)) {
        const rf = getRefreshToken();
        if (
          rf &&
          !config.url?.includes('/auth/refresh') &&
          !config.url?.includes('/auth/tenant/login')
        ) {
          token = await refreshAccessToken();
        }
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: unknown) => Promise.reject(parseApiError(error))
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Detect 401 Unauthorized and attempt single-flight token rotation
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Do not attempt refresh on login or refresh endpoints themselves
      if (
        originalRequest.url?.includes('/auth/tenant/login') ||
        originalRequest.url?.includes('/auth/platform/login') ||
        originalRequest.url?.includes('/auth/refresh')
      ) {
        return Promise.reject(parseApiError(error));
      }

      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        clearAllTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          const isPlatform = window.location.pathname.startsWith('/platform');
          window.location.href = isPlatform ? '/platform/login' : '/login';
        }
        return Promise.reject(parseApiError(refreshErr));
      }
    }

    return Promise.reject(parseApiError(error));
  }
);

/**
 * Executes token refresh exactly once for multiple simultaneous 401 failures.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      // Use raw axios call to bypass the interceptor loop
      const response = await axios.post<ApiResponse<TokenResponse>>(
        `${env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refresh_token: refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const tokenData = response.data?.data;
      if (tokenData?.access_token) {
        const isPlatform =
          typeof window !== 'undefined' && window.location.pathname.startsWith('/platform');
        setTokens(tokenData.access_token, tokenData.refresh_token, isPlatform);
        return tokenData.access_token;
      }
      return null;
    } catch (err) {
      clearAllTokens();
      throw err;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Standard typed request helper
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return response.data?.data as T;
  } catch (error) {
    throw parseApiError(error);
  }
}
