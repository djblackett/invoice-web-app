# Public demo deployment

Prepared 2026-10-19. Target: GitHub Pages → existing Fly `invoice-backend` →
existing Neon `invoice-app` / `production`. No hosted deployment, secret update,
database mutation or Fly Machine lifecycle operation was performed in this review.

## Audit and changes

Neon commit `7d8ca38` was already committed on the starting branch; the working tree
was clean. It added `neon.ts`, root npm manifest/lockfile, root `.env.example`,
`scripts/app.mjs`, `scripts/verify-neon.mjs`, README guidance and a `.neon` ignore rule.
It did not change application code, Prisma schema/migrations, Docker, Compose or CI.
The dedicated release branch preserves that commit. The previous CORS change is
already included in `main` via PR #107.

| Area | Result / preparation |
| --- | --- |
| Neon policy | Existing `neon.ts` retained: Auth disabled; new non-default branches expire in seven days. No Neon Functions or replacement hosting. |
| Prisma | Existing singleton Prisma 6.2.1 TCP client and both migrations retained. Root local URLs verified: runtime pooled, migration direct, both requiring TLS. |
| Migrations | New backend `scripts/migrate.cjs` selects `DATABASE_URL_UNPOOLED` only for the Prisma subprocess; container entrypoint and package `migrate:deploy` reuse it. It rejects pooled Neon migration targets, Neon URLs without required TLS and mismatched app/migration database endpoints. Plain local PostgreSQL still needs only `DATABASE_URL`. |
| Build/start | Existing backend TypeScript/alias build, non-root Node 24 Debian image and `node dist/src/index.js` retained. Root scripts are optional local build/preview helpers; Vite preview is not the public frontend server. |
| Environment | Explicit shell variables win, then root `.env.local`, root `.env`, package dotenv. Root helpers alone load root files; containers receive runtime secrets. `.env.local`, `.neon` and package env files are ignored. Package Docker contexts exclude env files and keys; neither image needs live credentials to build. |
| Secrets | Tracked files and production frontend JS checked against local Neon URL/host/password values. No matches. Vite exposes only public `VITE_*`; Pages receives no database or Fly secrets. |
| CI/local | Existing package quality gates and disposable PostgreSQL/browser runners retained. Neither needs Neon credentials or root npm dependencies. Compose continues to use its local PostgreSQL service. |
| Live verification | Replaced the original mutating browser `test:neon` with enforced read-only transactions through pooled and direct connections, migration checksum checks and existing demo counts. CRUD/revision tests run only on disposable databases. |
| Fly | Backend manifest explicitly enables Demo, exact Pages CORS, HTTP `/health`, HTTPS ingress and connection concurrency. Existing autostop/start, zero minimum and 1 GB shared CPU size retained. No mounts or release Machine added. |
| Pages | Manual `deploy-pages.yaml`, restricted to `main`, builds the existing frontend with Demo enabled, no Auth0 config and `https://invoice-backend.fly.dev`. Existing Vite base `/invoice-web-app/` retained. Copies the SPA shell to `404.html` for BrowserRouter refresh/deep links (Pages returns HTTP 404 for those shell responses). |

Container startup still applies committed migrations before listening and never
seeds/resets data. The direct URL is scoped to that migration child process; the
API process retains its pooled `DATABASE_URL`. The existing Neon database already
has both migrations; deployment should report no pending migrations. A failed
migration blocks startup. Do not run seed, reset, schema push or provisioning as
part of this release.

The root `fly.toml` is an unsupported historical experiment with a different app,
missing root Dockerfile and obsolete database mount. Use only `invoice-backend/fly.toml`
with the `invoice-backend/` build context. Compose files remain local workflows.

## Hosted state observed (read-only)

- Fly `invoice-backend.fly.dev`: two stopped app Machines in `ord`, shared CPU,
  1 GB each. No backend volumes were present in their Machine configs. No request
  was sent to this public API, because even a health request could autostart it.
- Fly secret names include `DATABASE_URL`, but no `DATABASE_URL_UNPOOLED`. Secret
  values were not retrieved. Legacy `DATABASE_URL_DEMO` and `SECRET` are unused by
  the current app. Existing Auth0 settings can remain for now; Demo needs neither.
- `invoice-backend-db`: one started Machine, one attached 1 GB `pg_data` volume.
  Both are untouched and must remain so unless separately authorized.
- GitHub Pages: legacy publishing from `gh-pages`, URL already configured correctly.
  An operator must switch the publishing source to GitHub Actions before dispatching
  the new workflow. Settings were not changed here.
- Neon: both connections passed read-only checks; both committed migration checksums
  match; `demoId` has USER role, seven invoices and eleven revisions. No new project,
  branch, migration application or seed was performed.

## Operator checklist

Everything below that changes hosted state requires separate approval. Review/merge
of this draft PR is also separate. Run from the approved revision, with Node 24.15.0
and the package-pinned Yarn available. Never paste credentials into a PR or terminal
command argument, enable shell tracing, or supply them as Docker build arguments.

1. **Read-only preflight.** Confirm the intended existing resources and retain the
   current backend release/image for rollback. The latter must use the current
   schema and the new Neon secrets; do not switch back to the old DB by accident.

   ```bash
   fly status -a invoice-backend
   fly machine list -a invoice-backend
   fly secrets list -a invoice-backend
   fly volumes list -a invoice-backend-db
   gh api repos/djblackett/invoice-web-app/pages
   npm run test:neon
   ```

   `test:neon` reads the existing ignored root credentials; it queries PostgreSQL
   in read-only transactions. It may wake Neon compute and consume a small amount
   of its allowance, but writes no records. Fly control-plane inspection does not
   wake stopped Machines. Avoid public API probes until activation is approved.

2. **Stage Fly secrets — hosted change.** Set only `DATABASE_URL` (pooled) and
   `DATABASE_URL_UNPOOLED` (direct) from the same existing Neon production endpoint,
   role and database. Require `sslmode=require` or stronger on both. Consider
   `connect_timeout=15` for Neon resume and `connection_limit=5` on the pooled URL
   for a small single-Machine demo. Keep any existing TLS/channel-binding options.
   Example using the already populated root `.env.local`, piping values without
   displaying them or placing them in process arguments:

   ```bash
   node --input-type=module <<'JS' | fly secrets import --stage -a invoice-backend
   import { loadEnvFile } from 'node:process';
   loadEnvFile('.env.local');
   const names = ['DATABASE_URL', 'DATABASE_URL_UNPOOLED'];
   if (names.some(name => !process.env[name])) throw new Error('Missing database secret');
   for (const name of names) console.log(`${name}=${process.env[name]}`);
   JS
   ```

   `--stage` changes stored secrets without deliberately restarting the app. Do not
   attach/detach databases or unset legacy secrets in this release. `DEMO_MODE=true`,
   production mode, port and CORS are explicit non-secret settings in the manifest.
   Inspect secret names for conflicting `DEMO_MODE`, `NODE_ENV` or `CORS_ORIGIN` overrides
   before deploying; none were present at audit time.

3. **Reuse and deploy the backend — hosted lifecycle change.** Approval should include
   reducing the two existing app Machines to one. This affects only the stateless
   backend app, never `invoice-backend-db`. `--ha=false` prevents new spare Machines;
   it does not remove existing ones. Check the scale plan before confirming it.

   ```bash
   fly scale count 1 -a invoice-backend --process-group app --region ord
   (cd invoice-backend && fly deploy --app invoice-backend --config fly.toml --ha=false --strategy immediate)
   fly status -a invoice-backend
   fly checks list -a invoice-backend
   ```

   Immediate deployment accepts brief downtime and avoids a second app Machine for
   a rolling replacement. Do not run `fly launch`, create another app/database,
   mount the old database volume, or add a separate migration/release Machine.

4. **Verify the activated backend — requests may autostart it.** Check migration and
   Prisma connection success in Fly logs without copying secrets into reports.
   Verify HTTPS health, demo USER and the expected invoice count:

   ```bash
   curl --fail https://invoice-backend.fly.dev/health
   curl --fail https://invoice-backend.fly.dev/ \
     -H 'Origin: https://djblackett.github.io' \
     -H 'Authorization: Bearer demo-token' -H 'Content-Type: application/json' \
     --data '{"query":"{ getUserById(id: \"demoId\") { id username } allInvoices { id } }"}'
   curl -i -X OPTIONS https://invoice-backend.fly.dev/ \
     -H 'Origin: https://djblackett.github.io' \
     -H 'Access-Control-Request-Method: POST' \
     -H 'Access-Control-Request-Headers: authorization,content-type'
   ```

   Expect no GraphQL errors, identity `demoId` (USER role is verified by the
   read-only Neon smoke check), and an exact
   `Access-Control-Allow-Origin: https://djblackett.github.io`. Counts can vary once
   visitors use the shared demo. The GraphQL URL is the backend **root**, not
   `/graphql`. `/health` reports process readiness after initial DB connection;
   the authenticated query verifies an actual database operation. `/test-setup`
   must return 403. No Auth0 sign-in is needed.

5. **Publish Pages — hosted settings/deployment change.** After review and separately
   approved merge to `main`, choose repository Settings → Pages → Source → GitHub
   Actions. Dispatch the manual workflow; do not supply secrets as Vite variables.

   ```bash
   gh workflow run deploy-pages.yaml --ref main
   gh run list --workflow deploy-pages.yaml --limit 1
   ```

   Publishing is deliberately independent of pushes/merges. The workflow bakes in
   `VITE_BACKEND_URL=https://invoice-backend.fly.dev`, `VITE_DEMO_MODE=true`, and empty
   Auth0 values. Deployment uses the existing `github-pages` environment. Its branch
   protection may require allowing `main` (legacy deployments used `gh-pages`).

6. **Public browser acceptance — writes shared demo data.** Open
   `https://djblackett.github.io/invoice-web-app/` on desktop/mobile. Approve demo
   resets before entering: entering Demo and Reset Demo deliberately restore seven
   shared invoices and eleven revisions. Confirm list/detail, create, edit, paid,
   revision/restore, delete, reload of a detail URL, theme and mobile layout.
   In DevTools confirm HTTP requests go to `https://invoice-backend.fly.dev/` and
   WebSockets to `wss://invoice-backend.fly.dev/`, without mixed content/CORS errors.
   Use disposable example data only. Public writes are separate from this preparation.

7. **Costs — read-only checks.** After closing browser tabs and waiting several
   minutes, inspect `fly machine list -a invoice-backend` for one stopped app
   Machine; do not repeatedly hit health endpoints while checking idle behavior.
   Inspect Fly billing for app compute, stopped root filesystem, network/IP and
   builder charges. The retained old PostgreSQL Machine and volume continue to
   incur costs independently. Check Neon console plan/usage for the existing
   project: Free, compute/storage/transfer within allowances, idle suspension and
   no unwanted branch/compute resources. Do not upgrade or delete resources here.

## Demo, cold-start and WebSocket limits

- Every visitor shares `demoId` / USER. Entry/reset replaces that workspace for
  everyone. This is an intentionally mutable public demo, unsuitable for real data.
- Fly autostarts a stopped Machine on traffic. Its startup also checks migrations
  and opens Prisma; Neon may need to resume. First load can be slow or need Retry
  Demo after a transient timeout. No always-on uptime promise is made. Continuous
  external health polling defeats idle savings.
- HTTP GraphQL and `graphql-transport-ws` share port 8000 and path `/`; Fly terminates
  HTTPS/WSS, forwarding plain HTTP internally. CORS applies to HTTP, not WebSocket
  authentication. WS authentication still uses GraphQL connection parameters.
- The `invoiceAdded` subscription remains ADMIN-only. The frontend skips it in
  Demo Mode, avoiding an unnecessary WebSocket connection and FORBIDDEN error for
  the demo USER. Demo invoice queries and mutations continue through HTTP.
  Cross-visitor live synchronization is not guaranteed; refresh shows current data.
- PubSub is in-process; restarts lose events and multiple Machines do not share
  subscriptions. Use one Machine for this release. Active sockets may keep it awake;
  deploys/autostops/network interruptions can close sockets and require reconnect.
- Existing production HTTP limit is 100 requests/IP per 15 minutes; 429 responses
  may occur during repeated operator testing or shared-network use.
- Pages deep-link fallback renders the SPA from `404.html`, with HTTP status 404.
  Navigation from the normal entry URL uses the client router.

## Validation

Local verification results are recorded in the PR. Gates cover backend types/lint,
180 unit tests, 158 disposable PostgreSQL integration tests; frontend types/lint,
115 passing tests (two existing skips), production build and E2E types; 17 real-backend
Chromium desktop/mobile/Demo-disabled cases; production Docker build/startup and
HTTP/WS checks; Pages asset/API and secret scans; and read-only Neon verification.
Live public TLS/proxy behavior, autostop after real browser use, Pages publication
and final account billing remain post-approval operator checks.

References: [Neon Prisma 6](https://neon.com/docs/guides/prisma#using-prisma-6-or-earlier),
[Fly configuration](https://fly.io/docs/reference/configuration/),
[Fly autostop/start](https://fly.io/docs/launch/autostop-autostart/),
[Fly deploy flags](https://fly.io/docs/flyctl/deploy/),
[GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
Pricing changes; verify the account's actual plan and current
[Fly pricing](https://fly.io/docs/about/pricing/) and [Neon pricing](https://neon.com/pricing).
At review time Neon advertises 100 CU-hours/month/project and 1 GB storage on Free;
Fly bills stopped root filesystems and provisioned volumes as well as running compute.
