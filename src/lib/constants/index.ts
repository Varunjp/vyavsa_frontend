export const USER_TYPES = {
  PLATFORM_ADMIN: 'platform_admin',
  TENANT_USER: 'tenant_user',
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

export const ROLES = {
  PLATFORM_ADMIN: 'platform_admin',
  TENANT_ADMIN: 'admin',
  TENANT_OFFICE: 'office',
  TENANT_SALES: 'sales',
  TENANT_LINE: 'line',
  TENANT_USER: 'user',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'vyavsa_access_token',
  REFRESH_TOKEN: 'vyavsa_refresh_token',
  USER: 'vyavsa_user_profile',
  PLATFORM_ACCESS_TOKEN: 'vyavsa_platform_access_token',
  PLATFORM_REFRESH_TOKEN: 'vyavsa_platform_refresh_token',
  PLATFORM_USER: 'vyavsa_platform_user_profile',
  RESET_TOKEN: 'vyavsa_reset_token',
} as const;

export const API_ENDPOINTS = {
  HEALTH: '/health',
  READY: '/ready',
  PING: '/ping',

  // Auth
  AUTH_PLATFORM_LOGIN: '/auth/platform/login',
  AUTH_TENANT_LOGIN: '/auth/tenant/login',
  AUTH_REGISTER: '/auth/tenant/register',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_REVOKE: '/auth/revoke',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_VERIFY_RESET_OTP: '/auth/verify-reset-otp',
  AUTH_RESET_PASSWORD: '/auth/reset-password',

  // Public Catalog
  PLANS: '/plans',

  // Tenant Operations & Profile
  TENANT_PROFILE: '/tenant/profile',
  TENANT_SETTINGS: '/tenant/settings',
  TENANT_LOGO: '/tenant/logo',
  TENANT_SUBSCRIPTION: '/tenant/subscription',
  TENANT_SUBSCRIPTION_PLANS: '/tenant/subscription/plans',
  TENANT_CHECKOUT: '/tenant/subscription/checkout',
  TENANT_VERIFY_PAYMENT: '/tenant/subscription/verify',
  TENANT_PURCHASE_PLAN: '/tenant/subscription/purchase',
  TENANT_CANCEL_SUBSCRIPTION: '/tenant/subscription/cancel',
  TENANT_TRANSACTIONS: '/tenant/transactions',
  TENANT_USERS: '/tenant/users',

  // Dashboards & Financial Metrics
  TENANT_FINANCIAL_SUMMARY: '/tenant/financial-summary',
  TENANT_DASHBOARD_METRICS: '/tenant/dashboard',
  TENANT_DASHBOARD_TODAY: '/tenant/dashboard/today',
  TENANT_DASHBOARD_SALES: '/tenant/dashboard/sales',
  TENANT_DASHBOARD_OFFICE: '/tenant/dashboard/office',
  TENANT_DAILY_STATS: '/tenant/daily-stats',

  // Sales
  LINE_SALES: '/tenant/line-sales',
  LINE_SALES_BREAKDOWN: '/tenant/line-sales/breakdown',
  COUNTER_SALES: '/tenant/counter-sales',
  COUNTER_SALES_BREAKDOWN: '/tenant/counter-sales/breakdown',

  // Procurement & Parties
  PURCHASES: '/tenant/purchases',
  SUPPLIERS: '/tenant/suppliers',
  PARTIES: '/tenant/parties',
  CONTRA_SETTLEMENTS: '/tenant/contra-settlements',

  // Customers & Ledger
  CUSTOMERS: '/tenant/customers',
  CUSTOMER_COLLECTIONS: '/tenant/customer-collections',
  CUSTOMER_ADVANCES: '/tenant/customer-advances',

  // Operations
  EXPENSES: '/tenant/expenses',
  EMPLOYEES: '/tenant/employees',
  ATTENDANCE: '/tenant/attendance',
  OVERTIME: '/tenant/overtime',
  ADVANCES: '/tenant/advances',
  SALARIES: '/tenant/salaries',
  SALARIES_PENDING: '/tenant/salaries/pending',
  SALARY_PAYMENTS: '/tenant/salary-payments',

  // Cash & Bank
  CASH_BALANCE: '/tenant/cash/balance',
  CASH_ADD: '/tenant/cash/add',
  CASH_ADJUST: '/tenant/cash/adjust',
  CASH_TRANSACTIONS: '/tenant/cash/transactions',
  BANKS: '/tenant/banks',

  // Products
  PRODUCTS: '/tenant/products',
  PRODUCT_ANALYTICS: '/tenant/products/analytics',

  // Reports
  REPORTS_DAILY: '/tenant/reports/daily',
  REPORTS_SALES: '/tenant/reports/sales',
  REPORTS_ITEMS: '/tenant/reports/items',
  REPORTS_CUSTOMERS: '/tenant/reports/customers',

  // Platform Admin
  PLATFORM_METRICS: '/platform/dashboard/metrics',
  PLATFORM_TENANTS: '/platform/tenants',
  PLATFORM_PLANS: '/platform/plans',
  PLATFORM_SUBSCRIPTIONS: '/platform/subscriptions',
  PLATFORM_TRANSACTIONS: '/platform/transactions',
} as const;
