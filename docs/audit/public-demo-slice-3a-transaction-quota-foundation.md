# Public Demo Reliability — Slice 3A: transaction and quota foundation

Implemented locally on 27 October 2026 (America/Halifax). **Temporary-session
mutations remain disabled.** No hosted database, production credentials, deployment
settings, frontend source, commits, pushes, or deployments changed.

## Acceptance and scope

A single coordinated write path for one temporary session now exists as an internal
primitive, `runDemoSessionWrite`. It locks the session row, revalidates the session
after the lock, checks the persistent budget, runs the ordinary repositories and
services inside one transaction, measures workspace quotas from retained rows,
updates usage counters, and then commits or rolls back as one unit. No route,
resolver, or subscription calls it. The GraphQL mutation guard and every service
guard are unchanged and still deny every temporary-session mutation, including
inside the coordinator (tested). `DEMO_SESSIONS_ENABLED` remains off by default,
shared Demo Mode is unchanged, and the frontend does not call any new endpoint.

## 1. Baseline and the two P3 gaps

The checkout started clean on `fix/toast-dashboard-presentation` at `1419855`.
Slice 2 was already **committed** (not uncommitted, as the brief assumed), and the
repository contains no independent-review document for it. The two P3 gaps were
therefore taken from the brief. Before any change, the baseline was 191 unit and
**175 integration** tests passing on a fresh local PostgreSQL 16 cluster.

**Transactions that start internally (before this slice):**

| Site | Transaction |
| --- | --- |
| `PrismaInvoiceRepository.update` | own `$transaction` (item reconcile + invoice update) |
| `PrismaInvoiceRevisionRepository.create` | own `$transaction` (next number + insert) |
| `allocateDemoSession`, `cleanupExpiredDemoSessions` | own `$transaction`, advisory lock 8372402 |
| `resetDemoWorkspace` (shared demo, seed) | own `$transaction`, advisory lock 8372401 |

**Where invoice and revision writes are separate:** `InvoiceService.addInvoice`
and `updateInvoice` commit the invoice, then record the revision in a second
transaction and *swallow* its failure. `markAsPaid` and `restoreRevision` propagate
a revision failure, but only after the invoice change has already committed.
`recordIfChanged` performs its authorization read and latest-snapshot read outside
the revision insert's transaction.

**P3 gap 1 — exact list set.** The HTTP/WS-context isolation test compared only
`allInvoices` length (7). It now compares each session's sorted, complete returned
ID set with that session's invoices read directly from the database. This makes it
fail on any foreign, shared-demo, ordinary, missing, or substituted ID.

**P3 gap 2 — persistent real WebSocket.** A new test boots the production
`createServer()` wiring (`ws` + `graphql-ws` + `createContext`) on loopback. It keeps
**one** socket open (`lazy: false`, `retryAttempts: 0`, connection count asserted
to be 1) for each of two sessions:

1. The read returns the exact owned ID set, and `invoiceAdded` is denied with
   `FORBIDDEN` and delivers no payload.
2. The session is then revoked (first socket) or expired (second socket).
3. On the same socket with unchanged `connectionParams`, the read returns no data
   and errors, and the feed is still denied with no payload.

graphql-ws evaluates `context` per `subscribe` message, so credentials are
re-resolved for each operation. To confirm the test catches the real risk, the
server was temporarily mutated to cache the context per connection; the test then
failed (`expected [ …(7) ] to be null`), and `server.ts` was restored byte-for-byte.
After revocation the feed takes the existing unauthenticated path. Code inspection
shows that context carries no `pubsub`, so the resolver reports an internal error
rather than `FORBIDDEN`. The test therefore asserts denial and absence of payloads,
not a specific code.

## 2. Files changed

| File | Change |
| --- | --- |
| `invoice-backend/src/database/database.connection.ts` | `DbClient` type, `RepositoryDatabase` interface (`client`, `atomic`). |
| `invoice-backend/src/database/prisma.database.connection.ts` | Root `client`/`atomic` (atomic = `$transaction`); `TransactionDatabaseConnection` (atomic joins; root client throws). |
| `invoice-backend/src/database/transactionScope.ts` | **New.** `createTransactionScope(parent, tx, user)` DI child container. |
| `invoice-backend/src/repositories/implementations/prismaInvoiceRepository.ts` | Client from connection; `update` uses `atomic` (16 effective lines; rest is re-indentation). |
| `invoice-backend/src/repositories/implementations/prismaInvoiceRevisionRepository.ts` | Client from connection; `create` uses `atomic`. |
| `invoice-backend/src/repositories/implementations/prismaUserRepo.ts` | Client from connection (no transactions inside). |
| `invoice-backend/src/services/demoSessionWrite.ts` | **New.** Coordinator, lock order, `DemoSessionWriteError`. |
| `invoice-backend/src/services/demoWorkspaceQuota.ts` | **New.** Limits, usage measurement, text-bound validator. |
| `invoice-backend/src/services/demoSession.service.ts` | Cleanup row-locks selected sessions `FOR UPDATE SKIP LOCKED`. |
| `invoice-backend/prisma/schema.prisma` | Three `DemoSession` usage columns. |
| `invoice-backend/prisma/migrations/20261027000000_add_demo_session_usage/migration.sql` | **New.** Additive columns + structural check. |
| `invoice-backend/tests/integration/demoSessions.test.ts` | P3 gaps: exact ID sets; persistent real-transport WS test. |
| `invoice-backend/tests/integration/demoSessionWrites.test.ts` | **New.** 18 transaction/concurrency tests. |
| `invoice-backend/tests/unit/demoWorkspaceQuota.test.ts` | **New.** 4 pure-policy tests. |
| `invoice-backend/tests/unit/database.connection.mock.ts` | Test double gains `client`/`atomic`, mirroring the root connection. |
| `docs/audit/public-demo-slice-3a-transaction-quota-foundation.md` | This report. |

Not changed: resolvers, mutation guard (`requireDemoMutationAllowed`), services,
`createContext`, `server.ts`, `app.ts`, routes, GraphQL schema, frontend, `.env`
files, deployment configuration. Existing assertions were not relaxed. The only
edit to an existing assertion is the stricter exact-set comparison.

**Migration.** It adds `mutationCount INT NOT NULL DEFAULT 0`,
`resetCount INT NOT NULL DEFAULT 0`, and `lastResetAt TIMESTAMPTZ(3)` to
`DemoSession`, with the check `DemoSession_usage`: counts are non-negative, and
`resetCount = 0` exactly when `lastResetAt IS NULL`. Numeric limits are deliberately
**not** in SQL. `demoWorkspaceQuota.ts` is the single source, so the two layers
cannot disagree. The migration is additive and rewrites no data. Deploying it is a
later action.

## 3. Selected transaction architecture

**A unit of work as an Inversify child container bound to one interactive
transaction.** This was chosen because the existing design already resolves
per-request services from child containers (`createContext.setupContainer`), and
every repository already receives its database through one injected
`DatabaseConnection`. Swapping that one binding re-targets every repository,
`getAuthorizedInvoice`, and the ordinary `InvoiceService`/`InvoiceRevisionService`
graph at once, with no new parameters and no second business-logic implementation.

Alternatives were rejected:

- **Passing `tx` through every method** would change most repository and service
  signatures.
- **Ambient `AsyncLocalStorage`** is implicit, and any missed call site silently
  escapes to the root client.
- **A demo-only write service** would duplicate invoice logic.

Ordinary behaviour is preserved by construction. Outside a scope, `atomic(work)` is
exactly the previous `this.prisma.$transaction(work)`, with the same default options.

## 4. How the transaction client propagates

```text
prisma.$transaction(tx => …)                       (owned by the coordinator)
  createTransactionScope(rootContainer, tx, lockedIdentity)
    DatabaseConnection     -> TransactionDatabaseConnection(tx)
                              .client  = tx
                              .atomic  = work => work(tx)       JOIN, never nest
                              .getDatabase()/initConnection()   throw
    TYPES.PrismaClient     -> throws (root client unreachable)
    TYPES.UserContext      -> identity read from the LOCKED session row
    IInvoiceRepo, IInvoiceRevisionRepo, IUserRepo,
    InvoiceService, InvoiceRevisionService   -> rebound locally (no parent cache)
```

- **No mixing.** Every repository statement uses `tx`. Nothing in a scope can
  reach the root client: the binding throws, and `getDatabase()` throws. Even a
  parent-bound service resolved through the scope (`DemoService`) receives the
  transaction connection (tested). Prisma rejects any use of a scope after its
  transaction settles.
- **No escaping nested transactions.** The two repository-internal transactions
  join the outer one. In testing, an invoice update whose revision insert failed
  left no trace; when the scope binding was removed as a mutation check, 14 of 17
  tests failed.
- **Explicit boundary.** Only the coordinator (or a test harness) opens the
  transaction. There is no ambient state.

## 5. Session locking order

| Order | Lock | Taken by |
| --- | --- | --- |
| 1 | `pg_advisory_xact_lock(8372402)` (global) | allocation, cleanup — **never** writes |
| 2 | `DemoSession` row, `FOR UPDATE` | every coordinated write/reset; cleanup (`SKIP LOCKED`); revocation (`UPDATE`) conflicts with it |
| 3 | that workspace's invoice/item/address/revision rows | statements run inside the scope |

Writes take only lock 2 and then their own rows, so independent visitors never
serialize on each other: one session's write completed while another's was held
open. Cleanup takes 1 and then 2 with `SKIP LOCKED`, so it never waits on a write
while holding the global lock. A write can wait for cleanup, but never the reverse,
so there is no cycle. Allocation inserts new rows only.

Validity is read in a **separate statement after** the lock: revocation, expiry
(`expiresAt > clock_timestamp()`), user linkage, and the flag again. That
statement's snapshot and clock both postdate any wait. The scope's identity comes
from the locked row and must match the authenticated `user.id`.

| Scenario | Behaviour (tested) |
| --- | --- |
| Two writes, same session | Serialized; the second sees the first's committed rows and counters. |
| Write vs. revocation | A write that locks after the revocation commits is rejected before `work` runs. A revocation waits for an admitted write rather than interrupting it. |
| Write vs. expiry | A queued write that acquires the lock after expiry is rejected. An admitted write completes; admission is decided once, bounded by the 10 s transaction timeout. |
| Write vs. cleanup | Cleanup skips a workspace with an admitted write, then later removes everything that write committed, including its new addresses. A write queued behind cleanup finds no row and is rejected, leaving no residue. |
| Write vs. reset | A future temporary reset runs through the same coordinator (`kind: "reset"`), so it takes the same row lock. |
| Allocation vs. writes | No shared lock; allocation inserts new session rows only. |

Repeated runs exposed one finding. With **several** waiters behind a write that
itself updated the session row, PostgreSQL does not guarantee FIFO order, so a
write can lock before a queued revocation does and is then correctly admitted. The
guarantee is therefore "rejected if it locks after revocation commits", not
fairness. The test was corrected to make the revoking transaction hold the lock.

## 6. Quota foundations

| Limit | Value | Status in 3A |
| --- | --- | --- |
| Session lifetime | 24 h absolute | Enforced (Slice 2) and **revalidated after the lock** |
| Retained workspaces | 100 | Enforced (Slice 2 allocator) |
| Invoices per workspace | 30 incl. 7 samples | Post-write measurement under lock — implemented, harness-tested |
| Revisions per workspace | 200 retained | Same |
| Items per invoice | 20 | Same (covers restore, which has no input) |
| Mutation budget | **200 per session lifetime** (provisional) | Persistent counter on locked row — implemented, harness-tested |
| Reset allowance | **5 per session lifetime** (provisional) | Persistent `resetCount` — implemented, harness-tested |
| Reset cooldown | **2 minutes** (provisional) | Persistent `lastResetAt` + DB clock — implemented, harness-tested |
| Text bounds | Provisional per-field limits (`DEMO_TEXT_LIMITS`) | Pure validator implemented and unit-tested, **not wired** |
| Request size | HTTP JSON 100 KB (existing `express.json()` default) | WebSocket payload size **unbounded** (see risks) |

**Design.** Resource limits are **measured from retained rows**, inside the
transaction, after `work`, under the session lock. A restore or sample reset
therefore cannot refund capacity, and there is no stored total to drift. Budgets
are **counters** on the locked row. Each successful write increments
`mutationCount` once, and a reset increments `mutationCount`, `resetCount`, and
`lastResetAt`. Nothing decrements them; reset work cannot touch them because they
are written only by the coordinator. A rollback reverts counters together with the
work. Request throttling remains a separate layer (the per-IP limiter and
production limiter); persistent growth limits live only in the coordinator.

**Provisional values and trade-offs (not measured capacity).**

- **Mutation budget, 200.** A thorough visitor needs perhaps tens of edits, and
  reaching the invoice cap takes 23 creates. Each mutation writes at most about 25
  rows (20 items, an invoice, 2 addresses, a revision, the counter), so a session's
  lifetime write amplification is bounded at roughly 5,000 rows.
- **Resets, 5 per lifetime with a 2-minute cooldown.** Each reset rewrites about 50
  rows; the cooldown stops a loop.
- **Rough retained-size bound.** Assuming 3B wires the text limits, one snapshot is
  around 5–6 KB of JSON at 20 items. That gives about 1 MB of revisions per full
  workspace, or roughly 110 MB across 100 workspaces in the absolute worst case.
  This is an estimate to check against the hosted plan, not a measurement.
- **Failed attempts don't consume budget.** Rolled-back writes don't increment the
  counter, so repeated failing requests are bounded only by request throttling.

**Pending.** Wiring any of this into real mutations (3B), numeric bounds for
price/quantity, a WebSocket payload limit, and counting rejected attempts if
desired.

## 7. Evidence: atomic rollback and concurrency

All tests run against disposable PostgreSQL in a per-file schema. Each `work` is an
internal harness that calls the ordinary repositories from the scope; no public
route is involved.

| Test | Proves |
| --- | --- |
| scope binds every repository/service; root unreachable | No client mixing; `DemoService` also gets the transaction connection |
| `InvoiceService.markAsPaid` in a scope with failing revision insert | Service → revision service → both repositories share one transaction |
| edit + revision, revision insert fails | Neither persists (complete database snapshot equal); success commits both, revision #6, counter 1 |
| `work` swallows a failed statement | Cannot commit partial work: the aborted transaction makes the coordinator's measurement fail |
| guarded services inside the coordinator | `updateInvoice`/`deleteInvoice` still "read-only"; zero changes |
| two sessions concurrently | B commits while A is held open; B cannot read A's invoice; each edits only its own; mismatched session/identity rejected |
| 29 invoices, two writes queued | Exactly one commits; the other gets `WORKSPACE_QUOTA` and rolls back; final count 30 |
| item 21, revision 201 | `WORKSPACE_QUOTA`, full rollback; budget unchanged |
| last budget unit, two concurrent writes | Exactly one; `MUTATION_BUDGET`; counter = 200 |
| revoked / expired while waiting | Rejected, `work` never runs |
| revocation vs. admitted write | Revocation blocks until the admitted write commits |
| cleanup vs. admitted write; write queued behind cleanup | See section 5; no orphan addresses |
| late failure in the final counter `UPDATE` | Invoice, items, addresses, revisions, session counters all unchanged |
| reset cooldown/allowance/budget | Cooldown and allowance enforced; ordinary writes not subject to cooldown; reset cannot run at an exhausted budget |
| disabled flag / non-session / mismatched identity | Fail closed before `work` |

**Mutation checks** (each defect injected temporarily, then the file restored and
diff-verified):

| Injected defect | Result |
| --- | --- |
| Scope not bound to `tx` | 14/17 fail |
| No `FOR UPDATE` | 5 fail (quota, budget, revocation, expiry, cleanup) |
| Validity read before the lock | 3 fail (budget, revocation, expiry) |
| Cleanup without row lock | Cleanup-coordination test fails |

**Stability.** Both session suites passed 10 consecutive runs (34/34 each) after
the FIFO correction.

## 8. Ordinary-user regression

| Check | Result |
| --- | --- |
| Backend typecheck, lint, build | Passed |
| Backend unit | **195 passed** across 15 files (191 existing + 4 new) |
| Backend integration | **194 passed** across 8 files: 175 existing (one strengthened) + 1 WS + 18 new |
| Frontend unit / typecheck / lint (source unchanged) | 119 passed, 2 skipped / passed / passed |
| Browser regression (isolated runner, Chromium) | **35/35 passed** |
| Whitespace check | Passed |

The existing authorization (45), invariants (21), user API security (36), resolver,
and Demo Mode suites pass unchanged. An explicit characterization test confirms
that ordinary users outside a scope keep their established semantics:

- repositories still open their own transactions;
- an ordinary edit still commits even when its separate revision insert fails
  (pre-existing best-effort behaviour, recorded as a prerequisite below, not
  endorsed).

Environment: PostgreSQL 16 with a non-UTC server timezone (`America/Halifax`),
loopback only, Node 24.15.0. Evidence (temporary local logs, not repository
dependencies): the browser run at `/tmp/invoice-e2e-Jxgnxy`, and backend logs in
the session scratchpad
(`/tmp/claude-1000/-home-djblackett-dev-invoice-web-app/e529a01c-ad67-44e9-9508-100ff2767dbe/scratchpad/final-integration.log`).

## Future mutation transaction (3B target)

```text
resolver (temporary session, HTTP only)
  assertDemoInvoiceText(input)                 cheap rejection, no transaction yet
  runDemoSessionWrite(prisma, container, user, kind, work):
    BEGIN (READ COMMITTED, maxWait 5s, timeout 10s)
      SELECT 1 FROM "DemoSession" WHERE id = $s FOR UPDATE      -- lock 2
      SELECT …, revokedAt IS NULL AND expiresAt > clock_timestamp() AS live
      flag on? live? user matches? else SESSION_INVALID / DISABLED
      mutationCount < 200?                       else MUTATION_BUDGET
      reset: resetCount < 5 and cooldown elapsed? else RESET_ALLOWANCE / RESET_COOLDOWN
      scope = createTransactionScope(container, tx, lockedIdentity)
      result = work(scope)                       ordinary InvoiceService path:
                                                 invoice write + revision write
      usage = count invoices / revisions / max items (retained rows)
      over a limit?                              WORKSPACE_QUOTA
      UPDATE "DemoSession" SET mutationCount+1 [, resetCount+1, lastResetAt]
    COMMIT   — any throw anywhere above: ROLLBACK of everything
  map DemoSessionWriteError -> GraphQL error
```

## 9. Remaining risks before mutations can be enabled

- **Revision failures are swallowed in `addInvoice`/`updateInvoice`.** Inside a
  scope, the aborted transaction still forces a rollback (tested), but the caller
  sees a generic error, and the behaviour depends on a later statement.
- **Generated-ID retry (`createWithInvoiceIdRetry`) relies on catching `P2002`.**
  Inside a transaction, the unique violation aborts it, so a rare collision fails
  the whole write. It fails safe, but visibly.
- **Invoice deletion orphans its `ClientAddress`/`SenderAddress` rows.** This is
  pre-existing for all users. Orphans lose attribution, so neither cleanup nor
  quota measurement can see them, and create/delete churn grows them (bounded only
  by the mutation budget).
- **WebSocket message size is unbounded.** The `ws` server has no `maxPayload`, so
  its 100 MiB default applies.
- **Same-session lock waits hold pooled connections** for up to `maxWait`/`timeout`.
  A visitor issuing many concurrent writes can occupy several pool connections.
- **Rejected attempts are free.** They consume no budget.
- **Privileged SQL or code that bypasses the coordinator** can violate the
  application-level limits. Database checks are structural only.
- **Cleanup is still manual and bounded**, and a skipped (locked) session waits
  for a later batch.
- **No FIFO fairness** among lock waiters (see section 5).
- **The shared Demo Mode** keeps its known concurrent-visitor limitations.

## 10. Exact prerequisites for Slice 3B

1. **Admission capability.** Replace the blanket read-only guard for temporary
   sessions with a check that passes only inside a coordinator-created scope (for
   example, a scope-only binding the guard verifies). GraphQL and WS entry points
   that do not go through the coordinator must remain denied. Re-run the
   all-mutations denial test against every non-coordinated path.
2. **Resolver wiring.** Route each enabled temporary mutation (create, edit, delete,
   pay, restore) through `runDemoSessionWrite`. Keep user and bulk administration
   and the shared reset permanently denied.
3. **Mandatory revisions.** Inside a coordinated write, a revision failure must
   propagate rather than be swallowed. Leave the ordinary-user best-effort
   behaviour unchanged, or change it deliberately in its own slice.
4. **Delete removes addresses.** The temporary delete path must remove the
   invoice's addresses in the same transaction, and a test must assert zero
   orphans after create/delete churn.
5. **Collision handling.** Inside a transaction, choose a non-colliding invoice ID
   without relying on catching `P2002` (pre-check under the session lock, or a
   savepoint), or accept and test a fail-closed retry message.
6. **Temporary reset.** Extract the allocation seeding into a shared
   `seedCanonicalWorkspace(tx, userId)`. Implement the reset as
   `runDemoSessionWrite(kind: "reset")`, deleting invoices *and* their addresses
   and then reseeding. It must never use `resetDemoWorkspace` or lock 8372401.
7. **Input and request bounds.** Wire `assertDemoInvoiceText` before the
   transaction, add numeric bounds, set a WebSocket `maxPayload` (or disallow
   temporary mutations over WS), and confirm the HTTP 100 KB JSON limit applies to
   the GraphQL route.
8. **Lock timeouts.** Consider `SET LOCAL lock_timeout` (or `NOWAIT`) in the
   coordinator so queued same-session writes fail fast instead of holding pool
   connections. Test it under the hosted pool size.
9. **Error mapping.** Map `DemoSessionWriteError` codes to stable GraphQL error
   codes for the later frontend lifecycle.
10. **End-to-end tests through the real transport.** Race, rollback,
    quota-exhaustion, revocation and cleanup interactions through actual GraphQL
    mutations over HTTP (and WS, if allowed), plus an ordinary-user regression run.
11. **Rollout decisions.** Validate the provisional budget, reset, and text limits
    against the hosted database plan. Deploy the additive migration. Decide on
    cleanup scheduling separately.

Neither quota completeness nor readiness for enabling mutations is claimed by this
slice.
