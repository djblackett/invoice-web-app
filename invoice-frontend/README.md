# Invoice App

## How to run

### Run frontend in development mode

`npm run dev`

### Run tests

#### Unit tests

`npm run test:unit`

#### End-to-end tests

Prerequisites: Node 22/24 (verified with 24.15.0), dependencies installed in both packages using their pinned Yarn 4.6.0 lockfiles, local PostgreSQL server tools (verified with 16.13), and the Playwright Chromium browser. Run as an ordinary user; PostgreSQL `initdb` refuses root. No database service, test account, Auth0 credentials, Docker or certificates are needed.

```bash
# One-time browser prerequisite, from invoice-frontend:
npx --no-install playwright install chromium
# Install OS browser libraries too if the machine needs them:
# npx --no-install playwright install --with-deps chromium

# PostgreSQL tools must be on PATH, or specify their directory:
PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e
```

On macOS, `PG_BIN` can point to the installed PostgreSQL `bin` directory. Omit it when `initdb`, `pg_ctl` and `createdb` are already on PATH. Linux shells must select a Linux Node installation, not a Windows executable under WSL.

The command creates a temporary loopback-only PostgreSQL cluster, applies the committed migrations, seeds the shared canonical Demo workspace, builds the backend and two production frontend bundles (Demo enabled/disabled), starts local servers on available ports, and runs Playwright. It always stops its services and removes the database on success, failure or Ctrl-C. Logs, bundles, HTML/JSON reports and failure screenshots/traces remain in the printed `/tmp/invoice-e2e-*` directory; remove that directory when finished. Failed setup or tests exit nonzero.

Developer `.env` URLs and Auth0 settings are overridden/ignored. The browser uses real GraphQL and PostgreSQL; no API responses are mocked. Demo scenarios run one worker with fresh contexts, deterministic entry resets, and no retries, because `demoId` is intentionally shared. Desktop Chromium (1440×1000) and mobile Chromium (393×727) run the full suite: 17 cases by default, 18 with optional Firefox smoke. Both real backend processes use `NODE_ENV=production`, so the historical test authentication shortcut is excluded.

```bash
npm run typecheck:e2e
# Forward normal Playwright filters, preserving the managed isolated environment:
PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e -- --project=chromium-desktop
# Optional backend regression safeguard in a second disposable database:
PG_BIN=/usr/lib/postgresql/16/bin E2E_BACKEND_REGRESSION=true npm run test:e2e
```

The default browser comes from the installed Playwright version. If a compatible browser is already installed elsewhere, explicitly set `E2E_CHROMIUM_EXECUTABLE=/absolute/path/to/chrome`. Optional `E2E_FIREFOX_EXECUTABLE=/absolute/path/to/firefox` adds an entry/navigation smoke test. These overrides are escape hatches, not automatic searches for arbitrary browser versions.

Each simulated visitor sends a distinct private test proxy address to the local backend, which already trusts one proxy hop. The production 100-requests-per-IP limit remains enabled; separate scenarios do not cumulatively exhaust one visitor’s allowance. All requests still use the same authorized demo identity and shared workspace.

An active Demo entry survives navigation and same-tab refresh. Manual Reset Demo and deliberate logout/re-entry restore the seven canonical invoices and eleven canonical revisions. A fresh browser context starts a new entry. This UI session marker does not isolate visitors or grant authorization.

The historical Compose Playwright container and live-Auth0 CI wiring are not this gate. Use the command above for local/CI browser verification. Real Auth0 redirect, token acquisition/refresh and logout still require a separate configured staging tenant smoke test; they are not claimed verified by this suite.

### Startup backend

Use Docker Compose to start the appropriate backend.
First `cd ..` to go to root directory

### Production env

`docker compose up`

### Development environment

`docker compose -f docker-compose.dev.yml up`

### Test env

`docker compose -f docker-compose-test.yml up`

## Frontend quality gate

After installing dependencies with the pinned Yarn version (`corepack yarn install --immutable`), run from this directory:

```bash
npm run check
```

This runs both strict TypeScript projects, ESLint, the existing Vitest unit/integration suite in parallel, and the Vite production build. `npm test` runs tests once; `npm run test:unit` retains watch mode. Tests use jsdom and mocks and do not require a backend or Auth0 credentials.

For a serial diagnostic run:

```bash
npm test -- --no-file-parallelism
```

See [Slice 5A verification](../docs/audit/slice-5a-frontend-stabilization.md) for baseline errors, repeated reliability checks, existing skips. See [Slice 5C verification](../docs/audit/slice-5c-playwright-e2e-stabilization.md) for browser coverage and remaining release checks.
