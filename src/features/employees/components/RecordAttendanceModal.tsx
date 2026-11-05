'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { recordAttendanceSchema, RecordAttendanceInput } from '../schemas/employeeSchema';
import { employeeService } from '../services/employeeService';
import { useToast } from '@/contexts/ToastContext';
import { Employee } from '@/types';

interface RecordAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employees: Employee[];
}

export function RecordAttendanceModal({
  isOpen,
  onClose,
  onSuccess,
  employees,
}: RecordAttendanceModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecordAttendanceInput>({
    resolver: zodResolver(recordAttendanceSchema),
    defaultValues: {
      employee_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      ot_amount: 0,
      advance: 0,
    },
  });

  const onSubmit = async (data: RecordAttendanceInput) => {
    setErrorMsg(null);
    try {
      await employeeService.recordAttendance(data);
      showToast('Daily attendance recorded successfully!', 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record attendance');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Staff Attendance"
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
            Save Attendance
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          label="Select Employee *"
          options={employees.map(e => ({ value: e.id, label: e.name }))}
          placeholder="-- Select Employee --"
          error={errors.employee_id?.message}
          {...register('employee_id')}
        />

        <div className="row g-2 mb-2">
          <div className="col-6">
            <Input label="Date *" type="date" error={errors.date?.message} {...register('date')} />
          </div>
          <div className="col-6">
            <Select
              label="Attendance Status *"
              options={[
                { value: 'present', label: 'Present' },
                { value: 'absent', label: 'Absent' },
                { value: 'half_day', label: 'Half Day' },
                { value: 'leave', label: 'Authorized Leave' },
              ]}
              {...register('status')}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-6">
            <Input
              label="Overtime Amount (₹)"
              type="number"
              step="any"
              error={errors.ot_amount?.message}
              {...register('ot_amount')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Today Cash Advance (₹)"
              type="number"
              step="any"
              error={errors.advance?.message}
              {...register('advance')}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
