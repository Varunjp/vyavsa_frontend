'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createCounterSaleSchema, CreateCounterSaleInput } from '../schemas/saleSchema';
import { salesService } from '../services/salesService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Customer } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CreateCounterSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customers: Customer[];
  banks: Bank[];
}

export function CreateCounterSaleModal({
  isOpen,
  onClose,
  onSuccess,
  customers,
  banks,
}: CreateCounterSaleModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCounterSaleInput>({
    resolver: zodResolver(createCounterSaleSchema),
    defaultValues: {
      customer_id: '',
      customer_name: 'Walk-in Retail Customer',
      item: '',
      price: 0,
      quantity: 1,
      discount: 0,
      payment_method: 'cash',
      cash: 0,
      bank_amount: 0,
      sale_date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedPrice = watch('price') || 0;
  const watchedQty = watch('quantity') || 1;
  const watchedDiscount = watch('discount') || 0;
  const watchedPaymentMethod = watch('payment_method');

  const subtotal = Number(watchedPrice) * Number(watchedQty);
  const totalAmount = Math.max(0, subtotal - Number(watchedDiscount));

  const onSubmit = async (data: CreateCounterSaleInput) => {
    setErrorMsg(null);
    try {
      const payload: CreateCounterSaleInput = {
        ...data,
        subtotal,
      };
      if (data.payment_method === 'cash') {
        payload.cash = totalAmount;
        payload.bank_amount = 0;
      } else if (data.payment_method === 'bank') {
        payload.bank_amount = totalAmount;
        payload.cash = 0;
      }
      await salesService.createCounterSale(payload);
      showToast('Counter Sale receipt generated successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record counter sale');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Retail Counter Sale"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Issue Receipt
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <Select
            label="Optional Customer Khata"
            options={customers.map(c => ({
              value: c.id,
              label: `${c.customer_name} (Due: ₹${c.current_balance})`,
            }))}
            placeholder="-- Walk-in Retail Customer (No Khata) --"
            {...register('customer_id')}
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col-8">
            <Input
              label="Item / Product *"
              placeholder="e.g. Basmati Rice 25kg"
              error={errors.item?.message}
              {...register('item')}
            />
          </div>
          <div className="col-4">
            <Input
              label="Quantity *"
              type="number"
              step="any"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>
        </div>

        <div className="row g-2 mb-2">
          <div className="col-6">
            <Input
              label="Unit Price (₹) *"
              type="number"
              step="any"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>
          <div className="col-6">
            <Input label="Discount (₹)" type="number" step="any" {...register('discount')} />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <Select
              label="Payment Method"
              options={[
                { value: 'cash', label: 'Cash (Drawer)' },
                { value: 'bank', label: 'Bank / UPI Direct' },
                { value: 'split', label: 'Split (Cash + Bank)' },
                { value: 'credit', label: 'Store Credit / Due' },
              ]}
              {...register('payment_method')}
            />
          </div>
          <div className="col-6">
            <Input label="Sale Date" type="date" {...register('sale_date')} />
          </div>
        </div>

        {watchedPaymentMethod === 'bank' && (
          <div className="mb-3">
            <Select
              label="Bank Account"
              options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
              placeholder="-- Select Bank --"
              {...register('bank_id')}
            />
          </div>
        )}

        {watchedPaymentMethod === 'split' && (
          <div className="row g-2 mb-3 p-2 bg-light rounded border">
            <div className="col-6">
              <Input label="Cash Amount" type="number" step="any" {...register('cash')} />
            </div>
            <div className="col-6">
              <Input label="Bank Amount" type="number" step="any" {...register('bank_amount')} />
            </div>
            <div className="col-12">
              <Select
                label="Receiving Bank"
                options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
                placeholder="-- Select Bank --"
                {...register('bank_id')}
              />
            </div>
          </div>
        )}

        <div className="p-3 bg-light rounded border text-end">
          <span className="text-muted small d-block">Calculated Total Bill</span>
          <span className="fs-4 fw-bold font-mono text-dark">{formatCurrency(totalAmount)}</span>
        </div>
      </form>
    </Modal>
  );
}
