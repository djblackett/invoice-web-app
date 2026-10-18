# Implementation Slice 1 — baseline verification

Date: 2026-10-17 (America/Halifax).

## Baseline and scope

Created `portfolio-stabilization` from local remote-tracking `origin/boxing1`, verified as
`c750f889665e31b2dd85a46cce457b5c922a1f85` (`c750f88`). Initial tracked working tree was clean.
Imported the three files under `docs/audit/` byte-for-byte from local `OAuth-phase1`
commit `7ece4e9` before implementation. No OAuth implementation was merged.
The imported audits are historical context; this report records this execution.

Implemented only:

- Missing `20260412000000_add_invoice_revisions` migration, matching the existing Prisma schema.
- Compose database startup uses `prisma migrate deploy` and waits for PostgreSQL health.
  Contrary to the plan's line reference, `setup.sh` delegates database setup to Compose;
  it contains no `db push` command. Added a comment explaining that path.
- Removed verbose DI resolution logging and replaced database-URL logging with a boolean
  configuration indicator, avoiding disclosure of URL credentials or query parameters.
- Existing integration tests honor `DATABASE_URL` rather than always connecting to localhost:5432.
  Their assertions and application behavior are unchanged.

Authorization, invoice rules, Demo Mode behavior, and authentication were not changed.
The plan's Demo Mode URL guard and CORS changes were deferred to respect this slice's scope.
Optional artifact cleanup was omitted. Frontend lint/test repairs are later-plan work.
No production database, existing local database, or external authentication account was used.
No dependency versions or lockfiles were changed.

## Environment and setup commands

Commands below were run from the repository root unless a package directory is specified.
Node was selected with `export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH`.
Verification used Node 24.15.0, npm 12.2.0, each package's pinned Yarn 4.6.0, and PostgreSQL 16.13.

| Command / inspection | Result |
| --- | --- |
| `pwd`; `rg --files` for project/config files; scoped `rg --files --hidden -g AGENTS.md -g '!node_modules' -g '!.git'`; ancestor AGENTS checks | Correct repository; no applicable AGENTS.md found. An initial broader `find .. -name AGENTS.md -print` also encountered unrelated permission-denied directories. |
| `git status --short`; `git branch -a`; `git log -1 --oneline origin/boxing1` | Clean detached HEAD at expected c750f88; source branches available. |
| `git diff --name-status origin/boxing1 OAuth-phase1`; `git log -8 --oneline OAuth-phase1`; `git show OAuth-phase1:docs/audit/<file>` | Located audit-only tip and reviewed plan/context without importing other branch changes. |
| `git switch -c portfolio-stabilization origin/boxing1` | Initial sandbox attempt could not write .git/index.lock; elevated retry succeeded. |
| `git restore --source=OAuth-phase1 -- docs/audit` | Imported all three audit documents. |
| `rg`, `sed`, `cat`, `head`, `tail`, `ls`, `git show`, `git diff`, `git check-attr`, `git ls-files` | Inspected plan Steps 1–2, migration DDL, setup, Compose, package manifests, TypeScript/lint/test configuration, integration DB setup, seed, and validation logs. |
| `command -v docker psql postgres yarn node`; `ls /usr/lib/postgresql`; Node/package version checks | Found PostgreSQL 16 and local Node installations; selected Linux Node explicitly. |
| `pg_isready`; `docker ps --format '{{.Names}}'` | Default PostgreSQL socket probe found no server at 5433; Docker socket access denied in sandbox. Docker daemon not needed for direct PostgreSQL verification. |
| `corepack yarn install --immutable` (backend) | Initial sandbox install failed esbuild subprocess validation (EPERM). Elevated retry passed with existing peer warnings. |
| `corepack yarn install --immutable` (frontend) | Passed with existing peer warnings. |
| `/usr/lib/postgresql/16/bin/initdb -D /tmp/portfolio-slice1/pgdata -U postgres --auth=trust` | Created a fresh cluster, owned by the current user. |
| `/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice1/pgdata -l /tmp/portfolio-slice1/postgres.log -o '-p 5432 -k /tmp/portfolio-slice1 -h 127.0.0.1' start` | Sandbox denied sockets; elevated retry found port occupied. Existing server was left untouched. |
| Same `pg_ctl` command with `-p 55432` | Passed with elevated local socket access; isolated loopback-only cluster started. |

Temporary harness `/tmp/portfolio-slice1/check.py` executed the commands below and recorded
exit codes and raw output. Shared verification environment:

```sh
export DATABASE_URL=postgresql://postgres@127.0.0.1:55432/baseline
export NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
```

## Verification commands and results

| Directory | Command | Exit | Result |
| --- | --- | ---: | --- |
| `.` | `createdb -h 127.0.0.1 -p 55432 -U postgres baseline` | 0 | Fresh database in a new temporary PostgreSQL 16.13 cluster. |
| `invoice-backend` | `npx --no-install prisma generate` | 0 | Prisma Client 6.2.1 generated from the unchanged schema. |
| `invoice-backend` | `npx --no-install prisma migrate deploy` | 0 | All 8 migrations applied, including InvoiceRevision. |
| `invoice-backend` | `npx --no-install prisma migrate status` | 0 | Database schema is up to date. |
| `invoice-backend` | `npx --no-install prisma migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code` | 0 | No difference detected; fresh migration chain matches schema.prisma. |
| `invoice-backend` | `npx --no-install prisma db seed` | 0 | Succeeded. |
| `invoice-backend` | `npx --no-install prisma db seed` | 0 | Succeeded; 1 user, 7 invoices, 11 revisions (5 on RT3080, 1 on each other invoice). |
| `invoice-backend` | `npx --no-install tsc --noEmit` | 0 | Passed. |
| `invoice-backend` | `npm run lint` | 1 | 17 errors and 20 warnings in existing application code; mostly formatting, plus type-safety rules. |
| `invoice-backend` | `npm run build` | 0 | Passed. |
| `invoice-backend` | `npx --no-install vitest run tests/unit --reporter=default` | 0 | 12 files, 112 tests passed. |
| `invoice-backend` | `npx --no-install vitest run tests/integration --reporter=default` | 1 | 11 passed, 3 failed; initial setup exceeds 10-second hook timeout, plus shared-database interference. See serial retry below. |
| `invoice-frontend` | `npx --no-install tsc -p tsconfig.app.json --noEmit` | 2 | 19 errors: missing prop-types declarations, form field/generic typing, and unused test variables. |
| `invoice-frontend` | `npx --no-install tsc -p tsconfig.node.json --noEmit` | 2 | 2 errors: path/fs default imports without allowSyntheticDefaultImports. |
| `invoice-frontend` | `npm run lint` | 2 | Configuration crashes: object is not iterable at eslint.config.mjs:39 (spreading pluginJs.configs.recommended). |
| `invoice-frontend` | `npm run build` | 0 | Passed; Vite warns about a chunk larger than 500 kB. |
| `invoice-frontend` | `npx --no-install vitest run tests --reporter=default` | 1 | 19 files passed, 1 failed; 96 tests passed, 2 failed, 2 skipped. Both failures are in tests/integration/newInvoiceForm.test.tsx (missing New Invoice heading and Save button). |
| `invoice-frontend` | `env TEST_LOGIN= TEST_PASSWORD= TEST_BASE_URL= PLAYWRIGHT_HTML_OUTPUT_DIR=/tmp/portfolio-slice1/playwright-report npx --no-install playwright test --reporter=line` | 1 | Blocked before tests: @playwright/test does not export Page at runtime. Test credentials and target URL deliberately cleared; no external Auth0 login attempted. |

Additional checks:

- `psql -h 127.0.0.1 -p 55432 -U postgres -d baseline` with row-count queries:
  seed counts above verified after the second seed, before integration tests mutate fixtures.
- Same `psql` connection with `\d "InvoiceRevision"`: verified JSONB snapshot, timestamp default,
  primary key, both lookup indexes, unique `(invoiceId, revisionNumber)`, invoice CASCADE FK,
  and creator SET NULL FK.
- `bash -n setup.sh`: passed.
- `docker compose -f docker-compose.dev.yml config --quiet`: passed.
- `docker compose -f docker-compose.demo.yml config --quiet`: passed; existing obsolete `version` warning.
- `git diff --check`: initially flagged CRLF on edited Compose lines; corrected those lines, then passed.

The application builds are green; the complete baseline quality gate is **not green**.
Existing lint, frontend typing, and frontend test defects remain explicitly outside this slice.
E2E execution remains blocked before any browser assertions run. Full Docker startup was not tested.
Existing integration suites still invoke `prisma db push` internally and have pre-existing
schema-isolation defects; fresh migration verification was completed separately before those tests.

Raw local execution logs are under `/tmp/portfolio-slice1/` (temporary, not committed).

## Integration retry and final review

From `invoice-backend`, with the same temporary database environment:

```sh
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
```

Passed: **14/14 tests across 2 files**, exit 0. This retry avoids simultaneous database
setup/cleanup and gives migration setup enough time. No assertions or timeouts were
changed in the repository. The default parallel invocation remains unreliable.

Finalization commands:

- `git restore -- invoice-backend/.yarn/install-state.gz`: discard install-generated tracked cache change.
- Byte comparison of each imported audit against `git show OAuth-phase1:docs/audit/<file>`: exact match.
- `git diff --check`: passed for implementation changes. Full staged check reports existing
  Markdown hard-break spaces and blank EOF lines in the three imported audits; preserved
  byte-for-byte. Staged check excluding those three source documents passes. Staged review
  includes only migration, setup/config hygiene, test database configuration, imported audits,
  and this report.
- `/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/portfolio-slice1/pgdata stop -m fast`: stop the temporary cluster.
- `git add` of the reviewed files and `git commit -m "chore(baseline): establish portfolio stabilization migration baseline"`:
  commits this slice. Final commit ID and working-tree status are reported in the task response.

Migration deployment uses the committed chain and does not baseline an existing database
that was previously created using `db push`. Such databases need a separately reviewed
migration reconciliation; no existing database was reset during this work.
