# Vyavsa Frontend

Enterprise-grade, multi-tenant SaaS frontend for **Vyavsa** — a small business billing, POS, inventory, and workforce management platform.

Built with **Next.js 15+ (App Router)**, **TypeScript**, **Bootstrap 5**, **Axios**, and **TanStack Query**.

---

## Key Features

- **Multi-Tenant SaaS Architecture**: Seamless workspace onboarding, tenant-scoped operations, and super-admin platform governance.
- **Line & Counter Sales**: Field route distribution invoicing with split payments and retail POS billing.
- **Unified Business Parties**: Mutual customer/supplier management with single-click contra balance offsetting.
- **Cash Drawer & Bank Reconciliation**: Strict physical cash reconciliation audit trails and multi-bank tracking.
- **Workforce & Payroll**: Daily attendance, overtime tracking, salary advances, and monthly payroll disbursement.
- **Secure Authentication**: Access token rotation, single-flight refresh mutex, and password recovery OTP flow.
- **AI Agent-Ready**: Complete AI engineering rules (`AGENTS.md`), scoped rules (`.agent/rules/`), and repeatable developer workflows (`.agent/workflows/`).

---

## Technology Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Bootstrap 5 + Vyavsa Design Tokens |
| **Server State** | TanStack Query v5 |
| **API Client** | Axios (Centralized singleton with interceptors) |
| **Forms & Validation** | React Hook Form + Zod |
| **Icons** | Lucide React |
| **Testing** | Vitest + React Testing Library + Playwright |
| **Linting & Formatting** | ESLint + Prettier |

---

## Getting Started

### 1. Installation
```bash
npm install --no-audit
```

### 2. Environment Configuration
```bash
cp .env.example .env.local
```
Set `NEXT_PUBLIC_API_URL` to your active backend (e.g. `http://localhost:8080/api/v1`).

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Verification & Quality Scripts

```bash
npm run typecheck       # Strict TypeScript verification
npm run lint            # ESLint static analysis
npm run format:check    # Prettier formatting verification
npm run test            # Vitest unit and integration test suite
npm run build           # Next.js standalone production build
npm run test:e2e        # Playwright end-to-end browser tests
```

---

## Architecture & Documentation

- [AI Agent Engineering Manual](AGENTS.md)
- [Backend Integration Audit](docs/architecture/BACKEND_INTEGRATION.md)
- [Frontend Architecture Specification](docs/architecture/FRONTEND_ARCHITECTURE.md)
- [Authentication & Session Flow](docs/architecture/AUTHENTICATION_FLOW.md)
- [API Client Reference](docs/api/API_REFERENCE.md)
- [Architecture Decision Record (ADR-001)](docs/decisions/ADR-001-ARCHITECTURE.md)
- [Testing Guide](docs/development/TESTING_GUIDE.md)
- [Git Workflow](docs/development/GIT_WORKFLOW.md)

---

## License

Proprietary commercial software. All rights reserved &copy; Vyavsa.
