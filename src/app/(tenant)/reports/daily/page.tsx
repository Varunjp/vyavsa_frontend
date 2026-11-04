'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProtectedLayout } from '@/components/shared/ProtectedLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { reportService } from '@/features/reports/services/reportService';
import { customerService } from '@/features/customers/services/customerService';
import { Printer, Download, FileSpreadsheet } from 'lucide-react';

export default function DailyReportPage() {
  const [reportTab, setReportTab] = useState<'daily' | 'sales' | 'items' | 'customers'>('daily');
  const [reportDate, setReportDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Date filters for sales/items/customer reports
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Daily Report Query
  const { data: dailyReport, isLoading: dailyLoading } = useQuery({
    queryKey: ['daily-report', reportDate],
    queryFn: () => reportService.getDailyReport(reportDate),
    enabled: reportTab === 'daily',
  });

  // Sales Report Query
  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-report', fromDate, toDate],
    queryFn: () =>
      reportService.getSalesReport({
        from_date: fromDate,
        to_date: toDate,
        include_items: true,
        include_payment_breakdown: true,
      }),
    enabled: reportTab === 'sales',
  });

  // Items Report Query
  const { data: itemsReport, isLoading: itemsLoading } = useQuery({
    queryKey: ['items-report', fromDate, toDate],
    queryFn: () => reportService.getItemReport({ from_date: fromDate, to_date: toDate }),
    enabled: reportTab === 'items',
  });

  // Customers Lookup for Customer Report
  const { data: customersData } = useQuery({
    queryKey: ['customers-lookup-reports'],
    queryFn: () => customerService.listCustomers({ page_size: 100 }),
    enabled: reportTab === 'customers',
  });

  // Customer Report Query
  const { data: customerReport, isLoading: customerReportLoading } = useQuery({
    queryKey: ['customer-report', fromDate, toDate, selectedCustomerId],
    queryFn: () =>
      reportService.getCustomerReport({
        from_date: fromDate,
        to_date: toDate,
        customer_id: selectedCustomerId || undefined,
      }),
    enabled: reportTab === 'customers',
  });

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadDailyPDF = async () => {
    try {
      const blob = await reportService.downloadDailyReportPDF(reportDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Daily_Settlement_Report_${reportDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download daily report PDF');
    }
  };

  const handleDownloadSalesPDF = async () => {
    try {
      const blob = await reportService.downloadSalesReportPDF({
        from_date: fromDate,
        to_date: toDate,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sales_Report_${fromDate}_${toDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download sales report PDF');
    }
  };

  const handleDownloadSalesExcel = async () => {
    try {
      const blob = await reportService.downloadSalesReportExcel({
        from_date: fromDate,
        to_date: toDate,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sales_Report_${fromDate}_${toDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download sales report Excel');
    }
  };

  const cashBalance = dailyReport?.cash_balance;
  const financialSummary = dailyReport?.financial_summary;

  return (
    <ProtectedLayout>
      <PageHeader
        title="Business Financial Reports & Settlements"
        description="End-of-day reconciliation across drawer cash, multi-channel billing, item sales, and customer statements"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reports' }]}
        actions={
          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Printer size={15} />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${reportTab === 'daily' ? 'active fw-bold' : ''}`}
            onClick={() => setReportTab('daily')}
          >
            Daily Cash & Sales Settlement
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportTab === 'sales' ? 'active fw-bold' : ''}`}
            onClick={() => setReportTab('sales')}
          >
            Sales Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportTab === 'items' ? 'active fw-bold' : ''}`}
            onClick={() => setReportTab('items')}
          >
            Item-wise Sales Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${reportTab === 'customers' ? 'active fw-bold' : ''}`}
            onClick={() => setReportTab('customers')}
          >
            Customer Statements Report
          </button>
        </li>
      </ul>

      {/* TAB 1: DAILY SETTLEMENT REPORT */}
      {reportTab === 'daily' && (
        <div>
          {/* Date Picker Bar */}
          <div className="card p-3 border rounded shadow-sm mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small fw-semibold text-secondary">Settlement Date:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  style={{ width: '170px' }}
                  value={reportDate}
                  onChange={e => setReportDate(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Download size={15} />}
                  onClick={handleDownloadDailyPDF}
                >
                  Download Settlement PDF
                </Button>
              </div>
            </div>
          </div>

          {dailyLoading ? (
            <div className="p-5 text-center">
              <LoadingSpinner size="md" label="Generating daily financial settlement..." />
            </div>
          ) : (
            <div className="row g-4">
              {/* Cash Drawer Reconciliation */}
              <div className="col-lg-6">
                <Card
                  title="Physical Cash Drawer Movements"
                  subtitle={`Closing statement for ${formatDate(reportDate)}`}
                >
                  <ul className="list-group list-group-flush small">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                      <span>(+) Line Distribution Cash Collected</span>
                      <span className="fw-bold font-mono">
                        {formatCurrency(cashBalance?.line_sales_cash || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                      <span>(+) Counter Retail Cash Collected</span>
                      <span className="fw-bold font-mono">
                        {formatCurrency(cashBalance?.counter_sales_cash || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-success">
                      <span>(+) Additional Drawer Cash Inflows</span>
                      <span className="fw-bold font-mono">
                        {formatCurrency(cashBalance?.other_cash_inflows || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-danger">
                      <span>(-) Cash Disbursed to Purchases</span>
                      <span className="fw-bold font-mono">
                        {formatCurrency(cashBalance?.purchase_cash || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 text-danger">
                      <span>(-) Drawer Operating Expenses & Advances</span>
                      <span className="fw-bold font-mono">
                        {formatCurrency(cashBalance?.expense_cash || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 fw-bold border-top mt-2">
                      <span>Closing Cash in Drawer</span>
                      <span className="fs-5 font-mono text-dark">
                        {formatCurrency(cashBalance?.closing_cash || 0)}
                      </span>
                    </li>
                  </ul>
                </Card>
              </div>

              {/* Day Financial Indicators */}
              <div className="col-lg-6">
                <Card
                  title="Daily Revenue & Liquidity Summary"
                  subtitle="Day-level aggregate metrics across all distribution operations"
                >
                  <ul className="list-group list-group-flush small">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-muted">Total Line Distribution Billings</span>
                      <span className="fw-semibold font-mono text-dark">
                        {formatCurrency(financialSummary?.total_line_sales || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-muted">Total Point-of-Sale Counter Billings</span>
                      <span className="fw-semibold font-mono text-dark">
                        {formatCurrency(financialSummary?.total_counter_sales || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-muted">Total Stock Procurement Purchases</span>
                      <span className="fw-semibold font-mono text-dark">
                        {formatCurrency(financialSummary?.total_purchases || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-muted">Total Operating Expenses Logged</span>
                      <span className="fw-semibold font-mono text-dark">
                        {formatCurrency(financialSummary?.total_expenses || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2">
                      <span className="text-muted">Total Liquid Bank Balances</span>
                      <span className="fw-semibold font-mono text-primary">
                        {formatCurrency(financialSummary?.total_bank_balance || 0)}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 fw-bold border-top mt-2">
                      <span>Total Available Liquid Funds</span>
                      <span className="fs-5 font-mono text-success">
                        {formatCurrency(financialSummary?.total_available_funds || 0)}
                      </span>
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SALES REPORT */}
      {reportTab === 'sales' && (
        <div>
          <div className="card p-3 border rounded shadow-sm mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">From:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <span className="small text-muted">To:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Download size={14} />}
                  onClick={handleDownloadSalesPDF}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileSpreadsheet size={14} />}
                  onClick={handleDownloadSalesExcel}
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </div>

          {salesLoading ? (
            <div className="p-5 text-center">
              <LoadingSpinner size="md" label="Generating sales performance report..." />
            </div>
          ) : (
            <Card
              title="Sales Performance & Invoices Statement"
              subtitle={`Report period: ${formatDate(fromDate)} to ${formatDate(toDate)}`}
            >
              <div className="p-3 bg-light rounded border mb-3 small d-flex justify-content-around">
                <div>
                  <span className="text-muted d-block">Total Billed:</span>
                  <strong className="fs-5 font-mono text-dark">
                    {formatCurrency(
                      salesReport?.report?.summary?.total_amount || salesReport?.total_amount || 0
                    )}
                  </strong>
                </div>
                <div>
                  <span className="text-muted d-block">Cash Inflows:</span>
                  <strong className="fs-5 font-mono text-success">
                    {formatCurrency(
                      salesReport?.report?.summary?.total_cash || salesReport?.total_cash || 0
                    )}
                  </strong>
                </div>
                <div>
                  <span className="text-muted d-block">Bank Inflows:</span>
                  <strong className="fs-5 font-mono text-primary">
                    {formatCurrency(
                      salesReport?.report?.summary?.total_bank || salesReport?.total_bank || 0
                    )}
                  </strong>
                </div>
                <div>
                  <span className="text-muted d-block">Uncollected Dues:</span>
                  <strong className="fs-5 font-mono text-danger">
                    {formatCurrency(
                      salesReport?.report?.summary?.total_due || salesReport?.total_due || 0
                    )}
                  </strong>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: ITEM REPORT */}
      {reportTab === 'items' && (
        <div>
          <div className="card p-3 border rounded shadow-sm mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">From:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <span className="small text-muted">To:</span>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {itemsLoading ? (
            <div className="p-5 text-center">
              <LoadingSpinner size="md" label="Aggregating item-wise sales volume..." />
            </div>
          ) : (
            <Card
              title="Item-wise Sales Breakdown"
              subtitle="Detailed breakdown of units sold and gross earnings per item"
            >
              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Product / Item</th>
                      <th className="text-end">Total Units Sold</th>
                      <th className="text-end">Gross Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {itemsReport?.report?.items && itemsReport.report.items.length > 0 ? (
                      itemsReport.report.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{item.item_name}</td>
                          <td className="text-end font-mono">{item.total_quantity}</td>
                          <td className="text-end font-mono fw-bold text-dark">
                            {formatCurrency(item.total_amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-4 text-muted">
                          No item sales recorded for the selected date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* TAB 4: CUSTOMER REPORT */}
      {reportTab === 'customers' && (
        <div>
          <div className="card p-3 border rounded shadow-sm mb-4">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                >
                  <option value="">-- All Customers / Parties --</option>
                  {customersData?.data?.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.customer_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {customerReportLoading ? (
            <div className="p-5 text-center">
              <LoadingSpinner size="md" label="Generating customer ledger summary..." />
            </div>
          ) : (
            <Card
              title="Customer Khata Statement & Transactions"
              subtitle="Consolidated transaction history and balance adjustments"
            >
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle mb-0">
                  <thead className="table-light small">
                    <tr>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th className="text-end">Total Billed</th>
                      <th className="text-end">Paid Amount</th>
                      <th className="text-end">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {customerReport?.report?.customers &&
                    customerReport.report.customers.length > 0 ? (
                      customerReport.report.customers.map((c: any, idx: number) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{c.customer_name}</td>
                          <td className="text-muted font-mono">{c.phone || '—'}</td>
                          <td className="text-end font-mono text-dark">
                            {formatCurrency(c.total_billed)}
                          </td>
                          <td className="text-end font-mono text-success">
                            {formatCurrency(c.total_paid)}
                          </td>
                          <td className="text-end font-mono fw-bold text-danger">
                            {formatCurrency(c.closing_balance)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-muted">
                          No customer transaction statements found for this period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </ProtectedLayout>
  );
}
