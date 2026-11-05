'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import { cashBankService } from '@/features/cash-bank/services/cashBankService';
import { employeeService } from '@/features/employees/services/employeeService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Expense } from '@/types';
import { Plus, Search, Trash2 } from 'lucide-react';
import { CreateExpenseModal } from './CreateExpenseModal';

export function ExpensesTab() {
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: expensesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['expenses', page, search],
    queryFn: () => expenseService.listExpenses({ page, page_size: 15, search }),
  });

  const { data: banksData } = useQuery({
    queryKey: ['banks-lookup'],
    queryFn: () => cashBankService.listBanks(),
  });

  const { data: employeesData } = useQuery({
    queryKey: ['employees-lookup'],
    queryFn: () => employeeService.listEmployees({ page_size: 100 }),
  });

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(expenseToDelete.id);
      showToast(`Expense "${expenseToDelete.item}" deleted.`, 'info');
      setExpenseToDelete(null);
      refetch();
    } catch {
      showToast('Failed to delete expense record', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Expense>[] = [
    {
      key: 'item',
      header: 'Expense Item',
      render: e => (
        <div>
          <div className="fw-semibold text-dark">{e.item}</div>
          {e.employee_name && <span className="small text-muted">Paid to: {e.employee_name}</span>}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: e => (
        <span className="badge bg-light text-dark border small">{e.category || 'General'}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: e => <span className="text-muted small">{formatDate(e.created_at)}</span>,
    },
    {
      key: 'method',
      header: 'Payment Method',
      render: e => (
        <span className="badge bg-secondary-subtle text-secondary small text-uppercase">
          {e.payment_method}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: e => (
        <span className="font-mono fw-bold text-danger">
          {formatCurrency(e.total_amount || e.amount)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: e => (
        <button
          className="btn btn-sm btn-outline-danger p-1 px-2"
          title="Delete Expense"
          onClick={() => setExpenseToDelete(e)}
        >
          <Trash2 size={14} />
        </button>
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
            placeholder="Search expenses by item, category..."
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
          Record Expense
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={expensesData?.data || []}
        keyExtractor={e => e.id}
        isLoading={isLoading}
        emptyTitle="No Expenses Recorded"
        emptyDescription="Log store utilities, vehicle fuel, rent, and overhead payments."
        emptyActionLabel="Record Expense"
        onEmptyAction={() => setIsCreateOpen(true)}
      />

      {/* Pagination */}
      {expensesData?.pagination && expensesData.pagination.total_pages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted small">
            Page {expensesData.pagination.page} of {expensesData.pagination.total_pages} (
            {expensesData.pagination.total_items} total)
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
              disabled={page >= expensesData.pagination.total_pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      <CreateExpenseModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
        banks={banksData || []}
        employees={employeesData?.data || []}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Operating Expense"
        message={`Are you sure you want to permanently remove expense "${expenseToDelete?.item}"?`}
        confirmLabel="Delete Expense"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
