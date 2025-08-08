# Green Path (Happy Path) Truth Table

Purpose: Single source of truth for allowed routes based on auth/demo/onboarding. Keep logic synced with `src/utils/RouteGuard.jsx`.

States
- isAuthenticated: true/false
- isDemo: true/false
- onboardingDone (FSM `done` or demo/test flags): true/false

Rules
- Public pages: `/`, `/home`, `/about`, `/legal/*`
- Protected pages: `/dashboard`, `/rules`, `/settings`, `/profile`, `/pro-planner`
- Onboarding: `/onboarding`

Truth table (redirects shown as =>)
- Unauth + not demo: `/dashboard` => `/`; otherwise allow only public
- Demo user:
  - onboardingDone=false: allow `/onboarding`; `/dashboard` => `/onboarding`
  - onboardingDone=true: allow `/dashboard`; `/onboarding` => `/dashboard`
- Auth user:
  - onboardingDone=false: `/dashboard` => `/onboarding`
  - onboardingDone=true: allow `/dashboard`; `/onboarding` => `/dashboard`

Testing
- Unit: `src/__tests__/routeGuard.decision.test.js`
- E2E stoplight: `e2e/stoplight-flows.spec.js` uses deterministic storage flags for demo

Notes
- Demo/test environments may bypass FSM with storage flags for deterministic tests.
- Production must gate `/dashboard` on FSM `done` unless feature-flagged for demos.


