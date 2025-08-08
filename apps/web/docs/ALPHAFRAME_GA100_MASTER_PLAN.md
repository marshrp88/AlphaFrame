# AlphaFrame GA100 Master Plan (30-Day Consumer-Ready Acceleration)

Memorable codename: "GA100 — The Day We Locked Quality"

Date: <set on commit>

---

## Purpose (10th‑grade friendly)

This plan helps us launch AlphaFrame to real users. It makes the app beautiful, easy to use, fast, and safe. We will ship in small steps (PRs) that are tested, so we don’t break things.

## TL;DR (What we will achieve)

- Smooth and reliable app flows (tests prove it)
- Looks great and feels modern on phone and desktop
- Works with keyboard and screen readers (accessibility)
- Loads fast (performance budgets)
- No fragile code loops (no dependency cycles)
- Demo mode always works and remembers your state
- Legal, privacy, and security are covered
- Monitoring, rollback, and release checklist are in place

## Non‑Functional Budgets (Ship Gates)

- E2E: 3 green‑path flows must pass 3× in CI, flake ≤ 1%
- Performance: LCP ≤ 2.5s p75, INP ≤ 200ms p75, main chunk ≤ 350–400 KB gzip, total JS ≤ 2 MB gzip
- Accessibility: 0 critical/high axe issues; full keyboard‑only pass
- Stability: 0 dependency cycles; all unit tests passing on PR
- Compliance: Terms, Privacy, Cookie, Accessibility pages live; security headers configured

## Day‑0 Prerequisites (Before Day 1)

- Playwright browsers installed locally and in CI
- Staging environment ready (domain + SSL); hosting picked (Vercel/Netlify/Cloudflare)
- Redacted env templates committed: `.env.dev.example`, `.env.staging.example`, `.env.prod.example`
- Decide live Plaid (in or out for v1). Default: sandbox/demo only
- Lock device/browser matrix: iPhone + Pixel + iPad; Chromium + Firefox + WebKit
- Approve minimal visual baseline: tokens → specimen screenshots for buttons, inputs, cards, banners, modals

## Execution Plan (30 Days)

### Week 1 — Foundations & Stability

1) Playwright E2E enablement (CI‑gated)
- Stabilize `stoplight-flows.spec.js` with `page.addInitScript` and explicit waits; serve static build
- Accept: All 3 flows pass locally/CI ×3; flake ≤ 1%

2) Demo mode persistence & invariants
- Persist demo/auth/onboarding with Zustand `persist`
- Enforce guard: no `/dashboard` until FSM === 'done'
- Accept: Reload preserves flags; guard truth table unit‑tested

3) Dependency cycle removal
- Refactor per `apps/web/docs/dep-cycles.md`; move shared constants; ensure services never import UI
- Accept: Cycle report = 0; build/test green

4) Responsive/mobile pass 1
- Define 3 breakpoints; fix wrap, tap targets ≥ 44px, viewport meta
- Accept: iPhone/Pixel/iPad/desktop smoke passes; no horizontal scroll

### Week 2 — Accessibility & UX Consistency

5) WCAG 2.1 AA sweep
- Add roles/labels/focus traps; fix color contrast via tokens; `aria-live` for error/timeout
- Accept: axe 0 critical/high; keyboard‑only flows pass

6) Unified error/timeout banner
- New `OnboardingStatusBanner.jsx`; standard copy/actions (Retry, Use Demo)
- Accept: Identical banner across states; focus lands on banner; ARIA OK

7) Design‑led polish sprint (tokens‑first)
- `UX_AUDIT.md` mapping tokens → components; normalize buttons/cards/modals; remove ad‑hoc fonts/colors
- Accept: Specimen page matches token spec; screenshots approved

### Week 3 — Performance & Resilience

8) Performance budgets & slimming
- `React.lazy` heavy planners; tune `manualChunks`; drop unused deps
- Accept: Main chunk ≤ 350–400 KB gzip; CI bundle gate passes

9) Workerize heavy simulations (as needed)
- Move Monte Carlo/long loops to a Web Worker with postMessage bridge
- Accept: Lighthouse long tasks < 50 ms on dashboard; UI responsive

10) Microcopy pass (clarity)
- Grade‑8 rewrite of onboarding, banners, and key dashboard texts
- Accept: Readability check; user feedback “clear/confident”

### Week 4 — Security, Ops, and Final QA

11) Security/privacy/legal
- Audit `CryptoService`, Plaid token handling; ensure no PII in logs
- Add Terms, Privacy, Cookie, Accessibility pages; link in footer/onboarding
- Configure CSP, HSTS, X‑Content‑Type‑Options, Referrer‑Policy headers (hosting config)
- SBOM and dependency update gate (`pnpm audit`/Dependabot)
- Accept: Security checklist passes; pages live; headers verified

12) Observability & rollback
- Flag‑gated Sentry (staging first), synthetic green‑path checks (Playwright cron)
- Rollback runbook; keep last N builds; schedule rollback rehearsal
- Accept: Alerts working; rollback tested once

13) Visual regression baseline
- Playwright screenshot tests for 5 key screens using approved specimen
- Accept: Baselines stable ×3 CI runs

14) Bug triage workflow
- `bug-triage.md` + GitHub issue template; severity matrix with 24h SLA for P0
- Accept: New bugs labeled/prioritized consistently

15) RC checklist & docs
- `RC_CHECKLIST.md` with all GA gates; `changelog.md` per PR; E2E playbook; updated architecture brief
- Accept: Cannot tag RC unless all gates pass

## Operational Tracks (Parallel)

- Compliance: GDPR/CCPA consent; DPIA; risk language review; data retention & deletion policy (DSAR workflow)
- Infrastructure: Hosting/CDN, DNS/SSL, caching, immutable assets, versioned releases
- Monitoring: Uptime (synthetic), Web Vitals dashboards, Lighthouse CI on key routes
- Support: In‑app Help panel → Quickstart/Support; incident runbook and ownership

## Device/Browser Test Matrix

- Devices: iPhone (Safari), Pixel (Chrome), iPad (Safari), Desktop (Chrome/Firefox)
- Browsers: Chromium, Firefox, WebKit (latest stable)

## Security & Headers (Quick Spec)

- CSP: default‑src 'self'; script‑src 'self' 'unsafe-inline' https://*.pla.id; connect‑src 'self' https://*.firebaseio.com https://*.googleapis.com; img/media/font/frame restricted as needed
- HSTS: max‑age=31536000; includeSubDomains; preload (if apex supports)
- Referrer‑Policy: strict‑origin‑when‑cross‑origin
- X‑Content‑Type‑Options: nosniff; X‑Frame‑Options: DENY

## RC Gate — No Exceptions

- E2E stoplight flows green 3× on CI
- Budgets: perf/a11y enforced by CI; zero cycles; demo invariants proven
- Legal/security pages live; headers validated; rollback rehearsed

## PR Policy

- Atomic (< ~300 LOC when possible); test‑backed (unit/E2E)
- CI must be green; budgets enforced; update `apps/web/docs/changelog.md`
- Visual baselines updated only on approved design deltas

## Cursor Execution Preface (to run this plan)

Paste the following at the top of Cursor when executing:

"""
Controller Preface for Cursor / GPT‑5
- Workspace root: apps/web (monorepo present; keep edits inside apps/web unless specified)
- Branch: stay on showcase/phase-x-demo-ready; never merge to main
- Language & stack: React 18, Vite, JavaScript only, Zustand, React Router 6, Vitest, Playwright
- Guardrails: Before edits, print a diff plan; after edits, run smallest relevant checks (build/unit/E2E)
- Gates: PRs must pass unit + E2E; enforce budgets (perf/a11y) and zero cycles
- UX: Provide visible error/timeout UI with accessible banners; keyboard navigation required
- Performance: Code‑split heavy routes; workerize long‑running sims if needed
- Docs: Update apps/web/docs/changelog.md each PR; keep RC_CHECKLIST current
- Execution: Follow GA100 Master Plan tasks week‑by‑week; stop on failures and propose fixes
"""

## Procedure (10th‑grade friendly)

1) We improve one small part at a time and test it (so it’s safe to merge)
2) We keep designs and words simple and consistent (so users feel confident)
3) We measure speed and quality, and we only ship when the numbers are good
4) We prepare for problems (monitoring and rollback), so users are not hurt if something breaks

## Conclusion (10th‑grade friendly)

If we follow this plan, AlphaFrame will be smooth, clear, fast, and reliable. Each step is small and tested. At the end, we press “release candidate” only if every check is green.


