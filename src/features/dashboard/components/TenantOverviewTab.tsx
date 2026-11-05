'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { salesService } from '@/features/sales/services/salesService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { TodaySalesOverview } from './TodaySalesOverview';
import { FinancialOverviewCard } from './FinancialOverviewCard';
import { BankAccountsSection } from './BankAccountsSection';
import { EmployeeOverviewSection } from './EmployeeOverviewSection';
import { Card } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { formatCurrency, formatDate, getTodayDateString } from '@/lib/utils';
import { LineSale } from '@/types';
import {
  ArrowUpRight,
  Truck,
  ShoppingCart,
  ArrowRightLeft,
  Wallet,
  Users,
  FileText,
  DollarSign,
  Package,
  Calendar,
  RotateCw,
} from 'lucide-react';

export function TenantOverviewTab() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const todayDateStr = getTodayDateString();

  // Queries
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
    isFetching: isMetricsFetching,
  } = useQuery({
    queryKey: ['financial-metrics'],
    queryFn: () => dashboardService.getFinancialMetrics(),
  });

  const {
    data: todayOverview,
    isLoading: todayLoading,
    isFetching: isTodayFetching,
  } = useQuery({
    queryKey: ['today-overview'],
    queryFn: () => dashboardService.getTodayOverview(),
  });

  const { data: banksData, isLoading: banksLoading } = useQuery({
    queryKey: ['dashboard-banks-list'],
    queryFn: () => cashBankService.listBanks(),
  });

  const {
    data: recentSales,
    isLoading: salesLoading,
    isFetching: isSalesFetching,
  } = useQuery({
    queryKey: ['recent-line-sales-overview'],
    queryFn: () => salesService.listLineSales({ page_size: 5 }),
  });

  const isRefreshing = isMetricsFetching || isTodayFetching || isSalesFetching;

  const handleRefreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['financial-metrics'] });
    queryClient.invalidateQueries({ queryKey: ['today-overview'] });
    queryClient.invalidateQueries({ queryKey: ['line-sales-breakdown-card'] });
    queryClient.invalidateQueries({ queryKey: ['counter-sales-breakdown-card'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-banks-list'] });
    queryClient.invalidateQueries({ queryKey: ['recent-line-sales-overview'] });
  };

  // Formatted Current Date Display
  const formattedToday = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const quickActions = [
    {
      label: 'New Line Invoice',
      desc: 'Route delivery bill',
      href: '/dashboard?tab=line-sales',
      icon: Truck,
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      label: 'Counter POS Sale',
      desc: 'Walk-in receipt',
      href: '/dashboard?tab=counter-sales',
      icon: ShoppingCart,
      color: '#10b981',
      bg: '#ecfdf5',
    },
    {
      label: 'Add Expense',
      desc: 'Overhead disbursement',
      href: '/dashboard?tab=expenses',
      icon: DollarSign,
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      label: 'Record Purchase',
      desc: 'Vendor stock intake',
      href: '/dashboard?tab=purchases',
      icon: Package,
      color: '#0284c7',
      bg: '#f0f9ff',
    },
    {
      label: 'Customer Khata',
      desc: 'Collect dues & advance',
      href: '/dashboard?tab=customers',
      icon: Users,
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      label: 'Offset Contra',
      desc: 'Mutual offset settlement',
      href: '/dashboard?tab=parties',
      icon: ArrowRightLeft,
      color: '#8b5cf6',
      bg: '#f5f3ff',
    },
    {
      label: 'Cash & Banks',
      desc: 'Tally drawer & accounts',
      href: '/dashboard?tab=cash-bank',
      icon: Wallet,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Daily Settlements',
      desc: 'Closing PDF statement',
      href: '/reports/daily',
      icon: FileText,
      color: '#ec4899',
      bg: '#fdf2f8',
    },
  ];

  const recentSalesColumns: Column<LineSale>[] = [
    {
      key: 'invoice',
      header: 'Invoice #',
      render: s => (
        <span className="font-mono fw-bold text-primary">
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
      render: s => (
        <div>
          <div className="fw-semibold text-dark">{s.customer_name}</div>
          {s.route && <span className="small text-muted">{s.route}</span>}
        </div>
      ),
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
        <span className="font-mono text-success fw-semibold">
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
          <span
            className={`badge font-mono ${
              bal > 0 ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'
            }`}
          >
            {bal > 0 ? formatCurrency(bal) : 'PAID'}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Top Welcome & Operational Status Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between p-3.5 mb-4 rounded-3 border bg-white shadow-xs gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.25rem' }}>
              Command Center
            </h4>
            <span
              className="badge rounded-pill bg-success-subtle text-success fw-semibold"
              style={{ fontSize: '0.68rem' }}
            >
              Live Sync
            </span>
          </div>
          <p className="text-muted small mb-0 mt-0.5">
            {user?.name ? `Welcome back, ${user.name} · ` : ''}
            Authoritative physical cash drawer balances, multi-bank accounts, and sales ledger
          </p>
        </div>

        <div className="d-flex align-items-center gap-2.5">
          <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill bg-light border text-muted small font-mono">
            <Calendar size={14} className="text-primary" />
            <span className="fw-semibold text-dark">{formattedToday}</span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1.5 rounded-pill px-3 py-1.5"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            title="Refresh all dashboard metrics"
          >
            <RotateCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span style={{ fontSize: '0.78rem' }}>{isRefreshing ? 'Updating...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Quick Command Action Grid */}
      <div className="row g-2 mb-4">
        {quickActions.map((qa, idx) => {
          const Icon = qa.icon;
          return (
            <div key={idx} className="col-6 col-md-3 col-xl-1-5 col-xxl">
              <Link
                href={qa.href}
                className="card vyavsa-card vyavsa-card-interactive p-2.5 text-decoration-none h-100 mb-0 d-flex flex-row align-items-center gap-2"
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 34, height: 34, backgroundColor: qa.bg, color: qa.color }}
                >
                  <Icon size={16} />
                </div>
                <div className="overflow-hidden">
                  <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.78rem' }}>
                    {qa.label}
                  </div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.68rem' }}>
                    {qa.desc}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* SECTION 1: Sales Overview (Line Sales & Counter Sales) */}
      <TodaySalesOverview
        todayOverview={todayOverview}
        isLoading={todayLoading}
        date={todayDateStr}
      />

      {/* SECTION 2: Financial Overview (8 Metrics Grid) */}
      <FinancialOverviewCard
        metrics={metrics}
        isLoading={metricsLoading}
        error={metricsError as Error | null}
        onRetry={refetchMetrics}
      />

      {/* SECTION 3: Dedicated Bank Accounts Section */}
      <BankAccountsSection
        banks={banksData || metrics?.bank_balances || []}
        isLoading={banksLoading && metricsLoading}
        totalBalance={metrics?.bank_balance}
      />

      {/* SECTION 4: Dedicated Employee Workforce & Attendance Section */}
      <EmployeeOverviewSection
        todayOverview={todayOverview}
        isLoading={todayLoading}
        date={todayDateStr}
      />

      {/* SECTION 5: Recent Field Line Sales Table */}
      <Card
        title="Recent Field Line Sales"
        subtitle="Live snapshot of the most recent field distribution deliveries"
        noPadding
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
          className="border-0 shadow-none rounded-0"
          emptyTitle="No Line Sales Recorded Yet"
          emptyDescription="Deliveries and field route sales invoices will appear here."
        />
      </Card>
    </div>
  );
}
