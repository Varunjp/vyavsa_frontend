'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { salesService } from '@/features/sales/services/salesService';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { TodayOverviewCard } from './TodayOverviewCard';
import { Card } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LineSale } from '@/types';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function TenantOverviewTab() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['financial-metrics'],
    queryFn: () => dashboardService.getFinancialMetrics(),
  });

  const { data: todayOverview, isLoading: todayLoading } = useQuery({
    queryKey: ['today-overview'],
    queryFn: () => dashboardService.getTodayOverview(),
  });

  const { data: recentSales, isLoading: salesLoading } = useQuery({
    queryKey: ['recent-line-sales-overview'],
    queryFn: () => salesService.listLineSales({ page_size: 5 }),
  });

  const recentSalesColumns: Column<LineSale>[] = [
    {
      key: 'invoice',
      header: 'Invoice #',
      render: s => (
        <span className="font-mono fw-semibold text-dark">
          {s.invoice_number || `#${s.id.slice(0, 8)}`}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: s => (
        <span className="text-muted small">
          {s.sale_date ? formatDate(s.sale_date) : formatDate(s.created_at)}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: s => <span className="fw-semibold text-dark">{s.customer_name}</span>,
    },
    {
      key: 'total',
      header: 'Total Bill',
      render: s => (
        <span className="font-mono fw-bold text-dark">{formatCurrency(s.total_amount)}</span>
      ),
    },
    {
      key: 'collected',
      header: 'Collected',
      render: s => (
        <span className="font-mono text-success">
          {formatCurrency(Number(s.total_cash_in || 0) + Number(s.bank_amount || 0))}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Due Balance',
      render: s => {
        const bal = Number(s.balance || 0);
        return (
          <span className={`font-mono fw-bold ${bal > 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(bal)}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Real Financial Overview KPIs */}
      <FinancialOverviewCard metrics={metrics} isLoading={metricsLoading} />

      {/* Real Today's Operational Pulse */}
      <TodayOverviewCard overview={todayOverview} isLoading={todayLoading} />

      {/* Recent Operational Transactions Table */}
      <Card
        title="Recent Field Line Sales"
        subtitle="Live snapshot of the most recent field distribution deliveries"
        actions={
          <Link
            href="/dashboard?tab=line-sales"
            className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
          >
            <span>View All Line Sales</span>
            <ArrowUpRight size={14} />
          </Link>
        }
      >
        <DataTable
          columns={recentSalesColumns}
          data={recentSales?.data || []}
          keyExtractor={s => s.id}
          isLoading={salesLoading}
          emptyTitle="No Line Sales Recorded Yet"
          emptyDescription="Deliveries and field route sales invoices will appear here."
        />
      </Card>
    </div>
  );
}
