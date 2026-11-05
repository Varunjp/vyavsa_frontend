import { z } from 'zod';

export const updateSettingsSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  address_line1: z.string().max(255).optional().or(z.literal('')),
  address_line2: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  postal_code: z.string().max(20).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  invoice_footer_heading: z.string().max(255).optional().or(z.literal('')),
  invoice_footer_paragraph: z.string().max(1000).optional().or(z.literal('')),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export const createTenantUserSchema = z.object({
  name: z.string().min(2, 'User name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'office', 'sales', 'line', 'user']).default('user'),
});

export type CreateTenantUserInput = z.infer<typeof createTenantUserSchema>;
