'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { platformService } from '../services/platformService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { PlatformTransactionItem } from '@/types';

export function PlatformTransactionsTab() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: txnsData, isLoading } = useQuery({
    queryKey: ['platform-transactions', page, statusFilter],
    queryFn: () =>
      platformService.listTransactions({
        page,
        page_size: 15,
        status: statusFilter || undefined,
      }),
  });

  const columns: Column<PlatformTransactionItem>[] = [
    {
      key: 'transaction_id',
      header: 'Transaction ID',
      render: t => (
        <span className="font-mono text-dark small">
          {t.transaction_id || `#${t.id.slice(0, 8)}`}
        </span>
      ),
    },
    {
      key: 'tenant',
      header: 'Tenant Name',
      render: t => (
        <div>
          <div className="fw-semibold text-dark">{t.tenant_name}</div>
          <span className="small text-muted">{t.tenant_email}</span>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan Tier',
      render: t => <span className="fw-semibold text-primary">{t.plan_name}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: t => <span className="font-mono fw-bold text-dark">{formatCurrency(t.amount)}</span>,
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: t => (
        <span className="badge bg-light text-dark border small text-uppercase">
          {t.payment_method}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: t => <span className="text-muted small">{formatDate(t.created_at)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: t => {
        const isSuccess = t.status === 'success' || t.status === 'captured';
        return (
          <span
            className={`badge ${
              isSuccess
                ? 'bg-success-subtle text-success'
                : 'bg-warning-subtle text-warning-emphasis'
            } small text-uppercase`}
          >
            {t.status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold text-dark mb-0">Platform Billing Transactions Ledger</h6>
        <select
          className="form-select form-select-sm"
          style={{ width: '160px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={txnsData?.data || []}
        keyExtractor={t => t.id}
        isLoading={isLoading}
        emptyTitle="No Transactions Found"
        emptyDescription="Billing transactions from all organizations will appear here."
      />

      {txnsData?.pagination && txnsData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {txnsData.pagination.page} of {txnsData.pagination.total_pages} (
            {txnsData.pagination.total_items} total)
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
              disabled={page >= txnsData.pagination.total_pages}
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
