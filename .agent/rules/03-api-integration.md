# Agent Rule 03: API Integration & Data Communication

## 1. Core Principles
- The backend API (`vyavsa`) is the authoritative source of truth.
- All network communication must pass through the centralized Axios client located at `@/lib/api/client`.
- No component or feature may invoke raw `fetch` or instantiate a new `axios.create()` instance.

## 2. API Client Architecture
The centralized Axios client enforces:
1. **Base Configuration**:
   - `baseURL`: Loaded strictly from `NEXT_PUBLIC_API_URL` via `@/config/env`.
   - `timeout`: 20,000ms.
   - `withCredentials`: omitted/false (authentication is Bearer token-based in headers, avoiding W3C CORS wildcard origin conflicts).
2. **Request Interceptor**:
   - Injects `Authorization: Bearer <token>` when an access token exists in memory/session.
   - Attaches `Content-Type: application/json` unless payload is `FormData`.
3. **Response Interceptor (Single-Flight Token Refresh)**:
   - On HTTP 401 Unauthorized:
     - Queues concurrent failing requests.
     - Triggers a single refresh request to `/auth/refresh`.
     - Upon receiving new tokens, replays all queued requests with the updated access token.
     - If the refresh request itself fails with 401/403, immediately cleanses local auth state, invokes `AuthContext.logout()`, and redirects to `/login`.

## 3. TanStack Query Standards
1. **Query Keys**:
   - Always use hierarchical array query keys:
     - `['sales', 'line']`
     - `['sales', 'line', id]`
     - `['customers', { page, search }]`
     - `['parties', id, 'financial-summary']`
2. **Stale Time & Refetching**:
   - Operational data: `staleTime: 30 * 1000` (30 seconds).
   - Reference data (e.g. plans, banks): `staleTime: 5 * 60 * 1000` (5 minutes).
   - Set `refetchOnWindowFocus: false` to respect backend Redis rate limits.
3. **Mutations**:
   - Every mutation must invalidate related queries on `onSuccess` using `queryClient.invalidateQueries`.
   - Always provide user feedback via toasts or alerts upon mutation success or failure.

## 4. DTO & Response Conventions
Every endpoint returns:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  pagination?: ApiPagination;
}
```
All service methods must unwrap `response.data` and return typed data structures.
