# ADR-001: Next.js Frontend Architecture & Technology Foundation

- **Status**: Accepted
- **Date**: 2026-11-04
- **Author**: Senior Software Architect

---

## 1. Context & Problem Statement
The Vyavsa small-business financial and SaaS billing system backend is implemented in Golang (`vyavsa/`), exposing RESTful JSON APIs and originally serving monolithic Go HTML templates (~425KB). To deliver a commercial-grade SaaS experience with fast interactive responsiveness, modular maintainability, and enterprise testing standards, an independent modern frontend architecture is required.

---

## 2. Decision Drivers
- **Multi-Tenant SaaS Security**: Cryptographic tenant boundaries and safe token handling without exposing sensitive refresh tokens to unmonitored storage.
- **Rendering Performance**: Fast initial page loads via React Server Components (RSC) for marketing and layout skeletons, with interactive leaf Client Components.
- **Strict Design Standards**: Bootstrap 5 + Vyavsa Design Tokens (Plus Jakarta Sans, Slate, Indigo), prohibiting Tailwind CSS or competing UI libraries.
- **Developer & Agent Experience**: Feature-Oriented Architecture (FOA) paired with comprehensive AI agent instructions (`AGENTS.md`) and scoped rule files.

---

## 3. Considered Options
1. **Option 1**: Single-Page Application (SPA) using Vite + React.
2. **Option 2**: Next.js App Router (Hybrid RSC + Client Components) with Bootstrap 5.
3. **Option 3**: Next.js Pages Router with Tailwind CSS.

---

## 4. Decision Outcome
Chosen **Option 2**: Next.js 15+ App Router with TypeScript (strict mode), Bootstrap 5, Axios, and TanStack Query v5.

### Positive Consequences:
- **Server Components by Default**: Decreases client-side JavaScript bundle sizes and boosts SEO for marketing and public routes.
- **Single-Flight Refresh Guard**: Prevents race conditions during JWT rotation on concurrent 401s.
- **Feature-Oriented Structure**: Localizes business domains into self-contained modules (`features/auth`, `features/transactions`, etc.).
- **Consistent Styling**: Aligns with existing design tokens without introducing incompatible stylesheet dependencies.

### Negative / Trade-Off Consequences:
- Client state transitions between Server and Client Components require disciplined boundaries.
- Bootstrap 5 requires careful integration with Next.js SSR to avoid hydration mismatches.
