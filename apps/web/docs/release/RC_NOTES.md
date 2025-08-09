# v2.2.0-rc1 Release Notes

Date: 2025-08-09

## Highlights
- Onboarding stabilized with FSM and 10s timeout; visible recovery (Retry / Use Demo)
- Centralized route guard; predictable navigation (home/onboarding/dashboard)
- Unbreakable Demo path with seeded data; deterministic test flags
- Tests: unit + stoplight E2E + accessibility (axe) all green across Chromium/Firefox/WebKit
- Performance: bundle budgets enforced in CI (entry ~1.0 MB, vendor ~262 KB minified; gz ~276 KB entry)
- Security & compliance: CSP/HSTS/Referrer/XCTO/XFO headers; Terms/Privacy/Cookies/Accessibility pages
- Consent: privacy-first analytics (Plausible) gated by consent banner; minimal Web Vitals logging

## Known Issues / Follow-ups
- Final counsel-approved legal copy to replace scaffolds
- Visual baselines exist; CI gating optional via VISUAL_BASELINE=1

## Demo Script (90s)
1. Landing → select Demo → Onboarding completes (or show Retry/Use Demo banner)
2. Redirect to Dashboard → show insights, cash flow card, latest trigger
3. Toggle demo banner actions (connect real, toggle mode, dismiss); show consent banner behavior
4. Footer legal links (Terms/Privacy/Cookies/Accessibility)

## Test & Build Artifacts
- Playwright reports (E2E + a11y)
- Bundle check: `docs/bundle/size-check.txt` (CI uploads)
- Dependency graphs and repo audit docs

## Changelog (selected)
- `src/store/modular/onboardingStore.js`: FSM with actions + timeout
- `src/utils/RouteGuard.jsx`: centralized guard decisions
- `src/features/onboarding/OnboardingFlow.jsx` + `steps/Step1PlaidConnect.jsx`: demo fallback + banner
- `e2e/stoplight-flows.spec.js`: three green-path flows
- `e2e/a11y-axe.spec.js`: accessibility smoke across browsers
- `public/_headers`: CSP, HSTS, Referrer-Policy, X-Content-Type-Options, X-Frame-Options
- `src/pages/legal/*`: counsel-ready scaffolds
- `scripts/check-bundle-size.js`: ESM; budgets enforced in CI

## How to Tag
- Ensure CI green on `showcase/phase-x-demo-ready`
- Tag and push:
  - `git tag v2.2.0-rc1`
  - `git push origin v2.2.0-rc1`
