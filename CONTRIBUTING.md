# Contributing to Vyavsa Frontend

Thank you for contributing to Vyavsa. To maintain production stability, security, and consistent code architecture, please follow these guidelines.

---

## 1. Ground Rules
1. **Never Invent API Endpoints**: Check `docs/architecture/BACKEND_INTEGRATION.md` or inspect `../vyavsa/internal/server/server.go`.
2. **Server Components by Default**: Place `"use client"` only on leaf components requiring state or browser events.
3. **Strict TypeScript**: Avoid `any` without documented necessity.
4. **Bootstrap 5 Exclusivity**: Do not install or introduce Tailwind CSS or alternative UI frameworks.
5. **No Secret Commits**: Never commit credentials, tokens, or `.env` files.

---

## 2. Contribution Workflow
1. Create a feature branch: `git checkout -b feat/<feature-name>`.
2. Implement your changes following the [Feature Development Workflow](.agent/workflows/01-feature-development.md).
3. Verify all pre-release quality checks:
   ```bash
   npm run format:check
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
4. Commit with Conventional Commits: `git commit -m "feat(sales): add itemized invoice table"`.
5. Open a Pull Request following `.agent/workflows/06-create-pr.md`.
