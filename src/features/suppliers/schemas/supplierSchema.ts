import { z } from 'zod';

export const createSupplierSchema = z.object({
  supplier_name: z.string().min(2, 'Supplier name must be at least 2 characters'),
  phone: z.string().max(30).optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  role: z.enum(['customer', 'supplier', 'both']).default('supplier'),
  opening_balance: z.coerce.number().min(0).default(0),
  opening_payable_balance: z.coerce.number().min(0).default(0),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;

export const supplierPaymentSchema = z.object({
  amount: z.coerce.number().positive('Disbursement amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank', 'upi', 'cheque']).default('cash'),
  bank_id: z.string().uuid('Invalid bank account').optional().or(z.literal('')),
  note: z.string().optional(),
});

export type SupplierPaymentInput = z.infer<typeof supplierPaymentSchema>;
