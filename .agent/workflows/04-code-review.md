# Agent Workflow 04: Code Review Checklist

Review all changes against this checklist before marking work ready for merge.

---

## 1. Architectural & Next.js Standards
- [ ] Server Components are used by default; `"use client"` is isolated to leaf interactive components.
- [ ] No layouts or entire page skeletons are marked `"use client"`.
- [ ] Directory structure strictly follows feature-oriented architecture (`src/features/...`).
- [ ] No circular dependencies between features.

## 2. API & Data Communication
- [ ] All network calls use the central Axios client (`@/lib/api/client`).
- [ ] No raw `fetch` or custom Axios instances.
- [ ] API URLs match actual backend handlers in `../vyavsa/internal/server/server.go`.
- [ ] TanStack Query keys are hierarchical and mutations invalidate matching query keys.
- [ ] Single-flight refresh token handling is not bypassed.

## 3. Security & Multi-Tenancy
- [ ] No secrets or sensitive keys exposed via `NEXT_PUBLIC_` variables.
- [ ] No tokens stored insecurely in unmonitored persistent storage.
- [ ] Client role checks are used solely for UI visibility, never trusted as security gates.
- [ ] Forms validate input with Zod before transmission.
- [ ] Zero usage of `dangerouslySetInnerHTML`.

## 4. UI & Styling
- [ ] Exclusively Bootstrap 5 and Vyavsa design tokens (Indigo, Slate).
- [ ] No Tailwind CSS or secondary UI component libraries introduced.
- [ ] All three async states implemented: Loading, Empty, Error.
- [ ] Responsive behavior verified on mobile (375px), tablet (768px), and desktop (1280px).

## 5. TypeScript & Code Quality
- [ ] Strict mode compliant with zero implicit `any`.
- [ ] No commented-out dead code or unused imports.
- [ ] Currency formatted using `@/lib/utils/currency` (INR).
