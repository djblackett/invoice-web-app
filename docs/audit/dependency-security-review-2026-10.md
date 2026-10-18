# Dependency security and maintenance review — October 2026

Review date: 2026-10-18 (America/Halifax). Scope: current `main`, dependency
maintenance, historical PR assessment, and regression verification. No merge,
deployment, hosting/Auth0 changes, production database access, security-setting
changes, force-push, or historical branch deletion.

## 1. Starting Main Commit

Fetched `origin`, then independently checked GitHub's `commits/main` endpoint.
Both identify `e166c7b76c899ae409b96f673bc2391acd437122`, the merge of
[PR #105](https://github.com/djblackett/invoice-web-app/pull/105).
The initial checkout was clean on `portfolio-stabilization` at
`1e1b9b200f688962936baa504e36dfbd7b562634`. Created
`maintenance/dependency-security-2026-10` directly from `origin/main`;
the stabilization branch was not modified.

Read README, the portfolio stabilization plan, Slice 5A, Slice 5C, Slice 6A,
and Slice 6B2A; actual current workflows, manifests, lockfiles and source take
precedence over historical proposals. Current main's hosted
[quality gates](https://github.com/djblackett/invoice-web-app/actions/runs/39154251504)
and [CodeQL](https://github.com/djblackett/invoice-web-app/actions/runs/39154251500)
were successful. Successful CodeQL execution does not mean zero alerts.

## 2. Remaining Historical PR Assessment

States were queried afresh. **#98, #99 and #103 were already closed, unmerged,
before this session; #104 was open.** Compared historical base-to-head changes
and relevant implementations against current main, not merely PR titles.

| PR | Assessment against current main | Residual difference / disposition |
| --- | --- | --- |
| [#98 Reattached](https://github.com/djblackett/invoice-web-app/pull/98), head `811a228` | SQLite database infrastructure, split auth/context helpers, old revision service/resolvers, experimental tooling and test harness are superseded by PostgreSQL migrations, central authorization, revision diff/restore and real-backend E2E. Do not import the old architecture. | Experimental invoice PDF export (introduced in `94d53c2`) and revision-history filters are unique optional features, not missing security corrections. Preserve branch for separate feature consideration. Already closed; no state change. |
| [#99 Revision history](https://github.com/djblackett/invoice-web-app/pull/99), head `698a401` | Earlier SQLite-backed revision implementation and dependency bumps predate the independently verified PostgreSQL revision system. Current ownership checks, totals/status rules, diff, restore and browser workflows supersede its core implementation. | Same experimental PDF/filter functionality deserves separate product assessment if wanted; no unique critical correction identified for this maintenance scope. Already closed; no state change. |
| [#103 Security](https://github.com/djblackett/invoice-web-app/pull/103), head `6181530` | Database-credential logging is superseded by logging only whether a DB is configured. Current authorization and Demo isolation supersede its auth changes; its `DEMO_ADMIN_TOKEN`, test-token bypass and Demo database overwrite must not return. Historical Docker changes are superseded by current compiled images. | **Not entirely superseded:** stricter development CORS origins remain absent; current CodeQL alert #12 identifies that code. Structured logger injection, logger escape-sequence repair and create-invoice toasts also differ. Report the security exception; do not claim all its improvements were incorporated. Already closed; no automatic closure/reopening or architecture import. |
| [#104 Dependabot](https://github.com/djblackett/invoice-web-app/pull/104), head `9bb32d3` | Exact patch changes both Yarn lockfiles, frontend Vite manifest and a generated backend install-state binary. Its February proposal predates stabilization. | Retained open. All five proposed dependency families are covered by the replacement, often with newer fixes; do not merge/cherry-pick its stale graph. |

The residual #103 CORS issue is
[open CodeQL alert #12](https://github.com/djblackett/invoice-web-app/security/code-scanning/12),
`js/cors-permissive-configuration`, medium security severity, warning level,
`invoice-backend/src/config/server.config.ts:41`. It concerns the non-production
fallback `origin: "*"`; production uses its configured origin. This needs a
separate bounded behavior change and verification, not a declaration that the
historical branch was fully salvaged. No alert was dismissed or suppressed.

## 3. PRs Closed and Rationale

**No PR was closed or commented on by this session.** GitHub reports closure of
#98 at `2026-10-18T19:16:12Z`, and #99/#103 at `19:16:13Z`, all unmerged.
Issue-comment endpoints returned no explanatory comments at assessment time.
Already-closed state is preserved; this report supplies the comparison rather
than posting duplicate closure messages or incorrectly claiming credit.
Historical branches remain intact. #104 remains open until replacement merge
or an explicitly approved supersession decision.

## 4. Package Manager and Lockfile Findings

Both packages pin `yarn@4.6.0`, use `nodeLinker: node-modules`, and require
Node `>=24 <25`. `.nvmrc`, CI and Docker select Node **24.15.0**. All actual
commands used Linux Node's explicit PATH; the shell's initial Windows npm was
unusable. Global/root-context Yarn is 1.22.22; package-directory
`corepack yarn` correctly selects 4.6.0.

The two **active lockfiles are `invoice-backend/yarn.lock` and
`invoice-frontend/yarn.lock`**. There is no tracked root package/lockfile or active
npm lockfile. npm runs scripts; CI, Docker and documented installs use immutable
Yarn. No package-manager migration or lockfile removal occurred.

Backend `.yarn/install-state.gz` is a tracked generated local install cache,
not a lockfile and not copied into Docker dependency stages. Yarn changes it
during installs. Its original committed bytes are retained in the final diff;
it is not used to represent the dependency update. Cleanup of this artifact is
separate maintenance. Existing React/RTL and other peer warnings are recorded,
not hidden; Vitest/UI versions are now aligned.

## 5. Dependency Audit Method

Before changing dependencies, ran frontend `check` and E2E types, backend
`check`, and the managed PostgreSQL regression/browser runner. Verified baseline
immutable installs. Audited each package using:

```sh
corepack yarn npm audit --all --recursive --json
```

This includes direct, development, transitive and deprecated dependencies.
Parsed the committed lockfiles for resolved versions and dependency chains;
traced production-declared dependency closures separately from actual use.
Some backend build tools are declared in `dependencies`; declaration alone
does not establish an application request path. The backend image currently
copies development dependencies too; tooling presence in that image is distinct
from execution by the compiled API.

Queried authenticated GitHub Dependabot alerts (287 total: **168 open**, 52
auto-dismissed, 67 fixed), open code-scanning alerts (**one**), open PRs, exact
#104 patch and historical diffs. Old Dependabot states/ranges were cross-checked
against fresh Yarn graph audits, not counted as current application exploits.
Read primary GitHub advisory details, registry versions/engine/lifecycle metadata
and maintainer release notes. Registry checks were performed during this session,
including October 2026 releases; historical #104 versions were not assumed latest.

Raw local evidence is in `/tmp/invoice-dependency-audit/`; browser artifacts have
separate temporary directories recorded below. These are local diagnostic files,
not durable hosted artifacts. The committed CSV preserves the finding inventory.
No `npm audit fix`, forced update, audit ignore or finding suppression was used.

## 6. Security Advisories Identified

The [full finding inventory](dependency-security-review-2026-10-findings.csv)
contains **222 baseline package/advisory/range records** (106 backend, 116
frontend). Every row gives package, installed/affected versions, severity,
production/development declaration, reachability, advisory patched versions,
final versions, action and primary source. Multiple ranges and copies of a
package are intentional; these are not 222 independent exploitable flaws.
Deprecations are tracked separately below.

Material remediation groups:

| Area | Security finding and application relevance | Action |
| --- | --- | --- |
| Express, body-parser, qs, proxy-addr, path-to-regexp | Request parsers and Web-facing routing/header processing warrant priority; transitive dependencies are part of the server attack surface. Specific route/charset/option prerequisites vary. [Proxy parser](https://github.com/advisories/GHSA-jqcg-44mw-7w3h), [query parsing](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g), [route matching](https://github.com/advisories/GHSA-37ch-88jc-xwx2). | Update within Express 4 / body-parser 1, including old transitive Express descriptor. |
| ws / jws | Untrusted WebSocket frames and bearer JWTs reach backend parsing/verification. JWT application uses RS256/JWKS, whereas [jws advisory](https://github.com/advisories/GHSA-869p-cjfg-cm3x) targets HS256/secret handling. [ws advisory](https://github.com/advisories/GHSA-96hv-2xvq-fx4p). | Patch all used ws 7/8 branches and jws 3. |
| Vite / Vitest | Development server file access and test UI execution are meaningful developer/CI risks, although nginx serves the deployed frontend. [Vite](https://github.com/advisories/GHSA-fx2h-pf6j-xcff), [Vitest UI critical advisory](https://github.com/advisories/GHSA-5xrq-8626-4rwp). | Vite 6.4.4 everywhere, Vitest/UI 3.2.7; remaining independent findings documented. |
| Playwright | [Browser downloader lacks certificate verification](https://github.com/advisories/GHSA-7mvr-c777-76hp); it is actually used by browser setup. | 1.55.1, the security-fix release, rather than unrelated latest 1.64 modernization. |
| form-data / formidable / sha.js | [Predictable multipart boundaries](https://github.com/advisories/GHSA-fjxv-7rqg-78g4), additional [multipart hardening](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx), [upload parsing](https://github.com/advisories/GHSA-75v8-2h7p-7m2m), [hash input issue](https://github.com/advisories/GHSA-95m3-7q98-8xr5). Paths are test/type/codegen dependencies; no app upload endpoint was found. | Compatible patched branches, including newer form-data fix than #104. |
| tar / native-build cache / SOCKS | Archive extraction and downloaded/native build inputs are supply-chain surfaces, even without an invoice request route. [tar](https://github.com/advisories/GHSA-23hp-3jrh-7fpw), [cache](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), [IP parser](https://github.com/advisories/GHSA-mwp4-54f8-5fhr). | tar 7.5.22, http-cache-semantics 4.3.0; supported socks 2 patch pulls ip-address 10 and removes sprintf-js. |
| React Router | Many advisories concern SSR/loaders/actions, absent from this HashRouter SPA; compatible client-side fixes still warrant maintenance. [Representative router advisory](https://github.com/advisories/GHSA-chx6-hx7r-mcp5). | React Router/DOM 7.18.4; obsolete turbo-stream removed by upstream dependency changes. |
| CSS / lodash / glob and config parsers | Source/build/test inputs can reach these parsers; do not equate absence of an HTTP handler with zero developer exposure. [PostCSS](https://github.com/advisories/GHSA-r28c-9q8g-f849), [lodash](https://github.com/advisories/GHSA-r5fr-rjxr-66jc). | Target named compatible releases, with narrow resolutions for constrained copies. |

## 7. Dependency Updates Selected

Manifests raise the security floors for Apollo Server 4, Express 4, body-parser 1,
ws 8, React Router DOM 7, Vite 6 and ESLint 9/`@eslint/js`. Both packages align
Vitest/UI to exact 3.2.7; frontend aligns Playwright/test to exact 1.55.1.
The frontend optional musl Rollup native package is aligned with resolved
Rollup 4.64.10, avoiding the old explicitly pinned 4.9.5 binary.

Used package-directory Yarn installs plus `yarn up --recursive` for **named
vulnerable families**, preserving other locks. This refreshes existing descriptors
without blindly upgrading every direct dependency. Parent updates necessarily
update their support packages, including Vitest internals, ESLint internals,
Rollup native distributions and React Router internals. The lockfiles were not
deleted or globally regenerated. Supported socks 2 patch updates introduce
ip-address 10 as an upstream-supported dependency change; no forced IP-library
major resolution was applied.

| Narrow resolution | Rationale |
| --- | --- |
| Both: `vite: 6.4.4` | Vitest 3.2.7 allows Vite 5/6/7; retain the established Vite 6 toolchain and remove duplicate vulnerable Vite 6.1.0. |
| Backend: `lodash@npm:~4.17.0 -> npm:4.18.1` | Codegen helper's tilde range otherwise caps at vulnerable 4.17.23. Same-major security release; no codegen framework migration. |
| Frontend: `minimatch@npm:9.0.3 -> npm:9.0.9` | Legacy prettier-eslint parser pins an affected exact copy; same-major patch addresses it. |
| Frontend: `postcss@npm:8.4.49 -> npm:8.5.30` | styled-components pins an affected exact parser. Same-major minor fix avoids unrelated styled-components upgrade. |

Changed installed packages' declared Node engines were checked against 24.15.0;
none were incompatible. Selected direct packages declare no install hooks.
Registry `prepare`/`prepublish` scripts (for example socks/tar) are not registry
install hooks under Yarn 4; no global tool installation was invoked. Existing
Prisma, protobufjs and esbuild build steps were allowed when Yarn required them
after graph changes. No scripts were disabled to make installation pass.

Maintainer evidence: [Vite 6.4.4 changelog](https://github.com/vitejs/vite/blob/v6.4.4/packages/vite/CHANGELOG.md),
[Vitest 3.2.7](https://github.com/vitest-dev/vitest/releases/tag/v3.2.7),
[Playwright 1.55.1](https://github.com/microsoft/playwright/releases/tag/v1.55.1),
[React Router 7.18.4](https://github.com/remix-run/react-router/blob/react-router%407.18.4/CHANGELOG.md).
No application source, tests, schema, workflows or runtime policy changes were needed.

### Exact assessment of #104

| Family | Current main | #104 proposal | Replacement | Decision |
| --- | --- | --- | --- | --- |
| form-data | 4.0.1 both | 4.0.5 | 4.0.6 both | Still necessary; historical target superseded by additional security fix. |
| formidable | 2.1.2 backend | 2.1.5 | 2.1.5 backend | Still necessary; compatible maintained 2.x fix. |
| sha.js | 2.4.11 backend | 2.4.12 | 2.4.12 backend | Still necessary; applied within current branch. |
| tar | 7.4.3 both | 7.5.9 | 7.5.22 both | Historical fix insufficient for subsequent advisories. |
| Vite | backend 6.3.3; frontend 6.1.0 and 6.3.3 | 6.4.1 | 6.4.4 everywhere | Historical fix insufficient; also remove duplicate vulnerable frontend copy. |

All five families are still in the graph, none were already fully patched on
starting main, and none required importing the historical PR's architecture.

## 8. Updates Deferred and Why

The remaining known vulnerabilities are **deferred**, not dismissed or formally
accepted on the owner's behalf. Their actual prerequisites are recorded in
section 12. Do not expose development test servers or run untrusted codegen
templates as trusted code. Major migrations should be separately reviewed.

Prioritize supported Apollo Server and GraphQL Tools upgrades, then the Vitest
worker/mocker chain and mock-data generator. Do not force tinypool 2 into Vitest's
`^1.1.1` constraint or GraphQL Tools utils 12 into older schema/codegen internals.
uuid's affected buffer APIs are not used; replacing v4 callers is unnecessary
for this advisory. braces has no patched registry release in the captured audit.

Other deferred majors include Apollo Client 4, Prisma 7+, GraphQL 17,
Vite 8, Vitest 4/5, Express 5, GraphQL WS 6, Inversify 8, ESLint 10, jsdom 30,
Zod 4 and React testing-library migration. Newer same-major releases of React,
Auth0, Prisma, TypeScript, UI/form libraries and Playwright were inventoried but
not installed without a security/maintenance reason. Registry dist-tags can
include prereleases (notably Prisma); these are not automatic upgrade targets.

Remaining deprecations: Apollo Server v4 gateway interface; ESLint 9 backend and
legacy ESLint 8 frontend; glob 7/10, inflight, rimraf 2/3; backend GraphQL 14 via
graphql-prettier, inversify-dts, subscriptions-transport-ws, Superagent 8 and
Supertest 6; frontend legacy humanwhocodes config/object schema, tsconfck and
whatwg-encoding. These are upstream maintenance signals, not additional CVEs.
Apollo v4 is EOL; its 4.13 security backport does not restore vendor support.

## 9. Before/After Dependency Versions

Resolved versions, not just manifest ranges. Multiple copies are shown together.
Support-package changes induced by the selected parents are visible in the Yarn
diff; platform-specific Rollup packages follow the same 4.64.10 release.

| Package | Dependency | Before | After |
| --- | --- | --- | --- |
| backend | @apollo/server | 4.11.3 | 4.13.0 |
| backend | @eslint/js | 9.20.0, 9.25.1 | 9.39.5 |
| backend | @eslint/plugin-kit | 0.2.8 | 0.4.1 |
| backend | @humanfs/node | 0.16.6 | 0.16.8 |
| backend | @protobufjs/utf8 | 1.1.0 | 1.1.2 |
| backend | @rollup/rollup-linux-x64-musl | 4.40.0 | 4.64.10 |
| backend | @vitest/mocker | 3.0.8 | 3.2.7 |
| backend | @vitest/ui | 3.0.7 | 3.2.7 |
| backend | ajv | 6.12.6 | 6.15.0 |
| backend | body-parser | 1.20.3 | 1.20.8 |
| backend | brace-expansion | 1.1.11, 2.0.1 | 1.1.21, 2.1.7 |
| backend | diff | 4.0.2 | 4.0.4 |
| backend | eslint | 9.25.1 | 9.39.5 |
| backend | fflate | 0.8.2 | 0.8.3 |
| backend | flatted | 3.3.2, 3.3.3 | 3.4.4 |
| backend | form-data | 4.0.1 | 4.0.6 |
| backend | formidable | 2.1.2 | 2.1.5 |
| backend | glob | 10.4.5, 7.2.3 | 10.5.0, 7.2.3 |
| backend | http-cache-semantics | 4.1.1 | 4.3.0 |
| backend | ip-address | 9.0.5 | 10.7.4 |
| backend | js-yaml | 4.1.0 | 4.3.2 |
| backend | jws | 3.2.2 | 3.2.3 |
| backend | lodash | 4.17.21 | 4.18.1 |
| backend | minimatch | 3.1.2, 9.0.5 | 3.1.5, 9.0.9 |
| backend | moment | 2.30.1 | 2.31.0 |
| backend | nanoid | 3.3.8 | 3.3.20 |
| backend | path-to-regexp | 0.1.12 | 0.1.13 |
| backend | picomatch | 2.3.1, 4.0.2 | 2.3.2, 4.0.7 |
| backend | postcss | 8.5.3 | 8.5.30 |
| backend | proxy-addr | 2.0.7 | 2.0.8 |
| backend | qs | 6.13.0, 6.14.0 | 6.16.1 |
| backend | rollup | 4.40.0 | 4.64.10 |
| backend | sha.js | 2.4.11 | 2.4.12 |
| backend | socks | 2.8.4 | 2.8.10 |
| backend | source-map-js | 1.2.1 | 1.2.2 |
| backend | sprintf-js | 1.1.3 | removed |
| backend | tar | 7.4.3 | 7.5.22 |
| backend | tinypool | 1.0.2 | 1.1.1 |
| backend | vite | 6.3.3 | 6.4.4 |
| backend | vitest | 3.0.8 | 3.2.7 |
| backend | ws | 7.5.10, 8.18.0, 8.18.1 | 7.5.13, 8.22.0 |
| frontend | @babel/core | 7.26.8 | 7.29.7 |
| frontend | @babel/helpers | 7.26.7 | 7.29.10 |
| frontend | @babel/runtime | 7.26.7 | 7.29.10 |
| frontend | @eslint/js | 8.57.1, 9.20.0, 9.25.1 | 8.57.1, 9.39.5 |
| frontend | @eslint/plugin-kit | 0.2.8 | 0.4.1 |
| frontend | @humanfs/node | 0.16.6 | 0.16.8 |
| frontend | @playwright/test | 1.51.0 | 1.55.1 |
| frontend | @rollup/rollup-linux-x64-musl | 4.34.6, 4.40.0, 4.9.5 | 4.64.10 |
| frontend | @vitest/mocker | 3.0.5 | 3.2.7 |
| frontend | @vitest/ui | 3.0.5 | 3.2.7 |
| frontend | ajv | 6.12.6 | 6.15.0 |
| frontend | brace-expansion | 1.1.11, 2.0.1 | 1.1.21, 2.1.7 |
| frontend | browserslist | 4.24.4 | 4.29.3 |
| frontend | diff | 4.0.2 | 4.0.4 |
| frontend | esbuild | 0.24.2, 0.25.2 | 0.25.2 |
| frontend | eslint | 8.57.1, 9.25.1 | 8.57.1, 9.39.5 |
| frontend | fflate | 0.8.2 | 0.8.3 |
| frontend | flatted | 3.3.2 | 3.4.4 |
| frontend | form-data | 4.0.1 | 4.0.6 |
| frontend | glob | 10.4.5, 7.2.3 | 10.5.0, 7.2.3 |
| frontend | http-cache-semantics | 4.1.1 | 4.3.0 |
| frontend | ip-address | 9.0.5 | 10.7.4 |
| frontend | js-yaml | 4.1.0 | 4.3.2 |
| frontend | lodash | 4.17.21 | 4.18.1 |
| frontend | minimatch | 3.1.2, 9.0.3, 9.0.5 | 3.1.5, 9.0.9 |
| frontend | nanoid | 3.3.8 | 3.3.20 |
| frontend | picomatch | 2.3.1, 4.0.2 | 2.3.2, 4.0.7 |
| frontend | playwright | 1.51.0 | 1.55.1 |
| frontend | postcss | 8.4.49, 8.5.2, 8.5.3 | 8.5.30 |
| frontend | react-router | 7.3.0 | 7.18.4 |
| frontend | react-router-dom | 7.3.0 | 7.18.4 |
| frontend | rollup | 4.34.6, 4.40.0 | 4.64.10 |
| frontend | socks | 2.8.4 | 2.8.10 |
| frontend | source-map-js | 1.2.1 | 1.2.2 |
| frontend | sprintf-js | 1.1.3 | removed |
| frontend | tar | 7.4.3 | 7.5.22 |
| frontend | tinypool | 1.0.2 | 1.1.1 |
| frontend | turbo-stream | 2.4.0 | removed |
| frontend | vite | 6.1.0, 6.3.3 | 6.4.4 |
| frontend | vitest | 3.0.5 | 3.2.7 |
| frontend | ws | 8.18.1 | 8.22.0 |

## 10. Local Quality-Gate Results

| Gate | Before updates | Final dependency graph |
| --- | --- | --- |
| Backend `npm run check`: typecheck, zero-warning ESLint, units, production build | PASS; 116 units | PASS; 116 units |
| Backend migrated PostgreSQL integrations | PASS; 158 cases | PASS; 158 cases |
| Frontend `npm run check`: both typechecks, ESLint, Vitest, production build | PASS; 115 passing, 2 existing skips | PASS; 115 passing, 2 existing skips |
| Frontend `typecheck:e2e` | PASS | PASS |
| Frontend standalone production build | Included in baseline check | PASS separately |
| Both Yarn `install --immutable` | PASS | PASS |

Integration used only managed temporary PostgreSQL 16 clusters, generated random
ports and new databases, with committed migrations. Existing production/developer
databases were never used. Final cluster artifacts: `/tmp/invoice-e2e-iWNHAe/`,
including `backend-unit.log` and `backend-integration.log`. Original Vitest
assertions and both skipped frontend tests were preserved; no new exclusions or
test retries were added. Existing RTL `ReactDOMTestUtils.act` warnings persist.

## 11. Browser and Container Verification

Baseline first failed all browser launches because Playwright's exact Chromium
revision 1161 was absent, before any application assertion. Installed that
revision, reran unchanged baseline, and **17/17 Chromium passed**, zero skips
or retries. The initial managed run independently passed 116 units and 158
integrations. Successful baseline browser artifacts: `/tmp/invoice-e2e-lyCwUa/`;
initial prerequisite failure/integration evidence: `/tmp/invoice-e2e-eshgpB/`.

Final Playwright 1.55.1 uses Chromium 1193 and Firefox 1490. Ran:

```sh
PG_BIN=/usr/lib/postgresql/16/bin E2E_BACKEND_REGRESSION=true \
E2E_FIREFOX_EXECUTABLE=/home/djblackett/.cache/ms-playwright/firefox-1490/firefox/firefox \
  npm --prefix invoice-frontend run test:e2e
```

**PASS: 18/18 cases** (17 Chromium desktop/mobile/Demo-disabled plus one Firefox
smoke), zero failures, skips, retries or flaky cases. Browser suite uses the real
compiled backend. Final report: `/tmp/invoice-e2e-iWNHAe/playwright-report/index.html`.

Container verification uses only dedicated local Compose project
`invoice-dependency-20261018`, after confirming its containers/volumes and ports
were unused. Explicit `--env-file /dev/null`, Demo disabled, empty Auth0 settings,
frontend port 15173 and backend port 18000 prevent accidental operator environment
reuse. The database is project-scoped, new and unexposed.

**PASS:** both production Docker images built with immutable locked installs;
fresh PostgreSQL/backend/frontend startup became healthy. Health HTTP 200, static
application/root HTTP 200, real GraphQL `__typename: Query`, and Demo-token invoice
access rejection were verified. The fresh migrated database had 0 users, 0 invoices
and 0 revisions, confirming no automatic seed/reset. Dedicated containers, network
and disposable volume were removed after checks. Local logs:
`final-compose.log`, `final-container-smoke.log`, `final-container-cleanup.log`
under `/tmp/invoice-dependency-audit/`. No public resources were created.

## 12. Post-Update Vulnerability Findings

| Audit | Before advisory records | Final advisory records | Records no longer reported | Deprecations before / after |
| --- | ---: | ---: | ---: | --- |
| Backend | 106 | 9 | 97 | 10 / 10 |
| Frontend | 116 | 6 | 110 | 9 / 8 |

Comparing unique `(package, advisory URL)` identities rather than range records
gives 83 backend and 96 frontend identities no longer reported. **No new advisory
identity is present in the final graph.** This is an npm advisory-service result,
not proof that all possible vulnerabilities are absent. Final audits still exit
nonzero because of the following known findings.

| Package / severity / affected installed version | Patched release | Reachability and recommended follow-up |
| --- | --- | --- |
| Backend Apollo Server 4.13.0; moderate; [GHSA-9q82-xgwf-vj6h](https://github.com/advisories/GHSA-9q82-xgwf-vj6h), affected `<5.5.0` | 5.5.0 | XS-Search advisory requires authenticated cross-site requests using ambient cookies plus a buggy browser. This API extracts Authorization bearer headers and has no cookie-auth path. No application exploit demonstrated; supported Apollo 5 migration remains a priority because v4 is EOL. The independent standalone-server DoS is patched in 4.13.0 and its standalone API is not used here. |
| Backend GraphQL Tools utils 9.2.1 / 10.8.1; high; [GHSA-7mx3-vvmw-hjmv](https://github.com/advisories/GHSA-7mx3-vvmw-hjmv), affected `<=12.0.0` | 12.0.1 | Advisory describes federated subgraph-result merge prototype pollution. App has one static schema and no subgraph/gateway result merging. Do not force a two/three-major utils jump underneath schema/codegen; migrate supported parents and verify separately. |
| Backend Faker 8.4.1; high; [GHSA-qxc2-j82w-r537](https://github.com/advisories/GHSA-qxc2-j82w-r537), affected `<=10.4.0` | 10.5.0 | Dev-only mock-data generator dependency. Requires attacker-controlled helpers.fake patterns/function properties; no application caller found. Parent generator/Faker migration is deferred. |
| Both tinypool 1.1.1; two critical advisories; [worker options](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), affected `<=2.1.0`, and [run options](https://github.com/advisories/GHSA-85c8-ppgw-ccpr), affected `<2.1.2` | 2.1.1 / 2.1.2 respectively | Test-only worker execution; requires a separate prototype-pollution primitive in the test process. This is a developer/CI risk, not an observed invoice endpoint RCE. No compatible 1.x fix available. Upgrade the Vitest worker chain separately rather than override its major constraint. |
| Both braces 3.0.3; high; [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), affected `<=3.0.3` | None listed; registry latest remains 3.0.3 | Build/test glob patterns, including backend production-declared build tools. Deep attacker-controlled patterns can exhaust recursion; app does not accept user glob patterns. Track upstream fix/parent replacement; no blanket ignore. |
| Both Vitest / @vitest/mocker 3.2.7; moderate, one advisory recorded for each package; [GHSA-82fw-gwwq-j7x9](https://github.com/advisories/GHSA-82fw-gwwq-j7x9), affected `>=2.1.0 <4.1.11` | 4.1.11 | Standalone mocker/interceptor HMR plugin or authenticated browser-mode RPC prerequisite. This project runs CLI node/jsdom tests, with no public mocker plugin/browser test server. Separate supported Vitest major migration. |
| Backend uuid 9.0.1 / frontend uuid 10.0.0; moderate; [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), affected `<11.1.1` | 11.1.1 | Advisory concerns v3/v5/v6 APIs with external output buffers/offsets. Frontend calls v4() without buffers; Apollo's uuid use is v4. Affected API path not found. Defer direct/transitive majors; preserve unique-ID behavior and type compatibility. |

Additional **existing CodeQL alert #12** remains open as described in section 2.
This report does not constitute owner acceptance of any deferred risk. Audits
cover npm/Yarn dependency advisories, not a container OS scan, live Auth0 testing,
production penetration test, or a proof of exploitability for every library.

## 13. GitHub-Hosted CI and CodeQL Results

On dependency commit **`d51ea8f2e0f4d656933f454da7487c0d245b985e`**:

- [CI quality gates 39159426509](https://github.com/djblackett/invoice-web-app/actions/runs/39159426509): **SUCCESS**, all four jobs. Hosted logs confirm frontend 115 passing / 2 existing skips, backend 116 units / 158 integrations, and 17 Chromium cases passing. Production images, fresh migrated Compose startup, HTTP/static/GraphQL checks and disposable cleanup passed.
- [CodeQL 39159426479](https://github.com/djblackett/invoice-web-app/actions/runs/39159426479): **SUCCESS**, including analysis/upload. The existing medium development CORS alert #12 remains open; a non-failing action annotation reports `User-specified matrix input is not an object`. Neither was suppressed.
- GitGuardian Security Checks: **SUCCESS**. No check was disabled or repository setting changed.

No CI compatibility repair was needed. This report and CSV are added in a
documentation-only follow-up commit; the dependency files are unchanged. The
recorded run IDs above identify the reviewed dependency commit. Latest head
verification is available on [PR #106 checks](https://github.com/djblackett/invoice-web-app/pull/106/checks)
and must be checked independently of these recorded runs.

Before push, inspected both current workflows completely. They run quality gates
and CodeQL only. Maintenance-branch pushes do not match the push filters;
`pull_request` triggers both workflows. No deployment/publishing job,
`pull_request_target` workflow or production secret is present. No workflow or
repository-wide security setting was changed.

## 14. Replacement PR Details

[Draft PR #106 — Update Invoice App dependencies and address security advisories](https://github.com/djblackett/invoice-web-app/pull/106)
targets `main` from `maintenance/dependency-security-2026-10`. Dependency changes
were committed as `d51ea8f2e0f4d656933f454da7487c0d245b985e` and pushed normally.
This report and the 222-row CSV are a separate documentation commit. The PR stays
in draft; no merge or deployment occurred.

Keep #104 open until this replacement is merged or the owner explicitly approves
supersession. The replacement covers its five families, but a draft is not a merge
or authorization to close #104. Do not merge or deploy this maintenance PR.

## 15. Remaining Risks and Follow-ups

1. Review the documented residual development CORS issue from #103 / CodeQL #12.
2. Plan supported Apollo Server / GraphQL Tools and Vitest worker-chain migrations,
   with the same authorization, PostgreSQL, browser and container gates.
3. Track unpatched braces and the mock-data/Faker migration; do not treat developer
   dependencies or their presence in the backend image as risk-free.
4. Revisit old test/codegen/formatting tool deprecations and backend production
   dependency pruning separately; no unrelated modernization was bundled here.
5. Reassess the narrow PostCSS/minimatch/lodash resolutions when upstream parents
   accept patched versions. Retain the Vite 6 constraint until a deliberate major
   migration. Future locked installs should continue to run full advisory audits.
6. The experimental PDF/filter features in #98/#99 require a separate product and
   authorization review if revived; their historical architecture remains unmerged.

No source/test/schema/workflow behavior changes, merge or deployment occurred.
