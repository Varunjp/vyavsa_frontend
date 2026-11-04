# Agent Workflow 02: API Integration

Follow this workflow when integrating a new or existing Golang backend endpoint into the frontend.

---

## Step 1: Endpoint Discovery & Verification
1. Locate route registration in `../vyavsa/internal/server/server.go`.
2. Inspect the HTTP method, URL pattern, and route group middleware (`RequireRole`, `RequireActivePlan`).
3. Inspect handler function in `../vyavsa/internal/handler/`.
4. Note if rate limiting applies (`RequireAuthLimit`, `RequireSecurityLimit`, `RequireGeneralLimit`).

## Step 2: DTO Inspection & TypeScript Mapping
1. Locate the request DTO in `../vyavsa/internal/dto/`.
2. Locate the response DTO in `../vyavsa/internal/dto/`.
3. Check binding tags (e.g. `binding:"required,email"`, `binding:"required,min=6"`).
4. Create corresponding TypeScript interfaces in `src/features/<feature>/types/`.
5. Create Zod schema in `src/features/<feature>/schemas/` reflecting backend validation rules.

## Step 3: Implement Service Method
1. Open or create `src/features/<feature>/services/<feature>Service.ts`.
2. Import the central Axios client:
   ```typescript
   import { apiClient } from '@/lib/api/client';
   ```
3. Implement the service function returning typed `ApiResponse<T>`:
   ```typescript
   export async function getEntityById(id: string): Promise<EntityData> {
     const response = await apiClient.get<ApiResponse<EntityData>>(`/tenant/entities/${id}`);
     if (!response.data.data) {
       throw new Error(response.data.message || 'Entity data not found');
     }
     return response.data.data;
   }
   ```

## Step 4: Hook Creation with TanStack Query
1. Create or update hook in `src/features/<feature>/hooks/`:
   ```typescript
   export function useEntity(id: string) {
     return useQuery({
       queryKey: ['entities', id],
       queryFn: () => getEntityById(id),
       enabled: Boolean(id),
       staleTime: 30 * 1000,
     });
   }
   ```

## Step 5: Error Handling & Boundary Verification
1. Test error responses (e.g. 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests).
2. Ensure field-level validation errors are mapped back to form fields via `react-hook-form`'s `setError`.
