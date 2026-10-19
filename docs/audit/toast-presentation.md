# Toast and dashboard presentation verification

Verified locally on 2026-10-19, starting from main (`eec166f`). All browser work
uses the existing E2E runner's disposable PostgreSQL 16 cluster under `/tmp`,
production-mode local backend, and built Vite application served under
`/invoice-web-app/`. No hosted database, deployment, API, schema, authentication,
or infrastructure changes are included.

## Cause and fix

The original initial CSS bundle omitted React Toastify's stylesheet. Its only
imports belonged to invoice form/detail modules. Reset Demo on a fresh dashboard
therefore rendered a static, unstyled notification: a 300px desktop success SVG
(390px on mobile), plain message text, and an unstyled close button. The container
occupied the dashboard's normal flow and pushed the content down.

- Load Toastify CSS once from `src/index.tsx`; remove both feature-level imports.
- Move the toast container outside `Main`, remove the unused three-row grid, and
  explicitly use fixed positioning and a compact 320px width with viewport gutters.
- Use upper-right notifications with space for the horizontal header and page
  actions at smaller widths. One notification is visible at a time; Reset Demo
  notifications dismiss after three seconds. Existing per-action durations stay
  intact. Close buttons and hover-to-pause remain available.
- Centralize notification position and theme. Preserve Toastify v9's runtime
  defaults with React 19, and separate its theme prop from styled-components'
  theme prop. Toast text/background and close-button colors follow the app theme.
- Anchor the header at `(0, 0)`, fit its controls at 390px, constrain Reset Demo to
  the desktop sidebar, and give sidebar theme/avatar controls explicit heights.
- Correct the malformed `@font-face` source list and regular weight; use `swap`.
  Vite rewrites the public font URL to
  `/invoice-web-app/assets/LeagueSpartan-Regular.ttf`. Remove `local()` so a
  developer's installed font cannot hide a broken web-font request.

## Files changed

Paths below are relative to `invoice-frontend/` unless noted.

| Files | Change |
| --- | --- |
| `src/index.tsx` | Initial Toastify CSS import |
| `src/app/App.tsx`, `src/features/shared/styles/AppStyles.tsx` | Toast placement, sizing, theme, dismissal; remove spare dashboard grid |
| `src/features/shared/styles/index.css` | Valid web-font source and regular weight |
| `src/features/shared/components/Header.tsx`, `Avatar.tsx`, `buttons/DemoButton.tsx` | Header/sidebar control alignment and bounds |
| `src/features/shared/components/buttons/MarkAsPaidButton.tsx`, `src/features/invoices/components/DeleteModal.tsx`, `src/features/invoices/hooks/useSubmitDraft.ts` | Remove redundant CSS imports and per-action position/theme overrides |
| `playwright.config.ts`, `qa/tests/toast.spec.ts` | Built-browser regression matrix and screenshot attachments |
| `docs/audit/toast-presentation.md` and adjacent image directory (repository root) | Verification report and before/after captures |

## Screenshot comparison

These are unmodified browser captures of Reset Demo success using synthetic local
demo data. The original desktop capture includes the app's temporary welcome
message; final regression captures wait for its existing fade/collapse to finish.

| Viewport | Before | After |
| --- | --- | --- |
| 1440px desktop | [Original](toast-presentation/desktop-before.png) | [Fixed](toast-presentation/desktop-after.png) |
| 390px mobile | [Original](toast-presentation/mobile-before.png) | [Fixed](toast-presentation/mobile-after.png) |

The regression report additionally captures initial dashboard, reset success,
controlled reset failure, creation validation, payment success, and controlled
deletion failure at 1440px, 768px, and 390px in both themes.

## Checks

- `npm run check`: frontend app/node types, ESLint, 118 passing unit/integration
  tests (two existing skips), and production build.
- `npm run typecheck:e2e`: passing.
- `PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e`: all 29 tests pass
  (5.6 minutes), including all 12 new toast cases and the existing desktop, mobile,
  session recovery, and demo-disabled tests.
- The new built-browser matrix checks fixed positioning, 320px width, 64–88px
  height, 20px icons, close buttons, automatic dismissal, theme colors, no overlap
  with navigation/page actions, header control bounds, no horizontal overflow,
  unchanged title/first-card bounds after reset success/failure, and an HTTP 200
  font response plus a loaded `FontFace` under the deployment base path.
- Text contrast from the asserted computed colors is 18.37:1 in light mode and
  15.77:1 in dark mode.
- Negative control: intercept only the local built CSS response and remove its
  Toastify rules. The same `display: flex` assertion correctly fails, confirming
  that the regression detects missing vendor CSS without changing source or data.

Reproduce with Node 24, installed frontend/backend dependencies, PostgreSQL 16,
and Playwright Chromium:

```sh
cd invoice-frontend
npm run check
npm run typecheck:e2e
PG_BIN=/usr/lib/postgresql/16/bin npm run test:e2e
```

The runner prints the temporary report directory. Its HTML/JSON report includes
all 36 screenshots from the new matrix; CI retains these in the existing browser
artifacts.

## Scope and remaining behavior

Successful invoice creation and deletion currently confirm through navigation and
data updates; they do not emit success toasts. Preserve that behavior. Their
existing validation/deletion error notifications and payment success notification
are covered, alongside successful creation and deletion against the local API.

No remaining blocking dashboard/sidebar alignment issues were found at the
requested widths after reviewing the captures. The existing welcome-message
fade/collapse is intentionally unchanged; the layout
regression waits for it before comparing dashboard geometry. Transient overlays
can cover invoice content while visible, and remain dismissible. Header and page
actions are checked for overlap. This change preserves purple accents, cards,
responsive layouts, and both color modes.
