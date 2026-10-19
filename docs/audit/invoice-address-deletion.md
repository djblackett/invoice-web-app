# Invoice deletion address integrity

Baseline: `eec166fcc56766d329cd627084b9f9b2d23ff0f6` (current `main`
when this fix branch was created).

## Cause and correction

`Invoice.clientAddressId` and `Invoice.senderAddressId` reference the address
tables. Their `onDelete: Cascade` applies when an **address** is deleted, not
when its referencing invoice is deleted. `Item.invoiceId` and
`InvoiceRevision.invoiceId` point to the invoice, so those rows already cascade
on invoice deletion. The previous repository method deleted only the invoice.

The single-invoice repository deletion now runs in one interactive Prisma
transaction. The invoice DELETE returns its two address IDs; cleanup matches
only those IDs and requires `Invoice: { is: null }`. Null IDs are skipped.
Any failure rolls back the invoice, items, revisions and address cleanup.
Serializable isolation prevents a stale reference check during concurrent
reassignment from cascading away another invoice. Serialization conflicts use
the existing error handling; there is no automatic retry.

Returning the IDs from DELETE avoids a separate read and captures the actual
deleted row. A nested address deletion or deleting addresses first would act
in the dangerous cascade direction. Reversing the schema relations or adding
database triggers would require a migration and affect other workflows. No
schema, service authorization, resolver contract or history behavior changed.
The existing unique address foreign keys prohibit simultaneous address sharing;
the explicit reference guard also protects an address reassigned before cleanup.

## Other deletion paths reviewed

| Path | Finding | Scope of this change |
| --- | --- | --- |
| `PrismaInvoiceRepository.delete` / `removeInvoice` | Left both address types behind | Fixed |
| `resetDemoWorkspace` (Demo Reset and seed) | Captures only current demo-owned invoice address IDs, deletes invoices, then removes captured unreferenced addresses transactionally | Already scoped correctly; cannot recover IDs orphaned earlier |
| `deleteAllInvoices`, `deleteInvoicesByUserId` | Direct invoice `deleteMany` also leaves addresses | Existing limitation; unchanged |
| `deleteAllUsers`, `deleteAllUsersKeepAdmin` | User deletion cascades invoices/items/history but leaves address rows | Existing limitation; unchanged |
| `/test-setup` in test/CI/development | Direct invoice `deleteMany` also leaves addresses | Existing limitation; unchanged; endpoint is forbidden in production |

Addresses have no independent owner field. Unreferenced status alone does not
establish ownership or permission to delete. This fix performs no global sweep
and does not clean existing production orphans. See the separate
[synthetic-row cleanup proposal](../operations/synthetic-address-cleanup-proposal.md).

## Regression coverage

Tests use committed migrations and disposable local PostgreSQL 16, never Neon.
The invoice invariant suite covers creation and deletion of both addresses,
item/history cascades, exact preservation of unrelated users' invoices and
addresses, preservation of pre-existing detached addresses, cross-user denial,
missing invoices, nullable relations and rollback when the second address
cleanup raises a PostgreSQL exception. A test-only PostgreSQL trigger transfers
the captured IDs to another user's invoice after DELETE to exercise the
reference guard under real unique and foreign-key constraints.

The existing authorization matrix also checks address cleanup for both USER
and ADMIN. The production-context Demo suite runs three create/delete/reset
cycles, checking complete state after deletion and canonical data, all table
counts, unrelated rows and zero new orphans after each reset.

Before the fix, the targeted run failed six cases, including ordinary deletion,
optional-address deletion, rollback and the Demo cycle. No assertions were
weakened and no new skips were added.

## Verification on 2026-10-19

Node 24.15.0 and PostgreSQL 16.13:

| Gate | Result |
| --- | --- |
| Backend `npm run check` | Types, lint, 180 unit tests and build passed |
| Backend `npm run test:integration` | Both committed migrations deployed to disposable local PostgreSQL; 167 tests passed across six suites |
| Frontend `npm run check` and `npm run typecheck:e2e` | Passed; 118 tests passed, two pre-existing skips |
| Frontend `PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e` | 17 passed; desktop, mobile and Demo-disabled against the runner's separate disposable database and compiled backend |
| `git diff --check` | Passed |

Local logs: `/tmp/invoice-address-fix/{red,backend-check,backend-integration,frontend-check,browser}.log`.
Browser report: `/tmp/invoice-e2e-wK9tpS/playwright-report/index.html`.
The first sandboxed backend gate encountered loopback-listener `EPERM` in the
CORS tests; the complete gate passed with local socket access enabled.

All reproductions and regression runs were local. A separate production
REPEATABLE READ, READ ONLY query verified only the two acceptance cleanup
candidates and their reference counts; the cleanup proposal records that result.
No production mutation, Fly operation, merge or deployment was performed.
