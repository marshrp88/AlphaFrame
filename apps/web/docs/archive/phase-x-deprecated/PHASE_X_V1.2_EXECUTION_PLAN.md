# Phase X: "Clarity & Confidence" Sprint V1.2  
===========================================  
**Document Version**: 1.2 (Developer-Facing, Vision-Aligned)  
**Lead**: Engineering & Product Design  
**Status**: Execution-Ready  

---

## 0. Purpose of V1.2  
Phase X V1.2 realigns execution with the **AlphaFrame vision of clarity, control, and fluid intelligence**. This sprint bridges MVP maturity with product-market polish, emphasizing:

- **Vision-consistent design** and system expressiveness  
- **Improved service layer modularity** and traceability  
- **Cursor-native parallel development clarity**  
- **Deployment-readiness with user trust affordances**  
- **UX and logic transparency** to reinforce end-user confidence  

---

## 1. Executive Summary: Dev Objectives  
This sprint operationalizes AlphaFrame's promise of proactive financial clarity by:

- Enforcing atomic design principles and visual grammar  
- Orchestrating declarative UI logic flows  
- Strengthening backend/UI feedback contracts  
- Elevating motion and visual feedback as cognition enhancers  
- Ensuring onboarding and dashboards reflect financial agency and simplicity  

---

## 2. Sprint Overview (Cursor-Native)  

| Sprint | Scope                         | Duration | Anchor File(s)                         | Prompt Summary                                              |
|--------|-------------------------------|----------|----------------------------------------|-------------------------------------------------------------|
| 1      | Design System Canonization    | 2 Weeks  | `design-tokens.css`, `Card.module.css` | "Establish visual grammar and atomic token enforcement"     |
| 2      | Onboarding with Context Hooks | 1 Week   | `OnboardingFlow.jsx`                   | "Onboard with adaptive guidance based on user readiness"    |
| 3      | Financial Narrative Dashboard | 2 Weeks  | `MainDashboard.jsx`, `WhatsNext.jsx`   | "Drive confident action with dynamic recommendations"       |
| 4      | Motion, Tactility & Trust     | 1 Week   | `FramerMotion`, `UXFeedback.jsx`       | "Polish interactions to express trust and responsiveness"   |

---

## 3. Task Blocks by Sprint  

### Sprint 1: Canonical Design System  
**Objective**: Solidify visual consistency and reusable component grammar.

#### 🔧 Implementation  
- Create `design-tokens.css`:  
  - `--color-surface`, `--elevation-2`, `--radius-md`, `--font-utility-sm`
- Refactor `Card`, `Button`, `Input`, `Switch`, `Toast` components  
- Enforce use of only atomic UI building blocks in main views  
- Apply `eslint-plugin-tailwindcss` or token linter to enforce style hygiene  

#### ✅ Done Criteria  
- 100% of views using only tokenized, modular components  
- No inline styles or custom CSS beyond token-compliant files  
- `tests/ui/design.spec.ts`: ≥95% pass  

---

### Sprint 2: Onboarding 2.0 with Context  
**Objective**: Deliver a modular, confidence-building onboarding flow.

#### 🔧 Implementation  
- Component: `OnboardingFlow.jsx`  
  - `Step1_Welcome.jsx`  
  - `Step2_ConnectAccount.jsx`  
  - `Step3_SetGoal.jsx`  
  - `Step4_FirstRule.jsx`  
- Track onboarding intent via `useUserContext()`  
- Pre-fill smart defaults based on context (e.g. "build emergency fund" if no savings)  
- Hook into `ExecutionLogService` for step-level tracking  

#### ✅ Done Criteria  
- E2E coverage in `onboarding.spec.ts`  
- ≥90% completion in test flows  
- All steps log state accurately with analytics  

---

### Sprint 3: Financial Narrative Dashboard  
**Objective**: Surface actionable clarity, not static reporting.

#### 🔧 Implementation  
- Component: `MainDashboard.jsx`  
  - Sections: `Cashflow`, `SimulationInsights`, `NetWorthTrajectory`, `RecentChanges`, `ActionQueue`  
- `WhatsNext.jsx`:  
  - Driven by `UserContext` + `RecommendationEngine`  
- Context-aware tiles with animated progress indicators  
- Declarative structure driven by `DashboardConfig.js`  

#### ✅ Done Criteria  
- E2E: `dashboard/insights.spec.ts`  
- ≥95% of users identify primary call-to-action in under 4s (QA test)  
- All widget states covered in test matrix  

---

### Sprint 4: Motion & UX Feedback Layer  
**Objective**: Create micro-interactions and transitions that support cognition.

#### 🔧 Implementation  
- Install `framer-motion` and define `animationPresets.js`  
- Add to:
  - Page transitions (dashboard ↔ onboarding)  
  - Button presses (`onSuccessPulse`, `onErrorShake`)  
  - Widget mounts (`fadeIn`, `slideIn`)  
- Add auditory cues (toggle-on sound, rule-created chime)  

#### ✅ Done Criteria  
- `animations.spec.ts`: 100% passing  
- Manual QA of latency (<300ms)  
- All critical interactions provide visual or auditory feedback  

---

## 4. Git Hygiene & Test Protocol  

### Git  
- Branch: `feature/phase-x-v1.2`  
- PRs only merged with:
  - ✅ Unit + E2E passing  
  - ✅ Code review by Engineering & Design  

### Testing Matrix  

| Type           | Target               |
|----------------|----------------------|
| Unit Tests     | ≥95% all new logic   |
| Component Tests| All visible UI units |
| E2E Tests      | Onboarding, Dashboard, UX Feedback |
| CI Pipeline    | `pnpm lint`, `pnpm test`, `pnpm test:e2e` |

---

## 5. Modular Dev Protocols (Cursor)  

### ✅ Isolation Rule  
- All novel logic → `feature/x-logic-layer-name`  
- Testable via mocks in isolation  
- No UI-logic coupling unless via shared contract  

### 🧪 Prototyping  
- `__sandbox__/`:  
  - Rule visualizer mock  
  - Goal timeline / milestone map  
  - Experimental tiles (e.g. pie chart budget dial)  

---

## 6. Phase Finalization Criteria  

| Criteria                              | Validation Method                 |
|--------------------------------------|----------------------------------|
| All DoDs met                         | Checklist signed by QA           |
| 100% CI Test Pass                    | CI logs attached to release tag  |
| Design & PM sign-off                 | UX review logs                   |
| Static analysis & no legacy styles  | `pnpm lint && pnpm run analyze`  |
| Feature-flagged experiments isolated | GitOps diff checks               |

---

## 7. Phase Y Preview  

| Track                    | Goal                                              |
|--------------------------|---------------------------------------------------|
| AI Copilot System        | Contextual nudges, budget rules, alert generation|
| Timeline Mode            | Scrollable timeline of past actions + results    |
| Responsive Mobile Mode   | Adaptive UI for touch and mobile-first designs   |
| Simulation Playback UX   | Audio-guided scenario replays with branching logs|

---

## 8. Final V1.2 Enhancements (Optional but Advised)  

- **Developer Init Script**  
  - `pnpm run setup` → installs deps, lints, seeds mock state  
- **Interface Contract Enforcement**  
  - Use `zod`, `PropTypes`, or TS interfaces in shared logic  
- **Performance Budgeting**  
  - Targets:
    - Dashboard TTI <500ms  
    - Widget render latency <300ms  
    - Key API latency <400ms  

---

### 📌 End of Developer Execution Plan — Phase X v1.2 