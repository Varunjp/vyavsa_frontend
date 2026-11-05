# Vyavsa AI Agent Engineering Guidelines & Operating Manual

> **CRITICAL DIRECTIVE FOR ALL AI CODING AGENTS**:
> You are an engineer responsible for a production commercial SaaS product. You must inspect before modifying, uphold tenant security at all costs, strictly follow the Next.js App Router and Bootstrap 5 stack, and never invent API contracts.

---

## 1. Project Identity & Context

### 1.1 What Vyavsa Does
Vyavsa is a multi-tenant Software-as-a-Service (SaaS) financial management, point-of-sale, and billing platform designed specifically for small businesses (retail shops, line-distribution suppliers, counter-sales outlets, and wholesale merchants). It streamlines daily operations:
- **Sales Operations**: Line sales distribution, counter retail sales, split payment tracking, invoice snapshotting, and PDF receipt downloads.
- **Credit & Receivables**: Customer collection ledger, unallocated customer advances, dues aging, and advance-to-due settlement.
- **Procurement & Payables**: Supplier purchases, settlement disbursements, and ledger statements.
- **Unified Business Parties**: Management of dual-role entities (customers who are also suppliers) with contra settlement offsetting.
- **Cash & Bank Governance**: Physical cash drawer balances with adjustment audit trails, and multi-bank account reconciliation.
- **Workforce Management**: Daily attendance tracking, overtime, salary advances, and monthly payroll disbursements.
- **Platform SaaS Administration**: Subscription tiers, tenant onboarding, Razorpay payment verification, and platform growth metrics.

### 1.2 Multi-Tenant SaaS Architecture
- **Tenant Isolation**: Every tenant organization is strictly isolated. Data access is governed by the tenant's cryptographic identity embedded in JWT claims.
- **Backend Location**: The authoritative Golang backend resides in `../vyavsa`.
- **Frontend Location**: This independent repository (`vyavsa_frontend/`).

### 1.3 Prescribed Technology Stack
- **Framework**: Next.js 15+ (App Router with Server Components by default)
- **Language**: TypeScript 5 (Strict Mode enabled)
- **Styling**: Bootstrap 5 + Vyavsa Design Tokens (No Tailwind CSS; No additional UI frameworks)
- **UI Components**: Reusable modular custom components
- **API Client**: Axios with central request/response interceptors
- **Server State**: TanStack Query v5
- **Forms & Validation**: React Hook Form with Zod schemas
- **Icons**: Lucide React
- **Charts**: Recharts
- **Tables**: TanStack Table v8 for complex tables; semantic Bootstrap tables for standard views
- **Testing**: Vitest, React Testing Library, and Playwright
- **Linting & Formatting**: ESLint, Prettier

---

## 2. Architectural Rules

### 2.1 Server Components vs. Client Components
- **Default to Server Components**: Every page, layout, and static presentation component must be a React Server Component.
- **Restrict `"use client"` to Leaf Boundaries**: Only introduce `"use client"` when component logic requires:
  - React lifecycle hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
  - Browser events (`onClick`, `onChange`, `onSubmit`).
  - Browser APIs (`window`, `localStorage`, `sessionStorage`, `navigator`).
  - TanStack Query hooks (`useQuery`, `useMutation`).
  - React Hook Form instances.
- **Never Mark Layouts or Root Pages as Client Components**: Keep `layout.tsx` and main `page.tsx` skeletons on the server. Delegate interactivity to feature-level client components.

### 2.2 Feature-Oriented Directory Structure
All feature code lives in `src/features/<feature-name>/`:
- `components/`: Feature-specific UI components (e.g. `LineSaleForm.tsx`, `CashAdjustModal.tsx`).
- `hooks/`: TanStack Query hooks and custom feature logic (e.g. `useLineSales.ts`).
- `services/`: Axios API call definitions (e.g. `lineSaleService.ts`).
- `schemas/`: Zod validation schemas matching backend DTOs (e.g. `lineSaleSchema.ts`).
- `types/`: Feature TypeScript interfaces and DTOs.

### 2.3 Layer Separation & Component Responsibility
- **UI Components**: Responsible solely for presentation and dispatching user actions.
- **Custom Hooks**: Encapsulate TanStack Query fetching, caching, and mutation logic.
- **Services**: Pure functions invoking the Axios API client.
- **No Inline Business Logic**: Keep currency calculations, rounding, and validation outside JSX trees.

---

## 3. Backend Integration Rules

### 3.1 Inspect Before You Code
- **Never Guess API Contracts**: Inspect actual handler definitions in `../vyavsa/internal/handler/` and DTOs in `../vyavsa/internal/dto/` before writing any frontend service or schema.
- **Never Invent Endpoints**: If a required endpoint does not exist, document the blocker in `docs/architecture/BACKEND_INTEGRATION.md` and propose the change. Do not fabricate hypothetical URLs.
- **Never Alter Backend Code**: You are developing `vyavsa_frontend/`. Do not modify files in `../vyavsa/` unless explicitly instructed.

### 3.2 Standard API Envelopes
Every backend response conforms to `pkg/response/response.go`:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
    fields?: Record<string, string>;
  };
  pagination?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}
```
All API service calls must unpack or return this typed structure.

---

## 4. Security Rules

1. **Zero Secret Exposure**: Never commit `.env` files or API secrets. Never prefix sensitive credentials with `NEXT_PUBLIC_`.
2. **Untrusted Client State**: Client-side role checks (`isAdmin`, `isOffice`) are solely for UI convenience (e.g. hiding disabled buttons). They are **never** treated as security boundaries. The backend is the sole enforcement point.
3. **Tenant Isolation**: Always pass the authenticated user's JWT Bearer token in the `Authorization` header. Never attempt to manually override or forge `tenant_id` query parameters.
4. **Token Storage**:
   - Access tokens are stored in memory and synchronized to `sessionStorage` or secure cookies for session persistence across refreshes.
   - Never store sensitive refresh tokens in unencrypted permanent `localStorage` without documenting the security implications.
   - On 401 response where refresh fails, immediately clear all tokens and redirect to `/login`.
5. **Input Validation**: Validate every user-submitted payload using Zod schemas before transmitting it over the wire.
6. **No Raw HTML Injection**: Never use `dangerouslySetInnerHTML`. Rely on safe React JSX rendering.

---

## 5. UI & Styling Rules

1. **Bootstrap 5 Exclusivity**: Use Bootstrap 5 grid (`container`, `row`, `col-*`), utilities (`d-flex`, `align-items-center`, `gap-2`, `p-3`), and components (`card`, `modal`, `btn`, `table`, `badge`).
2. **Vyavsa Design Tokens**:
   - Primary: `#4f46e5` (Hover: `#4338ca`, Subtle: `#eef2ff`, Border: `#c7d2fe`).
   - Background: `#f8fafc`. Surface: `#ffffff`. Surface Hover: `#f1f5f9`. Border: `#e2e8f0`.
   - Text Main: `#0f172a`. Text Muted: `#64748b`.
   - Typography: `Plus Jakarta Sans` for UI, `JetBrains Mono` for tabular numerals and currency amounts.
3. **Three State Mandate**: Every async data screen must explicitly implement:
   - **Loading State**: Accessible skeleton or `LoadingSpinner`.
   - **Empty State**: Friendly illustration/icon, descriptive text, and a primary call-to-action button.
   - **Error State**: Non-blocking `AlertBanner` or `ErrorState` with retry button.
4. **Responsive Breakpoints**: Ensure all views degrade gracefully from desktop (1280px+) to tablet (768px) and mobile (375px).

---

## 6. Coding Standards & TypeScript Strictness

1. **TypeScript Strict Mode**: No implicit `any`. No `@ts-ignore` without written justification.
2. **Explicit Function Returns**: All exported service functions and custom hooks must declare explicit return types.
3. **No Dead Code**: Remove unused imports, variables, and console logs before committing.
4. **Environment Variables**: Always access environment variables through `@/config/env` which validates them at startup.
5. **Currency Representation**: Represent currency amounts in Indian Rupees (INR) with standard formatting: `₹ 1,23,456.00` via `@/lib/utils/currency`.

---

## 7. Testing & Quality Verification Rules

1. **Unit Testing**: Write Vitest tests for utility functions, currency formatting, date helpers, and Zod schemas.
2. **Component Testing**: Write React Testing Library tests for complex form submissions, modal confirmations, and error display.
3. **E2E Testing**: Cover critical user journeys with Playwright (tenant registration, login, creating a sale, and viewing reports).
4. **Pre-Completion Checklist**:
   - `npm run lint` passes with zero errors.
   - `npm run format:check` passes.
   - `npm run typecheck` passes with zero type errors.
   - `npm run test` passes all tests.
   - `npm run build` succeeds cleanly.

---

## 8. Agent Execution Rules

1. **Read Before Writing**: Always read existing implementations and backend contracts before writing new code.
2. **Scoped, Non-Destructive Edits**: Do not delete or rewrite working features without explicit instructions.
3. **Document Architecture Changes**: When introducing a new feature or design pattern, update the corresponding documentation under `docs/`.
4. **Stop on Blockers**: If a backend API contract is ambiguous, incomplete, or missing, document the blocker rather than making assumptions.
