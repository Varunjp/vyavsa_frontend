import { z } from 'zod';

export const createPartySchema = z.object({
  name: z.string().min(2, 'Party name must be at least 2 characters'),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  role: z.enum(['customer', 'supplier', 'both']).default('both'),
  opening_balance: z.coerce.number().min(0).default(0),
  opening_payable_balance: z.coerce.number().min(0).default(0),
});

export type CreatePartyInput = z.infer<typeof createPartySchema>;

export const createContraSettlementSchema = z.object({
  party_id: z.string().uuid('Party selection is required'),
  amount: z.coerce.number().positive('Settlement offset amount must be greater than zero'),
  settlement_date: z.string().optional(),
  note: z.string().optional(),
});

export type CreateContraSettlementInput = z.infer<typeof createContraSettlementSchema>;
