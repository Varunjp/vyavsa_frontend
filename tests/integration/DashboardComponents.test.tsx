import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FinancialOverviewCard } from '@/features/dashboard/components/FinancialOverviewCard';
import { BankAccountsSection } from '@/features/dashboard/components/BankAccountsSection';
import { EmployeeOverviewSection } from '@/features/dashboard/components/EmployeeOverviewSection';
import { FinancialMetrics, Bank, TodayOverview } from '@/types';

function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('FinancialOverviewCard', () => {
  const mockMetrics: FinancialMetrics = {
    cash_balance: '15000.00',
    bank_balance: '85000.00',
    total_receivable: '32000.00',
    total_payable: '18000.00',
    net_dues: '22000.00',
    net_receivables: '32000.00',
    pending_salary: '4000.00',
    today_employee_salary: '2500.00',
    today_stats: {
      tenant_id: 'tenant-123',
      date: '2026-11-05',
      line_sale_amount: '45000.00',
      counter_sale_amount: '12000.00',
      total_sales: '57000.00',
      purchase_amount: '9500.00',
      expense_amount: '3200.00',
      advance_amount: '1500.00',
      attendance_present: 8,
      attendance_absent: 1,
    },
  };

  it('renders all 8 required financial metrics', () => {
    renderWithQueryClient(<FinancialOverviewCard metrics={mockMetrics} isLoading={false} />);

    expect(screen.getByText('Cash Balance')).toBeInTheDocument();
    expect(screen.getByText('Bank Balance')).toBeInTheDocument();
    expect(screen.getByText('Pending Receivables')).toBeInTheDocument();
    expect(screen.getByText('Outstanding Payable')).toBeInTheDocument();
    expect(screen.getByText('Total Purchases')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Total Employee Advance')).toBeInTheDocument();
    expect(screen.getByText('Pending Staff Salary')).toBeInTheDocument();
  });

  it('renders loading placeholder glow elements when isLoading is true', () => {
    const { container } = renderWithQueryClient(
      <FinancialOverviewCard metrics={undefined} isLoading={true} />
    );
    expect(container.querySelectorAll('.placeholder').length).toBeGreaterThan(0);
  });

  it('renders error banner and retry button when error occurs', () => {
    const handleRetry = vi.fn();
    renderWithQueryClient(
      <FinancialOverviewCard
        metrics={undefined}
        isLoading={false}
        error={new Error('Network timeout')}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Failed to load financial overview metrics.')).toBeInTheDocument();
    expect(screen.getByText('Network timeout')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

describe('BankAccountsSection', () => {
  const mockBanks: Bank[] = [
    {
      id: 'bank-1',
      tenant_id: 'tenant-1',
      bank_name: 'State Bank of India',
      account_number: '1234567890',
      ifsc: 'SBIN0001234',
      current_balance: '45000.00',
      status: 'active',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    },
    {
      id: 'bank-2',
      tenant_id: 'tenant-1',
      bank_name: 'HDFC Bank',
      account_number: '9876543210',
      ifsc: 'HDFC0005678',
      current_balance: '40000.00',
      status: 'active',
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-01T00:00:00Z',
    },
  ];

  it('renders connected bank accounts with masked account numbers and balances', () => {
    renderWithQueryClient(<BankAccountsSection banks={mockBanks} isLoading={false} />);

    expect(screen.getByText('State Bank of India')).toBeInTheDocument();
    expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
    expect(screen.getByText(/•••• 7890/)).toBeInTheDocument();
    expect(screen.getByText(/•••• 3210/)).toBeInTheDocument();
    expect(screen.getByText('SBIN0001234', { exact: false })).toBeInTheDocument();
  });

  it('renders empty state when no bank accounts exist', () => {
    renderWithQueryClient(<BankAccountsSection banks={[]} isLoading={false} />);
    expect(screen.getByText('No Connected Bank Accounts')).toBeInTheDocument();
  });
});

describe('EmployeeOverviewSection', () => {
  const mockOverview: TodayOverview = {
    attendance: {
      present: 9,
      total: 10,
      absent: 1,
      has_records: true,
    },
    line_sale: '25000.00',
    counter_sale: '15000.00',
    employee_advance: '1200.00',
    outstanding_payable: '8000.00',
    date: '2026-11-05',
  };

  it('renders attendance counts and attendance percentage', () => {
    renderWithQueryClient(
      <EmployeeOverviewSection todayOverview={mockOverview} isLoading={false} />
    );

    expect(screen.getByText('Workforce & Staff Attendance')).toBeInTheDocument();
    expect(screen.getByText('Shift Attendance Rate')).toBeInTheDocument();
    expect(screen.getByText('Total Staff')).toBeInTheDocument();
    expect(screen.getByText('Present')).toBeInTheDocument();
    expect(screen.getByText('Absent')).toBeInTheDocument();
  });
});
