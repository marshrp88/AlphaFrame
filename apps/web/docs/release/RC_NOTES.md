# v2.2.0-rc1 Release Notes

Highlights:
- Onboarding stabilized with FSM and 10s timeout
- Centralized route guard and unbreakable Demo path
- Deterministic E2E “stoplight” tests (3 flows)
- Unit tests green (216), E2E passing

Known Issues:
- Bundle size warnings; performance pass planned in Step 10

Demo Script (90 seconds):
1) Start on Landing → click Onboarding
2) In Step 1, click “Use Demo” (or continue) → redirect to Dashboard
3) Show an insight card; switch dashboard mode
4) Trigger the banner by simulating error, show Retry → Use Demo recovery

Changelog:
- `store/modular/onboardingStore.js`: FSM with actions and timeout
- `utils/RouteGuard.jsx`: decision helper + guard simplification
- `features/onboarding/OnboardingFlow.jsx`, `steps/Step1PlaidConnect.jsx`: demo fallback & banner
- `e2e/stoplight-flows.spec.js`: three green-path flows
