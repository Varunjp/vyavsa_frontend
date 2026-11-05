'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { salesService } from '../services/salesService';
import { customerService } from '@/features/customers/services/customerService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LineSale } from '@/types';
import { Plus, Download, Search, CreditCard } from 'lucide-react';
import { CreateLineSaleModal } from './CreateLineSaleModal';
import { RecordSalePaymentModal } from './RecordSalePaymentModal';

export function LineSalesTab() {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activePaymentSale, setActivePaymentSale] = useState<LineSale | null>(null);

  const {
    data: salesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['line-sales', page, search],
    queryFn: () => salesService.listLineSales({ page, page_size: 15, search }),
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-lookup'],
    queryFn: () => customerService.listCustomers({ page_size: 100 }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products-lookup'],
    queryFn: () => salesService.listProducts(),
  });

  const handleDownloadPDF = async (sale: LineSale) => {
    try {
      const blob = await salesService.downloadLineSalePDF(sale.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${sale.invoice_number || sale.id.slice(0, 8)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('Line sale invoice PDF downloaded.', 'success');
    } catch {
      showToast('Failed to download invoice PDF', 'error');
    }
  };

  const columns: Column<LineSale>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice #',
      render: s => (
        <span className="fw-bold font-mono text-primary">
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
      header: 'Customer & Route',
      render: s => (
        <div>
          <div className="fw-semibold text-dark">{s.customer_name}</div>
          {s.route && <span className="small text-muted">{s.route}</span>}
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
      key: 'collected',
      header: 'Collected',
      render: s => (
        <div className="font-mono small">
          <span className="text-success fw-semibold">
            {formatCurrency(Number(s.total_cash_in || 0) + Number(s.bank_amount || 0))}
          </span>
        </div>
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
    {
      key: 'status',
      header: 'Status',
      render: s => {
        const bal = Number(s.balance || 0);
        const isPaid = bal <= 0;
        return (
          <span
            className={`badge ${
              isPaid ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'
            }`}
          >
            {isPaid ? 'PAID' : 'DUE'}
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
          {Number(s.balance || 0) > 0 && (
            <button
              className="btn btn-sm btn-outline-success p-1 px-2 d-inline-flex align-items-center gap-1"
              title="Record Payment"
              onClick={() => setActivePaymentSale(s)}
            >
              <CreditCard size={14} /> Pay
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary p-1 px-2"
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
            placeholder="Search by customer, invoice, route..."
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
          New Line Sale Invoice
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={salesData?.data || []}
        keyExtractor={s => s.id}
        isLoading={isLoading}
        emptyTitle="No Line Sales Invoices Yet"
        emptyDescription="Create your first field distribution invoice with route tracking and split payment."
        emptyActionLabel="Create Invoice"
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
      <CreateLineSaleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
        customers={customersData?.data || []}
        banks={banksData || []}
        products={productsData || []}
      />

      {activePaymentSale && (
        <RecordSalePaymentModal
          isOpen={Boolean(activePaymentSale)}
          onClose={() => setActivePaymentSale(null)}
          onSuccess={() => refetch()}
          saleId={activePaymentSale.id}
          saleType="line"
          invoiceNumber={activePaymentSale.invoice_number}
          remainingBalance={Number(activePaymentSale.balance || 0)}
          banks={banksData || []}
        />
      )}
    </div>
  );
}
