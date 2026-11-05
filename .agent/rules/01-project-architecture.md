# Agent Rule 01: Project Architecture & Module Boundaries

## 1. Architectural Philosophy
Vyavsa follows a **Feature-Oriented Architecture (FOA)**. Features represent distinct business capabilities within the SaaS product (e.g. `transactions`, `parties`, `attendance`, `payroll`, `reports`, `subscriptions`).

## 2. Directory Hierarchy & Responsibilities

```text
src/
├── app/               # Routing layer only (Next.js App Router)
├── components/        # Shared, feature-agnostic presentation primitives
│   ├── ui/            # Buttons, Inputs, Modals, Cards, Spinners, Badges
│   ├── forms/         # Generic form controls, errors, wrappers
│   ├── tables/        # Generic DataTable primitives
│   ├── feedback/      # Alert banners, dialogs, empty states
│   └── shared/        # App-wide components: Sidebar, Header, ProtectedLayout
├── features/          # Self-contained business domain modules
│   └── <feature>/     # e.g. transactions, customers, parties, reports
│       ├── components/# Feature-specific UI components
│       ├── hooks/     # Feature-specific TanStack Query hooks & logic
│       ├── services/  # Feature-specific Axios HTTP calls
│       ├── schemas/   # Feature-specific Zod validation schemas
│       ├── types/     # Feature-specific TypeScript models and DTOs
│       └── utils/     # Feature-specific computational helpers
├── lib/               # Shared cross-cutting client infrastructure
│   ├── api/           # Central Axios client and interceptors
│   ├── auth/          # Token management and user session helpers
│   ├── constants/     # Global constants, API routes, storage keys
│   ├── errors/        # Error parsing and application error classes
│   ├── query/         # QueryClient initialization and default options
│   └── utils/         # Currency (INR), date formatting, class merging
├── hooks/             # Generic, app-wide React hooks (e.g. useMediaQuery)
├── contexts/          # Global application contexts (e.g. AuthContext)
├── types/             # Global ambient and shared TypeScript types
└── config/            # Validated environment variables and meta configuration
```

## 3. Dependency & Import Rules

1. **Unidirectional Dependency Flow**:
   - `app/` imports from `features/`, `components/`, `lib/`, `hooks/`, `contexts/`.
   - `features/` import from `components/`, `lib/`, `hooks/`, `contexts/`, and sibling types.
   - `components/` import only from `components/` and `lib/utils/`.
   - `lib/` never imports from `features/` or `app/`.
2. **Cross-Feature Imports**:
   - Features should remain autonomous. If Feature A requires data from Feature B, export an explicit typed contract or share via `lib/` or `components/shared/`.
3. **No Circular Dependencies**: Circular imports between features or modules are strictly forbidden.
4. **Path Aliasing**: Always use the `@/*` alias (mapping to `./src/*`). Relative imports (`../../`) across directory boundaries are discouraged.
