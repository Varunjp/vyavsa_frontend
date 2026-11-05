import { z } from 'zod';

export const saleItemSchema = z.object({
  product_id: z.string().uuid().optional().or(z.literal('')),
  product_name: z.string().min(1, 'Product name is required'),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  unit_price: z.coerce.number().min(0, 'Price cannot be negative'),
});

export const createLineSaleSchema = z.object({
  customer_id: z.string().uuid('Customer selection is required'),
  route: z.string().optional(),
  salesman: z.string().optional(),
  note: z.string().optional(),
  sale_date: z.string().optional(),
  total_cash_in: z.coerce.number().min(0).default(0),
  bank_amount: z.coerce.number().min(0).default(0),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  advance_to_apply: z.coerce.number().min(0).default(0),
  items: z.array(saleItemSchema).min(1, 'At least one sale item is required'),
});

export type CreateLineSaleInput = z.infer<typeof createLineSaleSchema>;

export const createCounterSaleSchema = z.object({
  customer_id: z.string().uuid().optional().or(z.literal('')),
  customer_name: z.string().optional(),
  item: z.string().min(1, 'Item or description is required'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  quantity: z.coerce.number().min(1).default(1),
  subtotal: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).default(0),
  payment_method: z.enum(['cash', 'bank', 'split', 'credit']).default('cash'),
  cash: z.coerce.number().min(0).default(0),
  bank_amount: z.coerce.number().min(0).default(0),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  sale_date: z.string().optional(),
});

export type CreateCounterSaleInput = z.infer<typeof createCounterSaleSchema>;

export const recordSalePaymentSchema = z.object({
  payment_method: z.enum(['cash', 'bank', 'upi', 'cheque']).default('cash'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  amount: z.coerce.number().positive('Payment amount must be greater than zero'),
  note: z.string().optional(),
});

export type RecordSalePaymentInput = z.infer<typeof recordSalePaymentSchema>;
