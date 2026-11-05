'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { salesService } from '@/features/sales/services/salesService';
import { LineSale } from '@/types';
import { Truck, ArrowUpRight, Building2, Clock, Layers, AlertCircle } from 'lucide-react';

export interface LineSaleBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
}

export function LineSaleBreakdownModal({ isOpen, onClose, date }: LineSaleBreakdownModalProps) {
  const router = useRouter();

  const {
    data: breakdown,
    isLoading: isBreakdownLoading,
    error: breakdownError,
    refetch: refetchBreakdown,
  } = useQuery({
    queryKey: ['line-sales-breakdown', date],
    queryFn: () => salesService.getLineSaleBreakdown({ date }),
    enabled: isOpen,
  });

  const {
    data: salesData,
    isLoading: isSalesLoading,
    error: salesError,
    refetch: refetchSales,
  } = useQuery({
    queryKey: ['today-line-sales-list', date],
    queryFn: () => salesService.listLineSales({ date, page_size: 50 }),
    enabled: isOpen,
  });

  const isLoading = isBreakdownLoading || isSalesLoading;
  const hasError = breakdownError || salesError;

  const lineSalesList = salesData?.data || [];
  const totalSales = Number(breakdown?.total_sales ?? 0);
  const salesCount = Number(breakdown?.sales_count ?? lineSalesList.length);
  const cashReceived = Number(breakdown?.cash_received ?? 0);
  const bankReceived = Number(breakdown?.bank_received ?? 0);
  const totalDue = Number(breakdown?.total_due ?? 0);
  const advanceApplied = Number(breakdown?.advance_applied ?? 0);
  const bankBreakdown = breakdown?.bank_breakdown || [];

  const columns: Column<LineSale>[] = [
    {
      key: 'invoice',
      header: 'Invoice #',
      render: s => (
        <div>
          <span className="font-mono fw-bold text-primary">
            {s.invoice_number || `#${s.id.slice(0, 8)}`}
          </span>
          {s.route && (
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              Route: {s.route}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: s => (
        <div>
          <span className="fw-semibold text-dark d-block">{s.customer_name}</span>
          {s.salesman && (
            <span className="text-muted" style={{ fontSize: '0.72rem' }}>
              Salesman: {s.salesman}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: s => {
        if (s.items && s.items.length > 0) {
          return (
            <div className="small">
              <span className="fw-medium text-dark">
                {s.items.length} {s.items.length === 1 ? 'item' : 'items'}
              </span>
              <span className="text-muted ms-1" style={{ fontSize: '0.72rem' }}>
                (
                {s.items
                  .map(i => i.product_name_snapshot)
                  .slice(0, 2)
                  .join(', ')}
                {s.items.length > 2 ? '…' : ''})
              </span>
            </div>
          );
        }
        return <span className="text-muted small">—</span>;
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
      key: 'amount',
      header: 'Total Bill',
      align: 'right',
      render: s => (
        <span className="font-mono fw-bold text-dark">{formatCurrency(s.total_amount)}</span>
      ),
    },
    {
      key: 'payments',
      header: 'Collected',
      align: 'right',
      render: s => {
        const cash = Number(s.total_cash_in || 0);
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
    {
      key: 'balance',
      header: 'Due / Status',
      align: 'right',
      render: s => {
        const bal = Number(s.balance ?? 0);
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

  const handleNavigateToLineSales = () => {
    onClose();
    router.push('/dashboard?tab=line-sales');
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
            style={{ width: 34, height: 34, backgroundColor: '#eef2ff', color: '#4f46e5' }}
          >
            <Truck size={18} />
          </div>
          <div>
            <span className="fw-bold text-dark">Today&apos;s Line Sales Breakdown</span>
            <div className="text-muted small fw-normal">
              Field delivery &amp; route distribution invoices for {date}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="text-muted small">
            Authoritative sales and payment settlements tallied from source records.
          </div>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowUpRight size={14} />}
              onClick={handleNavigateToLineSales}
            >
              Open Line Sales Hub
            </Button>
          </div>
        </div>
      }
    >
      {hasError ? (
        <div className="alert alert-danger d-flex align-items-center justify-content-between p-3 rounded-3">
          <div className="d-flex align-items-center gap-2">
            <AlertCircle size={18} />
            <span>Failed to load breakdown details. Please retry.</span>
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
              Total Line Sales
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
            <span className="font-mono fw-extrabold text-primary fs-6 d-block mt-0.5">
              {isLoading ? '...' : `${salesCount} ${salesCount === 1 ? 'Sale' : 'Sales'}`}
            </span>
          </div>
        </div>

        <div className="col-6 col-md-4 col-xl-2">
          <div className="p-2.5 rounded-3 border bg-light">
            <span
              className="text-muted text-uppercase fw-bold d-block"
              style={{ fontSize: '0.65rem' }}
            >
              Cash In Hand
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
              className="font-mono fw-extrabold text-indigo fs-6 d-block mt-0.5"
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
              Individual Line Sales ({lineSalesList.length})
            </span>
          </div>
          <span className="text-muted small">Showing all deliveries booked for today</span>
        </div>

        <DataTable
          columns={columns}
          data={lineSalesList}
          keyExtractor={s => s.id}
          isLoading={isLoading}
          emptyTitle="No Line Sales Recorded Today"
          emptyDescription="No route distribution invoices have been created for today yet."
          className="border-0 shadow-none rounded-0"
        />
      </div>
    </Modal>
  );
}
