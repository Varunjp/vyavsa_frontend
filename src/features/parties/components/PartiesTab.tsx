'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { partyService } from '../services/partyService';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ContraSettlement, Party } from '@/types';
import { Plus, Search, ArrowRightLeft, Edit, Building2, History, XCircle } from 'lucide-react';
import { CreatePartyModal } from './CreatePartyModal';
import { CreateContraModal } from './CreateContraModal';

export function PartiesTab() {
  const [subTab, setSubTab] = useState<'parties' | 'contra_history'>('parties');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  // Modals
  const [isPartyModalOpen, setIsPartyModalOpen] = useState(false);
  const [partyToEdit, setPartyToEdit] = useState<Party | null>(null);
  const [contraParty, setContraParty] = useState<Party | null>(null);

  // Queries
  const {
    data: partiesData,
    isLoading: partiesLoading,
    refetch: refetchParties,
  } = useQuery({
    queryKey: ['parties', page, search],
    queryFn: () => partyService.listParties({ page, page_size: 15, search }),
    enabled: subTab === 'parties',
  });

  const {
    data: contraData,
    isLoading: contraLoading,
    refetch: refetchContra,
  } = useQuery({
    queryKey: ['contra-history', page],
    queryFn: () => partyService.listContraSettlements({ page, page_size: 15 }),
    enabled: subTab === 'contra_history',
  });

  const handleCancelContra = async (contra: ContraSettlement) => {
    if (
      !confirm(
        `Are you sure you want to cancel and reverse contra settlement #${contra.settlement_number}?`
      )
    ) {
      return;
    }
    try {
      await partyService.cancelContraSettlement(contra.id);
      alert('Contra settlement cancelled and reversed successfully.');
      refetchContra();
      refetchParties();
    } catch {
      alert('Failed to cancel contra settlement');
    }
  };

  const partyColumns: Column<Party>[] = [
    {
      key: 'name',
      header: 'Business Party',
      render: p => (
        <div>
          <div className="fw-semibold text-dark">{p.name || p.customer_name}</div>
          <span className="small text-muted">{p.phone || p.email || 'No contact info'}</span>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: p => {
        const isBoth = p.role === 'both' || (p.is_customer && p.is_supplier);
        return (
          <span
            className={`badge ${
              isBoth ? 'bg-primary-subtle text-primary' : 'bg-light text-dark border'
            } text-uppercase small`}
          >
            {isBoth ? 'Customer & Supplier' : p.role}
          </span>
        );
      },
    },
    {
      key: 'receivable',
      header: 'Receivable Due (Khata)',
      render: p => (
        <span className="font-mono text-danger fw-semibold">
          {formatCurrency(p.total_receivable)}
        </span>
      ),
    },
    {
      key: 'payable',
      header: 'Payable Due (Bills)',
      render: p => (
        <span className="font-mono text-warning fw-semibold">
          {formatCurrency(p.total_payable)}
        </span>
      ),
    },
    {
      key: 'net_balance',
      header: 'Net Offset Position',
      render: p => {
        const net = Number(p.net_balance || 0);
        return (
          <div>
            <div
              className={`font-mono fw-bold ${net > 0 ? 'text-danger' : net < 0 ? 'text-warning' : 'text-success'}`}
            >
              {formatCurrency(Math.abs(net))}
            </div>
            <span className="small text-muted text-uppercase" style={{ fontSize: '0.6875rem' }}>
              {p.net_status === 'owes_us'
                ? 'Customer Owes Us'
                : p.net_status === 'we_owe'
                  ? 'We Owe Supplier'
                  : 'Settled'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: p => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          {Number(p.total_receivable || 0) > 0 && Number(p.total_payable || 0) > 0 && (
            <button
              className="btn btn-sm btn-primary p-1 px-2 d-inline-flex align-items-center gap-1"
              title="Execute Contra Settlement"
              onClick={() => setContraParty(p)}
            >
              <ArrowRightLeft size={14} /> Offset Contra
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-secondary p-1"
            title="Edit Party"
            onClick={() => {
              setPartyToEdit(p);
              setIsPartyModalOpen(true);
            }}
          >
            <Edit size={14} />
          </button>
        </div>
      ),
    },
  ];

  const contraColumns: Column<ContraSettlement>[] = [
    {
      key: 'settlement_number',
      header: 'Settlement #',
      render: c => (
        <span className="font-mono fw-semibold text-dark">
          {c.settlement_number || `#${c.id.slice(0, 8)}`}
        </span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: c => (
        <span className="text-muted small">
          {c.settlement_date ? formatDate(c.settlement_date) : formatDate(c.created_at)}
        </span>
      ),
    },
    {
      key: 'party',
      header: 'Party Entity',
      render: c => <span className="fw-semibold text-dark">{c.party_name}</span>,
    },
    {
      key: 'amount',
      header: 'Offset Amount',
      render: c => (
        <span className="font-mono fw-bold text-success">{formatCurrency(c.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: c => (
        <span
          className={`badge ${c.status === 'settled' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} small text-uppercase`}
        >
          {c.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: c => (
        <div>
          {c.status === 'settled' && (
            <button
              className="btn btn-sm btn-outline-danger p-1 px-2 d-inline-flex align-items-center gap-1"
              title="Cancel Contra Settlement"
              onClick={() => handleCancelContra(c)}
            >
              <XCircle size={14} /> Cancel
            </button>
          )}
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
              className={`nav-link ${subTab === 'parties' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('parties');
                setPage(1);
              }}
            >
              <Building2 size={16} className="me-1" /> Unified Business Parties
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${subTab === 'contra_history' ? 'active fw-bold' : ''}`}
              onClick={() => {
                setSubTab('contra_history');
                setPage(1);
              }}
            >
              <History size={16} className="me-1" /> Contra Settlement Audit
            </button>
          </li>
        </ul>

        <div className="d-flex gap-2">
          {subTab === 'parties' && (
            <div className="input-group" style={{ maxWidth: '280px' }}>
              <span className="input-group-text bg-white">
                <Search size={14} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search parties..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          )}

          {subTab === 'parties' && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setPartyToEdit(null);
                setIsPartyModalOpen(true);
              }}
            >
              Add Unified Party
            </Button>
          )}
        </div>
      </div>

      {subTab === 'parties' ? (
        <DataTable
          columns={partyColumns}
          data={partiesData?.data || []}
          keyExtractor={p => p.id}
          isLoading={partiesLoading}
          emptyTitle="No Unified Parties Found"
          emptyDescription="Register parties that act simultaneously as customers and suppliers to enable automatic contra offset settlements."
          emptyActionLabel="Add Unified Party"
          onEmptyAction={() => {
            setPartyToEdit(null);
            setIsPartyModalOpen(true);
          }}
        />
      ) : (
        <DataTable
          columns={contraColumns}
          data={contraData?.data || []}
          keyExtractor={c => c.id}
          isLoading={contraLoading}
          emptyTitle="No Contra Settlements Executed"
          emptyDescription="When mutual dues between customers and suppliers are offset, records will appear here."
        />
      )}

      {/* Modals */}
      <CreatePartyModal
        isOpen={isPartyModalOpen}
        onClose={() => {
          setIsPartyModalOpen(false);
          setPartyToEdit(null);
        }}
        onSuccess={() => refetchParties()}
        partyToEdit={partyToEdit}
      />

      {contraParty && (
        <CreateContraModal
          isOpen={Boolean(contraParty)}
          onClose={() => setContraParty(null)}
          onSuccess={() => {
            refetchParties();
            refetchContra();
          }}
          party={contraParty}
        />
      )}
    </div>
  );
}
