# Agent Rule 07: Testing Strategy & Standards

## 1. Testing Pyramid
Vyavsa adheres to a three-tier automated testing strategy:
1. **Unit Tests (Vitest)**: Fast execution of deterministic calculations, utility functions, currency formatting, date manipulation, and Zod schema validations.
2. **Integration / Component Tests (React Testing Library)**: Rendering of reusable UI components, form interactions, error banner displays, and TanStack Query hooks.
3. **End-to-End Tests (Playwright)**: Full browser automation covering critical tenant user flows (Authentication, creating an invoice, adjusting cash, viewing reports).

## 2. Directory Conventions
- Unit tests: `tests/unit/**/*.test.ts`
- Component/Integration tests: `tests/integration/**/*.test.tsx`
- E2E tests: `tests/e2e/**/*.spec.ts`

## 3. Mocking & Isolation
- **Mock Service Worker (MSW) or Axios Mocks**: When testing API integration components, intercept network calls at the client boundary. Never make live network requests during unit or integration testing.
- **Cleanup**: Ensure DOM and query cache cleanup between tests using `@testing-library/react`'s automated lifecycle.

## 4. Execution Commands
- Unit & Component tests: `npm run test`
- Watch mode: `npm run test:watch`
- E2E browser tests: `npm run test:e2e`
