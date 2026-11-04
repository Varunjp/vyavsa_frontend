'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createExpenseSchema, CreateExpenseInput } from '../schemas/expenseSchema';
import { expenseService } from '../services/expenseService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Employee } from '@/types';

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banks: Bank[];
  employees: Employee[];
}

export function CreateExpenseModal({
  isOpen,
  onClose,
  onSuccess,
  banks,
  employees,
}: CreateExpenseModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      item: '',
      category: 'Utilities',
      employee_id: '',
      amount: 0,
      payment_method: 'cash',
      bank_id: '',
      note: '',
    },
  });

  const watchedMethod = watch('payment_method');

  const onSubmit = async (data: CreateExpenseInput) => {
    setErrorMsg(null);
    try {
      await expenseService.createExpense(data);
      showToast('Operating expense recorded successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record expense');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Operating Expense"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Record Expense
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Expense Description *"
          placeholder="e.g. Shop electricity bill or truck diesel"
          error={errors.item?.message}
          {...register('item')}
        />

        <div className="row g-2 mb-2">
          <div className="col-6">
            <Select
              label="Expense Category"
              options={[
                { value: 'Utilities', label: 'Utilities (Power, Water)' },
                { value: 'Rent', label: 'Shop / Warehouse Rent' },
                { value: 'Fuel', label: 'Vehicle Fuel & Freight' },
                { value: 'Tea & Snacks', label: 'Refreshments & Hospitality' },
                { value: 'Repairs', label: 'Maintenance & Repairs' },
                { value: 'Other', label: 'Miscellaneous' },
              ]}
              {...register('category')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Amount (₹) *"
              type="number"
              step="any"
              error={errors.amount?.message}
              {...register('amount')}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <Select
              label="Payment Source"
              options={[
                { value: 'cash', label: 'Physical Cash Drawer' },
                { value: 'bank', label: 'Bank Account Transfer' },
              ]}
              {...register('payment_method')}
            />
          </div>
          {watchedMethod === 'bank' ? (
            <div className="col-6">
              <Select
                label="Bank Account"
                options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
                placeholder="-- Select Bank --"
                {...register('bank_id')}
              />
            </div>
          ) : (
            <div className="col-6">
              <Select
                label="Incurred By Staff (Optional)"
                options={employees.map(e => ({ value: e.id, label: e.name }))}
                placeholder="-- None / General --"
                {...register('employee_id')}
              />
            </div>
          )}
        </div>

        <Input label="Reference Note" placeholder="Invoice / receipt memo" {...register('note')} />
      </form>
    </Modal>
  );
}
