# Runtime Verification and Portfolio Baseline Audit

**Date:** 2026-10-16  
**Prerequisite Audit:** [`docs/audit/repository-archaeology.md`](file:///home/djblackett/dev/invoice-web-app/docs/audit/repository-archaeology.md)  
**Evaluated Branches:**
- `main` (`32a820c2c95fb21ab5916bb49c3d4662467c7224`)
- `OAuth-phase1` (`0b613f7ef4f903ca704300a7d0210f302c1b02c5`, identical to `dev`)
- `origin/boxing1` (`c750f8892da82b3a9f3c336bf762c726c2d317dc`, selective verification)

**Audit Integrity Statement:**  
All runtime verifications were executed using isolated Git worktrees (`/tmp/audit-wt/{main,oauth-phase1,boxing1}`), an ephemeral PostgreSQL 16.1 container (`audit-temp-postgres` with separate disposable databases `db-main`, `db-oauth`, and `db-boxing1`), and an ephemeral local RS256 OIDC/JWKS server (`http://127.0.0.1:18199/.well-known/jwks.json`). All temporary containers, worktrees, and files were removed upon completion. No application source files, configurations, branches, stashes, or persistent databases were modified. No secret values are exposed in this report.

---

## 1. Executive Summary

### Runtime Reality vs. Static Archaeology
The runtime verification confirms **100% of the high-risk static-analysis findings** from [`docs/audit/repository-archaeology.md`](file:///home/djblackett/dev/invoice-web-app/docs/audit/repository-archaeology.md) and uncovers **seven additional critical runtime-only failures** that were not obvious from static inspection alone:

1. **Cross-User Tenant Isolation is Broken at Runtime on All Three Branches (`main`, `OAuth-phase1`, `origin/boxing1`)**:
   - Against live `NODE_ENV=production` GraphQL servers backed by real RS256 OIDC JWT verification, an ordinary authenticated user (`auth0|userA`, role `USER`) can read (`getInvoiceById`), overwrite (`editInvoice`), and mark as paid (`markAsPaid`) another ordinary user's (`auth0|userB`) invoice (`BB1001`) knowing only its 6-character ID.
   - Only `allInvoices` (list query) and `removeInvoice` (delete mutation) prevent cross-user access.
   - On `origin/boxing1`, this same vulnerability (`prismaInvoiceRepository.findByUserIdAndInvoiceId` ignoring `_id` and `_role`) extends to revision history: an unprivileged user can list (`invoiceRevisions`) and roll back (`restoreInvoiceRevision`) another user's invoice.

2. **Invoice Deletion (`removeInvoice`) is Completely Broken on `main` (and `origin/boxing1`) and Fixed on `OAuth-phase1`**:
   - On `main`, a `USER` deleting their own invoice fails at runtime with `INTERNAL_SERVER_ERROR` (`"Invoice could not be removed"`), an `ADMIN` deleting another user's invoice also fails with `INTERNAL_SERVER_ERROR` (due to the inverted `invoice.createdById !== id || role !== "ADMIN"` check in [`invoice.service.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/services/invoice.service.ts#L187)), and an `ADMIN` deleting their own invoice deletes the database row while returning `{"data":{"removeInvoice":{"acknowledged":null}}}` (because `prismaInvoiceRepository.delete` returns boolean `true` instead of `{ acknowledged: true }`).
   - On `OAuth-phase1`, all four `removeInvoice` scenarios behave properly at runtime and return `{"acknowledged":true}` (or reject unauthorized cross-user deletes).

3. **Database Seeding (`npx prisma db seed`) Fails Completely on `main` and Succeeds on `OAuth-phase1` and `origin/boxing1`**:
   - On `main`, `node ./prisma/seed.js` fails immediately under Node 20 (`SyntaxError: Cannot use import statement outside a module`) and crashes under Node 24 due to three sequential bugs (`this.prisma` on undefined in `getUserByIdSafely`, missing `await` on `getUserByIdSafely`, and undefined `prismaErrorHandler`), seeding **0 users and 0 invoices**.
   - On `OAuth-phase1` (`prisma/seed.mjs`), seeding succeeds (`EXIT: 0`), inserting 1 user (`user1` / `john@melba.toast`) and 7 invoices (`RT3080`, `XM9141`, `AA1449`, `FV2353`, `TY9141`, `RT2080`, `RG0314`).
   - On `origin/boxing1` (`prisma/seed.mjs`), seeding also succeeds (`EXIT: 0`) and additionally seeds 5 revision snapshots for `RT3080`.

4. **Demo Mode Has Severe Security, Data-Exposure, and UX Defects at Runtime**:
   - **Empty Initial State (`0` Invoices)**: When a visitor enters Demo Mode (`role: 0` / Basic User), the frontend sends `Authorization: Bearer demo-token`. The backend maps this to `id: "demoId"`, auto-creates user `demoId`, and queries `Invoice` where `createdById = "demoId"`. Because `seed.mjs` assigns all 7 seeded invoices to `createdById = "user1"`, **a new Demo Mode visitor sees 0 invoices (`EmptyList`)**.
   - **Zero Visitor Isolation**: Every Demo Mode visitor shares the single `demoId` (or `demoAdminId`) database account. Invoices created, edited, or deleted by one visitor immediately mutate the state seen by all other visitors.
   - **Demo Admin Exposes All Real Users' Invoices**: Toggling the in-app avatar menu from Basic User (`0`) to Admin (`1`) switches the header to `Authorization: Bearer demo-token-admin`, which resolves to `role: "ADMIN"` and executes `findAll()` with **no `where` clause** — returning every invoice in the database, including all seeded `user1` invoices and **every invoice created by real authenticated users (`auth0|userA`, `auth0|userB`)**.
   - **Unconditional Production Backdoor on `main`**: On `main` (and `origin/boxing1`), `createContext.ts` accepts literal `Bearer demo-token` and `Bearer demo-token-admin` **unconditionally in production**, even when `DEMO_MODE=false`. Anyone can send `Authorization: Bearer demo-token-admin` to a production `main` backend and read or mutate all users' data.
   - **Frontend/Backend Token Coupling on `OAuth-phase1`**: `OAuth-phase1` moves demo tokens into `process.env.DEMO_USER_TOKEN` and `process.env.DEMO_ADMIN_TOKEN`, but the frontend ([`useApolloClient.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-frontend/src/features/shared/hooks/useApolloClient.ts#L39)) still hardcodes literal `"demo-token"` and `"demo-token-admin"`. If the backend does not set `DEMO_USER_TOKEN=demo-token` and `DEMO_ADMIN_TOKEN=demo-token-admin`, Demo Mode fails at runtime with `INTERNAL_SERVER_ERROR: "Failed to retrieve invoices"`.

5. **`OAuth-phase1`'s Custom Auth/OAuth Subsystem Cannot Register Users End-to-End at Runtime**:
   - While `OAuth-phase1`'s `TokenService` (RS256 JWT generation/verification and refresh-token rotation) works when tested against a pre-seeded database user with a valid `passwordHash`, **`POST /auth/register` fails at runtime with HTTP 500 (`{"error":"Internal server error"}`)** because:
     1. `auth.controller.ts:50` calls `await userRepo.getUserById(email)` to check if the email is already registered, and `prismaUserRepo.getUserById` calls `prisma.user.findUniqueOrThrow({ where: { id: email } })`, which throws `Error("User not found")` whenever the user does *not* exist.
     2. Even if bypassed, `prismaUserRepo.createUser` (`prismaUserRepo.ts:142–151`) drops `passwordHash` and only writes `{ name, username, role: "USER" }`, leaving `User.passwordHash = NULL` so subsequent `POST /auth/login` always fails with `401 {"error":"Invalid email or password"}`.
   - Furthermore, the backend returns `{ accessToken, expiresIn, user }` at the top level while the frontend (`NewAuthContext.tsx` / `auth.api.ts`) expects `{ user, tokens: { accessToken, ... } }`.

6. **`OAuth-phase1` Fails `npm run start`, `tsc --noEmit`, and `npm run lint` on the Backend**:
   - `OAuth-phase1` never received `main`'s commit `ae76833`, so `invoice-backend/package.json` still defines `"start": "ts-node -r tsconfig-paths/register dist/src/index.js"`, which crashes immediately on compiled JS output (`TSError: TS2339: Property '__importDefault' does not exist`). Running `node -r tsconfig-paths/register dist/src/index.js` directly works.
   - `npx tsc --noEmit` on `OAuth-phase1` backend fails with **227 errors across 18 test files**, and `npm run lint` fails with **135 ESLint errors**.

7. **`origin/boxing1` Has a Clean, Working Revision History Feature but Lacks a Prisma Migration File**:
   - `origin/boxing1` is a clean 1-commit fast-forward on top of `main` (`c750f88`) whose backend build, frontend build, 112 backend unit tests, and 4 new frontend unit tests all pass.
   - However, `origin/boxing1` added `model InvoiceRevision` to `prisma/schema.prisma` **without creating a migration in `prisma/migrations/`**. Running `npx prisma migrate deploy` only applies `20250304053431_moo` and leaves the `InvoiceRevision` table missing in PostgreSQL until `npx prisma db push` (or a proper migration) is run.

---

## 2. Environment Reconstruction

### Expected Runtime & Tooling Versions

| Component | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | `origin/boxing1` (`c750f88`) | Runtime Verified With |
|---|---|---|---|---|
| **Node.js (Dockerfiles)** | `node:20-alpine` (BE & FE) | `node:20-slim` (BE), `node:20-alpine` (FE) | `node:20-alpine` (BE & FE) | Node `v20.9.0` (via NVM) & `v24.15.0` |
| **Node.js (GitHub Actions CI)** | `23.5.0` (`pipeline.yml`), `20.x` (`playwright.yml`) | `23.5.0` (`pipeline.yml`), `20.x` (`playwright.yml`) | Same as `main` | Node `v20.9.0` |
| **Root Package Manager** | `yarn@4.6.0` | `yarn@4.6.0` | `yarn@4.6.0` | `npm` / `npx` / `yarn` |
| **Backend Package Manager** | `yarn@4.6.0` (`package-lock.json` + `yarn.lock` both present) | `yarn@4.6.0` (`package-lock.json` + `yarn.lock` both present) | `yarn@4.6.0` | `npm` / `npx` |
| **Frontend Package Manager** | `yarn@4.12.0` (`.yarnrc.yml`: `nodeLinker: node-modules`) | `yarn@4.12.0` (`.yarnrc.yml`: `nodeLinker: node-modules`) | `yarn@4.12.0` | `npm` / `npx` / `yarn` |
| **PostgreSQL** | `postgres:16.1` (`pipeline.yml`), `postgres:15` (`docker-compose.yml`), `@prisma/client@^6.2.1` | `postgres:16.1` (`pipeline.yml`), `postgres:15` (`docker-compose.yml`), `@prisma/client@^6.2.1` | Same as `main` | `postgres:16.1` (`audit-temp-postgres`) |

### Start, Build, Test, and Database Commands

| Operation | Workspace | Command (`package.json`) | Notes / Differences Across Branches |
|---|---|---|---|
| **Backend Dev Server** | `invoice-backend` | `npm run dev` (`tsx watch src/index.ts`) | Starts HTTPS on `:8000` using `../certs/localhost-{key,fullchain}.pem` unless `NODE_ENV=production` or `DEMO_MODE=true`. |
| **Backend Build** | `invoice-backend` | `npm run build` (`tsc -p tsconfig.build.json && tsc-alias`) | Compiles `src/` + `prisma/seed.mjs` to `dist/` and rewrites `@/*` path aliases. |
| **Backend Prod Start** | `invoice-backend` | `npm run start` | **`main` / `origin/boxing1`**: `node -r tsconfig-paths/register dist/src/index.js` (**WORKS**).<br>**`OAuth-phase1`**: `ts-node -r tsconfig-paths/register dist/src/index.js` (**CRASHES** with `TS2339`). |
| **Backend Prisma Migrate** | `invoice-backend` | `npx prisma migrate deploy` | Applies `prisma/migrations/*`. |
| **Backend Prisma Seed** | `invoice-backend` | `npx prisma db seed` | **`main`**: runs `node ./prisma/seed.js` (**FAILS**).<br>**`OAuth-phase1` / `origin/boxing1`**: runs `node ./prisma/seed.mjs` (**WORKS**). |
| **Backend Unit Tests** | `invoice-backend` | `npm run test:unit` (`vitest run ./tests/unit --coverage`) | Vitest 4.0.14 (`main`/`boxing1`) / Vitest 3.0.5 (`OAuth-phase1`). |
| **Backend Integration Tests** | `invoice-backend` | `npm run test:integration` (`vitest run ./tests/integration --no-file-parallelism`) | Requires a live PostgreSQL database at `DATABASE_URL` with migrations applied. |
| **Frontend Dev Server** | `invoice-frontend` | `npm start` (`vite`) | Serves on `:5173`. Uses `../certs/localhost-{key,fullchain}.pem` when present (`vite.config.mts`). |
| **Frontend Build** | `invoice-frontend` | `npm run build` (`cross-env VITE_BACKEND_URL=https://localhost:8000 vite build`) | Outputs static bundle to `invoice-frontend/dist/`. |
| **Frontend Unit Tests** | `invoice-frontend` | `npm run test:unit` (`vitest --run tests/unit`) | Note: `vitest.config.mts` sets `include: ["tests/**/*.test.{ts,tsx}"]`, excluding `src/features/**/__tests__`. |
| **Playwright E2E Tests** | `invoice-frontend` | `npx playwright test` | Runs `global-setup.ts` first, requiring live Auth0 credentials (`TEST_LOGIN`, `TEST_PASSWORD`, `TEST_BASE_URL`). |

### Docker, Docker Compose, and CI Assumptions
1. **`invoice-backend/Dockerfile` Defect (All Branches)**:
   - Stage 1 (`builder`) runs `yarn tsc -p tsconfig.build.json` **without `&& yarn tsc-alias`**, leaving `@/*` imports unrewritten in `dist/`.
   - Stage 1 runs `yarn install --frozen-lockfile` and Stage 2 runs `yarn install --frozen-lockfile --production`, which are Yarn v1 flags that **fail under Yarn 4 (`packageManager: "yarn@4.6.0"`)** if Corepack is active (`Unknown Syntax Error: Unsupported option name ("--frozen-lockfile")`).
2. **`docker-compose.yml` & `docker-compose.e2e.yml`**:
   - Expect external `./certs` directory mounted into `/certs`.
   - Pass `DATABASE_URL: postgresql://postgres:postgres@db:5432/invoices` to backend, but **do not run `prisma migrate deploy`** before starting `yarn start`, so starting against a fresh `postgres:15` volume leaves the database unmigrated unless migrated externally.
3. **GitHub Actions CI (`.github/workflows/pipeline.yml`)**:
   - Explicitly overrides `NODE_ENV: CI` (and `DEMO_MODE: true`), which triggers the hardcoded `ADMIN` auth bypass in [`createContext.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/createContext.ts#L66-L73) (`if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "CI")`).
   - Runs `npx prisma migrate deploy` before integration tests.
   - Does **not** run `tsc --noEmit` or `npm run lint` in CI, which explains why `main`'s broken frontend ESLint config and `OAuth-phase1`'s 227 backend TypeScript test errors + 135 ESLint errors merged undetected.

---

## 3. Environment Variable Matrix

No secret values are included below. Classifications reflect actual code behavior verified across [`server.config.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/config/server.config.ts), [`createContext.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/createContext.ts), [`app.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/app.ts), [`server.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/server.ts), and [`invoice-frontend/src/config/config.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-frontend/src/config/config.ts).

### Backend Environment Variables (`invoice-backend`)

| Variable | Branch Scope | Classification | Where Read | Runtime Behavior & Security Notes |
|---|---|---|---|---|
| `DATABASE_URL` | All | **Required to start** | `prisma/schema.prisma`, `server.config.ts:15` | Required by Prisma Client. **Security warning**: `main` and `origin/boxing1` log `DATABASE_URL` in plaintext at startup (`server.config.ts:28`); `OAuth-phase1` masks credentials (`postgresql://***:***@...`). |
| `PORT` | All | **Optional** | `server.config.ts:13` | Defaults to `8000`. |
| `NODE_ENV` | All | **Required only for production** | `server.config.ts`, `createContext.ts`, `app.ts` | Defaults to `"development"`. **Critical**: If `"test"` or `"CI"`, `createContext.ts` bypasses all JWT checks and injects `ADMIN` (`auth0\|12345`). If `"development"`, `"test"`, or `"CI"`, `app.ts` mounts unauthenticated `GET /test-setup` which deletes all invoices (`prisma.invoice.deleteMany()`). If `"production"`, `server.ts` serves HTTP instead of requiring local TLS certs. |
| `DEMO_MODE` | All | **Required only for Demo Mode** | `server.config.ts:11,16`, `server.ts:27` | When `"true"`, overwrites `process.env.DATABASE_URL = process.env.DEMO_DATABASE_URL` (`server.config.ts:17`) and starts an HTTP server instead of HTTPS (`server.ts:27,35`). Note: `createContext.ts` does **not** check `DEMO_MODE` before accepting demo tokens! |
| `DEMO_DATABASE_URL` | All | **Required only for Demo Mode** | `server.config.ts:14,17` | Must be set whenever `DEMO_MODE="true"`, otherwise `DATABASE_URL` is overwritten with `""` and Prisma fails to connect. |
| `DEMO_USER_TOKEN` | `OAuth-phase1` | **Required only for Demo Mode** (`OAuth-phase1`) / **Ignored** (`main`) | `createContext.ts:200` (`OAuth-phase1`) | On `main`/`origin/boxing1`, ignored (`"demo-token"` is hardcoded). On `OAuth-phase1`, **must be set to literal `"demo-token"`** because the frontend hardcodes `Bearer demo-token`. |
| `DEMO_ADMIN_TOKEN` | `OAuth-phase1` | **Required only for Demo Mode** (`OAuth-phase1`) / **Ignored** (`main`) | `createContext.ts:210` (`OAuth-phase1`) | On `main`/`origin/boxing1`, ignored (`"demo-token-admin"` is hardcoded). On `OAuth-phase1`, **must be set to literal `"demo-token-admin"`** because the frontend hardcodes `Bearer demo-token-admin`. |
| `DOMAIN` | All | **Required only for Auth0** | `createContext.ts:18` | Auth0 tenant URL (must include trailing `/`). Used to build `jwksUri: ${DOMAIN}.well-known/jwks.json` and verify `issuer: DOMAIN`. |
| `AUDIENCE` | All | **Required only for Auth0** | `createContext.ts:29` | Auth0 API identifier verified against JWT `aud` claim. |
| `CORS_ORIGIN` | All | **Required only for production** | `app.ts:44` (`main`), `app.ts:48` (`OAuth-phase1`) | Comma-separated origins. Defaults to `"https://djblackett.github.io"` in production or `"https://localhost:5173,http://localhost:5173,http://localhost:3000"` in dev. |
| `CERT_DIR` | All | **Optional** | `server.config.ts:12` | Defaults to `"../certs"`. Only used when `NODE_ENV !== "production"` and `DEMO_MODE !== "true"`. |
| `APOLLO_GRAPH_REF` | All | **Optional** | `app.ts:116` (`main`), `app.ts:149` (`OAuth-phase1`) | Used only for Apollo production landing page (`graphRef`), defaults to `"my-graph-id@my-graph-variant"`. |
| `AUTH_SYSTEM` | `OAuth-phase1` | **Required only for custom OAuth** | `createContext.ts:53,221` | Accepts `"auth0"` (default), `"new"`, or `"dual"`. **Defect**: `.env.example` documents `"hybrid"`, which is unrecognized and silently falls back to `"auth0"`. |
| `JWT_PRIVATE_KEY` | `OAuth-phase1` | **Required only for custom OAuth** | `token.service.ts:28` | Base64-encoded RSA private key (PEM). `TokenService` throws on startup/import if unset when auth routes load. |
| `JWT_PUBLIC_KEY` | `OAuth-phase1` | **Required only for custom OAuth** | `token.service.ts:29` | Base64-encoded RSA public key (PEM). `TokenService` throws on startup/import if unset. |
| `JWT_ISSUER` | `OAuth-phase1` | **Optional** | `token.service.ts:47` | Defaults to `"http://localhost:8000"`. |
| `JWT_ACCESS_TOKEN_EXPIRY` | `OAuth-phase1` | **Optional** | `token.service.ts:46` | Defaults to `"15m"`. |
| `JWT_PRIVATE_KEY_PATH` | `OAuth-phase1` | **Apparently obsolete** | `.env.example` only | Listed in `.env.example`, never read in `src/` (`TokenService` reads base64 `JWT_PRIVATE_KEY` instead). |
| `JWT_PUBLIC_KEY_PATH` | `OAuth-phase1` | **Apparently obsolete** | `.env.example` only | Listed in `.env.example`, never read in `src/`. |
| `JWT_REFRESH_TOKEN_EXPIRY` | `OAuth-phase1` | **Apparently obsolete** | `.env.example` only | Listed in `.env.example`, never read in `src/` (`TokenService` hardcodes 30 days in `generateRefreshToken`). |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | `OAuth-phase1` | **Required only for custom OAuth** | `oauth.config.ts:16–32` | Required only to enable Google OAuth strategy. If missing, server logs warning and skips strategy registration (causing `GET /oauth/google` to return HTTP 500). |
| `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_CALLBACK_URL` | `OAuth-phase1` | **Required only for custom OAuth** | `oauth.config.ts:34–51` | Required only to enable Microsoft OAuth strategy. If missing, skips registration (`GET /oauth/microsoft` returns HTTP 500). |
| `APPLE_SERVICE_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` | `OAuth-phase1` | **Apparently obsolete / Unwired** | `oauth.config.ts:53–71` | Validated in `oauth.config.ts`, but no Passport Apple strategy or `/oauth/apple` route exists in `src/`. |
| `FRONTEND_URL` | `OAuth-phase1` | **Required only for custom OAuth** | `oauth.controller.ts:15` | Redirect target for OAuth callbacks and email links; defaults to `"http://localhost:5173"`. |
| `SENDGRID_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` | `OAuth-phase1` | **Optional** | `email.service.ts:29–37` | If `SENDGRID_API_KEY` is omitted, `EmailService` logs a warning and prints verification/reset links to console. |

### Frontend Environment Variables (`invoice-frontend`)

| Variable | Branch Scope | Classification | Where Read | Runtime Behavior & Security Notes |
|---|---|---|---|---|
| `VITE_BACKEND_URL` | All | **Required to start** | `src/config/config.ts:11,17` | Enforced by `checkEnvs()` on module load — throws `Error("VITE_BACKEND_URL is required")` if missing. |
| `VITE_DOMAIN` | All | **Required to start** | `src/config/config.ts:11,21` | Enforced by `checkEnvs()` on module load even if using Demo Mode or Custom Auth! |
| `VITE_CLIENT_ID` | All | **Required to start** | `src/config/config.ts:12,25` | Enforced by `checkEnvs()` on module load even if using Demo Mode or Custom Auth! |
| `VITE_AUDIENCE` | All | **Required to start** | `src/config/config.ts:12,29` | Enforced by `checkEnvs()` on module load even if using Demo Mode or Custom Auth! |
| `VITE_REDIRECT_URI` | All | **Required to start** | `src/config/config.ts:12,33` | Enforced by `checkEnvs()` on module load even if using Demo Mode or Custom Auth! |
| `VITE_SCOPE` | All | **Required only for Auth0** | `src/index.tsx:31`, `useApolloClient.ts:38` | Passed to `Auth0Provider` and `getAccessTokenSilently`. |
| `VITE_DEMO_MODE` | All | **Apparently obsolete** | `.env.production` only | Never read by `src/` (`DemoModeProvider.tsx` reads `localStorage.getItem("isDemoMode")` and defaults to `false`). |
| `VITE_AUTH_PROVIDER` | `OAuth-phase1` | **Optional** | `useUnifiedAuth.ts:41` | Defaults to `"auth0"`. Set to `"new"` to switch `useUnifiedAuth()` to `NewAuthContext`. Note: `src/index.tsx` still mounts `<Auth0Provider>` unconditionally unless `NewAuthProvider` is also mounted. |
| `TEST_LOGIN`, `TEST_PASSWORD`, `TEST_BASE_URL` | All | **Optional (E2E only)** | `qa/global-setup.ts:17–24` | Required only to run Playwright E2E `global-setup.ts` against Auth0 Universal Login. |

---

## 4. Build, Lint, Typecheck, Migration, and Seed Results

All commands below were executed in isolated worktrees (`/tmp/audit-wt/{main,oauth-phase1,boxing1}`) using Node `v20.9.0` and disposable PostgreSQL 16.1 databases (`db-main`, `db-oauth`, `db-boxing1`).

### Summary Matrix

| Step | Command | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | `origin/boxing1` (`c750f88`) |
|---|---|---|---|---|
| **Install / Prisma Client** | `npx prisma generate` | **PASS** (`EXIT: 0`) | **PASS** (`EXIT: 0`) | **PASS** (`EXIT: 0`) |
| **Backend Typecheck (Full)** | `npx tsc --noEmit` | **PASS** (`EXIT: 0`, 0 errors) | **FAIL** (`EXIT: 2`, 227 errors in 18 test files) | **PASS** (`EXIT: 0`, 0 errors) |
| **Backend Lint** | `npm run lint` | **PASS** (`EXIT: 0`, 0 errors, 10 warnings) | **FAIL** (`EXIT: 1`, 135 errors, 0 warnings) | **PASS** (`EXIT: 0`, 0 errors, 10 warnings) |
| **Backend Build (`dist/`)** | `npm run build` | **PASS** (`EXIT: 0`) | **PASS** (`EXIT: 0`) | **PASS** (`EXIT: 0`) |
| **Frontend Typecheck** | `npx tsc --noEmit` | **PASS** (`EXIT: 0`, 0 errors) | **PASS** (`EXIT: 0`, 0 errors) | **PASS** (`EXIT: 0`, 0 errors) |
| **Frontend Lint** | `npm run lint` | **FAIL** (`EXIT: 2`, `TypeError: object is not iterable`) | **PASS** (`EXIT: 0`, 0 errors, 5 warnings) | **FAIL** (`EXIT: 2`, `TypeError: object is not iterable`) |
| **Frontend Build (`dist/`)** | `npm run build` | **PASS** (`EXIT: 0`, 8.55s) | **PASS** (`EXIT: 0`, 5.99s) | **PASS** (`EXIT: 0`, 4.94s) |
| **Database Migrations** | `npx prisma migrate deploy` | **PASS** (`EXIT: 0`, 1 migration) | **PASS** (`EXIT: 0`, 2 migrations) | **PARTIAL / DEFECT** (`EXIT: 0`, applies 1 migration, **misses `InvoiceRevision` table**) |
| **Database Seed** | `npx prisma db seed` | **FAIL** (`EXIT: 1`, ESM & 3 runtime bugs) | **PASS** (`EXIT: 0`, 1 user + 7 invoices) | **PASS** (`EXIT: 0` after `db push`, 1 user + 7 invoices + 5 revisions) |
| **Backend Prod Start (`npm run start`)** | `npm run start` | **PASS** (`200 OK` on `/health`) | **FAIL** (`EXIT: 1`, `ts-node` `TS2339` crash; **PASS** if started with `node`) | **PASS** (`200 OK` on `/health`) |
| **Docker Build Config** | Static + Yarn 4 check | **DEFECT** (missing `tsc-alias`; Yarn 1 flags `--frozen-lockfile --production`) | **DEFECT** (missing `tsc-alias`; Yarn 1 flags + broken `npm start` cmd) | **DEFECT** (same as `main`) |

### Detailed Failure Root Causes

1. **`main` & `origin/boxing1` Frontend Lint Failure (`npm run lint` -> `EXIT: 2`)**:
   - **Error**: `TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))` at [`invoice-frontend/eslint.config.mjs:39:23`](file:///home/djblackett/dev/invoice-web-app/invoice-frontend/eslint.config.mjs#L39).
   - **Cause**: `...pluginJs.configs.recommended` spreads an object inside the flat-config array instead of passing `pluginJs.configs.recommended` as an array element. Fixed on `OAuth-phase1`.

2. **`main` Prisma Seed Failure (`npx prisma db seed` -> `EXIT: 1`)**:
   - **Error 1 (Node 20)**: `SyntaxError: Cannot use import statement outside a module` in [`invoice-backend/prisma/seed.js:1`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/prisma/seed.js#L1) because `seed.js` uses ESM `import` while `invoice-backend/package.json` is CommonJS.
   - **Errors 2–4 (Node 24 with ESM auto-detection)**:
     - [`seed.js:111`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/prisma/seed.js#L111): `getUserByIdSafely` calls `await this.prisma.user.findUniqueOrThrow(...)` inside a standalone function where `this` is `undefined`, throwing `TypeError: Cannot read properties of undefined (reading 'prisma')`.
     - [`seed.js:49`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/prisma/seed.js#L49): `let dbUser = getUserByIdSafely(user.id)` is missing `await`, so `dbUser` is a truthy Promise object; `if (!dbUser)` is false, so `createUserWithAuth0(user)` is never called!
     - [`seed.js:58–74`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/prisma/seed.js#L58-L74): `prisma.invoice.create` fails with `P2025` (foreign key `user1` does not exist), and the `catch` block calls `prismaErrorHandler(error)`, which is not imported/defined (`ReferenceError: prismaErrorHandler is not defined`).
   - **Result**: 0 users and 0 invoices are seeded on `main`. Both `OAuth-phase1` and `origin/boxing1` replace `seed.js` with a working `seed.mjs`.

3. **`OAuth-phase1` Backend Typecheck Failure (`npx tsc --noEmit` -> `EXIT: 2`, 227 Errors)**:
   - Unlike `main` (whose `tsconfig.json` has `"exclude": ["node_modules", "dist", "tests"]`), `OAuth-phase1`'s `tsconfig.json` removes `"tests"` from `"exclude"` and sets `"include": ["src/**/*", "tests/**/*"]`.
   - TypeScript reports **227 errors across 18 test files**, including `src/controllers/__tests__/oauth.controller.test.ts` (57 errors), `tests/unit/services/auth.service.test.ts` (48 errors), `tests/unit/controllers/auth.controller.test.ts` (22 errors), `src/validators/__tests__/auth.validator.test.ts` (14 errors), and `tests/unit/strategies/local.strategy.test.ts` (10 errors, including `TS2307: Cannot find module '@/utils/crypto.util'`).
   - Production compilation (`npm run build` using `tsconfig.build.json`, which excludes tests) succeeds with 0 errors.

4. **`OAuth-phase1` Backend Lint Failure (`npm run lint` -> `EXIT: 1`, 135 Errors)**:
   - Reports 135 ESLint errors across `src/` (`@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unused-vars`, `no-useless-escape`, etc. in the new auth/OAuth controllers, services, and tests).

5. **`OAuth-phase1` Backend `npm run start` Crash (`EXIT: 1`)**:
   - `OAuth-phase1` runs `ts-node -r tsconfig-paths/register dist/src/index.js`, which fails immediately:
     `TSError: ⨯ Unable to compile TypeScript: dist/src/index.js(2,37): error TS2339: Property '__importDefault' does not exist on type '{ default: {}; }'.`
   - Running `node -r tsconfig-paths/register dist/src/index.js` (the command from `main` commit `ae76833`) starts cleanly and responds `200 OK` on `GET /health`.

---

## 5. Test Suite Verification

### Complete Test Execution Matrix

| Suite | Command | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | `origin/boxing1` (`c750f88`) | Failure Classification |
|---|---|---|---|---|---|
| **Backend Unit (`tests/unit`)** | `npx vitest run ./tests/unit` | **8/8 files passed**<br>**91/91 tests passed** | **18/18 files passed**<br>**273/273 tests passed** | **12/12 files passed**<br>**112/112 tests passed** | All configured `tests/unit` suites pass. |
| **Backend Unit (`src/**/__tests__`)** *(excluded by `vitest.config.mts`)* | `npx vitest run src` | *(None present)* | **2/3 files passed, 1/3 failed**<br>**74 passed, 1 failed (75 total)** | *(None present)* | **(1) Application/Test mismatch**: `oauth.controller.test.ts` (`linkProvider > should handle unexpected errors`) expects HTTP `500`, controller returns `401`. |
| **Backend Integration (`tests/integration`)** | `npx vitest run ./tests/integration --no-file-parallelism` | **2/2 files passed**<br>**14/14 tests passed** | **2/2 files passed**<br>**14/14 tests passed** | **2/2 files passed**<br>**14/14 tests passed** | Passes against disposable PostgreSQL (`NODE_ENV=test` injects `ADMIN` user). |
| **Frontend Unit & Integration (`tests/`)** | `npx vitest run tests` | **11/19 files passed, 8/19 failed**<br>**62 passed, 32 failed, 2 skipped (96 total)** | **30/30 files passed**<br>**216 passed, 0 failed, 2 skipped (218 total)** | **12/20 files passed, 8/20 failed**<br>**66 passed, 32 failed, 2 skipped (100 total)** | **`main`/`boxing1`: (2) Broken/outdated tests** (8 test files missing React context/router/Redux/Apollo providers; fixed on `OAuth-phase1`). |
| **Frontend Unit (`src/features/**/__tests__`)** *(excluded by `vitest.config.mts`)* | `npx vitest run src` | *(None present)* | **2/10 files passed, 8/10 failed**<br>**(16 passed, 1 failed + 7 suite load failures)** | *(None present)* | **(2) Broken tests & (3) Config failure**: 2 files import uninstalled `@testing-library/user-event`; 5 files fail `checkEnvs()` (`VITE_BACKEND_URL is required`); `EmptyList.test.tsx` fails 1 SVG width assertion (`242`). |
| **Playwright E2E / API / Visual (`qa/`)** | `npx playwright test --list` | **14 tests in 6 files**<br>**Unable to run** | **39 tests in 9 files**<br>**Unable to run** | **14 tests in 6 files**<br>**Unable to run** | **(4) Unavailable external credentials**: `global-setup.ts` requires `TEST_LOGIN`, `TEST_PASSWORD`, and live Auth0 Universal Login. |

### Breakdown of `main` Frontend Test Failures (8 Files, 32 Failed Tests)
All 32 failing frontend tests on `main` (and `origin/boxing1`) are **broken/outdated tests** that render components without their required providers, all of which were subsequently repaired on `OAuth-phase1`:
1. `tests/integration/allInvoicesView.test.tsx` (6 failed): Missing `<DemoModeProvider>` / `<MockedProvider>` / `<Router>`.
2. `tests/integration/newInvoiceForm.test.tsx` (8 failed): Missing `<NewInvoiceContextProvider>` / `<Provider store={store}>`.
3. `tests/unit/AllInvoices.test.tsx` (3 failed): Missing `<MemoryRouter>` (`useLocation() may be used only in the context of a <Router>`).
4. `tests/unit/App.test.tsx` (5 failed): Missing Redux `<Provider>` and router setup.
5. `tests/unit/DateAndPayment.test.tsx` (1 failed): Missing `react-hook-form` / `NewInvoiceContextProvider` wrapper (`Cannot destructure property 'register' of 'useNewInvoiceContext()' as it is undefined`).
6. `tests/unit/DeleteModal.test.tsx` (3 failed): Missing `<MockedProvider>` / `<MemoryRouter>`.
7. `tests/unit/Login.test.tsx` (3 failed + 1 unhandled error): `vi.mock("@auth0/auth0-react")` incomplete (`useAuth0` returns undefined when rendering `WelcomePage`).
8. `tests/unit/WelcomePage.test.tsx` (3 failed): Missing `<DemoModeProvider>` / `<MemoryRouter>`.

### Playwright Suite Inventory (`invoice-frontend/qa/`)
- **On `main` (14 tests across 6 files)**:
  - `accessibility-axe.spec.ts` (1 test)
  - `editInvoice.spec.ts` (2 tests)
  - `invoices.spec.ts` (6 tests)
  - `invoiceTest.spec.ts` (1 test)
  - `invoiceView.spec.ts` (2 tests)
  - `newInvoice.spec.ts` (2 tests)
- **On `OAuth-phase1` (39 tests across 9 files)**:
  - Adds `api/invoiceApi.spec.ts` (7 GraphQL API tests), `invoiceFiltering.spec.ts` (4 tests), `visual/visualRegression.spec.ts` (7 visual snapshot tests), and expands `editInvoice.spec.ts` (6 tests), `invoiceView.spec.ts` (5 tests), and `newInvoice.spec.ts` (7 tests).
- **Why Playwright Cannot Run Without External Credentials**:
  - `invoice-frontend/playwright.config.ts` unconditionally sets `globalSetup: "./global-setup"`.
  - `qa/global-setup.ts` immediately throws `Error("TEST_LOGIN and TEST_PASSWORD must be set")` if those variables are absent, and otherwise launches headless Chromium to log into the external Auth0 Universal Login page (`dev-g30482152010537l.us.auth0.com`) to save `qa/.auth/user.json`.

---

## 6. High-Risk Defect Reproduction Results

To test runtime authorization and data integrity accurately without triggering the `NODE_ENV=test` auth bypass, both `main` (`:18101` on `db-main`) and `OAuth-phase1` (`:18102` on `db-oauth`, with `AUTH_SYSTEM=auth0`) were started with **`NODE_ENV=production`** and `DEMO_MODE=false`, pointed at a live local RS256 OIDC JWKS server (`http://127.0.0.1:18199/.well-known/jwks.json`). Real RS256-signed JWTs were minted for:
- **User A**: `sub: "auth0|userA"` (persisted in PostgreSQL with `role: "USER"`)
- **User B**: `sub: "auth0|userB"` (persisted in PostgreSQL with `role: "USER"`)
- **User C (Admin)**: `sub: "auth0|adminC"` (persisted in PostgreSQL with `role: "ADMIN"`)

### 4A. Cross-User Invoice Authorization (`User A` targeting `User B`'s Invoice `BB1001`)

| Operation Tested (via `POST /graphql` as `User A` `[USER]`) | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | Classification & Runtime Evidence |
|---|---|---|---|
| **List Invoices (`allInvoices`)** | Returns only `["AA1001", "AA1002"]` (`BB1001` excluded) | Returns only `["AA1001", "AA1002"]` (`BB1001` excluded) | **Prevented in stack**: `prismaInvoiceRepository.findAll(id, "USER")` filters by `where: { createdById: userId }`. |
| **Read User B's Invoice (`getInvoiceById(id: "BB1001")`)** | **HTTP 200**: `{"data":{"getInvoiceById":{"id":"BB1001","clientName":"UserB Secret Client","clientEmail":"userb@secret.org","total":500,"status":"pending"}}}` | **HTTP 200**: `{"data":{"getInvoiceById":{"id":"BB1001","clientName":"UserB Secret Client","clientEmail":"userb@secret.org","total":500,"status":"pending"}}}` | **RUNTIME REPRODUCED (Both branches)**: `findByUserIdAndInvoiceId(_id, _role, invoiceId)` ignores `_id` and `_role` (`prismaInvoiceRepo.ts:137–156`). |
| **Edit User B's Invoice (`editInvoice(id: "BB1001", clientName: "TAMPERED BY USER A", total: 999)`)** | **HTTP 200**: Overwrites `BB1001` in PostgreSQL (`clientName: "TAMPERED BY USER A"`, `total: 999`, `items: [{name: "Tampered Item"}]`) | **HTTP 200**: Overwrites `BB1001` in PostgreSQL (`clientName: "TAMPERED BY USER A"`, `total: 999`, `items: [{name: "Tampered Item"}]`) | **RUNTIME REPRODUCED (Both branches)**: `InvoiceService.updateInvoice` checks existence via `this.getInvoiceById(id)` without comparing `invoice.createdById` to `context.user.id`. |
| **Mark User B's Invoice Paid (`markAsPaid(id: "BB1001")`)** | **HTTP 200**: `{"data":{"markAsPaid":{"id":"BB1001","status":"paid"}}}` | **HTTP 200**: `{"data":{"markAsPaid":{"id":"BB1001","status":"paid"}}}` | **RUNTIME REPRODUCED (Both branches)**: `InvoiceService.markAsPaid` performs zero ownership check before calling `invoiceRepo.markAsPaid(id)`. |
| **Delete User B's Invoice (`removeInvoice(id: "BB1002")`)** | Rejected: `"Invoice could not be removed"`, `stillInDb: true` | Rejected: `"Invoice could not be removed"`, `stillInDb: true` | **Prevented in stack**: `InvoiceService.deleteInvoice` checks `invoice.createdById` against `userContext.id`. |

### 4B. Invoice Deletion (`removeInvoice`) Matrix

| Scenario | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | Root Cause Comparison |
|---|---|---|---|
| **1. `USER` deleting own invoice (`AA1001`)** | **RUNTIME REPRODUCED (Broken)**<br>GraphQL Error: `"Invoice could not be removed"` (`INTERNAL_SERVER_ERROR`), `stillInDb: true`. | **PASS (Fixed)**<br>`{"data":{"removeInvoice":{"acknowledged":true}}}`, `stillInDb: false`. | `main` checks `if (invoice.createdById !== id \|\| role !== "ADMIN")`, throwing `ForbiddenException` for any non-Admin even when `invoice.createdById === id`! `OAuth-phase1` changes `\|\|` to `&&`. |
| **2. `USER` deleting another user's invoice (`BB1002`)** | **PASS (Prevented)**<br>GraphQL Error: `"Invoice could not be removed"`, `stillInDb: true`. | **PASS (Prevented)**<br>GraphQL Error: `"Invoice could not be removed"`, `stillInDb: true`. | Both branches block `USER` from deleting another user's invoice. |
| **3. `ADMIN` deleting own invoice (`CC1001`)** | **RUNTIME REPRODUCED (Broken response shape)**<br>Deletes row (`stillInDb: false`), but returns `{"data":{"removeInvoice":{"acknowledged":null}}}`! | **PASS (Fixed)**<br>`{"data":{"removeInvoice":{"acknowledged":true}}}`, `stillInDb: false`. | On `main`, `prismaInvoiceRepository.delete` returns boolean `true` instead of `{ acknowledged: true }`, so GraphQL resolves `DeleteInvoiceResponse.acknowledged` as `null`. Fixed on `OAuth-phase1`. |
| **4. `ADMIN` deleting another user's invoice (`BB1003`)** | **RUNTIME REPRODUCED (Broken)**<br>GraphQL Error: `"Invoice could not be removed"`, `stillInDb: true`. | **PASS (Fixed)**<br>`{"data":{"removeInvoice":{"acknowledged":true}}}`, `stillInDb: false`. | On `main`, `if (invoice.createdById !== id \|\| role !== "ADMIN")` requires an `ADMIN` to *also* be the creator (`createdById === id`) to delete an invoice! Fixed on `OAuth-phase1`. |

### 4C. Invoice Total Integrity (`editInvoice` and `addInvoice`)

| Test Case | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | Runtime Result & Explanation |
|---|---|---|---|
| **`editInvoice` with stale `total: 300` and updated items `[{qty: 2, price: 200, total: 400}, {qty: 1, price: 250, total: 250}]` (sum = `650`)** | **RUNTIME REPRODUCED**<br>Persists `invoice.total = 300` while persisted `items` sum to `650`. | **RUNTIME REPRODUCED**<br>Persists `invoice.total = 300` while persisted `items` sum to `650`. | `InvoiceService.updateInvoice` sets `total: updateData.total ?? oldInvoice.total` and never recomputes `invoice.total` or `item.total` from `quantity * price`. |
| **`editInvoice` with omitted `total` and updated items `[{qty: 4, price: 100, total: 400}]` (sum = `400`)** | **RUNTIME REPRODUCED**<br>Persists `invoice.total = 300` (`oldInvoice.total`) while persisted `items` sum to `400`. | **RUNTIME REPRODUCED**<br>Persists `invoice.total = 300` (`oldInvoice.total`) while persisted `items` sum to `400`. | When `total` is omitted on `editInvoice`, `updateData.total ?? oldInvoice.total` preserves the stale `oldInvoice.total`. *(Note: The React frontend masks this during normal UI edits because `createInvoiceObject` in `invoiceFunctions.ts` computes `total` client-side before sending `editInvoice`.)* |
| **`addInvoice` with omitted `total` and items `[{qty: 2, price: 125, total: 250}]` (sum = `250`)** | **RUNTIME REPRODUCED**<br>Persists `invoice.total = 0` while persisted `items` sum to `250`! | **FIXED (Partial)**<br>Persists `invoice.total = 250` matching `items` sum `250`. | `main`'s `mapPartialInvoiceToInvoice` sets `total: invoice.total ?? 0`. `OAuth-phase1` changes this to `invoice.total \|\| (invoice.items?.reduce(...) ?? 0)` (which fixes omitted/zero `total` on `addInvoice`, though a nonzero mismatched client `total` is still trusted). |
| **`addInvoice` with omitted `id` (two sequential calls)** | **RUNTIME REPRODUCED**<br>First invoice created with `id: ""`; second invoice crashes with Prisma `P2002` (`Unique constraint failed on id`). | **FIXED**<br>Prisma generates a UUID when `id` is omitted/empty. | `main` passes `id: invoiceData.id ?? ""` into `prisma.invoice.create`, overriding Prisma's `@default(uuid())` with `""`. Fixed on `OAuth-phase1`. |

### 4D. `markAsPaid` Status Transitions

| Test Case | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | Runtime Result |
|---|---|---|---|
| **Call `markAsPaid(id: "AA1002")` on an invoice with `status: "draft"`** | **RUNTIME REPRODUCED**<br>`{"data":{"markAsPaid":{"id":"AA1002","status":"paid"}}}` | **RUNTIME REPRODUCED**<br>`{"data":{"markAsPaid":{"id":"AA1002","status":"paid"}}}` | Neither `InvoiceService.markAsPaid` nor `prismaInvoiceRepository.markAsPaid` checks whether the current invoice status is `"pending"`. A `"draft"` invoice (even one with incomplete draft fields) can be transitioned directly to `"paid"` via the API. *(In the UI, the "Mark as Paid" button in `EditButtons.tsx` is rendered for both `"pending"` and `"draft"` invoices because it only checks `invoice?.status !== "paid"`!)* |

---

## 7. Demo Mode Runtime Analysis

### Answers to the 8 Required Demo Mode Questions

1. **What happens when a visitor selects Demo Mode?**
   - On `<WelcomePage>`, clicking **"Try Demo Mode"** calls `startDemo()` (`WelcomePage.tsx:22–25`), which sets `isDemoMode = true` in `DemoModeProvider` (persisted to `localStorage.setItem("isDemoMode", "true")`), dispatches `toggleRole(0)` (Basic User) to Redux, and navigates to `/invoices`.
   - In [`useApolloClient.ts:39,79`](file:///home/djblackett/dev/invoice-web-app/invoice-frontend/src/features/shared/hooks/useApolloClient.ts#L39), when `isDemoMode` is `true`, the Apollo auth link skips Auth0's `getAccessTokenSilently()` and attaches `Authorization: Bearer demo-token` (when Redux `role === 0`) or `Authorization: Bearer demo-token-admin` (when Redux `role === 1`).

2. **What user identity is assigned?**
   - For Basic User (`role === 0`, `Bearer demo-token`):
     - Backend [`createContext.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/createContext.ts#L184-L191) assigns `{ id: "demoId", role: "USER", name: "Demo User", username: "demo-user@example.com" }`.
   - For Demo Admin (`role === 1`, `Bearer demo-token-admin`):
     - Backend [`createContext.ts`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/createContext.ts#L193-L201) assigns `{ id: "demoAdminId", role: "ADMIN", name: "Demo Admin", username: "demo-admin@example.com" }`.
   - On the first GraphQL query (`allInvoices`), `invoiceResolvers.ts:27–38` checks if `context.user.id` exists in PostgreSQL and, if not, auto-creates the `demoId` or `demoAdminId` row in the `"User"` table.

3. **Which database is used?**
   - If the backend process was started with `DEMO_MODE=true`, [`server.config.ts:16–18`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/config/server.config.ts#L16-L18) overwrites `process.env.DATABASE_URL = process.env.DEMO_DATABASE_URL`, so **every request to that backend process** (both Demo Mode and real authenticated users!) uses `DEMO_DATABASE_URL`.
   - Conversely, if the backend process was started with `DEMO_MODE=false` (normal production), `DATABASE_URL` is used, and **Demo Mode requests read and write directly in the primary production database**.

4. **What invoices are initially visible?**
   - **Zero (`0`) invoices!**
   - Runtime verification confirmed that when a visitor enters Demo Mode (`role: 0` / `demoId`) on a freshly migrated and seeded database (`db-oauth` or `db-boxing1`), `allInvoices` returns `[]` (`count = 0`).
   - **Why**: `prisma/seed.mjs` creates 1 user (`id: "user1"`, `username: "john@melba.toast"`) and assigns all 7 seeded invoices (`RT3080`, `XM9141`, `AA1449`, `FV2353`, `TY9141`, `RT2080`, `RG0314`) to `createdById: "user1"`. When Demo Mode queries `allInvoices` as `demoId` (`role: "USER"`), `prismaInvoiceRepository.findAll("demoId", "USER")` filters by `where: { createdById: "demoId" }`, matching 0 rows.

5. **Can a demo user create, edit, mark paid, and delete invoices?**
   - **On `main` (`32a820c`)**:
     - Create (`addInvoice`): Works (if `id` is supplied by the frontend).
     - Edit (`editInvoice`): Works.
     - Mark as paid (`markAsPaid`): Works.
     - Delete (`removeInvoice`): **FAILS** (`INTERNAL_SERVER_ERROR: "Invoice could not be removed"`) when in Basic User (`role: 0`) mode because `main` forbids `USER` from deleting their own invoices; in Demo Admin (`role: 1`) mode, it deletes the invoice only if `demoAdminId` created it (and returns `acknowledged: null`).
   - **On `OAuth-phase1` (`0b613f7`)**:
     - Create, Edit, Mark as Paid, and Delete all **WORK** in both Basic User (`demoId`) and Demo Admin (`demoAdminId`) modes — **provided** the backend has `DEMO_USER_TOKEN=demo-token` and `DEMO_ADMIN_TOKEN=demo-token-admin` set in its environment.

6. **What happens if two visitors use Demo Mode concurrently?**
   - **Complete state collision (zero isolation)**: Both visitors authenticate as `demoId` (or `demoAdminId`). In our runtime test, Visitor 1 created invoice `DM1001` (`clientName: "Visitor 1 Client"`), and Visitor 2 immediately saw `DM1001` in `allInvoices` (`count: 1`) and could edit or delete it.

7. **Can Demo Mode affect non-demo data or expose admin capabilities?**
   - **YES — Critical Data Exposure & Tampering Vulnerability**:
     - Any Demo Mode visitor can click the top-bar avatar (`Avatar.tsx:29–88`) and switch the radio button from **"Basic User (read/write own)"** (`0`) to **"Admin (read/write all)"** (`1`).
     - This immediately switches the frontend header to `Authorization: Bearer demo-token-admin` (`role: "ADMIN"`).
     - In our runtime test, switching to `Bearer demo-token-admin` caused `allInvoices` to return **every invoice in the database** (`8` on `db-main`, `13` on `db-oauth`) — including all 7 `user1` seeded invoices, `demoId`'s invoices, **and the private invoices (`AA1001`, `AA1002`, `BB1001`, `BB1002`) created by real authenticated users (`auth0|userA` and `auth0|userB`)**!
     - On `OAuth-phase1` (where `ADMIN` delete is fixed), a Demo Admin visitor can also **delete every real user's invoice in the database**.

8. **How is demo data reset or isolated, if at all?**
   - **There is no demo reset or isolation mechanism in production.**
   - The only wipe endpoint in the codebase is `GET /test-setup` (`app.ts:81–103`), which is only mounted when `NODE_ENV` is `"development"`, `"test"`, or `"CI"`, and runs an unauthenticated `await prisma.invoice.deleteMany()` (wiping the entire `Invoice` table without reseeding).

---

## 8. Authentication and OAuth Runtime Reality (`OAuth-phase1`)

### Custom Auth (`POST /auth/*`) & OAuth (`GET /oauth/*`) Runtime Verification

We tested `OAuth-phase1`'s authentication subsystem at runtime with generated 2048-bit RSA keys (`JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`) under both `AUTH_SYSTEM=new` and `AUTH_SYSTEM=dual`:

| Endpoint / Flow | Runtime Result | Evidence & Root Cause |
|---|---|---|
| **1. User Registration (`POST /auth/register`)** | **FAIL (`HTTP 500`)**<br>`{"error":"Internal server error"}` | **Two sequential bugs block registration**:<br>1. [`auth.controller.ts:50`](file:///home/djblackett/dev/invoice-web-app/invoice-backend/src/controllers/auth.controller.ts) calls `await userRepo.getUserById(email)` to check if the user already exists. `prismaUserRepo.getUserById` queries `{ where: { id: email } }` using `findUniqueOrThrow`, which throws `Error("User not found")` whenever the user is new!<br>2. Even if line 50 is bypassed, `prismaUserRepo.createUser` (`prismaUserRepo.ts:142–151`) ignores `userArgs.passwordHash` and only inserts `{ name, username, role: "USER" }`, leaving `User.passwordHash = NULL` in PostgreSQL. |
| **2. User Login (`POST /auth/login`) after failed registration** | **FAIL (`HTTP 401`)**<br>`{"error":"Invalid email or password"}` | Because `POST /auth/register` failed (or if created via `prismaUserRepo.createUser`, left `passwordHash: null`), `auth.controller.ts:127` checks `if (!user \|\| !user.passwordHash)` and returns `401`. |
| **3. User Login (`POST /auth/login`) with pre-seeded `passwordHash` in DB** | **PASS (`HTTP 200`)**<br>Returns `{ accessToken, expiresIn: 900, user }` + `Set-Cookie: refreshToken=...; HttpOnly; SameSite=Strict`. | When a user row in PostgreSQL has a valid bcrypt `passwordHash`, `auth.controller.ts:login` verifies the password, issues an RS256 access token, persists a `RefreshToken` row, and sets the `HttpOnly` cookie. |
| **4. GraphQL Request with Custom JWT (`AUTH_SYSTEM=new` and `AUTH_SYSTEM=dual`)** | **PASS (`HTTP 200`)**<br>`{"data":{"allInvoices":[]}}` | `createContext.ts` verifies the RS256 JWT via `tokenService.verifyAccessToken(token)` and populates `context.user`. Under `AUTH_SYSTEM=dual`, both custom JWTs and Auth0 RS256 JWTs succeed on the same server! *(Note: `.env.example` documents `AUTH_SYSTEM=hybrid`, which is a typo for `dual`.)* |
| **5. Refresh Token Rotation (`POST /auth/refresh`)** | **PASS (`HTTP 200`)** on valid cookie;<br>**PASS (`HTTP 401`)** when replaying old rotated cookie. | Rotates the refresh token in PostgreSQL (`revokedAt` set on old token, new `RefreshToken` row created) and returns a new `accessToken` and `Set-Cookie`. Replaying the old cookie returns `401 {"error":"Invalid or expired refresh token"}`. |
| **6. Logout (`POST /auth/logout`)** | **PASS (`HTTP 200`)**<br>`{"message":"Logged out successfully"}` | Revokes the refresh token in PostgreSQL and clears the `refreshToken` cookie. |
| **7. JWKS Endpoint (`GET /auth/.well-known/jwks.json` vs `GET /.well-known/jwks.json`)** | **`/auth/.well-known/jwks.json`: `HTTP 200`**<br>**`/.well-known/jwks.json`: `HTTP 400`** | Because `authRoutes` is mounted at `app.use("/auth", authRoutes)`, the JWKS route is served at `/auth/.well-known/jwks.json` rather than the standard root `/.well-known/jwks.json` (which falls through to Apollo Server on `/` and returns 400). |
| **8. OAuth Provider Redirects (`GET /oauth/google`, `/oauth/microsoft`, `/oauth/apple`)** | **`/oauth/google`: `HTTP 500`** (`Unknown authentication strategy "google"`)<br>**`/oauth/microsoft`: `HTTP 500`**<br>**`/oauth/apple`: `HTTP 400`** (Apollo CSRF error) | Without external provider credentials in env, `configurePassport()` skips registering Google/Microsoft strategies, causing Passport middleware on `/oauth/google` and `/oauth/microsoft` to throw an unhandled 500 error. Apple OAuth has no strategy or route implemented at all. |
| **9. Frontend `NewAuthContext` vs Backend Response Shape** | **MISMATCH (Broken in UI)** | Backend `/auth/login` and `/auth/register` return `{ accessToken, expiresIn, user }`. Frontend `NewAuthContext.tsx:168,187` expects `response.tokens` (`storeTokens(response.tokens, response.user)`) where `tokens` is `{ accessToken, refreshToken, expiresIn }`. Additionally, `src/index.tsx` mounts `<Auth0Provider>` rather than `<NewAuthProvider>`. |

### Architectural Conclusion on Auth
- **Auth0 + Fixed Demo Mode** is dramatically simpler, cleaner, and closer to production readiness for the portfolio baseline than `OAuth-phase1`'s half-wired custom Auth/OAuth stack.
- Keeping or repairing the 7,000+ lines of custom OAuth/local-auth controllers, Passport strategies, SendGrid email flows, and broken tests is unnecessary to deliver a rock-solid portfolio case study and public demo.

---

## 9. `origin/boxing1` Revision History Assessment

We selectively verified `origin/boxing1` (`c750f88`, 1 commit ahead of `main`: *"Implement invoice revision history with diff & restore"*):

1. **Git Topology**:
   - `git merge-base --is-ancestor main origin/boxing1` -> **TRUE** (clean 1-commit fast-forward of `main`).
2. **Build & Test Verification**:
   - Backend build (`npm run build`): **PASS (`EXIT: 0`)**.
   - Frontend build (`npm run build`): **PASS (`EXIT: 0`, built in 4.94s)** — includes `RevisionHistoryPanel` chunk (`10.13 kB`).
   - Backend unit tests (`npx vitest run ./tests/unit`): **12/12 files passed, 112/112 tests passed** (adds 21 new unit tests across `invoiceDiff.test.ts` [9], `invoiceRevisionService.test.ts` [6], `invoiceService.revisions.test.ts` [4], and `invoiceRevisionResolvers.test.ts` [2]).
   - Frontend revision unit test (`npx vitest run tests/unit/RevisionDiffView.test.tsx`): **1/1 file passed, 4/4 tests passed**.
3. **Runtime Verification & Defects Found on `origin/boxing1`**:
   - **Defect 1 — Missing Prisma Migration File**: `origin/boxing1` added `model InvoiceRevision` to `invoice-backend/prisma/schema.prisma`, but **did not add a migration under `invoice-backend/prisma/migrations/`**. Running `npx prisma migrate deploy` only applies `20250304053431_moo` and leaves the `"InvoiceRevision"` table absent in PostgreSQL. Once synced via `npx prisma db push` (or a generated migration), `node ./prisma/seed.mjs` succeeds (`EXIT: 0`) and seeds 1 user, 7 invoices, and 5 revisions on `RT3080`.
   - **Runtime Verification of Revision Lifecycle**: Against a live `origin/boxing1` backend (`:18103` on `db-boxing1`), creating invoice `BX2001` (`addInvoice`) recorded revision `#1` (`changeType: "create"`), editing `BX2001` (`editInvoice`) recorded revision `#2` (`changeType: "edit"`), `invoiceRevisions(invoiceId: "BX2001")` returned both revisions in descending order, and `restoreInvoiceRevision(invoiceId: "BX2001", revisionId: rev1.id)` restored the original client name, description, and recomputed total (`100`) while appending revision `#3` (`changeType: "restore"`).
   - **Defect 2 — Cross-User Vulnerability Extends to Revisions**: Because `origin/boxing1` branched from `main` where `getInvoiceById` does not enforce ownership, `InvoiceRevisionService.assertCanAccessInvoice` (`invoiceRevision.service.ts:207–221`) calls `this.invoiceService.getInvoiceById(invoiceId, userContext)`, which succeeds for any authenticated user! At runtime, unprivileged user `demoId` (`role: "USER"`) was able to both list (`invoiceRevisions(invoiceId: "RT3080")`) **and overwrite/restore (`restoreInvoiceRevision(invoiceId: "RT3080", ...)`)** `user1`'s invoice `RT3080`! *(Note: Once `getInvoiceById` / `findByUserIdAndInvoiceId` is fixed to enforce ownership, `assertCanAccessInvoice` on `origin/boxing1` will automatically block cross-user revision access and restoration.)*

---

## 10. Prioritized Defect and Risk Register

| ID | Title | Affected Branches | Severity | Runtime Confirmed? | Impact on Portfolio Demo | Impact on Security / Data Integrity | Exact Root Cause (`file:line`) |
|---|---|---|---|---|---|---|---|
| **DEF-01** | Cross-user invoice read (`getInvoiceById`), update (`editInvoice`), and `markAsPaid` (IDOR) | `main`, `OAuth-phase1`, `origin/boxing1` | **CRITICAL** | **Yes** | Any user can tamper with any other user's invoices if ID is known/guessed. | Complete tenant-isolation failure across `USER` accounts (and across `invoiceRevisions` / `restoreInvoiceRevision` on `origin/boxing1`). | `prismaInvoiceRepo.ts:137–156`: `findByUserIdAndInvoiceId(_id, _role, invoiceId)` ignores `_id` and `_role`; `invoice.service.ts`: `updateInvoice` and `markAsPaid` do not verify `invoice.createdById === userContext.id`. |
| **DEF-02** | Demo Mode hardcoded tokens active in production + Demo Admin exposes all users' invoices | `main`, `OAuth-phase1`, `origin/boxing1` | **CRITICAL** | **Yes** | Demo visitors switching to Admin see (and on `OAuth-phase1` can delete) all real users' invoices. | On `main`/`boxing1`, anyone can send `Bearer demo-token-admin` in production to gain full `ADMIN` access to the primary database. | `createContext.ts:184–201` (`main`) / `200–219` (`OAuth-phase1`): Demo tokens accepted even when `DEMO_MODE !== "true"`; `demoAdminId` granted `role: "ADMIN"` across the whole DB. |
| **DEF-03** | Unauthenticated `GET /test-setup` wipes all invoices in `development` / `CI` | `main`, `OAuth-phase1`, `origin/boxing1` | **HIGH** | **Yes** | Accidental or malicious GET request deletes all invoices. | Unauthenticated `prisma.invoice.deleteMany()` enabled whenever `NODE_ENV` is `"development"`, `"test"`, or `"CI"`. | `app.ts:81–103`: Mounts `GET /test-setup` when `process.env.NODE_ENV === "development"` (default when `NODE_ENV` is unset!). |
| **DEF-04** | `removeInvoice` broken for `USER` (own invoice) and `ADMIN` (other user's invoice + `acknowledged: null`) | `main`, `origin/boxing1` *(Fixed on `OAuth-phase1`)* | **HIGH** | **Yes** | Users in the demo or app cannot delete their own invoices (`INTERNAL_SERVER_ERROR`). | Broken core CRUD operation and broken GraphQL contract (`acknowledged: null`). | `invoice.service.ts:187`: `if (invoice.createdById !== id \|\| role !== "ADMIN")` uses `\|\|` instead of `&&`; `prismaInvoiceRepo.ts:272`: returns `true` instead of `{ acknowledged: true }`. |
| **DEF-05** | Demo Mode starts with `0` invoices (`EmptyList`) and has zero isolation or reset | `main`, `OAuth-phase1`, `origin/boxing1` | **HIGH** | **Yes** | Recruiters/reviewers clicking "Try Demo Mode" land on an empty screen (`0` invoices) or see graffitied state from prior visitors. | Poor portfolio first impression; shared mutable `demoId` state across all visitors. | `seed.mjs` seeds all 7 invoices under `createdById: "user1"`, while Demo Mode logs in as `id: "demoId"`. |
| **DEF-06** | `main` database seed (`prisma/seed.js`) crashes with 4 errors | `main` *(Fixed on `OAuth-phase1` & `origin/boxing1`)* | **HIGH** | **Yes** | `npx prisma db seed` fails (`EXIT: 1`), leaving database empty. | Cannot seed disposable/demo environments on `main`. | `prisma/seed.js:1,49,74,111`: `.js` ESM syntax error on Node 20, `this.prisma` undefined, missing `await`, undefined `prismaErrorHandler`. |
| **DEF-07** | Custom Auth registration (`POST /auth/register`) crashes with HTTP 500 & drops `passwordHash` | `OAuth-phase1` | **HIGH** | **Yes** | Custom email/password registration and login are non-functional end-to-end. | `User.passwordHash` is never persisted by `prismaUserRepo.createUser`. | `auth.controller.ts:50` (`getUserById(email)` throws on new user); `prismaUserRepo.ts:142–151` (omits `passwordHash`); `NewAuthContext.tsx:168` (token response shape mismatch). |
| **DEF-08** | `OAuth-phase1` backend `npm run start` crashes; 227 TypeScript test errors & 135 ESLint errors | `OAuth-phase1` | **HIGH** | **Yes** | Production start script (`npm run start`) crashes immediately with `TS2339`. | Blocks production deployment and CI typecheck/lint gates on `OAuth-phase1`. | `invoice-backend/package.json:7`: uses `ts-node` instead of `node` on compiled `dist/src/index.js`; broken types in 18 auth test files. |
| **DEF-09** | Invoice `total` and line-item `total` are not recomputed server-side on `addInvoice` / `editInvoice` | `main`, `OAuth-phase1`, `origin/boxing1` | **MEDIUM** | **Yes** | API clients can persist invoices whose `total` disagrees with `sum(items.total)` or `quantity * price`. | Financial data integrity violation in PostgreSQL (`invoice.total = 300` vs `items = 650`). | `invoice.service.ts`: trusts client `total` (`updateData.total ?? oldInvoice.total`) instead of computing `sum(qty * price)` server-side (unlike `origin/boxing1`'s `withRecomputedTotals` used only during `restoreRevision`). |
| **DEF-10** | `addInvoice` with omitted `id` sets `id: ""` on `main`, failing on 2nd insert with `P2002` | `main`, `origin/boxing1` *(Fixed on `OAuth-phase1`)* | **MEDIUM** | **Yes** | Any API call to `addInvoice` that omits `id` works once (`id: ""`) and fails thereafter. | Breaks server-side UUID fallback (`@default(uuid())`). | `prismaInvoiceRepo.ts:48` (`main`): passes `id: invoiceData.id ?? ""` instead of omitting empty `id`. |
| **DEF-11** | `markAsPaid` allows transitioning `"draft"` invoices directly to `"paid"` | `main`, `OAuth-phase1`, `origin/boxing1` | **MEDIUM** | **Yes** | Draft invoices (even with incomplete fields) can be marked as paid in UI and API. | Violates invoice lifecycle (`draft -> pending -> paid`). | `invoice.service.ts` (`markAsPaid`) and `EditButtons.tsx:48` (`invoice?.status !== "paid"`) do not check `status === "pending"`. |
| **DEF-12** | `origin/boxing1` `InvoiceRevision` model lacks a Prisma migration in `prisma/migrations/` | `origin/boxing1` | **MEDIUM** | **Yes** | `npx prisma migrate deploy` does not create the `"InvoiceRevision"` table. | Revision creation silently fails (`recordRevisionSafely` logs error) and `invoiceRevisions` query fails until `prisma db push` or a migration is added. | `origin/boxing1` modified `prisma/schema.prisma` without adding a migration folder in `prisma/migrations/`. |
| **DEF-13** | Plaintext `DATABASE_URL` logged on startup (`main`) & broken `Dockerfile` (`tsc-alias` / Yarn 4 flags) | `main`, `OAuth-phase1`, `origin/boxing1` | **MEDIUM** | **Yes** | Leaks database password into container/Render stdout logs on `main`/`boxing1`; Docker build fails under Yarn 4 or misses `@/` aliases. | Credential exposure in logs; broken container build. | `server.config.ts:28` (`main`); `invoice-backend/Dockerfile:11,14,22` (missing `yarn tsc-alias` and using Yarn 1 flags). |
| **DEF-14** | `main` frontend ESLint config crashes (`EXIT: 2`) and 8 frontend unit test files fail (32 tests) | `main`, `origin/boxing1` *(Fixed on `OAuth-phase1`)* | **LOW** | **Yes** | `npm run lint` and `npm run test:unit` fail in `invoice-frontend` on `main`. | No runtime impact on the built app, but blocks clean CI lint/test gates. | `invoice-frontend/eslint.config.mjs:39` (`...pluginJs.configs.recommended`); 8 test files missing context providers. |

---

## 11. `main` vs `OAuth-phase1` Runtime Comparison

| Dimension | `main` (`32a820c`) | `OAuth-phase1` (`0b613f7`) | Winner / Assessment |
|---|---|---|---|
| **Backend Build & Prod Start** | Builds cleanly (`EXIT: 0`) and starts cleanly via `npm run start` (`node -r tsconfig-paths/register dist/src/index.js`). | Builds cleanly (`EXIT: 0`), but `npm run start` **crashes** (`ts-node` `TS2339`). | **`main`** |
| **Backend Typecheck & Lint** | `tsc --noEmit`: **0 errors**.<br>`npm run lint`: **0 errors** (10 warnings). | `tsc --noEmit`: **227 errors** (18 test files).<br>`npm run lint`: **135 errors**. | **`main`** (by a wide margin) |
| **Frontend Build, Typecheck & Lint** | Build & Typecheck: **PASS**.<br>Lint: **FAIL** (1-line spread bug in `eslint.config.mjs`). | Build, Typecheck & Lint: **PASS** (0 errors, 5 warnings). | **`OAuth-phase1`** (trivial 1-line fix on `main`) |
| **Backend Unit & Integration Tests** | **91/91** unit + **14/14** integration pass. | **273/273** unit + **14/14** integration pass (plus 1 failing unconfigured test in `src/`). | **Tie** (all core invoice tests pass on both; `OAuth-phase1`'s extra tests are for its unfinished custom auth stack) |
| **Frontend Unit Tests** | **62 passed, 32 failed** (8 test files missing providers). | **216 passed, 0 failed** in `tests/` (plus 8 broken unconfigured test files in `src/features/auth`). | **`OAuth-phase1`** for `tests/` (cleanly cherry-pickable to `main`) |
| **Database Migrations & Seeding** | 1 clean migration (`20250304053431_moo`). `seed.js` **FAILS**. | Adds heavy OAuth schema migration (`20251201025109_add_oauth_tables`). `seed.mjs` **PASSES**. | **`main` schema** + **`seed.mjs` from `origin/boxing1` / `OAuth-phase1`** |
| **Core Invoice CRUD & Deletion** | Cross-user IDOR present; `removeInvoice` **BROKEN** for `USER` and `ADMIN`. | Cross-user IDOR still present; `removeInvoice` **FIXED**; empty `id` & zero `total` on `addInvoice` **FIXED**. | **`OAuth-phase1`** has ~25 lines of surgical bugfixes in `invoice.service.ts`, `prismaInvoiceRepo.ts`, and `utils.ts` |
| **Authentication Architecture** | Clean, focused Auth0 OIDC + Demo Mode (~220 lines in `createContext.ts`). | Carries ~7,000+ lines of half-wired custom Auth/OAuth/SendGrid/Passport code whose `/auth/register` fails with HTTP 500 and whose frontend/backend token contracts disagree. | **`main`** (vastly cleaner and lower maintenance risk) |
| **Compatibility with `origin/boxing1` (Revision History)** | `origin/boxing1` is a **1-commit fast-forward of `main`** (`c750f88`). | Diverged across 26 commits; merging requires resolving conflicts in `prisma/schema.prisma`, `invoice.service.ts`, and GraphQL types. | **`main` / `origin/boxing1`** |

---

## 12. Recommended Baseline Decision

### Recommendation: **Option C — Hybrid Consolidation on `main` (Fast-Forwarded to `origin/boxing1`) + Surgical Cherry-Picks from `OAuth-phase1`**

Do **not** use `OAuth-phase1` as the primary base branch. Runtime verification proved that `OAuth-phase1`'s largest addition — the custom email/password and multi-provider OAuth subsystem — is **broken end-to-end at runtime** (`POST /auth/register` throws HTTP 500, `prismaUserRepo.createUser` drops `passwordHash`, `NewAuthContext.tsx` expects a different JSON shape than `auth.controller.ts` returns, `npm run start` crashes, `tsc --noEmit` has 227 errors, and `npm run lint` has 135 errors). Adopting `OAuth-phase1` as the base would saddle the portfolio project with thousands of lines of broken authentication code and schema bloat (`OAuthAccount`, `RefreshToken`, `PasswordResetToken`, `EmailVerificationToken`, `SecurityAuditLog`) that are not needed when Auth0 + a properly isolated Demo Mode are used.

Instead, **use `main` (fast-forwarded to `origin/boxing1` `c750f88`) as the clean foundation**, and port only the proven, surgical improvements from `OAuth-phase1`:

1. **What `origin/boxing1` (`c750f88`) immediately gives on top of `main`**:
   - Clean, working `prisma/seed.mjs` (`EXIT: 0`, seeds `user1`, 7 invoices, and 5 revision snapshots).
   - Complete, well-tested Invoice Revision History with Diff & Restore (`112/112` backend unit tests passing, `4/4` new frontend unit tests passing, verified end-to-end at runtime).
   - Zero custom-OAuth bloat, zero backend typecheck errors, zero backend lint errors, and a working `npm run start`.

2. **What to surgically port from `OAuth-phase1` (~5 small, targeted diffs)**:
   - **Backend Invoice Fixes**:
     1. `invoice.service.ts`: Fix `deleteInvoice` condition (`&&` instead of `||`) and return `{ acknowledged: true }` from `prismaInvoiceRepo.ts`.
     2. `prismaInvoiceRepo.ts`: Omit empty `id` on `create` so Prisma `@default(uuid())` works when `id` is not provided.
     3. `server.config.ts`: Mask `DATABASE_URL` credentials in startup logs (`postgresql://***:***@...`).
   - **Frontend Lint & Test Fixes**:
     4. `invoice-frontend/eslint.config.mjs`: Fix `pluginJs.configs.recommended` array element so `npm run lint` passes with 0 errors.
     5. `invoice-frontend/tests/**` & `invoice-frontend/qa/**`: Port the repaired React unit/integration tests (`30/30` files passing, `216` tests) and expanded Playwright specs (`invoiceFiltering.spec.ts`, `api/invoiceApi.spec.ts`).

---

## 13. Recommended Next Implementation Phases

### Phase 1: Security, Tenant Isolation, and Core Invoice Integrity (Highest Priority)
1. **Enforce Ownership in `prismaInvoiceRepository` and `InvoiceService` (`DEF-01`)**:
   - In `prismaInvoiceRepo.ts` (`findByUserIdAndInvoiceId`) and/or `InvoiceService` (`getInvoiceById`, `updateInvoice`, `markAsPaid`), enforce `if (role !== "ADMIN" && invoice.createdById !== userContext.id) throw new ForbiddenException(...)`.
   - This single fix simultaneously secures `getInvoiceById`, `editInvoice`, `markAsPaid`, `invoiceRevisions`, `invoiceRevisionDiff`, and `restoreInvoiceRevision`!
2. **Fix `removeInvoice` (`DEF-04`) and `addInvoice` Empty-ID Handling (`DEF-10`)**:
   - Change `if (invoice.createdById !== id || role !== "ADMIN")` to `if (invoice.createdById !== id && role !== "ADMIN")` in `invoice.service.ts`.
   - Return `{ acknowledged: true }` from `prismaInvoiceRepository.delete`.
   - Omit empty `id` in `prismaInvoiceRepository.create`.
3. **Server-Side Total Recomputation (`DEF-09`) & `markAsPaid` Status Guard (`DEF-11`)**:
   - Use `withRecomputedTotals` (already implemented on `origin/boxing1` in `src/utils/invoiceDiff.ts`!) inside `addInvoice` and `updateInvoice` so every persisted item `total` (`quantity * price`) and invoice `total` (`sum(items.total)`) is authoritative on the server.
   - Restrict `markAsPaid` (both in `InvoiceService.markAsPaid` and in `EditButtons.tsx`) to invoices with `status === "pending"`.
4. **Lock Down `/test-setup` (`DEF-03`) and Mask `DATABASE_URL` Logs (`DEF-13`)**:
   - Restrict `GET /test-setup` strictly to `NODE_ENV === "test" || NODE_ENV === "CI"` (never `"development"`), and mask credentials in `server.config.ts`.
5. **Add the Missing Prisma Migration for `InvoiceRevision` (`DEF-12`)**:
   - Create `invoice-backend/prisma/migrations/<timestamp>_add_invoice_revisions/migration.sql` for `InvoiceRevision` so `npx prisma migrate deploy` works out of the box.

### Phase 2: Portfolio-Grade Demo Mode Redesign (`DEF-02`, `DEF-05`)
1. **Gate Demo Tokens by `DEMO_MODE` or Dedicated Demo Session**:
   - Never allow `demo-token-admin` to query or mutate real Auth0 users' rows (`where: { createdById: ... }` must never be unfiltered across real users).
2. **Seed Demo Data Visible Immediately Upon Entering Demo Mode**:
   - Either seed the 7 starter invoices (and revision history on `RT3080`) directly under `demoId`, or assign each Demo Mode visitor a per-session demo user/workspace (`demo-<sessionId>`) pre-populated (or lazily cloned on first visit) from the 7 canonical template invoices + revisions, with an explicit **"Reset Demo Data"** button in the UI.
   - If keeping the "Basic User vs. Admin" role switcher in Demo Mode for demonstration purposes, scope Demo Admin strictly to demo-flagged users/invoices (`isDemo: true` or `createdById IN ('demoId', 'user1')`) so Demo Admin showcases multi-user admin visibility (e.g. seeing both `Demo User` and `John Melba` invoices) **without ever touching real authenticated users' invoices**.

### Phase 3: Frontend Lint, Test Suite, and Docker Polish (`DEF-13`, `DEF-14`)
1. Fix `invoice-frontend/eslint.config.mjs` (1 line) and port the repaired frontend unit test wrappers from `OAuth-phase1` so both backend and frontend pass `tsc --noEmit`, `npm run lint`, and `npm run test:unit` at 100%.
2. Add a Demo-Mode Playwright E2E project in `playwright.config.ts` that runs against local Demo Mode without requiring external Auth0 credentials (`TEST_LOGIN` / `TEST_PASSWORD`).
3. Fix `invoice-backend/Dockerfile` to run `npm run build` (which includes `tsc-alias`) and use compatible install flags.

---

## 14. Open Questions and External Dependencies

1. **Auth Direction Confirmation**: Are you comfortable dropping `OAuth-phase1`'s unfinished custom email/password + Google/Microsoft/Apple OAuth subsystem and keeping **Auth0 + redesigned Demo Mode** as the authentication model for the portfolio release?
2. **Demo Mode Role Switcher Behavior**: In the public portfolio demo, should the avatar menu's **"Basic User vs. Admin"** toggle be:
   - **(A)** Scoped to a sandboxed multi-user demo dataset (e.g., Basic User sees their own demo invoices; Demo Admin also sees a second seeded demo persona's invoices, plus a "Reset Demo Data" button), or
   - **(B)** Replaced with a single per-visitor isolated Demo session (pre-seeded with the 7 canonical invoices + revision history and a "Reset Demo" button)?
3. **External Hosting Targets**: Is the production deployment still targeting **GitHub Pages / Vercel** (frontend) + **Render** (backend + PostgreSQL), or do you want a unified Docker Compose / single-provider deployment for the portfolio demo?

---

## 15. Evidence Appendix

### A. Exact Commands Executed During Verification

```bash
# 1. Isolated Git Worktrees & Ephemeral PostgreSQL 16.1 Container
git worktree add --detach /tmp/audit-wt/main main
git worktree add --detach /tmp/audit-wt/oauth-phase1 OAuth-phase1
git worktree add --detach /tmp/audit-wt/boxing1 origin/boxing1
docker run -d --name audit-temp-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -v /tmp/audit-pg-socket:/var/run/postgresql postgres:16.1

# 2. Prisma Generate & Migrate Deploy (per isolated database: db-main, db-oauth, db-boxing1)
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

# 3. Typecheck, Lint, and Production Builds (Backend & Frontend)
npx tsc --noEmit
npm run lint
npm run build

# 4. Unit & Integration Test Suites
npx vitest run ./tests/unit
npx vitest run ./tests/integration --no-file-parallelism
npx vitest run tests

# 5. Live Production-Mode Runtime Reproductions (main :18101, OAuth-phase1 :18102, boxing1 :18103)
NODE_ENV=production PORT=18101 DEMO_MODE=false DOMAIN=http://127.0.0.1:18199/ AUDIENCE=https://invoices-api.local node -r tsconfig-paths/register dist/src/index.js
```

### B. Selected Runtime Output Excerpts (Redacted)

#### 1. Cross-User Authorization Reproduction (`main` `:18101` & `OAuth-phase1` `:18102`, `NODE_ENV=production`)
```json
// User A (sub: "auth0|userA", role: "USER") querying User B's invoice "BB1001":
{"status":200,"body":{"data":{"getInvoiceById":{"id":"BB1001","clientName":"UserB Secret Client","clientEmail":"userb@secret.org","total":500,"status":"pending"}}}}

// User A editing User B's invoice "BB1001":
{"status":200,"body":{"data":{"editInvoice":{"id":"BB1001","clientName":"TAMPERED BY USER A","total":999,"items":[{"name":"Tampered Item","quantity":1,"price":999,"total":999}]}}}}

// User A marking User B's invoice "BB1001" as paid:
{"status":200,"body":{"data":{"markAsPaid":{"id":"BB1001","status":"paid"}}}}
```

#### 2. `removeInvoice` Comparison (`main` vs `OAuth-phase1`)
```json
// 1. USER deleting own invoice AA1001:
// main:
{"errors":[{"message":"Invoice could not be removed","extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"removeInvoice":null}} // stillInDb=true
// OAuth-phase1:
{"data":{"removeInvoice":{"acknowledged":true}}} // stillInDb=false

// 3. ADMIN deleting own invoice CC1001:
// main:
{"data":{"removeInvoice":{"acknowledged":null}}} // stillInDb=false (deleted row, null response field)
// OAuth-phase1:
{"data":{"removeInvoice":{"acknowledged":true}}} // stillInDb=false

// 4. ADMIN deleting another user's invoice BB1003:
// main:
{"errors":[{"message":"Invoice could not be removed","extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":{"removeInvoice":null}} // stillInDb=true
// OAuth-phase1:
{"data":{"removeInvoice":{"acknowledged":true}}} // stillInDb=false
```

#### 3. Custom Auth Registration Crash on `OAuth-phase1` (`POST /auth/register`)
```text
Error fetching user by ID: Error: User not found
    at Object.getUserById (/tmp/audit-wt/oauth-phase1/invoice-backend/src/repositories/prismaUserRepo.ts:127:15)
    at register (/tmp/audit-wt/oauth-phase1/invoice-backend/src/controllers/auth.controller.ts:50:26)
POST /auth/register -> HTTP 500 {"error":"Internal server error"}
```

#### 4. `origin/boxing1` Cross-User Revision Read & Restore (`demoId` `[USER]` targeting `user1`'s `RT3080`)
```json
// demoId (role: "USER") reading user1's invoice revisions for RT3080:
{"data":{"invoiceRevisions":[{"id":"6c788dc4-14b7-4a8b-9e5d-24f0ce82ec4a","revisionNumber":5},...]}}

// demoId (role: "USER") restoring user1's invoice RT3080 to revision 1:
{"data":{"restoreInvoiceRevision":{"id":"RT3080","clientName":"Jensen Huang","total":1500}}}
```

