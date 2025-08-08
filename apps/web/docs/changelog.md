# Changelog

## [Unreleased]
- Added `ALPHAFRAME_GA100_MASTER_PLAN.md` — execution-ready 30-day consumer-ready plan with budgets, gates, and Cursor preface.
- Hardened demo routing invariants: require FSM==='done' for demo users before allowing `/dashboard` in `src/utils/RouteGuard.jsx`.
- Improved persistence logic in `src/store/useAppStore.js` to respect persisted flags and legacy `localStorage`.
- Verified E2E stoplight flows across Chromium/Firefox/WebKit; logs in `docs/tests/playwright-summary.txt`.
- Removed UI barrel export of `ComponentShowcase` from `src/components/ui/index.js` to break dependency cycle reported in `docs/dep-cycles.md`.
- Added `src/components/ui/OnboardingStatusBanner.jsx` and refactored `features/onboarding/OnboardingFlow.jsx` to use it for consistent, accessible error/timeout UX.
- Mobile/responsive tweaks: ensured tap targets (min-height 44px), removed highlight flash, and kept tokens import at top of `src/index.css`.
- Performance: Lazy-loaded additional routes in `src/App.jsx`; regenerated bundle treemap (`docs/bundle/report.html`). Main entry now ~912KB (gzip ~248KB). Further slimming queued.
