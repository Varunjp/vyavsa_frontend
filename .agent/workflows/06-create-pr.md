# Agent Workflow 06: Pull Request Preparation

Follow this standard when preparing a pull request.

---

## 1. Branch Naming
Ensure your feature branch follows conventions:
- `feat/<short-title>`
- `fix/<short-title>`
- `chore/<short-title>`

## 2. Commit History Cleanliness
Ensure your commit history is structured and follows Conventional Commits:
```bash
git log --oneline -n 5
```

## 3. Pull Request Template
Use the following format when writing the PR description:

```markdown
### Summary
Brief description of the changes introduced and the business purpose.

### Architectural Impact
- Next.js rendering strategy used (Server vs. Client Components).
- Features modified or added under `src/features/`.
- New dependencies introduced (if any, with justification).

### Backend API Integration
- Endpoints consumed: `METHOD /api/v1/...`
- DTOs and contracts referenced from `vyavsa/internal/dto/`.

### Security & Multi-Tenancy
- Token handling and session validation verified.
- Role checks verified against backend middleware.

### Verification Performed
- [x] `npm run lint` passed
- [x] `npm run format:check` passed
- [x] `npm run typecheck` passed
- [x] `npm run test` passed
- [x] `npm run build` passed

### Screenshots / Previews
*(Include desktop and mobile responsive screenshots when relevant)*
```
