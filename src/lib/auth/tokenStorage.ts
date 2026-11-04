import { STORAGE_KEYS } from '@/lib/constants';
import { UserProfile } from '@/types';

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

function safeGetStorage(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
    // Also mirror to localStorage for platform/tenant persistence across tabs
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

function safeRemoveStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
}

export function getAccessToken(): string | null {
  if (memoryAccessToken) return memoryAccessToken;
  const stored =
    safeGetStorage(STORAGE_KEYS.ACCESS_TOKEN) || safeGetStorage(STORAGE_KEYS.PLATFORM_ACCESS_TOKEN);
  if (stored) {
    memoryAccessToken = stored;
  }
  return memoryAccessToken;
}

export function getRefreshToken(): string | null {
  if (memoryRefreshToken) return memoryRefreshToken;
  const stored =
    safeGetStorage(STORAGE_KEYS.REFRESH_TOKEN) ||
    safeGetStorage(STORAGE_KEYS.PLATFORM_REFRESH_TOKEN);
  if (stored) {
    memoryRefreshToken = stored;
  }
  return memoryRefreshToken;
}

export function setTokens(accessToken: string, refreshToken?: string, isPlatform = false): void {
  memoryAccessToken = accessToken;
  const accessKey = isPlatform ? STORAGE_KEYS.PLATFORM_ACCESS_TOKEN : STORAGE_KEYS.ACCESS_TOKEN;
  safeSetStorage(accessKey, accessToken);

  if (refreshToken) {
    memoryRefreshToken = refreshToken;
    const refreshKey = isPlatform
      ? STORAGE_KEYS.PLATFORM_REFRESH_TOKEN
      : STORAGE_KEYS.REFRESH_TOKEN;
    safeSetStorage(refreshKey, refreshToken);
  }
}

export function getStoredUser(isPlatform = false): UserProfile | null {
  const key = isPlatform ? STORAGE_KEYS.PLATFORM_USER : STORAGE_KEYS.USER;
  const raw = safeGetStorage(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile, isPlatform = false): void {
  const key = isPlatform ? STORAGE_KEYS.PLATFORM_USER : STORAGE_KEYS.USER;
  safeSetStorage(key, JSON.stringify(user));
}

export function clearAllTokens(): void {
  memoryAccessToken = null;
  memoryRefreshToken = null;
  safeRemoveStorage(STORAGE_KEYS.ACCESS_TOKEN);
  safeRemoveStorage(STORAGE_KEYS.REFRESH_TOKEN);
  safeRemoveStorage(STORAGE_KEYS.USER);
  safeRemoveStorage(STORAGE_KEYS.PLATFORM_ACCESS_TOKEN);
  safeRemoveStorage(STORAGE_KEYS.PLATFORM_REFRESH_TOKEN);
  safeRemoveStorage(STORAGE_KEYS.PLATFORM_USER);
  safeRemoveStorage(STORAGE_KEYS.RESET_TOKEN);
}

export function isTokenExpired(token: string | null, thresholdSeconds = 10): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds + thresholdSeconds;
  } catch {
    return true;
  }
}
