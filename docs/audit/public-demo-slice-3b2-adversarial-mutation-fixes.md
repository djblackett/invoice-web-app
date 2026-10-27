# Public Demo Reliability — Slice 3B.2: adversarial mutation fixes

Implemented locally on 27 October 2026 (America/Halifax), on top of `22117d0`.
Corrects the independent Slice 3B.1 review's three blocking findings and the
two inherited data issues. **Temporary sessions remain disabled by default**
(`DEMO_SESSIONS_ENABLED` must be exactly `true`). No hosted database,
production credentials, deployment settings or frontend source changed. One
additive migration was written and applied **only** to disposable local
PostgreSQL. Nothing was committed, pushed, merged or deployed.

## 1. Baseline

| Check | Result |
| --- | --- |
| Branch / HEAD | `public-demo/slice-3b0-integration` at `22117d0` (Slice 3B.1); working tree clean |
| Review document | Not in the repository or earlier session scratchpads. The findings were taken from the Slice 3B.2 brief and reproduced independently (section 7) before any fix. |
| Baseline tests | **235/235** integration on fresh PostgreSQL 16 (`America/Halifax`, loopback only) |
| Reproductions on the unmodified code | All three blocking findings reproduced (section 7). The new regression tests failed for exactly the reported reasons. |

## 2. Findings and exact corrections

### P1 — failed-mutation amplification

**Reproduced.** One 11.7 KB HTTP request with 300 aliased `markAsPaid` fields on
an already-paid invoice ran **300** coordinated transactions. It used one per-IP
allowance and no budget, because each field failed inside its own transaction.

**Corrections**, in the order a request meets them:

1. **One root mutation field per request** for temporary identities
   (`requireSingleDemoMutation`, `demoSessionPolicy.ts`).
   - It counts every root field: aliases, repeats of the same field,
     `__typename`, named fragment spreads (recursively) and inline fragments.
   - `@skip`/`@include` are ignored, so a directive cannot hide a field.
   - It checks only the operation Apollo selected (`operationName`).
   - It is enforced twice:
     - by a new Apollo plugin at `didResolveOperation`
       (`GraphQL/singleDemoMutationPlugin.ts`). This runs after parse,
       validation and operation selection, but before any resolver. It
       returns one error with HTTP **400**;
     - again by the mutation wrapper (`resolvers/index.ts`), before
       `coordinated()`, for any execution path without the plugin. A call
       without `info` fails closed.
   - Queries and ordinary identities are untouched.
2. **Per-session write slots** (`takeWriteSlot`, `demoSessionWrite.ts`).
   - Each coordinated transaction first tries
     `pg_try_advisory_xact_lock(8372403 + slot, hashtext(sessionId))` for
     slot 0, then slot 1. It never waits.
   - With both slots held, it fails at once with `SESSION_BUSY`.
   - The locks are in PostgreSQL, so the bound holds across concurrent
     requests, connection pools and application instances. Commit, rollback
     or a dropped connection releases them; nothing can leak.
   - The two-key form uses a different key space from the existing
     single-key allocation/cleanup locks 8372401/8372402.
3. **Per-session attempt budget** (`DemoSession.attemptCount`, new column).
   - After the row lock and revalidation, the coordinator checks
     `attemptCount < 400`, then increments it and sets
     `SAVEPOINT demo_write_attempt`.
   - Any failure after that point rolls back **to the savepoint** and then
     **commits**, so only the attempt is recorded, and the original error
     is rethrown.
   - If even the savepoint rollback fails (for example, the transaction
     timed out), the whole transaction rolls back and the original error
     propagates.
4. **WebSocket denied to temporary credentials.** See section 4.

Stable errors for the browser:

| Condition | `extensions.code` | Extra | HTTP |
| --- | --- | --- | --- |
| More than one root mutation field | `SINGLE_MUTATION_REQUIRED` | message "Temporary demo sessions may run one mutation per request" | 400 |
| Both write slots in use | `SESSION_BUSY` (existing) | retryable | 200 |
| Attempt budget spent | `QUOTA_EXCEEDED` | `quota: "attempts"` | 200 |
| WebSocket with a temporary credential | close code **4403** (Forbidden) at `connection_init` | — | — |

### P2 — duplicate item identifiers

**Reproduced.** An edit listing the same existing item ID twice (prices 10 and
20) was saved. The stored total was 30, but the one retained item totalled 20.

**Corrections.**

- `prepareDemoInvoiceInput` rejects a repeated nonempty item ID,
  case-insensitively, as `items.N.id is duplicated` (`BAD_USER_INPUT`). It
  does this before any transaction or lock, so nothing is counted.
- Blank IDs may repeat, because each one becomes a new item.
- As defence in depth, `PrismaInvoiceRepository.update` refuses duplicate IDs
  **before** reconciliation starts, for every caller. It throws a
  `ValidationException` outside its `try`, so the exception keeps its type.
- Totals are not patched after the write. The inconsistent reconciliation
  can no longer start.

### P2 — capability not bound to its transaction

**Reproduced.** Inside a coordinated `edit`, the scope's live capability
authorized writes in three wrong contexts:

- a hand-constructed `InvoiceService` over a root-client repository;
- an `InvoiceService` resolved by ordinary DI from a child of the root
  container;
- a correctly built transaction scope on **another** transaction.

All three wrote, and all three writes survived the coordinator's rollback. The
issuer `issueDemoWriteCapability` was exported.

**Corrections.**

- **Grant contents.** The grant now records the scope's
  `TransactionDatabaseConnection` instance (`database`). The coordinator issues
  the capability *after* building the scope, for that scope's own
  `DatabaseConnection`, and binds it there itself. `createTransactionScope` no
  longer accepts a capability.
- **Guard.** `requireDemoMutationAllowed(user, capability, writesThrough, ...operations)`
  admits a temporary identity only when all of these hold:
  - the grant is live;
  - its session, user and operation match;
  - `writesThrough` is non-empty, and every entry is identical (`===`) to
    the grant's connection.
- **What the services pass.**
  - `InvoiceService` passes its repository's connection.
  - `InvoiceRevisionService.recordIfChanged` passes both of its
    repositories' connections.
  - The repository interfaces now expose `databaseConnection` (read-only)
    for this check.
- **Issuance.** `issueDemoWriteCapability` is now module-private.
  `claimDemoWriteIssuer()` hands it out **once per process**:
  - `demoSessionWrite.ts` claims it as the module loads;
  - any later claim throws;
  - a module that claimed first would make the coordinator, and therefore
    the server, fail to load;
  - a unit test pins the only claimant.

### P3 — inherited data issues

- **Partial address edits.** `InvoiceService.updateInvoice` merges an address
  update field by field (`withAddressUpdates`). Omitted (`undefined`) fields
  keep their stored values. An absent or `null` address object keeps the
  whole stored address, as the repository already did. An explicit `null`
  *field* still fails validation, unchanged, just as `null` does for
  top-level fields.
- **Payment terms.** `mapPartialInvoiceToInvoice` now defaults with
  `paymentTerms ?? 14`, and `PrismaInvoiceRepository.create` stores the value
  as given. It used `|| 14`, which turned an explicit 0 into 14. An omitted
  term is still stored as 14.

## 3. Admission limits and rationale

| Limit | Value | Why |
| --- | --- | --- |
| Root mutation fields per request | 1 | Ties database transactions 1:1 to HTTP requests, so the existing per-IP limiter meters write transactions again. The browser sends one mutation per request. |
| Open coordinated writes per session | 2 (one running, one waiting ≤ 2 s on the row lock) | Same-session writes are serialized anyway, so a third adds pooled connections, not throughput. Two still absorbs a double-click without a forced retry, and keeps the existing two-writer serialization semantics. |
| Admitted attempts per session lifetime | 400 | Twice the 200-change budget, so ordinary mistakes cannot exhaust it first. It caps a session's total write transactions, successes and failures together, at 400. Before this slice, failures were unlimited. |

The values live in `DEMO_WORKSPACE_LIMITS` with the other policy numbers.
Like those, they are **provisional** and not measured against the hosted plan.

## 4. Accounting of failed operations

| Where a request stops | Opens a transaction? | `attemptCount` | `mutationCount` |
| --- | --- | --- | --- |
| Auth/context failure, flag off at bootstrap | no | — | — |
| More than one root field (plugin or wrapper) | no | unchanged | unchanged |
| Input preparation (`BAD_USER_INPUT`, including duplicate IDs) | no | unchanged | unchanged |
| No free write slot (`SESSION_BUSY`) | yes, about 3 statements, then rollback | unchanged | unchanged |
| Row-lock timeout (`SESSION_BUSY`), revoked/expired (`UNAUTHENTICATED`), flag off after the lock (`FORBIDDEN`) | yes, rolled back | unchanged | unchanged |
| Attempt budget spent | yes, rolled back before any work | unchanged (stays at 400) | unchanged |
| **Admitted, then fails**: change budget, ownership/`NOT_FOUND`, state rule, workspace quota, revision or database error | yes; rolled back to the savepoint, then committed | **+1** | unchanged |
| Admitted and succeeds | yes, committed | **+1** | +1 |

Every transaction that reaches the work is counted, including one whose
failure left PostgreSQL in the aborted state (tested with a trigger on the
final counter update). Refusals before admission are deliberately free. They
cost no database work (the first three rows), or a few statements that one
session can run at most twice at a time (the slot refusals). They remain
bounded by the per-IP limiter.

## 5. GraphQL shapes and transports

| Path | Handling | Evidence |
| --- | --- | --- |
| Aliases (2 or 300) | Counted; refused with 400 before execution | Reproduction test; 9 refused shapes; unit cases |
| Same field twice (merged by graphql-js) | Counted twice; refused | HTTP and unit |
| Named fragments (single, repeated, nested) and inline fragments | Expanded and counted | HTTP and unit |
| `@skip`/`@include` | Ignored, so the field still counts | HTTP and unit |
| `__typename` beside a mutation | Counted | HTTP and unit |
| Several operations plus `operationName` | Only the selected operation is judged. A single-field selection is admitted; a two-field one is refused | HTTP and unit |
| HTTP batching (JSON array) | Disabled (Apollo default); 400, nothing executed | HTTP |
| GET mutation | Apollo refuses it (405) | HTTP |
| Execution without the plugin | The wrapper refuses each field (`SINGLE_MUTATION_REQUIRED`) before `coordinated()`; no transaction | Test with a bare `ApolloServer` over the production resolvers |
| WebSocket | Temporary credentials are refused at `connection_init` (`onConnect`, close **4403**) whether valid, revoked, expired, malformed or with the flag off, and before any context is built or query runs. Auth0 and `demo-token` sockets are unchanged | Real `ws` + `graphql-ws` tests |

**Why deny the WebSocket transport.** The browser routes only subscriptions over
WebSocket (`useApolloClient.ts` `split`). The only subscription,
`invoiceAdded`, is the administrator feed, which temporary sessions were already
refused. Temporary sessions therefore need no WebSocket operation, and a second
rate-limiting system for that transport is unnecessary. The match uses the same
`demo-session` prefix that routes a token to temporary-session resolution
(`isTemporaryDemoToken`). It also reuses `createSubscriptionContext`'s token
parsing (`connectionToken`), so the two cannot disagree. The 3B.0 WebSocket
mutation rule stays in the wrapper as defence in depth.

## 6. How capability validity is tied to the transaction

```text
runDemoSessionWrite
  BEGIN; slot; FOR UPDATE; revalidate; attempt+1; SAVEPOINT
  scope    = createTransactionScope(parent, tx, lockedIdentity)
  database = scope.get(DatabaseConnection)            // one TransactionDatabaseConnection
  grant    = issue({ session, user, operation, database })
  scope.bind(DemoWriteCapability) ← grant.capability
  try work(scope) finally grant.revoke()
guard(user, capability, [repo.databaseConnection, …], op)
  live grant ∧ same session ∧ same user ∧ op ∈ ops ∧ every repo connection === grant.database
```

- **One transaction scope.** A repository's `databaseConnection` is the
  object every statement in it uses. Only repositories resolved from *this*
  scope hold *this* connection instance. A root `DatabaseConnection`,
  another transaction's scope, or a second wrapper around the same `tx` are
  all different objects.
- **One session, one user, one operation.** As in 3B.1.
- **Ends with the operation.** The grant is revoked in `finally` when `work`
  settles, before the quota check and commit. A captured service is refused
  afterwards before any query, as in the 3B.1 test. A spent capability is
  also refused in a freshly built scope for the same identity.
- **Not forgeable** through GraphQL input, construction or DI. The token
  carries no data, the map is module-private, and DI can only *bind* a token
  that the guard then checks against the repositories' real connections.

**Scope of the claim.** This protects against untrusted client requests and
against accidental in-process misuse: a capability passed to the wrong
service, container or transaction. It does **not** sandbox malicious server
code. Code running in the process can import Prisma and write directly, or
build its own coordinator-shaped call path. The claim-once issuer turns the
most likely accident, a second issuer caller, into a startup failure. It is
not a security boundary against hostile code.

## 7. Original attacks after the fixes

| Attack | Before (baseline `22117d0`) | After |
| --- | --- | --- |
| 300-alias `markAsPaid` request (11.7 KB) | `$transaction` called **300** times; HTTP 200 with 300 errors; no budget used | HTTP **400**, one `SINGLE_MUTATION_REQUIRED` error, `$transaction` called **0** times; database byte-identical; attempts 0 |
| Duplicate existing item ID (prices 10 and 20) | Saved total 30 with one retained item of 20 | `BAD_USER_INPUT` "items.1.id is duplicated"; no transaction; invoice, items, revisions, `mutationCount` and `attemptCount` unchanged |
| Capability moved into a root-client service, a DI-resolved root service and another transaction's scope, then coordinator rollback | All three `"wrote"`; writes survived the rollback | All three refused ("read-only"); after the rollback the database is identical to before |

## 8. Atomicity and invoice-total evidence

All tests use the production `createServer()` (express + Apollo + `ws` +
graphql-ws), real `fetch`/WebSocket clients, signed local Auth0 tokens and
disposable PostgreSQL 16, unless marked "harness" (direct coordinator calls in
`demoSessionWrites.test.ts`).

| Test | Proves |
| --- | --- |
| P2 every duplicate shape (HTTP) | Different quantities, three appearances and a case variant are all refused with no `$transaction` call; database, revisions, `mutationCount` and `attemptCount` are unchanged |
| Same test, valid edits | Updating two existing items keeps both IDs; existing + new client UUID + blank, with one existing item dropped, gives 3 rows (the kept ID present, the dropped ID gone). After each edit, **stored total = Σ stored items = latest revision `total`**, and the revision's items match the rows (ID, price, quantity). Counters 2/2 |
| Same test, ordinary user | The repository guard refuses duplicate IDs for an Auth0 user (existing generic `INTERNAL_SERVER_ERROR` "Failed to update invoice"); rows unchanged |
| P3 (HTTP, visitor **and** Auth0 user) | `clientAddress: { city }` and `senderAddress: { postCode }` keep every other stored field, in the response, the row and the latest revision snapshot. `paymentTerms: 0` on edit and create is stored and snapshotted as 0; omitted gives 14; 30 gives 30 |
| Harness: failed attempt after an aborted transaction | A trigger fails the coordinator's last statement. All work rolls back, `attemptCount` +1, everything else is identical. The same holds for a `work` error and a budget refusal |
| Harness: capability transfer (reproduction) | Root-client, DI-resolved and other-transaction services all refused; database identical after the rollback |
| Harness: spent or borrowed capability | A settled capability is refused in a new correct scope for the same identity; session A's live capability is refused inside session B's coordinated scope; only A's two empty commits are visible |
| Existing 3A/3B.0/3B.1 rollback, quota, race, lock-wait and isolation tests | Unchanged and passing. `snapshotDatabase()` in the two coordinator suites now omits `attemptCount`, which the tests above assert explicitly |

## 9. Changes to existing tests (deliberate behaviour changes)

| Test | Was | Now |
| --- | --- | --- |
| HTTP budget race | 6 queued edits at 197: exactly 3 commit | 6 at 199: 2 admitted (1 commits, 1 `QUOTA_EXCEEDED:mutations`), 4 `SESSION_BUSY`; attempts 2 |
| HTTP invoice-cap race | 5 queued creates at 28: exactly 2 commit | 5 at 29: 1 commits, 1 `QUOTA_EXCEEDED:workspace`, 3 `SESSION_BUSY`; addresses +1 only |
| Independent visitors | 8 interleaved edits (4 per session) | 4 interleaved edits all succeed; then, with A's two slots full, A's third is refused at once while B still commits |
| Five operations over WebSocket; visitor `invoiceAdded` | `FORBIDDEN` per operation | Socket refused, close 4403 |
| Slice 2 "persistent real WebSocket re-authenticates" | A temporary session read over one socket until revoked or expired | Temporary credentials (live, revoked, expired, malformed, flag off) cannot connect; zero `$queryRaw` calls; an Auth0 socket on the same server still works |
| Slice 2 WebSocket mutation and frame-size test | Real-socket part used the visitor's credential | Real socket refused (4403); frame-size checks use an Auth0 token; the wrapper's WebSocket rule is still tested through a WebSocket context |
| Capability unit tests | `issueDemoWriteCapability` imported | Issuer obtained by `claimDemoWriteIssuer()` (this module graph never loads the coordinator); grants carry a connection; static check pins `claimDemoWriteIssuer(` to the policy and the coordinator |
| `mapPartialInvoiceToInvoice` default | omitted `paymentTerms` → 0 (then `\|\| 14` in the repository) | omitted → 14 directly; the persisted meaning is unchanged |

The two-writer serialization tests in the harness (quota on stale counts,
budget at the last unit, waits observing revocation or expiry, bounded lock
waits on a small pool) pass **unchanged**. Two slots keep one queued writer.

## 10. Validation

| Gate | Result |
| --- | --- |
| Baseline `22117d0` integration | 235/235 |
| Reproductions on the baseline | 3/3 failed for the reported reasons (`$transaction` ×300; duplicate edit saved; `{ constructed, injected, other transaction }` all `"wrote"`) |
| Backend `npm run check` (typecheck, lint with zero warnings, unit, build) | Passed; **226 unit** (220 + 6) |
| Backend integration, full suite | **249/249** across 9 files (235 + 14 new) |
| Stability: three session suites, 3 consecutive runs | 80/80 each |
| Frontend `npm run check` + `typecheck:e2e` (source unchanged) | 119 passed, 2 skipped |
| Browser regression (isolated runner, Chromium) | **35/35** (5.1 min) |
| `git diff --check` | Passed |
| Prettier | Changed files clean. Four untouched files were already unformatted at baseline |

**Injected defects.** Each was applied to one file, the targeted suites were
run, and the file was restored. SHA-256 of every source and test file was
verified after each defect and after both runs.

| # | Defect | Detected by |
| --- | --- | --- |
| D1 | Plugin not registered | HTTP 300-alias reproduction (the wrapper still prevents transactions, but returns 300 errors with HTTP 200) |
| D2 | Wrapper backstop removed | Plugin-less execution-path test (HTTP tests pass: the plugin covers them) |
| D3 | Named fragments not counted | unit 1, HTTP shapes 1 |
| D4 | Inline fragments not counted | unit 1, HTTP shapes 1 |
| D5 | No write-slot admission | harness 2, HTTP 4 (races, instances, saturation) |
| D6 | One slot pair shared by all sessions | harness 1, HTTP 1 (saturated session blocks its neighbour) |
| D7 | Failed attempt rolled back with the work | harness 1, HTTP 4 |
| D8 | Attempt bound not enforced | harness 1, HTTP 2 |
| D9 | Attempt never recorded | harness 3, HTTP 7 |
| D10 | Capability not bound to its transaction | unit 1, harness 1 (the reproduction) |
| D11 | Issuer claimable twice | unit 1 |
| D12 | Capability never revoked (3B.1 N1 re-run) | harness 1 |
| D13 | Duplicate IDs accepted in preparation | unit 1, HTTP 2 |
| D14 | Repository duplicate guard removed | HTTP 1 (ordinary user) |
| D15 | Partial address replaces the stored one | HTTP 1 |
| D16 | `paymentTerms: 0` replaced by the default | unit 1, HTTP 1 |
| D17 | WebSocket admits temporary credentials | Slice 2 suite 2, HTTP 2 |
| D18 | Single-field rule also applied to queries | unit 1 |

D1–D4 were re-run alone. The first pass overlapped a frontend run, and CPU
contention added unrelated 5 s timeouts. The first D2 mutant was also invalid
syntax, so it skipped every test. Both are corrected in the table above.

Environment: Node 24.15.0, PostgreSQL 16 (`/usr/lib/postgresql/16/bin`), server
time zone `America/Halifax`, loopback only. Logs are temporary local files in
`/tmp/claude-1000/-home-djblackett-dev-invoice-web-app/01816af4-86fc-4ab4-8d00-7e8dd8d009ec/scratchpad/`
(`baseline-integration.log`, `red-baseline.log`, `final-integration.log`,
`backend-check.log`, `stability-*.log`, `mutants-run.log`, `mutants-rerun.log`,
`frontend-check.log`, `e2e.log`).

## 11. Files changed

| File | Change |
| --- | --- |
| `prisma/schema.prisma`, `prisma/migrations/20261027120000_add_demo_session_attempts/` | **New additive migration**: `DemoSession.attemptCount INT NOT NULL DEFAULT 0` with a `>= 0` check. Applied only to disposable local databases |
| `src/services/demoSessionPolicy.ts` | Module-private issuer and `claimDemoWriteIssuer`; grant bound to a connection; `writesThrough` guard; `requireSingleDemoMutation`; `isTemporaryDemoToken` |
| `src/services/demoSessionWrite.ts` | Claims the issuer; write slots; attempt check, record and savepoint; commit-the-attempt-only on failure; issues and binds the capability for the scope's connection |
| `src/services/demoWorkspaceQuota.ts` | `attempts: 400`, `concurrentWrites: 2`; duplicate item-ID rejection |
| `src/database/transactionScope.ts` | No longer takes or binds a capability |
| `src/repositories/InvoiceRepo.ts`, `InvoiceRevisionRepo.ts`, both Prisma implementations | `databaseConnection` exposed read-only for the guard; repository duplicate-ID guard; `paymentTerms` stored as given |
| `src/services/invoice.service.ts`, `invoiceRevision.service.ts` | Guards pass their repositories' connections; field-wise address merge on edit |
| `src/utils/utils.ts` | `paymentTerms ?? 14` |
| `src/GraphQL/singleDemoMutationPlugin.ts` | **New**: pre-execution single-mutation check |
| `src/server.ts` | Registers the plugin; `onConnect` refuses temporary credentials |
| `src/GraphQL/createContext.ts` | Shared `connectionToken`; `isTemporaryDemoToken` routing |
| `src/resolvers/index.ts`, `demoSessionMutations.ts` | Wrapper backstop (uses `info`); `ATTEMPT_BUDGET` error mapping |
| Tests | `demoSessionMutations` (+8, a second application instance, updated races and WebSocket), `demoSessionWrites` (+5), `demoSessions` (+1, WebSocket tests updated), unit `demoWorkspaceQuota` (+5), `utils` (+1) |
| `docs/audit/public-demo-slice-3b2-adversarial-mutation-fixes.md` | This report |

No GraphQL schema, dependency, `.env.example` or frontend change.

## 12. Ordinary-user effects and remaining limitations

**Ordinary users.** Auth0 and `demo-token` GraphQL behaviour is unchanged in
transport, multi-field mutations (tested), authorization, the admin feed and
WebSocket. Three correctness fixes reach every user:

- duplicate item IDs in an edit now fail, with the existing generic edit
  error, instead of saving an inconsistent invoice;
- an address edit that omits fields keeps them, and a `null` address object
  keeps the stored address, where both failed validation before;
- an explicit `paymentTerms: 0` on create is kept instead of becoming 14.

**Remaining limitations.**

- **Refusals before admission are free.** These are multi-field requests,
  invalid input and slot or lock `SESSION_BUSY`. Only the per-IP limiter
  bounds them. Slot refusals cost one short transaction each.
- **The attempt budget is per session, not per visitor.** A visitor can
  allocate new sessions, bounded by the existing allocation limiter
  (5 / 10 min / IP), the global token bucket and the 100-workspace capacity.
  It is a lifetime cap, not a rate, so a session can spend its 400 attempts
  quickly. That is at most 2 concurrent transactions, though.
- **Pool pressure across sessions.** Each session can hold 2 pooled
  connections, so many simultaneous sessions can still contend for a small
  hosted pool. Pool size, the per-IP limiter and the provisional values
  need validating against the hosted plan.
- **A transaction that hits Prisma's 10 s timeout** cannot record its
  attempt: the savepoint rollback fails, and everything, including the
  attempt, rolls back. Such an attempt also held its slot for 10 s.
- **A `hashtext` collision** between two live sessions makes them share
  slots. This causes only spurious, retryable `SESSION_BUSY` (about 1 in 2³²
  per pair).
- **The browser lifecycle (3C)** must not open the WebSocket for temporary
  sessions; skip the `invoiceAdded` subscription as demo mode does. The
  `graphql-ws` client retries a 4403 close. The browser must also handle
  `SINGLE_MUTATION_REQUIRED` (a programming error), `QUOTA_EXCEEDED` with
  `quota: "attempts"`, and `SESSION_BUSY` on a double submit.
- **The capability is not a sandbox**; see section 6.
- **Queries are not field-limited** for temporary sessions. Reads are
  bounded by request size and the per-IP limiter only, as before.
- **Unchanged from 3B.1:**
  - direct `status: "paid"` edits;
  - `createdAt` not persisted by edits;
  - manual cleanup;
  - the 413 change applies to all users;
  - no session reset;
  - deployment still requires an explicit, separate approval. There are now
    **three** additive migrations to deploy before enabling the flag in a
    non-public environment.

Readiness for public rollout is not claimed by this slice.
