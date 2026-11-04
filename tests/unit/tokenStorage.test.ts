import { describe, it, expect, beforeEach } from 'vitest';
import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearAllTokens,
  isTokenExpired,
} from '@/lib/auth/tokenStorage';

describe('tokenStorage', () => {
  beforeEach(() => {
    clearAllTokens();
  });

  it('stores and retrieves access and refresh tokens correctly', () => {
    setTokens('sample_access_jwt', 'sample_refresh_jwt');
    expect(getAccessToken()).toBe('sample_access_jwt');
    expect(getRefreshToken()).toBe('sample_refresh_jwt');
  });

  it('clears all stored tokens', () => {
    setTokens('token1', 'token2');
    clearAllTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });

  it('correctly detects token expiration', () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired('')).toBe(true);
    expect(isTokenExpired('malformed.token')).toBe(true);

    // Create a mock unexpired JWT token with future exp
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 'user-1', exp: futureExp }));
    const validToken = `${header}.${payload}.signature`;

    expect(isTokenExpired(validToken)).toBe(false);

    // Create a mock expired JWT token with past exp
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    const expiredPayload = btoa(JSON.stringify({ sub: 'user-1', exp: pastExp }));
    const expiredToken = `${header}.${expiredPayload}.signature`;

    expect(isTokenExpired(expiredToken)).toBe(true);
  });
});
