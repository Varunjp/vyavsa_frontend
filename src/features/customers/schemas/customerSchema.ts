import { z } from 'zod';

export const createCustomerSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  role: z.enum(['customer', 'supplier', 'both']).default('customer'),
  opening_balance: z.coerce.number().min(0, 'Opening balance cannot be negative').default(0),
  opening_payable_balance: z.coerce.number().min(0).default(0),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const collectPaymentSchema = z.object({
  amount: z.coerce.number().positive('Payment amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank', 'upi', 'cheque']).default('cash'),
  bank_id: z.string().uuid('Invalid bank account').optional().or(z.literal('')),
  note: z.string().optional(),
});

export type CollectPaymentInput = z.infer<typeof collectPaymentSchema>;

export const collectAdvanceSchema = z.object({
  amount: z.coerce.number().positive('Advance amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank', 'upi', 'cheque']).default('cash'),
  bank_id: z.string().uuid('Invalid bank account').optional().or(z.literal('')),
  note: z.string().optional(),
});

export type CollectAdvanceInput = z.infer<typeof collectAdvanceSchema>;

export const applyAdvanceSchema = z.object({
  advance_id: z.string().uuid('Invalid advance record').optional().or(z.literal('')),
  amount: z.coerce.number().positive('Amount must be greater than zero').optional(),
});

export type ApplyAdvanceInput = z.infer<typeof applyAdvanceSchema>;

export const adjustCustomerBalanceSchema = z.object({
  actual_balance: z.coerce.number(),
  reason: z.string().min(3, 'Adjustment reason is required (min 3 characters)'),
});

export type AdjustCustomerBalanceInput = z.infer<typeof adjustCustomerBalanceSchema>;
