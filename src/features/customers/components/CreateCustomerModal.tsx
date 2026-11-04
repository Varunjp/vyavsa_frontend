'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createCustomerSchema, CreateCustomerInput } from '../schemas/customerSchema';
import { customerService } from '../services/customerService';
import { useToast } from '@/contexts/ToastContext';
import { Customer } from '@/types';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  customerToEdit?: Customer | null;
}

export function CreateCustomerModal({
  isOpen,
  onClose,
  onSuccess,
  customerToEdit,
}: CreateCustomerModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      customer_name: customerToEdit?.customer_name || '',
      phone: customerToEdit?.phone || '',
      email: customerToEdit?.email || '',
      address: customerToEdit?.address || '',
      role: customerToEdit?.role || 'customer',
      opening_balance: Number(customerToEdit?.opening_balance || 0),
      opening_payable_balance: Number(customerToEdit?.opening_payable_balance || 0),
    },
  });

  const onSubmit = async (data: CreateCustomerInput) => {
    setErrorMsg(null);
    try {
      if (customerToEdit) {
        await customerService.updateCustomer(customerToEdit.id, data);
        showToast('Customer updated successfully!', 'success');
      } else {
        await customerService.createCustomer(data);
        showToast('Customer created successfully!', 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save customer');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerToEdit ? 'Edit Customer Details' : 'Add New Business Customer'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {customerToEdit ? 'Update Customer' : 'Create Customer'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Customer / Store Name *"
          placeholder="e.g. Laxmi General Store"
          error={errors.customer_name?.message}
          {...register('customer_name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Contact Phone"
              placeholder="+91 98765 43210"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="store@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <Input
          label="Billing / Shipping Address"
          placeholder="Market Street, Shop #12"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <Select
              label="Entity Role"
              options={[
                { value: 'customer', label: 'Customer Only' },
                { value: 'supplier', label: 'Supplier Only' },
                { value: 'both', label: 'Both (Customer & Supplier)' },
              ]}
              {...register('role')}
            />
          </div>
          {!customerToEdit && (
            <div className="col-md-6">
              <Input
                label="Opening Receivable Due (₹)"
                type="number"
                step="any"
                error={errors.opening_balance?.message}
                {...register('opening_balance')}
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
