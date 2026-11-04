'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cashBankService } from '../services/cashBankService';
import { Card } from '@/components/ui/Card';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Bank, CashTransaction } from '@/types';
import { Wallet, Plus, ShieldAlert, History } from 'lucide-react';
import { AddCashModal } from './AddCashModal';
import { AdjustCashModal } from './AdjustCashModal';
import { AddBankModal } from './AddBankModal';
import { AdjustBankModal } from './AdjustBankModal';

export function CashBankTab() {
  const [isAddCashOpen, setIsAddCashOpen] = useState(false);
  const [isAdjustCashOpen, setIsAdjustCashOpen] = useState(false);
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [bankToEdit, setBankToEdit] = useState<Bank | null>(null);
  const [adjustBank, setAdjustBank] = useState<Bank | null>(null);

  // Queries
  const { data: cashData, refetch: refetchCash } = useQuery({
    queryKey: ['cash-balance'],
    queryFn: () => cashBankService.getCashBalance(),
  });

  const { data: banksData, refetch: refetchBanks } = useQuery({
    queryKey: ['banks-list'],
    queryFn: () => cashBankService.listBanks(),
  });

  const {
    data: cashTxns,
    isLoading: txnsLoading,
    refetch: refetchTxns,
  } = useQuery({
    queryKey: ['cash-transactions'],
    queryFn: () => cashBankService.listCashTransactions({ page_size: 20 }),
  });

  const cashBal = Number(cashData?.cash_balance || 0);

  const txnColumns: Column<CashTransaction>[] = [
    {
      key: 'date',
      header: 'Date & Time',
      render: t => (
        <span className="text-muted small">
          {t.transaction_date ? formatDate(t.transaction_date) : formatDate(t.created_at)}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Transaction Type',
      render: t => {
        const isCredit =
          t.transaction_type.toLowerCase().includes('in') ||
          t.transaction_type.toLowerCase().includes('add') ||
          t.transaction_type.toLowerCase().includes('sale');
        return (
          <span
            className={`badge ${isCredit ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} small text-uppercase`}
          >
            {t.transaction_type}
          </span>
        );
      },
    },
    {
      key: 'description',
      header: 'Description',
      render: t => <span className="small text-dark">{t.description || '-'}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: t => <span className="font-mono fw-bold text-dark">{formatCurrency(t.amount)}</span>,
    },
    {
      key: 'balance',
      header: 'Drawer Tally After',
      render: t => (
        <span className="font-mono text-secondary">{formatCurrency(t.new_balance)}</span>
      ),
    },
  ];

  return (
    <div>
      {/* Top Section: Drawer Cash and Bank Accounts */}
      <div className="row g-3 mb-4">
        {/* Physical Drawer Cash Card */}
        <div className="col-lg-5">
          <Card
            title="Physical Cash Drawer"
            subtitle="Real-time physical bill drawer cash governance"
            className="h-100 mb-0"
          >
            <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded border mb-3">
              <div>
                <span className="text-muted small d-block">Current Cash Balance</span>
                <h2 className="fw-bold font-mono text-dark mb-0">{formatCurrency(cashBal)}</h2>
              </div>
              <div className="p-3 bg-success-subtle text-success rounded-3">
                <Wallet size={32} />
              </div>
            </div>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus size={16} />}
                className="flex-fill"
                onClick={() => setIsAddCashOpen(true)}
              >
                Deposit Cash
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ShieldAlert size={16} />}
                className="flex-fill"
                onClick={() => setIsAdjustCashOpen(true)}
              >
                Reconcile Cash
              </Button>
            </div>
          </Card>
        </div>

        {/* Bank Accounts Section */}
        <div className="col-lg-7">
          <Card
            title="Connected Bank Accounts"
            subtitle="Business banking ledgers and instant UPI accounts"
            className="h-100 mb-0"
            actions={
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus size={14} />}
                onClick={() => {
                  setBankToEdit(null);
                  setIsAddBankOpen(true);
                }}
              >
                Add Bank
              </Button>
            }
          >
            <div className="row g-2">
              {banksData && banksData.length > 0 ? (
                banksData.map(bank => (
                  <div key={bank.id} className="col-sm-6">
                    <div className="p-3 bg-light rounded border h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start">
                          <span className="fw-bold text-dark">{bank.bank_name}</span>
                          <span className="badge bg-success-subtle text-success small">ACTIVE</span>
                        </div>
                        {bank.account_number && (
                          <span className="small text-muted font-mono d-block mt-1">
                            A/C: ****{bank.account_number.slice(-4)}
                          </span>
                        )}
                        <h4 className="fw-bold font-mono text-primary mt-2 mb-0">
                          {formatCurrency(bank.current_balance)}
                        </h4>
                      </div>

                      <div className="d-flex gap-1 mt-3 pt-2 border-top">
                        <button
                          className="btn btn-sm btn-link text-decoration-none text-secondary p-0 small"
                          onClick={() => {
                            setBankToEdit(bank);
                            setIsAddBankOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <span className="text-muted">·</span>
                        <button
                          className="btn btn-sm btn-link text-decoration-none text-danger p-0 small"
                          onClick={() => setAdjustBank(bank)}
                        >
                          Reconcile
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4 text-muted small">
                  No bank accounts connected yet. Add your bank accounts to track split payments and
                  electronic settlements.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cash Drawer Transactions Audit Table */}
      <Card
        title={
          <div className="d-flex align-items-center gap-2">
            <History size={18} className="text-secondary" />
            <span>Cash Drawer Reconciliation & Inflow/Outflow Audit</span>
          </div>
        }
      >
        <DataTable
          columns={txnColumns}
          data={cashTxns?.data || []}
          keyExtractor={t => t.id}
          isLoading={txnsLoading}
          emptyTitle="No Cash Transactions Recorded"
          emptyDescription="Cash additions, retail counter collections, and drawer adjustments will appear here."
        />
      </Card>

      {/* Modals */}
      <AddCashModal
        isOpen={isAddCashOpen}
        onClose={() => setIsAddCashOpen(false)}
        onSuccess={() => {
          refetchCash();
          refetchTxns();
        }}
      />

      <AdjustCashModal
        isOpen={isAdjustCashOpen}
        onClose={() => setIsAdjustCashOpen(false)}
        onSuccess={() => {
          refetchCash();
          refetchTxns();
        }}
        currentBalance={cashBal}
      />

      <AddBankModal
        isOpen={isAddBankOpen}
        onClose={() => {
          setIsAddBankOpen(false);
          setBankToEdit(null);
        }}
        onSuccess={() => refetchBanks()}
        bankToEdit={bankToEdit}
      />

      {adjustBank && (
        <AdjustBankModal
          isOpen={Boolean(adjustBank)}
          onClose={() => setAdjustBank(null)}
          onSuccess={() => refetchBanks()}
          bank={adjustBank}
        />
      )}
    </div>
  );
}
