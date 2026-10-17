# Slice 4C — Legacy User API security

Date: 2026-10-17 (America/Halifax).

## 1. Baseline and Scope

Branch `portfolio-stabilization`, initially clean. Actual starting HEAD
`61a778cc1219fe5e25ae703a8e066510f0ee538d` is one commit beyond requested
`05fe4dff6232faeb8eb8f4fac84bb8132cb70bde`; the additional commit contains only
`docs/audit/slice-4b-adversarial-demo-review.md`. Application baseline is identical.
Read the requested stabilization plan and Slice 2B, 3B, 4A, 4B and adversarial
reports; inspected current code/tests. This slice addresses AUTHZ-F01 / DEMO-F01
and three permanent Demo regressions. No invoice policy/domain, Demo architecture,
Auth0 verification, schema, dependency or frontend changes.

## 2. Existing User GraphQL Surface

Recorded before production edits. Paths are relative to `invoice-backend/`.
`src/GraphQL/typeDefs.ts` exposes `User { id: String!, username: String! }`.
Neither field is designated public; username is often an email address.

| Existing path | Before authorization |
| --- | --- |
| `Query.allUsers` → `getUserResolvers().Query.allUsers` → `UserService.getUsers` → `PrismaUserRepository.getAllUsers` | Service requires caller ID, no role check. USER and Demo enumerate all users. |
| `Query.getUserById(id)` → `getUserByIdSafely` → repository same method | No service identity/role check. Any authenticated context with services reads any ID. |
| `Mutation.createUser(name, username, password)` → `UserService.createUser` → repository same method | No identity/role check. Creates unrelated local USER with generated ID. Repository forces USER; password is hashed then discarded by repository and is not a login credential. |
| `Mutation.deleteUsers` → `UserService.deleteUsers` → `deleteAllUsers` | Resolver requires ADMIN; service only requires ID. Direct USER service calls bypass resolver. Cascades invoices/history. |
| `Mutation.deleteUsersKeepAdmins` → `deleteUsersKeepAdmin` → `deleteAllUsersKeepAdmin` | ADMIN required in resolver/service. Deletes all non-ADMIN users and cascades their invoices/history. |
| `Query.me`, `Mutation.login` | Declared, no resolver, return null. No reachable custom login implementation. |
| `UserService.getUser(id)` | Unreferenced service method; any authenticated caller could read any ID. |
| `UserService.createUserWithAuth0(args)` | Only HTTP context provisioning calls it; no service authorization, trusts supplied subject/role/profile. |

No user update, individual deletion or role-assignment mutation exists. Only
`getUserById` accepts an ID. `createUser` accepts neither ID nor role: GraphQL rejects
unknown arguments. Internal Auth0 provisioning takes ID/role. Unauthenticated real
contexts lack request services, yielding generic internal errors on the first three
operations before repair. Repositories remain internal persistence primitives.

## 3. Auth0 Provisioning Dependencies

HTTP `src/GraphQL/createContext.ts:createContext` → `getUserFromRequest` →
`retrieveUserFromToken` → RS256/JWKS `verifyToken` → `extractUserFromPayload` →
`setupContainer` binding verified identity → `getServices` → `getOrCreateDbUser` →
`UserService.getUserByIdSafely(user.id)` → if missing, `createUserWithAuth0` →
repository insert. Auth0 `sub` is the local primary key; namespaced email/roles supply
initial metadata/role. Existing rows retain stored metadata/role. Dedicated Demo
credentials/marker can lazily provision their own USER. WebSocket context uses
verified token identity without HTTP local-user provisioning.

Auth0 **does not depend on legacy Mutation.createUser**. Frontend
`src/features/auth/components/Auth0ProviderWrapper.tsx` delegates login/token
retrieval to Auth0; `src/features/shared/hooks/useApolloClient.ts` sends the token.
No frontend `allUsers`/`getUserById` query/caller exists. `CREATE_USER` in
`src/features/invoices/graphql/invoice.queries.ts` and `LOGIN` in
`src/features/users/graphql/user.queries.ts` are unused documents.

## 4. Intended Authorization Matrix

| Operation | Unauthenticated | USER | Demo USER | ADMIN |
| --- | --- | --- | --- | --- |
| allUsers | UNAUTHORIZED | FORBIDDEN | FORBIDDEN | Allow |
| getUserById / getUser | UNAUTHORIZED | Own only | Own only | Any |
| legacy createUser | UNAUTHORIZED | FORBIDDEN | FORBIDDEN | Create ordinary USER only |
| deleteUsers / deleteUsersKeepAdmins | UNAUTHORIZED | FORBIDDEN | FORBIDDEN | Existing bulk behavior |
| Internal provisioning | Deny | Verified own subject | Dedicated Demo subject | Verified own subject |

Foreign/missing private profiles use identical `NOT_FOUND: User not found`.
Management checks reject a demo marker or reserved demo ID even with ADMIN drift.
No public profile metadata policy is introduced.

## 5. Regression Tests Added First

Added `tests/integration/userApiSecurity.test.ts` before production changes. Its
initial 34-case baseline was **12 passing / 22 failing**, after correcting a fixture
that initially omitted required invoice fields. The failures demonstrate USER/Demo
enumeration, foreign-profile reads, unrelated creation, missing direct-service
checks, inconsistent authorization errors, arbitrary internal provisioning and a
concurrent first-login insert race. No `.fails`, skips or weakened assertions.
Two additional cases verify initial-role injection and forged/unauthenticated
service contexts, for **36 User API tests** in the final suite.

Both suites use real Prisma/PostgreSQL, real GraphQL resolvers/services and
production-mode `createContext`; only the primary Prisma binding is replaced with
a client targeting a generated schema. Auth0-style tokens are actually signed and
verified against a local RSA/JWKS server. No mocked authorization or external Auth0
credentials. An explicit disposable DATABASE_URL is required before production
modules can load dotenv. Schema cleanup and environment restoration run in teardown.

Coverage includes USER A, USER B, ADMIN, Demo, anonymous callers; own metadata,
foreign-versus-missing equality, all reachable user mutations, direct service calls,
role/ID argument rejection, generated USER-only administrative creation, Auth0
first/repeat/concurrent login, stored roles, reserved Demo identity, duplicate-email
refusal and complete user/invoice/revision preservation on denial.

Three Demo cases were also written before production edits. All passed against the
unchanged application, confirming the independently demonstrated defenses. The
original 39 Demo cases remain unchanged; only the token helper gains optional extra
claims, and the fixture helper is imported. A byte comparison confirms all existing
Demo describe blocks, authorization tests and invariant tests are unchanged.
**39 tests added overall: 36 User API + 3 Demo.**

## 6. Legacy User API Repairs

- `src/services/user.service.ts`: small private authentication, ADMIN and profile
  guards centralize the policy. Directory/legacy creation/both bulk deletions require
  a non-Demo ADMIN. Both profile methods check self-or-ADMIN before repository reads.
  Guards run outside existing validation/database catch blocks so denials retain
  their error type. Direct service calls enforce the same rules as GraphQL.
- `src/resolvers/userResolvers.ts`: require authenticated context and map existing
  UnauthorizedException / ForbiddenException / NotFoundException to UNAUTHORIZED /
  FORBIDDEN / NOT_FOUND. Missing and inaccessible profiles have the identical
  `User not found` contract. Existing validation/internal error behavior remains.
  Privileged policy lives in the service; duplicate resolver ADMIN checks are removed.
- `UserService.createUserWithAuth0`: require the supplied subject to equal the
  authenticated subject, derive all persisted fields from bound identity, reject
  ordinary JWT provisioning of demoId and reject Demo provisioning of other subjects.
  Verified Auth0 ADMIN claims can still establish an initial ADMIN; legacy GraphQL
  creation can only create USER and accepts neither ID nor role.
- `src/repositories/implementations/prismaUserRepo.ts:createUserWithAuth0`: upsert
  by subject with an empty update. Existing metadata/role remain untouched. Prisma
  6.2.1 can race on this empty-update upsert, so the awaited P2002 catch reads only
  that same subject and returns its completed row. A different subject with an
  existing email still fails. No account lookup by matching email is used to claim
  another identity. The awaited call also makes the existing catch effective.
- `src/GraphQL/createContext.ts`: after HTTP provisioning/loading, rebind only
  UserService to the effective returned HTTP user. This preserves stored ADMIN
  oversight and the Demo USER override consistently at resolver/service boundaries.
  Initial provisioning still uses verified token identity. Invoice/revision/Demo
  service bindings and token verification are unchanged. WebSocket UserService uses
  its existing verified token identity, matching its returned context.

No new user-management features, role mutation, repository authorization framework,
custom login/password handling, schema migration or frontend changes.

## 7. Signed JWT Demo-Spoofing Regression

**PASS.** A valid locally signed RS256 JWT with `sub: demoId`, `role: USER` and
`isDemo: true` passes real verification, but returned context has no Demo marker.
`resetDemoData` returns FORBIDDEN. All users, invoices/items, revisions and address
rows remain identical; the noncanonical one-invoice Demo fixture stays unchanged,
proving that no canonical reset occurred. Real-user rows are included in equality.
No authentication model, marker or token changes were needed.

## 8. WebSocket Stale-Role Regression

**PASS.** Persist demoId/ADMIN in PostgreSQL, explicitly enable Demo Mode and build
real subscription context through `createContext({ connection })` using the normal
Demo credential. Effective user remains demoId/USER/isDemo. The real
`getInvoiceResolvers().Subscription.invoiceAdded.subscribe` throws FORBIDDEN before
calling the real pubsub iterator (observed with a spy). HTTP context also remains
USER. This tests actual context construction and resolver authorization, rather
than a complete network WebSocket handshake or a mocked role.

## 9. Concurrent Demo Reset Regression

**PASS.** Five concurrent `resetDemoData` GraphQL operations all return true. Exactly
seven unique canonical Demo invoice IDs remain. Each complete persisted invoice
snapshot, every revision snapshot, contiguous revision numbers and authors match
`prisma/demoWorkspace.cjs:canonicalDemoRecords()`. Revision count is derived from
the fixture and independently asserted as **11** (six create snapshots plus
RT3080's five), correcting the request's nine-revision assumption. The adversarial
report itself also records eleven. Real users, invoices/items/addresses and revisions
remain identical; stored demoId is repaired from ADMIN to USER. The existing
transaction/advisory lock/reset code is untouched.

## 10. Previously Closed Suite Results

| Check | Result |
| --- | --- |
| Backend unit | 116/116 pass, 12 files |
| Invoice authorization | 45/45 pass |
| Invoice invariants | 21/21 pass |
| Backend Demo Mode | 42/42 pass (39 prior + 3 new) |
| User API security, separately | 36/36 pass |
| Full backend integration | 158/158 pass, 6 files (119 prior + 39 new) |
| Backend default typecheck | Pass, exit 0 |
| Explicit source + both security-test typecheck | Pass, exit 0 |
| Frontend serial (extra compatibility check) | 111 pass, 2 existing skips, 22 files |

No earlier assertions were relaxed. Frontend source/tests/config are unchanged;
frontend-wide type/lint and Playwright repairs were not attempted.

## 11. Auth0 Compatibility Verification

Local verified-JWT integration proves first-login USER and ADMIN provisioning,
stable `sub` → local ID mapping, subsequent login, exactly one row after five
concurrent first requests, preservation of stored profile/role, self metadata and
ADMIN oversight/creation/deletion. Forged internal subject, role/profile arguments,
dedicated Demo identity provisioning by ordinary JWT, and duplicate-email subject
claims are rejected or ignored safely. Dedicated Demo lazy provisioning remains
covered by the unchanged Demo suite.

Auth0 login still automatically provisions in createContext. Restricting legacy
createUser therefore does not disable first login. No real Auth0 tenant, Universal
Login redirect, browser token acquisition/refresh or deployment credentials were
exercised. A live configured Auth0 sign-in smoke test remains a release follow-up;
local cryptographic/context/provisioning compatibility is verified.

## 12. Unexpected Findings

- Documentation-only baseline commit noted above; no application divergence.
- Concurrent first-login inserts failed before repair. A plain empty-update Prisma
  upsert alone still failed one case; same-subject P2002 recovery closes that race
  without overwriting existing data or claiming an email-owned account.
- HTTP context returns stored roles while services were bound to token roles.
  Rebinding UserService alone avoids introducing a stricter token-only management
  policy for stored ADMINs. Existing invoice authorization is deliberately untouched.
- Canonical history is eleven, not nine; the test checks actual fixture contents.
- The first test attempt failed in fixture setup; required fields were corrected
  before recording the real failing authorization baseline. No production workaround.
- Local PostgreSQL initially could not bind a loopback socket under sandboxing;
  approved escalation enabled disposable local database/JWKS/HTTP testing.

## 13. Unresolved Risks or Follow-ups

AUTHZ-F01 / DEMO-F01 is closed for the reachable legacy User API and direct service
entry points. ADMIN-only bulk deletion retains its existing destructive cascade
semantics; no new management operation/UI was added. Legacy createUser still takes
an unused password parameter and creates a local record without Auth0 credentials;
retiring that unused administrative surface can be a later cleanup, not a new login
implementation. Repositories remain trusted internal persistence APIs.

Deferred findings remain: nullable createdBy mutation responses, canonical ID
availability conflict and shared Demo visitor interference; also the existing
malformed WebSocket header and local Compose build issues from the adversarial
review. No repairs to those paths. Existing normal HTTP/stored versus WebSocket/token
role semantics and invoice service role semantics are preserved, not redesigned.
Live Auth0 sign-in smoke verification remains outstanding as described above.

## 14. Exact Verification Commands

Only a new PostgreSQL 16.13 cluster under /tmp was used. Node 24.15.0 and installed
package dependencies; no network package installation or production/developer data.
Initial socket startup failed under sandbox; approved escalated retry succeeded.

```bash
mkdir -p /tmp/portfolio-slice4c
/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice4c/pgdata -U postgres --auth=trust > /tmp/portfolio-slice4c/initdb.log
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice4c/pgdata -l /tmp/portfolio-slice4c/postgres.log -o '-p 55440 -k /tmp/portfolio-slice4c -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55440 -U postgres user_security
```

From `invoice-backend`:

```bash
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
export DATABASE_URL=postgresql://postgres@127.0.0.1:55440/user_security NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
npx --no-install vitest run tests/integration/userApiSecurity.test.ts tests/integration/demoMode.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration/userApiSecurity.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install tsc --noEmit
npx --no-install tsc --noEmit -p tsconfig.security.tmp.json
npx --no-install vitest run tests/unit --reporter=default
npx --no-install vitest run tests/integration/authorization.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration/invoiceInvariants.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration/demoMode.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
```

The first combined run exposed the new User fixture error while all 42 Demo tests
passed before production changes. The separate User command was rerun after fixture
correction to capture 12 pass / 22 fail, then after repairs for the final 36 pass.
The first repaired run was 33 pass / 1 fail (upsert race); after same-subject recovery
all passed. Raw logs remain under `/tmp/portfolio-slice4c/`:
`before-security.log`, `before-user-security.log`, `user-security.log`, `unit.log`,
`authorization.log`, `invariants.log`, `demo.log`, `integration.log`, `typecheck.log`,
`security-types.log`, `frontend-serial.log`.

Default tsconfig excludes tests. Temporary config (removed after verification):

```json
{"extends":"./tsconfig.json","include":["src/**/*.ts","tests/integration/userApiSecurity.test.ts","tests/integration/demoMode.test.ts"],"exclude":["node_modules","dist","src/mocks"]}
```

From `invoice-frontend`, with the same installed Node PATH:

```bash
npx --no-install vitest run tests --reporter=default --no-file-parallelism
```

Finalization from root:

```bash
/usr/lib/postgresql/16/bin/psql -h 127.0.0.1 -p 55440 -U postgres -d user_security -Atc "SELECT count(*) FROM pg_namespace WHERE nspname LIKE 'user_security_%' OR nspname LIKE 'demo_contract_%' OR nspname LIKE 'authz_%' OR nspname LIKE 'invariants_%';"
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice4c/pgdata stop -m fast
rm invoice-backend/tsconfig.security.tmp.json
git diff --check
git diff --cached --check
git commit -m "fix(auth): restrict legacy user operations and strengthen demo regressions"
git status --short
git rev-parse HEAD
```

Generated-schema query returned **0**; the disposable PostgreSQL cluster shut down
cleanly. Temporary typecheck configuration removed. Final whitespace/diff checks pass.

## 15. Files Changed and Commit Summary

Production files:

- `invoice-backend/src/services/user.service.ts`
- `invoice-backend/src/resolvers/userResolvers.ts`
- `invoice-backend/src/repositories/implementations/prismaUserRepo.ts`
- `invoice-backend/src/GraphQL/createContext.ts`

Tests/documentation:

- `invoice-backend/tests/integration/userApiSecurity.test.ts` (new)
- `invoice-backend/tests/integration/demoMode.test.ts` (three appended regressions)
- `docs/audit/slice-4c-user-api-security.md` (this report)

Focused local commit: `fix(auth): restrict legacy user operations and strengthen demo regressions`.
The commit hash and final working-tree status are reported in the task response.
No push, merge or deployment. Only the seven intentional files are included.
