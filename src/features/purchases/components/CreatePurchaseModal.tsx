'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createPurchaseSchema, CreatePurchaseInput } from '../schemas/purchaseSchema';
import { purchaseService } from '../services/purchaseService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Supplier } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CreatePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  suppliers: Supplier[];
  banks: Bank[];
}

export function CreatePurchaseModal({
  isOpen,
  onClose,
  onSuccess,
  suppliers,
  banks,
}: CreatePurchaseModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePurchaseInput>({
    resolver: zodResolver(createPurchaseSchema),
    defaultValues: {
      supplier_id: '',
      item: '',
      quantity: 1,
      total_amount: 0,
      total_paid: 0,
      payment_method: 'bank',
      bank_id: '',
    },
  });

  const watchedTotal = watch('total_amount') || 0;
  const watchedPaid = watch('total_paid') || 0;
  const watchedMethod = watch('payment_method');
  const pendingDue = Math.max(0, Number(watchedTotal) - Number(watchedPaid));

  const onSubmit = async (data: CreatePurchaseInput) => {
    setErrorMsg(null);
    try {
      await purchaseService.createPurchase(data);
      showToast('Inventory purchase bill recorded successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record purchase');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Stock Procurement Purchase"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Record Purchase
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Select Supplier / Vendor *"
          options={suppliers.map(s => ({
            value: s.id,
            label: `${s.supplier_name} (Payable: ₹${s.outstanding_payable})`,
          }))}
          placeholder="-- Select Vendor --"
          error={errors.supplier_id?.message}
          {...register('supplier_id')}
        />

        <div className="row g-2 mb-2">
          <div className="col-8">
            <Input
              label="Item / Stock Description *"
              placeholder="e.g. Wheat Flour Bags 50kg"
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

        <div className="row g-2 mb-3">
          <div className="col-6">
            <Input
              label="Total Bill Cost (₹) *"
              type="number"
              step="any"
              error={errors.total_amount?.message}
              {...register('total_amount')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Initial Amount Paid (₹)"
              type="number"
              step="any"
              error={errors.total_paid?.message}
              {...register('total_paid')}
            />
          </div>
        </div>

        {Number(watchedPaid) > 0 && (
          <div className="p-3 bg-light rounded border mb-3">
            <span className="small fw-semibold text-secondary d-block mb-2">
              Payment Settlement Details
            </span>
            <div className="row g-2">
              <div className="col-6">
                <Select
                  label="Disbursement Source"
                  options={[
                    { value: 'bank', label: 'Bank Account' },
                    { value: 'cash', label: 'Cash Drawer' },
                  ]}
                  {...register('payment_method')}
                />
              </div>
              {watchedMethod === 'bank' && (
                <div className="col-6">
                  <Select
                    label="Paying Bank"
                    options={banks.map(b => ({ value: b.id, label: b.bank_name }))}
                    placeholder="-- Select Bank --"
                    {...register('bank_id')}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-3 bg-light rounded border text-end">
          <span className="text-muted small d-block">
            Pending Balance Added to Supplier Payable
          </span>
          <span className="fs-5 fw-bold font-mono text-warning">{formatCurrency(pendingDue)}</span>
        </div>
      </form>
    </Modal>
  );
}
