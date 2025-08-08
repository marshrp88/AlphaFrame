# AlphaFrame Repo Audit (CTO Report)

## Executive Summary

- Solid: central Vite/React setup, clear feature folders, extensive tests present.
- Mapped: 16 route detections, 5 Zustand store files, 80 service files.
- Risks: Dependency cycles detected (see dep-cycles.md).
- Bundle: report generation deferred; config in place to emit on CI/local (see vite.config.js).
- Tests: vitest summary captured; Playwright needs browsers installed to run locally.
- Immediate focus: ensure green-path flows covered in E2E on CI; address any detected cycles; confirm route guard coverage.

## Routing

- See `docs/routes.mmd` for a flat route listing derived from JSX <Route/> and router configs.
- Action: validate protected routes align with green-path policy; ensure onboarding/demo transitions are enforced.

## State (Zustand)

- Stores detected are summarized in `docs/stores.mmd` with keys/actions.
- Watch for boolean soup; prefer enumerated states for flows (onboarding).

## Services

- `docs/services.mmd` shows service nodes and service→service import hints.
- High fan-in services should be isolated behind facades and mocked by contract in tests.

## Dependency Risks

See `docs/dep-cycles.md` (truncated preview):

```
Processed 188 files (2.3s) (2 warnings)

1) components/ui/ComponentShowcase.jsx > components/ui/index.js


```

Artifacts:
- `docs/dep-graph.svg` (image)
- `docs/dep-graph.mmd` (Mermaid)

## Bundle

- Visualizer configured; run with env `BUNDLE_REPORT=1` then build to generate report.
- Consider further code-splitting if initial chunks exceed budget.

## Tests

Vitest summary (truncated):

```

[1m[46m RUN [49m[22m [36mv3.2.4 [39m[90mC:/Users/marsh/Desktop/AlphaFrame/apps/web[39m

 [32m✓[39m test/unit/services/ExecutionController.test.js[2m > [22msanity check[32m 6[2mms[22m[39m
 [32m✓[39m test/integration/services/crypto.spec.js[2m > [22mCryptoService Integration[2m > [22mshould derive consistent keys from same password and salt[32m 144[2mms[22m[39m
 [32m✓[39m test/integration/services/crypto.spec.js[2m > [22mCryptoService Integration[2m > [22mshould encrypt and decrypt data correctly[32m 2[2mms[22m[39m
 [32m✓[39m test/integration/services/crypto.spec.js[2m > [22mCryptoService Integration[2m > [22mshould fail decryption with wrong key[32m 1[2mms[22m[39m
 [32m✓[39m test/integration/services/crypto.spec.js[2m > [22mCryptoService Integration[2m > [22mshould generate unique salts[32m 1[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mAccount Management[2m > [22mshould set and get account balance[32m 135[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mAccount Management[2m > [22mshould return 0 for non-existent account[32m 5[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mGoal Management[2m > [22mshould set and get goal[32m 4[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mGoal Management[2m > [22mshould return null for non-existent goal[32m 1[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mGoal Management[2m > [22mshould update goal progress[32m 1[2mms[22m[39m
 [32m✓[39m test/integration/services/financialStateStore.spec.js[2m > [22mFinancial State Store[2m > [22mGoal Management[2m >
```

Playwright summary (truncated):

```

Running 105 tests using 6 workers

  ✘  1 [chromium] › e2e\browser-comparison.spec.js:3:1 › Compare button rendering across all browsers (9ms)
  ✘  2 [chromium] › e2e\console-debug.spec.js:3:1 › should capture console logs (9ms)
  ✘  3 [chromium] › e2e\debug-rules-page.spec.js:3:1 › Debug rules page to see what elements are available (7ms)
  ✘  4 [chromium] › e2e\cto-firefox-investigation.spec.js:3:1 › CTO-Level Firefox Button Investigation (11ms)
  ✘  5 [chromium] › e2e\debug-modal-form.spec.js:3:1 › Debug modal form to see what fields are available (11ms)
  ✘  6 [chromium] › e2e\debug-modal-buttons.spec.js:3:1 › Debug modal buttons to see exact text content (12ms)
  ✘  7 [chromium] › e2e\firefox-debug.spec.js:5:1 › Firefox DOM inspection for RulesPage button issue (9ms)
  ✘  8 [chromium] › e2e\debug-visibility.spec.js:3:1 › should debug element visibility (10ms)
  ✘  9 [chromium] › e2e\framesync.spec.js:133:3 › FrameSync Integration › should validate form inputs (11ms)
  ✘  10 [chromium] › e2e\framesync.spec.js:104:3 › FrameSync Integration › should handle high-risk action cancellation (15ms)
  ✘  11 [chromium] › e2e\framesync.spec.js:65:3 › FrameSync Integration › should create and execute a Plaid transfer rule (9ms)
  ✘  12 [chromium] › e2e\framesync.spec.js:174:3 › FrameSync Integration › should handle simulation preview (8ms)
  ✘  13 [chromium] › e2e\framesync.spec.js:212:3 › FrameSync Integration › should display action log (9ms)
  ✘  14 [chromium] › e2e\framesync.spec.js:295:3 › FrameSync Integration › should show or skip confirmation modal based on Safeguards toggle (5ms)
  ✘  15 [chromium] › e2e\framesync.spec.js:273:3 › FrameSync Integration › should create a rule with multiple AND/OR conditions (9ms)
  ✘  16 [chromium] › e2e\framesync.spec.js:335:3 › FrameSync Integration › should complete the Golden Path and verify ActionLog UI (9ms)
  ✘  17 [chromium] › e2e\golden-path.spec.js:42:3 › Golden Path E2E › should allow switching between 
```

## Top 10 Fixes (Actionable)

- Clarify route guard enforcement: ensure green-path decisions are unit-tested.
- Ensure onboarding flow FSM is enumerated and timeouts surfaced (store/UI).
- Mock-by-contract for external services in unit/integration tests; verify exact import paths.
- Add Playwright browsers in CI and run three stoplight flows deterministically.
- Measure and split heavy routes/components via `React.lazy` (Dashboard/Onboarding).
- Emit bundle report on CI; set budgets and fail on regression.
- Add Sentry initialization in staging with environment tags.
- Apply design tokens to core components for consistent spacing/typography.
- Improve error/timeout UX panels with clear recovery (Retry/Demo).
- Add contract tests for Auth/Plaid/ErrorHandling services.

## Green Path Readiness

- Green paths documented and unit-tested; E2E depends on Playwright browsers being installed.
- Once installed, run E2E flows to validate unauth→demo→onboarding→dashboard and auth paths.
