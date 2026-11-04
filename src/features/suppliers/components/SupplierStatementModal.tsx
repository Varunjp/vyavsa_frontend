'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { supplierService } from '../services/supplierService';
import { Supplier } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer } from 'lucide-react';

interface SupplierStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
}

export function SupplierStatementModal({ isOpen, onClose, supplier }: SupplierStatementModalProps) {
  const { data: statement, isLoading } = useQuery({
    queryKey: ['supplier-statement', supplier.id],
    queryFn: () => supplierService.getSupplierStatement(supplier.id),
    enabled: isOpen,
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Supplier Ledger Statement: ${supplier.supplier_name}`}
      size="lg"
      footer={
        <div className="d-flex justify-content-between align-items-center w-100">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer size={15} />}
            onClick={handlePrint}
          >
            Print Statement
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <div className="p-5 text-center">
          <LoadingSpinner size="md" label="Loading vendor statement..." />
        </div>
      ) : (
        <div>
          {/* Summary Row */}
          <div className="row g-2 mb-3 p-3 bg-light rounded border small">
            <div className="col-4">
              <span className="text-muted d-block">Total Purchases:</span>
              <strong className="font-mono text-dark">
                {formatCurrency(statement?.total_purchases || 0)}
              </strong>
            </div>
            <div className="col-4">
              <span className="text-muted d-block">Total Disbursed:</span>
              <strong className="font-mono text-success">
                {formatCurrency(statement?.total_paid || 0)}
              </strong>
            </div>
            <div className="col-4">
              <span className="text-muted d-block">Outstanding Payable:</span>
              <strong className="font-mono text-warning">
                {formatCurrency(statement?.outstanding_payable || 0)}
              </strong>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle mb-0">
              <thead className="table-light small">
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Reference</th>
                  <th className="text-end">Debit (-)</th>
                  <th className="text-end">Credit (+)</th>
                  <th className="text-end">Balance</th>
                </tr>
              </thead>
              <tbody className="small">
                {statement?.entries && statement.entries.length > 0 ? (
                  statement.entries.map((entry, idx) => (
                    <tr key={idx}>
                      <td className="text-muted">{formatDate(entry.date)}</td>
                      <td>
                        <span
                          className="badge bg-secondary-subtle text-secondary text-uppercase"
                          style={{ fontSize: '0.65rem' }}
                        >
                          {entry.entry_type}
                        </span>
                      </td>
                      <td className="font-mono">{entry.reference || '-'}</td>
                      <td className="text-end font-mono text-success">
                        {Number(entry.debit) > 0 ? formatCurrency(entry.debit) : '-'}
                      </td>
                      <td className="text-end font-mono text-danger">
                        {Number(entry.credit) > 0 ? formatCurrency(entry.credit) : '-'}
                      </td>
                      <td className="text-end font-mono fw-bold">
                        {formatCurrency(entry.running_balance)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No transactions recorded for this supplier yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}
