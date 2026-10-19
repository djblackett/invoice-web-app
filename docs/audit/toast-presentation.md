# Progressive loading and toast presentation verification

Verified locally on 2026-10-19, starting from main (`eec166f`). All browser work
uses the existing E2E runner's disposable PostgreSQL 16 cluster under `/tmp`,
production-mode local backend, and built Vite application served under
`/invoice-web-app/`. No hosted database, deployment, API, schema, authentication
rules, or infrastructure changes are included.

## Root causes

1. `DemoSessionBoundary` replaced its entire subtree until reset completed. Since
   that subtree included `Main`, `Header`, and all routes, visitors saw only plain
   initialization text while the backend was waking up.
2. Toastify CSS belonged to lazy invoice modules, rather than the initial bundle.
   Reset Demo could render a static, unstyled notification with a 300px desktop
   success SVG (390px on mobile), plain text, and an unstyled close button. The
   container occupied the dashboard flow and pushed the content down.
3. The welcome banner changed height after loading. Its collapse moved the invoice
   list despite no user action. The settled list spacing in the repository's
   desktop screenshots depended on that banner's remaining margins.
4. The malformed web-font source list could be masked by a locally installed font.
   The header lacked explicit top/left anchoring, and its controls could overflow.

## Repair and preserved contracts

- Expose boundary readiness through a render callback. Keep the shell mounted;
  mount invoice routes only after reset **and** cache clearing complete. The
  original initialization effect, reset-on-entry lifecycle, session persistence,
  and deduplicated entry promise remain unchanged.
- Render the existing dashboard toolbar immediately, with an unknown count and
  disabled invoice actions. Keep Reset Demo disabled during initialization while
  leaving theme switching and logout available.
- Reuse the existing purple Grid indicator in the invoice region, with decorative
  placeholders sized to the established cards. Use the same loading presentation
  during the subsequent invoice query. Initialization failure provides an alert
  and Retry Demo within the dashboard; invoice-query failure also offers retry.
- Remove the collapsing welcome banner and preserve its settled 16px spacing at
  tablet/desktop widths explicitly in `InvoiceGrid`. Compare against
  `diagrams/fm-screenshot.png`, `fm-mobile-dark.png`, and `frontend-screenshot.png`:
  preserve the original cards, toolbar, purple accents, and light/dark layouts.
- Load Toastify CSS once in the entry point, remove lazy imports, and keep compact
  fixed notifications outside the dashboard flow. Centralize position/theme,
  preserve Toastify v9's defaults under React 19, and avoid its theme-prop collision
  with styled-components. Reset notifications dismiss after three seconds;
  existing per-action durations remain intact.
- Correct the regular font's `@font-face` syntax and use `swap`. Vite emits
  `/invoice-web-app/assets/LeagueSpartan-Regular.ttf`; remove `local()` so the
  browser regression must load the real asset. Fit header/sidebar controls within
  their bounds at the requested widths.

## Files changed

Paths are relative to `invoice-frontend/` unless noted.

| Files | Purpose |
| --- | --- |
| `src/index.tsx`, `src/app/App.tsx` | Eager CSS; persistent shell and gated routes |
| `src/features/auth/components/DemoSessionBoundary.tsx` | Expose readiness without changing the reset effect |
| `src/features/invoices/components/InvoiceDashboardPlaceholder.tsx`, `InvoiceContentStatus.tsx` | Shared dashboard loading/error presentation |
| `src/features/invoices/components/AllInvoicesToolbar.tsx`, `AllInvoicesView.tsx`, `InvoiceGrid.tsx` | Unknown count, disabled actions, consistent row geometry and spacing |
| `src/features/invoices/pages/AllInvoices.tsx`, `ViewInvoice.tsx`, `hooks/useInvoices.ts` | Use shared loading UI; remove banner; expose invoice-query retry |
| `src/features/invoices/styles/AllInvoicesToolbarStyles.tsx` | Normalize the disabled action fieldset |
| `src/features/shared/styles/AppStyles.tsx`, `index.css` | Fixed themed toasts, remove spare dashboard grid, valid font source |
| `src/features/shared/components/Header.tsx`, `Avatar.tsx`, `buttons/DemoButton.tsx` | Persistent, bounded navigation controls |
| `src/features/shared/components/buttons/MarkAsPaidButton.tsx`, `src/features/invoices/components/DeleteModal.tsx`, `hooks/useSubmitDraft.ts` | Remove redundant CSS imports and position/theme overrides |
| `playwright.config.ts`, `qa/tests/loading.spec.ts`, `session.spec.ts`, `toast.spec.ts` | Built-browser loading, lifecycle, and toast regressions |
| Unit/integration tests for the session boundary, invoice list and invoice view | Cache-clear readiness contract and changed loading/error UI |
| This report and adjacent captures (repository root) | Visual evidence and measurements |

## Before and after

Unmodified browser captures use synthetic local demo data. Before loading captures
come from the previous styling commit; before toast captures reproduce main's
original unstyled notification. After captures correspond to the completed repair.

| State | Before | After |
| --- | --- | --- |
| Delayed initialization, desktop | [Before](toast-presentation/desktop-loading-before.png) | [After](toast-presentation/desktop-loading-after.png) |
| Delayed initialization, 390px | [Before](toast-presentation/mobile-loading-before.png) | [After](toast-presentation/mobile-loading-after.png) |
| Reset success, desktop | [Before](toast-presentation/desktop-before.png) | [After](toast-presentation/desktop-after.png) |
| Reset success, 390px | [Before](toast-presentation/mobile-before.png) | [After](toast-presentation/mobile-after.png) |

## Loading measurements

Before: holding reset for 1.5 seconds left **zero header/title elements** at every
width. The complete dashboard appeared only after the backend reset completed:

| Width | Plain loading capture | Dashboard visible |
| --- | --- | --- |
| 1440px | 1721ms | 2668ms |
| 768px | 1685ms | 2610ms |
| 390px | 1653ms | 2614ms |

| Scenario | Width | Shell | Loading region | Invoice DOM |
| --- | --- | --- | --- | --- |
| Delayed reset + query | 1440px | 139ms | 139ms | 7067ms |
| Responsive backend | 1440px | 220ms | 220ms | 1043ms |
| Delayed reset + query | 768px | 151ms | 151ms | 4869ms |
| Responsive backend | 768px | 168ms | 168ms | 750ms |
| Delayed reset + query | 390px | 113ms | 113ms | 5176ms |
| Responsive backend | 390px | 150ms | 150ms | 656ms |

These are local navigation-relative DOM observations, not production Fly/Neon
latency claims. The delayed case holds each request for **at least** 1.5 seconds;
theme checks and screenshot capture add time before release. For example, the
1440px reset was released at 3205ms and the invoice query at 6786ms. The shell was
already present at 139ms. All three widths recorded zero heading displacement
and zero first-row displacement after the existing entrance animations settled.
A responsive local backend rendered invoice data in 656–1043ms.


## Quality gates and browser coverage

- `npm run check`: app/node types, ESLint, 119 passing unit/integration tests
  (two existing skips), and production build.
- `npm run typecheck:e2e`: passing.
- Full built-browser suite: all 35 cases pass (5.2 minutes), including desktop,
  mobile and demo-disabled workflows. After the final progress-indicator label
  adjustment, all eight loading/session cases pass again (38.8 seconds).
- Delayed browser coverage checks the same header DOM node survives initialization,
  no invoice queries/mutations or stale cards appear before readiness, one reset
  occurs despite StrictMode/theme changes, unknown counts and disabled controls
  persist through loading, and title/card geometry stays stable.
- Responsive-backend cases cover normal loading and direct invoice reload with no
  extra reset. Session tests cover initialization failure, retained shell and retry.
- Toast cases cover 1440px, 768px and 390px in both themes: reset success/failure,
  creation validation, payment success and deletion errors; fixed 320px width,
  normal 20px icons, automatic dismissal, live theme colors, control overlap,
  unchanged dashboard geometry, and font HTTP 200/loaded `FontFace` under the base.
- Text contrast from asserted computed toast colors is 18.37:1 in light mode and
  15.77:1 in dark mode. Toasts retain their alert announcements; the loading region
  has a status announcement and a named progress indicator.
- The browser-only negative control from the initial styling repair removes
  Toastify CSS from a local built response: the `display: flex` assertion fails as
  expected. No source or hosted data is changed by that control.

Reproduce with Node 24, installed frontend/backend dependencies, PostgreSQL 16,
and Playwright Chromium:

```sh
cd invoice-frontend
npm run check
npm run typecheck:e2e
PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e
```

The runner prints its temporary HTML/JSON report directory. Screenshots and timing
attachments are retained by the existing browser CI artifact workflow. The full
run contains 53 screenshots; the final loading rerun supplies the measurements
and loading captures above.

## Remaining behavior

Successful invoice creation/deletion confirm through navigation and data updates;
no new success notifications were added. Toasts can temporarily cover invoice
content while visible; navigation and page actions remain clear and the toast is
both dismissible and automatically timed out. No remaining blocking dashboard/sidebar presentation defects were found at the
requested widths. Existing card entrance animations
remain; geometry checks wait for them to settle. This is a frontend regression
repair with no deployment or backend changes.
