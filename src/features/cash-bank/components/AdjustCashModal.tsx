'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adjustCashSchema, AdjustCashInput } from '../schemas/cashBankSchema';
import { cashBankService } from '../services/cashBankService';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency } from '@/lib/utils';

interface AdjustCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

export function AdjustCashModal({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}: AdjustCashModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustCashInput>({
    resolver: zodResolver(adjustCashSchema),
    defaultValues: {
      actual_balance: currentBalance,
      reason: '',
    },
  });

  const onSubmit = async (data: AdjustCashInput) => {
    setErrorMsg(null);
    try {
      await cashBankService.adjustCash(data);
      showToast('Drawer cash reconciled successfully with audit entry', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reconcile cash');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reconcile Cash Drawer (Admin Audit)"
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Confirm Reconciled Cash
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <span className="text-muted d-block">Current System Drawer Tally:</span>
        <strong className="fs-5 font-mono text-dark">{formatCurrency(currentBalance)}</strong>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Actual Counted Cash in Drawer (₹) *"
          type="number"
          step="any"
          error={errors.actual_balance?.message}
          {...register('actual_balance')}
        />

        <Input
          label="Audit Explanation Reason *"
          placeholder="e.g. End of day physical cash tally correction"
          error={errors.reason?.message}
          {...register('reason')}
        />
      </form>
    </Modal>
  );
}
