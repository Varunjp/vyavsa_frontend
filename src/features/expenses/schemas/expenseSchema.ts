import { z } from 'zod';

export const createExpenseSchema = z.object({
  item: z.string().min(1, 'Expense item description is required'),
  category: z.string().optional(),
  employee_id: z.string().uuid().optional().or(z.literal('')),
  amount: z.coerce.number().positive('Expense amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank', 'split']).default('cash'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  note: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
