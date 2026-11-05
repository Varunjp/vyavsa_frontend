'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { salesService } from '@/features/sales/services/salesService';
import { CounterSale } from '@/types';
import { ShoppingCart, ArrowUpRight, Building2, Clock, Layers, AlertCircle } from 'lucide-react';

export interface CounterSaleBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export function CounterSaleBreakdownModal({
  isOpen,
  onClose,
  date,
}: CounterSaleBreakdownModalProps) {
  const router = useRouter();

  const {
    data: breakdown,
    isLoading: isBreakdownLoading,
    error: breakdownError,
    refetch: refetchBreakdown,
  } = useQuery({
    queryKey: ['counter-sales-breakdown', date],
    queryFn: () => salesService.getCounterSaleBreakdown({ date }),
    enabled: isOpen,
  });

  const {
    data: salesData,
    isLoading: isSalesLoading,
    error: salesError,
    refetch: refetchSales,
  } = useQuery({
    queryKey: ['today-counter-sales-list', date],
    queryFn: () => salesService.listCounterSales({ date, page_size: 50 }),
    enabled: isOpen,
  });

  const isLoading = isBreakdownLoading || isSalesLoading;
  const hasError = breakdownError || salesError;

  const counterSalesList = salesData?.data || [];
  const totalSales = Number(breakdown?.total_sales ?? 0);
  const salesCount = Number(breakdown?.sales_count ?? counterSalesList.length);
  const cashReceived = Number(breakdown?.cash_received ?? 0);
  const bankReceived = Number(breakdown?.bank_received ?? 0);
  const totalDue = Number(breakdown?.total_due ?? 0);
  const advanceApplied = Number(breakdown?.advance_applied ?? 0);
  const bankBreakdown = breakdown?.bank_breakdown || [];

  const columns: Column<CounterSale>[] = [
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
      key: 'customer',
      header: 'Customer',
      render: s => (
        <span className="fw-semibold text-dark">{s.customer_name || 'Counter Walk-in Retail'}</span>
      ),
    },
    {
      key: 'item',
      header: 'Purchased Item',
      render: s => (
        <div>
          <span className="fw-medium text-dark d-block">{s.item}</span>
          <span className="text-muted small font-mono">Unit Price: {formatCurrency(s.price)}</span>
        </div>
      ),
    },
    {
      key: 'payment_method',
      header: 'Method',
      render: s => {
        const method = s.payment_method?.toLowerCase() || 'cash';
        let badgeClass = 'bg-secondary-subtle text-secondary';
        if (method.includes('cash')) badgeClass = 'bg-success-subtle text-success';
        if (method.includes('bank') || method.includes('upi'))
          badgeClass = 'bg-primary-subtle text-primary';
        if (method.includes('split')) badgeClass = 'bg-warning-subtle text-warning';

        return (
          <span
            className={`badge ${badgeClass} text-uppercase font-mono`}
            style={{ fontSize: '0.68rem' }}
          >
            {s.payment_method || 'CASH'}
          </span>
        );
      },
    },
    {
      key: 'time',
      header: 'Time',
      render: s => (
        <span className="text-muted small d-inline-flex align-items-center gap-1 font-mono">
          <Clock size={12} />
          {s.created_at ? formatDateTime(s.created_at) : s.sale_date || 'Today'}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total Bill',
      align: 'right',
      render: s => (
        <div className="text-end">
          <span className="font-mono fw-bold text-dark d-block">
            {formatCurrency(s.total_amount)}
          </span>
          {Number(s.discount || 0) > 0 && (
            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
              Disc: -{formatCurrency(s.discount)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'settlement',
      header: 'Settlement',
      align: 'right',
      render: s => {
        const cash = Number(s.cash || 0);
        const bank = Number(s.bank_amount || 0);
        const collected = Number(s.collected_amount || cash + bank);
        return (
          <div className="text-end">
            <span className="font-mono fw-semibold text-success d-block">
              {formatCurrency(collected)}
            </span>
            {(cash > 0 || bank > 0) && (
              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                {cash > 0 && `Cash: ${formatCurrency(cash)}`}
                {cash > 0 && bank > 0 && ' · '}
                {bank > 0 && `Bank: ${formatCurrency(bank)}`}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const handleNavigateToCounterSales = () => {
    onClose();
    router.push('/dashboard?tab=counter-sales');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 34, height: 34, backgroundColor: '#ecfdf5', color: '#10b981' }}
          >
            <ShoppingCart size={18} />
          </div>
          <div>
            <span className="fw-bold text-dark">Today&apos;s Retail Counter Sales Breakdown</span>
            <div className="text-muted small fw-normal">
              Point-of-sale store transactions &amp; walk-in retail bills for {date}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="text-muted small">
            Authoritative counter receipts and immediate POS tallies.
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowUpRight size={14} />}
              onClick={handleNavigateToCounterSales}
            >
              Open Counter POS Hub
            </Button>
          </div>
        </div>
      }
    >
      {hasError ? (
        <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3">
          <div className="d-flex align-items-center gap-2">
            <AlertCircle size={18} />
            <span>Failed to load counter sale breakdown. Please retry.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetchBreakdown();
              refetchSales();
            }}
          >
            Retry
          </Button>
        </div>
      ) : null}

      {/* KPI Stats Bar */}
      <div className="row g-2 mb-3">
        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Total Counter Sales
            </span>
            <span className="font-mono fw-extrabold text-dark fs-6 d-block mt-0.5">
              {isLoading ? '...' : formatCurrency(totalSales)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Transactions
            </span>
            <span className="font-mono fw-extrabold text-success fs-6 d-block mt-0.5">
              {isLoading ? '...' : `${salesCount} ${salesCount === 1 ? 'Ticket' : 'Tickets'}`}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Cash Received
            </span>
            <span className="font-mono fw-extrabold text-success fs-6 d-block mt-0.5">
              {isLoading ? '...' : formatCurrency(cashReceived)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Bank / UPI
            </span>
            <span
              className="font-mono fw-extrabold fs-6 d-block mt-0.5"
              style={{ color: '#4f46e5' }}
            >
              {isLoading ? '...' : formatCurrency(bankReceived)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Advances Applied
            </span>
            <span className="font-mono fw-extrabold text-secondary fs-6 d-block mt-0.5">
              {isLoading ? '...' : formatCurrency(advanceApplied)}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Due Balance
            </span>
            <span
              className={`font-mono fw-extrabold fs-6 d-block mt-0.5 ${
                totalDue > 0 ? 'text-danger' : 'text-success'
              }`}
            >
              {isLoading ? '...' : formatCurrency(totalDue)}
            </span>
          </div>
        </div>
      </div>

      {/* Individual Bank Breakdown (if any bank received) */}
      {bankBreakdown.length > 0 && (
        <div className="p-3 mb-3 rounded-3 border bg-white">
          <div className="d-flex align-items-center gap-2 mb-2">
            <Building2 size={16} className="text-primary" />
            <span className="fw-bold text-dark small">Bank Account Distribution</span>
          </div>
          <div className="row g-2">
            {bankBreakdown.map((b, idx) => (
              <div key={idx} className="col-sm-6 col-md-4">
                <div className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light border small">
                  <div>
                    <span className="fw-semibold text-dark d-block">{b.bank_name}</span>
                    {b.account_number && (
                      <span className="text-muted font-mono" style={{ fontSize: '0.7rem' }}>
                        •••• {b.account_number.slice(-4)}
                      </span>
                    )}
                  </div>
                  <div className="text-end">
                    <span className="font-mono fw-bold text-primary d-block">
                      {formatCurrency(b.amount)}
                    </span>
                    <span
                      className="badge bg-primary-subtle text-primary"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {b.percentage ? b.percentage.toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="border rounded-3 overflow-hidden bg-white">
        <div className="p-3 bg-light border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Layers size={16} className="text-secondary" />
            <span className="fw-bold text-dark small">
              Individual Retail Transactions ({counterSalesList.length})
            </span>
          </div>
          <span className="text-muted small">Live walk-in tickets for today</span>
        </div>

        <DataTable
          columns={columns}
          data={counterSalesList}
          keyExtractor={s => s.id}
          isLoading={isLoading}
          emptyTitle="No Counter Sales Recorded Today"
          emptyDescription="No walk-in retail sales have been billed for today yet."
          className="border-0 shadow-none rounded-0"
        />
      </div>
    </Modal>
  );
}
