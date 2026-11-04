import { z } from 'zod';

export const addCashSchema = z.object({
  amount: z.coerce.number().positive('Deposit amount must be greater than zero'),
  description: z.string().max(500).optional(),
  transaction_date: z.string().optional(),
});

export type AddCashInput = z.infer<typeof addCashSchema>;

export const adjustCashSchema = z.object({
  actual_balance: z.coerce.number(),
  reason: z.string().min(3, 'Reconciliation reason is mandatory (min 3 characters)'),
});

export type AdjustCashInput = z.infer<typeof adjustCashSchema>;

export const createBankSchema = z.object({
  bank_name: z.string().min(2, 'Bank name must be at least 2 characters'),
  account_number: z.string().max(100).optional().or(z.literal('')),
  ifsc: z.string().max(50).optional().or(z.literal('')),
  opening_balance: z.coerce.number().min(0).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CreateBankInput = z.infer<typeof createBankSchema>;

export const adjustBankSchema = z.object({
  actual_balance: z.coerce.number(),
  reason: z.string().min(3, 'Reconciliation reason is mandatory (min 3 characters)'),
});

export type AdjustBankInput = z.infer<typeof adjustBankSchema>;
