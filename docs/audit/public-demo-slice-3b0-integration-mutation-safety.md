# Public Demo Reliability — Slice 3B.0: integration and mutation safety

Implemented locally on 27 October 2026 (America/Halifax). **Temporary-session
mutations remain denied.** Session allocation is still off by default, the shared
public demo is unchanged, and no new route, resolver or subscription calls the
coordinated write path. No hosted database, production credentials, deployment
settings or frontend source changed. Nothing was pushed or deployed.

## 1. Branch and integration state

| Item | Value |
| --- | --- |
| Starting point | `fix/toast-dashboard-presentation` at `350df91` (Slice 3A), in sync with `origin`; Slice 2 baseline `1419855`; working tree clean |
| `origin/main` after fetch | `9652e30` (PR #110, address-cleanup hotfix), unchanged since the review |
| Merge-base before integration | `f106315`; `ddc6434` was **not** an ancestor (review finding D1 reconfirmed) |
| Integration branch | `public-demo/slice-3b0-integration` (local only; `feature/...` was unavailable because a local branch named `feature` exists) |
| Merge commit | `b11a329` = merge of `350df91` and `9652e30`, with the conflict resolution described below; `ddc6434` is now an ancestor |
| Slice 3B.0 changes | Uncommitted in the working tree on top of `b11a329`, for review |

The merged tree passed typecheck, lint, 195 unit and **203/203** integration tests
before any Slice 3B.0 change. That matches the review's simulated merge (203). The
difference is that this tree compiles.

## 2. Merge conflicts and resolutions

| Path | Kind | Resolution |
| --- | --- | --- |
| `.gitignore` | Textual conflict (the only one) | Took main's anchored `/portfolio-export/`. The only folder of that name is at the repository root, so the anchored rule ignores exactly the same paths as the branch's `portfolio-export/*`. |
| `prismaInvoiceRepository.ts` `delete()` | **Clean auto-merge that does not compile** | Git applied `ddc6434` verbatim: `this.prisma.$transaction(…, Serializable)`. Since 3A, `this.prisma` is a `DbClient` (`Prisma.TransactionClient`), so `tsc` failed with TS2339. Rewritten as described in D1 below. |
| `database.connection.ts`, `prisma.database.connection.ts`, unit-test double | Supporting change | `RepositoryDatabase.atomic(work, options?)` takes an optional `isolationLevel`, which only the root connection passes to `$transaction`. A scoped connection joins the owner's transaction, and its level cannot change. |

**Process note.** After I staged the `.gitignore` resolution, a merge commit
(`459d8d5`, default message) was created outside my commands, most likely by the
editor's Source Control integration. It recorded the non-compiling auto-merged
`delete()`. Neither that commit nor the follow-up fix had been pushed. I folded
them into one merge commit, `b11a329`, with the same two parents and the
validated tree, so no commit in the branch's history fails `tsc`. The original
commits remain in the reflog.

## 3. Review findings: changes and evidence

All tests use disposable local PostgreSQL 16 (`America/Halifax` server time zone,
loopback only). New harness tests are in
`tests/integration/demoSessionWrites.test.ts` (block *Slice 3B.0 mutation
safety*), and the transport test is in `tests/integration/demoSessions.test.ts`.
"Red" means the test failed on the unfixed code. An "injected defect" means one
fix was reverted temporarily and the targeted tests were re-run; each file was
then restored byte-for-byte.

### D1 (High): address cleanup missing, and an auto-merge that does not compile

**Change.** `PrismaInvoiceRepository.delete` now runs through
`databaseConnection.atomic(…, { isolationLevel: Serializable })`:

- **At the root**, ordinary users keep main's exact semantics: one Serializable
  transaction that deletes the invoice and then deletes each captured address
  only if `Invoice: { is: null }`.
- **Inside a transaction scope**, the unit joins the coordinator's READ COMMITTED
  transaction.
- **Before each guarded delete**, the captured address row is locked with
  `SELECT … FOR UPDATE`.

**Concurrency under READ COMMITTED.** The address foreign keys are `@unique`. Until
the deleting transaction ends, its deleted invoice row still occupies the unique
index entry, so any concurrent attempt to attach a captured address waits. After
the deleting transaction commits, the attempt fails its FK check, because the
address is gone. The row lock makes the reference guard sound even without
relying on `@unique`, since an attacher needs `KEY SHARE` on the address.

Injected-defect check M2 (row lock removed) was **not** detected: the `@unique`
constraint already forces the wait, so no test can distinguish the lock under the
real constraints. It is defence in depth, and the code comment says so.

**Evidence.**

| Test | Proves |
| --- | --- |
| deletes a workspace invoice with both addresses, items and revisions, preserving other users' rows | Scope delete leaves zero orphans; another user's invoice, items, addresses and revisions are byte-equal; usage +1 |
| leaves no orphan addresses after repeated create/delete cycles | Five create→delete cycles: address counts return to baseline each time; zero orphans; mutation count 10 |
| rolls back the invoice, cascades, first address cleanup and usage when the second cleanup fails | `BEFORE DELETE` trigger on `SenderAddress`: the complete database snapshot is unchanged |
| makes a concurrent attachment of a captured address wait, then fail, without touching its invoice | A second connection's `UPDATE … SET clientAddressId = captured` becomes a lock waiter, then fails with an FK violation; the target invoice is unchanged |
| keeps captured addresses that the same transaction re-attaches before the reference check | Main's trigger scenario, run in a READ COMMITTED scope: the guard keeps the re-attached rows |
| main's `invoiceInvariants.test.ts` (29), `authorization.test.ts`, `demoMode.test.ts` | Ordinary-user deletion (USER and ADMIN), cross-user denial, optional relations, rollback, Demo reset cycles: all pass on the merged code |

Injected defect M1 (client address cleanup disabled): three D1 tests fail.

### D2 (Low): report accuracy

The Slice 3A report says invoice deletion orphaning addresses is "pre-existing for
all users". That is incorrect: the fix was on `origin/main` (PR #110) and absent
only from the feature branch. After this merge, single-invoice deletion cleans up
addresses for every user, including inside scopes. Main's documented exceptions
are unchanged: bulk `deleteAllInvoices`/`deleteInvoicesByUserId`, user deletion,
and `/test-setup`.

### D3 (Medium): swallowed revision failures

**Change.** A new DI marker, `TYPES.TransactionScope`, is bound to `true` only by
`createTransactionScope`. `InvoiceService` injects it as `revisionsRequired`
(optional, default `false`). In `addInvoice` and `updateInvoice`, the existing
best-effort `catch` now rethrows when the marker is set. The service's outer
handler turns the error into `InternalServerException`, and the coordinator
rolls the whole transaction back. `markAsPaid` and `restoreRevision` already
propagate. Ordinary requests outside a scope keep best-effort recording; the
existing characterization test still passes unchanged.

**Evidence.** *propagates a non-database revision failure from addInvoice and
updateInvoice, committing neither the change nor usage*:

- **Setup.** The scope's `InvoiceRevisionService` is replaced by one whose
  `recordIfChanged` rejects with a plain `Error`. The real `InvoiceService` runs
  inside `runDemoSessionWrite`.
- **Failure case.** Both calls reject, and the complete database snapshot,
  including `mutationCount`, is unchanged.
- **Control case.** The same calls with the real revision service commit, with
  revisions recorded (6 and 1) and `mutationCount` 2.
- **Red.** On the unfixed code, the edit committed without a revision ("promise
  resolved instead of rejecting"). Injected defect M4 (rethrow removed) fails the
  test.

**Test seam (test file only).** The service-level read-only guard denies every
temporary-session mutation. To run the real service sequence inside the
coordinator, the write-path suite wraps `requireDemoMutationAllowed` with a
`vi.mock` passthrough. Only tests that set `guard.lifted = true` disable it, and
`beforeEach` resets it. All other tests, including *keeps the ordinary guarded
services read-only inside the coordinator*, and every other suite run the real
guard. No production code has a bypass.

### D4 (Medium): oversized input does full work before rejection

**Change.** There is a new, pure entry point,
`runDemoInvoiceWrite(prisma, parent, user, request, work)` in `demoSessionWrite.ts`.
Before it opens any transaction or takes any lock, it does three things:

- `assertDemoRecordId` bounds `invoiceId` and `revisionId`: at most 64 characters,
  `[A-Za-z0-9-]`.
- `prepareDemoInvoiceInput` (in `demoWorkspaceQuota.ts`) **rebuilds** the invoice
  from an allowlist:
  - text fields must be strings within `DEMO_TEXT_LIMITS` (via the existing
    `assertDemoInvoiceText`);
  - `paymentTerms` must be an integer from 0 to 365;
  - `items` must be a list of at most 20;
  - each item's `price` must be finite, from 0 to 1,000,000;
  - each item's `quantity` must be an integer from 0 to 10,000;
  - an item `id` must be absent, empty, or UUID-shaped.
- Totals and ownership fields are dropped; the service recomputes totals.

The numeric bounds are **provisional** (`DEMO_INPUT_LIMITS`). Error messages name
only the field (for example `items.0.id is invalid`) and never echo a value or
consult the database.

**Transports.**

| Transport | Before | After |
| --- | --- | --- |
| HTTP | `express.json()` default (100 KB) | Same bound, now explicit as `MAX_REQUEST_BYTES` (102,400 bytes) |
| WebSocket | `ws` default `maxPayload` of **100 MiB** | `maxPayload: MAX_REQUEST_BYTES`; a larger frame closes the socket with 1009 before graphql-ws parses it or any context is built. This applies to all users; the frontend sends only small subscription messages over WebSocket. |
| WebSocket mutations by temporary sessions | Denied only by the read-only guard | Also denied by a **separate**, permanent rule, `requireHttpForDemoMutation`, with its own message ("cannot mutate over WebSocket"). It runs first in the resolver wrapper, keyed on the server-set `connection`. Lifting the read-only guard in 3B therefore cannot open a second write transport. Ordinary users keep WebSocket mutations. |

**Evidence.**

- *rejects oversized or malformed input before taking the session lock or touching
  the database.* Another connection holds the session row lock throughout. All 17
  malformed requests (21 items, each text and address bound, NaN/negative/huge
  price, fractional/negative/huge quantity, huge `paymentTerms`, a non-UUID or
  10 KB item ID, non-text field, non-list items, a 10 KB `invoiceId` or
  `revisionId`) reject with `ValidationException`. `prisma.$transaction` is never
  called, no lock waiter appears, `work` never runs, and the database snapshot is
  unchanged.
- *denies temporary-session mutations over WebSocket as a separate rule, and
  bounds request size on both transports before any database work*
  (`demoSessions.test.ts`, the production `ws` + `graphql-ws` + `createContext`
  wiring):
  - every mutation resolver throws the WebSocket message for a WebSocket context;
  - a real-socket `markAsPaid` returns `FORBIDDEN` with that message;
  - an ordinary signed user's WebSocket `editInvoice` still succeeds;
  - a 90 KB frame completes, while a 150 KB frame closes with **1009**;
  - a 150 KB HTTP body is rejected without data;
  - the database snapshot is unchanged.
- Unit tests (`demoWorkspaceQuota.test.ts`, +20): exact allowlist output, every
  numeric/list bound accepted at the limit and rejected one beyond, 15
  malformed-input cases, error messages that omit the value, record-ID bounds, and
  the transport policy.
- Injected defects: M7 (no `maxPayload`) and M8 (no WebSocket rule) each fail the
  transport test.

The HTTP oversize response is **500**, not 413. `serverErrorConfig` maps
body-parser's `PayloadTooLargeError` (not a `BaseException`) to 500. The request
is still rejected before context creation. This is existing behaviour for all
users, left unchanged here (see section 4).

### D5 (Medium): client-supplied IDs act as an existence oracle

**Change.** Two layers:

1. `prepareDemoInvoiceInput` drops any invoice `id`.
2. In a scope (`TYPES.TransactionScope`), `PrismaInvoiceRepository` ignores a
   client invoice ID on `create` and an unknown item ID on `update`. An unknown
   item ID becomes a new item with a server-generated ID instead of
   `create({ id: client })`. An item ID that belongs to the visitor's own invoice
   is still updated in place, so revision diffs stay stable.

Outside a scope, ordinary users keep their existing explicit-ID behaviour.

**Evidence.** *never lets client IDs collide with, or reveal, another user's
invoice or item*:

- **Collision probes.** Another user owns invoice `OR0001` and its items. A direct
  repository `create` with `id: "OR0001"` (bypassing preparation) and a
  service-path create through `runDemoInvoiceWrite` both succeed with
  `XX0000-<uuid>` IDs.
- **Foreign item ID.** An edit carrying that user's item ID behaves exactly like
  an unused random UUID: it succeeds with a new, different item ID.
- **Own item ID.** The visitor's own item keeps its ID.
- **Isolation.** The other user's rows are byte-equal, and `mutationCount` is 5.
- **Red.** On the unfixed code, the duplicate ID reached the unique constraint.
- **Injected defects.** M9 (client invoice ID honoured) and M10 (client item ID
  honoured) each fail the test.

### D6 (Low): generated-ID collisions inside a transaction

Resolved by the D5 change. A scoped create uses `generateInvoiceId()` followed by
`-<randomUUID()>`, the same shape as the Slice 2 canonical copies. It cannot
collide, so the P2002 retry (which cannot recover inside a transaction) never
runs there, and the six-character display prefix is preserved. Ordinary users
keep the six-character ID and its retry.

### D7 (Low): `UserService` could escape the transaction

**Change.** `createTransactionScope` now binds `TYPES.UserService` locally, so it
resolves the scoped `IUserRepo` and the scoped identity. The request container
rebinds `UserService` to a closure over its own repository, which is
root-client-bound. Without the local binding, a scope built on a request
container inherited that closure.

**Evidence.** *resolves UserService against the transaction even when the parent is
a request container*:

- **Setup.** The parent is a real `createContext` HTTP container for a
  temporary-session credential.
- **Check.** Inside the write, the transaction renames the user without
  committing. `UserService.getUserByIdSafely` then returns the uncommitted name,
  which only the transaction itself can see.
- **Red.** On the unfixed code it returned the committed `Demo visitor`.
- **Injected defect.** M5 (binding removed) fails the test.

### D8 (Low): untested post-lock feature-flag check

**Evidence.** *rechecks the feature flag after acquiring the session lock*:

- another connection holds the session row lock, and a write queues behind it;
- `DEMO_SESSIONS_ENABLED` is turned off while the write waits;
- the lock is released, and the write fails with `DISABLED`;
- `work` never runs, and `mutationCount` stays 0.

Injected defect M3 (the post-lock check removed) fails the test. The 3A review's
equivalent mutation passed every test.

### Bounded lock wait (review §4.5)

**Change.** The coordinator's first statement is
`SET LOCAL lock_timeout = '2000ms'` (`DEMO_WRITE_LOCK_WAIT_MS`). It is
transaction-scoped and reset at commit or rollback. A timeout on the session row
lock (PostgreSQL 55P03, surfaced by Prisma as P2010) becomes
`DemoSessionWriteError("SESSION_BUSY")`. A later row-lock timeout inside `work`
fails generically and rolls back.

The worst-case hold for one request is now `maxWait` (5 s, waiting for a pooled
connection), then at most 2 s per lock wait, all within the 10 s transaction
timeout.

**Evidence.** *bounds same-session lock waits so a burst cannot hold a small
connection pool*:

- **Setup.** A client with `connection_limit=2`. One write holds the session lock.
- **Burst.** Four more same-session writes all fail with `SESSION_BUSY`, and none
  runs `work`.
- **Pool health.** A *different* session's write on the same 2-connection pool
  then succeeds while the lock is still held. Only the holder's write is counted.
- **Red.** On the unfixed code, two writes hung until the holder's 10 s timeout
  and two failed with pool timeout P2028.
- **Injected defect.** M6 (no `lock_timeout`) fails the test.

### Identity and authorization markers

These remain server-controlled. The scope's identity still comes from the locked
`DemoSession` row. `TYPES.TransactionScope` is a DI binding that only
`createTransactionScope` creates; no request data can set it. The WebSocket rule
keys on `connection`, which only the server's graphql-ws context sets.

## 4. Remaining risks and deferred work

- **Mutations are still denied by design.** Section 6 lists what 3B must change.
- **The HTTP oversize status is 500.** Mapping body-parser errors to their
  `status` (413) in `serverErrorConfig` is a one-line change, but it alters status
  codes for all users. It is deferred to 3B, where the frontend lifecycle will
  need a stable code.
- **`lock_timeout` covers the whole coordinated transaction**, not just the
  session lock. A write that waits more than 2 s for a workspace row held by an
  administrator's bulk operation rolls back with a generic error. Nothing partial
  commits.
- **Rejected attempts are still free.** Validation errors, `SESSION_BUSY` and
  quota rejections consume no budget. Request throttling (the per-IP and
  production limiters) remains the only bound. There is still no FIFO fairness
  among same-session waiters.
- **Pool sizing.** The 2 s wait and the 5 s `maxWait` should be checked against
  the hosted pool size before rollout (provisional values).
- **The address row lock is defence in depth.** No test can distinguish it while
  the `@unique` constraints exist (M2).
- **Main's documented address-cleanup exceptions remain** (bulk deletes, user
  deletion, `/test-setup`). There is deliberately no global orphan sweep.
- **The policy values are provisional:** the numeric input bounds, the text
  bounds, the lock wait, the mutation budget and the reset policy.
- **Privileged SQL, or code that bypasses the coordinator,** can still violate the
  application-level limits.
- **Not in this slice:** browser-session UX, temporary reset, automatic cleanup
  scheduling and public enablement.

## 5. Validation

| Gate | Result |
| --- | --- |
| Backend `npm run check` (typecheck, lint with zero warnings, unit, build) | Passed; **215 unit** tests across 15 files (195 existing + 20 new) |
| Backend integration, full merged suite | **215/215** across 8 files: 203 merged (including main's address-integrity tests), 11 new write-path tests, 1 new transport test |
| Changed test files under `tsc` (normally excluded) | No new type errors relative to the merge baseline (18 pre-existing NodeNext/dynamic-import diagnostics in untouched lines) |
| Frontend `npm run check` and `typecheck:e2e` (source unchanged) | Passed: 119 passed, 2 skipped (same as the 3A baseline) |
| Browser regression (isolated runner, Chromium) | **35/35 passed** (5.3 min; report `/tmp/invoice-e2e-b8FriI/playwright-report/index.html`) |
| Injected-defect checks | M1, M3–M10 detected; M2 not detectable (see D1) |
| Stability | Both session suites together, 5 consecutive runs: 46/46 each time |
| `git diff --check` | Passed |

Environment: Node 24.15.0, PostgreSQL 16 at `/usr/lib/postgresql/16/bin`, server
time zone `America/Halifax`, loopback only. Logs are temporary local files, not
repository dependencies, in
`/tmp/claude-1000/-home-djblackett-dev-invoice-web-app/87b9b619-cc75-48d3-b327-f7cf4df9ea3c/scratchpad/`
(`merge-integration.log`, `red.log`, `final-integration.log`, `backend-check.log`,
`frontend-check.log`, `e2e.log`).

**Files changed after the merge commit:** `src/config/server.config.ts`,
`src/server.ts`, `src/constants/identifiers.ts`, `src/database/transactionScope.ts`,
`src/repositories/implementations/prismaInvoiceRepository.ts`,
`src/resolvers/index.ts`, `src/services/demoSessionPolicy.ts`,
`src/services/demoSessionWrite.ts`, `src/services/demoWorkspaceQuota.ts`,
`src/services/invoice.service.ts`, three test files, and this report. There is no
schema, migration, GraphQL type, dependency or frontend change.

## 6. Exact changes still required to enable bounded create, edit, pay, restore and delete

1. **Admission capability.** Replace the blanket service guard for temporary
   sessions with one that passes only inside a coordinator scope. For example,
   `requireDemoMutationAllowed(user, inCoordinatedScope)`, fed by the existing
   `TYPES.TransactionScope` injection that `InvoiceService` and
   `InvoiceRevisionService` would both receive. Never use a field on the user
   object.
2. **Resolver wiring (HTTP only).** In the resolver wrapper, keep
   `requireHttpForDemoMutation` first. For a temporary session, route exactly
   these five mutations through `runDemoInvoiceWrite(prisma, rootContainer, user,
   request, work)` and deny every other mutation as now:

   | Mutation | Request | Work |
   | --- | --- | --- |
   | `addInvoice` | `{ invoice: args }` | `InvoiceService.addInvoice(prepared.invoice)` |
   | `editInvoice` | `{ invoiceId: args.id, invoice: rest }` | `updateInvoice` |
   | `markAsPaid` | `{ invoiceId }` | `markAsPaid` |
   | `removeInvoice` | `{ invoiceId }` | `deleteInvoice` |
   | `restoreInvoiceRevision` | `{ invoiceId, revisionId }` | `restoreRevision` |

   Permanently denied: `resetDemoData`, `deleteAllInvoices`,
   `deleteInvoicesByUserId`, `createUser`, `deleteUsers`, `deleteUsersKeepAdmins`
   and `login`.
3. **Subscriptions.** `addInvoice` currently publishes `INVOICE_ADDED` from the
   resolver. For temporary sessions, never publish to the admin feed. If a feed is
   ever added, publish only after commit.
4. **Error mapping.** Map these to stable GraphQL codes:
   - `DemoSessionWriteError` codes: `SESSION_INVALID` → unauthenticated;
     `SESSION_BUSY` → retryable; `MUTATION_BUDGET` and `WORKSPACE_QUOTA` → quota;
     `DISABLED` → forbidden;
   - `ValidationException` → bad input;
   - HTTP body-parser errors → 413.

   Foreign and missing IDs must keep returning the identical `NOT_FOUND`.
5. **Status values.** `status` is only length-bounded. Restrict it to
   `draft`/`pending`/`paid` in `prepareDemoInvoiceInput`, or confirm the service's
   handling, before enabling edits.
6. **End-to-end tests through the real HTTP transport.** Cover each enabled
   mutation, same-session races, `SESSION_BUSY`, rollback on revision failure,
   quota and budget exhaustion, revocation and expiry while queued, cleanup
   interaction, foreign-ID probes, oversized bodies, and continued WebSocket
   denial. Re-run the all-mutations denial test for every non-enabled path, plus
   the ordinary-user regression.
7. **Rollout decisions (separate from 3B code).** Validate the provisional
   numeric, text, budget and lock-wait values against the hosted plan and pool
   size. Deploy the two additive migrations. Decide on cleanup scheduling and the
   temporary reset (`kind: "reset"`, shared canonical seeding, address cleanup).
