# Slice 3B — core invoice invariant repair

Date: 2026-10-17 (America/Halifax, client date).

## Baseline and scope

Branch: `portfolio-stabilization`. HEAD before changes:
`26c00f3080a11fea71581bee7f4e2c5ee0f319bf` (`docs(auth): record adversarial authorization review`).
Initial working tree clean. Reviewed the requested audit documents, Slice 2B
adversarial review, Slice 3A report, production invoice/revision paths, schema,
validation and backend tests. Authorization remains closed and its policy and
regression suite are unchanged.

Production files changed:

| File under `invoice-backend/src/` | Change |
| --- | --- |
| `services/invoiceDomainRules.ts` (new) | Small numeric normalization helper and backend application-ID generator. |
| `services/invoice.service.ts` | Normalize creation/edits before persistence; authorize and require pending before payment; append paid revision from persisted result. |
| `repositories/implementations/prismaInvoiceRepository.ts` | Generate absent/empty IDs and retry invoice primary-key collisions, bounded at five insert attempts. |

Other changes:

- `invoice-backend/tests/integration/invoiceInvariants.test.ts`: seven focused cases
  appended; the original 14 cases and their assertions are unchanged.
- `invoice-backend/tests/unit/services/invoiceService.test.ts`: three existing unit
  fixtures/expectations aligned with canonical totals and pending payment input.
- `docs/audit/slice-3b-invoice-invariant-repair.md`: this report.

**Excluded:** Demo Mode, authentication/Auth0, authorization redesign, frontend,
schema/migrations, dependencies/lockfiles, shared configuration, PDF, payments,
tax, discount, currency or architectural redesign. No push, merge or deployment.

## Monetary normalization and revision snapshots

`withCalculatedTotals` makes a new item list, converts quantity/price using the
application's existing numbers, derives each item total with multiplication, and
sums those computed totals. It ignores supplied invoice and item totals. Absent
items give an empty list and total zero; absent numeric fields retain the existing
zero defaults. It does not mutate caller items or introduce rounding, currency
libraries or monetary value objects. The existing restoration helper's rounding
behavior is unchanged.

Creation normalizes the authenticated invoice payload before the existing
`mapPartialInvoiceToInvoice` defaults and nested repository insert. The repository
returns the persisted invoice, which is validated and used for the create revision
and GraphQL response. Neither response nor history comes from stale client totals.

Editing first uses the unchanged authorized lookup. It merges the existing invoice
and requested changes, normalizes the merged items (including when items/total are
omitted), validates that canonical payload and removes ownership fields as before.
The repository persists the canonical values using its existing item reconciliation
transaction. Revision recording receives the repository's persisted result after
that write; the client payload never becomes the revision snapshot directly.
Existing revisions remain immutable.

## Invoice IDs and bounded collisions

The only pre-existing product generator is in a frontend utility with React/form,
UUID, date and frontend-type dependencies. Importing that module into the backend
would cross package boundaries and require frontend/build work excluded here.
The small backend generator follows the same two-uppercase-letter/four-digit
convention using Node's built-in `crypto.randomInt`, including zero padding and
all digits 0–9. No UUID or database primary-key change was introduced.

The Prisma creation path assigns a generated ID only for omitted/empty IDs.
Client-supplied IDs retain their previous behavior, including existing IDs that do
not match the newly generated format. This adds no broad ID validation policy.

The nested PostgreSQL insert and its unique constraint arbitrate ID collisions;
there is no race-prone pre-check treated as a uniqueness guarantee. A generated
ID collision (`P2002`, target exactly `id`) triggers a fresh ID and insert retry,
with **at most five total attempts**. Explicit duplicate client IDs, other errors
and exhausted retries fail through existing error handling. Nested failed inserts
roll back related items/addresses. Integration tests force the collision and
exhaustion paths against PostgreSQL, rather than relying on random collisions.

## Status and payment history

`markAsPaid` still authorizes first. It now requires the authorized invoice's status
to be `pending` before calling any mutation. Draft and already-paid invoices throw
the existing `ValidationException`. The unchanged resolver translates that to its
existing `INTERNAL_SERVER_ERROR` / `Invoice could not be marked as paid` convention,
as required by the unchanged Slice 3A assertion. No full state machine was added.

A successful pending-to-paid calls the existing repository status update, validates
its returned state, and awaits `recordIfChanged` with that persisted invoice,
`changeType: "edit"` and `message: "Marked as paid"`. RevisionService continues to
authorize the parent, preserve ownership and attribute the author to the acting
USER/ADMIN. Existing snapshot no-op detection is reused. A sequential repeat is
rejected before writing and creates no duplicate paid revision.

Invoice and revision writes remain separate operations under the existing revision
architecture. This slice does not make all invoice/history writes atomic on database
or revision-recording failures, migrate previously corrupt invoices/snapshots, or
introduce a concurrent payment state machine. Normal create/edit/payment paths are
verified below; rejected draft payments have no write or revision side effect.
Payment preserves monetary values on canonical invoices; existing legacy bad money
is normalized on create/edit, rather than silently rewriting history on reads.

## Tests and preserved coverage

Original 14 Slice 3A cases are unchanged byte-for-byte after removing the two new
imports and appended describe block. The authorization test file is byte-for-byte
unchanged. No tests were removed, skipped, marked expected-to-fail or relaxed.

Seven new PostgreSQL-backed GraphQL cases under `invoice invariant repair`:

1. `records canonical persisted creation totals in the initial revision`
2. `records canonical edited totals while preserving the previous snapshot`
3. `retries a generated ID collision without overwriting the existing invoice`
4. `stops after five generated ID collisions without partial inserts`
5. `rejects a duplicate client ID without generating a replacement`
6. `preserves supplied existing-format IDs without broad new validation`
7. `rejects a repeated payment without appending a duplicate paid revision`

The edit history case uses decimal price 75.5 and retained item IDs, complementing
Slice 3A's replacement-item cases. Collision cases assert existing invoice/history
preservation and exact invoice, item and address row counts. Snapshots are compared
against the entire persisted invoice using the existing serializer, with additional
explicit expected monetary assertions.

Three unit tests needed updates after repair: two payment tests formerly supplied
an already-paid input, and one validation-failure test expected the client-supplied
total 200 instead of the calculated 115. Payment fixtures now start pending; the
positive test expects the paid result. The validation test expects canonical 115
while retaining its invalid-status rejection and no-write assertions. These are
fixture repairs; the Slice 3A and authorization assertions were not modified.

## Before/after results and PostgreSQL evidence

| Check | Before | After |
| --- | --- | --- |
| Original Slice 3A suite | Reproduced **2 PASS / 12 FAIL**, exit 1 | **14/14 PASS**, separately run before adding cases, exit 0 |
| Expanded invariant suite | Not present | **21/21 PASS**, exit 0 |
| Application typecheck | Prior baseline PASS | PASS, exit 0 |
| Application plus invariant-test typecheck | Prior baseline PASS | PASS, exit 0 |
| Backend units | Prior baseline 116/116 PASS | **116/116 PASS**, 12 files, exit 0 |
| Authorization | Prior baseline 45/45 PASS | **45/45 PASS**, exit 0 |
| Full backend integration | Slice 3A: 61 PASS / 12 FAIL | **80/80 PASS**, 4 files, exit 0 |

The first post-repair unit run was 113 PASS / 3 FAIL because of the outdated fixtures
listed above; after correcting those fixtures, all 116 pass. The historical full
integration baseline is from Slice 3A's report; this run independently reproduced
the original 14-case red baseline before making production changes.

Evidence printed by the focused integration run and read back from PostgreSQL:

| Scenario | Persisted result |
| --- | --- |
| False/omitted creation totals | Invoice 650; Design 250; Hosting 400; create snapshot has the same values. |
| False/stale/omitted edit totals | Invoice 650; items 250/400; old revision keeps total 300, new edit snapshot has total 650. |
| Retained-ID decimal edit | Invoice 453; two items each `3 * 75.5 = 226.5`; new revision matches full persisted state, old revision unchanged. |
| Omitted ID | Generated `DN0382`; two-call case persisted distinct `WH3556` / `WW2410`. |
| Empty-string ID | Generated `IF7352`; two-call case persisted distinct `BB5051` / `ZI2144`. |
| Forced generated collision | Existing `AA1001` unchanged; second generated candidate `BB2002` persisted; exactly two invoice/address pairs and four items, one initial revision per invoice. |
| Exhausted generated collisions | Exactly five generator calls; error; original `AA1001` and its history unchanged; still one invoice/address pair and two items. |
| Draft payment | Remains draft; entire invoice/items/addresses/history equal before; one unchanged initial revision. |
| Pending payment | Becomes paid; owner and non-status invoice fields unchanged; history grows from one to two revisions; second snapshot paid with total 650 and items 250/400, acting owner author. |
| Repeated payment | Error; paid invoice and both revision rows unchanged. |

Random IDs above are observations, not hard-coded test expectations. Full integration
includes the 21 invariants, 45 authorization, eight existing invoice and six user
tests. ADMIN access and ownership preservation remain covered by authorization.

## Verification environment and exact commands

Created a fresh PostgreSQL 16 cluster; used no normal developer/production database:

```bash
mkdir -p /tmp/portfolio-slice3b
/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice3b/pgdata -U postgres --auth=trust > /tmp/portfolio-slice3b/initdb.log
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice3b/pgdata -l /tmp/portfolio-slice3b/postgres.log -o '-p 55436 -k /tmp/portfolio-slice3b -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55436 -U postgres invariants
```

Backend commands (baseline and repaired original suite used the same focused
command; the expanded run follows the additions):

```bash
cd invoice-backend
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
export DATABASE_URL=postgresql://postgres@127.0.0.1:55436/invariants NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
npx --no-install tsc --noEmit
npx --no-install vitest run tests/unit --reporter=default
npx --no-install vitest run tests/integration/invoiceInvariants.test.ts --reporter=verbose --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration/authorization.test.ts --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install tsc --noEmit -p tsconfig.invariants.tmp.json
```

The default tsconfig excludes tests. The temporary explicit typecheck config was:

```json
{"extends":"./tsconfig.json","include":["src/**/*.ts","tests/integration/invoiceInvariants.test.ts"],"exclude":["node_modules","dist","src/mocks"]}
```

Formatting used the installed CLI:
`node node_modules/prettier/bin/prettier.cjs --write src/services/invoiceDomainRules.ts src/services/invoice.service.ts src/repositories/implementations/prismaInvoiceRepository.ts tests/integration/invoiceInvariants.test.ts tests/unit/services/invoiceService.test.ts`.
Unrelated pre-existing formatting was preserved during final diff review.

Local raw logs: `/tmp/portfolio-slice3b/{before-invariants,repaired-original-invariants,invariants,typecheck,invariants-typecheck,unit-initial,unit,authorization,integration}.log`.
PostgreSQL start/database commands use escalation for local sockets; no external
service or authentication provider was contacted. The established schema isolation
and committed migrations are reused for invariant/authorization tests. Older tests
still use their original `db push` harness; serial execution is retained.

## Findings and finalization

No additional authorization defect or failure was found. All requested regression
invariants are green. The existing nontransactional history-write limitation and
historical corrupt data are not redesigned by this slice; no migration rewrites
old snapshots. No broader status validation, legacy-ID rejection or frontend changes
were introduced.

Finalization commands from repository root:

```bash
/usr/lib/postgresql/16/bin/psql -h 127.0.0.1 -p 55436 -U postgres -d invariants -Atc "SELECT count(*) FROM pg_namespace WHERE nspname LIKE 'invariants_%' OR nspname LIKE 'authz_%';"
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice3b/pgdata stop -m fast
rm invoice-backend/tsconfig.invariants.tmp.json
git diff --check
```

Schema query returned zero; cluster stopped successfully. Temporary typecheck
configuration removed. Only the six files listed above are staged for the local
commit `fix(invoice): enforce core invoice invariants`; staged whitespace check
passes. The commit hash and final working-tree status are reported in the response.
