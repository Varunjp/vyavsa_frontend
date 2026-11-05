'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createPartySchema, CreatePartyInput } from '../schemas/partySchema';
import { partyService } from '../services/partyService';
import { useToast } from '@/contexts/ToastContext';
import { Party } from '@/types';

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partyToEdit?: Party | null;
}

export function CreatePartyModal({
  isOpen,
  onClose,
  onSuccess,
  partyToEdit,
}: CreatePartyModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePartyInput>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: partyToEdit?.name || '',
      phone: partyToEdit?.phone || '',
      email: partyToEdit?.email || '',
      address: partyToEdit?.address || '',
      role: partyToEdit?.role || 'both',
      opening_balance: 0,
      opening_payable_balance: 0,
    },
  });

  const onSubmit = async (data: CreatePartyInput) => {
    setErrorMsg(null);
    try {
      if (partyToEdit) {
        await partyService.updateParty(partyToEdit.id, data);
        showToast('Unified Party updated successfully!', 'success');
      } else {
        await partyService.createParty(data);
        showToast('Unified Party created successfully!', 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save party');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={partyToEdit ? 'Edit Unified Party' : 'Add Unified Business Party'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {partyToEdit ? 'Update Party' : 'Save Party'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Party / Business Entity Name *"
          placeholder="e.g. Kisan Trading Co"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Contact Phone"
              placeholder="+91 98000 11223"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="contact@kisantrading.in"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <Input
          label="Address"
          placeholder="Station Road, Shop #4"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="mb-3">
          <Select
            label="Business Role"
            options={[
              { value: 'both', label: 'Dual Role: Both Customer & Supplier' },
              { value: 'customer', label: 'Customer Only' },
              { value: 'supplier', label: 'Supplier Only' },
            ]}
            {...register('role')}
          />
        </div>
      </form>
    </Modal>
  );
}
