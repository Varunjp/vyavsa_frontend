import { z } from 'zod';

export const createPurchaseSchema = z.object({
  supplier_id: z.string().uuid().optional().or(z.literal('')),
  customer_id: z.string().uuid().optional().or(z.literal('')),
  item: z.string().min(1, 'Item or product name is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1').default(1),
  total_amount: z.coerce.number().positive('Total purchase cost must be greater than zero'),
  total_paid: z.coerce.number().min(0).default(0),
  payment_method: z.enum(['cash', 'bank', 'credit']).default('cash'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;

export const purchasePaymentSchema = z.object({
  payment_method: z.enum(['cash', 'bank', 'upi', 'cheque']).default('cash'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  amount: z.coerce.number().positive('Payment amount must be greater than zero'),
  note: z.string().optional(),
});

export type PurchasePaymentInput = z.infer<typeof purchasePaymentSchema>;
