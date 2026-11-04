'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { PlatformTenantItem } from '@/types';
import { Plus, Search, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { OnboardTenantModal } from './OnboardTenantModal';

export function PlatformTenantsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);

  // Queries
  const {
    data: tenantsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['platform-tenants', page, search, statusFilter],
    queryFn: () =>
      platformService.listTenants({
        page,
        page_size: 15,
        search,
        status: statusFilter || undefined,
      }),
  });

  const { data: plansData } = useQuery({
    queryKey: ['platform-plans-lookup'],
    queryFn: () => platformService.listPlans({ page_size: 50, status: 'active' }),
  });

  const handleStatusChange = async (
    tenant: PlatformTenantItem,
    newStatus: 'active' | 'inactive' | 'suspended'
  ) => {
    if (!confirm(`Are you sure you want to mark tenant "${tenant.name}" as ${newStatus}?`)) return;
    try {
      await platformService.updateTenantStatus(tenant.id, newStatus);
      refetch();
    } catch {
      alert('Failed to update tenant status');
    }
  };

  const columns: Column<PlatformTenantItem>[] = [
    {
      key: 'name',
      header: 'Tenant Organization',
      render: t => (
        <div>
          <div className="fw-semibold text-dark">{t.name}</div>
          <span className="small text-muted">{t.email}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Phone',
      render: t => <span className="small font-mono">{t.phone || '—'}</span>,
    },
    {
      key: 'created_at',
      header: 'Joined Date',
      render: t => <span className="text-muted small">{formatDate(t.created_at)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: t => {
        let badge = 'bg-secondary-subtle text-secondary';
        if (t.status === 'active') badge = 'bg-success-subtle text-success';
        if (t.status === 'suspended') badge = 'bg-danger-subtle text-danger';
        return <span className={`badge ${badge} small text-uppercase`}>{t.status}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: t => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          {t.status === 'active' ? (
            <button
              className="btn btn-sm btn-outline-warning p-1 px-2 d-inline-flex align-items-center gap-1 small"
              title="Suspend Tenant"
              onClick={() => handleStatusChange(t, 'suspended')}
            >
              <ShieldAlert size={14} /> Suspend
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-success p-1 px-2 d-inline-flex align-items-center gap-1 small"
              title="Activate Tenant"
              onClick={() => handleStatusChange(t, 'active')}
            >
              <CheckCircle size={14} /> Activate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '280px' }}>
            <span className="input-group-text bg-white">
              <Search size={14} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search by name, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-select form-select-sm"
            style={{ width: '140px' }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsOnboardOpen(true)}
        >
          Onboard New Tenant
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tenantsData?.data || []}
        keyExtractor={t => t.id}
        isLoading={isLoading}
        emptyTitle="No Tenants Found"
        emptyDescription="Onboard organizations to start provisioning SaaS subscriptions."
        emptyActionLabel="Onboard Tenant"
        onEmptyAction={() => setIsOnboardOpen(true)}
      />

      {/* Pagination */}
      {tenantsData?.pagination && tenantsData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {tenantsData.pagination.page} of {tenantsData.pagination.total_pages} (
            {tenantsData.pagination.total_items} total)
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
              disabled={page >= tenantsData.pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Onboard Modal */}
      <OnboardTenantModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onSuccess={() => refetch()}
        plans={plansData?.data || []}
      />
    </div>
  );
}
