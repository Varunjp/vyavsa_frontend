'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { addCashSchema, AddCashInput } from '../schemas/cashBankSchema';
import { cashBankService } from '../services/cashBankService';
import { useToast } from '@/contexts/ToastContext';

interface AddCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddCashModal({ isOpen, onClose, onSuccess }: AddCashModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCashInput>({
    resolver: zodResolver(addCashSchema),
    defaultValues: {
      amount: 0,
      description: 'Owner cash deposit into drawer',
      transaction_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: AddCashInput) => {
    setErrorMsg(null);
    try {
      await cashBankService.addCash(data);
      showToast(`Added ₹${data.amount} to physical drawer cash!`, 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add cash');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deposit Cash into Physical Drawer"
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Deposit Cash
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Deposit Amount (₹) *"
          type="number"
          step="any"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Input
          label="Deposit Date"
          type="date"
          error={errors.transaction_date?.message}
          {...register('transaction_date')}
        />

        <Input
          label="Description / Purpose"
          placeholder="e.g. Opening float deposit"
          error={errors.description?.message}
          {...register('description')}
        />
      </form>
    </Modal>
  );
}
