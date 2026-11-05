'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createPlanSchema, CreatePlanInput } from '../schemas/platformSchema';
import { platformService } from '../services/platformService';
import { useToast } from '@/contexts/ToastContext';
import { Plan } from '@/types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planToEdit?: Plan | null;
}

export function CreatePlanModal({ isOpen, onClose, onSuccess, planToEdit }: CreatePlanModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlanInput>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      plan_name: planToEdit?.plan_name || '',
      note: planToEdit?.note || '',
      price: Number(planToEdit?.price || 0),
      billing_interval: planToEdit?.billing_interval || 'monthly',
      status: planToEdit?.status || 'active',
    },
  });

  const onSubmit = async (data: CreatePlanInput) => {
    setErrorMsg(null);
    try {
      if (planToEdit) {
        await platformService.updatePlan(planToEdit.id, data);
        showToast(`Plan "${data.plan_name}" updated successfully!`, 'success');
      } else {
        await platformService.createPlan(data);
        showToast(`Plan "${data.plan_name}" published successfully!`, 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save subscription plan');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={planToEdit ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {planToEdit ? 'Update Plan' : 'Publish Plan'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Plan Name *"
          placeholder="e.g. Enterprise Distribution"
          error={errors.plan_name?.message}
          {...register('plan_name')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Price (₹) *"
              type="number"
              step="any"
              error={errors.price?.message}
              {...register('price')}
            />
          </div>
          <div className="col-md-6">
            <Select
              label="Billing Interval *"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
              {...register('billing_interval')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Select
            label="Plan Status *"
            options={[
              { value: 'active', label: 'Active & Available to Tenants' },
              { value: 'inactive', label: 'Inactive / Hidden' },
              { value: 'archived', label: 'Archived' },
            ]}
            {...register('status')}
          />
        </div>

        <Input
          label="Plan Feature Memo / Highlights"
          placeholder="e.g. Unlimited line salesman logins, automatic contra settlements, priority bank sync."
          error={errors.note?.message}
          {...register('note')}
        />
      </form>
    </Modal>
  );
}
