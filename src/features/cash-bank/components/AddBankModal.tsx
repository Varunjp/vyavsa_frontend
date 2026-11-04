'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createBankSchema, CreateBankInput } from '../schemas/cashBankSchema';
import { cashBankService } from '../services/cashBankService';
import { useToast } from '@/contexts/ToastContext';
import { Bank } from '@/types';

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bankToEdit?: Bank | null;
}

export function AddBankModal({ isOpen, onClose, onSuccess, bankToEdit }: AddBankModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateBankInput>({
    resolver: zodResolver(createBankSchema),
    defaultValues: {
      bank_name: bankToEdit?.bank_name || '',
      account_number: bankToEdit?.account_number || '',
      ifsc: bankToEdit?.ifsc || '',
      opening_balance: Number(bankToEdit?.current_balance || 0),
      status: bankToEdit?.status || 'active',
    },
  });

  const onSubmit = async (data: CreateBankInput) => {
    setErrorMsg(null);
    try {
      if (bankToEdit) {
        await cashBankService.updateBank(bankToEdit.id, data);
        showToast('Bank account updated successfully!', 'success');
      } else {
        await cashBankService.createBank(data);
        showToast('Bank account connected successfully!', 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save bank account');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bankToEdit ? 'Edit Bank Account' : 'Connect New Bank Account'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {bankToEdit ? 'Update Account' : 'Connect Account'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Bank & Branch Name *"
          placeholder="e.g. State Bank of India - Main Branch"
          error={errors.bank_name?.message}
          {...register('bank_name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Account Number"
              placeholder="e.g. 10293847561"
              error={errors.account_number?.message}
              {...register('account_number')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="IFSC Code"
              placeholder="e.g. SBIN0001234"
              error={errors.ifsc?.message}
              {...register('ifsc')}
            />
          </div>
        </div>

        {!bankToEdit && (
          <Input
            label="Initial Opening Balance (₹)"
            type="number"
            step="any"
            error={errors.opening_balance?.message}
            {...register('opening_balance')}
          />
        )}
      </form>
    </Modal>
  );
}
