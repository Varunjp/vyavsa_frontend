'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Customer } from '@/types';
import { Plus, Search, CreditCard, FileText, Edit, ShieldAlert, Coins } from 'lucide-react';
import { CreateCustomerModal } from './CreateCustomerModal';
import { CollectCustomerPaymentModal } from './CollectCustomerPaymentModal';
import { CustomerStatementModal } from './CustomerStatementModal';
import { AdjustCustomerBalanceModal } from './AdjustCustomerBalanceModal';

export function CustomersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [activePaymentCustomer, setActivePaymentCustomer] = useState<{
    customer: Customer;
    isAdvance: boolean;
  } | null>(null);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [adjustCustomer, setAdjustCustomer] = useState<Customer | null>(null);

  // Queries
  const {
    data: customersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () => customerService.listCustomers({ page, page_size: 15, search }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Customer Name',
      render: c => (
        <div>
          <div className="fw-semibold text-dark">{c.customer_name}</div>
          <span className="small text-muted">{c.phone || c.email || 'No contact provided'}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Type',
      render: c => {
        const isBoth = c.role === 'both';
        return (
          <span
            className={`badge ${
              isBoth ? 'bg-primary-subtle text-primary' : 'bg-light text-dark border'
            } text-uppercase small`}
          >
            {c.role}
          </span>
        );
      },
    },
    {
      key: 'current_balance',
      header: 'Receivable Due',
      render: c => {
        const due = Number(c.current_balance || 0);
        return (
          <span className={`font-mono fw-bold ${due > 0 ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(due)}
          </span>
        );
      },
    },
    {
      key: 'advance_balance',
      header: 'Advance Held',
      render: c => {
        const adv = Number(c.advance_balance || 0);
        return (
          <span className={`font-mono ${adv > 0 ? 'text-success fw-semibold' : 'text-muted'}`}>
            {formatCurrency(adv)}
          </span>
        );
      },
    },
    {
      key: 'net_status',
      header: 'Khata Status',
      render: c => {
        let badgeClass = 'bg-secondary-subtle text-secondary';
        let label = 'Settled';
        if (c.net_status === 'owes_us') {
          badgeClass = 'bg-danger-subtle text-danger';
          label = 'Owes Us';
        } else if (c.net_status === 'we_owe') {
          badgeClass = 'bg-warning-subtle text-warning-emphasis';
          label = 'We Owe';
        }
        return <span className={`badge ${badgeClass} small text-uppercase`}>{label}</span>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: c => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          <button
            className="btn btn-sm btn-outline-success p-1 px-2 d-inline-flex align-items-center gap-1"
            title="Collect Due Payment"
            onClick={() => setActivePaymentCustomer({ customer: c, isAdvance: false })}
          >
            <CreditCard size={14} /> Pay
          </button>
          <button
            className="btn btn-sm btn-outline-primary p-1 px-2 d-inline-flex align-items-center gap-1"
            title="Collect Advance"
            onClick={() => setActivePaymentCustomer({ customer: c, isAdvance: true })}
          >
            <Coins size={14} /> Adv
          </button>
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="View Statement"
            onClick={() => setStatementCustomer(c)}
          >
            <FileText size={14} />
          </button>
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="Edit Customer"
            onClick={() => {
              setCustomerToEdit(c);
              setIsCreateOpen(true);
            }}
          >
            <Edit size={14} />
          </button>
          <button
            className="btn btn-sm btn-outline-warning p-1"
            title="Adjust / Reconcile Balance"
            onClick={() => setAdjustCustomer(c)}
          >
            <ShieldAlert size={14} />
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
            placeholder="Search by customer name, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={16} />}
          onClick={() => {
            setCustomerToEdit(null);
            setIsCreateOpen(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customersData?.data || []}
        keyExtractor={c => c.id}
        isLoading={isLoading}
        emptyTitle="No Customers Added Yet"
        emptyDescription="Add small business customers to track credit sales, khata receivables, and advances."
        emptyActionLabel="Add Customer"
        onEmptyAction={() => {
          setCustomerToEdit(null);
          setIsCreateOpen(true);
        }}
      />

      {/* Pagination */}
      {customersData?.pagination && customersData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {customersData.pagination.page} of {customersData.pagination.total_pages} (
            {customersData.pagination.total_items} total)
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
              disabled={page >= customersData.pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCustomerModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCustomerToEdit(null);
        }}
        onSuccess={() => refetch()}
        customerToEdit={customerToEdit}
      />

      {activePaymentCustomer && (
        <CollectCustomerPaymentModal
          isOpen={Boolean(activePaymentCustomer)}
          onClose={() => setActivePaymentCustomer(null)}
          onSuccess={() => refetch()}
          customer={activePaymentCustomer.customer}
          banks={banksData || []}
          isAdvance={activePaymentCustomer.isAdvance}
        />
      )}

      {statementCustomer && (
        <CustomerStatementModal
          isOpen={Boolean(statementCustomer)}
          onClose={() => setStatementCustomer(null)}
          customer={statementCustomer}
        />
      )}

      {adjustCustomer && (
        <AdjustCustomerBalanceModal
          isOpen={Boolean(adjustCustomer)}
          onClose={() => setAdjustCustomer(null)}
          onSuccess={() => refetch()}
          customer={adjustCustomer}
        />
      )}
    </div>
  );
}
