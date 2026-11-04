'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { recordSalePaymentSchema, RecordSalePaymentInput } from '../schemas/saleSchema';
import { salesService } from '../services/salesService';
import { useToast } from '@/contexts/ToastContext';
import { Bank } from '@/types';

interface RecordSalePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  saleId: string;
  saleType: 'line' | 'counter';
  invoiceNumber?: string;
  remainingBalance?: number;
  banks: Bank[];
}

export function RecordSalePaymentModal({
  isOpen,
  onClose,
  onSuccess,
  saleId,
  saleType,
  invoiceNumber,
  remainingBalance,
  banks,
}: RecordSalePaymentModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordSalePaymentInput>({
    resolver: zodResolver(recordSalePaymentSchema),
    defaultValues: {
      amount: remainingBalance || 0,
      payment_method: 'cash',
      bank_id: '',
      note: '',
    },
  });

  const watchedMethod = watch('payment_method');

  const onSubmit = async (data: RecordSalePaymentInput) => {
    setErrorMsg(null);
    try {
      if (saleType === 'line') {
        await salesService.recordLineSalePayment(saleId, data);
      } else {
        await salesService.recordCounterSalePayment(saleId, data);
      }
      showToast('Payment recorded successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record payment');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Record Payment for Invoice #${invoiceNumber || saleId.slice(0, 8)}`}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Save Payment
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Payment Amount (₹) *"
          type="number"
          step="any"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Select
          label="Payment Method"
          options={[
            { value: 'cash', label: 'Cash (Drawer)' },
            { value: 'bank', label: 'Bank Transfer' },
            { value: 'upi', label: 'UPI / QR' },
            { value: 'cheque', label: 'Cheque' },
          ]}
          {...register('payment_method')}
        />

        {watchedMethod !== 'cash' && (
          <Select
            label="Receiving Bank Account"
            options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
            placeholder="-- Select Bank --"
            {...register('bank_id')}
          />
        )}

        <Input
          label="Reference / Note"
          placeholder="Transaction note or UTR"
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
