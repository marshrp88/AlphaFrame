Release Candidate Checklist (No Exceptions)

Functional
- [ ] Green-path flows pass E2E (stoplight spec) across Chromium/Firefox/WebKit
- [ ] Onboarding FSM handles timeout/error with recovery UI
- [ ] Demo mode invariant: dashboard usable without Plaid/Auth

Quality Gates
- [ ] Unit tests pass in CI
- [ ] Playwright E2E pass in CI
- [ ] Axe a11y smoke pass in CI (WCAG 2.1 A/AA critical/serious = 0)
- [ ] Bundle budget within target; report artifact uploaded

Security/Compliance
- [ ] Security headers deployed (CSP, HSTS, XFO, XCTO, Referrer-Policy)
- [ ] Legal pages live (Terms, Privacy, Cookies, Accessibility)
- [ ] Environment templates committed and scrubbed

Performance
- [ ] Code-splitting and lazy-loading for heavy routes
- [ ] Long tasks < 200ms on initial route (lab check)

Ops
- [ ] Sentry wired for staging
- [ ] Rollback procedure documented and rehearsed
- [ ] Device/browser matrix covered by smoke runs

Docs
- [ ] Changelog updated
- [ ] Green-path truth table updated
- [ ] Known issues listed

Sign-off
- [ ] Tag v2.2.0-rc1

