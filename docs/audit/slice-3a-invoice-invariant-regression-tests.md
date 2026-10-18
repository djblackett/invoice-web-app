# Slice 3A — invoice-domain invariant regression tests

Date: 2026-10-17 (America/Halifax, client date).

## Baseline and scope

Branch: `portfolio-stabilization`. HEAD before changes:
`c9648bfa05b99b24a5be3b5b35451cc51eddeaff` (matches requested `c9648bf`).
The existing untracked `docs/audit/slice-2b-adversarial-review.md` was left untouched
and is not included in this commit. Reviewed the six requested audit documents,
current creation/edit/payment services, schema, validation/default mapping,
repositories, revision design and existing backend tests.

Files added; no existing tracked files modified:

- `invoice-backend/tests/integration/invoiceInvariants.test.ts` — 14 integration tests.
- `docs/audit/slice-3a-invoice-invariant-regression-tests.md` — this report.

**Production business logic was not changed.** No changes to money calculations,
ID generation, transitions, authorization, authentication/Auth0, Demo Mode,
frontend, revision architecture, schema/migrations, dependencies, shared test
configuration or existing tests. No skips, expected-failure wrappers or weakened
assertions. No push, merge or deployment.

## Fixture and evidence design

The harness follows the established authorization suite's isolated-schema approach
without changing that suite. Apollo `executeOperation` validates and executes the
production GraphQL schema/resolvers, real InvoiceService/InvoiceRevisionService,
real Prisma repositories and PostgreSQL. The authenticated context supplies a
single ordinary `USER`, `invariant-user`; all invoices belong to that user.
A real in-memory PubSub satisfies the creation resolver's dependency. No services,
repositories, authorization methods or monetary calculations are mocked.
HTTP transport and token validation are outside this test boundary.

An explicit PostgreSQL `DATABASE_URL` is mandatory, with no default or dotenv load
in the new harness. A random `invariants_<uuid>` schema is applied to both the
migration subprocess URL and the injected Prisma client, preserving other URL
parameters. It uses committed migrations. Cleanup drops only its generated schema
and disconnects even when assertions fail. Each test clears its schema's invoice,
address and cascading item/revision rows. The user remains available across cases.

Creation uses complete, valid GraphQL variables and observes both the returned
invoice and PostgreSQL. Omitted variables are absent object properties, rather
than null or a made-up required-field workaround: the actual GraphQL contract
allows `id`, invoice `total` and item `total` to be omitted. Edit/status fixtures
are inserted through Prisma with a matching initial revision; mutations under
test always run through GraphQL. Edit begins with consistent items of 100 and 200,
invoice total 300 and a create snapshot of that same state. Status cases start
with 650 and one initial create revision. Generated IDs/items/timestamps are
compared dynamically where relevant.

Every test prints `INVARIANT EVIDENCE` with the GraphQL result and actual persisted
rows before assertions. Monetary assertions use soft checks to retain response
and database failures together. Decimal values are converted to the application's
existing numbers for assertions and serialized exactly as decimal strings in logs.
No new rounding or money representation is introduced. Raw local logs are under
`/tmp/portfolio-slice3a/`; those temporary artifacts are not committed.

## Intended invariants

- Each item total equals `quantity * price`; invoice total equals the sum of the
  computed item totals. Supplied and omitted totals must yield the same consistent
  returned and persisted amounts. Test items are Design: `2 * 125 = 250` and
  Hosting: `4 * 100 = 400`, aggregating to 650. False inputs use item totals 1 and
  invoice total 9999; the separately confirmed stale edit example uses total 300.
- Omitted/empty IDs must produce non-empty application IDs matching
  `^[A-Z]{2}[0-9]{4}$`. Two sequential creations must succeed with distinct returned
  IDs matching their two persisted rows. The existing frontend `generateId` in
  `features/shared/utils/utilityFunctions.ts` establishes two uppercase letters
  followed by four digits (its current random digit expression emits 0–8).
  Prisma's UUID default exists but is overridden by the current empty-string
  writes. Tests neither invoke the frontend generator nor introduce a backend one.
- Draft-to-paid must fail with no invoice, address, item or revision change.
  The test uses the existing markAsPaid resolver's error convention:
  `INTERNAL_SERVER_ERROR`, `Invoice could not be marked as paid`. It does not
  prescribe a future public error contract or broader state machine.
- Pending-to-paid must succeed and preserve ownership and all other invoice data.
  A separate test requires one new append-only revision, retaining the initial
  pending snapshot and recording the acting owner, revision number 2, existing
  `edit` change type and the complete paid snapshot. This requirement comes from
  the stabilization plan Step 4 and its integration acceptance criteria; it does
  not introduce a new revision type or require a particular message.

## Tests already passing

**2 of 14 new tests pass:**

1. `creation totals > returns and persists already correct totals` — response and
   database both contain total 650 and item totals 250/400, owned by the USER.
2. `status transitions > marks pending paid while preserving ownership and other invoice data`
   — response is the complete expected paid invoice; database differs from before
   only in status. This passing test is separate from the missing revision failure.

## Intentionally failing tests and persisted-state evidence

**12 of 14 new tests fail**, all as ordinary red tests. Names below are exact
suite/test names within `tests/integration/invoiceInvariants.test.ts`.
All amounts and rows below were read from PostgreSQL after the GraphQL mutation.
For money cases, the response repeats the incorrect database amounts without
GraphQL errors. Ownership remains `invariant-user` throughout.

| Exact suite > test name | Expected behavior | Actual response and persisted state | Prior defect relationship |
| --- | --- | --- | --- |
| `creation totals > recomputes false invoice and item totals` | Invoice 650; Design 250; Hosting 400. | Invoice 9999; items 1/1; initial create revision also snapshots 9999 and 1/1. | Confirms client-controlled creation money; direct line-total spoofing is additional coverage of the same server-authority gap. |
| `creation totals > calculates an omitted invoice total` | Creation succeeds; invoice 650; items 250/400. | Creation succeeds; invoice 0; items 250/400; create snapshot total 0. | Reproduces runtime-confirmed omitted creation total. |
| `creation totals > calculates omitted invoice and item totals` | Creation succeeds; invoice 650; items 250/400. | Creation succeeds; invoice 0; items 0/0; create snapshot has the same zero amounts. | Additional reachable omission variant of the same calculation gap. |
| `edit totals > recomputes false invoice and item totals` | Invoice 650; items 250/400. | Invoice 9999; items 1/1; revision 1 remains 300 and revision 2 (`edit`) snapshots 9999 and 1/1. | Extends confirmed stale edit defect to false line totals. |
| `edit totals > aggregates correct items despite a stale invoice total` | Invoice 650; items 250/400. | Invoice 300; items 250/400; revision 2 snapshots the inconsistent invoice total 300. | Reproduces confirmed items-sum-650/client-total-300 defect. |
| `edit totals > recalculates an omitted invoice total after items change` | Invoice recalculated to 650; items 250/400. | Previous invoice total 300 retained; updated items 250/400; edit revision snapshots 300. | Reproduces confirmed omitted edit total retaining an old amount. |
| `invoice IDs > generates a non-empty application ID for omitted ID` | One non-empty formatted generated ID; response equals database. | Successful response `id: ""`; one database invoice with `id: ""`, total 650. | Reproduces confirmed missing ID defect. |
| `invoice IDs > creates two distinct application IDs for omitted ID` | Both calls succeed; two distinct formatted IDs and rows. | First returns `""`; second returns null with `INTERNAL_SERVER_ERROR` / `Failed to add invoice`; PostgreSQL still has only the first row, `id: ""`, total 650. Prisma logs P2002 on `id`. | Reproduces confirmed second-creation collision. |
| `invoice IDs > generates a non-empty application ID for empty-string ID` | One non-empty formatted generated ID; response equals database. | Successful response `id: ""`; one database invoice with `id: ""`, total 650. | Explicit empty-string variant of confirmed missing/empty identity defect. |
| `invoice IDs > creates two distinct application IDs for empty-string ID` | Both calls succeed; two distinct formatted IDs and rows. | First returns `""`; second returns null with `INTERNAL_SERVER_ERROR` / `Failed to add invoice`; one persisted `id: ""` row remains, total 650. Prisma logs P2002 on `id`. | Same confirmed collision through explicit empty strings. |
| `status transitions > rejects draft to paid without changing invoice data or revisions` | Error/null result; invoice remains draft; all data/history unchanged. | Success response and persisted status `paid`; total 650, items 250/400 and all non-status invoice fields unchanged. Exactly one unchanged create revision remains with snapshot status `draft`. | Reproduces confirmed draft-to-paid defect. No false new transition revision is created. |
| `status transitions > appends a paid revision while preserving pending history` | Successful payment; second revision of type `edit`, owner author and full paid snapshot; revision 1 unchanged. | Success and persisted status `paid`, ownership/data intact, but only original create revision 1 remains with snapshot status `pending`; no revision 2 exists. | Missing payment revision identified by current code/plan; previous runtime table did not independently demonstrate this omission. |

## Unexpected findings and limits

No new authorization defect or fixture authorization failure occurred. Incorrect
financial data is also copied into create/edit revision snapshots, making those
snapshots internally inconsistent; tests observe this without repairing revision
architecture. Payment mutates the live status without updating revision history,
for both allowed pending and disallowed draft inputs. The missing pending-payment
revision is reported separately rather than weakening the successful status test.
All tested main-branch monetary/identity/status defects remain reproducible on
this stabilization branch; historical OAuth fixes are not present here.

This suite establishes the required sequential ID uniqueness behavior, not a
concurrent collision retry policy. It does not prescribe currency precision,
tax/discount rules, additional transitions or validation beyond this slice.
Older integration files still use `prisma db push` and their existing imperfect
schema isolation; serial execution on the fresh disposable database preserves
their established verification approach without modifying them.

## Exact verification commands and results

Created a fresh PostgreSQL 16 cluster and database, rather than using an existing
developer database. From repository root:

```bash
mkdir -p /tmp/portfolio-slice3a
/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice3a/pgdata -U postgres --auth=trust > /tmp/portfolio-slice3a/initdb.log
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice3a/pgdata -l /tmp/portfolio-slice3a/postgres.log -o '-p 55435 -k /tmp/portfolio-slice3a -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55435 -U postgres invariants
```

Initialization succeeded. Initial sandbox startup denied local sockets; the
escalated retry succeeded. Database tests use escalation for local socket access.
No external authentication service or existing database was contacted.

Backend environment and exact checks:

```bash
cd invoice-backend
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
export DATABASE_URL=postgresql://postgres@127.0.0.1:55435/invariants NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
npx --no-install tsc --noEmit
npx --no-install vitest run tests/unit --reporter=default
npx --no-install vitest run tests/integration/invoiceInvariants.test.ts --reporter=verbose --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install tsc --noEmit -p tsconfig.invariants.tmp.json
```

| Check | Exit | Result |
| --- | ---: | --- |
| Application typecheck | 0 | PASS (default config excludes tests). |
| Application plus new-test typecheck | 0 | PASS. |
| Backend units | 0 | 116/116 PASS, 12 files. |
| Focused invariant integration | 1 | 14 tests: 2 PASS, 12 intentional FAIL; no setup failures. |
| Full backend integration | 1 | 73 tests: 61 PASS, 12 intentional FAIL, 4 files. Authorization 45/45, existing invoice 8/8 and user 6/6 pass. |
| Formatting of new test | 0 | Installed Prettier CLI succeeds. |
| `git diff --check` and staged equivalent | 0 | PASS. |

Temporary explicit typecheck config (removed after verification):

```json
{"extends":"./tsconfig.json","include":["src/**/*.ts","tests/integration/invoiceInvariants.test.ts"],"exclude":["node_modules","dist","src/mocks"]}
```

Formatting command, from `invoice-backend`:
`node node_modules/prettier/bin/prettier.cjs --write tests/integration/invoiceInvariants.test.ts`.
Logs: `/tmp/portfolio-slice3a/{typecheck,invariants-typecheck,unit,invariants,integration}.log`.

Finalization commands (all successful):

```bash
/usr/lib/postgresql/16/bin/psql -h 127.0.0.1 -p 55435 -U postgres -d invariants -Atc "SELECT count(*) FROM pg_namespace WHERE nspname LIKE 'invariants_%';"
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice3a/pgdata stop -m fast
rm invoice-backend/tsconfig.invariants.tmp.json
git diff --check
git add invoice-backend/tests/integration/invoiceInvariants.test.ts docs/audit/slice-3a-invoice-invariant-regression-tests.md
git diff --cached --check
git commit -m "test(invoice): capture domain invariant regressions"
```

Schema query returned **0**. The disposable cluster stopped successfully. Only
these two new files are included in the local commit.
The local commit hash and final working-tree status are reported in the task response.
The existing untracked Slice 2B adversarial report remains outside this commit.
