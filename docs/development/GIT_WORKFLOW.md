# Vyavsa Git Workflow & Commit Guidelines

## 1. Branch Strategy
- **`main`**: Protected production branch.
- **`feat/<feature-name>`**: New user-facing or platform functionality.
- **`fix/<issue-name>`**: Bug fixes and regression repairs.
- **`chore/<task>`**: Dependency updates, CI adjustments, tooling configurations.

---

## 2. Commit Message Standards
Adhere strictly to [Conventional Commits](https://www.conventionalcommits.org/):
```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Examples:
- `chore: establish Next.js frontend engineering foundation`
- `feat(auth): implement single-flight refresh token rotation`
- `fix(table): resolve mobile responsive horizontal overflow`
- `test(utils): add unit test coverage for INR currency formatter`
- `docs(api): document customer collection endpoints`

---

## 3. Pull Request Requirements
1. Every PR must pass all CI gates: `lint`, `format:check`, `typecheck`, `test`, and `build`.
2. No direct commits to `main`.
3. Commits must be logically grouped and squash-merged with a descriptive title.
