# Public Demo Reliability — Slice 1: canonical portfolio fixtures

Implemented 26 October 2026. Scope: canonical sample contacts and their regression
coverage. No application, authentication, authorization, session, reset, schema,
or deployment logic changed. No production database was accessed. No commit,
push, or deployment was made. The pre-existing `.gitignore` edit was preserved.

## Fixture alignment

`invoice-backend/prisma/demoInvoices.json` now contains:

| Invoice | Fictional business | Email |
| --- | --- | --- |
| RT3080 | Northstar Studio | rt3080@example.com |
| XM9141 | Cedar & Finch | xm9141@example.com |
| RG0314 | Fieldwork Studio | rg0314@example.com |
| RT2080 | Oakline Creative | rt2080@example.com |
| AA1449 | Willow Design Co. | aa1449@example.com |
| TY9141 | Harbour Collective | ty9141@example.com |
| FV2353 | Juniper Works | Intentionally empty draft field |

All sender addresses are `18 Example Lane, Sampleton, AB1 2CD, United Kingdom`.
The six completed client addresses are `42 Sample Street, Exampleford, EF3 4GH,
United Kingdom`. Juniper Works retains four empty client address fields, an empty
email, and draft status.

Evidence inspected: `portfolio-export/screenshots/manifest.md`,
`capture-record.json`, and the original detail, edit, and mobile dashboard images
(02, 03, and 06). The dashboard confirms all seven business names. The detail and
edit captures confirm the exact addresses and invoice-ID email pattern for
RT3080 and XM9141. The other invoices' contact fields are not visible in these
captures; their synthetic details extend that pattern rather than claiming an
exact screenshot transcription. No conflicting visible contact data was found.

All seven original PNG hashes were checked against `capture-record.json` and
matched. Screenshots and their manifest were not edited.

## Preserved data and revision generation

`demoWorkspace.cjs` already derives current invoices and every snapshot from the
JSON templates. Its history builder needs no change: all eleven initial snapshots
inherit the new contacts, including all five RT3080 revisions. Both the seed and
existing reset service use this shared builder.

A structured comparison against HEAD confirmed that every non-contact JSON field
is unchanged: IDs, dates, descriptions, payment terms, statuses, items, quantities,
prices, item totals, and invoice totals. The original `2021-10-7` date spelling is
also retained.

RT3080's raw JSON template still contains one item totaling £1,800.90. The existing
builder produces its five-step draft-to-paid history, ending with Brand Guidelines
and Logo Design totaling £2,101.80. That generated final state matches the captured
detail and dashboard; the template-versus-generated difference is intentional and
unchanged. The screenshots' revision #4 restore and subsequent mobile paid state
are deliberate capture-session differences documented in the original manifest.

Unrelated historical fixtures in backend/frontend `tests/data/invoices.ts` and
standalone component/service tests remain unchanged; they do not source canonical
demo data.

## Regression coverage

- New `invoice-backend/tests/unit/demoWorkspace.test.ts`: seven IDs, eleven
  snapshots, five-revision RT3080 history, exact fictional contacts in templates,
  current invoices and every snapshot, incomplete draft fields, unchanged dates,
  terms, statuses, line items and amounts, arithmetic totals, stable seeded item
  IDs, and latest-snapshot/current-state consistency.
- Extended `invoice-backend/tests/integration/demoMode.test.ts`: persisted canonical
  invoices and all snapshots match the builder; restore all eleven initial
  snapshots through the real GraphQL/service/repository path, verify contact and
  business data, appended restore history and provenance, and unchanged original
  history. Eleven restores leave seven invoices and twenty-two revisions.
- Extended the browser dashboard helper to verify each canonical ID/business pair.
  The existing revision-restore browser scenario now checks Northstar's name and
  email in the response, and both addresses, name, and email after reload.

Restoring a previously removed item assigns a fresh item ID under existing
application behavior. The integration assertion accounts for ID changes and
database read ordering, compares all line-item business fields, and verifies the
new snapshot contains the actual persisted IDs. No restore implementation changed.

## Validation and remaining concerns

Node 24.15.0 and native PostgreSQL 16 were used. Backend unit/integration checks
ran through the existing isolated E2E runner with
`PG_BIN=/usr/lib/postgresql/16/bin CERT_DIR= E2E_BACKEND_REGRESSION=true npm run
test:e2e -- demo.spec.ts` from `invoice-frontend`. The runner creates a fresh
cluster under `/tmp`, overrides database URLs with loopback disposable databases,
uses existing migrations, and stops/removes the cluster afterward. It builds the
backend and separate demo-enabled/disabled frontend bundles before browser tests.

| Check | Result |
| --- | --- |
| Backend `npm run test:unit` | 191 passed, 14 files; includes 11 new fixture tests |
| Backend `npm run test:integration` | 160 passed, 6 files; includes 2 new seed/restore tests |
| Frontend `npm test` | 119 passed, 2 existing skips, 23 files |
| Backend `npm run typecheck` | Passed |
| Frontend `npm run typecheck` and `npm run typecheck:e2e` | Passed |
| Backend `npm run build` | Passed |
| Frontend `npm run build` with explicit local demo variables | Passed |
| Playwright `demo.spec.ts`, Chromium desktop and mobile | 14 passed; includes fictional dashboard names and restored contacts after reload |
| JSON comparison against HEAD excluding contacts | All other fields identical |
| Original screenshot SHA-256 comparison | All 7 match the capture record |
| Whitespace check on changed implementation/test files | Passed |

Final backend/browser run artifacts: `/tmp/invoice-e2e-ydKDHg`. Frontend test,
backend typecheck and standard frontend build logs use `/tmp/invoice-slice1-*`. These are disposable
local provenance paths, not required review artifacts. The first broad unit run
was blocked by the sandbox's loopback-listener restriction; rerunning through the
approved local runner passed. The first new restore assertion assumed stable
item ordering after re-creation; the corrected assertion described above passed
the full integration run.

The frontend build retains its existing large-chunk warning, and frontend tests
emit existing React/testing-library deprecation warnings. Those unrelated issues
were not changed in this fixture slice.

The fixture change affects future seeds/resets. Existing database records and old
stored snapshots are not retroactively rewritten by a code edit; applying this
dataset to a hosted workspace remains outside this slice. No new fixture-related
runtime concern has been identified.
