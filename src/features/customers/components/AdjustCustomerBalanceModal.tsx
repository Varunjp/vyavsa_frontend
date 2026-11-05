'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adjustCustomerBalanceSchema, AdjustCustomerBalanceInput } from '../schemas/customerSchema';
import { customerService } from '../services/customerService';
import { useToast } from '@/contexts/ToastContext';
import { Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AdjustCustomerBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: Customer;
}

export function AdjustCustomerBalanceModal({
  isOpen,
  onClose,
  onSuccess,
  customer,
}: AdjustCustomerBalanceModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustCustomerBalanceInput>({
    resolver: zodResolver(adjustCustomerBalanceSchema),
    defaultValues: {
      actual_balance: Number(customer.current_balance || 0),
      reason: '',
    },
  });

  const onSubmit = async (data: AdjustCustomerBalanceInput) => {
    setErrorMsg(null);
    try {
      await customerService.adjustBalance(customer.id, data);
      showToast('Customer balance reconciled successfully with audit log', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust balance');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reconcile Balance: ${customer.customer_name}`}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Confirm Adjustment
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <span className="text-muted d-block">Current Recorded Balance:</span>
        <strong className="fs-5 font-mono text-dark">
          {formatCurrency(customer.current_balance)}
        </strong>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Adjusted Balance (₹) *"
          type="number"
          step="any"
          error={errors.actual_balance?.message}
          {...register('actual_balance')}
        />

        <Input
          label="Audit Justification Reason *"
          placeholder="e.g. Reconciliation discrepancy resolution"
          error={errors.reason?.message}
          {...register('reason')}
        />
      </form>
    </Modal>
  );
}
