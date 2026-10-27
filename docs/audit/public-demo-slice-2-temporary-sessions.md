# Public Demo Reliability — Slice 2: temporary session foundation

Implemented locally on 26 October 2026 (America/Halifax). The new system is disabled
by default. No hosted database, production credentials, deployment settings,
portfolio screenshots, frontend source, commits, pushes, or deployments changed.

## Acceptance and scope

Two visitors can obtain independent credentials, authenticate through the existing
HTTP or WebSocket GraphQL context, and read separate copies of the seven canonical
invoices and eleven revisions, including their respective RT3080 histories.
Existing invoice/revision ownership checks reject foreign invoice, revision, diff,
and user reads. Temporary identities cannot run mutations or subscribe to the
admin-only invoice feed. The old shared demo remains available under its existing
flag and token; the frontend does not call the new endpoint.

Before implementation, inspected the Slice 1 commit/report, Demo Mode stabilization
and adversarial review, user API security policy, Prisma schema/migrations, context,
ownership helpers, reset implementation, and browser configuration. The checkout
started clean at `72152f2`; `.gitignore` had no local diff and remains untouched.
The Phase 1 limit details were supplied by the user during implementation.

## Exact files changed

| File | Change |
| --- | --- |
| `invoice-backend/.env.example` | Explicit `DEMO_SESSIONS_ENABLED=false` example. |
| `invoice-backend/prisma/schema.prisma` | Add session relation and two models. |
| `invoice-backend/prisma/migrations/20261026000000_add_demo_sessions/migration.sql` | Add tables, indexes, constraints, and allocation singleton. |
| `invoice-backend/src/services/demoSession.service.ts` | Atomic allocation, authentication lookup, bounded cleanup, capacity and durable issuance budget. |
| `invoice-backend/src/services/demoSessionPolicy.ts` | Feature flag, reserved identity namespaces, temporary mutation guard. |
| `invoice-backend/src/routes/demoSession.ts` | Narrow HTTP bootstrap handler. |
| `invoice-backend/src/app.ts` | Mount bootstrap handler and secondary per-IP limiter. |
| `invoice-backend/src/GraphQL/createContext.ts` | Resolve session credentials before test fallback; reject reserved Auth0 subjects; preserve server-issued session marker. |
| `invoice-backend/src/constants/types.ts` | Internal optional `demoSessionId` context marker. |
| `invoice-backend/src/resolvers/index.ts` | Apply temporary read-only policy to all GraphQL mutations. |
| `invoice-backend/src/services/invoice.service.ts` | Guard each mutation before any work. |
| `invoice-backend/src/services/invoiceRevision.service.ts` | Guard revision recording. |
| `invoice-backend/src/services/user.service.ts` | Reserve demo identities, deny temporary provisioning/user administration. |
| `invoice-backend/tests/integration/demoSessions.test.ts` | Disposable PostgreSQL, production context, signed local Auth0/JWKS, HTTP bootstrap, isolation, concurrency, and failure tests. |
| `invoice-backend/tests/integration/demoMode.test.ts` | Strengthen existing signed-demoId regression to require authentication rejection; keep reset denial and unchanged-state assertions. |
| `docs/audit/public-demo-slice-2-temporary-sessions.md` | This report. |

## Schema and migration

`DemoSession` links exactly one unique user to one unique SHA-256 credential hash,
with a generated session ID, creation time, absolute expiry, and optional revocation
time. Expiry is indexed. New timestamp columns are `TIMESTAMPTZ(3)`, including the
allocation clock, so comparisons do not depend on the database session timezone.
SQL checks constrain the user ID to `demo-session:...`, the hash to 64 lowercase
hexadecimal characters, and expiry to creation plus exactly 24 hours.

`DemoAllocationState` is one durable token-bucket row, constrained to key 1 and
between zero and ten tokens. The migration initializes it with ten tokens. Its
state is not deleted or replenished by cleanup.

The migration is additive; it does not rewrite existing users, invoices, addresses,
items, or history. It follows the existing checked-in SQL/Prisma migrate-deploy
strategy, with no dependency or GraphQL schema/codegen changes. The session-to-user
foreign key uses `RESTRICT`: an administrator cannot bulk-delete linked temporary
users through the old user API. Cleanup must remove the session link deliberately
inside its transaction. This protects ownership linkage; ordinary user login and
invoice authorization are unchanged. Deploying this migration is a later action.

## Creation and authentication

1. Only the exact environment value `DEMO_SESSIONS_ENABLED=true` enables allocation
   and session authentication, in every environment including production. Neither
   `DEMO_MODE=true` nor a test environment enables it implicitly.
2. `POST /demo/sessions` accepts an empty JSON object and no query parameters. It
   accepts no user ID, role, profile, TTL, or registration input. Disabled requests
   return 404 with `DEMO_SESSIONS_DISABLED`. Success returns 201 with only
   `{ credential, expiresAt }` and `Cache-Control: no-store`. Invalid input returns
   400, budget exhaustion 429, capacity exhaustion 503, and unexpected allocation
   failures a generic 503. The existing CORS allowlist and body parser remain in
   effect; no registration API or cookies were added.
3. The server generates 32 random bytes using Node crypto and encodes the bearer
   credential as `demo-session-v1.<64 hex characters>`. Only its SHA-256 hash is
   persisted. The raw credential is returned once and is not logged by the handler.
4. One interactive PostgreSQL transaction takes advisory transaction lock 8372402,
   checks capacity and the durable budget, creates a reserved UUID user with role
   USER, creates the session, and inserts all canonical invoices/items/addresses/
   revisions. Any failure rolls back all these rows and the budget debit. The clock
   is read from PostgreSQL after acquiring the lock. Isolation is explicitly READ
   COMMITTED, so each allocation counts earlier committed allocations after waiting.
5. Subsequent HTTP or WebSocket operations use `Authorization: Bearer <credential>`.
   The session branch runs before the legacy test/CI administrator shortcut. A
   parameterized hash lookup joins the linked user and requires non-revocation and
   expiry strictly after PostgreSQL's current time. Invalid formats, unknown hashes,
   expiry, revocation, and a disabled feature fail authentication. Database failures
   propagate to the fail-closed context handler; they never enter the test fallback.
6. The bound service identity and returned context force USER and carry server-only
   `isDemo`/`demoSessionId` markers, even if the stored user role is ADMIN. JWT claims
   cannot supply these markers. Auth0 subjects equal to `demoId` or beginning with
   `demo-session:` are rejected. Missing temporary users are never self-provisioned.

No second authorization system was introduced. Existing `createdById` ownership,
`getAuthorizedInvoice`, and revision-parent checks still decide record access.
A generic resolver guard blocks every temporary GraphQL mutation with FORBIDDEN;
service guards also reject direct invoice writes, revision recording, and user
provisioning/administration. The existing shared-demo reset guard denies temporary
users. No temporary mutation path is enabled, including create/edit/delete/pay/
restore/reset and bulk/user operations.

## Canonical data and frontend implications

Every allocation calls the existing Slice 1 canonical fixture builder. Invoice IDs
are `<visible-number>-<random UUID>`, for example `RT3080-...`. Items and revisions
receive random UUIDs. One per-invoice item-ID mapping spans the current state and
all snapshots, including any items present only in history. Foreign workspaces
share no invoice, revision, or item IDs. Ownership never depends on parsing an ID.
Canonical dates, contacts, amounts, states, history messages, revision numbers,
and historical timestamps are retained.

The existing cards/detail/edit headings use `id.substring(0, 6)`, so these IDs retain
the familiar displayed number. Routes and GraphQL queries must retain the complete
ID; `/invoices/RT3080` cannot identify a temporary visitor's copy. Apollo's default
ID normalization can distinguish the copies, but the later frontend lifecycle must
clear/recreate cached lists and objects when entering, exiting, replacing, or
expiring a session. It must persist and attach the issued credential to HTTP and WS,
reconnect WS when credentials change, handle expiry/capacity/budget failures, and
stop running the old shared reset on temporary entry. Any remaining full-ID labels
need a display audit. No frontend lifecycle was implemented here.

## Implemented bounds and cleanup

| Policy | Guarantee and status |
| --- | --- |
| Lifetime | 24 absolute hours from allocation, checked at each authenticated operation; reads never extend it. An already admitted in-flight read is not cancelled at its expiry boundary. |
| Retained capacity | At most 100 session-linked workspaces through the allocator, including expired and revoked rows. Count/check/insert share the transaction lock across processes. |
| Durable issuance | Provisional burst of 10 successful allocations; refill one token per 60 seconds, maximum 10. Allows concurrent legitimate visitors. In any interval of T minutes, at most approximately `10 + T` successes; retained capacity can impose a lower ceiling. |
| Per-IP admission | Provisional five bootstrap requests per 10 minutes per application process. Invalid attempts count. Disabled requests skip this limiter. The existing production-wide limiter still also applies. |
| Cleanup | Explicit internal `cleanupExpiredDemoSessions(prisma)` primitive, at most ten expired sessions per call. No public route, scheduled worker, or automatic cleanup on allocation. Revocation alone does not make an unexpired session eligible. |
| Mutation growth | Temporary identities cannot mutate at all. The canonical initial shape is seven invoices and eleven revisions. Slice 3 quotas are not yet implemented. |

The hard capacity is from the investigation. The burst/refill/per-IP numbers are
new provisional policy choices, not original Phase 1 numbers. Ten burst slots avoid
serially rejecting ordinary simultaneous visitors; one refill per minute limits
sustained database creation. A secondary per-IP limiter reduces casual abuse, while
the database budget and cap provide protection across instances and restarts.

Cleanup uses the same lock as allocation. It selects explicit expired session
links, verifies the reserved identity, captures only that owner's address IDs,
deletes that owner's invoices (cascading items/history), deletes only captured
addresses that are now unreferenced, then removes the session and user. Unlinked
users, shared demo data, live sessions, foreign records, and unrelated orphan
addresses are preserved. It refuses an inconsistent user linked as author to a
foreign invoice's revision, avoiding a foreign `SET NULL` side effect. A late
failure rolls the entire batch back, including capacity. No wildcard/prefix-only
user deletion is used.

## Validation

All runtime validation used the existing isolated E2E runner's fresh PostgreSQL 16
cluster and loopback servers under `/tmp`. It overwrites database targets and Auth0
configuration; signed authentication tests use a local RSA/JWKS server. Node was
24.15.0. No production Neon connection was made.

- Backend typecheck and lint: passed.
- Backend build: passed in the isolated runner.
- Backend unit regression: 191 passed across 14 files.
- Full backend integration run: 174 passed across seven files (160 existing plus
  the initial 14 new cases). After adding late cleanup-failure coverage and the
  database-verification-failure assertion, the final session suite separately
  passed all 15 cases. Combined coverage is 160 existing plus 15 new cases.
- Browser regression: all 35 Chromium cases passed (desktop, mobile, disabled-mode,
  loading, and toast coverage), with no failures or skips. Both demo-enabled and
  demo-disabled frontend bundles built successfully in the runner.
- Whitespace diff check: passed.

New coverage includes simultaneous independent allocations; exact canonical current
and snapshot business content; disjoint internal IDs; both RT3080 copies through
HTTP/WS contexts; foreign user/invoice/revision/list/diff denial; persisted ADMIN
role tampering; signed Auth0 reserved-subject impersonation; real USER and ADMIN
authorization and self-provisioning; unknown/malformed/expired/revoked/disabled
credentials; no sliding expiry; all GraphQL and service mutation guards; late
allocation rollback; concurrent allocation at capacity including expired/revoked
rows; durable burst/refill across independent Prisma clients; cleanup scope,
concurrent cleanup, allocation/cleanup coordination, bounded batches, foreign-author
refusal, late cleanup rollback; bootstrap input validation and HTTP per-IP limit;
and failed verification before the legacy test-admin shortcut.

The first run exposed a real expiration defect when a timezone-less Prisma
TIMESTAMP was compared with `clock_timestamp()` on a non-UTC database. Fixed the
new schema/migration to use TIMESTAMPTZ and retained the failing expiry test.
The only changed pre-existing security assertion strengthens the reserved Auth0
subject policy; its reset-denial and database-preservation checks remain intact.

Evidence: `/tmp/invoice-e2e-uU7mj3` (full runner) and
`/tmp/invoice-slice2-session-tests.log` (final 15 session cases). These are temporary
local logs, not repository dependencies.

## Browser count reconciliation

No coverage was accidentally removed. Slice 1 explicitly selected `demo.spec.ts`:
seven scenarios on desktop and mobile = 14 cases. The older 17-case gate was those
14 plus `session.spec.ts` once per viewport (2) and `disabled.spec.ts` (1).
The current default listing contains 35 cases: those 17 plus six loading cases and
twelve toast cases. The optional Firefox smoke is outside this count. All five
browser spec files and their project selections remain present and unchanged.

## Limits, risks, and Slice 3 prerequisites

The tested guarantees cover ordinary application paths using this allocator and
cleanup primitive. Privileged SQL or future code that bypasses the common lock can
violate the application-level capacity policy. The FK and SQL checks add integrity
protection, but they are not a database-wide capacity trigger.

The per-IP limiter is in memory and depends on the existing trusted-proxy setting;
it is secondary protection, not a durable per-IP quota. Before public rollout,
validate the actual ingress/proxy chain. A distributed attacker can consume the
bounded anonymous capacity and deny other visitors service. The hard cap protects
retained workspace growth; it does not promise fair availability or general DDoS
protection. A lost bootstrap response still consumes its committed workspace; it
expires normally. No idempotent retry protocol is implemented.

Cleanup is explicit and bounded, so capacity can remain exhausted until an operator
or later lifecycle invokes it. An inconsistent foreign-author link causes a batch
to fail closed and requires repair. Generic admin user deletion encountering a
linked demo user fails on RESTRICT; do not bypass that FK to reclaim workspaces.
Long lock queues or database errors fail allocation without partial initialization.
The old shared demo still has its known concurrent-visitor limitations.

Before enabling temporary mutations, Slice 3 must coordinate invoice, item, address,
revision, reset, cleanup and quota changes in transactions under a common per-session
coordination policy; revalidate expiry/revocation inside writes; implement the
investigation's 30-invoice, 200-total-revision, and 20-items-per-invoice bounds with
text/request limits; choose and enforce reset cooldown/lifetime allowances; and
persist a per-session mutation budget that reset cannot replenish. Test races,
rollback, cleanup interactions, and quota-exhaustion behavior before removing the
read-only guard. Neither quota completeness nor readiness for public rollout is
claimed by this slice.
