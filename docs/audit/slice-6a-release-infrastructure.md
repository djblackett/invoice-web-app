# Slice 6A — release infrastructure and automated quality gates

Date: 2026-10-18 (America/Halifax, client date).

## 1. Starting State and Scope

Branch `portfolio-stabilization`, starting HEAD
`c92bc1bcaf82e5c0d4b541a25ca5fd1b6b142eeb`, clean working tree.
Read the requested archaeology, runtime, plan and Slice 1/3B/4B/4C/5A/5C reports;
inspected current source, all four workflows, five Dockerfiles, three Compose
files, setup script, environment examples, Prisma schema and both migrations.
Historical audit claims are context; the current committed application is the baseline.

This slice repairs lint, automated gates, local container builds/startup and developer
commands. It preserves authentication/authorization policy, Demo identity/reset,
invoice calculations/status rules, GraphQL contracts and frontend components.
No production database, live Auth0 tenant, hosting account, DNS, push, merge or
external deployment was used. Disposable native clusters and a separately named
local Docker project were used for runtime checks.

Tooling: Linux Node 24.15.0, npm 12.2.0, Corepack 0.34.6, package-pinned Yarn 4.6.0,
PostgreSQL 16.13 native tools, Docker CLI 29.2.1/server 29.8.2, Compose v2.33.0,
actionlint 1.7.12. The initial shell selected Windows npm and lacked Linux Node;
all actual Node checks used the explicit Linux PATH. Global `yarn` is 1.22.22;
use `corepack yarn` to honor the package pins. There is no root package/lockfile.

## 2. Baseline Quality-Gate Results

| Gate before repairs | Observed result |
| --- | --- |
| Frontend `npm run check` | PASS: both typechecks, ESLint, 115 tests / 2 existing skips, production build |
| Backend `tsc --noEmit` | PASS |
| Backend ESLint | FAIL: **18 errors / 17 warnings**, rather than the older 17/20 estimate |
| Backend production build | PASS |
| Backend units in isolated E2E regression database | 116/116 PASS |
| Full backend integration, serial with 60-second hooks | 158/158 PASS |
| Managed browser baseline | 17/17 Chromium PASS, zero skips/retries |
| Both package immutable installs | PASS with existing peer warnings after backend sandbox retry |

The frontend baseline build was executed inside `check`, not as an additional
standalone baseline invocation. Final standalone build was executed separately.
Initial E2E socket creation failed with EPERM in the sandbox; the authorized
local-socket/browser retry completed. Backend's first locked install failed in
esbuild executable validation under the sandbox; its retry succeeded without
changing dependency resolutions. Raw logs: `/tmp/slice6a/baseline-*`,
`/tmp/slice6a/backend-install.log`; regression/browser artifacts:
`/tmp/invoice-e2e-5QLN1C/`.

## 3. Backend ESLint Findings and Repairs

Actual baseline rules: eight Prettier errors, five unnecessary-condition errors,
three unnecessary-type-assertion errors and two non-null-assertion errors.
Warnings: fourteen object-injection heuristics, two nonliteral certificate-file
warnings and one timing-attack heuristic on the public Demo selector.

Repairs preserve current behavior: format affected lines; remove redundant casts;
represent the existing defensive address fallback with accurate nullable/partial
input types; use checked array access instead of non-null assertions; remove the
resolver's unreachable missing-result branch (the service already returns an
invoice or throws NotFoundException). Use literal Auth0 claim keys and explicit
address values rather than computed keys where possible.

Ten individual, explained `eslint-disable-next-line` exceptions remain for proven
false positives: seven accesses using fixed internal field allowlists, two reads
of operator-configured TLS files, and comparison with the public `demo-token`
selector. These do not exempt files or disable rules globally. No blanket
suppression, new `any`, strictness reduction or authentication-policy change.
The original security and type-aware rules remain enabled. `lint` now fails on
warnings too. Final result: **0 errors / 0 warnings**.

`npm run check` now provides backend source typecheck, lint, one-shot units and
compiled build. Integration remains a separate explicitly targeted gate.

## 4. GitHub Actions Audit

| Original workflow | Classification and disposition |
| --- | --- |
| `ci-code-quality-tests.yaml` | BROKEN; obsolete branch coverage, non-immutable installs, fix-mode lint, watch tests, missing types/build/browser checks, secret-dependent Auth0 and automatic Docker Hub pushes. Repaired in place as the single quality workflow. |
| `backend-deployment.yaml` | BROKEN / REDUNDANT for checks; Yarn 1 versus pinned Yarn 4, schema push, certificates/secrets, duplicate checks and automatic Fly deployment. Removed; backend gate absorbed into CI. |
| `frontend-deploy.yaml` | BROKEN / OBSOLETE; live Auth0/browser state assumptions, VITE client-secret exposure risk, insecure PR-target checkout, schema push, obsolete servers and automatic Pages publishing. Removed; frontend/browser coverage absorbed into CI. |
| `codeql.yml` | CURRENT purpose, stale actions/triggers/privileges. Retained, simplified to JS/TS no-build analysis, updated maintained action majors and current stabilization branch. |

Missing necessary coverage was explicit TypeScript/non-mutating lint, migrated
integration, the Slice 5C managed browser runner and actual production container
startup. No hosted workflow was run during this task.

## 5. Final CI Architecture

`CI quality gates` runs on all pull requests, pushes to main/dev/stabilization and
feature/release/hotfix patterns, and manual dispatch. It has `contents: read`,
checkout credential persistence disabled, timeouts and cancellation of superseded
runs. It does not use PR-target triggers or production secrets, publish images or
deploy. Corepack selects Yarn 4.6.0; installs use `--immutable`. Yarn download cache
keys use the relevant lockfiles, rather than caching whole node_modules trees.

| Job | Responsibility |
| --- | --- |
| `frontend` | Locked install; `npm run check` (types/lint/Vitest/build); E2E TypeScript check |
| `backend` | Disposable PostgreSQL 16 service; Prisma generation; source types/lint/116 units/build; migrations then serial 158 integration cases |
| `browser` | Locked installs in both packages; PostgreSQL 16 tools and locked Playwright Chromium; existing managed serial 17-case runner; scoped failure diagnostics |
| `containers` | Build production images; start fresh local Compose DB/backend/frontend; health, static assets and GraphQL response checks; always delete only its own CI volume |

The browser runner owns its native temporary cluster, distinct from backend CI's
PostgreSQL service. Its existing single-worker execution and reset strategy remain.
Artifacts include logs/reports/traces, not the temporary database or developer env
files. Optional local Firefox is not a hosted CI requirement. CodeQL is separate
and grants `security-events: write` only to its analysis job.

Action versions were checked against the maintainers' sources:
[checkout](https://github.com/actions/checkout),
[setup-node](https://github.com/actions/setup-node),
[cache](https://github.com/actions/cache),
[upload-artifact](https://github.com/actions/upload-artifact),
[CodeQL](https://github.com/github/codeql-action).

## 6. Dockerfile and Compose Audit

All retained Dockerfiles use Node 24.15.0 and immutable Yarn 4.6.0 installs.
Backend generates Prisma and compiles with alias rewriting during build, runs
compiled Node as the non-root node user, and migrates before serving. Runtime copies
only dependencies, compiled output, Prisma assets, package metadata and entrypoint.
Development images preserve Linux dependencies instead of hiding them beneath a
whole-package host mount. Dependency versions/lockfiles and old migrations are unchanged.

Frontend uses nginx with committed SPA fallback and genuine 404s for missing
assets. Public frontend variables are explicit build arguments. Runtime VITE env
values cannot reconfigure built assets. Docker contexts exclude all local env files,
certificates/keys, node_modules, caches and login state. Production builds no longer
read TLS files, and `npm run build` no longer overwrites the chosen backend URL.

`docker-compose.yml` is an explicitly LOCAL production-like stack: one application
PostgreSQL 16 database, health-ordered startup, persistent project-scoped volume,
loopback-only frontend/API ports and no exposed database port. No secrets/live
URLs are loaded. The obsolete Traefik experiment exposed its dashboard/Docker
socket and routed `/api/graphql` without stripping the prefix; direct loopback
ports now use the existing backend root for both HTTP and WebSocket transports.
This does not define public TLS ingress. The unused manual
`fix-pw-permissions.sh` was inspected; the new runner/workflows never invoke its
historical sudo/chmod operations.

`docker-compose.demo.yml` is now a small **override**, used alongside the base file;
it deliberately enables both Demo flags. It never seeds on container restart.
The default base stack leaves both flags false. `setup.sh demo` selects both files.

Standalone development Compose has an explicit browser-resolvable API URL,
DATABASE_URL, real development NODE_ENV, mounted local certificates, health probe,
and separate local DB port 55432. It no longer starts obsolete mismatched Playwright
or Adminer containers. `setup.sh` propagates health/build failures and does not
install host dependencies or reseed data. Host source development can explicitly
select HTTP with empty CERT_DIR and DEV_HTTPS=false; production TLS behavior is unchanged.

Removed confirmed consumers' obsolete `init.sql`/`init.dev.sql` (including invalid
pre-migration User/email/Demo Admin insertion), duplicate frontend localProd
Dockerfile and superseded root nginx configuration. Explicit POSTGRES_DB and
committed migrations replace SQL initialization. The root Fly manifest remains
marked unsupported historical configuration; no deployment repair/execution is claimed.

Production and development image builds: **VERIFIED LOCALLY** (all four retained Dockerfiles).
Production-like runtime: VERIFIED LOCALLY. HTTPS development container
runtime with an operator's certificates/Auth0: **NOT YET VERIFIED**.

## 7. Database Migration Verification

**VERIFIED LOCALLY** on a new Docker project volume and independently by the managed
native E2E cluster. The full committed chain is exactly:

1. `20250304053431_moo`
2. `20260412000000_add_invoice_revisions`

A fresh default stack started with zero users/invoices; startup created tables
through migrations, not schema push. `migrate deploy` repeated with no pending
migrations, `migrate status` reported up-to-date, and `migrate diff --from-url ...
--to-schema-datamodel prisma/schema.prisma --exit-code` found no difference.
Prisma Client generation/build succeeded separately in the images/runner.

Two explicitly requested seeds restored seven Demo-owned invoices and eleven
revisions, preserving a separate ordinary user/invoice. Full ordered user,
invoice and revision snapshots were identical before/after an ordinary backend
restart. Container startup has no seed/reset command. Existing canonical entry/reset
behavior remains the application implementation and is covered by full browser
and integration suites. The two old integration harnesses now deploy migrations
instead of pushing the schema, and no longer print credential-bearing URLs.

No old migration, schema, existing database or historical volume was changed.
A pre-existing DB created with db push still needs separately reviewed migration
reconciliation; startup is deliberately not an automatic baseline/reset tool.

## 8. Production Configuration Review

| Variable | Classification and requirement |
| --- | --- |
| DATABASE_URL | Required backend-only application DB URL; never frontend/public; one client/database for normal and Demo users |
| NODE_ENV | Required release value `production`; `test`/`CI` retain old test identity shortcut, development retains destructive private test setup |
| PORT | Optional backend, default 8000 |
| CORS_ORIGIN | Set explicitly for release: one exact frontend origin, scheme/port included, no path/list; existing fallback policy unchanged |
| DEMO_MODE | Demo-specific opt-in, literal `true`; defaults disabled |
| DOMAIN / AUDIENCE | Auth0-specific backend issuer URL (trailing slash) and API audience, needed for normal verified login |
| CERT_DIR | Development/test transport only; default ../certs; explicit empty string avoids local TLS files; release HTTP is terminated at ingress |
| APOLLO_GRAPH_REF | Optional production landing-page graph identifier, not a credential/URL |
| VITE_BACKEND_URL | Required PUBLIC build-time backend root URL, used for HTTP and WS/wss |
| VITE_DEMO_MODE | PUBLIC Demo-specific build-time opt-in; backend gate is independent |
| VITE_DOMAIN / VITE_CLIENT_ID / VITE_AUDIENCE / VITE_SCOPE | PUBLIC Auth0 SPA settings, required only for normal frontend sign-in |
| VITE_REDIRECT_URI | Optional PUBLIC callback URL; defaults to origin + /invoice-web-app/ |
| DEV_HTTPS | Development-only shell setting; false explicitly selects Vite local HTTP |
| PG_BIN / E2E_* | Test-only native tools, browser overrides, generated endpoints/artifacts and optional backend regression flag |

Updated both examples and ignore rules. No frontend DB URL, client secret, live
Auth0 test account, Demo Admin credentials, second Prisma client or database-switch
setting is active. Local Compose DB passwords are intentionally non-production
placeholders. Review covered the new diff and runtime image contents; it is not a
claim to have audited all historical Git objects or external secret stores.

Production authentication logging no longer prints usernames on each request;
context chatter is debug-only and the production logger level is info. Normal
verification and authorization behavior is unchanged. Production `/test-setup`
was verified forbidden, explicit CORS origin was verified, and no local env/TLS
files were present in backend runtime. Frontend Docker build excludes env files
and copies only built assets into nginx.

## 9. Local Production-Like Startup Verification

**VERIFIED LOCALLY**. Used only project `invoice-slice6a`, frontend port
15173/API 18000 and its new PostgreSQL volume. Compiled backend connected to DB;
all three services became healthy. nginx configuration passed `nginx -t`.
GraphQL `{ __typename }` returned Query; Demo-disabled protected access failed;
`/test-setup` returned 403. Build artifacts contained http://localhost:18000 rather
than the former forced https://localhost:8000.

Chromium against actual nginx verified the disabled entry screen, static asset
responses, page refresh, SPA fallback and missing-asset 404s, with no page/console
errors. Explicit Demo override/runtime check: **VERIFIED LOCALLY**: canonical seven-invoice entry, detail navigation and refresh, with the ordinary sentinel invoice preserved.
WebSocket routing uses the backend root; network handshake check: **VERIFIED LOCALLY**, including connection acknowledgement and an authenticated query over graphql-transport-ws.
Final container restart counts: zero for all three healthy services.

Initial diagnostic container probe overlapped my first build/up invocation and
observed its intentional frontend recreation/exit. That harness attempt failed;
the startup completed, then the entire probe passed sequentially. No application
change was used to mask that orchestration error. Logs:
`/tmp/slice6a/container-{build,start,check,check-final,browser-disabled,demo-start}.log`.
Final disposable project/volume cleanup: **VERIFIED LOCALLY**, all three containers plus the task-owned network/volume removed.

## 10. Browser E2E Compatibility

**VERIFIED LOCALLY:** baseline 17/17 Chromium; final **18/18**, comprising the same
17 core desktop/mobile/disabled cases plus installed Firefox smoke. Zero browser
skips, retries or flaky results; final browser duration 2.3 minutes.
The final runner's optional backend regression uses current npm scripts and a
second isolated DB, so the migration-first integration command was actually run.

No scenarios/assertions or isolation rules were relaxed. The runner still builds
real production backends and production frontend bundles, ignores developer URLs
and Auth0 values, seeds canonical fixtures and cleans its native cluster in finally.
Current browser overrides were necessary because the locked Playwright default
Chromium revision was not installed in this workspace; CI explicitly installs its
matching Chromium. No real Auth0 browser flow was attempted.

Final artifacts: `/tmp/invoice-e2e-ElxReg/` (HTML/JSON reports, logs, failure artifact
location); no artifacts/auth state were committed. Native database/socket cleanup
was checked after completion.

## 11. Final Frontend Quality-Gate Results

**VERIFIED LOCALLY**: `npm --prefix invoice-frontend run check` passes strict app/Node
types, ESLint, **115 passing / 2 existing skips**, and production build. Standalone
`npm --prefix invoice-frontend run build` and `typecheck:e2e` also pass.
Logs: `/tmp/slice6a/final-frontend-{check,build}.log`, `final-e2e-types.log`.

One intermediate frontend check read the E2E runner before its concurrent formatting
step finished and reported one Prettier error. Formatted runner and the subsequent
complete gate passed. Existing React/test-mock diagnostics, peer-version warnings
and Vite's >500kB chunk warning remain visible and nonblocking. No test suppression,
dependency upgrade, new skip or frontend component refactor was introduced.

## 12. Final Backend Quality-Gate Results

**VERIFIED LOCALLY**: `npm run check` passes source typecheck, **zero-error/zero-warning
lint**, **116/116 unit tests** (12 files), and compiled production build.
`npm run test:integration`, exercised through the final managed regression runner,
passes **158/158** cases (6 files), including actual JWT/JWKS, ownership, invariants,
Demo and User API checks. Integration remains serial with 60-second setup hooks.

The integration launcher rejects a missing explicit DATABASE_URL before loading
application dotenv, applies committed migrations, forces private test settings and
uses HTTP without developer keys. Its missing-URL failure was explicitly checked.
Tests must still target a database whose data may be discarded; the launcher cannot
infer the provenance of a caller-supplied URL. Coverage uses the same guarded launcher
and requests all tests; coverage collection itself was not executed in this slice.
The default typecheck retains its existing source/config scope; historical test
TypeScript coverage was not broadened by excluding or changing additional files.

Logs: `/tmp/slice6a/final-backend-{check,lint}.log`,
`/tmp/invoice-e2e-ElxReg/backend-{unit,integration}.log`.

## 13. Local CI Validation vs Hosted CI Verification

**STATICALLY REVIEWED**: workflow triggers, command/script existence, action inputs,
permissions, no-secret/no-deploy paths and artifact scope. **VERIFIED LOCALLY**:
actionlint 1.7.12 exits zero for both retained workflows; all effective application
checks and production container builds/startup were executed locally.
Actionlint initially found job-level runner.temp context misuse; moving that value
to the browser step's environment fixed the diagnostic.

**NOT YET VERIFIED**: execution on GitHub-hosted runners, cache hits, fork/Dependabot
behavior, Actions artifact upload and CodeQL analysis/service entitlement. No act
runner was available. Syntax/local command evidence is not a hosted successful run.
The pipelines have not been pushed or dispatched.

## 14. Remaining Release Risks

**DEFERRED TO SLICE 6B**:

- Hosted CI/CodeQL execution and branch protection checks.
- Staging domains/TLS/ingress, exact origin/CORS and HTTP/WebSocket routing at the
  real proxy; existing one-hop proxy/rate-limit assumptions need deployment review.
- Real Auth0 Universal Login, callback/logout origins, token acquisition/refresh,
  provisioning and normal user workflows. No live tenant changes were made.
- Existing hosted database inventory, backups/restore and migration reconciliation
  if historical db push or missing revision history was used. Never reset live data.
- Release migration serialization/rollback policy for multiple replicas; the local
  entrypoint blocks startup on migration failure but is not a hosted rollout strategy.
- Explicit decision to enable public Demo, review of shared visitor interference
  and canonical-ID conflicts; no redesigned Demo isolation is claimed.
- Broader readiness/observability: /health confirms startup, not continuous DB
  availability; production GraphQL error logging/introspection/landing page remain
  existing behavior requiring release configuration review.
- Runtime dependency pruning/image digest policy: backend still includes its locked
  dependency tree; nginx/PostgreSQL tags float within the selected maintained line.
- Two frontend skips, older testing-library peer warnings and bundle size warning.

Nullable createdBy mutation responses, Demo ID reservation and product/revision UI
issues remain outside scope. Historical local Docker volumes are left untouched;
POSTGRES_DB does not retrofit an already initialized volume. Use isolated project
names for fresh verification instead of deleting existing data.

## 15. Exact Files Changed

- `.github/workflows/backend-deployment.yaml`
- `.github/workflows/ci-code-quality-tests.yaml`
- `.github/workflows/codeql.yml`
- `.github/workflows/frontend-deploy.yaml`
- `.gitignore`
- `.nvmrc`
- `README.md`
- `docker-compose.demo.yml`
- `docker-compose.dev.yml`
- `docker-compose.yml`
- `docs/audit/slice-6a-release-infrastructure.md`
- `fly.toml`
- `init.dev.sql`
- `init.sql`
- `invoice-backend/.dockerignore`
- `invoice-backend/.env.example`
- `invoice-backend/Dockerfile`
- `invoice-backend/dev.Dockerfile`
- `invoice-backend/package.json`
- `invoice-backend/scripts/container-entrypoint.sh`
- `invoice-backend/scripts/test-integration.cjs`
- `invoice-backend/src/GraphQL/createContext.ts`
- `invoice-backend/src/config/logger.config.ts`
- `invoice-backend/src/config/server.config.ts`
- `invoice-backend/src/resolvers/invoiceResolvers.ts`
- `invoice-backend/src/resolvers/invoiceRevisionResolvers.ts`
- `invoice-backend/src/server.ts`
- `invoice-backend/src/services/invoice.service.ts`
- `invoice-backend/src/services/invoiceDiff.ts`
- `invoice-backend/tests/integration/invoiceResolvers.test.ts`
- `invoice-backend/tests/integration/userResolvers.test.ts`
- `invoice-frontend/.dockerignore`
- `invoice-frontend/.env.example`
- `invoice-frontend/Dockerfile`
- `invoice-frontend/README.md`
- `invoice-frontend/dev.Dockerfile`
- `invoice-frontend/localProd.Dockerfile`
- `invoice-frontend/nginx.conf`
- `invoice-frontend/package.json`
- `invoice-frontend/qa/scripts/run-e2e.mjs`
- `invoice-frontend/vite.config.ts`
- `nginx.conf`
- `setup.sh`

Both Yarn lockfiles, Prisma schema/migration history, frontend application components
and browser scenario assertions are unchanged. Install-generated tracked Yarn state
was restored to its starting content.

## 16. Commands and Reproduction Instructions

The concise developer sequence, including source development, optional mkcert setup
and shutdown, is in [README](../../README.md#getting-started).
Actual final local commands (from repository root):

```bash
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
(cd invoice-backend && corepack yarn install --immutable && npm run prisma-generate)
(cd invoice-frontend && corepack yarn install --immutable)
VITE_BACKEND_URL=http://localhost:18000 VITE_DEMO_MODE=false npm --prefix invoice-frontend run check
VITE_BACKEND_URL=http://localhost:18000 VITE_DEMO_MODE=false npm --prefix invoice-frontend run build
npm --prefix invoice-backend run check
npm --prefix invoice-frontend run typecheck:e2e
PG_BIN=/usr/lib/postgresql/16/bin \
E2E_CHROMIUM_EXECUTABLE=/home/djblackett/.cache/ms-playwright/chromium-1178/chrome-linux/chrome \
E2E_FIREFOX_EXECUTABLE=/home/djblackett/.cache/ms-playwright/firefox-1487/firefox/firefox \
E2E_BACKEND_REGRESSION=true npm --prefix invoice-frontend run test:e2e
/tmp/slice6a/actionlint -shellcheck=''
bash -n setup.sh
sh -n invoice-backend/scripts/container-entrypoint.sh
git diff --check
```

Fresh local production-like verification (the actual run also used a temporary
assertion harness for seed/data-preservation and browser checks):

```bash
export FRONTEND_PORT=15173 BACKEND_PORT=18000
export VITE_BACKEND_URL=http://localhost:18000 CORS_ORIGIN=http://localhost:15173
docker compose -p invoice-slice6a config --quiet
docker compose -p invoice-slice6a -f docker-compose.yml -f docker-compose.demo.yml config --quiet
docker compose -p invoice-slice6a-dev -f docker-compose.dev.yml config --quiet
docker compose -p invoice-slice6a build
docker compose -p invoice-slice6a up -d --build --wait --wait-timeout 180
curl --fail http://localhost:18000/health
docker compose -p invoice-slice6a exec -T backend node node_modules/prisma/build/index.js migrate deploy
docker compose -p invoice-slice6a exec -T backend node node_modules/prisma/build/index.js migrate status
docker compose -p invoice-slice6a exec -T backend sh -c 'node node_modules/prisma/build/index.js migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code'
# Only on this disposable database, explicitly invoke canonical reset/seed:
docker compose -p invoice-slice6a exec -T backend node prisma/seed.mjs
docker compose -p invoice-slice6a restart backend
docker compose -p invoice-slice6a up -d --wait --wait-timeout 180
# Explicitly opt into Demo and rebuild its frontend:
docker compose -p invoice-slice6a -f docker-compose.yml -f docker-compose.demo.yml up -d --build --wait --wait-timeout 180
docker compose -p invoice-slice6a-dev -f docker-compose.dev.yml build
# Removes ONLY this disposable project's containers/volume:
docker compose -p invoice-slice6a -f docker-compose.yml -f docker-compose.demo.yml down --volumes
```

Ordinary developers should install matching Chromium using the frontend's
`npx --no-install playwright install chromium`; executable overrides above record
this workspace's actual tools, not a portability requirement. Native runner
shutdown is automatic; remove retained /tmp reports after reviewing them.

## 17. Recommended Slice 6B Checklist

1. Push/open a reviewed PR only when authorized; observe all four hosted quality
   jobs plus CodeQL, then configure required status checks.
2. Inventory actual hosting/DB state and prepare backup/restore and existing-data
   migration reconciliation. Review hosted release migration and rollback commands.
3. Prepare staging-only public build arguments and server secrets; explicitly set
   production NODE_ENV, exact CORS origin, and intended Demo gates. Keep secrets
   out of VITE variables and public artifacts.
4. Validate staging TLS, GraphQL HTTP/WS upgrades, proxy trust, health/readiness and
   log behavior on the actual ingress; inspect restart behavior.
5. Run the separately authorized real Auth0 sign-in/provisioning/owned-invoice/
   refresh/logout smoke with a dedicated staging account, and repeat browser checks.
6. Review release blockers and obtain a separate deployment decision. Slice 6A
   commits locally and does not deploy.
