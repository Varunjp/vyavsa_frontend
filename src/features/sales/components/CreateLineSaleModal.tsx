'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createLineSaleSchema, CreateLineSaleInput } from '../schemas/saleSchema';
import { salesService } from '../services/salesService';
import { useToast } from '@/contexts/ToastContext';
import { Bank, Customer, Product } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface CreateLineSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customers: Customer[];
  banks: Bank[];
  products: Product[];
}

export function CreateLineSaleModal({
  isOpen,
  onClose,
  onSuccess,
  customers,
  banks,
  products: _products,
}: CreateLineSaleModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLineSaleInput>({
    resolver: zodResolver(createLineSaleSchema),
    defaultValues: {
      customer_id: '',
      route: '',
      salesman: '',
      note: '',
      sale_date: new Date().toISOString().split('T')[0],
      total_cash_in: 0,
      bank_amount: 0,
      advance_to_apply: 0,
      items: [{ product_name: '', quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedCash = watch('total_cash_in') || 0;
  const watchedBank = watch('bank_amount') || 0;
  const watchedAdvance = watch('advance_to_apply') || 0;

  const totalSaleAmount = watchedItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0
  );
  const totalCollected = Number(watchedCash) + Number(watchedBank) + Number(watchedAdvance);
  const remainingDue = Math.max(0, totalSaleAmount - totalCollected);

  const onSubmit = async (data: CreateLineSaleInput) => {
    setErrorMsg(null);
    try {
      await salesService.createLineSale(data);
      showToast('Line Sale invoice created successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create line sale');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Field Line Sale Invoice"
      size="lg"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Create Invoice
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Select
              label="Select Customer *"
              error={errors.customer_id?.message}
              options={customers.map(c => ({
                value: c.id,
                label: `${c.customer_name} (Due: ₹${c.current_balance})`,
              }))}
              placeholder="-- Select Customer --"
              {...register('customer_id')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Sale Date"
              type="date"
              error={errors.sale_date?.message}
              {...register('sale_date')}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <Input
              label="Route / Territory"
              placeholder="e.g. Market Route A"
              {...register('route')}
            />
          </div>
          <div className="col-md-6">
            <Input label="Salesman / Driver" placeholder="e.g. Ramesh" {...register('salesman')} />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold text-secondary small">Sale Items</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => append({ product_name: '', quantity: 1, unit_price: 0 })}
            >
              Add Item
            </Button>
          </div>

          {fields.map((field, idx) => {
            const lineTotal =
              (Number(watchedItems[idx]?.quantity) || 0) *
              (Number(watchedItems[idx]?.unit_price) || 0);

            return (
              <div key={field.id} className="row g-2 align-items-center mb-2">
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Product or Item description"
                    {...register(`items.${idx}.product_name`)}
                  />
                </div>
                <div className="col-2">
                  <input
                    type="number"
                    step="any"
                    className="form-control form-control-sm"
                    placeholder="Qty"
                    {...register(`items.${idx}.quantity`)}
                  />
                </div>
                <div className="col-2">
                  <input
                    type="number"
                    step="any"
                    className="form-control form-control-sm"
                    placeholder="Rate"
                    {...register(`items.${idx}.unit_price`)}
                  />
                </div>
                <div className="col-2 text-end font-mono small fw-bold">
                  {formatCurrency(lineTotal)}
                </div>
                <div className="col-1 text-center">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-link text-danger p-0"
                      onClick={() => remove(idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payments Split */}
        <div className="p-3 bg-light rounded border mb-3">
          <span className="fw-semibold text-dark small d-block mb-2">
            Payment & Settlement Breakdown
          </span>
          <div className="row g-2">
            <div className="col-md-4">
              <Input
                label="Cash Collected"
                type="number"
                step="any"
                {...register('total_cash_in')}
              />
            </div>
            <div className="col-md-4">
              <Input
                label="Bank / UPI Amount"
                type="number"
                step="any"
                {...register('bank_amount')}
              />
            </div>
            <div className="col-md-4">
              <Select
                label="Receiving Bank"
                options={banks.map(b => ({
                  value: b.id,
                  label: b.bank_name,
                }))}
                placeholder="-- Select Bank --"
                {...register('bank_id')}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
            <div>
              <span className="text-muted small">Total Bill: </span>
              <strong className="font-mono text-dark">{formatCurrency(totalSaleAmount)}</strong>
            </div>
            <div>
              <span className="text-muted small">Collected: </span>
              <strong className="font-mono text-success">{formatCurrency(totalCollected)}</strong>
            </div>
            <div>
              <span className="text-muted small">Remaining Due: </span>
              <strong className="font-mono text-danger">{formatCurrency(remainingDue)}</strong>
            </div>
          </div>
        </div>

        <Input
          label="Notes / Invoice Memo"
          placeholder="Optional invoice note"
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
