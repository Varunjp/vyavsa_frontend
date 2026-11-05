'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { paySalarySchema, PaySalaryInput } from '../schemas/employeeSchema';
import { employeeService } from '../services/employeeService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, EmployeeSalaryRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface PaySalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  salaryRecord: EmployeeSalaryRecord;
  banks: Bank[];
}

export function PaySalaryModal({
  isOpen,
  onClose,
  onSuccess,
  salaryRecord,
  banks,
}: PaySalaryModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaySalaryInput>({
    resolver: zodResolver(paySalarySchema),
    defaultValues: {
      amount: Number(salaryRecord.balance || 0),
      payment_method: 'bank',
      bank_id: '',
      payment_date: new Date().toISOString().split('T')[0],
      note: 'Salary disbursement',
    },
  });

  const watchedMethod = watch('payment_method');

  const onSubmit = async (data: PaySalaryInput) => {
    setErrorMsg(null);
    try {
      await employeeService.paySalary(salaryRecord.employee_id, data);
      showToast(
        `Salary payment of ₹${data.amount} disbursed to ${salaryRecord.employee_name}!`,
        'success'
      );
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to disburse salary');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disburse Salary: ${salaryRecord.employee_name}`}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Disburse Salary
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Net Pending Salary:</span>
          <strong className="font-mono text-danger fs-6">
            {formatCurrency(salaryRecord.balance)}
          </strong>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Advances Deducted:</span>
          <strong className="font-mono text-muted">
            {formatCurrency(salaryRecord.total_advances)}
          </strong>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Disbursement Amount (₹) *"
          type="number"
          step="any"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Select
          label="Disbursement Source"
          options={[
            { value: 'bank', label: 'Bank Transfer' },
            { value: 'cash', label: 'Cash Drawer' },
            { value: 'cheque', label: 'Cheque' },
            { value: 'upi', label: 'UPI' },
          ]}
          {...register('payment_method')}
        />

        {watchedMethod !== 'cash' && (
          <Select
            label="Disbursing Bank Account"
            options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
            placeholder="-- Select Bank --"
            {...register('bank_id')}
          />
        )}

        <Input label="Payment Date" type="date" {...register('payment_date')} />
        <Input
          label="Transaction Memo"
          placeholder="e.g. October 2026 salary"
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
