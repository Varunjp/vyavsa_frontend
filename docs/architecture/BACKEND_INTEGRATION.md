# Vyavsa Backend Integration Guide & Architectural Audit

## 1. Executive Summary & Backend Architecture

Vyavsa is a multi-tenant Software-as-a-Service (SaaS) financial management and billing application built for small businesses (retail shops, line-distribution suppliers, counter-sales outlets, and wholesale merchants).

The backend repository (`vyavsa/`) is implemented in **Golang 1.22+** leveraging the **Gin Web Framework**, **PostgreSQL 15+** with `pgxpool`, and **Redis 7+** for caching, rate limiting, and token revocation. It features a clean, layered architecture consisting of:
- **`cmd/`**: Entrypoints (`cmd/api/main.go`, migration scripts, backup/restore CLI utilities).
- **`internal/server/`**: HTTP server lifecycle, middleware pipeline configuration, route group wiring, and graceful shutdown orchestration.
- **`internal/handler/`**: Transport layer handling HTTP deserialization, payload validation, and standard response formatting for platform, tenant, authentication, and reporting domains.
- **`internal/service/`**: Core business domain logic, financial ledger computations, transaction boundary management, and external service orchestration (Razorpay, Cloudflare R2, SMTP/Resend).
- **`internal/repository/`**: Persistence layer utilizing raw SQL queries with `pgx` and Redis commands with `go-redis`.
- **`internal/domain/` & `internal/dto/`**: Strongly typed domain entities, database records, and API transfer objects.
- **`pkg/response/` & `pkg/errors/`**: Centralized, standardized JSON response envelopes and structured error representations.

---

## 2. API Endpoint Inventory

The backend exposes a versioned REST API mounted under `/api/v1`. All endpoints enforce strict JSON payloads, rate limiting, and role-based access control.

### 2.1 Public & Authentication Endpoints

| Method | Endpoint | Auth | Rate Limit | Request DTO | Response DTO / Description |
|---|---|---|---|---|---|
| `GET` | `/health` | Public | None | None | Liveness check `{"status": "ok"}` |
| `GET` | `/ready` | Public | None | None | Readiness check (DB & Redis ping) |
| `GET` | `/metrics` | Public / Ops | None | None | Prometheus scrape metrics |
| `GET` | `/api/v1/ping` | Public | General (100/min) | None | Heartbeat confirmation |
| `GET` | `/api/v1/plans` | Public | General (100/min) | None | Catalog of public subscription plans |
| `POST` | `/api/v1/auth/platform/login` | Public | Auth (20/min) | `PlatformLoginRequest` | `TokenResponse` (Platform admin JWT pair) |
| `POST` | `/api/v1/auth/tenant/login` | Public | Tenant Login (20/min) | `TenantLoginRequest` | `TokenResponse` (Tenant member JWT pair) |
| `POST` | `/api/v1/auth/tenant/register` | Public | Auth (20/min) | `TenantRegisterRequest` | `TenantRegisterResponse` (Self-registration) |
| `POST` | `/api/v1/tenants/register` | Public | Auth (20/min) | `TenantRegisterRequest` | Alias for tenant registration |
| `POST` | `/api/v1/auth/refresh` | Public / Cookie | Auth (20/min) | `RefreshTokenRequest` | `TokenResponse` (Rotated JWT pair) |
| `POST` | `/api/v1/auth/revoke` | Public / Cookie | Auth (20/min) | `RefreshTokenRequest` | Revoke specific refresh token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Security (5/min) | `ForgotPasswordRequest` | Dispatches 6-digit OTP via email |
| `POST` | `/api/v1/auth/verify-reset-otp` | Public | Security (5/min) | `VerifyResetOTPRequest` | Returns short-lived `reset_token` |
| `POST` | `/api/v1/auth/reset-password` | Public | Security (5/min) | `ResetPasswordRequest` | Sets new password via `reset_token` |
| `POST` | `/api/v1/payments/razorpay/webhook` | Webhook (HMAC) | None | Raw JSON / HMAC signature | Asynchronous payment event webhook |

### 2.2 Core Authenticated Session Endpoints

| Method | Endpoint | Required Role | Rate Limit | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/auth/me` | Authenticated | General (100/min) | Returns authenticated user profile and tenant claims |
| `POST` | `/api/v1/auth/logout` | Authenticated | General (100/min) | Blacklists active access token in Redis |

### 2.3 Platform Administrator Endpoints (`/api/v1/platform`)

Requires `user_type: platform_admin` and `role: platform_admin`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/platform/ping` | Platform admin authentication verification |
| `GET` | `/api/v1/platform/dashboard/metrics` | High-level platform KPIs (MRR, active tenants, churn) |
| `POST` | `/api/v1/platform/plans` | Create subscription plan |
| `GET` | `/api/v1/platform/plans` | List all subscription plans |
| `GET` | `/api/v1/platform/plans/:id` | Get subscription plan by ID |
| `PUT` | `/api/v1/platform/plans/:id` | Update subscription plan |
| `DELETE` | `/api/v1/platform/plans/:id` | Soft-delete / archive subscription plan |
| `POST` | `/api/v1/platform/tenants` | Onboard tenant manually |
| `GET` | `/api/v1/platform/tenants` | List all tenants with filters and pagination |
| `GET` | `/api/v1/platform/tenants/:id` | Detailed tenant profile, admin user, and plan status |
| `PUT` | `/api/v1/platform/tenants/:id` | Update tenant business information |
| `PATCH` | `/api/v1/platform/tenants/:id/status` | Update tenant status (`active`, `inactive`, `suspended`) |
| `POST` | `/api/v1/platform/tenants/:id/subscription`| Change tenant subscription plan |
| `PATCH` | `/api/v1/platform/tenants/:id/subscription/status`| Update subscription status |
| `GET` | `/api/v1/platform/subscriptions` | List all tenant subscription records |
| `GET` | `/api/v1/platform/transactions` | List all billing transactions across tenants |

### 2.4 Tenant Member Endpoints (`/api/v1/tenant`)

Requires `user_type: tenant_user` and an active subscription plan (`RequireActivePlan` middleware).

#### A. Read-Only Organization & Product Catalog Lookups (All Tenant Roles)
- `GET /api/v1/tenant/profile` & `GET /api/v1/tenant/settings` — Current tenant business details.
- `GET /api/v1/tenant/logo` — Signed URL or redirect to tenant organization logo.
- `GET /api/v1/tenant/subscription` — Active subscription details and status.
- `GET /api/v1/tenant/subscription/plans` & `GET /api/v1/tenant/plans` — Available upgrade plans.
- `GET /api/v1/tenant/products` (and alias `/api/v1/products`) — Searchable product catalog.
- `GET /api/v1/tenant/products/:id` — Product details.

#### B. Sales & Line Distribution (Roles: `admin`, `office`, `sales`, `line`, `user`)
- `GET /api/v1/tenant/dashboard/sales` — Sales-focused summary metrics (scoped to user if line/sales role).
- `POST /api/v1/tenant/line-sales` — Create line sale with itemized products, discounts, and split payments.
- `GET /api/v1/tenant/line-sales` — List line sales with filters (`customer_id`, `from_date`, `to_date`, `status`).
- `GET /api/v1/tenant/line-sales/breakdown` — Payment breakdown across cash and bank accounts.
- `GET /api/v1/tenant/line-sales/:id` — Fetch complete line sale invoice details.
- `PUT /api/v1/tenant/line-sales/:id` — Update line sale record.
- `DELETE /api/v1/tenant/line-sales/:id` — Void/delete line sale record.
- `GET /api/v1/tenant/line-sales/:id/payments` — Payment history for a line sale.
- `POST /api/v1/tenant/line-sales/:id/payments` — Record subsequent payment against a line sale invoice.
- `GET /api/v1/tenant/line-sales/:id/pdf` — Stream generated invoice PDF.

#### C. Office Operations (Roles: `admin`, `office`, `user`)
- `GET /api/v1/tenant/dashboard/office` — Office operations KPI metrics.
- `POST /api/v1/tenant/counter-sales` — Create quick counter retail sale.
- `GET /api/v1/tenant/counter-sales` — List counter sales.
- `GET /api/v1/tenant/counter-sales/breakdown` — Counter sales payment distribution breakdown.
- `GET /api/v1/tenant/counter-sales/:id` — Counter sale details.
- `PUT /api/v1/tenant/counter-sales/:id` — Update counter sale.
- `DELETE /api/v1/tenant/counter-sales/:id` — Cancel/delete counter sale.
- `GET /api/v1/tenant/counter-sales/:id/payments` — Counter sale payments list.
- `POST /api/v1/tenant/counter-sales/:id/payments` — Counter sale payment recording.
- `GET /api/v1/tenant/counter-sales/:id/pdf` — Counter sale receipt PDF download.
- `POST /api/v1/tenant/purchases` — Record inventory purchase from supplier.
- `GET /api/v1/tenant/purchases` — List inventory purchases.
- `GET /api/v1/tenant/purchases/:id` — Purchase details.
- `PUT /api/v1/tenant/purchases/:id` — Update purchase details.
- `DELETE /api/v1/tenant/purchases/:id` — Void purchase order.
- `GET /api/v1/tenant/purchases/:id/payments` — List purchase settlement payments.
- `POST /api/v1/tenant/purchases/:id/payments` — Record settlement payment to supplier.
- `POST /api/v1/tenant/suppliers` — Register supplier.
- `GET /api/v1/tenant/suppliers` — List suppliers.
- `GET /api/v1/tenant/suppliers/:id` — Supplier details.
- `PUT /api/v1/tenant/suppliers/:id` — Update supplier profile.
- `DELETE /api/v1/tenant/suppliers/:id` — Delete supplier.
- `GET /api/v1/tenant/suppliers/:id/balance` — Outstanding payable balance to supplier.
- `GET /api/v1/tenant/suppliers/:id/statement` — Supplier transaction ledger statement.
- `GET /api/v1/tenant/suppliers/:id/payments` — List payments made to supplier.
- `POST /api/v1/tenant/suppliers/:id/payments` — Record disbursement to supplier.
- `POST /api/v1/tenant/contra-settlements` — Execute contra settlement (offset mutual customer/supplier balances).
- `POST /api/v1/tenant/contra-settlements/:id/cancel` — Void a previously executed contra settlement.
- `GET /api/v1/tenant/contra-settlements` — List contra settlements.
- `POST /api/v1/tenant/expenses` — Record operational business expense.
- `GET /api/v1/tenant/expenses` — List operational expenses.
- `GET /api/v1/tenant/expenses/:id` — Expense details.
- `PUT /api/v1/tenant/expenses/:id` — Update expense.
- `DELETE /api/v1/tenant/expenses/:id` — Delete expense.
- `POST /api/v1/tenant/attendance` — Log employee daily attendance (`present`, `absent`, `half_day`, `leave`).
- `GET /api/v1/tenant/attendance` — Query attendance records by date range and employee.
- `GET /api/v1/tenant/attendance/:id` — Attendance entry detail.
- `PUT /api/v1/tenant/attendance/:id` — Update attendance record.
- `POST /api/v1/tenant/overtime` — Record employee overtime hours.
- `GET /api/v1/tenant/overtime` — List overtime entries.
- `POST /api/v1/tenant/advances` — Issue salary advance to employee.
- `GET /api/v1/tenant/advances` — List salary advances.
- `POST /api/v1/tenant/cash/add` — Deposit physical cash into drawer.
- `GET /api/v1/tenant/cash/balance` — Inquire current cash drawer balance.

#### D. Reports & Analytics (Roles: `admin`, `office`, `user`)
- `GET /api/v1/tenant/dashboard` & `GET /api/v1/tenant/metrics` — Comprehensive financial KPIs.
- `GET /api/v1/tenant/dashboard/today` — Daily cash-flow summary.
- `GET /api/v1/tenant/reports/daily` — Daily report data payload.
- `GET /api/v1/tenant/reports/daily/pdf` — Daily report PDF download.
- `GET /api/v1/tenant/daily-stats` — Daily statistics aggregation.
- `GET /api/v1/tenant/reports/sales` (and `/pdf`, `/excel`) — Sales report.
- `GET /api/v1/tenant/reports/items` (and `/pdf`, `/excel`) — Item sales velocity report.
- `GET /api/v1/tenant/reports/customers` (and `/pdf`, `/excel`) — Customer statement report.

#### E. Operational Lookups & Collections (Roles: `admin`, `office`, `sales`, `line`)
- `GET /api/v1/tenant/customers` — List customers with outstanding balances.
- `GET /api/v1/tenant/customers/:id` — Customer details.
- `GET /api/v1/tenant/customers/:id/balance` — Current receivable balance.
- `GET /api/v1/tenant/customers/:id/statement` — Customer ledger statement.
- `GET /api/v1/tenant/banks` — List active bank accounts.
- `GET /api/v1/tenant/banks/:id` — Bank account details.
- `POST /api/v1/tenant/customer-collections` — Collect payment against outstanding customer invoices.
- `GET /api/v1/tenant/customer-collections` — List customer collections.
- `POST /api/v1/tenant/customer-advances` — Collect unallocated customer advance.
- `GET /api/v1/tenant/customer-advances` — List customer advances.
- `GET /api/v1/tenant/customer-advances/:id/pdf` — Customer advance receipt PDF.
- `POST /api/v1/tenant/customer-advances/apply-to-dues` — Allocate advance toward unpaid invoices.
- `GET /api/v1/tenant/parties` — Unified listing of business entities (dual-role customers/suppliers).
- `GET /api/v1/tenant/parties/:id` — Unified party details.
- `GET /api/v1/tenant/parties/:id/financial-summary` — Net receivable vs payable balance.
- `GET /api/v1/tenant/parties/:id/contra-preview` — Dry-run preview of mutual offset.
- `GET /api/v1/tenant/parties/:id/ledger` — Combined debit/credit statement.

#### F. Payroll & Staff Compensation (Roles: `admin`, `office`)
- `GET /api/v1/tenant/employees` — List employees.
- `GET /api/v1/tenant/employees/:id` — Employee details.
- `GET /api/v1/tenant/salaries` — Calculated salary summary for current period.
- `GET /api/v1/tenant/salaries/pending` — Unpaid salary obligations.
- `GET /api/v1/tenant/salaries/:employee_id` — Employee salary breakdown.
- `GET /api/v1/tenant/salaries/:employee_id/statement` — Historical payroll statement.
- `PUT /api/v1/tenant/salaries/:employee_id` — Adjust salary balance.
- `POST /api/v1/tenant/salaries/:employee_id/pay` — Disburse salary payment.
- `GET /api/v1/tenant/salaries/:employee_id/payments` — Salary disbursement records.

#### G. Tenant Administrator Only Mutations (Role: `admin`)
- `GET /api/v1/tenant/financial-summary` — Full profit/loss and balance sheet summary.
- `GET /api/v1/tenant/products/analytics` — Margin and inventory velocity analytics.
- `POST /api/v1/tenant/cash/adjust` — Reconcile physical cash drawer with audit reason.
- `GET /api/v1/tenant/cash/transactions` — Audit trail of all cash adjustments.
- `PUT /api/v1/tenant/settings` — Update organization information, tax numbers, and invoice footers.
- `POST /api/v1/tenant/logo` — Multipart image upload (`logo` field, max 2MB, JPEG/PNG/SVG).
- `DELETE /api/v1/tenant/logo` — Remove organization logo.
- `POST /api/v1/tenant/subscription/checkout` — Initiate Razorpay checkout order for plan subscription.
- `POST /api/v1/tenant/subscription/verify` — Verify Razorpay payment signature and activate plan.
- `POST /api/v1/tenant/subscription/cancel` — Cancel recurring subscription.
- `GET /api/v1/tenant/transactions` — Tenant subscription payment invoice history.
- User Management: `POST/GET/PUT/DELETE /api/v1/tenant/users[/:id]` — Manage staff logins and assign roles.
- Employee Directory: `POST/PUT/DELETE /api/v1/tenant/employees[/:id]` — Create, edit, and terminate staff.
- Customer Mutations: `POST/PUT/DELETE /api/v1/tenant/customers[/:id]`, `POST /api/v1/tenant/customers/:id/adjust-balance`.
- Party Mutations: `POST/PUT/DELETE /api/v1/tenant/parties[/:id]`, assign/remove customer or supplier roles.
- Bank Mutations: `POST/PUT/DELETE /api/v1/tenant/banks[/:id]`, `POST /api/v1/tenant/banks/:id/adjust-balance`.
- Product Catalog Mutations: `POST/PUT/PATCH/DELETE /api/v1/tenant/products[/:id]`.

---

## 3. Authentication & Security Architecture

### 3.1 Token Specifications
- **Access Token**: HMAC-SHA256 JWT, default expiry **15 minutes**. Embedded claims: `user_id`, `tenant_id` (null for platform admins), `email`, `role`, `user_type`, `token_type: "access"`, and unique `jti`.
- **Refresh Token**: HMAC-SHA256 JWT, default expiry **7 days** (168 hours). Embedded claims: `token_type: "refresh"`, unique `jti`.
- **Token Delivery**: Returned as JSON payload in `TokenResponse` (`access_token`, `refresh_token`, `expires_in`, `user`).
- **Authorization Header**: Client must provide `Authorization: Bearer <access_token>` on protected routes.
- **Refresh Token Rotation**: Calling `POST /api/v1/auth/refresh` invalidates the submitted refresh token in Redis and issues a fresh token pair. Accepts refresh token either in JSON body `{"refresh_token": "..."}` or cookies `refresh_token` / `vyavsa_refresh_token`.

### 3.2 Role-Based Access Control (RBAC) Matrix

| Role | Domain Scope | Permissions |
|---|---|---|
| `platform_admin` | Global Platform | Full management of all tenants, subscriptions, plans, platform revenue metrics |
| `admin` (Tenant Admin) | Single Tenant | Full administrative access to tenant settings, users, payroll, cash adjustments, subscriptions |
| `office` | Single Tenant | Counter sales, purchases, suppliers, expense recording, attendance, reports, customer collections |
| `sales` / `line` | Single Tenant | Line sales creation and lookup, customer balances, payments collection, line dashboard |
| `user` | Single Tenant | Base read/write operational role across sales, purchases, and reporting |

### 3.3 Tenant Context & Isolation
1. **Extraction**: The `Authenticate` middleware decrypts the JWT and extracts `claims.TenantID`.
2. **Context Enrichment**: Injected into `c.Request.Context()` via `auth.SetClaims` and logger context.
3. **Database Guardrails**: Every SQL query executed in `internal/repository/postgres` explicitly requires `WHERE tenant_id = $1`. Cross-tenant data leakage is cryptographically prevented even if IDs are guessed.
4. **Active Subscription Enforcement**: The `RequireActivePlan` middleware checks whether the tenant has an active, non-expired subscription plan before allowing access to operational routes.

---

## 4. API Request & Response Contracts

### 4.1 Standard Success Envelope
```json
{
  "success": true,
  "data": {
    "id": "7f8b9c2a-1b4e-4e6f-8d9e-1a2b3c4d5e6f",
    "name": "Acme Retailers"
  },
  "message": "resource created successfully"
}
```

### 4.2 Standard Paginated Envelope
```json
{
  "success": true,
  "data": [
    { "id": "uuid-1", "name": "Item A" },
    { "id": "uuid-2", "name": "Item B" }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_items": 45,
    "total_pages": 3
  },
  "message": "operation successful"
}
```

### 4.3 Standard Error Envelope
```json
{
  "success": false,
  "message": "invalid request payload",
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "invalid request payload",
    "details": {
      "email": "email must be a valid email address",
      "password": "password must be at least 6 characters"
    },
    "fields": {
      "email": "email must be a valid email address",
      "password": "password must be at least 6 characters"
    }
  }
}
```

### 4.4 Authentication Response (`TokenResponse`)
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "18c21a41-b0e2-4f76-90f7-ebf4244d2149",
      "name": "John Doe",
      "email": "john@vyavsa.com",
      "role": "admin",
      "user_type": "tenant_user",
      "tenant_id": "87e35b01-f92e-4361-bd38-16e788bc5912"
    }
  },
  "message": "tenant user authenticated successfully"
}
```

---

## 5. Existing Frontend Pages Audit (Backend Templates)

The backend previously served embedded HTML templates with vanilla JavaScript from `vyavsa/web/templates/` and `vyavsa/web/static/`:

1. **`landing.html`**: Marketing homepage with hero section, product feature showcases, pricing tier grid, and support contacts.
2. **`login.html`**: Tenant user login (Email + Password).
3. **`register.html`**: Self-service business onboarding with business name, owner credentials, and optional plan selection.
4. **`forgot_password.html`**: Initial password recovery email trigger.
5. **`verify_otp.html`**: 6-digit OTP code input screen with countdown resend timer.
6. **`reset_password.html`**: New password entry authenticated by temporary `reset_token`.
7. **`platform_login.html`**: Dedicated login for super-administrators (Identifier + Password).
8. **`platform_dashboard.html`**: Single-page platform administration portal for tenant onboarding, subscription management, plan configuration, and platform metrics.
9. **`dashboard.html`**: Monolithic single-page application (~425KB) containing 25+ view tabs (Sales, Counter Sales, Purchases, Expenses, Attendance, Salaries, Cash & Bank, Parties, Reports, Settings, Subscription).
10. **`daily_report.html`**: Dedicated printable / exportable daily financial settlement report.

---

## 6. Functional Gap Analysis & Migration Strategy

| Feature / Screen | Backend HTML/JS Implementation | Proposed Next.js Architecture |
|---|---|---|
| **Marketing Landing** | Static HTML with DOM-manipulated pricing | Next.js Server Component `app/(marketing)/page.tsx` with dynamic pricing query |
| **Authentication Flow** | Form submissions storing tokens in `localStorage` | Modular Next.js App Router `app/(auth)/...` with secure auth service, Zod validations, and unified error handling |
| **Platform Management** | Monolithic HTML with tab switching via vanilla JS | Next.js Route Group `app/(platform)/platform/...` with dedicated sub-routes (`/tenants`, `/plans`, `/subscriptions`) |
| **Tenant Dashboard** | 425KB monolithic template with 13,000+ lines of vanilla JS (`operations.js`) | Feature-oriented modular architecture `src/features/...` with TanStack Query caching, reusable Bootstrap components, and typed contracts |
| **Invoicing & PDF** | Popups and iframe blob rendering | Server actions & typed API client with streaming file downloads and preview dialogs |
| **State Management** | Global `window.Auth` and DOM innerHTML updates | React state, TanStack Query for server state, React Hook Form for interactive forms |

---

## 7. Backend Integration Limitations & Safeguards

1. **JSON Token Delivery**: The backend delivers tokens directly in the JSON response rather than setting `HttpOnly` cookies. The frontend must implement memory-first token caching with secure fallback storage to mitigate XSS exposure.
2. **CORS Restrictions**: During local development, the backend must configure `CORS_ALLOWED_ORIGINS=http://localhost:3000` to allow credentials and Authorization headers.
3. **Strict Rate Limiting**: The backend enforces aggressive Redis rate limits (5 req/min on password resets, 20 req/min on auth, 100 req/min general). The frontend must avoid unneeded polling or redundant background refetches.
4. **Single-Flight Token Refresh**: Simultaneous 401 responses must be queued behind a single token refresh request to prevent race conditions during refresh token rotation.
