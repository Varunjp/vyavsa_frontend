# Agent Workflow 01: Feature Development

Follow this step-by-step workflow when implementing any new frontend feature or screen in Vyavsa.

---

## Step 1: Understand Requirements & Scope
- Read the user's specification carefully.
- Identify which business domain the feature belongs to (`transactions`, `customers`, `parties`, `reports`, etc.).
- Identify affected roles (e.g. `admin`, `office`, `sales`, `line`).

## Step 2: Inspect Backend API Contracts
- Open the Golang backend repository (`../vyavsa`).
- Inspect the corresponding route handler under `internal/handler/`.
- Inspect the request and response DTO structs in `internal/dto/`.
- Confirm HTTP method, path parameters, query parameters, and payload structure.
- Review role authorization requirements and middleware guards.

## Step 3: Define TypeScript Types & Validation Schemas
- Create or update `src/features/<feature>/types/index.ts` with exact interfaces matching backend DTOs.
- Create or update `src/features/<feature>/schemas/index.ts` with Zod validation schemas for forms.

## Step 4: Implement Service Layer
- Create `src/features/<feature>/services/<feature>Service.ts`.
- Export typed functions using the central Axios client (`@/lib/api/client`).
- Ensure all parameters and returns are strictly typed.

## Step 5: Implement TanStack Query Hooks
- Create `src/features/<feature>/hooks/use<Feature>.ts`.
- Define hierarchical query keys (`['<feature>', 'list']`, `['<feature>', id]`).
- Add mutations with cache invalidation (`queryClient.invalidateQueries`).

## Step 6: Build UI Components
- Build feature components under `src/features/<feature>/components/`.
- Use shared primitives from `src/components/ui/` (`Button`, `Input`, `Card`, `Modal`).
- Strictly adhere to Bootstrap 5 styling and Vyavsa design tokens.
- Implement all three mandatory states: **Loading**, **Empty**, **Error**.

## Step 7: Wire Route in App Router
- Add or update the page under `src/app/(tenant)/...` or `src/app/(platform)/...`.
- Keep the `page.tsx` as a Server Component and import the client feature component.

## Step 8: Add Tests
- Add unit tests for schemas or computational utilities under `tests/unit/`.
- Add component/integration tests under `tests/integration/`.

## Step 9: Verify Quality Standards
- Run `npm run lint`.
- Run `npm run typecheck`.
- Run `npm run test`.
- Run `npm run build`.
