'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/purchaseService';
import { supplierService } from '@/features/suppliers/services/supplierService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Purchase, Supplier } from '@/types';
import { Plus, Search, CreditCard, FileText, Edit, Receipt, Building2 } from 'lucide-react';
import { CreatePurchaseModal } from './CreatePurchaseModal';
import { CreateSupplierModal } from '@/features/suppliers/components/CreateSupplierModal';
import { SupplierPaymentModal } from '@/features/suppliers/components/SupplierPaymentModal';
import { SupplierStatementModal } from '@/features/suppliers/components/SupplierStatementModal';

export function PurchasesSuppliersTab() {
  const [subTab, setSubTab] = useState<'purchases' | 'suppliers'>('purchases');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [paymentSupplier, setPaymentSupplier] = useState<Supplier | null>(null);
  const [statementSupplier, setStatementSupplier] = useState<Supplier | null>(null);

  // Queries
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    refetch: refetchPurchases,
  } = useQuery({
    queryKey: ['purchases', page, search],
    queryFn: () => purchaseService.listPurchases({ page, page_size: 15, search }),
    enabled: subTab === 'purchases',
  });

  const {
    data: suppliersData,
    isLoading: suppliersLoading,
    refetch: refetchSuppliers,
  } = useQuery({
    queryKey: ['suppliers', page, search],
    queryFn: () => supplierService.listSuppliers({ page, page_size: 15, search }),
    enabled: subTab === 'suppliers',
  });

  const { data: allSuppliers } = useQuery({
    queryKey: ['all-suppliers-lookup'],
    queryFn: () => supplierService.listSuppliers({ page_size: 100 }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const purchaseColumns: Column<Purchase>[] = [
    {
      key: 'item',
      header: 'Procurement Item',
      render: p => (
        <div>
          <div className="fw-semibold text-dark">{p.item}</div>
          <span className="small text-muted">{p.supplier_name || 'Direct Procurement'}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: p => <span className="text-muted small">{formatDate(p.created_at)}</span>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: p => <span className="font-mono">{p.quantity}</span>,
    },
    {
      key: 'total_amount',
      header: 'Total Cost',
      render: p => (
        <span className="fw-bold font-mono text-dark">{formatCurrency(p.total_amount)}</span>
      ),
    },
    {
      key: 'total_paid',
      header: 'Disbursed',
      render: p => <span className="font-mono text-success">{formatCurrency(p.total_paid)}</span>,
    },
    {
      key: 'pending',
      header: 'Pending Payable',
      render: p => {
        const pending = Number(p.total_pending || 0);
        return (
          <span className={`font-mono fw-bold ${pending > 0 ? 'text-warning' : 'text-success'}`}>
            {formatCurrency(pending)}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: p => {
        const isPaid = p.payment_status === 'PAID';
        return (
          <span
            className={`badge ${
              isPaid ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning-emphasis'
            } small`}
          >
            {p.payment_status}
          </span>
        );
      },
    },
  ];

  const supplierColumns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Supplier / Vendor',
      render: s => (
        <div>
          <div className="fw-semibold text-dark">{s.supplier_name}</div>
          <span className="small text-muted">{s.phone || s.email || 'No contact provided'}</span>
        </div>
      ),
    },
    {
      key: 'total_purchases',
      header: 'Total Billed',
      render: s => <span className="font-mono text-dark">{formatCurrency(s.total_purchases)}</span>,
    },
    {
      key: 'total_paid',
      header: 'Total Paid',
      render: s => <span className="font-mono text-success">{formatCurrency(s.total_paid)}</span>,
    },
    {
      key: 'outstanding_payable',
      header: 'Pending Payable',
      render: s => {
        const payable = Number(s.outstanding_payable || 0);
        return (
          <span className={`font-mono fw-bold ${payable > 0 ? 'text-warning' : 'text-success'}`}>
            {formatCurrency(payable)}
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
          <button
            className="btn btn-sm btn-outline-warning p-1 px-2 d-inline-flex align-items-center gap-1"
            title="Disburse Payment"
            onClick={() => setPaymentSupplier(s)}
          >
            <CreditCard size={14} /> Pay
          </button>
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="View Statement"
            onClick={() => setStatementSupplier(s)}
          >
            <FileText size={14} />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="Edit Supplier"
            onClick={() => {
              setSupplierToEdit(s);
              setIsSupplierModalOpen(true);
            }}
          >
            <Edit size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Sub Tabs */}
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'purchases' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('purchases');
                setPage(1);
              }}
            >
              <Receipt size={16} className="me-1" /> Stock Purchases
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'suppliers' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('suppliers');
                setPage(1);
              }}
            >
              <Building2 size={16} className="me-1" /> Suppliers & Payables
            </button>
          </li>
        </ul>

        <div className="d-flex gap-2">
          <div className="input-group" style={{ maxWidth: '280px' }}>
            <span className="input-group-text bg-white">
              <Search size={14} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={`Search ${subTab}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {subTab === 'purchases' ? (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => setIsPurchaseModalOpen(true)}
            >
              Record Purchase
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setSupplierToEdit(null);
                setIsSupplierModalOpen(true);
              }}
            >
              Add Supplier
            </Button>
          )}
        </div>
      </div>

      {subTab === 'purchases' ? (
        <DataTable
          columns={purchaseColumns}
          data={purchasesData?.data || []}
          keyExtractor={p => p.id}
          isLoading={purchasesLoading}
          emptyTitle="No Purchases Recorded"
          emptyDescription="Record raw materials and inventory procurement bills to manage stock and payables."
          emptyActionLabel="Record Purchase"
          onEmptyAction={() => setIsPurchaseModalOpen(true)}
        />
      ) : (
        <DataTable
          columns={supplierColumns}
          data={suppliersData?.data || []}
          keyExtractor={s => s.id}
          isLoading={suppliersLoading}
          emptyTitle="No Suppliers Registered"
          emptyDescription="Register your procurement vendors and track purchase ledgers."
          emptyActionLabel="Add Supplier"
          onEmptyAction={() => {
            setSupplierToEdit(null);
            setIsSupplierModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <CreatePurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onSuccess={() => {
          refetchPurchases();
          refetchSuppliers();
        }}
        suppliers={allSuppliers?.data || []}
        banks={banksData || []}
      />

      <CreateSupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => {
          setIsSupplierModalOpen(false);
          setSupplierToEdit(null);
        }}
        onSuccess={() => refetchSuppliers()}
        supplierToEdit={supplierToEdit}
      />

      {paymentSupplier && (
        <SupplierPaymentModal
          isOpen={Boolean(paymentSupplier)}
          onClose={() => setPaymentSupplier(null)}
          onSuccess={() => {
            refetchSuppliers();
            refetchPurchases();
          }}
          supplier={paymentSupplier}
          banks={banksData || []}
        />
      )}

      {statementSupplier && (
        <SupplierStatementModal
          isOpen={Boolean(statementSupplier)}
          onClose={() => setStatementSupplier(null)}
          supplier={statementSupplier}
        />
      )}
    </div>
  );
}
