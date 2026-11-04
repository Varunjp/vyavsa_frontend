# Agent Rule 08: Git Workflow & Contribution Standards

## 1. Branching Strategy
- `main`: Production-ready code. Direct pushes to `main` are prohibited in team environments.
- Feature branches: `feat/<feature-name>` (e.g. `feat/customer-statement`, `feat/cash-reconciliation`).
- Bugfix branches: `fix/<issue-name>` (e.g. `fix/refresh-token-loop`).
- Chore / Refactor: `chore/<description>` or `refactor/<module>`.

## 2. Conventional Commit Standards
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(sales)`: add itemized line sale invoice generation
- `fix(auth)`: resolve token race condition on simultaneous 401s
- `refactor(parties)`: simplify contra settlement preview computation
- `test(cash)`: add unit test suite for drawer balance calculation
- `docs(api)`: update endpoint reference for customer advances
- `chore(deps)`: update next and tanstack-query versions

## 3. Pull Request Requirements
Before submitting a PR, verify:
1. `npm run lint` passes without warnings.
2. `npm run format:check` passes.
3. `npm run typecheck` passes with zero errors.
4. `npm run test` passes all unit and integration tests.
5. `npm run build` succeeds cleanly.
6. Documentation in `docs/` is updated if architectural changes occurred.
7. No secrets, credentials, or `.env` files are tracked.
