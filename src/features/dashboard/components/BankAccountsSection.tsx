'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { Bank } from '@/types';
import { Building2, ArrowUpRight, Plus } from 'lucide-react';

export interface BankAccountsSectionProps {
  banks?: Bank[];
  isLoading: boolean;
  totalBalance?: string | number;
}

export function BankAccountsSection({ banks, isLoading, totalBalance }: BankAccountsSectionProps) {
  const bankList = banks || [];

  return (
    <Card
      title={
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 32, height: 32, backgroundColor: '#eef2ff', color: '#4f46e5' }}
          >
            <Building2 size={16} />
          </div>
          <div>
            <span className="fw-bold text-dark">Bank Accounts &amp; Treasury</span>
            {totalBalance !== undefined && (
              <span className="text-muted small ms-2 font-mono">
                (Total: <strong className="text-dark">{formatCurrency(totalBalance)}</strong>)
              </span>
            )}
          </div>
        </div>
      }
      subtitle="Connected commercial bank accounts, balances, and UPI routing"
      className="mb-4"
      actions={
        <Link
          href="/dashboard?tab=cash-bank"
          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5"
        >
          <span>Manage Banks</span>
          <ArrowUpRight size={14} />
        </Link>
      }
    >
      {isLoading ? (
        <div className="row g-3">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="col-12 col-md-6 col-xl-4">
              <div className="p-3.5 rounded-3 border bg-light placeholder-glow">
                <span className="placeholder col-6 rounded py-2 d-block mb-2"></span>
                <span className="placeholder col-4 rounded py-1 d-block mb-3"></span>
                <span className="placeholder col-8 fs-5 rounded d-block"></span>
              </div>
            </div>
          ))}
        </div>
      ) : bankList.length === 0 ? (
        <div className="text-center py-4 px-3 bg-light rounded-3 border">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
            style={{ width: 44, height: 44, backgroundColor: '#e2e8f0', color: '#64748b' }}
          >
            <Building2 size={22} />
          </div>
          <h6 className="fw-bold text-dark mb-1">No Connected Bank Accounts</h6>
          <p className="text-muted small mb-3">
            Add business bank accounts to enable UPI settlements, split bills, and bank transfers.
          </p>
          <Link
            href="/dashboard?tab=cash-bank"
            className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
          >
            <Plus size={14} />
            <span>Connect Bank Account</span>
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {bankList.map(bank => {
            const maskedAcc = bank.account_number
              ? `•••• ${bank.account_number.slice(-4)}`
              : 'Direct UPI Account';

            return (
              <div key={bank.id} className="col-12 col-md-6 col-xl-4">
                <Link
                  href="/dashboard?tab=cash-bank"
                  className="text-decoration-none d-block h-100"
                  aria-label={`View ${bank.bank_name} details`}
                >
                  <div
                    className="p-3.5 rounded-3 border h-100 d-flex flex-column justify-content-between vyavsa-card-interactive bg-white"
                    style={{
                      borderLeft: '4px solid #4f46e5',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div>
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-1.5">
                        <div className="d-flex align-items-center gap-2 overflow-hidden">
                          <span
                            className="fw-bold text-dark text-truncate"
                            style={{ fontSize: '0.95rem' }}
                          >
                            {bank.bank_name}
                          </span>
                        </div>
                        <span
                          className={`badge rounded-pill ${
                            bank.status === 'active'
                              ? 'bg-success-subtle text-success'
                              : 'bg-secondary-subtle text-secondary'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {bank.status === 'active' ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                        <span className="text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                          A/C: {maskedAcc}
                        </span>
                        {bank.ifsc && (
                          <span className="text-muted font-mono" style={{ fontSize: '0.72rem' }}>
                            · IFSC: {bank.ifsc}
                          </span>
                        )}
                      </div>

                      <div className="d-flex align-items-baseline gap-2 mt-2">
                        <h4
                          className="fw-extrabold font-mono text-dark mb-0"
                          style={{ fontSize: '1.35rem' }}
                        >
                          {formatCurrency(bank.current_balance)}
                        </h4>
                        <span className="text-muted small">Available</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between pt-2.5 border-top mt-3">
                      <span
                        className="badge bg-light text-secondary border fw-normal"
                        style={{ fontSize: '0.68rem' }}
                      >
                        Commercial Account
                      </span>
                      <span
                        className="text-primary small fw-semibold d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <span>Passbook &amp; Reconcile</span>
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
