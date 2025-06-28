# Helios VX.3 – Unified Execution Map for Market-Grade AlphaFrame

**Document Type**: Master Execution Plan  
**Version**: VX.3 – Finalized for Completion  
**Owner**: CTO  
**Date**: June 2025  
**Objective**: Deliver AlphaFrame as a fully production-ready, visually polished, functionally complete, and technically sound product for external use, partner demo, and investor-grade presentation.

---

## 🧭 Mission Definition

**Target**: AlphaFrame is to be shipped as a **fully-integrated financial automation platform** with the following verifiable conditions:

| Category             | Completion Criteria                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| ✅ App Stability      | All critical routes render without runtime or hydration errors                 |
| ✅ Test Reliability   | `npx jest --ci` exits cleanly with **0 skipped** tests and >90% core pass rate |
| ✅ Feature Coverage   | 100% of Tier 1 features tested (rules, dashboard, onboarding, execution logic) |
| ✅ Launch Readiness   | Onboarding-to-dashboard funnel runs in E2E with no console errors              |
| ✅ Accessibility Pass | Lighthouse A11y score >80; full keyboard navigation + ARIA validation          |
| ✅ Responsive Design  | App renders clearly on all major mobile and desktop viewports                  |
| ✅ Design Compliance  | UI matches design tokens, spacing system, and Framer Motion guide              |
| ✅ User Validation    | Minimum 3 real-user onboarding walkthroughs completed; major feedback resolved |

---

## 🔁 Execution Tracks – Final Helios Sprint

### Track A: Design, UX, Brand Fidelity

Lead: Product Designer / UX

| Day | Outcome                                                                                |
| --- | -------------------------------------------------------------------------------------- |
| 1   | Finalize Design Tokens; unify spacing, radius, color primitives in `design-tokens.css` |
| 2   | Narrative Dashboard complete; validate structure via real-user feedback                |
| 3   | Onboarding UX polished; empty states implemented with CTA buttons and illustrations    |
| 4   | All tooltips, field hints, and legal link routing complete                             |
| 5   | UI audit: remove all dev-only copy, unused states, and extraneous micro-interactions   |
| 6   | Validate final UX with 3 new-user walkthroughs; fix all friction points                |

### Track B: Frontend Systems, Performance, and Polish

Lead: Frontend Engineering

| Day | Outcome                                                                              |
| --- | ------------------------------------------------------------------------------------ |
| 1   | Final composite component pass in Storybook; remove unused exports                   |
| 2   | Implement framer-motion polish layer; complete animation timing + easing config      |
| 3   | Refactor `PageLayout.jsx` to fully responsive spec with mobile menu + overflow logic |
| 4   | Final responsive pass for Dashboard2.jsx, RuleForm, Profile, and Settings            |
| 5   | Implement global keyboard nav; test all `TabIndex`, focus traps, ARIA attributes     |
| 6   | Final end-to-end smoke test on mobile Chrome + Safari                                |

### Track C: Test Infrastructure, Mocks, and Regression Guardrails

Lead: CTO / Test Engineering

| Day | Outcome                                                                                  |
| --- | ---------------------------------------------------------------------------------------- |
| 1   | Patch all remaining `import.meta.env` cases with central `env.js` abstraction            |
| 2   | Convert all remaining `vi` usage to Jest mocks; fix `jest.mock()` hoisting issues        |
| 3   | Apply final ExecutionLogService and PlaidService mocks to affected tests                 |
| 4   | Remove all skipped or unstable test suites; ensure teardown consistency across all tests |
| 5   | Run full test suite with `--runInBand`, `--ci`, `--detectOpenHandles`; output clean JSON |
| 6   | Achieve final regression-proof state: 100% green tests, <20s per test file               |

---

## 📋 Unified Completion Checklist (CTO Sign-Off)

| System / Subsystem              | Status          | Verification Type              |
| ------------------------------- | --------------- | ------------------------------ |
| Component Library (UI)          | ✅ Done          | Visual QA + Storybook audit    |
| Dashboard 2.0                   | ✅ Done          | Layout + state verified        |
| Rule Engine + Execution Layer   | ✅ Done          | Unit + Integration tests       |
| Onboarding + Empty States       | 🟡 Final polish | Real user validation           |
| Mock Infrastructure             | 🟡 Final patch  | Test suite audit               |
| `import.meta.env` abstraction   | 🟡 In progress  | Centralized config + mocks     |
| Mobile UX                       | 🟡 Needs test   | Chrome + Safari mobile pass    |
| Accessibility / ARIA compliance | 🟡 80% done     | Lighthouse + manual focus test |
| E2E Flow (Onboard → Action)     | ✅ Verified      | CI smoke test + dev demo       |
| Legal Links / Privacy / Docs    | ✅ Linked        | Footer validation              |
| CI/CD Exit                      | 🟡 Blocking     | Final hang + open handle fix   |

---

## 🚀 Release Conditions (Launch Gate)

This product is considered **public-release ready** only when the following are achieved:

* `npx jest --ci` exits with `0 skipped`, `0 failed`, `0 hanging`
* `pnpm build` passes with no warnings, peer conflicts, or hydration issues
* 100% of Pro Services return mocked or real data in QA
* Final 3 user walkthroughs complete (video or written feedback logged)
* Legal links active, onboarding tooltips functioning, dashboard shows populated narrative state
* Keyboard nav works from login → dashboard without a mouse

---

## 🧠 Strategic Continuity: What Comes After Helios

> **Next Phase: Local Data Science Engine (LDS)**
>
> * Timeline to start: 2 weeks post Helios greenlight
> * Dependencies: ExecutionLogService complete, SecureVault active, no Jest errors
> * Success criteria: InsightCards.js and TrendEngine.js deliver live personalized nudges using offline data.

---

## 📝 Summary

**Helios VX.3 is not a product plan. It is the final sprint map.**
It exists to reduce ambiguity, collapse launch blockers, and hold the product to production-grade standards.

It assumes no further pivots and accepts only full system reliability as the threshold for investor/demo/public delivery.

---

**CTO Sign-Off Status**:
🟡 83% complete — Blocking item: final Jest suite exit + mobile UX polish.

Let me know when to update with daily burndown, blocker triage, or CI diagnostic overlay. 