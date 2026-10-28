# Public demo, Slice 3C: reset, cleanup and session lifecycle (backend)

Baseline: branch `public-demo/slice-3b0-integration`, HEAD `53da11b` (Slice 3B.2),
clean working tree. Changes are local and uncommitted. Nothing was deployed, no
hosted credentials or flags were touched, and `DEMO_SESSIONS_ENABLED` stays off by
default. The browser lifecycle is Slice 4 and is not started.

## 1. Files changed

Source (`invoice-backend/`):

| File | Change |
| --- | --- |
| `prisma/schema.prisma`, `prisma/migrations/20261028000000_add_demo_session_cleanup_marker/migration.sql` | Nullable `DemoSession.cleanupFailedAt` (additive; the **fourth** additive migration to deploy before enabling the flag) |
| `src/services/demoWorkspaceData.ts` (new) | `insertCanonicalWorkspace` (extracted from allocation) and `clearWorkspace` (shared by reset and cleanup) |
| `src/services/demoSessionReset.ts` (new) | `resetDemoSession`: the reset as a `kind: "reset"` coordinated write |
| `src/services/demoSessionWrite.ts` | `work` also receives the transaction client; the cooldown error carries `retryAfterMs` |
| `src/services/demoSession.service.ts` | Allocation-time cleanup, per-workspace savepoints, damaged-candidate marking, operator report function |
| `src/services/demoSessionPolicy.ts` | `DemoCredentialError` (stable 401/503 errors) |
| `src/GraphQL/createContext.ts` | Temporary credentials resolve to a user or a `DemoCredentialError` (N1) |
| `src/GraphQL/typeDefs.ts`, `src/resolvers/demoResolvers.ts`, `src/resolvers/demoSessionMutations.ts` | `resetDemoSession` mutation, its denial for everyone else, reset error mapping |
| `scripts/cleanup-demo-sessions.cjs`, `package.json` | Explicit operator cleanup (`npm run demo:cleanup`) |

Tests: `tests/integration/demoSessionLifecycle.test.ts` (new, 19 tests) and
`tests/integration/demoSessions.test.ts` (updated for the new semantics; 22 tests).

## 2. Reset: authorization and transaction flow

`mutation { resetDemoSession }` returns `Boolean!`. It accepts no arguments, so a
caller cannot name a target user or session.

1. **Authentication.** The bearer credential must resolve to a live temporary
   session (section 4). Ordinary Auth0 users, administrators, the shared demo user
   and anonymous callers reach the ordinary resolver, which refuses with `FORBIDDEN`.
   The legacy `resetDemoData` stays unreachable for temporary sessions, and
   `resetDemoWorkspace` is never called on temporary data (the new code does not
   import it).
2. **Admission, before any data moves.** HTTP only (WebSocket temporary
   credentials are refused at `connection_init`); one root field per request
   (`SINGLE_MUTATION_REQUIRED`, aliases included).
3. **Coordinator**, unchanged lock order: a write slot (at most two open writes
   per session), then the `DemoSession` row `FOR UPDATE` (2 s lock timeout),
   then revalidation of expiry, revocation, flag and ownership on the database
   clock. Then the attempt is counted (400 lifetime), a savepoint is taken, and
   the checks run: 200-change budget, five-reset allowance, two-minute cooldown.
4. **Replacement.** In that savepoint: delete this user's invoices (items and
   revisions cascade) and the addresses they referenced that no other invoice
   references; rebuild the seven canonical invoices and eleven revisions with new
   invoice, item and revision IDs (and new item IDs inside snapshots). The owner
   is the scope's identity from the locked row, not the request. Quotas are
   re-measured, then `mutationCount`, `resetCount` and `lastResetAt` are updated.
5. **Commit or roll back.** Any failure rolls back to the savepoint, so the old
   workspace survives intact and only the attempt is recorded. A failed reset
   neither starts the cooldown nor spends the allowance.

Budgets: a reset costs one attempt and one change, and nothing resets a counter
anywhere (`mutationCount`, `attemptCount`, `resetCount` only increase). A visitor
with no change budget left cannot reset.

Stable errors: `RESET_COOLDOWN` (with `retryAfterSeconds`),
`QUOTA_EXCEEDED` with `quota: "resets" | "mutations" | "attempts"`,
`SESSION_BUSY`, `UNAUTHENTICATED`, `FORBIDDEN`.

**Slice 4 must know:** a reset replaces every internal invoice ID
(`RT3080-<uuid>`). The visible number is unchanged, but any cached invoice,
Apollo cache entry, open invoice route or edit form refers to rows that no
longer exist. After a successful reset the browser must clear the Apollo cache
and return the visitor to the dashboard.

## 3. Cleanup: triggering, locking, capacity

There is no worker, no scheduled polling and no keep-alive. Physical deletion
happens in exactly two places:

1. **At allocation** (`POST /demo/sessions`, when enabled). After taking the
   global advisory lock 8372402, allocation reclaims up to **5** expired
   workspaces, then applies the capacity and rate checks. A refusal
   (`CAPACITY`, `RATE_LIMITED`) is returned, not thrown, so the reclaimed space is
   committed anyway. An unexpected database failure rolls back everything.
2. **On an explicit operator run** of `npm run demo:cleanup -- [--max-passes N]`
   (after `npm run build`): passes of up to 10, at most 50 passes, stops when a
   pass reclaims nothing, prints counts only, exits 2 if candidates are failing.
   It works whether or not temporary sessions are enabled.

Eligibility: `expiresAt <= clock_timestamp()` on the database clock, a session
row linked to a `demo-session:` user. Revoked but unexpired sessions are **not**
reclaimed until they expire; live sessions, ordinary users, unlinked users and the
shared demo are never candidates.

Locking (global lock, then session row, then data rows, the established order):
candidates are `FOR UPDATE SKIP LOCKED`, so a session with an admitted write or
reset is skipped, never deleted underneath it, and cleanup never waits on a write
while holding the global lock. A write queued behind a cleanup that then deletes the
session finds no row and returns `UNAUTHENTICATED`. Writes and resets never take
the global lock.

Damaged workspaces: each is reclaimed under its own savepoint. On failure
(foreign revision author, unexpected ownership, a failing delete) it is rolled
back intact, logged by session ID only, and stamped `cleanupFailedAt`.
Candidates sort never-failed first, then oldest expiry, so damaged workspaces
cannot occupy the batch ahead of healthy ones. A persistently damaged workspace
stays and keeps counting against capacity until an operator repairs it.

**Capacity:** 100 retained sessions, counting live, revoked and not-yet-reclaimed
expired ones. If every slot holds an unexpired session, allocation returns `503`
`DEMO_SESSIONS_CAPACITY` and evicts nothing; the next allocation after any session
expires succeeds, because that allocation reclaims it. If nobody allocates,
nothing is deleted: expired data (at most 100 workspaces) simply waits. That is
the resource bound when no cleanup has occurred.

## 4. Expiry and error handling (N1)

Cause: a stale credential resolved to "no user", and the resolvers report an
anonymous caller as `INTERNAL_SERVER_ERROR`.

Now, for any request presenting a `demo-session…` credential:

| Situation | HTTP | `extensions.code` |
| --- | --- | --- |
| Expired, revoked, reclaimed, unknown, malformed, truncated, or feature disabled | 401 | `UNAUTHENTICATED` |
| Session store unreachable (or context cannot be built for a resolved session) | 503 | `SERVICE_UNAVAILABLE` |
| Expired/revoked/reclaimed while a write waits for its lock | 200 | `UNAUTHENTICATED` (unchanged) |
| Flag switched off while a write waits | 200 | `FORBIDDEN` (unchanged) |

The 401 message is fixed (`Demo session has expired or is no longer valid`); it
never reveals which case applied, the credential, its hash or database text. A
503 means the credential may still be valid, so the browser should keep it and
retry. Neither path creates a session or falls through to another identity, and a
disabled flag fails closed. Ordinary Auth0, administrator and legacy-demo
authentication is untouched, including their existing (poor) behaviour for bad
tokens, which is pinned by a test.

Under vitest only, Apollo prefixes `Context creation failed: ` to this message
because two copies of `graphql` are loaded and its `instanceof` check fails. The
compiled build was smoke-tested and returns the plain message with HTTP 401.

## 5. Evidence

Reset isolation and rollback (all in `demoSessionLifecycle.test.ts`, over the
production HTTP wiring):

- Content after reset equals the content at allocation (invoices, items, addresses,
  revisions, messages, timestamps, snapshots), with no invoice, item, revision or
  snapshot-item ID retained, and no ID shared with any other workspace.
- Two visitors, an ordinary user and the legacy shared demo workspace: byte-identical
  rows and counters before and after another visitor's reset; B then resets independently.
- Ordinary, admin, shared-demo and anonymous callers are refused with zero database
  change; `resetDemoSession(userId: …)` fails validation; alias-doubled resets are
  refused before any transaction; WebSocket is refused (4403).
- Faults injected into a revision insert, an item insert and an address delete
  leave the whole database equal to the pre-reset snapshot, with only the attempt
  counted and no cooldown consumed.
- Races: reset against an edit (either order ends canonical, no double spend), two
  simultaneous resets (one `RESET_COOLDOWN`), a reset waiting while the session is
  revoked, expired or the flag is switched off, a reset in flight while the session
  expires (cleanup skips it, then reclaims it fully), and reset against cleanup.
- Budgets: counters rise by exactly one attempt and one change per reset, never fall;
  the 200th change and 400th attempt are usable by a reset and the next is refused.

Defect injection (twelve mutants, each validated to parse; all detected): clearing
every invoice, refunding budgets, skipping the cooldown, leaking address rows, reusing
invoice IDs, cleaning revoked sessions, dropping the damaged-marker ordering, waiting
on locks, reverting N1, reporting database failure as `UNAUTHENTICATED`, letting one
damaged workspace abort a pass, and discarding cleanup on refusal.

## 6. Test results (disposable local PostgreSQL 16, non-UTC server timezone, run sequentially)

| Gate | Result |
| --- | --- |
| Backend `npm run check` (typecheck, lint, unit, build) | pass; 15 files, 226 tests |
| Backend `npm run test:integration` | pass; 10 files, 272 tests |
| Frontend `npm run check` | pass; 23 files, 119 passed, 2 skipped (pre-existing) |
| Browser `npm run test:e2e` | pass; 35 Chromium cases |
| Compiled-build smoke: stale token, reset, cooldown, operator script | as described above |

Existing tests changed because behaviour changed on purpose: stale credentials now
assert `UNAUTHENTICATED` rather than a null user; the capacity test uses unexpired
sessions (expired ones are now reclaimed); the cleanup tests assert per-workspace
isolation instead of a whole-pass failure.

## 7. Remaining work for browser integration (Slice 4)

- Bootstrap and persist the credential; HTTP only for writes, no WebSocket for
  temporary sessions.
- On `UNAUTHENTICATED`: drop the credential, clear the Apollo cache, bootstrap a
  new session. On `SERVICE_UNAVAILABLE` or `SESSION_BUSY`: keep the credential and
  retry with backoff.
- Reset button: confirm, call `resetDemoSession`, then clear the Apollo cache and
  forms and return to the dashboard (IDs changed); handle `RESET_COOLDOWN`
  (`retryAfterSeconds`) and `QUOTA_EXCEEDED` (`resets`, `mutations`, `attempts`).
- Handle `QUOTA_EXCEEDED`, `BAD_USER_INPUT`, 413 and `SINGLE_MUTATION_REQUIRED`.
- Browser end-to-end tests for this lifecycle. A session-status query (resets and
  changes remaining) does not exist; add one if the UI should show allowances.

## 8. Remaining operational requirements before deployment

- Deploy all **four** additive migrations (3A, 3B.1, 3B.2 and this one) before
  enabling the flag, in a non-public environment first. Separate, explicitly
  approved action; not done here.
- Cleanup runs only on allocation and operator invocation. Decide whether an
  occasional operator run is enough, and monitor capacity (`503`
  `DEMO_SESSIONS_CAPACITY`), `cleanupFailedAt IS NOT NULL` rows and the
  `Demo workspace cleanup failed for session …` log line.
- Validate on the hosted pool and plan, which was not measured here: reset latency
  (dozens of statements, not measured; the limit is the 10 s transaction timeout, and a timeout
  cannot record its attempt), allocation latency with a 5-workspace sweep under the
  global lock, the 2 s lock wait, pool pressure, and the per-IP limiter behind
  `trust proxy` 1.
- Unchanged from 3B.2: direct `status: "paid"` edits, `createdAt` not persisted by
  edits, refusals before admission are free, the capability is not a sandbox.
- Readiness for public rollout is not claimed by this slice.
