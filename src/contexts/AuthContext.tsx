'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getStoredUser, isTokenExpired } from '@/lib/auth/tokenStorage';
import { UserProfile } from '@/types';
import { authService } from '@/features/auth/services/authService';
import { AuthContextState, PlatformLoginInput, TenantLoginInput } from '@/features/auth/types';

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initSession() {
      const token = getAccessToken();
      const isPlatform =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/platform');

      if (!token || isTokenExpired(token)) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Check stored user profile first for instant UI availability
      const cached = getStoredUser(isPlatform);
      if (cached) {
        setUser(cached);
      }

      try {
        const liveUser = await authService.getMe();
        setUser(liveUser);
      } catch {
        // If live profile fetch fails, session may be invalid
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const loginTenant = async (input: TenantLoginInput) => {
    setIsLoading(true);
    try {
      const tokenResp = await authService.loginTenant(input);
      setUser(tokenResp.user);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const loginPlatform = async (input: PlatformLoginInput) => {
    setIsLoading(true);
    try {
      const tokenResp = await authService.loginPlatform(input);
      setUser(tokenResp.user);
      router.push('/platform/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      const isPlatform =
        typeof window !== 'undefined' && window.location.pathname.startsWith('/platform');
      router.push(isPlatform ? '/platform/login' : '/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const freshUser = await authService.getMe();
      setUser(freshUser);
    } catch {
      // Ignored
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        loginTenant,
        loginPlatform,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
