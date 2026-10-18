# Invoice App — staging runbook for Slice 6B-2

Prepared **2026-10-18 (America/Halifax)** against
`e5f90c30ec28e05cf90c5b371e5414efe0e92ac4` on `portfolio-stabilization`.
Read the [preflight report](../audit/slice-6b1-deployment-preflight.md) first.
**Nothing in this runbook has been deployed.** Slice 6B-1 only writes documentation.
All provisioning, push/PR, Auth0, DNS/TLS, backup and deployment commands below are
future actions requiring the approvals described here.

## 1. Prerequisites, approvals and target record

Obtain explicit approval for the selected platform/budget, staging DB, app/API
hostnames, Auth0 tenant/SPA/API and test identities, public Demo exposure,
backup destination/retention, deployment method and push/PR. Production is a
separate approval. Recommended topology is an isolated 2 GiB/1 vCPU Linux VPS
(DigitalOcean Basic is the priced example), host nginx TLS, compiled Docker
backend/frontend and private PostgreSQL 16. One backend replica, brief maintenance
deployments. Budget evidence and managed Render alternative are in report section 4.
If the platform changes, review its ingress/proxy/PG/release semantics and adapt
this runbook before using commands; do not use the historical root fly.toml.

Fill a protected operator record before any external mutation:

| Field | Required value |
| --- | --- |
| Approval references/operator/window | &lt;APPROVAL_RECORD&gt;, &lt;OPERATOR&gt;, &lt;UTC_WINDOW&gt; |
| Target account/project/host/region | &lt;STAGING_ACCOUNT&gt;, &lt;STAGING_PROJECT&gt;, &lt;STAGING_HOST&gt;, &lt;REGION&gt; |
| App / API hostnames | &lt;APP_HOST&gt; / &lt;API_HOST&gt;, distinct staging names |
| Auth0 | &lt;STAGING_AUTH0_HOST&gt;, &lt;STAGING_SPA_CLIENT_ID&gt;, &lt;STAGING_API_IDENTIFIER&gt;, test connection and Action review |
| Release | &lt;RELEASE_SHA&gt;, hosted push and PR run URLs/SHA, previous SHA/images or FIRST_DEPLOY |
| DB | invoice_staging, invoice_staging role, invoice-staging-pg16 volume, selected PG16 image digest |
| Recovery | &lt;BACKUP_DESTINATION&gt;, encryption key custodian, retention, approved RPO/RTO, restore rehearsal evidence |
| Production boundary | Confirm staging has no production data/credentials/callbacks and no production environment attachment |

Never fill real passwords/tokens into this tracked file. Resolve all angle-bracket
placeholders in **operator-owned copies**; fail rather than using invented values.
Paths `/opt/invoice-staging` and `/etc/invoice-staging` below are proposed host
locations. New names such as BACKEND_IMAGE, FRONTEND_IMAGE, POSTGRES_IMAGE and
POSTGRES_BOOTSTRAP_PASSWORD are **operator template variables**, not existing app
settings. `dc` is a shell helper defined below, not a repository command.

Required tools: Linux builder with Node 24.15.0/Corepack/Yarn 4.6.0 if running source
checks, Docker/Compose v2, Git/gh for authorized CI work; host Docker/Compose v2,
nginx and the operator's approved ACME client (examples use Certbot), SSH restricted
to operator addresses, PostgreSQL 16 client tools for local dump inspection/restore
rehearsal. Confirm x86_64/amd64 builder matches the chosen host; otherwise build
explicitly for the approved architecture and validate that image.

## 2. Prepare isolated infrastructure

1. Under approved account/project create **one staging-only** VPS. Confirm resource
   identifiers in console and operator record. Set a monthly cost alert. Patch the
   OS, enable Docker/nginx at boot and retain an SSH recovery path. No shared
   production host or production volume. If an existing host is proposed, inventory
   its services, listeners and volumes first; stop if ownership is unclear.
2. Restrict provider/host firewall to 80/443 and operator-only SSH. Docker published
   ports must explicitly bind loopback; do not rely solely on host firewall rules
   for Docker. No PostgreSQL/8000/5173 public listener. No Docker socket dashboard.
3. Create protected release/config/backup directories and independent secret
   storage. Run deployment commands as an approved operator with Docker access;
   Docker access is host-privileged. Keep the release env readable only by that
   operator; do not print `docker inspect` env or expanded Compose config.
4. Approve/create staging DNS A records for &lt;APP_HOST&gt; and &lt;API_HOST&gt; to this host;
   add AAAA only if IPv6 routing/firewall/listeners are actually configured and
   tested. Resolve both from an independent network before ACME.
5. Configure Auth0 per section 3. Build both images per section 5 only after exact
   public URLs/tenant/audience are known. Test account credentials stay outside
   source, shell history and test artifacts.
6. Create the new PostgreSQL volume/role per section 6. Verify off-host encryption
   and backup destination access; rehearse restore on disposable infrastructure
   before first real rollout. Infrastructure must not auto-deploy on Git push.

## 3. Auth0 staging setup (authorized operator only)

Prefer a separate non-production tenant. Create a dedicated **Single Page
Application**, auth method None, and a **custom API** with a distinct staging
identifier and RS256 signing. Do not reuse a production audience. A separate SPA
with the same issuer/audience does not isolate backend token acceptance.

| Setting | Exact intended value |
| --- | --- |
| Allowed Callback URLs | https://&lt;APP_HOST&gt;/invoice-web-app/ |
| Allowed Logout URLs | https://&lt;APP_HOST&gt;/invoice-web-app/ |
| Allowed Web Origins | https://&lt;APP_HOST&gt; |
| Allowed Origins (CORS) for Auth0 | https://&lt;APP_HOST&gt; |
| Frontend tenant domain | &lt;STAGING_AUTH0_HOST&gt;, hostname only |
| Backend issuer DOMAIN | https://&lt;STAGING_AUTH0_HOST&gt;/, **trailing slash required** |
| API identifier/audience | &lt;STAGING_API_IDENTIFIER&gt;, exactly equal in backend and frontend |
| SPA grants | Authorization Code with PKCE and Refresh Token; no client secret in browser |
| API Offline Access | Enabled for intended SPA refresh flow |
| Refresh rotation/expiry | Enable rotation; approve bounded lifetimes; proposed test access token 10m, refresh inactivity 1d/absolute 7d |
| Requested scope | openid profile email offline_access; optional legacy role scope only if tenant actually defines/requires it |

The app has HashRouter and the SDK handles `?code=...&state=...` at the static base
URL. There is **no `/callback` route**. Do not put `#/login` or `#/invoices` in
callback/logout URLs. A Login URI that only opens the app does not automatically
click its Login button; leave optional tenant login initiation settings unchanged
unless the operator has separately tested their behavior.

Prepare/review a tenant post-login Action that sets these exact **access-token**
claims from trusted tenant data, including renewed tokens:

```text
sub: nonempty Auth0 subject
invoice-web-app/email: nonempty trusted user email string
invoice-web-app/roles: assigned role array; exact "Admin" grants ADMIN
name: optional display string (backend defaults to "user")
```

The repository expects those literal legacy keys, not `email`, `roles`, a
permissions array or a new HTTPS namespace. Current Auth0 recommendations use
HTTP(S) namespaces; **verify the actual staging custom-API access token emits
these legacy keys** before declaring setup ready. If Auth0 rejects/omits them,
stop and request a separately reviewed compatibility fix; do not silently change
claims or authentication code. Do not use an Auth0 Management API audience or
M2M client-credentials flow as a substitute for this SPA test. No production
Action/tenant change is authorized by staging approval.

Use staging-only synthetic identities: USER A, USER B, ADMIN if approved, and
one fresh subject absent from PostgreSQL. Assign ADMIN through trusted Auth0 role
assignment **before first API request** so initial token and stored row agree.
Inspect only needed token claim fields locally; never paste/save tokens or enable
browser HAR/trace recording with credentials. Confirm a shared-tenant alternative,
if selected, has a separate API audience and client-scoped Actions/connections.

Official references and assessment dates appear in the preflight report.

## 4. Establish GitHub-hosted CI before installation

Only after explicit authorization to push and create the PR, from a clean local
checkout containing the reviewed docs/release configuration:

```bash
git branch --show-current
git status --short
git rev-parse HEAD
# Must show portfolio-stabilization and the approved clean release tip.
git push -u origin portfolio-stabilization
```

Create a PR to main using a prepared body file (reviewed branch changes, verification
and remaining staging gates). This operation is authorized only in Slice 6B-2:

```bash
gh pr create --repo djblackett/invoice-web-app --base main \
  --head portfolio-stabilization \
  --title 'Prepare stabilized Invoice App for staging' \
  --body-file /tmp/invoice-staging-pr-body.md
```

Push triggers CI quality gates and CodeQL on this branch; PR triggers both again.
Do not dispatch unrelated deployment workflows, merge or change branch protection
without separate authorization. Use the push run to establish exact branch-head
coverage; record PR head and generated merge SHA as well.

```bash
release_sha=$(git rev-parse HEAD)
gh run list --repo djblackett/invoice-web-app --branch portfolio-stabilization \
  --commit "$release_sha" --limit 30
# Substitute each observed run ID, never an invented one:
gh run view <RUN_ID> --repo djblackett/invoice-web-app
gh run view <RUN_ID> --repo djblackett/invoice-web-app --log-failed
```

Required passing checks:

| Check | Expected evidence |
| --- | --- |
| Frontend types, lint, tests and build | check + typecheck:e2e; baseline 115 tests/2 documented skips, dist built |
| Backend types, lint, unit, integration and build | Prisma generate; 116 units, 158 integrations, 0-warning lint, compiled dist; PG16 invoice_ci service with disposable ci-only credentials and migrations |
| Real backend Chromium desktop, mobile and Demo-disabled | apt postgresql 16, Playwright matching Chromium with dependencies, 17 cases serially, no retries/skips; fresh cluster/bundles; reports uploaded for 7 days |
| Production images and fresh Compose startup | Both image builds, healthy fresh DB/backend/frontend, HTTP/static/GraphQL typename checks and cleanup |
| JavaScript and TypeScript analysis | CodeQL init/analyze success and uploaded result; investigate actionable findings separately |

Jobs run independently; require **all**, not one green workflow badge. Build
directories/images exist only in job runner storage: workflows currently do not
publish release images or upload dist. Browser reports are the only downloadable
quality artifacts; CodeQL uses its security analysis upload. No Firefox hosted
result is expected from current configuration.

Classify failures before retrying: application/assertion/type/lint/build regression;
runner/action/Corepack/apt/browser infrastructure; cache/immutable lockfile;
DB readiness/migration/isolation; CodeQL entitlement/permissions/security finding;
timeout/artifact/cleanup. Save redacted failing-step logs and SHA. Fix the actual
cause on this branch, run relevant focused local checks and obtain a fresh hosted
run for the new SHA. Retry a proven transient runner fault deliberately; do not
weaken assertions, hide skips or use production secrets. Cancelled, skipped,
timed-out or unobserved required jobs are not passes. A clean result has all
required jobs successful for the exact reviewed SHA, expected test counts, browser
artifact present, cleanup completed and no unresolved release-significant finding.

## 5. Prepare images and protected configuration

After hosted CI is green, use a clean approved builder checkout at &lt;RELEASE_SHA&gt;.
Inspect status and SHA; do not build from an unreviewed dirty working tree. Create
an operator-only public build env file from the frontend matrix (no secrets) with
these values, loaded through a trusted shell mechanism or explicit exports:

```dotenv
VITE_BACKEND_URL=https://<API_HOST>
VITE_DEMO_MODE=false
VITE_DOMAIN=<STAGING_AUTH0_HOST>
VITE_CLIENT_ID=<STAGING_SPA_CLIENT_ID>
VITE_AUDIENCE=<STAGING_API_IDENTIFIER>
VITE_SCOPE="openid profile email offline_access"
VITE_REDIRECT_URI=https://<APP_HOST>/invoice-web-app/
```

All are **public build-time** values. Resolve placeholders first. Backend secrets
do not belong here. Build exactly the same source commit on the selected host
architecture; CI verifies code but does not supply release images.

```bash
release_sha=$(git rev-parse HEAD)
docker build --label "org.opencontainers.image.revision=$release_sha" \
  -t "invoice-backend:$release_sha" invoice-backend
docker build --label "org.opencontainers.image.revision=$release_sha" \
  --build-arg "VITE_BACKEND_URL=$VITE_BACKEND_URL" \
  --build-arg "VITE_DEMO_MODE=$VITE_DEMO_MODE" \
  --build-arg "VITE_DOMAIN=$VITE_DOMAIN" \
  --build-arg "VITE_CLIENT_ID=$VITE_CLIENT_ID" \
  --build-arg "VITE_AUDIENCE=$VITE_AUDIENCE" \
  --build-arg "VITE_SCOPE=$VITE_SCOPE" \
  --build-arg "VITE_REDIRECT_URI=$VITE_REDIRECT_URI" \
  -t "invoice-frontend:$release_sha" invoice-frontend
docker image inspect "invoice-backend:$release_sha" "invoice-frontend:$release_sha" \
  --format '{{.Id}} {{index .Config.Labels "org.opencontainers.image.revision"}}'
docker save -o "invoice-staging-$release_sha.tar" \
  "invoice-backend:$release_sha" "invoice-frontend:$release_sha"
sha256sum "invoice-staging-$release_sha.tar" > "invoice-staging-$release_sha.tar.sha256"
```

Transfer image archive/checksum through approved SSH to the staging host. Verify
checksum there, `docker load -i <ARCHIVE_PATH>`, and record exact image IDs and
labels; SHA tags alone are mutable. Retain previous archive, matching protected
env/ingress and public build record. Do not use `latest` for release selection.
PG/nginx images should be recorded by digest; nginx is inside the frontend image.
No database connection or migration occurs during image build/load.

Copy this proposed **standalone** template to the operator's
`/opt/invoice-staging/compose.staging.yml` after review. It intentionally does
**not** extend root docker-compose.yml, whose DB URL/password are hardcoded local
values. Docker image healthchecks remain active.

```yaml
# Proposed staging template, not existing repository configuration.
services:
  frontend:
    image: ${FRONTEND_IMAGE:?approved frontend image required}
    pull_policy: never
    restart: unless-stopped
    ports: ["127.0.0.1:5173:80"]
    depends_on:
      backend:
        condition: service_healthy
    logging: &logging
      driver: json-file
      options: {max-size: "10m", max-file: "3"}
  backend:
    image: ${BACKEND_IMAGE:?approved backend image required}
    pull_policy: never
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: "8000"
      CERT_DIR: ""
      DATABASE_URL: ${DATABASE_URL:?staging database required}
      CORS_ORIGIN: ${CORS_ORIGIN:?exact frontend origin required}
      DEMO_MODE: ${DEMO_MODE:-false}
      DOMAIN: ${DOMAIN:?staging issuer required}
      AUDIENCE: ${AUDIENCE:?staging custom API audience required}
    ports: ["127.0.0.1:8000:8000"]
    depends_on:
      db:
        condition: service_healthy
    logging: *logging
  db:
    image: ${POSTGRES_IMAGE:?approved postgres16 digest required}
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_BOOTSTRAP_PASSWORD:?fresh bootstrap secret required}
      POSTGRES_DB: invoice_staging
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d invoice_staging"]
      interval: 5s
      timeout: 3s
      retries: 10
    logging: *logging
volumes:
  pgdata:
    external: true
    name: invoice-staging-pg16
```

Protected `/etc/invoice-staging/release.env` must contain these operator inputs:

```dotenv
# Placeholder-only example; supply real secrets in protected operator storage.
BACKEND_IMAGE=invoice-backend:<RELEASE_SHA>
FRONTEND_IMAGE=invoice-frontend:<RELEASE_SHA>
POSTGRES_IMAGE=postgres:16@sha256:<APPROVED_DIGEST>
POSTGRES_BOOTSTRAP_PASSWORD=<FRESH_STAGING_BOOTSTRAP_SECRET>
DATABASE_URL=postgresql://invoice_staging:<URL_ENCODED_STAGING_PASSWORD>@db:5432/invoice_staging
CORS_ORIGIN=https://<APP_HOST>
DEMO_MODE=false
DOMAIN=https://<STAGING_AUTH0_HOST>/
AUDIENCE=<STAGING_API_IDENTIFIER>
```

The protected env is Compose syntax, not a shell script: do **not** source it.
Use safe quoting/escaping for Compose `$` interpolation and URI percent-encoding
for the DB password. Restrict file permissions to 0600 and parent 0700. Avoid
credentials in command-line URLs, `set -x`, expanded config output and logs.
The application currently consumes a URL secret rather than Docker secret files;
do not pretend `_FILE` settings are supported by the backend.

Define for subsequent host commands:

```bash
dc() {
  docker compose --env-file /etc/invoice-staging/release.env \
    -p invoice-staging -f /opt/invoice-staging/compose.staging.yml "$@"
}
dc config --quiet
```

Review exact manifest/image/secret provenance, volume name, private bindings and
NODE_ENV=production before running `up`. Hash and retain the manifest, never the
expanded env publicly. Ensure a second operator/deployment process cannot race
the rollout (use one `flock`-guarded deployment shell or an equivalent exclusive
operator lock spanning backup, migration and application restart).

## 6. Database initialization and migration gate

**Fresh staging only.** If a candidate DB/volume already exists, stop and inventory
it; use the existing-data branch below. Do not reset/delete/replace a volume.

```bash
docker volume inspect invoice-staging-pg16
# On first install this must report no such volume. If it exists, investigate.
# After approval of a NEW isolated volume only:
docker volume create --label environment=staging invoice-staging-pg16
dc up -d --wait --wait-timeout 180 db
dc exec -T db psql -X -U postgres -d invoice_staging -v ON_ERROR_STOP=1 \
  -c 'SELECT current_database(), current_user, version();' \
  -c 'SELECT tablename FROM pg_tables WHERE schemaname = '\''public'\'';'
```

Check host/account and mounted volume against target record; public schema should
have no app tables. PostgreSQL POSTGRES_* only initializes an empty volume; changing
its env will not change an old DB/password. Database name alone does not prove
isolation. No app should be running yet.

Create one non-superuser application owner using interactive psql on this **fresh
staging DB**, after verifying those outputs. These commands mutate only the named
staging role/database and require the approved initialization scope:

```bash
dc exec db psql -X -U postgres -d invoice_staging -v ON_ERROR_STOP=1
```

```sql
CREATE ROLE invoice_staging LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
\password invoice_staging
-- Enter the same generated secret held in protected DATABASE_URL; no literal password SQL.
ALTER DATABASE invoice_staging OWNER TO invoice_staging;
GRANT USAGE, CREATE ON SCHEMA public TO invoice_staging;
SELECT rolname, rolsuper, rolcreatedb, rolcreaterole FROM pg_roles
WHERE rolname = 'invoice_staging';
\q
```

Use a separate bootstrap credential. This low-traffic setup uses the app owner
for migrations/runtime; least-privilege separate migration/runtime roles can be
a later scoped improvement. Record server identity, empty state and role flags.
Take/verify a pre-migration backup using section 9 even on this initialized empty
DB. Rehearse restore locally to disposable infrastructure before proceeding.

**Existing-data branch:** inspect migration history/schema read-only first; back
up and restore into an isolated disposable copy. Compare exact committed SQL,
checksums, enums/indexes/FKs and current domain-valid data. Rehearse any reviewed
baseline reconciliation there; never infer `migrate resolve` arguments from a
failure message. Base migration expects absent base tables; revision migration
expects absent InvoiceRevision unless recorded. Historical `db push`/different
migration lineage, populated revision tables, collisions or schema drift are a
NO-GO until reviewed reconciliation passes. No generic reset, db push, resolve,
drop or destructive rollback command is authorized by this runbook.

Before deploying, close CI, DB identity, backup/restore and configuration gates.
Acquire the exclusive rollout lock, put ingress into maintenance (see section 7),
stop existing frontend/backend writers on an update, and record current migration
rows/previous images. **Do not run integration tests or the managed E2E harness
against this persistent DB**; tests mutate fixtures and their managed runner
creates its own cluster rather than verifying staging.

Apply migrations once via a one-shot candidate image, bypassing automatic startup:

```bash
# MUTATES ONLY THE VERIFIED STAGING DB. Requires approved rollout and backup.
dc run --rm --no-deps --entrypoint node backend \
  node_modules/prisma/build/index.js migrate deploy
dc run --rm --no-deps --entrypoint node backend \
  node_modules/prisma/build/index.js migrate status
dc run --rm --no-deps --entrypoint sh backend -c \
  'node node_modules/prisma/build/index.js migrate diff --from-url "$DATABASE_URL" --to-schema-datamodel prisma/schema.prisma --exit-code'
```

Require successful deploy, status up-to-date and diff exit0. URL is expanded only
inside the container, never printed. Keep raw diagnostics private; redact any
credential-bearing error text before sharing. Record both committed migrations
and resulting `_prisma_migrations` status. No seed is required for normal startup.
Do not pre-seed Demo while flags are off; its approved public entry performs reset.

## 7. TLS ingress and deployment order

Stage host nginx with an HTTP ACME webroot, initially serving **maintenance** on
both hosts, not the application. Use webroot `/var/www/letsencrypt`. The temporary
HTTP server needs the operator-substituted server_names and:

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/letsencrypt;
}
location / { return 503; }
```

After DNS/port80 reachability is proven and certificate request authorized:

```bash
# External mutation: issues staging-host certificates; approved hostnames only.
sudo certbot certonly --webroot -w /var/www/letsencrypt \
  -d <APP_HOST> -d <API_HOST> --email <ACME_CONTACT_EMAIL> --agree-tos
```

Record actual issued certificate paths; do not guess them. Configure automated
renewal and a successful-renewal hook that runs `nginx -t` then reloads nginx;
authorize/perform `certbot renew --dry-run` when appropriate. Do not expose app
traffic merely because certificates issued.

Proposed nginx config, substituted/reviewed on host. `map` and `limit_conn_zone`
belong in the **http** context (an included conf.d file in standard nginx installs).
`<TLS_FULLCHAIN_PATH>` and `<TLS_KEY_PATH>` refer to the issued two-host certificate.
No CDN/load balancer in front of this proxy is assumed.

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
map $http_origin $staging_ws_origin {
    default 0;
    "https://<APP_HOST>" 1;
}
map "$http_upgrade:$staging_ws_origin" $deny_ws_origin {
    default 1;
    ":0" 0;
    ":1" 0;
    "websocket:1" 0;
}
limit_conn_zone $binary_remote_addr zone=staging_connections:10m;
log_format staging_min '$remote_addr $request_method $uri $status $request_time';

server {
    listen 80;
    server_name <APP_HOST> <API_HOST>;
    access_log /var/log/nginx/invoice-staging-access.log staging_min;
    location ^~ /.well-known/acme-challenge/ { root /var/www/letsencrypt; }
    location / { return 301 https://$host$request_uri; }
}
server {
    listen 443 ssl;
    server_name <APP_HOST>;
    ssl_certificate <TLS_FULLCHAIN_PATH>;
    ssl_certificate_key <TLS_KEY_PATH>;
    ssl_protocols TLSv1.2 TLSv1.3;
    access_log /var/log/nginx/invoice-staging-access.log staging_min;
    # Keep this file present until candidate health/config gates pass.
    if (-f /etc/invoice-staging/maintenance) { return 503; }
    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $remote_addr;
    }
}
server {
    listen 443 ssl;
    server_name <API_HOST>;
    ssl_certificate <TLS_FULLCHAIN_PATH>;
    ssl_certificate_key <TLS_KEY_PATH>;
    ssl_protocols TLSv1.2 TLSv1.3;
    access_log /var/log/nginx/invoice-staging-api-access.log staging_min;
    client_max_body_size 1m;
    if (-f /etc/invoice-staging/maintenance) { return 503; }
    location / {
        if ($deny_ws_origin) { return 403; }
        # Upgrade requests without exact app Origin (including absent Origin) denied.
        limit_conn staging_connections 20;
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        # Overwrite any client-supplied chain: backend trusts exactly one hop.
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

The map uses an exact origin string with no wildcard; validate foreign-origin
rejection. Configure a default-server rejection for unrelated Host headers
alongside this snippet.
The per-IP 20 connection proposal is an initial bound, not distributed or
GraphQL-operation rate limiting; HTTP rate limiting remains 100/IP/15m. Limit
changes need recorded reasons if mobile/NAT users are affected. Set logrotate
(proposed 7 days), restrict logs, and ensure global nginx settings do not log
Authorization/query strings. Backend req.url/error logging is still a privacy
consideration even when ingress logs omit args.

Validate `sudo nginx -t` before each `sudo systemctl reload nginx`. Host nginx
must reach loopback publications; if moved into a container, these upstreams
are wrong and the network/one-hop design needs revision. Do not add a `/graphql`
prefix, path rewrite or automatic backend TLS here.

Deployment sequence, all under the exclusive operator lock:

1. Enable maintenance: `sudo touch /etc/invoice-staging/maintenance`. Confirm both
   HTTPS hosts return 503. On update, `dc stop frontend backend` to close existing
   WS sessions/writers; maintenance alone does not close already upgraded sockets.
2. Confirm protected previous/candidate env, immutable images, database identity,
   backup and migration plan. Apply/verify migrations per section 6. Stop on error.
3. `dc up -d --no-deps --wait --wait-timeout 180 backend`. Entry-point repeats
   migrate deploy idempotently; only one backend replica starts, so no parallel
   release migration. Inspect private startup logs and health.
4. `dc up -d --no-deps --wait --wait-timeout 180 frontend`. Verify local compiled
   API/static page below, image IDs/labels and redacted env values from target record.
5. Validate nginx/certificate configuration and database synthetic check; remove
   maintenance only when those pass: `sudo rm /etc/invoice-staging/maintenance`.
   This removes only the explicitly created maintenance marker, not data.
6. Run public network/browser checks below. Mark installation **under validation**
   until every acceptance gate passes. Keep public Demo off initially.

```bash
dc ps
curl --fail http://127.0.0.1:8000/health
curl --fail http://127.0.0.1:5173/invoice-web-app/
curl --fail -H 'Content-Type: application/json' \
  --data '{"query":"{ __typename }"}' http://127.0.0.1:8000/
dc exec -T db psql -X -U postgres -d invoice_staging -v ON_ERROR_STOP=1 -c 'SELECT 1;'
```

## 8. Acceptance smoke checklist

Record timestamp, release SHA, browser/device version, expected/observed outcome
and redacted evidence per case. Never store tokens/credentials/real invoice data.
Run HTTP/WS abuse/rate checks from synthetic test clients without overwhelming
shared service or consuming all request allowance needed for normal tests.

### Network and serving

```bash
# Shell variables here contain public origins only; set approved values first.
curl --fail --show-error -I "$APP_ORIGIN/invoice-web-app/"
curl --fail --show-error "$API_ORIGIN/health"
curl --show-error -i -X OPTIONS "$API_ORIGIN/" \
  -H "Origin: $APP_ORIGIN" \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: authorization,content-type'
curl --show-error -i -X OPTIONS "$API_ORIGIN/" \
  -H 'Origin: https://untrusted.invalid' \
  -H 'Access-Control-Request-Method: POST'
curl --show-error -i "$API_ORIGIN/test-setup"
```

- [ ] Certificate validates without `-k` on desktop and physical mobile; approved
  hostnames and renewal timer/hook verified. HTTP redirects to HTTPS; API browser
  URL is already HTTPS (WS clients must not rely on redirects).
- [ ] Allowed preflight returns exact app origin and expected credentials/methods/
  Authorization allowance. Foreign HTTP origin must not receive an ACAO value
  matching it; it may receive a response with the configured origin rather than 403.
  CORS denial alone does not prevent non-browser callers.
- [ ] GraphQL HTTP root POST returns data and no unexpected errors; /test-setup 403.
  Anonymous, invalid token, disabled Demo token and historical demo-admin cannot
  obtain protected data. GraphQL HTTP 200 with errors is not successful auth.
- [ ] App root/base redirects work, assets 200, nonexistent asset 404. Refresh
  `/invoice-web-app/#/invoices/<OWNED_ID>` in authenticated session; route stays
  valid. Non-hash path receives SPA fallback; do not claim HashRouter renders
  that path as an invoice route. Callback query survives ingress without rewrite.
- [ ] No mixed content, console/page errors, localhost API or container-name URLs
  in real browser network requests. No public Vite dev/preview server.
- [ ] External attempts to reach 8000/5173/5432 fail. Verify actual listeners and
  provider firewall, including IPv6 if enabled. Docker DB volume remains correct.
- [ ] Two test clients have distinct real IP rate buckets; forged
  X-Forwarded-For does not create a new allowance. Test safely and record 429/reset
  headers; avoid 100+ request bursts on the main smoke-test IP.

### Real Auth0 and authorization

Use **Demo-disabled initial bundle**. The following are acceptance requirements,
not already verified behavior. Live auth setup may need correction in this phase.

1. [ ] Confirm first-login subject has no local row using a restricted DB query or
   authorized operator tool; do not expose its email. Sign in through Universal
   Login from the actual staging origin. Callback lands at base URL and owned
   invoice query succeeds. Confirm exactly one PostgreSQL User row under Auth0 sub,
   expected USER role and unique username; no legacy createUser mutation used.
2. [ ] Create a synthetic draft then pending invoice, edit it, check calculated
   total, mark pending paid, delete a separate disposable owned invoice. Check
   revision list/snapshot/diff and restore on eligible owned invoice; paid invoice
   edits/restore stay constrained by current domain policy. Verify restored state
   and new history rather than assuming a mutation response alone proves it.
3. [ ] Logout and repeat login; same subject/row/role and invoices, no duplicate
   provisioning. Refresh page/direct hash detail link; localstorage cached session
   works and no auth redirect loop occurs.
4. [ ] Wait past the configured access-token lifetime. Perform a fresh authenticated
   query/mutation; observe silent renewal and a new expiry locally, without saving
   token values. Confirm post-login Action supplies required claims after refresh.
   Repeat in privacy-restricted/mobile browser. Failure is a live Auth0 gate failure.
5. [ ] Logout returns to the registered base URL and prevents cached invoice display/
   protected requests. Previously issued JWTs are not automatically revoked by
   browser logout: do not claim that they are. Verify subsequent fresh login works.
6. [ ] USER A and USER B each own a synthetic invoice. List/read/edit/delete/mark
   paid/history/diff/restore attempts against the other's invoice/revisions must
   deny consistently with no data changed. USER cannot allUsers/createUser/delete
   users or read another profile. No bulk deletion is part of this smoke test.
7. [ ] ADMIN with aligned token+stored role can list/read the synthetic other-user
   invoice and authorized revision history, and allUsers. Verify intended invoice
   mutation on synthetic data. Do not exercise destructive deleteUsers endpoints.
   No admin frontend toggle exists; use an authorized API test if UI cannot expose
   the needed operation.
8. [ ] Document repeat-login stored role preservation. Deliberate token/store role
   drift tests, if approved, run only with synthetic staging records and a backup.
   User API HTTP role, invoice-service token role and WS token role are different
   sources; do not accept stale-admin behavior for real production accounts.

### WebSockets

Use a locally installed trusted graphql-ws client or browser console/test tool
with **no HAR/trace recording**. Transport contract is:

```text
URL: wss://<API_HOST>/
Subprotocol: graphql-transport-ws
Origin: https://<APP_HOST>
connection_init payload: {"Authorization":"Bearer <ACCESS_TOKEN>"}
After connection_ack, subscribe payload uses a unique id and a GraphQL query.
For a lightweight authenticated operation use { allInvoices { id } }.
For ADMIN-only feed use subscription { invoiceAdded { id } }.
Send complete for finished operations and close the socket.
```

- [ ] HTTPS-derived WSS root returns 101 and connection_ack, then authenticated
  operation returns only expected owned data; first perform HTTP API provisioning.
- [ ] ADMIN invoiceAdded subscription receives a synthetic USER-created invoice;
  USER and Demo cannot subscribe (FORBIDDEN). Failed/anonymous operations return
  no protected data; a connection_ack by itself does not prove authorization.
- [ ] Foreign or absent Origin WS upgrade is rejected 403 by ingress. Valid app
  Origin with bad token can connect but protected operation must fail.
- [ ] Idle beyond proxy timeout and reconnect: connection either remains usable
  or reconnects cleanly and reacquires auth. Test new operation after access expiry
  and fresh WS connection; record that open subscriptions are not continuously
  reauthorized. Repeat through actual mobile network.
- [ ] Backend restart closes sockets; client recovery succeeds with correct token
  and no cross-user cache/data. One replica remains selected; no distributed bus.

### Approved Demo phase

After Auth0 phase passes, obtain/confirm Demo exposure approval. Set DEMO_MODE=true
in protected backend env and rebuild frontend from the **same reviewed source SHA**
with VITE_DEMO_MODE=true and the same public Auth0 URLs. Give the Demo frontend a
distinct immutable image tag/archive record (e.g. `<RELEASE_SHA>-demo`); do not
overwrite the saved account-only rollback image. Recreate backend and frontend
under maintenance using the deployment sequence; migration check should be a no-op.

- [ ] Before entry, restricted operator inspection confirms the seven canonical
  IDs AA1449/FV2353/RG0314/RT2080/RT3080/TY9141/XM9141 are absent or owned by demoId;
  canonical item/revision IDs do not collide with synthetic real accounts.
- [ ] New browser tab enters Demo, canonical reset succeeds, seven invoices/eleven
  revisions (five RT3080 snapshots), demoId persisted/effective USER. Verify both
  client/server flags; frontend flag alone is insufficient.
- [ ] Demo create/edit/delete/mark pending paid/history/diff/restore/reset works.
  Reset removes visitor changes and restores fixtures; synthetic USER A/B records
  and revisions remain identical. Demo cannot read/mutate their IDs or profiles,
  list users or receive ADMIN subscription. Historical demo-token-admin rejected.
- [ ] Refresh in ready tab preserves entry state; explicit exit/re-entry resets;
  navigation does not reset. In two visitor tabs, demonstrate intentional shared
  changes/reset interruption. Disclose shared synthetic workspace to evaluators.
- [ ] Logout exits Demo and permits real Login with staged Auth0 config; refresh
  stays inactive in that tab. Test return from Auth0 in the Demo-enabled build.
- [ ] No foreign-ID collision test changes real records. If existing canonical-ID
  conflict blocks entry, leave those records untouched; disable Demo and investigate.
- [ ] Safe rollback of Demo flags: DEMO_MODE=false rejects token over HTTP/WS;
  rebuild/redeploy VITE_DEMO_MODE=false to remove UI. Re-enable only by approval.

### Operations and persistence

- [ ] App/container restart preserves synthetic users/invoices/history, no automatic
  reset/seed. Host reboot test (approved maintenance) restarts Docker/nginx/containers;
  inspect restart counts/OOM and subscriptions after recovery.
- [ ] /health monitoring plus private DB query and authenticated synthetic read;
  alert on failed migration/startup/unhealthy container/backup age/disk/TLS expiry.
  Later DB loss must be detected even though /health alone stays 200.
- [ ] Rotated restricted logs contain no tokens/credentials/raw invoice content in
  sampled failures; sanitize GraphQL error details before sharing. Short retention.
- [ ] Nightly encrypted off-host backup/checksum, last successful disposable restore,
  retained previous images and protected configuration verified.

## 9. Backup, restore and application rollback

No backup/restore operation was executed in Slice 6B-1. Commands here require the
approved staging scope, verified host/DB identity and protected output location.
Never run commands against an external/production database by substituting its URL.

### Before every rollout

1. Verify console host/account/project plus `dc` target, mounted volume and
   `SELECT current_database(), current_user, version()`; record previous source
   SHA/image IDs and candidate compatibility. Verify that no other rollout runs.
2. Maintenance + stop backend/frontend writers (including open WS) for a consistent
   rollback boundary. Record last writes/time and migration state; on first install
   record `_prisma_migrations` absence. Use a read-only conditional table check if
   needed, not a query that assumes the table already exists.
   For an initialized application schema record User/Invoice/Item/InvoiceRevision/
   ClientAddress/SenderAddress counts and completed migration names/checksums in a
   protected backup manifest. For the empty first-install schema record absent
   tables instead. Counts are validation evidence, not a substitute for a dump.
3. In a restricted backup directory, produce a custom-format dump with PG16 tools.
   Operator chooses &lt;BACKUP_DIRECTORY&gt; outside served paths and shell sessions are
   non-verbose. Example does not place a password in argv:

```bash
set -euo pipefail
umask 077
backup_dir='<BACKUP_DIRECTORY>'
test -d "$backup_dir" || exit 1
backup_file="$backup_dir/invoice-staging-$(date -u +%Y%m%dT%H%M%SZ).dump"
dc exec -T db pg_dump -U postgres -d invoice_staging -Fc > "$backup_file"
test -s "$backup_file" || exit 1
pg_restore --list "$backup_file" > "$backup_file.toc"
sha256sum "$backup_file" > "$backup_file.sha256"
```

Run fail-fast shell/error checks (especially pg_dump's exit code); a nonempty
file/TOC is not a restore test. Encrypt/upload through the approved off-host
mechanism and independently verify stored object/hash/retrieval. Select concrete
provider/key/commands in the approval record before real rollout; do not guess
backup accounts or keys. Keep cluster role grants and secret recovery records
separately; pg_dump omits globals. No unencrypted dump in a public bucket, repo,
browser artifact or webroot. Propose nightly/pre-release dumps with 7 daily/4 weekly
retention; verify backup age and storage limits. VM backups are supplemental.
4. Rehearse pg_restore on a new **disposable local** PG16 instance, create the
   expected app role/database, restore and run validation below. Record elapsed
   recovery time/RPO and archive/image versions. Once rehearsed for the procedure,
   future rollouts still require a valid fresh dump and compatibility review.

Concrete local rehearsal, **only on an approved disposable local Docker engine**:
verify the proposed container/volume names are unused first. `<PG16_IMAGE>` is the
approved digest, `<LOCAL_REHEARSAL_ENV_FILE>` is a protected file containing a
local-only POSTGRES_PASSWORD (not a staging/production credential). `backup_file`
refers to an approved retrieved/hash-verified archive; restrict it even when it
contains only synthetic data. These commands create and populate new local
resources; they must not run on the staging/production Docker context.

```bash
docker context show
docker container inspect invoice-restore-rehearsal
docker volume inspect invoice-restore-rehearsal-pg16
# Both inspections must show absence; investigate existing names instead of reuse.
docker volume create --label purpose=disposable-restore-test invoice-restore-rehearsal-pg16
docker run -d --name invoice-restore-rehearsal --network none \
  --env-file <LOCAL_REHEARSAL_ENV_FILE> \
  --mount type=volume,source=invoice-restore-rehearsal-pg16,target=/var/lib/postgresql/data \
  <PG16_IMAGE>
# Poll pg_isready with a bounded timeout; require success before subsequent steps.
docker exec invoice-restore-rehearsal pg_isready -U postgres -d postgres
docker exec invoice-restore-rehearsal psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -c 'CREATE ROLE invoice_staging LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;'
docker exec invoice-restore-rehearsal createdb -U postgres --owner=invoice_staging invoice_restore_check
docker exec -i invoice-restore-rehearsal pg_restore -U postgres -d invoice_restore_check \
  --no-owner --no-privileges --role=invoice_staging \
  --single-transaction --exit-on-error < "$backup_file"
docker exec invoice-restore-rehearsal psql -X -U postgres -d invoice_restore_check \
  -v ON_ERROR_STOP=1 -c 'SELECT current_database(), current_user, version();'
```

Compare table/row/migration manifest, object ownership and constraints to source
backup. For schema/CRUD testing, connect only an isolated candidate test container
to this disposable database through a new private local network, give the local
app role a generated local password and use synthetic records; never pass staging
Auth0/DB credentials. For a pre-migration empty backup, expect absent app tables,
then rehearse applying the chain there before synthetic app checks. Record archive
hash and validation results. Stop the rehearsal container when complete. Removal
of this specifically verified disposable container/volume is destructive cleanup
requiring operator approval; no broad prune or staging volume cleanup is included.

### Application deployment failure

Put maintenance back, stop frontend/backend and preserve private logs. If DB
schema is unchanged or explicitly compatible with the previous code, restore the
saved protected previous env (same staging DB/bootstrap credentials), previous
image IDs/public build config and ingress. Verify selected image labels/IDs.
Never point rollback to another environment's DB. Do not restart PostgreSQL merely
because a frontend/API image failed.

After schema compatibility and migration state inspection, start **previous
backend without its automatic migration entrypoint**:

```bash
# Uses previously restored/reviewed release.env and immutable previous image.
# Bypass migrate-deploy entrypoint only for this verified compatible app rollback.
dc run -d --no-deps --service-ports --name invoice-staging-rollback-api \
  --entrypoint node backend dist/src/index.js
# Wait/inspect this container's health before starting the previous frontend.
docker inspect invoice-staging-rollback-api --format '{{.State.Health.Status}}'
dc up -d --no-deps --wait --wait-timeout 180 frontend
```

`dc stop backend` must precede this temporary rollback container to free 8000;
select a previously unused rollback container name or inspect the existing named
container before proceeding. This temporary container is separate from the
Compose backend service; record it and never `dc up backend` alongside it. Poll
boundedly until healthy and inspect logs; an unhealthy container is not a pass.
Keep DB health, GraphQL authorized read and UI checks; remove maintenance only
after recovery passes. Later reconcile to the standard Compose backend under
maintenance after reviewing the previous image's migration chain. Do not assume
an older entrypoint is harmless against a new schema. If schema compatibility is
unknown, keep maintenance and use the migration-failure decision below.

On a first-ever installation there is no previous application. Stop candidate,
retain its DB and diagnostics, correct cause and obtain a new clean release gate;
do not invent rollback artifacts or clear the DB to make startup green.

### Failed migration / restoration decision

Stop writers and migration restarts; preserve original DB, backup, migration rows,
logs and failed SQL/object inventory. `migrate deploy` has no automatic inverse.
Do not retry partial DDL blindly, edit committed migration checksums, db push,
reset or mark a failed migration applied. Choose with the operator:

- **Forward fix** when a minimal reviewed repair preserves data and can be rehearsed
  on a copy; rerun only under a separately reviewed recovery plan.
- **Application rollback** only if schema/data remain compatible; use above path.
- **Database restore** if integrity/compatibility cannot be recovered within approved
  downtime. Explicitly choose backup point and account for writes after backup.

**Restoration and switching DATABASE_URL require explicit operator approval.**
Even though the following restore creates a new DB rather than overwriting the
old one, switching to it can discard newer writes from the active application.
Restore to a unique new DB; no --clean, dropdb or volume removal is included.

```bash
# APPROVAL REQUIRED. Verified staging host only; all writers stopped.
# Choose a NEW database name and verify it does not exist first.
restore_db='invoice_staging_recovery_<APPROVED_UNIQUE_SUFFIX>'
dc exec -T db psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -c 'SELECT datname FROM pg_database ORDER BY datname;'
# Replace placeholder in restore_db and confirm NEW destination before creation.
dc exec -T db createdb -U postgres --owner=invoice_staging "$restore_db"
# backup_file must be a retrieved, decrypted, hash-verified approved PG16 archive.
dc exec -T db pg_restore -U postgres -d "$restore_db" \
  --no-owner --no-privileges --role=invoice_staging \
  --single-transaction --exit-on-error < "$backup_file"
```

Validate **new destination**: table/row counts against backup manifest, ownership,
FK/unique constraints, `_prisma_migrations` checksums/status (or legitimate absence
for pre-schema backup), schema diff against the compatible application, synthetic
USER access isolation, revision count/content, Demo ownership if present and DB
connectivity. Restore with no-owner/no-privileges intentionally needs reviewed
grants reapplied; the application role owns restored objects. On a pre-migration
empty backup, apply approved migrations to the **new** restored DB before testing.
Never aim the app at the original name merely to get `migrate status` output.

Prepare a protected env pointing DATABASE_URL to the new DB name. Approve the
write-loss/reconciliation decision and destination before starting a compatible
image; record whether migration entrypoint should be bypassed. Validate with
maintenance retained, then reopen and repeat auth/owned invoice/revision checks.
Preserve old DB and incident backup for reconciliation; cleanup/deletion requires
separate explicit approval. Resume backup jobs against the chosen active DB and
record the new recovery point. Do not claim successful recovery from TOC listing
alone. Restrict all dumps/logs to the operator; no sensitive data in final evidence.

### Rotation and routine recovery

Rotate application DB secret using interactive psql `\password invoice_staging`
against verified staging, then protected DATABASE_URL update and backend restart
under maintenance. Confirm old password fails and new one succeeds. Rotating
POSTGRES_PASSWORD env alone never changes initialized database credentials.
Bootstrap secret, backup encryption and SSH keys have separate custodians and
rotation records. Public Auth0 client IDs are not secrets. Auth0 issuer key
rotation/refresh revocation and role changes need their own reviewed tenant plan.
Unhealthy Compose containers do not automatically restart solely due to health;
inspect and recover deliberately, never by deleting DB volumes.

## 10. Final gates and production boundary

Before **controlled initial installation**: approved targets/costs/operation scope;
all hosted jobs on exact SHA; private staging DB/secrets; validated manifest and
TLS/origin plan; pre-release backup/off-host storage and disposable restore;
reviewed Auth0 settings/claims plan, operator and rollback artifacts ready.

Before **staging acceptance**:

- [ ] Deployed source SHA, frontend variant/image IDs, PG digest and configuration
  match the approved record; database identity/isolation/migration status/diff pass.
- [ ] Public TLS/CORS/WS/origin/forwarding/private-port checks pass.
- [ ] Live Auth0 first/repeat login, page refresh, renewal, logout, USER isolation
  and aligned ADMIN behavior pass on real browser/mobile; required claims observed.
- [ ] Approved Demo phase passes isolation/reset/shared-state checks, or Demo
  deliberately remains off and the unperformed phase is explicitly recorded.
- [ ] CRUD/revision restore, persistence/restart, logs/alerts, verified backup and
  successful disposable restore evidence complete; known limitations accepted.
- [ ] No open blocker; source changes after the recorded SHA require relevant
  local checks, hosted CI and repeat staging acceptance for that candidate.

**NO-GO / stop rollout** for wrong environment/DB, reused production secrets,
missing hosted check, unexpected migration lineage/drift/failure, missing backup/
restore, broken Auth0 claims, privilege/cross-user leakage, public raw backend/DB,
TLS/mixed-content/WS-origin failure or unexplained data loss. Enter maintenance,
stop writers and follow recovery; do not solve failures by relaxing security tests.

Staging success does **not** authorize production. Production additionally needs
explicit target/data/hosting budget approval, compatible production migration
rehearsal/backup, closed role/revocation policy from report P2, reviewed log privacy,
complete staging evidence and a separate deployment/promotion decision. Production
frontend values require a production-specific rebuild and smoke; do not reuse
staging audience/URLs or database credentials. Retain a release record of exact
images/build inputs and recovery artifacts. No production merge/push/deployment
or service mutation is authorized by this planning slice.
