# Agent Rule 04: Security, Authentication & Tenant Boundaries

## 1. Secrets & Environment Configuration
1. **Never Expose Private Keys**:
   - Variables prefixed with `NEXT_PUBLIC_` are bundled directly into client JavaScript bundles.
   - Never prefix database passwords, secret HMAC keys, or payment private keys with `NEXT_PUBLIC_`.
   - All environment variables must be validated via `@/config/env` using Zod.

## 2. Token Security & Lifecycle
1. **Access Token Management**:
   - Access tokens have a 15-minute validity window.
   - Keep the primary token reference in application memory (`AuthContext`).
   - Store in `sessionStorage` or secure client cookie only for page reload preservation.
2. **Refresh Token Management**:
   - Refresh tokens are long-lived (7 days).
   - Never store plain refresh tokens in unmonitored persistent storage.
3. **Session Termination**:
   - When a user logs out, dispatch `POST /api/v1/auth/logout` so the backend blacklists the active `jti` in Redis.
   - Immediately purge all memory caches, query caches, and browser storage keys.

## 3. Authorization & Tenant Isolation
1. **Client Role Checks are Not Security**:
   - UI conditional rendering (e.g. `user.role === 'admin'`) is strictly for user experience.
   - Never assume frontend role gates prevent unauthorized API access. The Golang backend middleware (`RequireRole`, `RequireTenantUser`, `RequirePlatformAdmin`) is the single source of truth.
2. **Strict Tenant Context**:
   - Never attempt to pass or spoof `tenant_id` in requests. The backend extracts `tenant_id` directly from the verified JWT claims.
   - Ensure multi-tenant isolation by never caching tenant-specific state across user sessions.

## 4. Input Sanitization & XSS Defense
1. **No Raw HTML**:
   - `dangerouslySetInnerHTML` is prohibited across the codebase.
2. **Zod Validation**:
   - All forms must validate input against strict Zod schemas before submission to protect against injection and payload corruption.
