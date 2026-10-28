# Public demo, Slice 4A: visitor-facing session integration (frontend)

Baseline: branch `public-demo/slice-3b0-integration`, HEAD `5be5dd5` (Slice 3C
backend), clean tree. All changes are local and **uncommitted**. Nothing was
deployed, production Neon was never touched, and no workflow, Dockerfile or
hosted configuration changed. The backend is unchanged.

## 1. Baseline findings (code first, then contracts)

- Frontend demo mode: `DemoModeProvider` (tab-scoped on/off + entry id),
  `DemoAuthProvider` (fixed fake user), `DemoSessionBoundary` (ran the shared
  `resetDemoData` on every entry), `useApolloClient` (token `demo-token`, always
  builds a graphql-ws link), `DemoButton` (shared reset).
- Backend contract actually in the code: `POST /demo/sessions` (empty JSON body,
  201 `{credential, expiresAt}`; 404 disabled, 429 throttled, 503 capacity or
  unavailable); 401 `UNAUTHENTICATED` / 503 `SERVICE_UNAVAILABLE` for the
  credential; writes are HTTP-only, one mutation per request; codes
  `QUOTA_EXCEEDED{quota}`, `SESSION_BUSY`, `RESET_COOLDOWN{retryAfterSeconds}`.
- Invoice IDs in a temporary workspace are `RT3080-<uuid>` and change on every
  reset. The UI already showed `id.substring(0, 6)` almost everywhere; the one
  exception was the delete confirmation (fixed).
- Two pre-existing defects that matter once writes can be refused: a failed
  create/edit was swallowed and the form was still reset/closed (the draft was
  lost); `MarkAsPaidButton`'s `onError` threw on a network error.

## 2. Feature gate

`VITE_DEMO_SESSIONS=true` **and** `VITE_DEMO_MODE=true` (`temporaryDemoSessionsEnabled()`
in `src/config/config.ts`). Default off; `.env.example`, README and an
`npm run demo:sessions` script document it. The backend needs its own
`DEMO_SESSIONS_ENABLED=true`. `.github/workflows/deploy-pages.yaml` sets only
`VITE_DEMO_MODE`, so the Pages build is unchanged. When off, `useTemporarySession()`
is `null` everywhere and every code path is the old one.

## 3. Visitor journey

1. Open the demo. The provider reads `localStorage["invoice-web-app:demo-session:v1"]`.
2. No credential: one `POST /demo/sessions` (serialized across tabs with the Web
   Locks API where available), then the seven canonical invoices load. The shared
   reset is never sent.
3. Valid-looking credential: resumed with **no** request; the dashboard query is
   the validation. A 401 swaps in the expired screen.
4. Edit, create, pay, delete, view/compare/restore revisions: the existing
   screens, unchanged apart from the changes below.
5. Reset Demo (dashboard only, as before): confirm dialog, `resetDemoSession`,
   clear Apollo store, back to `/invoices`, remount every page. Same credential,
   same original expiry.
6. Expired: "This demo workspace has expired." with **Start a new demo**.
7. A slim notice on the dashboard ("Private demo workspace, available until …
   Start a new demo") is the always-available way out when a quota is used up.

## 4. Browser storage

One namespaced `localStorage` key holds `{credential, expiresAt, backend}`
(survives refresh and browser reopen; sessionStorage would not). The credential
is never in a URL, a log line, or Apollo's cache. Entries that are malformed or
belong to another backend origin are discarded. `expiresAt` is advisory: only a
session more than five minutes past it skips the server and shows the expired
screen; anything else asks the server, which decides. Storage failures degrade to
an in-memory credential for the page. Logout (exit demo) **keeps** the credential
(re-entering resumes, and an abandoned session otherwise only occupies capacity
until it expires) but clears unsent form drafts and the Apollo cache (a new client).

## 5. Cache and identity isolation

- The Apollo client is rebuilt when the credential changes (fresh `InMemoryCache`);
  `useApolloClient` creates **no WebSocket link** for temporary sessions.
- Reset: `clearStore()` + a workspace counter keys the routed tree, so open forms
  and routes that name old IDs are dropped; the provider also navigates to
  `/invoices` in the same tick (a browser test found that "Start a new demo" from
  an invoice page otherwise landed on "Invoice not found").
- `cachedNewInvoiceForm` / `cachedEditForm` drafts are cleared on every workspace
  swap and on demo logout.
- A bookmarked pre-reset ID shows "Invoice may have been deleted or its workspace
  reset", with Go back and Retry.

## 6. Error recovery

| Condition | Behaviour |
| --- | --- |
| 401 anywhere | Recovery screen replaces the page; expired credential kept until a replacement exists; the interrupted write is **not** replayed |
| 503 on a read | Page's own error state with Retry; credential kept |
| 503 / lost response on a write | Toast; after a lost response, active queries are refetched and the visitor decides; nothing retries a write |
| Quota (attempts, changes, workspace, resets), `SESSION_BUSY`, `RESET_COOLDOWN` | Toast with a specific message (cooldown shows the wait); form, workspace and credential untouched |
| Allocation capacity / throttle / disabled / unavailable | First entry: "couldn't be started" screen with **Try again**, exactly one attempt until clicked. Voluntary new demo: toast, old workspace kept |

One place (`sessionErrorLink`) turns write failures into feedback; the old
per-hook toasts are suppressed in temporary mode to avoid duplicates. A failed
create/edit now keeps the form open **in all modes** (deliberate fix of the
defect above).

## 7. Files

New: `src/features/auth/demoSession/` (`credentialStore`, `sessionApi`,
`demoErrors`, `sessionErrorLink`, `TemporarySessionProvider`,
`TemporarySessionRecovery`, `DemoWorkspaceNotice`).
Changed: `config.ts`, `vite-env.d.ts`, `.env.example`, `README.md`, `package.json`,
`AppWrapper`, `App`, `DemoSessionBoundary` (split into shared/temporary),
`useApolloClient`, `DemoButton`, `Header`, `AllInvoices`, `ViewInvoice`,
`DeleteModal`, `RevisionHistoryPanel`, `MarkAsPaidButton`, `InvoiceContentStatus`,
`InvoiceDashboardPlaceholder`, `demo.mutations`, and the four add/edit submit hooks.
Tests: `tests/unit/demoSession/*` (6 files, 61 tests), `qa/tests/temporarySessions*.spec.ts`,
`qa/tests/sharedDemoUnchanged.spec.ts`, `qa/helpers/sessions.ts`, plus
`run-e2e.mjs`, `playwright.config.ts`, `qa/vite.config.ts`, `qa/helpers/invoice.ts`
(ID-pattern parameter).

## 8. Test results (disposable local PostgreSQL 16, production-mode builds)

- `npm run check` (typecheck, lint, unit, build): 29 files, **180 passed**, 2 skipped
  (baseline 119). Run twice after one unrelated 10 s hook-timeout flake in
  `newInvoiceForm.test.tsx` under CPU load from other processes on this machine; it
  passes alone and on rerun (same known issue as in the Slice 3B.2 notes).
- Full `E2E_BACKEND_REGRESSION=true npm run test:e2e`: backend unit 226 and
  integration 272 passed; **52 browser tests passed** (existing shared-demo,
  mobile, toast, loading and disabled suites unchanged and green). After that run I
  added the quota test and changed `Header.tsx` (logout draft-clearing now only in
  temporary mode) and `package.json`. Afterwards the temporary-session and mobile
  projects, `sharedDemoUnchanged`, and the shared-demo reset/toast/loading tests passed
  (a filtered run), the new quota test passed on its own, and `npm run check` passed.
  The outage project was skipped in that filtered run (a dependency failed on the then-
  broken quota test), so it last ran in the full run. The complete suite was not
  re-run in one piece after those last edits.
- Stacks: shared demo and disabled run with sessions OFF; a third stack
  (`DEMO_SESSIONS_ENABLED=true` backend + `VITE_DEMO_SESSIONS=true` build) uses its own
  PostgreSQL cluster in `America/Halifax` so the outage test stops and restarts a real
  database. Expiry, quota and reset-allowance states are set directly in that database.

Requested scenarios: (1) canonical dashboard, (2) create/edit/pay/delete/history/restore,
(3) refresh, (4) reopened browser (storageState, zero allocation requests), (5, 6) two
contexts with disjoint internal IDs and no cross-visibility, (7) reset with new IDs and
unchanged credential, (8) expiry from reload and mid-edit (one `editInvoice` request,
not replayed), (9) DB outage keeps the credential and Retry resumes the same workspace,
(10) no WebSocket in any flow, (11) shared-demo build asserted to send `demo-token`,
`ResetDemoData`, no allocation, no stored credential. Also: failed first allocation
makes exactly one request; cooldown/quota refusals keep forms and workspace; two tabs.

## 9. Not verified / follow-up (suggested Slice 4B)

- **Auto-allocation on first load is a public-launch decision.** Any first visit
  (including crawlers or link previews that run JS) consumes the global bucket
  (10 burst, 1/min refill) and capacity (100). Consider a click-to-start screen
  before enabling publicly; the code path already supports it (allocation is one
  `startNew()` call).
- **Cross-tab:** credential changes are handled (other tab reloads) and tested for one
  scenario. Not handled: a reset in one tab leaves another tab on old invoice IDs
  until it navigates (it then fails gracefully with NOT_FOUND); expiry is noticed only
  on that tab's next request; form drafts are shared across tabs (pre-existing).
- **Orphaned sessions:** "Start a new demo" and an allocation that times out after
  the server created a workspace leave a session until it expires; there is no
  revoke endpoint (backend item).
- **Accessibility:** confirmations use `window.confirm`; recovery screens use
  `role="alert"` but focus is not moved; the notice's contrast and screen-reader
  behaviour were not audited.
- **Mobile:** one Pixel 5 smoke test (no overflow, controls visible); the notice and
  header crowding were not reviewed visually beyond that.
- `SESSION_BUSY` and a mid-write 503 are covered by unit tests of the classifier and
  link only, not by a browser test. The dashboard load is the only credential
  validation (no separate probe).
- Reduced-motion and Firefox/WebKit were not run for the new flows.
