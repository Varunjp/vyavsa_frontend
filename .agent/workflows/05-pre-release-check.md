# Agent Workflow 05: Pre-Release Quality Verification

Execute these verification gates sequentially before deploying or cutting a release.

---

## Gate 1: Code Formatting
```bash
npm run format:check
```
*Requirement: Must pass with 100% compliant formatting. If any violations exist, run `npm run format`.*

## Gate 2: Static Analysis & Linting
```bash
npm run lint
```
*Requirement: Must exit with code 0 and zero lint errors.*

## Gate 3: TypeScript Compilation
```bash
npm run typecheck
```
*Requirement: `tsc --noEmit` must report zero compilation errors across all `.ts` and `.tsx` files.*

## Gate 4: Automated Test Execution
```bash
npm run test
```
*Requirement: All Vitest unit and component integration tests must pass.*

## Gate 5: Production Build Verification
```bash
npm run build
```
*Requirement: Next.js must successfully compile the standalone production bundle with zero unhandled route errors.*

## Gate 6: Security Audit
- Verify `.env.local` is listed in `.gitignore`.
- Verify no private keys are committed in repository history.
