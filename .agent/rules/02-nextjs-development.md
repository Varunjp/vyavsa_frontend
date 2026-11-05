# Agent Rule 02: Next.js App Router Engineering Rules

## 1. Rendering Boundaries

1. **Server Components as Default**:
   - Every file under `app/**/page.tsx` and `app/**/layout.tsx` must be a React Server Component (RSC) unless interactivity is fundamentally required across the entire tree.
   - Fetch non-sensitive, publicly cacheable data or render static semantic markup in Server Components.
2. **Client Components (`"use client"`)**:
   - Apply `"use client"` exclusively at leaf interactive components (e.g. `LoginForm.tsx`, `LineSaleTable.tsx`, `PaymentModal.tsx`).
   - Push client boundaries as far down the component tree as possible.
3. **Never Convert an Entire Route to Client-Side**:
   - Do NOT place `"use client"` at the top of root layouts or major page wrappers just to read a context. Use component composition: pass Server Components as `children` into Client Provider boundaries.

## 2. Route Groups & Organization

- `(marketing)`: Public-facing marketing pages (Landing, About, Pricing). Fully static or ISR.
- `(auth)`: Public authentication screens (Login, Register, Forgot Password, Reset Password, OTP Verification).
- `(platform)`: Gated super-admin screens (`/platform/dashboard`, `/platform/tenants`, `/platform/plans`).
- `(tenant)`: Multi-tenant business management portal (`/dashboard`, `/reports`, `/settings`).

## 3. Metadata & SEO

- Every public route must export a typed `Metadata` object defining:
  - `title`: With template formatting (e.g. `%s | Vyavsa Bill Book`).
  - `description`: Descriptive summary of the view.
  - `robots`: Disallow indexing for `(platform)` and `(tenant)` protected portals.

## 4. Special Files & Boundaries

- **`loading.tsx`**: Must provide accessible skeleton loaders for route segments.
- **`error.tsx`**: Must be a Client Component (`"use client"`) accepting `{ error, reset }` to gracefully catch and report uncaught rendering errors with a recovery button.
- **`not-found.tsx`**: Renders custom 404 message adhering to the Vyavsa design system.
