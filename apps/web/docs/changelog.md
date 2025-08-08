# Changelog

## [Unreleased]
- Added `ALPHAFRAME_GA100_MASTER_PLAN.md` — execution-ready 30-day consumer-ready plan with budgets, gates, and Cursor preface.
- Hardened demo routing invariants: require FSM==='done' for demo users before allowing `/dashboard` in `src/utils/RouteGuard.jsx`.
- Improved persistence logic in `src/store/useAppStore.js` to respect persisted flags and legacy `localStorage`.
- Verified E2E stoplight flows across Chromium/Firefox/WebKit; logs in `docs/tests/playwright-summary.txt`.
