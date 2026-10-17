# Slice 2A — authorization regression tests

Date: 2026-10-17 (America/Halifax, client date).

## Baseline and scope

Branch: `portfolio-stabilization`. HEAD before changes:
`5cf6da73cc746a3d966dd304b9610c2775da0468`. Initial working tree clean.
Reviewed repository archaeology, runtime verification, portfolio stabilization plan,
and Slice 1 baseline verification before implementation.

Files added (no existing files modified):

- `invoice-backend/tests/integration/authorization.test.ts` — **25 tests**.
- `docs/audit/slice-2a-authorization-regression-tests.md` — this report.

No production authorization code was modified. No repository, service, resolver,
authentication, Demo Mode, totals, ID, transition, or frontend implementation was
changed. No dependencies, lockfiles, shared test configuration, or existing tests
were changed. No push, merge, or deployment.

## Harness and test data

Apollo `executeOperation` executes the real production schema and merged resolver
map, real InvoiceService/InvoiceRevisionService, real Prisma repositories, and
PostgreSQL. Only the authenticated context is supplied directly, with fresh real
services for each operation. There are no mocked repositories or authorization
methods. This tests the GraphQL authorization boundary, not HTTP transport, JWT
verification, or production context construction. The existing test-mode context
uses a single ADMIN identity, so it cannot establish this USER isolation matrix.

The suite requires an explicitly supplied PostgreSQL `DATABASE_URL`; it has no
localhost fallback and does not load dotenv. It creates a unique `authz_<uuid>`
schema by setting the URL's `schema` search parameter (preserving other parameters).
`prisma migrate deploy` and the injected Prisma client receive the same schema URL.
Cleanup drops only that generated schema and disconnects, including on assertion
failures. No production test-harness change was necessary. The older suites retain
their pre-existing database setup limitations, so the full suite is run serially
against a disposable database as requested.

No DATABASE_URL was initially exported in this execution environment. A fresh local
PostgreSQL 16 cluster was created under `/tmp/portfolio-slice2a`, listening only on
127.0.0.1:55433, with database `authorization`, and its URL explicitly supplied to
the commands below. The normal local database and Slice 1 cluster were not used.

| Actor | ID | Role | Invoice |
| --- | --- | --- | --- |
| User A | `authz-user-a` | USER | `AA1001` |
| User B | `authz-user-b` | USER | `BB1001` |
| ADMIN | `authz-admin` | ADMIN | Exercises B's invoice |

Each test recreates both invoices, their addresses/items, and two revisions.
Invoices are complete and `pending`, with one item (quantity 1, price/total 100).
Revision 1 contains `<owner> original client`; revision 2 and the live invoice
contain `<owner> current client`. This makes edits, diffs, and restoration observable
without exercising draft-to-paid, ID generation, or total-invariant defects.
Fixtures use direct Prisma writes; tested operations always use GraphQL.

Denied operations assert no returned protected data and unchanged persisted invoice,
items, addresses, and revision history. Soft assertions preserve both response and
write-side evidence when a vulnerable operation succeeds. Positive tests assert
actual content/status, deletion acknowledgement and row removal, revision data,
append-only restoration, revision actor attribution, and unchanged `createdById`.
ADMIN edit/restore preserve B's ownership while recording ADMIN as revision author.

## Authorization matrix and passing tests

Each cell is one test. USER-other deletion also has a separate error-contract test.

| GraphQL operation | USER own (allow) | USER other (deny) | ADMIN other (allow) |
| --- | --- | --- | --- |
| `getInvoiceById` | PASS | FAIL: data exposed | PASS |
| `editInvoice` | PASS | FAIL: write and revision persisted | PASS |
| `markAsPaid` | PASS | FAIL: pending becomes paid | PASS |
| `removeInvoice` | FAIL: valid deletion blocked | PASS: write blocked | FAIL: valid deletion blocked |
| `invoiceRevisions` | PASS | FAIL: history exposed | PASS |
| `invoiceRevision` | PASS | FAIL: snapshot exposed | PASS |
| `invoiceRevisionDiff` | PASS | FAIL: diff exposed | PASS |
| `restoreInvoiceRevision` | PASS | FAIL: restoration and revision persisted | PASS |

**15 passing new tests:** seven USER-own operations and seven ADMIN-other operations
(all except deletion), plus USER-other deletion denial with database preservation.
Positive test names follow `<suite> > allows <GraphQL operation> and preserves ownership`,
where suites are `USER A accessing own invoice` and `ADMIN accessing USER B`.
The passing denial test is
`USER A accessing USER B > denies removeInvoice without exposing or changing USER B data`.

Cross-user deletion's security boundary is tested separately from the plan's
`NOT_FOUND` response contract. The contract remains a normal failing test; it was
not relaxed to match the implementation. No `.fails`, `.skip`, or expected-failure
wrapper masks the red tests.

## Exact intentionally failing tests and evidence

All names below are in `tests/integration/authorization.test.ts`.

| Exact suite > test name | Observed failure | Relationship to prior runtime evidence |
| --- | --- | --- |
| `USER A accessing USER B > denies getInvoiceById without exposing or changing USER B data` | Returns B's invoice without errors, rather than null plus NOT_FOUND. | Reproduces cross-user invoice read defect. |
| `USER A accessing USER B > denies editInvoice without exposing or changing USER B data` | Returns success; B's client name becomes `Edited client`; revision 3 attributed to A is persisted. | Reproduces cross-user edit defect. |
| `USER A accessing USER B > denies markAsPaid without exposing or changing USER B data` | Returns success; B's status changes from pending to paid. | Reproduces cross-user payment-status defect. |
| `USER A accessing USER B > denies invoiceRevisions without exposing or changing USER B data` | Returns both B revisions and snapshot client names without errors. | Reproduces boxing1 revision-list defect with ordinary users instead of demoId/user1. |
| `USER A accessing USER B > denies invoiceRevision without exposing or changing USER B data` | Returns B's revision 1 snapshot without errors. | Same unscoped revision-access defect; direct ordinary-user single-revision evidence added here. Prior report does not show a distinct response excerpt for this operation. |
| `USER A accessing USER B > denies invoiceRevisionDiff without exposing or changing USER B data` | Returns B's before/after client names and revision IDs without errors. | Same unscoped revision-access defect; direct ordinary-user diff evidence added here. Prior report mentions diff exposure but does not show a distinct response excerpt. |
| `USER A accessing USER B > denies restoreInvoiceRevision without exposing or changing USER B data` | Returns success; B's original client name is restored and revision 3 attributed to A is persisted. | Reproduces boxing1 cross-user restoration defect. |
| `USER A accessing USER B > returns NOT_FOUND for cross-user removeInvoice` | Returns `INTERNAL_SERVER_ERROR`, message `Invoice could not be removed`, instead of `NOT_FOUND` / `Invoice not found`. | Existing deletion error behavior, now tested against the stabilization plan's explicit non-enumerating contract; no successful unauthorized deletion. |
| `USER A accessing own invoice > allows removeInvoice and preserves ownership` | Returns `INTERNAL_SERVER_ERROR`; no acknowledgement; invoice and two revisions remain. | Reproduces previously confirmed USER-own deletion defect. |
| `ADMIN accessing USER B > allows removeInvoice and preserves ownership` | Same error; B's invoice and two revisions remain. | Reproduces previously confirmed ADMIN-other deletion defect. |

## Findings and limits

No authorization behavior contradicted the previous runtime audit. In particular,
cross-user deletion is already blocked; it is not an unauthorized successful write.
The historical plan's prose suggesting otherwise is superseded by the runtime
report and these assertions. Deletion rejects both legitimate positive scenarios
because of the existing `owner mismatch || role !== ADMIN` condition.

The direct single-revision and diff tests make previously less explicit exposure
reproducible. Positive ADMIN edit and restore tests confirm ownership preservation.
The existing ADMIN-own deletion return-shape defect is not separately tested here:
this slice's required ADMIN matrix targets another user's invoices, where deletion
fails before that response-shape defect can occur.

The default `tsconfig.json` excludes tests. An additional temporary configuration
explicitly included this new test and application sources to verify its types.
An initial fixture used a scalar owner FK alongside nested address creation; Prisma
rejected that setup before assertions. Corrected it to a relation `connect`.
The explicit test typecheck also caught Prisma JSON input interface typing; fixture
snapshots now use the same explicit JSON-boundary cast as the production repository.
These were harness development errors, not authorization regressions. Final results
below contain no setup failures.

## Exact verification commands and results

From repository root, temporary PostgreSQL provisioning (all exit 0):

```bash
mkdir -p /tmp/portfolio-slice2a
/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice2a/pgdata -U postgres --auth=trust > /tmp/portfolio-slice2a/initdb.log
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice2a/pgdata -l /tmp/portfolio-slice2a/postgres.log -o '-p 55433 -k /tmp/portfolio-slice2a -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55433 -U postgres authorization
```

Backend commands use:

```bash
cd invoice-backend
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
export DATABASE_URL=postgresql://postgres@127.0.0.1:55433/authorization NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
```

| Exact command | Exit | Final result |
| --- | ---: | --- |
| `npx --no-install tsc --noEmit` | 0 | Application typecheck passes (default config excludes tests). |
| `npx --no-install tsc --noEmit -p tsconfig.authorization.tmp.json` | 0 | Application plus new authorization test passes. Temporary config removed. |
| `npx --no-install vitest run tests/unit --reporter=default` | 0 | 112 tests pass, 12 files. |
| `npx --no-install vitest run tests/integration/authorization.test.ts --reporter=verbose --no-file-parallelism --hookTimeout=60000` | 1 | 25 tests: 15 pass, 10 intentionally fail. Final focused rerun confirms the same result. |
| `npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000` | 1 | 39 tests: 29 pass, 10 intentionally fail. Both existing files pass (8 invoice + 6 user tests). |
| `node node_modules/prettier/bin/prettier.cjs --write tests/integration/authorization.test.ts` | 0 | New test formatted. Initial `npx --no-install prettier --write ...` could not execute its shim (permission denied); direct installed CLI used. |
| `git diff --check` and staged equivalent | 0 | Whitespace checks pass. |

The temporary typecheck configuration was:

```json
{"extends":"./tsconfig.json","include":["src/**/*.ts","tests/integration/authorization.test.ts"],"exclude":["node_modules","dist","src/mocks"]}
```

Raw execution logs are local temporary artifacts under `/tmp/portfolio-slice2a/`:
`typecheck.log`, `authorization-typecheck.log`, `unit.log`, `authorization.log`,
`integration.log`. PostgreSQL socket access required sandbox escalation; no external
service or authentication provider was contacted. Existing integration suites still
run `prisma db push` internally; the new suite uses the committed migrations.

Finalization: verified zero `authz_%` schemas remain and stopped the disposable cluster with
`/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice2a/pgdata stop -m fast`,
staged only the two added files for the local commit
`test(auth): capture PostgreSQL authorization regressions`.
The resulting commit hash and working-tree status are reported in the task response.
