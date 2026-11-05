'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createSupplierSchema, CreateSupplierInput } from '../schemas/supplierSchema';
import { supplierService } from '../services/supplierService';
import { useToast } from '@/contexts/ToastContext';
import { Supplier } from '@/types';

interface CreateSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  supplierToEdit?: Supplier | null;
}

export function CreateSupplierModal({
  isOpen,
  onClose,
  onSuccess,
  supplierToEdit,
}: CreateSupplierModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSupplierInput>({
    resolver: zodResolver(createSupplierSchema),
    defaultValues: {
      supplier_name: supplierToEdit?.supplier_name || '',
      phone: supplierToEdit?.phone || '',
      email: supplierToEdit?.email || '',
      address: supplierToEdit?.address || '',
      role: supplierToEdit?.role || 'supplier',
      opening_balance: 0,
      opening_payable_balance: Number(supplierToEdit?.outstanding_payable || 0),
    },
  });

  const onSubmit = async (data: CreateSupplierInput) => {
    setErrorMsg(null);
    try {
      if (supplierToEdit) {
        await supplierService.updateSupplier(supplierToEdit.id, data);
        showToast('Supplier updated successfully!', 'success');
      } else {
        await supplierService.createSupplier(data);
        showToast('Supplier added successfully!', 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save supplier');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplierToEdit ? 'Edit Supplier' : 'Add New Procurement Supplier'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {supplierToEdit ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Supplier / Vendor Name *"
          placeholder="e.g. Apex Agro Mills Ltd"
          error={errors.supplier_name?.message}
          {...register('supplier_name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Contact Phone"
              placeholder="+91 98111 22334"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="vendor@agromills.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <Input
          label="Office / Warehouse Address"
          placeholder="Industrial Area, Sector 5"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <Select
              label="Entity Role"
              options={[
                { value: 'supplier', label: 'Supplier Only' },
                { value: 'both', label: 'Both (Customer & Supplier)' },
              ]}
              {...register('role')}
            />
          </div>
          {!supplierToEdit && (
            <div className="col-md-6">
              <Input
                label="Opening Payable Due (₹)"
                type="number"
                step="any"
                error={errors.opening_payable_balance?.message}
                {...register('opening_payable_balance')}
              />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
