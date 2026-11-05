# Agent Workflow 03: Bug Fixing

Follow this workflow to diagnose, fix, and verify defects.

---

## Step 1: Reproduction
- Reproduce the reported defect.
- Inspect the browser console, network tab, and server terminal logs.
- Identify the exact component, hook, or API client layer where the failure originates.

## Step 2: Root Cause Analysis (RCA)
- Determine if the issue is:
  - An API contract mismatch (e.g. unexpected null or casing discrepancy in response JSON).
  - A token expiration / refresh timing issue.
  - An unhandled React state edge case (undefined state, race condition).
  - A styling / responsive breakpoint defect.

## Step 3: Minimal, Targeted Fix
- Implement the minimal code change necessary to resolve the root cause.
- Avoid modifying unrelated components or refactoring working modules.

## Step 4: Add Regression Test
- Add a targeted unit test in `tests/unit/` or component test in `tests/integration/` that fails without the fix and passes with it.

## Step 5: Verification & Validation
- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run test`
- Verify the user scenario manually in the browser.
