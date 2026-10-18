# Slice 2B — invoice/revision authorization repair

Date: 2026-10-17 (America/Halifax, client date).

## Baseline and scope

Branch: `portfolio-stabilization`. HEAD before changes:
`4e364c336429aee8b09b3e5c8ea64aa70feebbad`. Initial working tree clean.
Reviewed repository archaeology, runtime verification, the stabilization plan,
and the Slice 1 and Slice 2A reports before implementation.

Implemented invoice ownership and existing ADMIN oversight only. No Demo Mode,
authentication/Auth0, JWT/OAuth, total calculations, ID generation, status-transition
rules (including draft-to-paid), architecture restructuring, frontend, unrelated
lint/type repairs, or Playwright changes. No dependency, lockfile, schema, migration,
or shared test configuration changes. No push, merge, or deployment.

## Production files changed

All paths below are relative to `invoice-backend/src/`:

| File | Change |
| --- | --- |
| `services/authorizedInvoice.ts` (new) | Shared authorized invoice lookup for both services. |
| `services/invoice.service.ts` | Guard retrieval, editing, payment status, deletion, and restoration; exclude ownership from edit payloads. |
| `services/invoiceRevision.service.ts` | Authorize parent access for every revision operation; authorize both diff operands and enforce the same invoice. |
| `repositories/implementations/prismaInvoiceRepository.ts` | Scope USER invoice lookup by ID and owner in the database query. |
| `repositories/InvoiceRevisionRepo.ts` | Add parent-ID-only lookup contract. |
| `repositories/implementations/prismaInvoiceRevisionRepository.ts` | Select only the parent invoice ID before snapshot access. |
| `resolvers/invoiceResolvers.ts` | Preserve edit NOT_FOUND errors and return deletion acknowledgement. |

## Authorization strategy and repository protection

`getAuthorizedInvoice(repo, user, invoiceId)` requires an authenticated context with
an ID and role, calls the existing `findByUserIdAndInvoiceId`, and independently
rejects a non-ADMIN owner mismatch. Both services use this small helper, avoiding a
circular dependency between InvoiceService and InvoiceRevisionService.

The Prisma query uses `findUniqueOrThrow` with:

- USER: `where: { id: invoiceId, createdById: userId }`.
- ADMIN: `where: { id: invoiceId }`.

Prisma 6 supports the additional ownership predicate alongside the unique invoice
ID. Missing and inaccessible invoices both produce P2025, translated to
`NotFoundException("Invoice not found")`. An unauthorized invoice and its relations
are therefore excluded by the query, before the service receives invoice data.
The independent service owner check also rejects incorrectly scoped repository
results.

Repository write methods remain internal persistence operations using an invoice
ID. Every invoice service entry point authorizes before invoking them. The existing
repository update explicitly selects writable fields and never writes `createdById`.
No ownership-transfer API was introduced.

## Service and revision protection

Invoice retrieval, edit, mark-as-paid, delete, and restore all pass through the
shared lookup. Denied edits/restores cannot reach a repository write or revision
recording. Mark-as-paid now checks authorization before changing status; no new
status rules or history behavior were added.

RevisionService receives the invoice repository through its existing Inversify
container binding. No context/container changes or new DI bindings are needed.

- `listRevisions` authorizes the parent before querying revision rows, including
  when that parent has an empty history. The existing resolver check remains too.
- `getRevision` first resolves only `invoiceId` with a new repository method that
  selects no snapshot, timestamp, author, or other revision fields. It authorizes
  the parent, then loads the full revision. It rejects a missing row or a changed
  parent on the second read. Missing and inaccessible revision IDs both return
  `NotFoundException("Revision not found")`, preserving Slice 2A's exact contract.
- `getDiff` uses authorized `getRevision` for both operands. A null starting
  revision still works, with the destination authorized. Different invoices are
  rejected with BAD_USER_INPUT only after both operands are authorized; a foreign
  operand returns NOT_FOUND before that validation can reveal its relationship.
- `restoreRevision` authorizes the target first, obtains an authorized revision,
  then verifies its parent matches the target before constructing a write. It
  preserves the original invoice owner and appends a new restore revision with
  the acting USER/ADMIN as author.
- Internal `recordIfChanged` also authorizes the parent before reading the latest
  snapshot or creating history, so a direct service call cannot bypass the guard.

InvoiceService excludes `createdBy` and `createdById` from the actual validated edit
payload. Restore already builds an explicit payload without ownership fields.
ADMIN edits and restores retain the original owner and record ADMIN authorship.

## Deletion and error contracts

Removed the faulty `owner mismatch || role !== ADMIN` condition and replaced it
with the same authorized lookup used by other operations. USER-own and ADMIN-other
deletions now succeed. USER-other deletion returns NOT_FOUND. The service preserves
NotFoundException from deletion rather than wrapping it as an internal error.
The GraphQL resolver returns `{ acknowledged: true }` on successful deletion.

The edit resolver now translates NotFoundException to GraphQL NOT_FOUND instead
of overwriting it with INTERNAL_SERVER_ERROR. Existing revision resolvers already
preserve the required exception codes. Across all eight operations, inaccessible
and missing IDs return the same operation-specific error message and NOT_FOUND code.

## Tests added and updated

All original 25 Slice 2A test bodies are byte-for-byte unchanged, verified against
starting HEAD. The only change in their original harness is supplying the real
invoice repository to the revision service's new constructor parameter.

Added **20 PostgreSQL-backed GraphQL regression cases** in
`tests/integration/authorization.test.ts`:

- Eight missing-versus-inaccessible error comparisons, also checking both invoices
  and their persisted addresses/items/history remain unchanged.
- Two mixed-owner diff directions (A to B and B to A).
- Two different-invoice diff cases where USER or ADMIN can legitimately access both.
- One denied diff with no starting revision and two positive initial diffs.
- Three mismatched restore cases, covering each USER target/source direction and
  ADMIN mismatch, asserting no writes or new revisions on either invoice.
- One denied empty foreign history and one revision-author-versus-invoice-owner case.

Added **four service unit cases** in `services/invoiceRevisionService.test.ts`:
unauthorized single reads never load snapshots even with a mis-scoped repository;
denied lists never query history; denied recording never reads/writes history;
and a changed parent between revision lookups fails closed.

Updated authorized lookup mocks in `services/invoiceService.test.ts` and
`services/invoiceService.revisions.test.ts`; revision service mocks supply the
invoice repository and parent-ID lookup. Updated `resolvers/invoiceResolvers.test.ts`
to mock the real boolean delete service result and assert `{ acknowledged: true }`.
No tests were removed, skipped, marked expected-to-fail, or weakened.

## Exact before/after results

| Check | Before | After |
| --- | --- | --- |
| Application typecheck | PASS (Slice 2A record) | PASS, exit 0 |
| Backend unit suite | 112/112 PASS, 12 files (Slice 2A record) | **116/116 PASS**, 12 files, exit 0 |
| Original authorization suite | **15 PASS, 10 FAIL**, reproduced here before edits, exit 1 | **25/25 PASS**, separately verified before adding cases, exit 0 |
| Expanded authorization suite | Not present | **45/45 PASS**, 1 file, exit 0 |
| Complete backend integration suite | 29 PASS, 10 FAIL, 3 files (Slice 2A record) | **59/59 PASS**, 3 files, exit 0 |
| Application plus authorization-test typecheck | PASS (Slice 2A record) | PASS, exit 0 |
| `git diff --check` | Clean tree | PASS |

Full integration includes all 45 authorization cases and the existing eight invoice
and six user cases. Results labeled Slice 2A record come from
`slice-2a-authorization-regression-tests.md`; only the unchanged authorization
baseline was re-executed before this implementation.

## Disposable database and verification commands

Used a new PostgreSQL 16 cluster under `/tmp/portfolio-slice2b`, listening only on
127.0.0.1:55434. No existing local or production database was used. Provisioning:

```bash
mkdir -p /tmp/portfolio-slice2b
/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice2b/pgdata -U postgres --auth=trust > /tmp/portfolio-slice2b/initdb.log
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice2b/pgdata -l /tmp/portfolio-slice2b/postgres.log -o '-p 55434 -k /tmp/portfolio-slice2b -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55434 -U postgres authorization
```

The initial sandbox start denied local sockets; the escalated retry succeeded.
Database test commands also used escalation for local socket access. No external
service or authentication provider was contacted.

From `invoice-backend`, using installed dependencies:

```bash
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
export DATABASE_URL=postgresql://postgres@127.0.0.1:55434/authorization NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
npx --no-install tsc --noEmit
npx --no-install vitest run tests/unit --reporter=default
npx --no-install vitest run tests/integration/authorization.test.ts --reporter=verbose --no-file-parallelism --hookTimeout=60000
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
npx --no-install tsc --noEmit -p tsconfig.authorization.tmp.json
```

The last command used this temporary configuration, removed after verification:

```json
{"extends":"./tsconfig.json","include":["src/**/*.ts","tests/integration/authorization.test.ts"],"exclude":["node_modules","dist","src/mocks"]}
```

Changed code was formatted with the installed CLI:
`node node_modules/prettier/bin/prettier.cjs --write <changed TypeScript paths>`.
Unrelated pre-existing formatting was preserved during final diff review.
Local raw logs: `/tmp/portfolio-slice2b/{before-authorization,typecheck,unit,authorization,integration,authorization-typecheck}.log`.

## Adversarial review and unexpected findings

Inspected all GraphQL revision entry points and all invoice/revision repository
calls from the services. Arbitrary revision IDs cannot bypass the parent guard;
both diff directions and null-start diffs are tested. Restore checks target access
before source access and parent matching before any write. Existing denied edit
and mark-as-paid cases assert persisted state, rather than response alone.
Missing-versus-inaccessible messages/codes match for all eight operations.
No unresolved authorization path was found within this slice's USER/ADMIN model.
The harness tests the production GraphQL schema, resolvers, services and PostgreSQL;
it does not verify HTTP token validation or redesign Demo Mode/authentication.

Additional findings repaired within authorization scope:

- Diff previously intentionally allowed combining unrelated invoices. Both operands
  now require authorization and the same parent, even for ADMIN.
- Edit removed ownership fields from the unvalidated object after validation,
  rather than from the payload passed to the repository. The existing repository
  already ignored ownership, but the service now protects that boundary too.
- Revision recording previously had no independent parent authorization; it now
  fails before reading latest history or creating a revision on denied access.

The original 25 tests first passed together before the extra adversarial cases.
An additional typecheck configuration initially placed under `/tmp` could not
resolve `reflect-metadata`; moving the temporary config beside the backend config
resolved it without production/config changes. Existing integration files still
use `prisma db push` and require serial execution; the authorization suite uses
committed migrations and drops its unique schema. Those existing harness limitations
remain outside scope.

Finalization checks passed: querying `pg_namespace` confirmed **zero** generated
`authz_%` schemas remain, and the disposable cluster was stopped with:

```bash
/usr/lib/postgresql/16/bin/psql -h 127.0.0.1 -p 55434 -U postgres -d authorization -Atc "SELECT count(*) FROM pg_namespace WHERE nspname LIKE 'authz_%';"
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice2b/pgdata stop -m fast
git diff --check
```

Only the listed implementation, tests, and this report are included in the local
commit `fix(auth): enforce invoice ownership across invoice and revision operations`.
The resulting commit hash and final working-tree status are reported in the task response.
