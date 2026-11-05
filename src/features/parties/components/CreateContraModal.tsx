'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createContraSettlementSchema, CreateContraSettlementInput } from '../schemas/partySchema';
import { partyService } from '../services/partyService';
import { useToast } from '@/contexts/ToastContext';
import { Party } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';

interface CreateContraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  party: Party;
}

export function CreateContraModal({ isOpen, onClose, onSuccess, party }: CreateContraModalProps) {
  const { showToast } = useToast();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: preview, isLoading: previewLoading } = useQuery({
    queryKey: ['contra-preview', party.id],
    queryFn: () => partyService.getContraPreview(party.id),
    enabled: isOpen,
  });

  const maxContra = Number(preview?.max_contra_amount || 0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateContraSettlementInput>({
    resolver: zodResolver(createContraSettlementSchema),
    defaultValues: {
      party_id: party.id,
      amount: maxContra,
      settlement_date: new Date().toISOString().split('T')[0],
      note: 'Contra offset mutual dues settlement',
    },
  });

  React.useEffect(() => {
    if (maxContra > 0) {
      setValue('amount', maxContra);
    }
  }, [maxContra, setValue]);

  const onSubmit = async (data: CreateContraSettlementInput) => {
    setErrorMsg(null);
    try {
      await partyService.createContraSettlement(data);
      showToast(`Contra settlement of ₹${data.amount} executed successfully!`, 'success');
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to execute contra settlement');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="d-flex align-items-center gap-2">
          <ArrowRightLeft size={18} className="text-primary" />
          <span>Contra Offset Settlement: {party.name}</span>
        </div>
      }
      size="md"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            disabled={maxContra <= 0}
          >
            Execute Settlement
          </Button>
        </div>
      }
    >
      {errorMsg && <div className="alert alert-danger p-2 small mb-3">{errorMsg}</div>}

      {/* Contra Balance Breakdown */}
      <div className="p-3 bg-light rounded border mb-3 small">
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Receivable From Party (Customer Khata):</span>
          <strong className="font-mono text-danger">
            {formatCurrency(party.total_receivable)}
          </strong>
        </div>
        <div className="d-flex justify-content-between mb-1">
          <span className="text-muted">Payable To Party (Supplier Purchases):</span>
          <strong className="font-mono text-warning">{formatCurrency(party.total_payable)}</strong>
        </div>
        <div className="d-flex justify-content-between pt-2 border-top mt-2">
          <span className="fw-semibold text-dark">Maximum Mutual Offset Eligible:</span>
          <strong className="font-mono text-success fs-6">{formatCurrency(maxContra)}</strong>
        </div>
      </div>

      {maxContra <= 0 ? (
        <div className="alert alert-warning small">
          This party does not have concurrent receivable dues and supplier payables to offset.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Contra Amount to Offset (₹) *"
            type="number"
            step="any"
            error={errors.amount?.message}
            {...register('amount')}
          />

          <Input
            label="Settlement Date"
            type="date"
            error={errors.settlement_date?.message}
            {...register('settlement_date')}
          />

          <Input
            label="Settlement Audit Note"
            placeholder="e.g. Mutual contra reconciliation statement"
            error={errors.note?.message}
            {...register('note')}
          />
        </form>
      )}
    </Modal>
  );
}
