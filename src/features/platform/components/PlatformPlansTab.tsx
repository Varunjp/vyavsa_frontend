'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency } from '@/lib/utils';
import { Plan } from '@/types';
import { Plus, Edit, Archive } from 'lucide-react';
import { CreatePlanModal } from './CreatePlanModal';

export function PlatformPlansTab() {
  const { showToast } = useToast();
  const [page] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  const [planToArchive, setPlanToArchive] = useState<Plan | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    data: plansData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['platform-plans', page],
    queryFn: () => platformService.listPlans({ page, page_size: 20, status: 'all' }),
  });

  const confirmArchive = async () => {
    if (!planToArchive) return;
    setIsArchiving(true);
    try {
      await platformService.archivePlan(planToArchive.id);
      showToast(`Plan "${planToArchive.plan_name}" archived.`, 'info');
      setPlanToArchive(null);
      refetch();
    } catch {
      showToast('Failed to archive plan', 'error');
    } finally {
      setIsArchiving(false);
    }
  };

  const columns: Column<Plan>[] = [
    {
      key: 'plan_name',
      header: 'Subscription Plan',
      render: p => (
        <div>
          <div className="fw-semibold text-dark">{p.plan_name}</div>
          {p.note && <span className="small text-muted">{p.note}</span>}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price Rate',
      render: p => <span className="font-mono fw-bold text-dark">{formatCurrency(p.price)}</span>,
    },
    {
      key: 'interval',
      header: 'Interval',
      render: p => (
        <span className="badge bg-light text-dark border text-uppercase small">
          {p.billing_interval}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: p => {
        let badge = 'bg-secondary-subtle text-secondary';
        if (p.status === 'active') badge = 'bg-success-subtle text-success';
        if (p.status === 'archived') badge = 'bg-danger-subtle text-danger';
        return <span className={`badge ${badge} small text-uppercase`}>{p.status}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: p => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          <button
            className="btn btn-sm btn-outline-secondary p-1 px-2"
            title="Edit Plan"
            onClick={() => {
              setPlanToEdit(p);
              setIsModalOpen(true);
            }}
          >
            <Edit size={14} />
          </button>
          {p.status !== 'archived' && (
            <button
              className="btn btn-sm btn-outline-danger p-1 px-2"
              title="Archive Plan"
              onClick={() => setPlanToArchive(p)}
            >
              <Archive size={14} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0">Platform Subscription Plans Catalog</h6>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setPlanToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Create New Plan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={plansData?.data || []}
        keyExtractor={p => p.id}
        isLoading={isLoading}
        emptyTitle="No Plans Created"
        emptyDescription="Create subscription tiers for tenants to subscribe to."
        emptyActionLabel="Create Plan"
        onEmptyAction={() => {
          setPlanToEdit(null);
          setIsModalOpen(true);
        }}
      />

      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPlanToEdit(null);
        }}
        onSuccess={() => refetch()}
        planToEdit={planToEdit}
      />

      <ConfirmDialog
        isOpen={Boolean(planToArchive)}
        onClose={() => setPlanToArchive(null)}
        onConfirm={confirmArchive}
        title="Archive Subscription Plan"
        message={`Are you sure you want to archive plan "${planToArchive?.plan_name}"? Existing subscribers will remain active, but new tenants cannot select it.`}
        confirmLabel="Archive Plan"
        variant="danger"
        isLoading={isArchiving}
      />
    </div>
  );
}
