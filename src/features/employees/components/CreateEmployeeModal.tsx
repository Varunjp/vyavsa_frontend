'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createEmployeeSchema, CreateEmployeeInput } from '../schemas/employeeSchema';
import { employeeService } from '../services/employeeService';
import { useToast } from '@/contexts/ToastContext';
import { Employee } from '@/types';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employeeToEdit?: Employee | null;
}

export function CreateEmployeeModal({
  isOpen,
  onClose,
  onSuccess,
  employeeToEdit,
}: CreateEmployeeModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      name: employeeToEdit?.name || '',
      phone: employeeToEdit?.phone || '',
      salary: Number(employeeToEdit?.salary || 0),
      ot_rate: Number(employeeToEdit?.ot_rate || 0),
      status: employeeToEdit?.status || 'active',
    },
  });

  const onSubmit = async (data: CreateEmployeeInput) => {
    setErrorMsg(null);
    try {
      if (employeeToEdit) {
        await employeeService.updateEmployee(employeeToEdit.id, data);
        showToast('Employee updated successfully!', 'success');
      } else {
        await employeeService.createEmployee(data);
        showToast('Employee registered successfully!', 'success');
      }
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save employee');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employeeToEdit ? 'Edit Employee Details' : 'Register New Employee'}
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            {employeeToEdit ? 'Update Employee' : 'Register Employee'}
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Employee Full Name *"
          placeholder="e.g. Anil Kumar"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Phone Number"
          placeholder="+91 99887 76655"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <Input
              label="Monthly Salary / Base Rate (₹)"
              type="number"
              step="any"
              error={errors.salary?.message}
              {...register('salary')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Overtime Hourly Rate (₹)"
              type="number"
              step="any"
              error={errors.ot_rate?.message}
              {...register('ot_rate')}
            />
          </div>
        </div>

        <div className="mb-3">
          <Select
            label="Employment Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'terminated', label: 'Terminated' },
            ]}
            {...register('status')}
          />
        </div>
      </form>
    </Modal>
  );
}
