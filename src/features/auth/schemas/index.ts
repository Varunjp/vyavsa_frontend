import { z } from 'zod';

export const tenantLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  tenant_id: z.string().uuid().optional().or(z.literal('')),
});

export const platformLoginSchema = z.object({
  identifier: z.string().min(3, 'Username or email identifier is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const tenantRegisterSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters').max(255),
  admin_name: z
    .string()
    .min(2, 'Admin name must be at least 2 characters')
    .max(255)
    .optional()
    .or(z.literal('')),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(72),
  phone: z.string().max(30).optional().or(z.literal('')),
  plan_id: z.string().uuid().optional().or(z.literal('')),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const verifyResetOTPSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^[0-9]+$/, 'OTP must be numeric'),
});

export const resetPasswordSchema = z
  .object({
    reset_token: z.string().min(1, 'Reset token is required'),
    new_password: z.string().min(6, 'Password must be at least 6 characters').max(72),
    confirm_password: z.string().min(6, 'Confirm password is required'),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });
