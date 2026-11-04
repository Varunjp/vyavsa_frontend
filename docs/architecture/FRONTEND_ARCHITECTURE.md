# Vyavsa Frontend Architecture & Engineering Specification

## 1. Architectural Vision & Principles

Vyavsa Frontend is engineered as an enterprise-grade, multi-tenant SaaS frontend powered by **Next.js App Router**, **TypeScript**, **Bootstrap 5**, and **TanStack Query**. It provides a fast, resilient, responsive experience for small business owners managing their daily operations, billing, inventory, and payroll.

### Core Architectural Principles
1. **Server Components by Default**: Leverage React Server Components (RSC) for page skeletons, public content, metadata generation, and non-interactive layouts. Opt into Client Components (`"use client"`) only at leaf interactivity boundaries (forms, dialogs, charts, data tables).
2. **Feature-Oriented Modularity**: Code is organized around cohesive business domains (`features/auth`, `features/dashboard`, `features/transactions`, `features/parties`, `features/reports`) rather than generic technical type buckets.
3. **Strict Backend Authority**: The Golang backend is the single source of truth for business calculations, transaction lifecycles, and authorization. The frontend never reinvents financial arithmetic or bypasses API contracts.
4. **Resilient API Layer**: Centralized Axios client configured with single-flight token rotation, automated retry policies, standard error transformation, and request cancellation.
5. **No Visual Bloat**: Stick strictly to Bootstrap 5 enhanced by Vyavsa's 2026 SaaS design tokens (`Plus Jakarta Sans`, Indigo brand accents, Slate surfaces). Do not mix Tailwind or conflicting UI frameworks.

---

## 2. Next.js Technology Stack

| Layer | Selected Technology | Architecture Justification |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | High-performance hybrid rendering, nested layouts, optimized streaming, route groups. |
| **Language** | TypeScript 5 (Strict Mode) | End-to-end type safety, strict null checks, compiler-enforced contracts. |
| **Styling** | Bootstrap 5 + Scoped SCSS/CSS | Industry standard responsive grid, accessible modal/dialog primitives, clean theme token integration. |
| **Icons** | Lucide React | Lightweight, tree-shakable, accessible SVG icons. |
| **State & Data Fetching**| TanStack Query v5 | Automatic background caching, deduplication, optimistic updates, and garbage collection. |
| **HTTP Client** | Axios | Request/response interceptors, cancellation tokens, unified error parsing. |
| **Forms & Validation** | React Hook Form + Zod | High-performance uncontrolled form state, schema-driven validation matching backend DTOs. |
| **Charts & Visuals** | Recharts | Composable SVG charting for cash-flow, sales velocity, and revenue analytics. |
| **Tables** | TanStack Table v8 | Headless sorting, filtering, and pagination without heavy visual dependencies. |
| **Testing** | Vitest + RTL + Playwright | Fast unit tests (Vitest), DOM testing (Testing Library), and multi-browser E2E testing (Playwright). |
| **Tooling** | ESLint + Prettier | Automated code quality, type-aware linting, and deterministic formatting. |

---

## 3. Directory & Module Structure

The project follows a feature-oriented layout adhering to production SaaS standards:

```text
vyavsa_frontend/
├── .agent/                   # AI Agent instructions, scoped rules, and workflows
│   ├── rules/                # Scoped rule files (01-architecture to 08-git)
│   └── workflows/            # Repeatable developer and agent procedures
├── docs/                     # Architectural decision records and API references
├── public/                   # Static assets (favicons, SVG illustrations, fonts)
│   ├── images/
│   └── icons/
├── src/
│   ├── app/                  # Next.js App Router route hierarchy
│   │   ├── (marketing)/      # Public marketing landing, pricing, about
│   │   ├── (auth)/           # Authentication flows (login, register, forgot-password, reset)
│   │   ├── (platform)/       # Super-admin platform portal
│   │   ├── (tenant)/         # Multi-tenant business dashboard & operational screens
│   │   ├── api/              # Route handlers (if proxying or BFF is required)
│   │   ├── layout.tsx        # Root HTML layout with fonts and design system CSS
│   │   ├── loading.tsx       # Suspense fallback
│   │   ├── error.tsx         # Global error boundary
│   │   ├── not-found.tsx     # 404 handler
│   │   └── globals.css       # Bootstrap 5 imports and design token variables
│   │
│   ├── components/           # Shared, domain-agnostic UI primitives
│   │   ├── ui/               # Button, Input, Select, Modal, Card, Badge, Spinner
│   │   ├── forms/            # FormField, FormError, PasswordInput
│   │   ├── tables/           # DataTable, TablePagination, TableHeader
│   │   ├── feedback/         # AlertBanner, ConfirmDialog, EmptyState, ErrorState
│   │   └── shared/           # Sidebar, TopNav, PageHeader, ProtectedLayout
│   │
│   ├── features/             # Business domain modules
│   │   ├── auth/             # Login, Register, Password Reset components & hooks
│   │   ├── dashboard/        # Financial KPI cards, sales overview, quick actions
│   │   ├── transactions/     # Line sales, counter sales, purchases, expenses
│   │   ├── customers/        # Customer directory, balances, statement view
│   │   ├── parties/          # Unified business parties, contra settlement
│   │   ├── employees/        # Staff directory, attendance, overtime, salary
│   │   ├── reports/          # Daily settlement, sales, and item reports
│   │   ├── subscriptions/    # Plan catalog, checkout modal, transaction history
│   │   └── settings/         # Organization profile, company logo upload
│   │
│   ├── lib/                  # Foundational utilities and client infrastructure
│   │   ├── api/              # Axios instance, interceptors, error handler
│   │   ├── auth/             # Session storage, token lifecycle, role verification
│   │   ├── constants/        # API route paths, storage keys, role definitions
│   │   ├── errors/           # Normalized client error abstractions
│   │   ├── query/            # TanStack Query client configuration
│   │   └── utils/            # Currency formatting (INR), date formatting, classnames
│   │
│   ├── hooks/                # Global React hooks (useMediaQuery, useDebounce)
│   ├── contexts/             # Global React contexts (AuthContext, ToastContext)
│   ├── types/                # Ambient and cross-cutting TypeScript definitions
│   └── config/               # Environment variable validation and app configuration
│
├── tests/                    # Test suites
│   ├── unit/                 # Vitest pure function tests
│   ├── integration/          # React Testing Library component tests
│   └── e2e/                  # Playwright browser end-to-end scenarios
│
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript strict configuration
└── package.json
```

---

## 4. Rendering & Data-Fetching Strategy

### 4.1 Rendering Decision Matrix
- **Marketing & Public Pages (`(marketing)` routes)**: Static Generation (SSG) / Server Components with Incremental Static Regeneration (ISR) where appropriate. Fast Time to First Byte (TTFB), zero client JS overhead for text/images.
- **Authentication Pages (`(auth)` routes)**: Client Components for interactive form state, OTP inputs, validation feedback, and immediate redirect upon successful token exchange.
- **Tenant & Platform Portals (`(tenant)` and `(platform)` routes)**: Server Component layout shells that deliver the responsive navigation drawer, header, and skeleton loaders. Inner dashboards and operational tables use Client Components backed by TanStack Query for dynamic mutations, caching, and background synchronization.

### 4.2 Data Fetching & Caching Architecture
1. **Axios Central Instance**: Configured with `baseURL: process.env.NEXT_PUBLIC_API_URL` without `withCredentials` (Bearer token auth via `Authorization` header to remain compliant with standard CORS configurations).
2. **Request Interceptor**: Synchronously extracts the valid access token and injects `Authorization: Bearer <token>`.
3. **Response Interceptor**: Intercepts HTTP 401 Unauthorized responses. If an access token expired, it transparently triggers a refresh request via `POST /api/v1/auth/refresh`, updates the stored token, and retries the original request.
4. **Single-Flight Refresh Guard**: Uses an in-flight promise queue to ensure that 10 simultaneous 401s generate only **one** backend refresh call, preventing race conditions.
5. **TanStack Query Defaults**:
   - `staleTime`: 30 seconds for operational lists (sales, expenses, attendance).
   - `gcTime` (garbage collection): 5 minutes.
   - `refetchOnWindowFocus`: `false` to avoid triggering aggressive backend Redis rate limits.
   - `retry`: 1 retry for transient network errors (never retry 401, 403, or 422).

---

## 5. Security Boundaries & Token Management

### 5.1 Token Security Strategy
- The backend returns JWT access tokens and refresh tokens in the JSON response payload.
- **Access Token**: Kept in active memory (AuthContext / API client closure). Persisted to secure storage (`sessionStorage` or encrypted client cookie) only to survive page reloads.
- **Refresh Token**: Stored with strict isolation. When possible, cookie-based refresh is utilized.
- **Logout Cleansing**: On user logout or refresh failure, all memory references and client storage keys are wiped immediately, and the backend blacklist endpoint (`POST /api/v1/auth/logout`) is invoked.

### 5.2 Client Role Verification vs. Backend Enforcement
- **Client Role Checks**: Used strictly as **UI affordances** (e.g. hiding the "Adjust Cash" button from a `sales` user, or hiding the Platform menu from a tenant user).
- **Security Boundary**: The frontend treats all client-side state as untrusted. The backend PostgreSQL queries and middleware are the sole authoritative enforcement of RBAC and tenant isolation.

### 5.3 Defense-in-Depth
- **XSS Prevention**: React automatically escapes JSX expressions. HTML rendering via `dangerouslySetInnerHTML` is prohibited.
- **CSRF Safeguards**: The API client passes custom request headers (`Authorization: Bearer`, `Content-Type: application/json`), which are protected by CORS pre-flight checks (`OPTIONS`).
- **Input Sanitization**: All inputs are validated via Zod schemas before being transmitted over the wire.

---

## 6. Deployment & CI/CD Strategy

1. **Docker Multi-Stage Build**:
   - Stage 1 (`deps`): Install production dependencies using frozen lockfile.
   - Stage 2 (`builder`): Build optimized Next.js standalone output.
   - Stage 3 (`runner`): Minimal Alpine Linux container running `node server.js` with non-root user.
2. **Next.js Standalone Mode**: Configured with `output: 'standalone'` in `next.config.ts` to produce a self-contained runtime under 100MB.
3. **CI Pipeline (GitHub Actions)**:
   - Linting check (`npm run lint`).
   - Formatting check (`npm run format:check`).
   - Type check (`npm run typecheck`).
   - Vitest unit & component tests (`npm run test`).
   - Next.js production build (`npm run build`).
