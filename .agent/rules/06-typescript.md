# Agent Rule 06: TypeScript Engineering Standards

## 1. Compiler Configuration & Strictness
- `strict: true` is enabled in `tsconfig.json`.
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`

## 2. Typing Conventions
1. **No `any`**: The use of `any` is prohibited. If the structure is genuinely variable, use `unknown` accompanied by type guards or Zod parsing.
2. **Explicit Interfaces over Inline Types**: Export named interfaces for all DTOs, domain models, and component props:
   ```typescript
   export interface LineSaleItem {
     productId: string;
     productName: string;
     quantity: number;
     unitPrice: number;
     discountAmount: number;
     totalAmount: number;
   }
   ```
3. **Zod Type Inference**: Derive TypeScript types directly from Zod validation schemas when defining form models:
   ```typescript
   export const createCustomerSchema = z.object({
     name: z.string().min(2, 'Name must be at least 2 characters'),
     phone: z.string().optional(),
     email: z.string().email('Invalid email address').optional().or(z.literal('')),
   });

   export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
   ```
4. **Discriminated Unions**: Use discriminated unions for modeling multi-state operations (e.g. `PaymentMethod = 'cash' | 'bank' | 'advance' | 'contra'`).
