# Slice 6B-2A — GitHub-hosted CI verification

Date: **2026-10-18 (America/Halifax)**.

**The stabilization branch is published and all four quality jobs passed on both
push and PR runs. Draft PR #105 is open; the explicitly approved legacy workflow
ran with both jobs skipped. The full check set remains incomplete: CodeQL is
disabled for inactivity and GitGuardian failed on the disposable CI password
fixture, requiring owner review.**
No application/CI repair was needed. No deployment or merge occurred.

## 1. Starting state

| Item | Verified value |
| --- | --- |
| Branch | portfolio-stabilization |
| Starting and final pushed HEAD | `9de8a879a8cc77249ce747d3c155c734aaa7c696` |
| Initial working tree | Clean, tracked and untracked |
| Origin fetch/push URL | https://github.com/djblackett/invoice-web-app.git |
| Repository | djblackett/invoice-web-app; public, not archived/disabled |
| Remote default branch | main, `32a820c0132456726284b9c2b5571540d6884bbe` |
| Initial remote stabilization branch / PR | Neither existed |
| Local commits beyond main | 16, including the revision-history baseline and stabilization slices |
| Divergence | No remote stabilization branch to diverge from; push created it normally |
| Authenticated GitHub actor | djblackett, User; push permission present |

Read the requested README, stabilization plan, Slice 5C/6A/preflight and staging
runbook in this conversation; re-inspected actual workflow files, package
scripts/Yarn lockfile headers, test launchers, Docker/Compose paths, remote metadata,
default-branch workflow triggers and hosted results. Current branch files control
push/ordinary PR checks; default-branch files also matter for pull_request_target.

No root package/lockfile; each package pins Yarn 4.6.0 with a committed Yarn lockfile
and node-modules linker. Both use Node >=24 <25; .nvmrc pins 24.15.0. The tree had
no uncommitted credentials, and tracked-file inspection found no actual dotenv,
private key or saved login file (the public .env.example files are intentional).
Scoped private-key/GitHub-token/JWT-pattern checks found no candidate in the
changed text files. This is not a claim to scan all historical Git objects or
unrelated ignored local files.

## 2. Push and draft PR

Executed the authorized ordinary non-forced push:

```bash
git push -u origin portfolio-stabilization
```

Result: created origin/portfolio-stabilization at the exact starting HEAD and set
upstream tracking. No main push, tag, release, history rewrite, branch merge or
force push occurred. The push triggered the hosted quality workflow described
below. CodeQL did not trigger because GitHub reports its workflow disabled.

**[Draft PR #105](https://github.com/djblackett/invoice-web-app/pull/105)** is open,
head portfolio-stabilization, base main, title
`Stabilize Invoice App for portfolio release`. An existing-PR query first returned
no match, including closed/open states. Its reviewed body was prepared at
`/tmp/invoice-slice6b2a/pr-body.md` and submitted with --body-file. Head SHA remains
9de8a879a8cc77249ce747d3c155c734aaa7c696; base SHA remains
32a820c0132456726284b9c2b5571540d6884bbe. GitHub's synthetic PR merge-check SHA is
8408d50b4088f3062cb50ea60518cc49935a1731; the PR is **not merged**.

The trigger conflict was found before PR creation:
the default-branch frontend deployment workflow has a pull_request_target trigger.
The task explicitly prohibits triggering deployment workflows. A clarification
was requested whether to allow this particular guarded, skipped legacy run or
leave PR creation blocked until the default-branch workflow is retired. The user
explicitly answered **“Allow draft PR with the guarded, skipped legacy run.”**
Actor/main/head SHA and existing PR state were rechecked, then exactly one draft
PR was created. No timeout or preselected option was treated as approval.

Actual authorized creation command (do not repeat to create a duplicate):

```bash
gh pr create --repo djblackett/invoice-web-app --draft --base main \
  --head portfolio-stabilization \
  --title 'Stabilize Invoice App for portfolio release' \
  --body-file /tmp/invoice-slice6b2a/pr-body.md
```

PR creation triggered quality run 39097956412 and legacy run 39097956391. No CodeQL
run appeared. Do not merge, mark ready or infer PR merge-check coverage from the
earlier push run.

## 3. Workflow safety review

The stabilization branch has exactly:

- [CI quality gates](../../.github/workflows/ci-code-quality-tests.yaml): push on
  main/dev/portfolio-stabilization/feature/**/release/**/hotfix/**, all PRs and manual
  dispatch; four Ubuntu 24.04 jobs. Contents read only. Checkout credentials are not
  persisted. No production secrets, registry pushes, deployment environments,
  cloud commands, external DB connections or artifact publishing to hosting.
- [CodeQL](../../.github/workflows/codeql.yml): push on main/dev/portfolio-stabilization,
  all PRs, weekly schedule and manual dispatch. Contents read; the analysis job
  adds only security-events write for scanning upload. No deployment steps.

Slice 6A removed backend-deployment.yaml and frontend-deploy.yaml **from this
branch**. They are still present and active on remote main because this branch has
not been merged. Default-branch inspection found:

| Workflow on main | Trigger/safety finding for this task |
| --- | --- |
| backend-deployment.yaml | Push restricted to main; ordinary pull_request on main. Deleted in stabilization's merge tree, so not part of its push checks. No pull_request_target trigger. |
| frontend-deploy.yaml | Push/ordinary PR on main and **pull_request_target on main**. On that target event, test job's condition permits only dependabot[bot]. For the authenticated human actor it skips; build needs test without always(), so deployment also skips. The user explicitly approved this guarded trigger; actual skipped jobs were verified afterward. |
| ci-code-quality-tests.yaml | Old main version targets dev/feature/release/hotfix pushes and PRs into dev; stabilization's replacement is the observed push run. |
| codeql.yml | API state disabled_inactivity; the branch replacement retains this workflow path/state. |

The legacy frontend workflow's guarded human path does not authorize its separate
Dependabot behavior. It contains secret references and a Pages deploy step; it is
not a safe general-purpose PR workflow. Do not enable/modify it, change main,
change repository permissions or trigger it under a different actor to work
around the restriction. The user granted only the guarded human-actor exception.
[Legacy run 39097956391](https://github.com/djblackett/invoice-web-app/actions/runs/39097956391)
completed **skipped**: test job 117588226236 and build job 117588227141 both skipped
with empty step lists. No legacy build/deployment step ran.

Source at the inspected immutable main commit:
[legacy frontend workflow](https://github.com/djblackett/invoice-web-app/blob/32a820c0132456726284b9c2b5571540d6884bbe/.github/workflows/frontend-deploy.yaml).
GitHub documents that
[pull_request_target uses the base/default-branch context](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request_target)
and that [dependent jobs normally skip when a prerequisite skips](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idneeds).
Official documentation checked 2026-10-18. Guard review and this skipped run do
not establish that all future actors/PRs are safe.

## 4. Initial hosted results

[CI quality gates run 39097038643](https://github.com/djblackett/invoice-web-app/actions/runs/39097038643):
event **push**, branch portfolio-stabilization, attempt 1, exact head
`9de8a879a8cc77249ce747d3c155c734aaa7c696`, **completed / success**.
Started 2026-10-18T04:25:29Z. No retry or repair commit was needed.

| Hosted job / job ID | Conclusion | Actual evidence |
| --- | --- | --- |
| [Frontend types, lint, tests and build /117585528911](https://github.com/djblackett/invoice-web-app/actions/runs/39097038643/job/117585528911) | SUCCESS | Immutable Yarn install; app/Node TypeScript, ESLint, Vitest 115 passed/2 existing skips across 22 files, production build and E2E TypeScript pass |
| [Backend types, lint, unit, integration and build /117585529060](https://github.com/djblackett/invoice-web-app/actions/runs/39097038643/job/117585529060) | SUCCESS | Immutable Yarn install; Prisma 6.2.1 generation; typecheck/zero-warning lint; 116 units across 12 files; compiled build; committed migrations then 158 integrations across 6 files |
| [Real backend Chromium desktop, mobile and Demo-disabled /117585529054](https://github.com/djblackett/invoice-web-app/actions/runs/39097038643/job/117585529054) | SUCCESS | PostgreSQL 16/browser prerequisites; matching Chromium installed; real compiled backend and built UI with disposable DB; 17 passed, 0 skipped/unexpected/flaky; JSON duration94.721s |
| [Production images and fresh Compose startup /117585529019](https://github.com/djblackett/invoice-web-app/actions/runs/39097038643/job/117585529019) | SUCCESS | Both Docker builds; Compose config; DB/backend/frontend healthy; HTTP health/static/GraphQL checks pass; all invoice-ci containers, network and volume removed |
| CodeQL | **COULD NOT EXECUTE** | No CodeQL run/check exists for this SHA; workflow 133216285 reports disabled_inactivity |

All completed jobs ran on GitHub Actions-hosted Ubuntu 24.04, runner image
version 20261012.334.1. This is actual hosted execution, not actionlint/local inference.
No hosted Firefox smoke: the workflow installs Chromium only. Local Firefox
evidence remains inherited from Slice 6A.

## 5. Failures and external blockers

No quality job, assertion, dependency install, runtime setup, Prisma migration,
PostgreSQL service, browser installation/orchestration, Docker build/startup or
cleanup step failed. No flaky case or test retry was observed. The following are
external/configuration restrictions, not disguised passing checks:

| Finding | Root cause and evidence | Corrective action |
| --- | --- | --- |
| CodeQL absent | GET actions/workflows identifies ID 133216285, path .github/workflows/codeql.yml, name CodeQL Advanced, state disabled_inactivity; initial exact-SHA checks contained only four quality jobs, and final PR/run inspection still finds no CodeQL check | Repository owner re-enables this workflow, then an ordinary authorized branch push/PR event can establish scanning. Agent did not change settings, rename the workflow to evade the disabled state, disable scanning in YAML or dispatch a run. |
| Legacy PR trigger conflict — resolved for this PR | Remote main still has the legacy pull_request_target deployment workflow, despite deletion on the branch | User explicitly allowed the guarded skipped run. PR #105 created; both legacy jobs actually skipped. No main push/merge or repository-setting workaround. |

Minimum CodeQL owner action, **not executed by this agent**:

```bash
gh workflow enable 133216285 --repo djblackett/invoice-web-app
```

Alternatively use the workflow's Enable control in the repository Actions UI.
[GitHub's enable/disable guidance](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows)
documents the owner action. Re-enable alone is not a successful scan; observe a
completed supported run on the actual reviewed tip afterward. Do not claim that
the default-branch inactivity state has been repaired without reading it again.

A separate **GitGuardian Security Checks** check (ID 117588196317) failed after
PR creation. GitHub output title: “1 secret uncovered!”; summary reports a scan of
16 commits. Its detailed output identifies a Generic Password at
[workflow line 64 in e5f90c3](https://github.com/djblackett/invoice-web-app/blob/e5f90c30ec28e05cf90c5b371e5414efe0e92ac4/.github/workflows/ci-code-quality-tests.yaml#L64),
GitGuardian finding 38344367. Local source inspection verified this is exactly the
public **ci-only** password for the disposable GitHub PostgreSQL service, unchanged
in HEAD. It is a test fixture, not a production/staging credential. No reusable
credential leak is established by this finding. The external check nevertheless
remains **failed**, requiring owner review/disposition at
[GitGuardian](https://dashboard.gitguardian.com); it was not ignored, suppressed
or relabeled as passing. No provider settings, scanner exclusions, workflow
password workaround or published history rewrite was performed. Provider details
were inspected through GitHub's check output without printing suspected values.

The push response also reported **170 default-branch Dependabot vulnerabilities**
(12 critical/80 high/70 moderate/8 low). These are main's dependency alerts, not a CodeQL
result or a vulnerability count established for stabilization. No dependency
upgrade/alert-dismissal/security-setting change was attempted. Triage applicable
runtime dependency alerts before real-account production promotion; no broad
dependency maintenance is implied by successful functional CI.

## 6. Repairs and local verification

**CI repairs: none. New repair commits: none.** No workflow, source, test,
assertion, lockfile, timeout, backend mock, service setup or application behavior
was changed. Nothing was skipped/removed to obtain green quality jobs.

Actual local validation in this slice:

- Repository/remote/default-branch/PR/workflow metadata and Git ancestry inspection.
- Current workflow syntax via actionlint 1.7.12 `-shellcheck=''`: exit 0. ShellCheck
  execution is not claimed.
- Tracked-file and scoped sensitive-pattern inspection: no candidate found.
- Read-only hosted logs/artifact review described below and final exact-SHA checks.
- Local audit Markdown links and git diff whitespace check before completion.

The existing expensive local test/build/container suites were not rerun: no shared
script or application change required it, and hosted jobs exercised the exact
unchanged baseline. Slice 6A's local results remain inherited evidence, separately
distinguished from the new hosted results above.

## 7. Final hosted coverage

The final pushed commit is still **9de8a879a8cc77249ce747d3c155c734aaa7c696**;
there were no repair commits or additional pushes. Both the push run and
[PR quality run 39097956412](https://github.com/djblackett/invoice-web-app/actions/runs/39097956412)
completed **success** for that head. No older-commit success is substituted.
The audit is a **local untracked Markdown file**, not a new pushed revision.

PR #105 is open and draft, base main; its actual check rollup was inspected.
PR run metadata reports the head SHA above. Checkout logs confirm synthetic merge
SHA **8408d50b4088f3062cb50ea60518cc49935a1731**. GitHub's Git commit API confirms
parents 32a820c0132456726284b9c2b5571540d6884bbe and
9de8a879a8cc77249ce747d3c155c734aaa7c696. Its tree
**9c26db4599eb94173d9fe3ffd98cf4ce719a190f** exactly matches local HEAD's tree.
This establishes what the PR jobs executed without claiming an actual branch merge.

| Final check on 9de8a879 | PR conclusion | PR job / run URL |
| --- | --- | --- |
| Frontend | completed / success; 115 passed, 2 existing skips | [117588198256](https://github.com/djblackett/invoice-web-app/actions/runs/39097956412/job/117588198256) |
| Backend | completed / success; 116 unit/158 integration | [117588198301](https://github.com/djblackett/invoice-web-app/actions/runs/39097956412/job/117588198301) |
| Chromium E2E | completed / success; 17 pass, 0 skipped/unexpected/flaky | [117588198294](https://github.com/djblackett/invoice-web-app/actions/runs/39097956412/job/117588198294) |
| Containers | completed / success; builds/startup/smoke/cleanup pass | [117588198230](https://github.com/djblackett/invoice-web-app/actions/runs/39097956412/job/117588198230) |
| CodeQL | Could not execute; disabled_inactivity | None; not passed, failed, pending or legitimately trigger-skipped |
| GitGuardian Security Checks | completed / failure; Generic Password fixture finding | [Provider review](https://dashboard.gitguardian.com), check 117588196317 |
| Legacy Pages workflow | completed / skipped; test/build jobs both skipped, no executed steps | [39097956391](https://github.com/djblackett/invoice-web-app/actions/runs/39097956391) |

The PR description was updated with both successful quality-run links and the
unresolved CodeQL/GitGuardian states. No check was hidden, bypassed or relabeled.
**The overall slice gate remains incomplete** despite successful Actions quality
runs: CodeQL lacks hosted evidence and the external GitGuardian check remains
failed. PR creation/check-display verification is now complete. No deployment
readiness, production approval or permission to merge is implied.

## 8. Local versus hosted comparison

The hosted result matches Slice 6A's counts: backend 116 units / 158 integrations,
frontend 115 pass/2 existing skips and 17 Chromium cases. The Ubuntu runner used
Node 24.15.0 and npm 11.12.1; local Slice 6A used npm 12.2.0. setup-node printed a
global Yarn 1.22.22, but the actual install logs show Corepack selecting pinned
**Yarn 4.6.0**. No npm/Yarn installation correction was necessary.

Hosted dependencies/browser/apt setup worked on a fresh standard runner without
developer TLS keys, production API keys, live Auth0 login, existing external DB
or preinstalled custom browser executable overrides. Backend uses the PG16 service
invoice_ci database; browser creates a separate native loopback cluster with
generated ports and seeded synthetic fixtures. Containers use their own fresh
project-scoped PG16 volume. These are CI disposable data stores, not staging.

Known peer/test-mock warnings and Vite chunk-size warnings remain nonblocking;
the two frontend skips already existed. Live Auth0, public HTTPS/WSS, real mobile
network/proxy behavior, historical existing-data migrations and restore rehearsal
remain outside hosted quality coverage.

## 9. Logs, permissions and artifacts

Downloaded all four completed job logs to protected temporary files under
`/tmp/invoice-slice6b2a/`, and inspected verification output plus sensitive-pattern
candidates. No private key, GitHub token or JWT literal was found. The workflow
prints disposable CI/local DB passwords in setup/config snippets; these are
public isolated-run placeholders, not production/staging credentials.
Synthetic test identities/invoice fixture diagnostics are present; no real
customer/production data or real Auth0 session was used. Negative auth tests can
produce expected error logs; passing tests remain the outcome, not suppressed errors.

Hosted artifact:

| Field | Observed value |
| --- | --- |
| Name / ID | isolated-browser-results /12125157215 |
| Run |39097038643 |
| Archive size |237043 bytes |
| Created / expires |2026-10-18T04:28:21Z /2026-10-25T04:28:20Z; not expired when inspected |
| Contents |11 files, HTML/JSON/log only in this successful run |
| Playwright JSON |expected 17, skipped 0, unexpected 0, flaky 0, duration 94721.192ms |
| Forbidden file checks |No pgdata/pgsocket/auth directory, dotenv, saved state.json, PEM/key, SQL/dump file |
| Credential-pattern checks |No private key, GitHub token or JWT literal found |

The PR run's independent artifact 12125173835 was also downloaded and inspected:
378213 bytes, expires 2026-10-25T04:44:26Z, 11 HTML/JSON/log files. Its Playwright JSON
records 17 expected, 0 skipped/unexpected/flaky, duration 101820.509ms. All four PR
job logs were reviewed: frontend 115/2 skips, backend 116/158, Chromium 17 and Compose
network/volume cleanup. The same file-scope and private-key/GitHub-token/JWT-pattern
checks found no candidate in the PR archive or logs. This repeats the artifact
review on the actual PR run rather than assuming the push archive represents it.

Failure traces/screenshots are configured for future failed browser cases; no
failure artifacts existed here. No node_modules, full DB cluster, production env,
auth account storage, Docker image or dist release archive was uploaded. The only
quality artifact is a seven-day browser result archive. Source/log review is
scoped evidence, not a universal secret-detection guarantee for future changes.

Current branch workflows use no secrets or privileged PR target event; ordinary
PR code has read-only repository permissions, while CodeQL's isolated scan job
requests security-events write for upload. The legacy main pull_request_target
configuration was exercised only under the explicit user exception; both jobs
skipped with no steps executed.
No registry, Pages, Fly, cloud resource, external DB or release publication step
ran. Container cleanup logs confirm deletion of only CI-owned disposable resources;
browser cleanup code executes in finally and no DB data appears in its artifact.

## 10. Remaining blockers and Slice 6B-2B readiness

| Category | Remaining requirement |
| --- | --- |
| Hosted CI blocker | Owner re-enables CodeQL, supported exact-tip scan completes; no passing scan currently exists |
| External security check | GitGuardian failed on the disposable CI password fixture; owner review/disposition required, not silently counted as success |
| Staging blockers | Approve hosting/budget, independent DB/volume/credentials, app/API domains, Auth0 tenant/SPA/API/claims, public Demo choice, encrypted off-host backup/restore and rollout operator; then execute controlled staging validation under separate authorization |
| Production blockers | Explicit production approval, full staging acceptance/restore evidence, existing-data migration rehearsal if applicable, role source/revocation policy and applicable dependency-alert triage |
| Nonblocking follow-ups | Existing frontend skips/peer/bundle warnings; health-vs-readiness limits; shared Demo state/ID collisions; operational monitoring and image/dependency hygiene described in preflight |

**Slice 6B-2B decision/configuration planning can continue. Provisioning/deployment
is not approved by this slice, and the full hosted-CI milestone is not closed.**
Resolve CodeQL and the external security check, then obtain explicit staging
provisioning approval and follow the [staging runbook](../deployment/staging-runbook.md).
The successful push and PR quality runs reduce runner/tooling uncertainty without proving
any external application runtime ready.

## 11. Final repository status and reproduction

| Item | Final state |
| --- | --- |
| Branch / HEAD | portfolio-stabilization /9de8a879a8cc77249ce747d3c155c734aaa7c696 |
| Remote branch | origin/portfolio-stabilization at same SHA; tracked history in sync |
| Working tree | No tracked modifications; this new local audit file is untracked, so working tree is **dirty** |
| PR | #105, open draft, portfolio-stabilization into main; not merged |
| Changed production/config/test files | None |
| Merge / deployment / production mutation | None |

Read-only evidence retrieval:

```bash
git status --short
git rev-parse HEAD
git ls-remote origin refs/heads/portfolio-stabilization
gh api repos/djblackett/invoice-web-app/actions/runs/39097038643
gh api repos/djblackett/invoice-web-app/actions/runs/39097038643/jobs
gh api repos/djblackett/invoice-web-app/actions/runs/39097956412
gh api repos/djblackett/invoice-web-app/actions/runs/39097956412/jobs
gh pr view 105 --repo djblackett/invoice-web-app --json state,isDraft,headRefOid,statusCheckRollup
gh api repos/djblackett/invoice-web-app/actions/workflows
gh api 'repos/djblackett/invoice-web-app/commits/9de8a879a8cc77249ce747d3c155c734aaa7c696/check-runs?per_page=100'
gh pr list --repo djblackett/invoice-web-app --head portfolio-stabilization --state all
git diff --check
```

No source or workflow changes required a repair commit. The audit is retained
locally so the exact final pushed commit remains the fully observed baseline;
publishing it later must use an ordinary reviewed commit/push and observe that
new tip's checks. No expensive local suite was repeated for this documentation.
