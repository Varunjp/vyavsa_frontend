'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createTenantUserSchema, CreateTenantUserInput } from '../schemas/settingsSchema';
import { settingsService } from '../services/settingsService';
import { useToast } from '@/contexts/ToastContext';

interface CreateTenantUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTenantUserModal({ isOpen, onClose, onSuccess }: CreateTenantUserModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTenantUserInput>({
    resolver: zodResolver(createTenantUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: CreateTenantUserInput) => {
    setErrorMsg(null);
    try {
      await settingsService.createTenantUser(data);
      showToast(`User account created for ${data.name}!`, 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add user');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Create User Account
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name *"
          placeholder="e.g. Priya Sharma"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address (Login Identity) *"
          type="email"
          placeholder="priya@business.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Temporary Password *"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="mb-3">
          <Select
            label="Assigned RBAC Role *"
            options={[
              { value: 'admin', label: 'Tenant Admin (Full Access & Reconciliation)' },
              { value: 'office', label: 'Office Role (Counter Sales, Purchases, Payroll)' },
              { value: 'sales', label: 'Sales Role (Field Line Distribution & Collections)' },
              { value: 'line', label: 'Line Staff' },
              { value: 'user', label: 'Standard Viewer' },
            ]}
            {...register('role')}
          />
        </div>
      </form>
    </Modal>
  );
}
