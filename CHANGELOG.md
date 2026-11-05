# Changelog

All notable changes to the Vyavsa Frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-04

### Added
- **Production Architecture Foundation**: Established feature-oriented Next.js 15+ App Router codebase with strict TypeScript.
- **Golang Backend Audit**: Comprehensive API endpoint inventory and architectural audit (`BACKEND_INTEGRATION.md`, `FRONTEND_ARCHITECTURE.md`).
- **AI Agent Guidelines & Scoped Rules**: Comprehensive `AGENTS.md` and 8 scoped rule files under `.agent/rules/`.
- **Repeatable Agent Workflows**: 6 standardized developer and agent workflows under `.agent/workflows/`.
- **Resilient API Layer**: Central Axios client with single-flight refresh token rotation and error parsing.
- **Design System & Reusable Components**: Bootstrap 5 + 2026 SaaS design tokens with Button, Input, Select, Modal, Card, DataTable, PageHeader, LoadingSpinner, EmptyState, ErrorState, and ConfirmDialog.
- **Core Views Preservation**:
  - Marketing Landing Page (`/`)
  - Tenant Authentication Flow (`/login`, `/register`, `/forgot-password`, `/verify-otp`, `/reset-password`)
  - Platform Admin Portal (`/platform/login`, `/platform/dashboard`)
  - Tenant Business Operations Dashboard (`/dashboard`)
  - Daily Settlement Report View (`/reports/daily`)
- **Testing & Tooling**: Vitest unit/component tests, Playwright E2E configuration, ESLint 9, Prettier, and GitHub Actions CI workflow.
