import { describe, it, expect } from 'vitest';
import {
  tenantLoginSchema,
  tenantRegisterSchema,
  verifyResetOTPSchema,
} from '@/features/auth/schemas';

describe('tenantLoginSchema', () => {
  it('validates correct email and password', () => {
    const result = tenantLoginSchema.safeParse({
      email: 'owner@vyavsa.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email formats', () => {
    const result = tenantLoginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects passwords shorter than 6 characters', () => {
    const result = tenantLoginSchema.safeParse({
      email: 'owner@vyavsa.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('verifyResetOTPSchema', () => {
  it('accepts exactly 6 numeric digits', () => {
    const result = verifyResetOTPSchema.safeParse({
      email: 'owner@vyavsa.com',
      otp: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-numeric characters in OTP', () => {
    const result = verifyResetOTPSchema.safeParse({
      email: 'owner@vyavsa.com',
      otp: '12a456',
    });
    expect(result.success).toBe(false);
  });

  it('rejects OTP of incorrect length', () => {
    const result = verifyResetOTPSchema.safeParse({
      email: 'owner@vyavsa.com',
      otp: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('tenantRegisterSchema', () => {
  it('accepts valid tenant onboarding data', () => {
    const result = tenantRegisterSchema.safeParse({
      name: 'Om Supermarket',
      admin_name: 'Ramesh',
      email: 'ramesh@omsupermarket.com',
      password: 'password123',
      phone: '9876543210',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing or empty business name', () => {
    const result = tenantRegisterSchema.safeParse({
      name: '',
      email: 'ramesh@omsupermarket.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });
});
