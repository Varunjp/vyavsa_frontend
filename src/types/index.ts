import { Role, UserType } from '@/lib/constants';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  user_type: UserType;
  tenant_id?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface ApiPagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface ApiErrorInfo {
  code: string;
  message: string;
  details?: Record<string, string>;
  fields?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiErrorInfo;
  pagination?: ApiPagination;
}

// ----------------------------------------------------
// Platform Plan & Subscriptions
// ----------------------------------------------------

export interface Plan {
  id: string;
  plan_name: string;
  note?: string;
  price: string | number;
  billing_interval: 'monthly' | 'yearly';
  provider_plan_id?: string;
  status: 'active' | 'inactive' | 'archived';
  can_purchase?: boolean;
  action_label?: string;
  is_current?: boolean;
  is_queued?: boolean;
  ownership_status?: string;
  disabled_reason?: string;
  activation_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface QueuedSubscription {
  id: string;
  plan_id: string;
  plan_name: string;
  price: string | number;
  billing_interval: string;
  status: string;
  starts_at?: string;
  ends_at?: string;
  days_until_activation: number;
  created_at: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  current_plan_id: string;
  current_plan_name: string;
  price: string | number;
  note?: string;
  status: 'active' | 'past_due' | 'expired' | 'cancelled' | 'queued';
  billing_interval?: string;
  provider?: string;
  provider_subscription_id?: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  start_date?: string;
  end_date?: string;
  is_expired: boolean;
  days_remaining: number;
  queued_subscription?: QueuedSubscription;
  created_at: string;
  updated_at: string;
}

export interface PlanTransaction {
  id: string;
  tenant_id: string;
  transaction_id: string;
  payment_method: string;
  plan_id: string;
  plan_name: string;
  amount: string | number;
  currency: string;
  status: string;
  provider?: string;
  provider_payment_id?: string;
  provider_subscription_id?: string;
  failure_reason?: string;
  billing_period_start?: string;
  billing_period_end?: string;
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------
// Tenant Organization Profile & Financial Summary
// ----------------------------------------------------

export interface TenantProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  logo_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  invoice_footer_heading?: string;
  invoice_footer_paragraph?: string;
  formatted_address?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface TenantAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface FinancialSummary {
  cash_balance: string | number;
  bank_balance: string | number;
  total_receivable: string | number;
  total_payable: string | number;
  updated_at: string;
}

export interface FinancialMetrics {
  cash_balance: string | number;
  bank_balance: string | number;
  total_receivable: string | number;
  total_payable: string | number;
  net_dues: string | number;
  net_receivables: string | number;
  pending_salary: string | number;
  today_employee_salary: string | number;
  bank_balances?: Bank[];
  today_stats?: DailyStats;
  today_overview?: TodayOverview;
  requested_date?: string;
  data_date?: string;
  is_current?: boolean;
  days_old?: number;
}

export interface TodayOverview {
  attendance: {
    present: number;
    total: number;
    absent: number;
    has_records: boolean;
  };
  line_sale: string | number;
  counter_sale: string | number;
  employee_advance: string | number;
  current_item?: {
    name: string;
    quantity: number;
    total_amount: string | number;
    total_paid: string | number;
    total_pending: string | number;
    date: string;
    is_today: boolean;
    source: string;
  };
  outstanding_payable: string | number;
  date: string;
}

export interface DailyStats {
  tenant_id?: string;
  date?: string;
  line_sale_amount: string | number;
  counter_sale_amount: string | number;
  total_sales: string | number;
  purchase_amount: string | number;
  expense_amount: string | number;
  advance_amount: string | number;
  wages_amount?: string | number;
  attendance_present: number;
  attendance_absent: number;
  today_employee_salary?: string | number;
  amount_received?: string | number;
  amount_paid?: string | number;
}

export interface SaleBankBreakdown {
  bank_id?: string;
  bank_name: string;
  account_number?: string;
  amount: string | number;
  percentage: number;
}

export interface SalePaymentBreakdown {
  total_sales: string | number;
  cash_received: string | number;
  bank_received: string | number;
  total_received: string | number;
  advance_applied: string | number;
  payable_applied: string | number;
  contra_amount?: string | number;
  total_due: string | number;
  sales_count: number;
  start_date?: string;
  end_date?: string;
  is_reconciled?: boolean;
  bank_breakdown?: SaleBankBreakdown[];
}

export interface OfficeDashboardData {
  business_date: string;
  currency: string;
  total_cash_collected: string | number;
  total_bank_received: string | number;
  total_attendance: number;
  present_count: number;
  absent_count: number;
  half_day_count: number;
  total_active_employees: number;
  total_sales_count: number;
  total_sales_amount: string | number;
}

// ----------------------------------------------------
// Customers, Suppliers & Unified Parties
// ----------------------------------------------------

export interface Customer {
  id: string;
  tenant_id: string;
  customer_name: string;
  phone?: string;
  email?: string;
  address?: string;
  opening_balance: string | number;
  opening_payable_balance?: string | number;
  current_balance: string | number;
  advance_balance: string | number;
  total_billed: string | number;
  amount_paid: string | number;
  outstanding_balance: string | number;
  total_purchases: string | number;
  total_paid: string | number;
  outstanding_payable: string | number;
  total_receivable: string | number;
  total_payable: string | number;
  net_balance: string | number;
  net_status: 'owes_us' | 'we_owe' | 'settled';
  status: 'active' | 'inactive';
  role: 'customer' | 'supplier' | 'both';
  is_customer: boolean;
  is_supplier: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  tenant_id: string;
  supplier_name: string;
  customer_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  total_purchases: string | number;
  total_paid: string | number;
  outstanding_payable: string | number;
  total_receivable: string | number;
  total_payable: string | number;
  net_balance: string | number;
  net_status: 'owes_us' | 'we_owe' | 'settled';
  status: 'active' | 'inactive';
  role: 'customer' | 'supplier' | 'both';
  is_customer: boolean;
  is_supplier: boolean;
  created_at: string;
  updated_at: string;
}

export interface Party {
  id: string;
  tenant_id: string;
  name: string;
  customer_name: string;
  phone?: string;
  email?: string;
  address?: string;
  role: 'customer' | 'supplier' | 'both';
  is_customer: boolean;
  is_supplier: boolean;
  opening_balance: string | number;
  opening_payable_balance: string | number;
  advance_balance: string | number;
  total_receivable: string | number;
  total_payable: string | number;
  net_balance: string | number;
  net_status: 'owes_us' | 'we_owe' | 'settled';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PartyFinancialSummary {
  party_id: string;
  party_name: string;
  phone?: string;
  email?: string;
  address?: string;
  role: string;
  is_customer: boolean;
  is_supplier: boolean;
  status: string;
  total_receivable: string | number;
  total_payable: string | number;
  advance_balance: string | number;
  net_balance: string | number;
  net_status: string;
  total_sales: string | number;
  total_sales_paid: string | number;
  total_purchases: string | number;
  total_purchases_paid: string | number;
  max_contra_settlement: string | number;
}

export interface ContraPreview {
  party_id: string;
  party_name: string;
  current_receivable: string | number;
  current_payable: string | number;
  max_contra_amount: string | number;
  receivable_after_max: string | number;
  payable_after_max: string | number;
  net_balance_after: string | number;
}

export interface ContraSettlement {
  id: string;
  tenant_id: string;
  party_id: string;
  party_name: string;
  settlement_number: string;
  amount: string | number;
  settlement_date: string;
  receivable_before: string | number;
  receivable_after: string | number;
  payable_before: string | number;
  payable_after: string | number;
  note?: string;
  status: 'settled' | 'cancelled';
  created_at: string;
}

export interface CustomerStatementEntry {
  date: string;
  entry_type: 'invoice' | 'payment' | 'adjustment' | 'advance' | 'contra';
  reference: string;
  description: string;
  debit: string | number;
  credit: string | number;
  running_balance: string | number;
}

export interface CustomerStatement {
  customer_id: string;
  customer_name: string;
  opening_balance: string | number;
  opening_payable_balance?: string | number;
  current_balance: string | number;
  total_debit: string | number;
  total_credit: string | number;
  entries: CustomerStatementEntry[];
}

export interface SupplierStatementEntry {
  date: string;
  entry_type: 'purchase' | 'payment' | 'contra';
  reference: string;
  description: string;
  debit: string | number;
  credit: string | number;
  running_balance: string | number;
}

export interface SupplierStatement {
  supplier_id: string;
  supplier_name: string;
  total_purchases: string | number;
  total_paid: string | number;
  outstanding_payable: string | number;
  total_receivable: string | number;
  net_balance: string | number;
  net_status: string;
  entries: SupplierStatementEntry[];
}

// ----------------------------------------------------
// Sales & Purchases
// ----------------------------------------------------

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id?: string;
  product_name_snapshot: string;
  quantity: string | number;
  unit_price: string | number;
  line_total: string | number;
  created_at: string;
}

export interface LineSalePayment {
  id: string;
  line_sale_id: string;
  payment_method: string;
  bank_id?: string;
  bank_name?: string;
  amount: string | number;
  payment_date?: string;
  reference_id?: string;
  status?: string;
  note?: string;
  created_at: string;
}

export interface LineSale {
  id: string;
  tenant_id: string;
  invoice_number?: string;
  customer_id: string;
  customer_name: string;
  customer_phone?: string;
  route?: string;
  salesman?: string;
  note?: string;
  subtotal: string | number;
  discount: string | number;
  total_amount: string | number;
  total_cash_in: string | number;
  bank_amount: string | number;
  collected_amount: string | number;
  amount_allocated_to_sale: string | number;
  balance: string | number;
  previous_balance: string | number;
  advance_applied: string | number;
  previous_dues_settled: string | number;
  advance_generated: string | number;
  contra_amount: string | number;
  previous_payable: string | number;
  updated_balance: string | number;
  sale_date?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  payments?: LineSalePayment[];
  items?: SaleItem[];
}

export interface CounterSalePayment {
  id: string;
  counter_sale_id: string;
  payment_method: string;
  bank_id?: string;
  bank_name?: string;
  amount: string | number;
  payment_date?: string;
  reference_id?: string;
  status?: string;
  note?: string;
  created_at: string;
}

export interface CounterSale {
  id: string;
  tenant_id: string;
  invoice_number?: string;
  customer_id?: string;
  customer_name?: string;
  item: string;
  price: string | number;
  subtotal: string | number;
  discount: string | number;
  total_amount: string | number;
  payment_method: string;
  cash: string | number;
  bank_amount: string | number;
  bank_id?: string;
  collected_amount: string | number;
  amount_allocated_to_sale: string | number;
  account: string | number;
  previous_balance: string | number;
  advance_applied: string | number;
  previous_dues_settled: string | number;
  advance_generated: string | number;
  contra_amount: string | number;
  previous_payable: string | number;
  updated_balance: string | number;
  sale_date?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  payments?: CounterSalePayment[];
  items?: SaleItem[];
}

export interface PurchasePayment {
  id: string;
  purchase_id: string;
  customer_id?: string;
  supplier_id?: string;
  payment_method: string;
  bank_id?: string;
  bank_name?: string;
  amount: string | number;
  payment_date?: string;
  reference_id?: string;
  status?: string;
  note?: string;
  is_settlement: boolean;
  created_at: string;
}

export interface Purchase {
  id: string;
  tenant_id: string;
  customer_id?: string;
  customer_name?: string;
  supplier_id?: string;
  supplier_name?: string;
  item: string;
  quantity: number;
  total_amount: string | number;
  total_paid: string | number;
  total_pending: string | number;
  outstanding_amount: string | number;
  payment_status: 'PAID' | 'PARTIALLY_PAID' | 'UNPAID';
  contra_amount: string | number;
  previous_receivable: string | number;
  created_at: string;
  updated_at: string;
  payments?: PurchasePayment[];
}

// ----------------------------------------------------
// Operational Expenses
// ----------------------------------------------------

export interface ExpensePayment {
  id: string;
  payment_method: string;
  bank_id?: string;
  bank_name?: string;
  amount: string | number;
  payment_date?: string;
  reference_id?: string;
  note?: string;
}

export interface Expense {
  id: string;
  tenant_id: string;
  item: string;
  category?: string;
  employee_id?: string;
  employee_name?: string;
  total_amount: string | number;
  amount: string | number;
  payment_method: string;
  created_at: string;
  updated_at: string;
  payments?: ExpensePayment[];
}

// ----------------------------------------------------
// Cash & Bank
// ----------------------------------------------------

export interface CashTransaction {
  id: string;
  tenant_id: string;
  transaction_type: string;
  amount: string | number;
  previous_balance: string | number;
  new_balance: string | number;
  description?: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export interface Bank {
  id: string;
  tenant_id: string;
  bank_name: string;
  account_number?: string;
  ifsc?: string;
  current_balance: string | number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  tenant_id: string;
  bank_id: string;
  transaction_type: string;
  amount: string | number;
  previous_balance: string | number;
  new_balance: string | number;
  reference_id?: string;
  description?: string;
  created_at: string;
}

// ----------------------------------------------------
// Staff, Attendance & Payroll
// ----------------------------------------------------

export interface Employee {
  id: string;
  tenant_id: string;
  name: string;
  phone?: string;
  salary?: string | number;
  ot_rate: string | number;
  status: 'active' | 'inactive' | 'terminated';
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  tenant_id: string;
  employee_id: string;
  employee_name?: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  daily_salary?: string | number;
  ot: string | number;
  ot_amount: string | number;
  advance: string | number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeAdvanceRecord {
  id: string;
  tenant_id: string;
  employee_id: string;
  employee_name?: string;
  amount: string | number;
  payment_method: string;
  bank_name?: string;
  advance_date: string;
  notes?: string;
  created_at: string;
}

export interface EmployeeOvertimeRecord {
  id: string;
  tenant_id: string;
  employee_id: string;
  employee_name?: string;
  amount: string | number;
  overtime_date: string;
  notes?: string;
  created_at: string;
}

export interface EmployeeSalaryRecord {
  id: string;
  tenant_id: string;
  employee_id: string;
  employee_name: string;
  salary_rate?: string | number;
  ot_rate: string | number;
  total_overtime: string | number;
  gross_salary: string | number;
  total_advances: string | number;
  total_paid: string | number;
  balance: string | number;
  created_at: string;
  updated_at: string;
}

export interface EmployeeSalaryPaymentRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  payment_method: string;
  bank_name?: string;
  amount: string | number;
  payment_date?: string;
  reference_id?: string;
  note?: string;
  created_at: string;
}

export interface EmployeeSalaryStatementRecord {
  employee_id: string;
  employee_name: string;
  base_salary?: string | number;
  total_overtime: string | number;
  gross_salary: string | number;
  total_advances: string | number;
  total_paid: string | number;
  net_payable: string | number;
  overtimes: EmployeeOvertimeRecord[];
  advances: EmployeeAdvanceRecord[];
  payments: EmployeeSalaryPaymentRecord[];
}

// ----------------------------------------------------
// Products Catalog
// ----------------------------------------------------

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  unit_price: string | number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ProductAnalytics {
  sales_summary: {
    total_quantity_sold: string | number;
    total_revenue: string | number;
    distinct_products_count: number;
  };
  top_selling_products: Array<{
    product_id: string;
    product_name: string;
    total_quantity_sold: string | number;
    total_revenue: string | number;
    sale_count: number;
  }>;
  daily_sales: Array<{
    date: string;
    product_id: string;
    product_name: string;
    quantity: string | number;
    revenue: string | number;
  }>;
}

// ----------------------------------------------------
// Platform Admin Views
// ----------------------------------------------------

export interface PlatformDashboardMetrics {
  active_tenants: number;
  total_tenants: number;
  monthly_received_income: string | number;
  recent_registrations_7d: number;
  revenue_trend: Array<{
    month: string;
    revenue: string | number;
    count: number;
  }>;
}

export interface PlatformTenantItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  logo_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface PlatformSubscriptionItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  tenant_email: string;
  current_plan_id: string;
  current_plan_name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformTransactionItem {
  id: string;
  tenant_id: string;
  tenant_name: string;
  tenant_email: string;
  transaction_id: string;
  payment_method: string;
  plan_id: string;
  plan_name: string;
  amount: string | number;
  status: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantUserItem {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  created_at: string;
  updated_at: string;
}
