'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { supplierPaymentSchema, SupplierPaymentInput } from '../schemas/supplierSchema';
import { supplierService } from '../services/supplierService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Supplier } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SupplierPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplier: Supplier;
  banks: Bank[];
}

export function SupplierPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  supplier,
  banks,
}: SupplierPaymentModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SupplierPaymentInput>({
    resolver: zodResolver(supplierPaymentSchema),
    defaultValues: {
      amount: Number(supplier.outstanding_payable || 0),
      payment_method: 'bank',
      bank_id: '',
      note: '',
    },
  });

  const watchedMethod = watch('payment_method');

  const onSubmit = async (data: SupplierPaymentInput) => {
    setErrorMsg(null);
    try {
      await supplierService.recordPayment(supplier.id, data);
      showToast(
        `Settlement payment of ₹${data.amount} recorded for ${supplier.supplier_name}`,
        'success'
      );
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record supplier payment');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Disburse Payment: ${supplier.supplier_name}`}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Record Disbursement
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <span className="text-muted d-block">Pending Payable:</span>
        <strong className="fs-5 font-mono text-warning">
          {formatCurrency(supplier.outstanding_payable)}
        </strong>
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
          label="Payment Source"
          options={[
            { value: 'bank', label: 'Bank Account Transfer' },
            { value: 'cash', label: 'Cash Drawer' },
            { value: 'cheque', label: 'Bank Cheque' },
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

        <Input
          label="Cheque / UTR / Reference"
          placeholder="Optional transaction note"
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
