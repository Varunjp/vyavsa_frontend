# Vyavsa Frontend Testing Guide

This guide establishes testing standards, conventions, and procedures for Vyavsa Frontend.

---

## 1. Test Architecture

### 1.1 Unit Tests (`tests/unit/`)
- Pure computational functions, currency formatters, date formatters, and Zod schemas.
- Runner: **Vitest**.
- Execution: `npm run test`.

### 1.2 Component & Integration Tests (`tests/integration/`)
- Reusable UI primitives (`Button`, `Input`, `Modal`, `DataTable`).
- Framework: **React Testing Library** + **@testing-library/jest-dom**.
- Environment: **jsdom**.

### 1.3 End-to-End Tests (`tests/e2e/`)
- Multi-browser real user flows (Authentication, Invoicing, Cash adjustments).
- Framework: **Playwright**.
- Execution: `npm run test:e2e`.

---

## 2. Best Practices
1. **Test User Behavior, Not Implementation Details**: Query by accessible roles (`getByRole('button', { name: 'Submit' })`), not internal class names or DOM structures.
2. **Deterministic Data**: Always use fixed mock fixtures for monetary values and timestamps.
3. **No Network Leaks**: Mock all API responses at the Axios/client boundary during component tests.
