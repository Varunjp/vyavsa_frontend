import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Employee name must be at least 2 characters'),
  phone: z.string().max(30).optional().or(z.literal('')),
  salary: z.coerce.number().min(0).optional(),
  ot_rate: z.coerce.number().min(0).default(0),
  status: z.enum(['active', 'inactive', 'terminated']).default('active'),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const recordAttendanceSchema = z.object({
  employee_id: z.string().uuid('Employee selection is required'),
  date: z.string().optional(),
  status: z.enum(['present', 'absent', 'half_day', 'leave']).default('present'),
  daily_salary: z.coerce.number().min(0).optional(),
  ot_amount: z.coerce.number().min(0).default(0),
  advance: z.coerce.number().min(0).default(0),
});

export type RecordAttendanceInput = z.infer<typeof recordAttendanceSchema>;

export const recordOvertimeSchema = z.object({
  employee_id: z.string().uuid('Employee selection is required'),
  date: z.string().optional(),
  amount: z.coerce.number().positive('Overtime amount must be greater than zero'),
  reference_id: z.string().optional(),
  note: z.string().optional(),
});

export type RecordOvertimeInput = z.infer<typeof recordOvertimeSchema>;

export const recordAdvanceSchema = z.object({
  employee_id: z.string().uuid('Employee selection is required'),
  date: z.string().optional(),
  amount: z.coerce.number().positive('Advance amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank']).default('cash'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  note: z.string().optional(),
});

export type RecordAdvanceInput = z.infer<typeof recordAdvanceSchema>;

export const paySalarySchema = z.object({
  amount: z.coerce.number().positive('Salary disbursement amount must be greater than zero'),
  payment_method: z.enum(['cash', 'bank', 'cheque', 'upi']).default('bank'),
  bank_id: z.string().uuid().optional().or(z.literal('')),
  payment_date: z.string().optional(),
  note: z.string().optional(),
});

export type PaySalaryInput = z.infer<typeof paySalarySchema>;
