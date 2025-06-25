# Phase X: The "Clarity & Confidence" Sprint — Institutional Plan V1.3
====================================================================

### AlphaFrame Vision-Aligned UX & Product Hardening Framework

Document Version: 1.3 (Company-Sanctioned Directive)
Status: Executive-Locked | Execution-Ready
Lead Departments: Product, Design, Engineering
Duration: 6 Weeks (Post-VX.1 Feature Freeze)
Audience: Internal Engineering, Product Team, Stakeholders

## 1. ✦ Strategic Directive: From Complexity to Confidence
-------------------------------------------------------

AlphaFrame has matured into a technically sophisticated infrastructure for rule-based financial clarity. However, its true differentiation lies in the emotional and experiential clarity it offers users seeking control over complexity.

Phase X is not about adding features — it's about making what exists feel intentional, powerful, and frictionless.

### Transformation Path:

From → To

Functional Prototype → Intuitive Product
Engineering-Centric → User-Centric
Cognitive Friction → Emotional Confidence
Hidden Power → Visible Value

## 2. ✅ Success Metrics — Confidence Made Measurable
-------------------------------------------------

All metrics below are tied directly to real-world product experience rather than just system functionality.

| Goal | Target Threshold |
|------|------------------|
| 🧭 Onboarding Completion Rate | > 90% |
| ⚙ First Feature Activation (Rules/Simulations) | > 75% |
| 📈 Weekly Active Users (WAU) | > 65% |
| 💬 Customer Satisfaction (CSAT) | > 90% |
| 🧠 UX Cognitive Load Reduction | ≥ 50% improvement via testing |

## 3. 🧭 Sprint Framework Overview (6 Weeks Total)
-----------------------------------------------

Each sprint is modular, test-driven, and aligns with productization, investor readiness, and design excellence.

### Sprint 1 (Weeks 1–2): System-Wide Design Consistency

**Objective**: Convert every view to centralized token-based styling and eliminate legacy CSS and inconsistencies.

#### Implementation Tasks:

- `/src/styles/design-tokens.css`:
  - Tokens: `--color-primary`, `--spacing-md`, `--font-size-lg`, `--radius-sm`, `--shadow-elevated`
- Base component refactor:
  - `CompositeCard.jsx`, `InputField.jsx`, `PrimaryButton.jsx`, etc.
- View refactoring:
  - `MainDashboard.jsx`, `RuleEditor.jsx`, `SimulationRunner.jsx` → composite component usage only

#### QA Requirements:

- `tests/ui/DesignSystem.spec.js`: Pass rate ≥ 95%
- Zero inline styles or legacy class strings
- PR includes component snapshot verification

### Sprint 2 (Week 3): First Value Onboarding Flow

**Objective**: Transform onboarding into a narrative arc that delivers user self-efficacy within 3 steps.

#### Implementation Tasks:

- `OnboardingFlow.jsx` → Modular steps:
  - Step 1: Welcome & Positioning
  - Step 2: Account Connection (Plaid)
  - Step 3: Rule Template Initiation
  - Step 4: Simulation Preview
- Analytics:
  - `ExecutionLogService.logEvent('onboarding_complete')`
- UX Copy overhaul via `copy/strings.json`

#### QA Requirements:

- `e2e/onboarding.spec.js`: Fully passing
- ≥ 90% onboarding success in pilot testing
- First rule created in under 3 mins by >80% testers

### Sprint 3 (Weeks 4–5): Narrative Dashboard & Intelligent Action Layer

**Objective**: Convert the dashboard into an interactive financial cockpit that predicts and guides the user.

#### Implementation Tasks:

- `MainDashboard.jsx` → Grid layout w/ canonical styling
- Smart widgets:
  - `NetWorthWidget.jsx`
  - `RecentActionsWidget.jsx`
  - `CashflowForecastWidget.jsx`
- `WhatsNext.jsx`:
  - Fetches from `UserStatusService.js`
  - Suggests actions via engagement logic

#### QA Requirements:

- 75% of users identify "next step" within 5 seconds
- `tests/dashboard/WhatsNext.spec.js` → ≥ 95% test coverage
- Widget loading time < 400ms

### Sprint 4 (Week 6): Interaction Polish & Micro-Delight Layer

**Objective**: Establish subtle motion, tactile feedback, and UI responsiveness that create visceral trust.

#### Implementation Tasks:

- `framer-motion` installed and configured
- UX Animations:
  - Page transitions: fade/slide
  - Confirmation checkmarks: pulse/fadeIn
  - Toast system enhancements
- Optional:
  - Sound feedback on rule success (`/assets/sfx/success.wav`)

#### QA Requirements:

- Animation latency < 300ms
- Manual QA: 9/10 perceived responsiveness rating
- `e2e/animations.spec.js` passes consistently

## 4. 🧠 Copy, Tone & UX Language System
-------------------------------------

**Voice Principles**:

- Empowering, not instructional
- Clear and exact, no jargon or metaphors
- Intelligent, respects user agency

**Implementation Path**:

- All key UX copy extracted to `copy/strings.json`
- Passes static grammar and tone analysis tools
- Translatable, future i18n-compatible

## 5. 🔐 Git Protocol, QA Enforcement & Final Gatekeeping
------------------------------------------------------

| Rule | Implementation |
|------|----------------|
| Branch Prefix | `feature/phase-x-*` |
| Test Threshold | Unit ≥ 95%, E2E ≥ 90% |
| CI Gates | `pnpm lint`, `pnpm test:unit`, `pnpm test:e2e` |
| PR Approval | Dual: Engineering + Product |
| Merge Script | `scripts/verify-phase-x-readiness.sh` |

## 6. ⚡ Cursor-Native Execution Prompts
------------------------------------

| Sprint | Prompt |
|--------|--------|
| Sprint 1 | `"Convert all views to use token-based design system, eliminate inline CSS, begin with CompositeCard.jsx and MainDashboard.jsx"` |
| Sprint 2 | `"Build OnboardingFlow.jsx with 4 steps: Welcome, Connect Account, Create Rule, Run Simulation — integrate analytics logging"` |
| Sprint 3 | `"Refactor MainDashboard.jsx into grid layout and build insight widgets (NetWorth, RecentActions, CashflowForecast), and WhatsNext.jsx recommender"` |
| Sprint 4 | `"Add page transitions and interaction animations using framer-motion. Polish visual feedback for rule success, onboarding completion, and button actions."` |

## 7. 🏁 Final Validation & Release Readiness
------------------------------------------

| Validation Criteria | Status |
|-------------------|--------|
| All DoD Items Completed | ☐ |
| All Tests Passing (CI) | ☐ |
| UX QA Signoff (Design) | ☐ |
| Copy/Tone Finalized | ☐ |
| Ready for Stakeholder Demo | ☐ |

## 8. 🧭 Optional Innovation Threads for Phase Y
---------------------------------------------

- Simulation Timeline Mode (w/ scrollable replay)
- Mobile Viewport & Responsive Layout System
- AI Copilot for Rule Recommendations
- Stakeholder Mode (Shared Rulebooks / Templates)

---

### End of Phase X Institutional Plan – V1.3

This is the final productization directive for bringing AlphaFrame from powerful prototype to production-ready platform. No scope creep or architecture changes are permitted without CTO-level signoff. 