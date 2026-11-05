# Vyavsa API Client Reference & Endpoints Catalog

This document details client-side endpoint invocation methods, headers, and request/response types.

---

## 1. Authentication Client (`src/features/auth/services/authService.ts`)

### `authService.loginTenant(input: TenantLoginInput): Promise<TokenResponse>`
- **Endpoint**: `POST /api/v1/auth/tenant/login`
- **Rate Limit**: 20 requests / 60 seconds
- **Request Body**:
  ```json
  {
    "email": "owner@business.com",
    "password": "password123",
    "tenant_id": "optional-uuid"
  }
  ```
- **Response**: `TokenResponse` with `access_token`, `refresh_token`, and `user`.

### `authService.loginPlatform(input: PlatformLoginInput): Promise<TokenResponse>`
- **Endpoint**: `POST /api/v1/auth/platform/login`
- **Request Body**:
  ```json
  {
    "identifier": "superadmin",
    "password": "masterpassword"
  }
  ```

### `authService.registerTenant(input: TenantRegisterInput): Promise<TenantRegisterResponseData>`
- **Endpoint**: `POST /api/v1/auth/tenant/register`
- **Request Body**:
  ```json
  {
    "name": "Om Supermarket",
    "admin_name": "Ramesh Kumar",
    "email": "ramesh@omsupermarket.com",
    "password": "password123",
    "phone": "9876543210"
  }
  ```

---

## 2. Operational Endpoints Catalog

### Line Sales
- `POST /api/v1/tenant/line-sales`: Create new line sale.
- `GET /api/v1/tenant/line-sales`: List line sales with date range & customer filters.
- `GET /api/v1/tenant/line-sales/:id`: Get line sale invoice details.
- `GET /api/v1/tenant/line-sales/:id/pdf`: Download invoice PDF.

### Counter Retail Sales
- `POST /api/v1/tenant/counter-sales`: Create retail POS sale.
- `GET /api/v1/tenant/counter-sales`: List counter sales.
- `GET /api/v1/tenant/counter-sales/breakdown`: Payment breakdown across cash/bank/advances.

### Cash Drawer Management
- `GET /api/v1/tenant/cash/balance`: Query current physical drawer balance.
- `POST /api/v1/tenant/cash/add`: Deposit operational cash into drawer.
- `POST /api/v1/tenant/cash/adjust`: Admin reconciliation adjustment with audit remark.
- `GET /api/v1/tenant/cash/transactions`: Audit trail of cash adjustments.

### Reports
- `GET /api/v1/tenant/reports/daily`: End-of-day cash & billing settlement data.
- `GET /api/v1/tenant/reports/daily/pdf`: Stream daily settlement PDF.
- `GET /api/v1/tenant/reports/sales`: Sales report with PDF & Excel variants.
- `GET /api/v1/tenant/reports/items`: Product sales velocity report.
