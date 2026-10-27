# Public Demo Reliability — Slice 3B.1: bounded demo mutations

Implemented locally on 27 October 2026 (America/Halifax). **Temporary sessions
can now create, edit, pay, restore and delete invoices**, each through the
coordinated, quota-enforced transaction path, over HTTP only. The feature is
still **disabled by default** (`DEMO_SESSIONS_ENABLED` must be exactly `true`).
It is not enabled anywhere, and the frontend does not call it. No hosted
database, production credentials, deployment settings or frontend source
changed. The shared public demo is unchanged. Nothing was committed, pushed or
deployed.

## 1. Baseline verification

| Check | Result |
| --- | --- |
| Branch / HEAD | `public-demo/slice-3b0-integration` at `1447d90` (Slice 3B.0) |
| Remote tracking | After `git fetch`, `origin/public-demo/slice-3b0-integration` = `1447d90`: 3B.0 is committed **and pushed** |
| Working tree | Clean before work started |
| `origin/main` | `9652e30`, an ancestor of HEAD |
| 19 October address-cleanup fix | `ddc6434` (2026-10-19) is an ancestor; `PrismaInvoiceRepository.delete` captures and conditionally deletes both addresses |
| Transaction-scoped reconciliation | Present: `PrismaInvoiceRepository.update` reconciles items through `databaseConnection.atomic`, which joins the coordinator's transaction in a scope; unknown item IDs get server IDs there |
| Baseline tests | **215/215** integration on fresh PostgreSQL 16 (`America/Halifax`) |

The repository has no separate independent-review document for 3B.0. Review
findings D1–D8 and the 3B.0 "changes still required" list were read from the 3B.0
report and checked against the code before any change. The code matched those
claims, including the coordinator's post-lock revalidation, the `lock_timeout`,
the WebSocket `maxPayload` and the server-controlled IDs in scope.

## 2. Files changed

| File | Change |
| --- | --- |
| `invoice-backend/src/services/demoSessionPolicy.ts` | `DemoInvoiceOperation`; opaque `DemoWriteCapability`; `issueDemoWriteCapability` (coordinator-only); `requireDemoMutationAllowed(user, capability?, ...operations)` |
| `invoice-backend/src/services/demoSessionWrite.ts` | Coordinator mints the capability after lock + revalidation and revokes it when `work` settles. `runDemoInvoiceWrite` takes the operation and validates exactly that operation's required fields before any transaction. |
| `invoice-backend/src/database/transactionScope.ts` | Optional capability, bound as `TYPES.DemoWriteCapability` only in that scope |
| `invoice-backend/src/constants/identifiers.ts` | `TYPES.DemoWriteCapability` |
| `invoice-backend/src/services/invoice.service.ts` | Optional injected capability; each guarded method names its operation. Bulk deletes are unchanged (no operation, so always denied). |
| `invoice-backend/src/services/invoiceRevision.service.ts` | `recordIfChanged` admits create/edit/pay/restore grants (not delete) |
| `invoice-backend/src/services/demoWorkspaceQuota.ts` | `status` restricted to `draft`/`pending`/`paid` (`DEMO_INVOICE_STATUSES`) |
| `invoice-backend/src/resolvers/demoSessionMutations.ts` | **New.** The five coordinated handlers and the stable error mapping |
| `invoice-backend/src/resolvers/index.ts` | Temporary identities are routed only to those handlers; every other mutation, including schema fields without a resolver (`login`), is denied |
| `invoice-backend/src/config/exception.config.ts`, `server.config.ts` | `PayloadTooLargeException`; body-parser's `entity.too.large` → **413** (was 500) |
| `invoice-backend/tests/integration/demoSessionMutations.test.ts` | **New.** 19 end-to-end tests through the production HTTP/WebSocket server |
| `invoice-backend/tests/integration/demoSessionWrites.test.ts` | Test-only guard bypass (`vi.mock` seam) **removed**: harness tests now use the real capability; one new grant/revocation test; calls updated for the new signature |
| `invoice-backend/tests/integration/demoSessions.test.ts` | The "all mutations denied" test now covers every unapproved mutation (HTTP and WS) and the five approved ones over WS; the oversize assertion is now exactly 413 |
| `invoice-backend/tests/unit/demoWorkspaceQuota.test.ts` | Status allowlist and blank-draft shape; capability semantics; static check that only the coordinator issues capabilities |
| `docs/audit/public-demo-slice-3b1-bounded-demo-mutations.md` | This report |

No schema, migration, GraphQL type, dependency, `.env.example` or frontend
change.

## 3. Operations available to temporary sessions

All five run only over **HTTP**, only through `runDemoInvoiceWrite`, and only
with a capability for that single operation.

| GraphQL mutation | Operation | Required request fields (validated before the lock) | Service call in the scope | History |
| --- | --- | --- | --- | --- |
| `addInvoice` | `create` | `invoice` (allowlisted; `id`, totals, owner dropped) | `InvoiceService.addInvoice` | Revision #1 `create` (mandatory) |
| `editInvoice` | `edit` | `invoiceId`, `invoice` | `updateInvoice` | `edit` revision if changed (mandatory) |
| `markAsPaid` | `pay` | `invoiceId` | `markAsPaid` (pending → paid only) | `edit` "Marked as paid" |
| `restoreInvoiceRevision` | `restore` | `invoiceId`, `revisionId` | `restoreRevision` | `restore` revision with `restoredFromRevisionId` |
| `removeInvoice` | `delete` | `invoiceId` | `deleteInvoice` (items/revisions cascade; addresses cleaned) | none (invoice removed) |

**Still denied to temporary sessions:** `resetDemoData`, `deleteAllInvoices`,
`deleteInvoicesByUserId`, `createUser`, `deleteUsers`, `deleteUsersKeepAdmins`,
`login`, any future mutation not added to the handler map, every mutation over
WebSocket, and the `invoiceAdded` subscription. Queries are unchanged.

Incomplete drafts still save. Other fields may be empty strings or zeros (the
frontend's blank "Save as Draft" payload is tested). Only `status` is restricted
to the three recognized values.

## 4. The transaction-scoped capability

```text
HTTP request ─ createContext: credential → live session → user {demoSessionId}
resolver wrapper (every schema mutation)
  1. requireHttpForDemoMutation      WebSocket? → FORBIDDEN (first, always)
  2. temporary identity?             only temporarySessionMutations.get(name), else FORBIDDEN
runDemoInvoiceWrite(prisma, container, user, operation, request, work)
  3. validate + rebuild the operation's required fields       no transaction yet
runDemoSessionWrite(... operation)
  BEGIN READ COMMITTED; SET LOCAL lock_timeout = 2000ms
  4. SELECT … FROM "DemoSession" … FOR UPDATE                  SESSION_BUSY on timeout
  5. re-read after lock: flag, live (expiry/revocation), user  DISABLED / SESSION_INVALID
  6. mutationCount < 200                                       MUTATION_BUDGET
  7. grant = issueDemoWriteCapability({session, user, operation})
     try   work(createTransactionScope(…, lockedIdentity, grant.capability))
             ordinary service → requireDemoMutationAllowed(user, capability, op)
             → getAuthorizedInvoice / getRevision (ownership)
             → repository writes + mandatory revision
     finally grant.revoke()
  8. measure retained invoices/revisions/items                 WORKSPACE_QUOTA
  9. mutationCount + 1; COMMIT (any throw above → ROLLBACK of everything)
```

- **Unforgeable.** A capability is an empty, frozen, null-prototype object. Its
  grant (session ID, user ID, operation) is held in a module-private `WeakMap`
  keyed by the object's identity. A copy, a prototype child, a JSON round-trip or
  a look-alike object with the same fields matches nothing (unit-tested).
- **Server-controlled.** Only `runDemoSessionWrite` calls
  `issueDemoWriteCapability`. A unit test scans `src/` to enforce that. It is
  bound only by `createTransactionScope`; no request container binds
  `TYPES.DemoWriteCapability`. The grant's session and user come from the
  **locked row**, not from the request, and the guard also requires them to equal
  the scope's identity.
- **Operation-specific.** An `edit` grant does not admit pay, delete, create,
  restore, bulk deletes, user administration or the shared reset, even inside the
  same scope (integration-tested). Methods that name no operation
  (`deleteAllInvoices`, `deleteInvoicesByUserId`, `UserService` administration)
  can never pass for a temporary identity.
- **Transaction-scoped.** The grant is revoked in a `finally` as soon as `work`
  settles, before the quota check and commit. A service captured inside the
  write and called afterwards is refused by the guard before any query
  (integration-tested).
- **Ordinary identities** never consult the capability; their behaviour is
  unchanged.

## 5. Proof that every permitted mutation passes through the coordinator

1. **Routing.** For a temporary identity, the resolver wrapper never calls an
   ordinary resolver. It looks up the name in `temporarySessionMutations` (five
   entries, each built by `coordinated()` → `runDemoInvoiceWrite`) or throws
   FORBIDDEN. The wrapper covers every `Mutation` field parsed from `typeDefs`,
   not only implemented ones.
2. **Admission.** Outside a coordinator scope, the services still refuse every
   temporary-session write (tested from a real request context), because only the
   coordinator can mint a capability.
3. **Injected defects** (section 9):
   - N4 routes temporary sessions to the ordinary resolvers: 15 of 19 end-to-end
     tests fail, because the services refuse without a capability.
   - N5 makes the coordinator grant nothing: 14 of 19 fail.

   No alternate path succeeded.

## 6. Evidence: atomicity, ownership, quotas and concurrency

All tests use `createServer()` (the production express + Apollo + `ws` +
graphql-ws wiring), `fetch` and a real WebSocket client, signed local Auth0
tokens (local JWKS), visitors bootstrapped through `POST /demo/sessions`, and a
disposable PostgreSQL 16 schema (`America/Halifax`, loopback only).

| Test (`demoSessionMutations.test.ts`) | Proves |
| --- | --- |
| two visitors create, edit and re-read, including drafts | Server IDs `XX0000-<uuid>` (client `AB1234` ignored); totals recomputed; kept item keeps its ID, a new client UUID gets a server ID; GET/list after refresh return the persisted state; lists are disjoint; history `create`/`edit` authored by the visitor; bad statuses → `BAD_USER_INPUT` with zero changes; counters 2/2; ordinary rows byte-equal |
| marks only pending invoices paid | pending → paid with "Marked as paid" revision; paid or draft → `BAD_USER_INPUT`, database unchanged, not counted |
| compares and restores revisions | Diff between revisions; restore of RT3080 revision #1 matches the snapshot (status, name, items, recomputed total); surviving item IDs kept; revision #6 `restore` with source and author; earlier history byte-equal; a revision of the visitor's *other* invoice is refused with no change |
| deletes with items, revisions and both addresses | Address tables drop by exactly 2+2; orphan count unchanged; no items/revisions remain; repeat delete ≡ never-existing ID |
| foreign invoice, revision and item IDs | For edit/pay/delete/restore, another visitor's invoice and a real user's invoice give **byte-identical** errors to a random missing ID (`NOT_FOUND`, "Invoice not found"); foreign revisions ≡ missing revision; malformed IDs → `BAD_USER_INPUT`; whole database unchanged and not counted; foreign/real item IDs in an edit become new server-ID items, and all non-visitor rows are byte-equal |
| 30th / 31st invoice | 23 creates reach 30; the 31st → `QUOTA_EXCEEDED` (`workspace`), full rollback |
| 20 / 21 items, oversized restore | 20 accepted; 21 rejected before any lock; restoring a 21-item revision → `QUOTA_EXCEEDED`, full rollback (restore has no input, so only the post-write measurement can catch it) |
| 200th / 201st revision | Exactly at 200 accepted; 201 → `QUOTA_EXCEEDED`, rollback; delete still allowed at the cap |
| 200th mutation | Accepted; afterwards all five operations → `QUOTA_EXCEEDED` (`mutations`), zero changes |
| budget race | 6 edits queued on the held session lock at count 197: **exactly 3** commit, 3 are refused, count = 200, revisions +3 |
| invoice-cap race | 5 creates queued at 28 invoices: **exactly 2** commit, count = 30, addresses +2 only (no residue from rolled-back creates) |
| independent visitors | 8 interleaved concurrent edits across two sessions all succeed; counters 4/4; each invoice has only its own visitor's edits |
| non-database revision failure | `findLatest` rejects with a plain `Error`: create, edit, pay and restore all return `INTERNAL_SERVER_ERROR` and the **complete** database (users, sessions, invoices, items, revisions, addresses, counters) is unchanged; the control edit then succeeds |
| expiry/revocation/flag during the lock wait | The request waits on the held row lock while the holder revokes, expires or disables; it then fails with `UNAUTHENTICATED` (revoked, expired) or `FORBIDDEN` (disabled), with no change; a wait beyond 2 s → `SESSION_BUSY` |
| admin feed isolation | See section 7 |
| WebSocket | All five operations over a real socket → FORBIDDEN "cannot mutate over WebSocket", zero changes |
| unapproved mutations | All seven, including resolver-less `login`, → FORBIDDEN over HTTP, zero changes |
| off by default | With the flag unset, the credential no longer authenticates, bootstrap → 404, zero changes |
| ordinary and shared demo unchanged | A signed Auth0 USER creates (client ID `OR7777` honoured, as before), edits, pays, restores and deletes; `demo-token` edits the shared RT3080, `resetDemoData` restores it, and visitor rows are untouched |

The harness suite adds *grants exactly the requested operation for one write, and
revokes it when that write settles*. Inside an `edit` write, pay, delete, create,
restore, bulk deletes, user deletion/provisioning and the shared reset are all
refused. A captured service is refused after the write. The database is
unchanged.

## 7. Administrator subscription isolation

Temporary sessions never reach `invoiceResolvers.Mutation.addInvoice`, the only
`pubsub.publish("INVOICE_ADDED")` site (`grep` confirms there is no other
publisher). The coordinated handlers publish nothing, so no event can precede
the commit.

**Test.** A signed ADMIN subscribes to `invoiceAdded` over a real socket.

1. An ordinary user's create (sentinel 1) proves the feed is live.
2. A visitor creates, edits, pays, restores and deletes.
3. A second ordinary create (sentinel 2) arrives.

The in-memory PubSub delivers in order, so any visitor event would precede
sentinel 2; the feed received only sentinels. Visitors' own `invoiceAdded`
subscription is FORBIDDEN. Injected defect N6 (the visitor create publishes) fails
this test.

## 8. Error contract

| Condition | GraphQL `extensions.code` | Message / extra |
| --- | --- | --- |
| Expired or revoked (detected after the lock) | `UNAUTHENTICATED` | "Demo session has expired or is no longer valid" |
| Feature disabled after authentication | `FORBIDDEN` | "Temporary demo sessions are disabled" |
| Session busy (> 2 s lock wait) | `SESSION_BUSY` | retryable |
| Mutation budget | `QUOTA_EXCEEDED` | `quota: "mutations"` |
| Invoice/revision/item limit | `QUOTA_EXCEEDED` | `quota: "workspace"` |
| Invalid input, status, ID, state transition | `BAD_USER_INPUT` | names the field or rule, never the value |
| Missing or foreign invoice/revision | `NOT_FOUND` | fixed "Invoice not found" / "Revision not found" |
| Unapproved mutation; WebSocket write | `FORBIDDEN` | |
| Revision or database failure | `INTERNAL_SERVER_ERROR` | "Demo invoice operation failed" (details only in server logs) |
| HTTP body over 100 KB | HTTP **413** | `{"name":"PayloadTooLargeException","statusCode":413}`, before any context |

A credential that has already expired or been revoked when the request arrives
is still rejected by `createContext`, as in Slice 2. The context is
unauthenticated, so the request never reaches the coordinated handlers, and the
existing resolvers report their generic error. The browser lifecycle should
treat that like `UNAUTHENTICATED`. The 413 mapping matches only
body-parser's `entity.too.large`; every other error keeps its existing handling.
The WebSocket `maxPayload` from 3B.0 is unchanged.

## 9. Validation

| Gate | Result |
| --- | --- |
| Backend `npm run check` (typecheck, lint with zero warnings, unit, build) | Passed; **220 unit** (215 + 5 new) |
| Backend integration, full suite | **235/235** across 9 files (215 baseline + 1 harness + 19 end-to-end) |
| Stability: the three session suites + quota unit file, 5 consecutive runs | 95/95 each run |
| Changed test files under `tsc` (normally excluded) | Existing files: identical diagnostics to the baseline commit. New file: 5, all the pre-existing NodeNext dynamic-import pattern also used by `demoSessions.test.ts`. |
| Frontend `npm run check`, `typecheck:e2e` (source unchanged) | Passed: 119 passed, 2 skipped |
| Browser regression (isolated runner, Chromium) | **35/35 passed** (5.1 min; report `/tmp/invoice-e2e-9GdGIt/playwright-report/index.html`) |
| `git diff --check` | Passed |

**Injected defects.** Each was applied to one file, the targeted suites were
run, and the file was restored and SHA-256 verified.

| # | Defect | Detected by |
| --- | --- | --- |
| N1 | Capability never revoked | harness: 1 failure (unit tests alone do not detect it) |
| N2 | Operation not checked | unit 1, harness 1 |
| N3 | Session/user not checked | unit 1 |
| N4 | Temporary sessions use ordinary resolvers | end-to-end 15/19 |
| N5 | Coordinator grants no capability | end-to-end 14/19 |
| N6 | Visitor create publishes to the admin feed | end-to-end 1 (feed test) |
| N7 | Status allowlist removed | unit 1, end-to-end 1 |
| N8 | 413 mapping removed | transport test |
| N9 | Resolver-less mutations not wrapped | end-to-end 1, session suite 1 |
| N10 | WebSocket rule disabled | end-to-end 1, session suite 2 |
| N11 | Coordinator errors not mapped | end-to-end 7 |

Environment: Node 24.15.0, PostgreSQL 16 (`/usr/lib/postgresql/16/bin`), server
time zone `America/Halifax`, loopback only. Logs are temporary local files, not
repository dependencies, in
`/tmp/claude-1000/-home-djblackett-dev-invoice-web-app/d38ca684-b127-49b3-aeaf-0d0dc2652091/scratchpad/`
(`baseline-integration.log`, `final-integration.log`, `backend-check.log`,
`stability-run-*.log`, `mutants.log`, `frontend-check.log`, `e2e.log`).

## 10. Remaining risks

- **`editInvoice` can still set `status: "paid"` directly**, and can move paid
  back to draft or pending. This is the existing rule for all users; only
  `markAsPaid` enforces pending → paid. Visitors are limited to the three
  recognized values. Whether visitors should be held to the stricter transition
  is a product decision.
- **`createdAt` is never persisted by edits or restores, for any user.**
  `PrismaInvoiceRepository.update` omits it, although the edit form's date picker
  can change it, while `paymentDue` is saved. Canonical snapshots share one
  `createdAt`, and the restore revision records the stored state, so history
  stays accurate. This is pre-existing and left unchanged.
- **Rejected attempts are free.** Validation, busy and quota rejections consume no
  budget. Per-IP throttling is the only bound. Deletion frees invoice and revision
  capacity, so churn is bounded by the 200-mutation budget, not by retained rows.
- **The production app-wide limiter** (100 requests per 15 minutes per IP)
  predates this slice. A normal browsing session with refetches may approach it,
  so it should be checked with the real frontend lifecycle.
- **`lock_timeout` applies to the whole transaction.** A later row-lock or pool
  timeout inside `work` becomes `INTERNAL_SERVER_ERROR`, not `SESSION_BUSY`. There
  is no FIFO fairness among same-session waiters.
- **The capability defends against request data and accidental paths, not
  in-process code.** Any server code can import `issueDemoWriteCapability`. A unit
  test pins the only caller, so a new call site fails CI and gets reviewed.
- **Provisional values** remain unvalidated against the hosted plan: text and
  numeric bounds, 2 s lock wait, 5 s `maxWait`, the 200-mutation budget, and the
  reset allowance and cooldown.
- **Cleanup is manual.** Capacity (100 workspaces) can stay exhausted until
  `cleanupExpiredDemoSessions` runs.
- **The 413 status change applies to all users** (it was 500).

## 11. What Slice 3C must implement before public rollout

1. **Temporary-session reset.**
   - Extract the canonical seeding used by allocation into one shared function.
   - Run the reset through `runDemoSessionWrite(kind: "reset")` with its own
     capability operation, deleting invoices *and* addresses, then reseeding.
   - Never use `resetDemoWorkspace` or lock 8372401.
   - Test cooldown, allowance and budget, rollback, and concurrency with writes
     and cleanup.
2. **Browser session lifecycle.**
   - Bootstrap and persist the credential, attach it to HTTP and WebSocket, and
     reconnect the WebSocket when it changes.
   - Clear the Apollo cache on entry, exit, replacement and expiry.
   - Stop the shared reset on temporary entry, and route by full invoice ID.
   - Handle `UNAUTHENTICATED` (re-bootstrap), `SESSION_BUSY` (retry with backoff),
     `QUOTA_EXCEEDED` (show which limit), `BAD_USER_INPUT` and 413.
   - Add browser end-to-end tests for this lifecycle.
3. **Automatic cleanup scheduling**, with monitoring of capacity and quota
   rejections.
4. **Rollout decisions and checks.**
   - Validate the provisional values against the hosted pool and plan, the
     ingress/proxy chain for the per-IP limiter (`trust proxy` 1), and the
     production limiter against real usage.
   - Decide on direct `status: "paid"` edits for visitors, and on whether rejected
     attempts should consume budget.
5. **Deployment, in order.** Deploy the two additive migrations, then enable the
   flag in a non-public environment first. This is a separate, explicitly approved
   action.

Readiness for public rollout is not claimed by this slice.
