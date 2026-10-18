# Slice 5C — Playwright and browser E2E stabilization

Date: 2026-10-17 (America/Halifax).

## 1. Baseline and Scope

Started on `portfolio-stabilization` at the exact requested HEAD
`545b6e864d0b85acfe6e058b5fce765b2fbdbdd8`, with a clean working tree.
Read the stabilization plan and requested Slice 1, 3B, 4B, 4C and 5A reports;
inspected the existing QA files, startup/Compose/CI scripts, configuration,
canonical seed/reset implementation and current application workflows.

This slice establishes local browser verification and repairs four demonstrated
user-visible defects. Auth0, backend source/authorization/domain rules, database
schema/migrations, dependencies and lockfiles are unchanged. No PDF, partial
payment, feature development or general form/design refactoring. No historical
OAuth-phase1 implementation was imported. No push, merge or deployment.

## 2. Existing Playwright Infrastructure

Installed `@playwright/test`, `playwright` and browser driver: **1.51.0**.
Original command, run before any edits, from `invoice-frontend`:

```bash
npm run test:e2e
```

It set `NODE_ENV=test` and `VITE_BACKEND_URL=https://localhost:8000/graphql`,
then ran Playwright. Discovery was `qa/**/*.spec.ts`: seven specification files,
13 ordinary active cases, one skipped axe case, and two network-artifact cases
registered only when NODE_ENV equals the literal string `CI`. Only Chromium was
enabled; Firefox/WebKit configurations were commented out. One worker, HTML
reporter, always-on videos, ignored HTTPS errors and shared `state.json` login.
The configured base URL was required `TEST_BASE_URL`; the local setting was
`https://localhost:5173/invoice-web-app/`.

Global setup loaded developer dotenv, required TEST_LOGIN/TEST_PASSWORD and
TEST_BASE_URL, launched Chromium, automated Auth0 email/password Universal Login,
saved local authentication state and called a legacy `/test-setup` clearing route.
Existing specs depended on Jack Sparrow fixtures and live services, mixed new
unauthenticated contexts with saved login, leaked a separately launched browser,
used arbitrary sleeps/unawaited assertions, and navigated backwards through months
with five-second waits per mismatch. Network artifact tests did not assert success;
the axe case was skipped and mislabeled as a text-editor test.

The frontend package is ESM (`type: module`); the old QA files were outside its
TypeScript gates. The default gate now replaces this obsolete fixture/spec/Page Object graph with
compact real-UI helpers and executable assertions. Date selection/edit-date,
filtering, theme, welcome/avatar navigation and CRUD behavior are retained or
strengthened by functional tests. Comprehensive axe/contrast remediation remains
outside this slice; the skipped axe case was removed rather than reported passing.
Existing Vitest tests and their two skips remain.

## 3. Initial Failures

1. Original command exited 1 before browser assertions:
   `SyntaxError: ... '@playwright/test' does not provide an export named 'Page'`.
   QA helpers imported erased TypeScript Page/Locator symbols as ESM runtime values.
2. First repair was only type-only imports in those helpers. The same command then
   reached global setup but failed because Chromium headless-shell revision 1161
   was not installed. No real Auth0 login was attempted.
3. The old credential/state/database-reset assumptions were incompatible with an
   anonymous, isolated default gate. They were removed along with unused helpers.
   All new Page/Response symbols use `import type`; an E2E TypeScript check covers
   the previously unchecked config/helpers/specs.
4. Early development-server runs also encountered `ERR_NETWORK_CHANGED` during
   module loading. These errors were recorded, not suppressed. The finalized gate
   serves immutable production bundles through Vite preview, eliminating cold
   development dependency optimization from browser verification.
5. New assertions exposed stale test assumptions (Delete's accessible name is
   `delete-button`; XM9141 has a second £400 item), corrected in test code. Those
   were not classified as application defects. A filter interaction also needed an
   assertion that its animated menu had reached the expanded height before a
   selection; no timer sleep or filter application change was introduced.

Intermediate development runs are diagnostic evidence, not release results:
`/tmp/invoice-e2e-ezvbTe` (stopped at five failures) and
`/tmp/invoice-e2e-AJb5PL` (9 passing / 6 failing as the date/mobile/draft assertions
were introduced). The extended regression run `/tmp/invoice-e2e-1pENRW` passed all backend checks
but its browser suite exhausted the shared IP rate allowance (13 pass / 5 fail).
After visitor-IP isolation, `/tmp/invoice-e2e-1LQjWb` passed 17/18, exposing the
filter animation readiness race. Final results below use the corrected fixture and
readiness assertion in completed fresh-cluster runs.

## 4. Test Environment Architecture

`npm run test:e2e` invokes `qa/scripts/run-e2e.mjs`. It:

1. Creates a unique temporary PostgreSQL cluster and database on an available
   loopback port, using trust authentication only for that disposable local cluster.
2. Generates Prisma Client, applies the **two currently committed migrations**,
   and invokes the existing canonical `prisma/seed.mjs` implementation.
3. Builds the unchanged backend, starts production-mode Demo-enabled and
   Demo-disabled backend processes with explicit DATABASE_URL/DEMO_MODE/CORS flags.
4. Builds enabled/disabled production frontend bundles in its temporary directory,
   using the same React and TS path plugins. A small QA Vite config ignores
   developer `.env` and uses a temporary cache; no TLS certificates or Auth0 values.
5. Starts Vite preview on available loopback ports, waits for healthy services,
   and passes private run URLs to Playwright.
6. Propagates setup/test failures, stops child servers/PostgreSQL in `finally`
   (also on SIGINT/SIGTERM), removes database/socket directories, and retains logs,
   bundles, HTML/JSON reports and failure screenshots/traces at the printed path.

Existing DATABASE_URL, TEST_BASE_URL, frontend/backend URLs and Auth0 values do
not select the test target. Backend browser processes use **NODE_ENV=production**,
not the historical test authentication shortcut. No normal developer/production
DB, external Auth0 provider, test account, persistent Compose volume or fake demo
backend is used. The optional backend-regression flag creates a **second database**
in the same disposable cluster before browser startup.

The existing Compose/setup scripts are useful for interactive development, but
keep persistent data and historical auth/certificate/container assumptions. They
were inspected, not repurposed as an isolation guarantee. Historical deployment
CI/Compose wiring is not claimed repaired or verified by this local gate.

## 5. Demo Entry and Dashboard

Verified demo-first boot, logout to the welcome page, visible Enter Demo Mode,
unavailable normal login without Auth0 configuration, keyboard entry and canonical
seven invoice cards. Entry's real ResetDemoData response is asserted. All canonical
IDs are checked, with normal detail/home navigation and filtering/theme toggles.
The enabled deployment deliberately retains the existing demo-first boot behavior.
No anonymous Auth0 credential or fabricated successful login is involved.

## 6. Invoice CRUD

UI creation supplies sender/customer addresses, email, description, selected date,
14-day payment terms and two items: `2 × 125.50 + 3 × 40 = 371`. Tests assert the
real mutation's generated two-letter/four-digit ID, pending status, totals and dates,
eighth list card, detail values, navigation and refresh persistence.

UI editing changes XM9141's customer and first item's quantity/price. Expected
server total is `3 × 75.50 + 400 = 626.50`, including the retained second item.
The existing invoice date is checked on form open; saved values persist after
navigation and reload. The historical instant-close/edit-form problem did not
reproduce, so no historical form-controller fix was ported.

Deletion uses a newly created disposable invoice, verifies Cancel and confirmation,
asserts the real acknowledged response, valid dashboard navigation and seven
remaining cards. Canonical samples are not deleted for this scenario.

## 7. Status Transitions

XM9141 pending → paid is performed through the actual button. The response, UI,
refresh persistence and `Marked as paid` revision #2 are checked. FV2353 remains
draft and its payment action is disabled. The narrow frontend disabled-state repair
also disables the action after payment; backend status rules are unchanged.

## 8. Revision History

RT3080 begins with five canonical revisions. Tests open history, inspect the current
revision, select revision #2 using the keyboard, assert the structured field/item
diff (Logo Design and £1,800.90), confirm restore, and verify draft/£1,800.90 data.
Restoration appends revision #6; the restored values and six history entries survive
refresh. There is no invented standalone snapshot page: this implementation exposes
a timeline, metadata, diff against its predecessor and confirmed restore.

## 9. Demo Reset

The reset scenario creates extra data and restores RT3080 to append a visitor
revision, then invokes Manual Reset Demo. It verifies removal of the extra invoice,
canonical seven cards, RT3080's paid £2,101.80 state and five original revisions,
while remaining in Demo Mode. A second created invoice disappears after deliberate
logout/re-entry. Ordinary navigation and same-tab refresh preserve active edits.

Canonical reset remains the existing shared backend implementation: seven invoices,
eleven total revision rows (five on RT3080 plus six initial revisions). The frontend
session marker records lifecycle only; it does not create a private workspace.

## 10. Browser and Accessibility Checks

Full core suite runs in Chromium desktop **1440×1000** and Pixel 5 mobile
**393×727**, with America/Halifax browser timezone. The creation clock is fixed late
in the evening to make the selected-date regression deterministic without pausing
timers. Optional installed Firefox runs public entry/navigation/filter/theme smoke.

Assertions cover keyboard entry, theme, homepage and revision selection; visible
important controls; usable form/detail/history navigation; horizontal document
bounds; invalid-form feedback; and initialization loading/offline failure/retry.
The loading test holds the outgoing reset request, then continues it unchanged to
the real server. The failure test deliberately sets the browser offline, asserts
no stale cards, restores connectivity and retries successfully. It records and
asserts the one expected failed API request. No response bodies are mocked.

For successful core flows an automatic fixture fails on page errors, console errors,
HTTP >=400, GraphQL errors and failed requests (except obsolete navigation-cancelled
ERR_ABORTED requests). Failure screenshots/traces and diagnostic attachments are
retained. This is functional/keyboard smoke coverage, not a full accessibility audit
or pixel-perfect visual suite. Mobile revision Close was genuinely obstructed before
repair; no forced clicks or arbitrary sleeps hide the problem.

## 11. Actual Application Defects Discovered

| Defect and failing browser evidence | Smallest repair |
| --- | --- |
| Refresh performed another entry reset; restored history fell from six entries to five. | Persist successful demo initialization and deliberate inactive state in sessionStorage for this tab; reload reuses entry, explicit re-entry still resets. |
| Draft's Mark as Paid control was enabled (`toBeDisabled` failed). | Disable payment button unless status is pending; retain existing defensive handler/backend rules. |
| Selecting day 15 saved day 16 when the picker retained a late local time; actual GraphQL result differed from visible input. | Serialize local calendar dates and add payment terms as calendar days instead of converting to UTC and adding fixed milliseconds. |
| Mobile header/avatar intercepted Close revision history clicks until timeout. | Render the existing modal panel in a body portal above the fixed header; no content/layout redesign. |

Browser assertions were present and failed before each corresponding repair. The
new date/reload unit regressions complement the browser coverage. Two existing date
unit fixtures now construct local calendar Dates rather than UTC-midnight instants;
expected date assertions remain unchanged. No backend authorization/invariant change.

## 12. Repairs Made

- **TEST INFRASTRUCTURE:** type-only imports; replace live-Auth0 global setup,
  shared login state and obsolete Page Objects/spec graph; retirement of the stale `test:e2e:docker` alias, serial project config,
  diagnostic fixture, production-preview build, E2E typecheck and real UI helpers.
- **TEST DATA / ENVIRONMENT:** fresh PostgreSQL/migrations, existing canonical seed,
  explicit production backend flags, dynamic local ports, enabled/disabled bundles,
  correct existing fixtures, explicit installed-browser override, cleanup and docs.
- **ACTUAL APPLICATION DEFECT:** only the four repairs listed in section 11.

No new packages, lockfile churn, mocked backend responses or expected-failure skips.
The default frontend check remains independent of database/browser prerequisites.

## 13. E2E Test Isolation and Repeatability

The default gate contains 17 cases (eight scenarios on each Chromium viewport,
plus Demo-disabled); optional Firefox makes 18, with no E2E skips.
One worker and sequential projects are intentional: all anonymous visitors share
mutable demoId. Every ordinary scenario gets a fresh browser context and canonical
entry reset. Manual reset/re-entry are tested directly; generated invoice IDs come
from actual UI/backend flow. Each invocation owns fresh DB data and server ports.
No retries conceal contamination. The first extended run exhausted the existing
production 100-requests-per-IP allowance cumulatively across scenarios (HTTP 429).
The visitor fixture now supplies a deterministic distinct private proxy address per
test through the backend’s existing one-hop trust configuration. Each scenario
still exercises the real limiter and stays within its own allowance; backend rate
policy is unchanged. This header is only an isolated test-environment fixture. Test filters are forwarded through the managed
runner; direct Playwright against arbitrary existing servers is not the documented
gate. Temporary servers/databases are cleaned on both failed and successful runs.

## 14. Auth0 Smoke-Test Requirements

**Real Auth0 browser login is not verified by this slice.** Default E2E no longer
requires TEST_LOGIN/TEST_PASSWORD, an Auth0 tenant or saved auth state. The normal
Auth0 integration and backend verified-JWT regression suites remain intact.

Before release, use a configured staging Auth0 tenant and dedicated test account:
configure domain/client/audience/scope, callback/logout URLs and web origins; boot
normal mode with Demo disabled; sign in through Universal Login; verify callback,
real token acquisition, subject-based user provisioning, owned invoice workflows,
reload/token refresh, logout and subsequent login. Verify with the actual deployed
origin/API and capture failures without storing credentials or tokens in artifacts.
Local RSA/JWKS backend tests are complementary, not evidence of Universal Login.

## 15. Frontend Quality-Gate Results

`npm run check`: **PASS**, app/Node types, ESLint, **115 passing tests / 2 existing
skips**, production build. `npm run build` separately: **PASS**.
`npm run typecheck:e2e`: **PASS**. Existing React act/mock diagnostics and Vite's
>500 kB chunk warning remain nonblocking; no console suppression or dependency
upgrade was added. Logs: `/tmp/slice5c-frontend-final.log`,
`/tmp/slice5c-frontend-build.log`, `/tmp/slice5c-e2e-types.log`.

## 16. Backend Regression Results

Disposable second database, committed migrations followed by unchanged backend
harnesses: **116/116 unit**, **158/158 integration** across 12/6 files, respectively.
Integration remains serial with 60-second setup-hook timeout. Existing old harness
`db push` calls remain confined to that disposable database; the browser database
is provisioned only through committed migrations and canonical seeding. Backend
build passes, and no backend source/schema/test was edited. Final repeated backend
logs are `/tmp/invoice-e2e-2ui3ZL/backend-{unit,integration}.log`; the first extended
run is retained under `/tmp/invoice-e2e-1pENRW/`.

## 17. Remaining Blockers

No core local browser blocker remains. Completed corrected run:
**18/18 pass**, zero failures, skips, retries or flaky results, in 114.7 seconds:
16 Chromium scenario/viewports, one Demo-disabled case and one Firefox smoke.
Report/JSON/logs: `/tmp/invoice-e2e-GYsXEZ/`. Its PostgreSQL data/socket directories
were removed after success. A second fresh-cluster run with the default gate and
backend safeguard also passed: **17/17 E2E**, **116/116 unit**, **158/158 integration**.
Its browser duration was 107.8 seconds, again with zero skips,
failures or flaky results. Logs/reports: `/tmp/invoice-e2e-2ui3ZL/`; both disposable
databases and all application servers were stopped and database/socket data removed.

Real Auth0/deployed-origin verification remains a separate release requirement.
Shared Demo visitor interference is intentional and not solved by sessionStorage.
Full accessibility/contrast remediation, mobile focus trapping and WebKit coverage
are outside this functional smoke slice. Historical deployment CI/Compose E2E
wiring remains a follow-up; the documented gate is ready to invoke in a suitably
provisioned local/CI environment.

## 18. Exact Verification Commands

Verified tooling: Linux Node **24.15.0**, PostgreSQL **16.13**, Prisma **6.2.1**,
Playwright **1.51.0**, installed Chromium **138.0.7204.15**, Firefox **139.0**.
No dependency/browser download was required for execution; this workspace lacked
Playwright's default Chromium revision, so the explicit installed binary was used.
Future developers should install the browser matching their locked Playwright.

```bash
# From repository root; select Linux Node when using WSL:
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH

# Frontend:
cd invoice-frontend
npm run typecheck:e2e
npm run check
npm run build

# Normal repeatable gate (after the one-time browser install):
# npx --no-install playwright install chromium
PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e

# Extended verification in this workspace:
PG_BIN=/usr/lib/postgresql/16/bin \
E2E_CHROMIUM_EXECUTABLE=/home/djblackett/.cache/ms-playwright/chromium-1178/chrome-linux/chrome \
E2E_FIREFOX_EXECUTABLE=/home/djblackett/.cache/ms-playwright/firefox-1487/firefox/firefox \
E2E_BACKEND_REGRESSION=true npm run test:e2e

# Completed corrected browser run (18 tests including Firefox):
PG_BIN=/usr/lib/postgresql/16/bin \
E2E_CHROMIUM_EXECUTABLE=/home/djblackett/.cache/ms-playwright/chromium-1178/chrome-linux/chrome \
E2E_FIREFOX_EXECUTABLE=/home/djblackett/.cache/ms-playwright/firefox-1487/firefox/firefox \
npm run test:e2e

# Fresh default Chromium gate plus backend safeguard (no optional Firefox):
PG_BIN=/usr/lib/postgresql/16/bin \
E2E_CHROMIUM_EXECUTABLE=/home/djblackett/.cache/ms-playwright/chromium-1178/chrome-linux/chrome \
E2E_BACKEND_REGRESSION=true npm run test:e2e
```

The optional regression flag runs these backend commands with the generated second
DATABASE_URL, NODE_ENV=test, DEMO_MODE=false and CERT_DIR=../certs/:

```bash
node node_modules/prisma/build/index.js migrate deploy
node node_modules/vitest/vitest.mjs run tests/unit --reporter=default
node node_modules/vitest/vitest.mjs run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
```

Prerequisites/install guidance and filtered-project examples are in
`invoice-frontend/README.md`. Native PostgreSQL tools must be on PATH or PG_BIN;
run initdb as a non-root user. Local socket/browser execution required sandbox
escalation here. No automatic approval rejection or external service was involved.

## 19. Files Changed and Commit Summary

Application files (all under `invoice-frontend/src/`):

- `features/shared/components/DemoModeProvider.tsx`
- `features/shared/components/buttons/MarkAsPaidButton.tsx`
- `features/shared/utils/utilityFunctions.ts`
- `features/revisions/components/RevisionHistoryPanel.tsx`
- `features/revisions/styles.ts`

Infrastructure/documentation/tests:

- `README.md`, `invoice-frontend/README.md`, this audit report.
- Frontend `package.json`, `playwright.config.ts`, new `tsconfig.e2e.json`.
- Replaced `qa/fixtures/base.ts`; new `qa/helpers/invoice.ts`,
  `qa/scripts/run-e2e.mjs`, `qa/vite.config.ts`, and
  `qa/tests/{demo,disabled,session}.spec.ts`.
- `tests/unit/demoSession.test.tsx`, `tests/unit/utils/utilityFunctions.test.ts`.
- Removed obsolete `global-setup.ts`, seven old QA specs, and the nine unused
  Page Object files (including the empty invoices-toolbar artifact).

Generated baseline HTML report was restored after initial reproduction; no new
browser report, screenshot, auth state, credentials or binary is committed.
Focused local commit: `test(e2e): stabilize browser workflows and Playwright`.
Final whitespace/staged checks pass. The completed gate and repeated extended
verification both exited 0 and cleaned up their services. Final commit hash and
clean working-tree status are reported in the completion response.
