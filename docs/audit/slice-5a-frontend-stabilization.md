# Slice 5A — frontend TypeScript, ESLint, and test stabilization

Date: 2026-10-17 (America/Halifax).

## 1. Starting Commit and Scope

Branch `portfolio-stabilization`, starting HEAD `d4638588f0efe03a9b11175b2f4f6463671d4cd2`, initially clean. Read the stabilization plan and Slice 1, 4B and 4C reports; verified current configurations, tests, provider composition and historical diffs directly. Older recommendations are not treated as current failures.

Changes address frontend types, lint configuration/compliance and deterministic tests. No backend files, schema/migrations, deployment configuration, GraphQL contract, authentication architecture, Demo policy, invoice rules or revision semantics changed. Small promise/event annotations preserve invocation and existing error handling. No push, merge or deployment.

## 2. Baseline Frontend Errors

All six requested commands were run before source edits, using installed dependencies and Linux Node 24.15.0/npm 12.2.0. Initial shell PATH selected Windows npm and reported `WSL 1 is not supported` before executing checks; reran every command with the explicit Linux Node PATH. Raw corrected baseline logs are `/tmp/slice5a/baseline-{app,node,lint,parallel,serial,build}.log`.

| Check | Exit | Actual baseline |
| --- | ---: | --- |
| App TypeScript | 2 | 19 diagnostics: 12 missing prop-types declarations, 4 form typing errors, 3 test unused-variable errors |
| Node TypeScript | 2 | 2 incompatible Node default imports |
| ESLint | 2 | Configuration crash, before file analysis: `TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))` at eslint.config.mjs:39:23 |
| Default parallel Vitest | 1 | 110 pass, 1 fail, 2 skip; 21 files pass, 1 fail |
| Serial Vitest | 0 | 111 pass, 2 skip; 22 files pass |
| Vite production build | 0 | Pass, existing >500 kB chunk warning |

Parallel failure: `tests/integration/newInvoiceForm.test.tsx:33`, unable to find role `heading` with name `/new invoice/i` after 3000 ms; body contains only an empty render container. Serial passes. This is a scheduling-sensitive failure, not an assertion consistently broken in both modes. A working Vite bundle did not imply a working TypeScript gate.

Exact TypeScript diagnostics (all 21):

```text
src/features/invoices/components/CheckboxSelection.tsx(1,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/components/InvoiceGrid.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/components/InvoiceItem.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/components/InvoiceStatus.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/components/ToolbarButtons.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/forms/AddressBox.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/forms/FormErrorList.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/forms/edit/EditBottomMenu.tsx(1,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/forms/items/ItemPrice.tsx(17,5): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type 'FieldError | Merge<FieldError, FieldErrorsImpl<any>>'.
src/features/invoices/forms/items/ItemQuantity.tsx(16,5): error TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type 'FieldError | Merge<FieldError, FieldErrorsImpl<any>>'.
src/features/invoices/forms/newInvoice/NewInvoiceBottomMenu.tsx(1,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/invoices/forms/newInvoice/NewInvoiceBottomMenu.tsx(72,26): error TS2554: Expected 1-2 arguments, but got 0.
src/features/invoices/forms/newInvoice/NewInvoiceBottomMenu.tsx(74,64): error TS2345: Argument of type 'SubmitHandler<FormType>' is not assignable to parameter of type 'SubmitHandler<FieldValues>'.
src/features/shared/components/buttons/CancelButton.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/shared/components/buttons/DeleteButton.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
src/features/shared/components/buttons/EditButton.tsx(2,23): error TS7016: Could not find a declaration file for module 'prop-types'. '/home/djblackett/dev/invoice-web-app/invoice-frontend/node_modules/prop-types/index.js' implicitly has an 'any' type.
tests/unit/InvoiceCard.test.tsx(2,1): error TS6133: 'React' is declared but its value is never read.
tests/unit/hooks/useFormCaching.skip.tsx(63,11): error TS6133: 'result' is declared but its value is never read.
tests/unit/hooks/useFormCaching.skip.tsx(78,11): error TS6133: 'result' is declared but its value is never read.
vite.config.ts(5,8): error TS1259: Module '"path"' can only be default-imported using the 'allowSyntheticDefaultImports' flag
vite.config.ts(6,8): error TS1192: Module '"fs"' has no default export.
```

## 3. TypeScript Repairs

- Added compatible `@types/prop-types@15.7.14` as a dev dependency, using the existing local Yarn cache; only its lockfile entry and workspace dependency changed. No runtime dependency upgrade.
- Typed React Hook Form contexts with `FormType`, corrected the one-element `items` tuple to the existing variable-length array, and used typed dot field paths. Price/name/quantity errors are read before `Array.isArray` can widen indexed elements to `any`; original array guards, messages, defaults, limits and patterns remain.
- Draft submission already ignores handler arguments and reads `methods.getValues()`. Removed its inaccurate `SubmitHandler<FormType>` annotation; its inferred zero-argument async signature matches the existing button call. No validation or submission logic changed.
- Added styled-components theme augmentation and explicit Vite environment types. Existing absent legacy theme tokens remain optional, retaining their undefined/fallback behavior rather than introducing visual changes.
- Added local Apollo result generics and form/cache input annotations. Existing assumptions about successful invoice responses are expressed as local assertions rather than adding new loading/error behavior or modifying API contracts.
- Fixed unused test bindings/imports, used typed Vitest mock helpers and Apollo-shaped error/undefined fixtures, and completed form fixtures while preserving original calculation assertions.
- Node configuration now uses namespace imports from `node:path` and `node:fs`; neither strict project was weakened or given application exclusions.

Final app project: **0 errors**. Final Node project: **0 errors**.

## 4. ESLint Repair

Compared the exact frontend diff in `bb71d11a91cbb675e9939eb21aadfe49fb5649b9`. Reused its object-versus-array correction and explicit parser project/root configuration. Used React's actual flat recommended config and Prettier's flat recommended entry rather than spreading legacy objects or plugin-name arrays.

Application, existing test files (including archived `.skip` files) and Vite are linted with type information from tsconfig.app.json. Other TypeScript tooling/Playwright files receive strict syntax lint, since they are outside that project. JavaScript configs are linted too. Coverage/build/dependency artifacts are ignored; no application or test file was excluded to hide findings. Vitest config and shared provider wrappers are unchanged.

The first executable corrected config revealed **307 errors, 0 warnings**:

| Rule | Errors |
| --- | ---: |
| `@typescript-eslint/no-unsafe-return` | 151 |
| `@typescript-eslint/no-unsafe-assignment` | 53 |
| `@typescript-eslint/no-unsafe-member-access` | 35 |
| `@typescript-eslint/no-unsafe-call` | 20 |
| `prettier/prettier` | 14 |
| `@typescript-eslint/no-misused-promises` | 9 |
| `@typescript-eslint/no-floating-promises` | 9 |
| `@typescript-eslint/no-non-null-assertion` | 3 |
| `@typescript-eslint/require-await` | 3 |
| `@typescript-eslint/no-unsafe-argument` | 3 |
| `@typescript-eslint/no-redundant-type-constituents` | 2 |
| `@typescript-eslint/no-dynamic-delete` | 2 |
| `@typescript-eslint/no-unsafe-enum-comparison` | 2 |
| `@typescript-eslint/no-useless-constructor` | 1 |

Most unsafe returns were untyped styled theme access; other unsafe findings were environment, form, Apollo or mock typing. Remaining work comprised explicit promise discard at existing event boundaries, accurate promise-returning Auth0 callback types, redundant unions, unused boilerplate/non-null assertions and 14 formatting findings. Three Playwright support files received only syntax/type lint compliance; browser workflows were not repaired or run.

Historical global disabling of unsafe assignment/call/member/argument/return, floating promises, misused promises, enum comparisons and require-await was rejected. Existing no-explicit-any/off and unused-vars/warn policy is retained, rather than adding new global exemptions. Two documented local no-dynamic-delete exceptions preserve the existing error-removal behavior; the rule remains active everywhere else. Final `npm run lint`: **0 errors, 0 warnings**, exit 0.

## 5. Test Infrastructure Assessment

The existing shared renderer already provides Redux, DemoModeProvider, Apollo MockedProvider, theme, HashRouter and NewInvoiceProvider. Vitest uses isolated jsdom workers and automatically registered RTL cleanup. No evidence of cross-file store/provider leakage caused the observed timeout; active filtering tests mock selectors rather than dispatching into the shared store. No fake timers or arbitrary network/database delays are involved in the form test.

Retained `tests/testUtils.tsx`: historical MemoryRouter/route support and renderHook wrappers are useful future improvements but do not solve this failure. The historical renderer still imports the singleton Redux store and therefore does not itself guarantee fresh store state. MockedProvider already creates per-mount caches unless explicitly supplied one; constructing caches again on every wrapper render is unnecessary here.

The form test had duplicate cleanup, irrelevant NODE_ENV switching, debug DOM printing, and a random remount key. Removed those artifacts. Added one awaited render helper using real lazy child imports and React.act. The closed-form case now unmounts its open fixture and checks the actual heading rather than an unused data-testid that Sidebar never forwards.

Existing two discovered skips remain:

- `tests/unit/Login.test.tsx`: authenticated redirect. Login navigates through router state; the historical assertion only checks disappearance of a prompt without asserting a destination. A proper route-location test is deferred.
- `tests/integration/allInvoicesView.test.tsx`: pending-only filtering. The supplied list is unfiltered, while filtering happens in the parent hook. Keep the existing explicit TODO; current hook tests already cover filtering.

Existing archived `.skip.ts/.skip.tsx` files are outside Vitest's `*.test` include pattern and are additional deferred test work, not new skips. Their TypeScript/lint errors were repaired without enabling placeholder tests or claiming coverage from them. No new skipped tests.

## 6. Parallel-Test Reliability Findings

`InvoiceForm` lazily imports DateAndPayment outside its inner Suspense boundary. In production, the parent route supplies Suspense. A direct test render can therefore suspend the initial entire form while another worker is transforming its modules; the baseline empty DOM and serial success match this path. Timed role queries were effectively waiting for first-load work, rather than just rendered content.

Focused test-only correction: await the real date/custom-input/bottom-menu modules and render inside asynchronous React.act before starting assertions. The existing 3000 ms role-query timeout and Vitest defaults remain unchanged. No new sleeps, retries, fake timers, skipped cases, global motion mocks or outside-click mocks.

Two additional regression cases verify second-item quantity/price updates and computed total, and existing quantity/price pattern errors after Save. They cover the field-path and typed error-access repairs with the real form.

During implementation, an initial async-act-only parallel run passed. A later intermediate run failed two fixtures (new ApolloError absent from the module mock, and accidentally added empty IDs in expected utility output); corrected the fixture imports and restored the original utility expectations. These were repeatable fixture defects introduced during typing repair, not hidden flaky tests.

The historical global act shim was tried and rejected: RTL 13's CommonJS path still emitted ReactDOMTestUtils.act deprecation warnings. It did not justify retaining an ineffective global mock or hiding console output. Only the form test imports React.act directly. With the final test setup unchanged, **five consecutive default parallel runs and a serial diagnostic run pass** (113 passing, 2 skips, 22 files each). The complete `npm run check` also passes. Parallel execution is reliable in these observed runs; serial execution is available for diagnostics and is **not required** for the frontend gate. This is repeated local evidence, not a claim that arbitrary resource-starved environments can never time out.

## 7. Historical OAuth-phase1 Changes Reused or Rejected

| Historical change | Decision |
| --- | --- |
| bb71d11 ESLint object fix / parser project configuration | Selectively reused, adapted to installed flat configs |
| bb71d11 blanket type-safety rule disabling | Rejected; fixed findings instead |
| e992b3a testUtils MemoryRouter, renderHook and extra cache | Inspected; not needed for current failing path; retained existing renderer/export API |
| e992b3a setup React.act shim | Trial showed warnings persisted through CJS RTL; removed |
| Historical console warn/error filtering | Rejected; diagnostics remain visible |
| Global motion and outside-click mocks | Rejected; retain real animations and interactions |
| Broad historical test/form hook implementations and custom auth changes | Not imported; current suite already passed serially |
| Historical Vitest configuration | Identical to current useful configuration; no port needed |

## 8. Production Build Verification

`npm run build` passes before and after the repairs. Final verified build uses the existing package script and environment values; no deployment environment changes. Main bundle remains approximately 580.50 kB (185.49 kB gzip), with the existing >500 kB warning. Bundle splitting/performance work is deferred.

Reviewed all source diffs: generic/declaration changes have no runtime effect; GraphQL enum constants equal the previous string literals; event wrappers invoke the same handlers and explicitly ignore the same returned promises; existing error-removal operations and array guards remain. Revision query/style/formatting edits are formatting only; all six revision GraphQL templates (three operations and three fragments) were independently parsed/printed before and after, with identical output and fragment interpolation names. No meaningful user-visible behavior change is intended or observed in the existing suite and focused new form regressions. Browser E2E verification is the next slice.

## 9. Backend Regression Results

No backend files changed.

| Check | Result |
| --- | --- |
| Default backend tsc --noEmit | Pass |
| Backend production build | Pass |
| Backend units | 116/116 pass, 12 files |
| Backend full integration | 158/158 pass, 6 files |
| Backend lint | Existing 18 errors, 17 warnings; left untouched |

Integration used a fresh PostgreSQL 16.13 cluster at `/tmp/slice5a/pgdata`, loopback port 55441, database `frontend_regression`. Applied the current two committed migrations with `prisma migrate deploy`; no existing developer/production database was used. Sandbox initially denied socket creation; approved escalation permitted the disposable cluster and local test HTTP/JWKS servers. Generated authz/invariants/demo/user security schema count was zero after teardown. Cluster shut down cleanly.

## 10. Final Frontend Quality Gate

```bash
cd invoice-frontend
corepack yarn install --immutable
npm run check
```

The check script runs, in order:

```bash
npm run typecheck:app
npm run typecheck:node
npm run lint
npm test
npm run build
```

`npm test` is a single parallel Vitest run; `npm run test:unit` remains the existing watch command. `npm test -- --no-file-parallelism` is the optional serial diagnostic. Documented in invoice-frontend/README.md. No backend, database, external Auth0 credentials or browser are needed for this frontend gate.

## 11. Deferred Issues

No frontend TypeScript/lint/test/build blocker remains for this gate. Existing nonblocking concerns:

- The two skips and archived test files above; no additional skips added.
- RTL 13/react-hooks 8 peer-range/deprecated-act diagnostics with React 19. Existing incomplete Apollo mocks in AllInvoices tests, a global-flag regex warning and other console diagnostics remain visible. Upgrading the shared test libraries and improving those assertions can be separate work; no console suppression added.
- Some existing form contexts and GraphQL paths still use untyped/shared legacy inputs. Targeted local assertions express pre-existing response/cache assumptions without broadening this slice into runtime error handling or form-model redesign.
- Legacy optional theme tokens remain absent at runtime, preserving current appearance.
- Type-aware lint applies to the existing app project; extending separate config/Playwright type coverage is deferred. Current Node gate retains its existing Vite-only include list.
- Bundle-size warning, browser E2E, deployment verification and live Auth0 smoke testing remain later work. Backend lint remains outside scope.

## 12. Exact Files Changed

Paths below are relative to repository root. Production source/config files (including declaration-only and formatting-only files):

- `invoice-frontend/src/features/auth/hooks/useAuth.ts`
- `invoice-frontend/src/features/auth/pages/Login.tsx`
- `invoice-frontend/src/features/invoices/components/DeleteModal.tsx`
- `invoice-frontend/src/features/invoices/forms/edit/EditBottomMenu.tsx`
- `invoice-frontend/src/features/invoices/forms/items/InputFormItem.tsx`
- `invoice-frontend/src/features/invoices/forms/items/ItemName.tsx`
- `invoice-frontend/src/features/invoices/forms/items/ItemPrice.tsx`
- `invoice-frontend/src/features/invoices/forms/items/ItemQuantity.tsx`
- `invoice-frontend/src/features/invoices/forms/newInvoice/NewInvoiceBottomMenu.tsx`
- `invoice-frontend/src/features/invoices/hooks/useFormCaching.ts`
- `invoice-frontend/src/features/invoices/hooks/useInvoices.ts`
- `invoice-frontend/src/features/invoices/hooks/useSubmitDraft.ts`
- `invoice-frontend/src/features/invoices/hooks/useUpdateInvoice.ts`
- `invoice-frontend/src/features/invoices/pages/AllInvoices.tsx`
- `invoice-frontend/src/features/invoices/pages/ViewInvoice.tsx`
- `invoice-frontend/src/features/invoices/types/invoiceTypes.ts`
- `invoice-frontend/src/features/invoices/utils/errorUtils.ts`
- `invoice-frontend/src/features/revisions/components/RevisionHistoryPanel.tsx`
- `invoice-frontend/src/features/revisions/graphql/revision.queries.ts`
- `invoice-frontend/src/features/revisions/styles.ts`
- `invoice-frontend/src/features/revisions/utils/formatting.ts`
- `invoice-frontend/src/features/shared/components/Header.tsx`
- `invoice-frontend/src/features/shared/components/buttons/DemoButton.tsx`
- `invoice-frontend/src/features/shared/components/buttons/MarkAsPaidButton.tsx`
- `invoice-frontend/src/features/shared/components/buttons/NewItemButton.tsx`
- `invoice-frontend/src/features/shared/hooks/useApolloClient.ts`
- `invoice-frontend/src/features/shared/utils/utilityFunctions.ts`
- `invoice-frontend/src/styled.d.ts`
- `invoice-frontend/src/vite-env.d.ts`
- `invoice-frontend/vite.config.ts`

Tooling, tests, dependencies and documentation:

- `docs/audit/slice-5a-frontend-stabilization.md`
- `invoice-frontend/README.md`
- `invoice-frontend/eslint.config.mjs`
- `invoice-frontend/global-setup.ts`
- `invoice-frontend/package.json`
- `invoice-frontend/qa/pages/edit/editForm.ts`
- `invoice-frontend/qa/tests/invoiceView.spec.ts`
- `invoice-frontend/tests/integration/newInvoiceForm.test.tsx`
- `invoice-frontend/tests/unit/InvoiceCard.test.tsx`
- `invoice-frontend/tests/unit/Login.test.tsx`
- `invoice-frontend/tests/unit/RevisionDiffView.test.tsx`
- `invoice-frontend/tests/unit/demoMode.test.tsx`
- `invoice-frontend/tests/unit/hooks/useAddInvoice.test.ts`
- `invoice-frontend/tests/unit/hooks/useFormCaching.skip.tsx`
- `invoice-frontend/tests/unit/hooks/useHandleFormReset.skip.tsx`
- `invoice-frontend/tests/unit/hooks/useInvoices.test.ts`
- `invoice-frontend/tests/unit/hooks/useSubmitNewInvoice.skip.ts`
- `invoice-frontend/tests/unit/hooks/useUpdateInvoice.test.ts`
- `invoice-frontend/tests/unit/useApolloClient.test.ts`
- `invoice-frontend/tests/unit/utils/utilityFunctions.test.ts`
- `invoice-frontend/yarn.lock`

## 13. Verification Commands and Results

Linux tooling selection used for all npm/npx/Yarn commands:

```bash
export PATH=/home/djblackett/.nvm/versions/node/v24.15.0/bin:$PATH
```

All requested pre-edit commands were executed verbatim from invoice-frontend:

```bash
npx --no-install tsc -p tsconfig.app.json --noEmit
npx --no-install tsc -p tsconfig.node.json --noEmit
npm run lint
npx --no-install vitest run tests --reporter=default
npx --no-install vitest run tests --reporter=default --no-file-parallelism
npm run build
```

Dependency repair from invoice-frontend: `YARN_ENABLE_NETWORK=0 corepack yarn install` with the exact cached @types/prop-types version succeeded; existing peer warnings remain. Initial caret-version resolution was blocked by disabled network; exact cached version required no fetch. Root-directory Yarn invocation initially produced an unintended empty root lockfile; removed immediately, never included in the change.

Final frontend: `npm run check` exits 0; `npm run lint -- --format json` reports zero errors/warnings. Five separate `npm test` runs and `npx --no-install vitest run tests --reporter=default --no-file-parallelism` exit 0, each with 113 pass and 2 existing skips. Raw logs and timing/exit summaries are under `/tmp/slice5a/`, including `quality-gate.log`, `final-quality-gate.log`, `final-lint.json`, `final-parallel-{1..5}.log`, `final-serial.log`, and `final-test-results.json`.


| Final reliability run | Exit | Seconds |
| --- | ---: | ---: |
| final-parallel-1 | 0 | 5.86 |
| final-parallel-2 | 0 | 7.88 |
| final-parallel-3 | 0 | 7.29 |
| final-parallel-4 | 0 | 7.89 |
| final-parallel-5 | 0 | 7.89 |
| final-serial | 0 | 30.43 |

Disposable backend setup from repository root:

```bash
mkdir -p /tmp/slice5a/pgsocket
/usr/lib/postgresql/16/bin/initdb -D /tmp/slice5a/pgdata -U postgres --auth=trust
/usr/lib/postgresql/16/bin/pg_ctl -D /tmp/slice5a/pgdata -l /tmp/slice5a/postgres.log -o '-p 55441 -k /tmp/slice5a/pgsocket -h 127.0.0.1' start
/usr/lib/postgresql/16/bin/createdb -h 127.0.0.1 -p 55441 -U postgres frontend_regression
```

From invoice-backend:

```bash
export DATABASE_URL=postgresql://postgres@127.0.0.1:55441/frontend_regression NODE_ENV=test DEMO_MODE=false CERT_DIR=../certs/
npx --no-install prisma migrate deploy
npx --no-install tsc --noEmit
npm run lint
npm run build
npx --no-install vitest run tests/unit --reporter=default
npx --no-install vitest run tests/integration --reporter=default --no-file-parallelism --hookTimeout=60000
```

Backend serial execution and setup hook timeout are the existing database-test safeguard, independent of the repaired frontend parallel command. Backend logs: `backend-{types,lint,build,unit,migrate,integration}.log`.

Finalization: checked generated-schema cleanup, stopped the cluster with `pg_ctl ... stop -m fast`, reviewed source/contract/behavior diffs and exact file list, and ran `git diff --check` and staged whitespace checks. Local commit message: `chore(frontend): stabilize types lint and test infrastructure`. Commit hash and clean working-tree status are reported in the completion response; no push/merge/deploy.
