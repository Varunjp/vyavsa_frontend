'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesService } from '../services/salesService';
import { customerService } from '@/features/customers/services/customerService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CounterSale } from '@/types';
import { Plus, Download, Search, CreditCard } from 'lucide-react';
import { CreateCounterSaleModal } from './CreateCounterSaleModal';
import { RecordSalePaymentModal } from './RecordSalePaymentModal';

export function CounterSalesTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activePaymentSale, setActivePaymentSale] = useState<CounterSale | null>(null);

  // Queries
  const {
    data: salesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['counter-sales', page, search],
    queryFn: () => salesService.listCounterSales({ page, page_size: 15, search }),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-lookup'],
    queryFn: () => customerService.listCustomers({ page_size: 100 }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const handleDownloadPDF = async (sale: CounterSale) => {
    try {
      const blob = await salesService.downloadCounterSalePDF(sale.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${sale.invoice_number || sale.id.slice(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download counter sale receipt PDF');
    }
  };

  const columns: Column<CounterSale>[] = [
    {
      key: 'invoice_number',
      header: 'Receipt #',
      render: s => (
        <span className="fw-semibold font-mono text-dark">
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
      key: 'item',
      header: 'Item & Customer',
      render: s => (
        <div>
          <div className="fw-semibold text-dark">{s.item}</div>
          <span className="small text-muted">{s.customer_name || 'Walk-in Retail Customer'}</span>
        </div>
      ),
    },
    {
      key: 'total_amount',
      header: 'Total Bill',
      render: s => (
        <span className="fw-bold font-mono text-dark">{formatCurrency(s.total_amount)}</span>
      ),
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: s => (
        <span className="badge bg-secondary-subtle text-secondary-emphasis text-uppercase small">
          {s.payment_method || 'CASH'}
        </span>
      ),
    },
    {
      key: 'account',
      header: 'Credit / Due',
      render: s => {
        const due = Number(s.account || 0);
        return (
          <span className={`font-mono fw-semibold ${due > 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(due)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: s => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          {Number(s.account || 0) > 0 && (
            <button
              className="btn btn-sm btn-outline-success p-1 px-2 d-inline-flex align-items-center gap-1"
              title="Record Payment"
              onClick={() => setActivePaymentSale(s)}
            >
              <CreditCard size={14} /> Pay
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="Download PDF"
            onClick={() => handleDownloadPDF(s)}
          >
            <Download size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white">
            <Search size={15} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by item, customer, receipt..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsCreateOpen(true)}
        >
          New Counter Sale
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={salesData?.data || []}
        keyExtractor={s => s.id}
        isLoading={isLoading}
        emptyTitle="No Counter Sales Recorded"
        emptyDescription="Quickly bill walk-in retail purchases at the counter."
        emptyActionLabel="Create Counter Sale"
        onEmptyAction={() => setIsCreateOpen(true)}
      />

      {/* Pagination */}
      {salesData?.pagination && salesData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {salesData.pagination.page} of {salesData.pagination.total_pages} (
            {salesData.pagination.total_items} total)
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
              disabled={page >= salesData.pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCounterSaleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
        customers={customersData?.data || []}
        banks={banksData || []}
      />

      {activePaymentSale && (
        <RecordSalePaymentModal
          isOpen={Boolean(activePaymentSale)}
          onClose={() => setActivePaymentSale(null)}
          onSuccess={() => refetch()}
          saleId={activePaymentSale.id}
          saleType="counter"
          invoiceNumber={activePaymentSale.invoice_number}
          remainingBalance={Number(activePaymentSale.account || 0)}
          banks={banksData || []}
        />
      )}
    </div>
  );
}
