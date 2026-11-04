'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adjustBankSchema, AdjustBankInput } from '../schemas/cashBankSchema';
import { cashBankService } from '../services/cashBankService';
import { useToast } from '@/contexts/ToastContext';
import { Bank } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AdjustBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bank: Bank;
}

export function AdjustBankModal({ isOpen, onClose, onSuccess, bank }: AdjustBankModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdjustBankInput>({
    resolver: zodResolver(adjustBankSchema),
    defaultValues: {
      actual_balance: Number(bank.current_balance || 0),
      reason: '',
    },
  });

  const onSubmit = async (data: AdjustBankInput) => {
    setErrorMsg(null);
    try {
      await cashBankService.adjustBankBalance(bank.id, data);
      showToast(`${bank.bank_name} balance reconciled successfully`, 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to adjust bank balance');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reconcile Bank: ${bank.bank_name}`}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Confirm Reconciled Balance
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <span className="text-muted d-block">Current Recorded Balance:</span>
        <strong className="fs-5 font-mono text-dark">{formatCurrency(bank.current_balance)}</strong>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Actual Verified Passbook Balance (₹) *"
          type="number"
          step="any"
          error={errors.actual_balance?.message}
          {...register('actual_balance')}
        />

        <Input
          label="Audit Explanation Reason *"
          placeholder="e.g. Bank statement reconciliation"
          error={errors.reason?.message}
          {...register('reason')}
        />
      </form>
    </Modal>
  );
}
