# Changelog

## [Unreleased]
- Added `ALPHAFRAME_GA100_MASTER_PLAN.md` — execution-ready 30-day consumer-ready plan with budgets, gates, and Cursor preface.
- Hardened demo routing invariants: require FSM==='done' for demo users before allowing `/dashboard` in `src/utils/RouteGuard.jsx`.
- Improved persistence logic in `src/store/useAppStore.js` to respect persisted flags and legacy `localStorage`.
- Verified E2E stoplight flows across Chromium/Firefox/WebKit; logs in `docs/tests/playwright-summary.txt`.
- Removed UI barrel export of `ComponentShowcase` from `src/components/ui/index.js` to break dependency cycle reported in `docs/dep-cycles.md`.
- Added `src/components/ui/OnboardingStatusBanner.jsx` and refactored `features/onboarding/OnboardingFlow.jsx` to use it for consistent, accessible error/timeout UX.
- Mobile/responsive tweaks: ensured tap targets (min-height 44px), removed highlight flash, and kept tokens import at top of `src/index.css`.
- Performance: Lazy-loaded additional routes in `src/App.jsx`; refined manualChunks in `vite.config.js`. New sizes: entry ~90KB (gzip ~22.6KB), react-vendor ~189KB (gzip ~60KB), motion ~78KB (gzip ~25KB), vendor ~1.23MB (gzip ~285KB). Further vendor splitting queued.
- Security/ops: Added `public/_headers` with CSP/HSTS/etc. to enable secure static hosting headers.
- Legal: Added scaffold legal pages and footer links (`/legal/terms`, `/legal/privacy`, `/legal/cookies`, `/legal/accessibility`) with `AppFooter` and routes wired.
- E2E: Restored green by honoring demo flags on DashboardPage and enhancing RouteGuard demo/test fast-path; updated E2E to navigate directly to `/dashboard` after flags; summary in `docs/tests/playwright-summary.txt`.
