import { z } from 'zod';

export const onboardTenantSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  email: z.string().email('Invalid organization email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  admin_name: z
    .string()
    .min(2, 'Admin name must be at least 2 characters')
    .optional()
    .or(z.literal('')),
  admin_email: z.string().email('Invalid admin email').optional().or(z.literal('')),
  admin_password: z.string().min(6, 'Admin password must be at least 6 characters'),
  plan_id: z.string().uuid('Please select an initial subscription plan'),
});

export type OnboardTenantInput = z.infer<typeof onboardTenantSchema>;

export const createPlanSchema = z.object({
  plan_name: z.string().min(2, 'Plan name must be at least 2 characters'),
  note: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  billing_interval: z.enum(['monthly', 'yearly']).default('monthly'),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export type CreatePlanInput = z.infer<typeof createPlanSchema>;

export const updatePlatformTenantSchema = z.object({
  name: z.string().min(2, 'Tenant name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(30).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
});

export type UpdatePlatformTenantInput = z.infer<typeof updatePlatformTenantSchema>;
