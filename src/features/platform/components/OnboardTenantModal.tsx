'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { onboardTenantSchema, OnboardTenantInput } from '../schemas/platformSchema';
import { platformService } from '../services/platformService';
import { useToast } from '@/contexts/ToastContext';
import { Plan } from '@/types';

interface OnboardTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plans: Plan[];
}

export function OnboardTenantModal({ isOpen, onClose, onSuccess, plans }: OnboardTenantModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OnboardTenantInput>({
    resolver: zodResolver(onboardTenantSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      admin_name: '',
      admin_email: '',
      admin_password: '',
      plan_id: plans[0]?.id || '',
    },
  });

  const onSubmit = async (data: OnboardTenantInput) => {
    setErrorMsg(null);
    try {
      await platformService.onboardTenant(data);
      showToast(`Tenant Organization "${data.name}" onboarded successfully!`, 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to onboard tenant');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Tenant Organization"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Provision Tenant
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Organization / Company Name *"
          placeholder="e.g. Om Agro Distribution Ltd"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Org Business Email *"
              type="email"
              placeholder="contact@omagro.in"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Phone Number"
              placeholder="+91 98765 00000"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
        </div>

        <div className="p-3 bg-light rounded border mb-3">
          <span className="small fw-semibold text-secondary d-block mb-2">
            Initial Tenant Administrator Account
          </span>
          <Input
            label="Admin Full Name"
            placeholder="Defaults to Org Name if empty"
            error={errors.admin_name?.message}
            {...register('admin_name')}
          />
          <Input
            label="Admin Email Address"
            type="email"
            placeholder="Defaults to Org Email if empty"
            error={errors.admin_email?.message}
            {...register('admin_email')}
          />
          <Input
            label="Admin Initial Password *"
            type="password"
            placeholder="••••••••"
            error={errors.admin_password?.message}
            {...register('admin_password')}
          />
        </div>

        <div className="mb-3">
          <Select
            label="Assigned Subscription Tier *"
            options={plans.map(p => ({
              value: p.id,
              label: `${p.plan_name} (₹${p.price} / ${p.billing_interval})`,
            }))}
            error={errors.plan_id?.message}
            {...register('plan_id')}
          />
        </div>
      </form>
    </Modal>
  );
}
