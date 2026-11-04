'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { PlatformSubscriptionItem } from '@/types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export function PlatformSubscriptionsTab() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const {
    data: subsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['platform-subscriptions', page, statusFilter],
    queryFn: () =>
      platformService.listSubscriptions({
        page,
        page_size: 15,
        status: statusFilter || undefined,
      }),
  });

  const handleUpdateStatus = async (
    sub: PlatformSubscriptionItem,
    status: 'active' | 'past_due' | 'expired' | 'cancelled'
  ) => {
    if (
      !confirm(`Are you sure you want to mark subscription for "${sub.tenant_name}" as ${status}?`)
    )
      return;
    try {
      await platformService.updateSubscriptionStatus(sub.tenant_id, status);
      refetch();
    } catch {
      alert('Failed to update subscription status');
    }
  };

  const columns: Column<PlatformSubscriptionItem>[] = [
    {
      key: 'tenant',
      header: 'Tenant Organization',
      render: s => (
        <div>
          <div className="fw-semibold text-dark">{s.tenant_name}</div>
          <span className="small text-muted">{s.tenant_email}</span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan Tier',
      render: s => <span className="fw-semibold text-primary">{s.current_plan_name}</span>,
    },
    {
      key: 'start_date',
      header: 'Start Date',
      render: s => (
        <span className="text-muted small">{s.start_date ? formatDate(s.start_date) : '—'}</span>
      ),
    },
    {
      key: 'end_date',
      header: 'End / Expiry Date',
      render: s => (
        <span className="text-muted small">{s.end_date ? formatDate(s.end_date) : '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: s => {
        let badge = 'bg-secondary-subtle text-secondary';
        if (s.status === 'active') badge = 'bg-success-subtle text-success';
        if (s.status === 'cancelled') badge = 'bg-danger-subtle text-danger';
        if (s.status === 'past_due') badge = 'bg-warning-subtle text-warning-emphasis';
        return <span className={`badge ${badge} small text-uppercase`}>{s.status}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: s => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          {s.status !== 'active' && (
            <button
              className="btn btn-sm btn-outline-success p-1 px-2 d-inline-flex align-items-center gap-1 small"
              title="Activate"
              onClick={() => handleUpdateStatus(s, 'active')}
            >
              <CheckCircle size={14} /> Activate
            </button>
          )}
          {s.status === 'active' && (
            <button
              className="btn btn-sm btn-outline-danger p-1 px-2 d-inline-flex align-items-center gap-1 small"
              title="Cancel Subscription"
              onClick={() => handleUpdateStatus(s, 'cancelled')}
            >
              <XCircle size={14} /> Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0">Tenant Subscriptions Registry</h6>
        <select
          className="form-select form-select-sm"
          style={{ width: '160px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="past_due">Past Due</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={subsData?.data || []}
        keyExtractor={s => s.id}
        isLoading={isLoading}
        emptyTitle="No Tenant Subscriptions Found"
        emptyDescription="Tenant subscriptions will be listed here as organizations subscribe to plans."
      />

      {subsData?.pagination && subsData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {subsData.pagination.page} of {subsData.pagination.total_pages} (
            {subsData.pagination.total_items} total)
          </span>
          <div className="d-flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= subsData.pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
