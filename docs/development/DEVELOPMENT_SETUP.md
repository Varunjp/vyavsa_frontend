# Development Setup & Local Environment Guide

## 1. Prerequisites
- **Node.js**: `v22.x` or later
- **npm**: `v9.x` or later
- **Git**: `v2.x` or later
- **Golang Backend**: Running locally on `http://localhost:8080` (from `../vyavsa`).

---

## 2. Quickstart Installation

1. **Clone & Enter Frontend Workspace**:
   ```bash
   cd vyavsa_frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install --no-audit
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Ensure `NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1` matches your local backend address.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Available npm Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Starts Next.js development server with Turbopack / Fast Refresh |
| `npm run build` | Builds optimized standalone production output |
| `npm run start` | Runs built production server locally |
| `npm run lint` | Runs ESLint 9 validation across all source files |
| `npm run format` | Auto-formats code using Prettier |
| `npm run format:check` | Validates formatting without writing changes |
| `npm run typecheck` | Executes `tsc --noEmit` in TypeScript strict mode |
| `npm run test` | Runs Vitest unit and integration test suites |
| `npm run test:watch` | Runs Vitest in interactive watch mode |
| `npm run test:e2e` | Runs Playwright browser end-to-end tests |
