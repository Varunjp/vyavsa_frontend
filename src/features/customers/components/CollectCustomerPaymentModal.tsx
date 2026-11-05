'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { collectPaymentSchema, CollectPaymentInput } from '../schemas/customerSchema';
import { customerService } from '../services/customerService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CollectCustomerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customer: Customer;
  banks: Bank[];
  isAdvance?: boolean;
}

export function CollectCustomerPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  customer,
  banks,
  isAdvance = false,
}: CollectCustomerPaymentModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CollectPaymentInput>({
    resolver: zodResolver(collectPaymentSchema),
    defaultValues: {
      amount: isAdvance ? 0 : Number(customer.current_balance || 0),
      payment_method: 'cash',
      bank_id: '',
      note: '',
    },
  });

  const watchedMethod = watch('payment_method');

  const onSubmit = async (data: CollectPaymentInput) => {
    setErrorMsg(null);
    try {
      if (isAdvance) {
        await customerService.collectAdvance(customer.id, data);
        showToast(
          `Advance payment of ₹${data.amount} recorded for ${customer.customer_name}`,
          'success'
        );
      } else {
        await customerService.collectPayment(customer.id, data);
        showToast(`Collection of ₹${data.amount} recorded successfully`, 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process payment');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isAdvance
          ? `Collect Customer Advance (${customer.customer_name})`
          : `Collect Dues Payment (${customer.customer_name})`
      }
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {isAdvance ? 'Record Advance' : 'Record Collection'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <div className="p-2 mb-3 bg-light rounded border small">
        <div className="d-flex justify-content-between">
          <span className="text-muted">Outstanding Due:</span>
          <strong className="font-mono text-danger">
            {formatCurrency(customer.current_balance)}
          </strong>
        </div>
        <div className="d-flex justify-content-between mt-1">
          <span className="text-muted">Current Advance Balance:</span>
          <strong className="font-mono text-success">
            {formatCurrency(customer.advance_balance)}
          </strong>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Collection Amount (₹) *"
          type="number"
          step="any"
          error={errors.amount?.message}
          {...register('amount')}
        />

        <Select
          label="Payment Method"
          options={[
            { value: 'cash', label: 'Physical Cash (Drawer)' },
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
          label="Transaction Memo / Reference"
          placeholder="Receipt or bank UTR"
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
