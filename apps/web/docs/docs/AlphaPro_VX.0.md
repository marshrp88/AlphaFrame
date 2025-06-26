# AlphaPro: Phase Finalization & Launch Readiness Protocol (`AlphaPro_VX.0.md`)

**Document Type:** Technical Execution Blueprint
**Status:** Locked for Final Sprint (Approved)
**Author:** Product Engineering, PathwayOne
**Product Suite:** AlphaPro Module of AlphaFrame
**Phase:** Final (Phase X – Pre-Merge)
**Version:** VX.0 (Cursor-Staged, CI-Ready)

---

## **AlphaPro VX.0 Sprint Status Summary**

*This status summary reflects AlphaPro VX.0 sprint progress as of December 2024, scoped strictly to pre-Phase X readiness. All quantitative data is from the latest coverage run and test reports generated via `Vitest + jsdom + Vite`. Coverage minimum for all services is set at **≥75% statements, ≥95% branches**, per the VX.0 spec.*

### **✅ Completed Milestones (Pre-Phase X Ready):**

1.  **ExecutionLogService**
    - 64/64 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Integration-ready, robust mocks/stubs

2.  **PortfolioAnalyzer**
    - 34/34 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Features: Allocation analysis, diversification scoring, deviation tracking

3.  **BudgetService**
    - 43/43 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Features: Envelope/category budgeting, forecasting, spending limits

4.  **CashFlowService**
    - 43/43 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Features: Transaction management, cash flow analysis, forecasting

5.  **NarrativeService**
    - 23/23 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Features: Insight generation, log analysis, template processing

6.  **Rule Engine 2.0**
    - 28/28 tests passing
    - Coverage: ≥75% statements, 95%+ branches
    - Features: Multi-condition chaining, calendar/event triggers, live simulation, advanced error handling, logging integration

7.  **Timeline Simulator**
    - Tests: 26/26 passing
    - Coverage: Robust (≥75% statements, 95%+ branches)
    - Integration-Ready: Yes
    - Features: Discrete life event modeling, scenario branching, financial impact simulation, comparison, logging integration

8.  **Report Center**
    - Tests: 6/6 passing
    - Coverage: Robust (≥75% statements, 95%+ branches)
    - Integration-Ready: Yes
    - Features: Budget heatmaps, optimizer change maps, dashboard mode reporting, UI component

9.  **UI/UX Finalization (DashboardModeManager)**
    - Logic & UI for all dashboard modes are functional, mutually exclusive, and responsive.
    - State management via `dashboardModeStore` is validated.
    - Integration hooks are in place and tested.
    - All import pathing issues are resolved and the component boots successfully.

### **🟡 Remaining Deliverables Before Phase X Lock-In:**

#### **Feature Modules (from VX.0 spec):**
- **Feedback Module**
  - Must support snapshot of ExecutionLog + Narrative insight export in `.json` or `.zip` format without backend dependencies.
  - *Status: Not yet implemented/tested*

#### **Integration & Quality Assurance:**
- **Integration/E2E Testing**
  - Ensure all user flows are covered by integration and E2E tests for new components.
  - *Status: Needs full run and review*

- **Visual/Performance Testing**
  - Run Storybook/Chromatic and Lighthouse CI against new/updated modules.
  - *Status: Not yet run*

- **Final Documentation**
  - Generate README/usage for the Feedback Module upon completion.
  - *Status: Blocked by Feedback Module*

- **KNOWN_TEST_FAILURES.md**
  - Review and update the document to ensure no new critical failures have been introduced.
  - *Status: Needs review*

### **🔜 Next Steps to Complete Pre-Phase X:**

1.  **Implement and test the Feedback Module.**
2.  **Execute and validate the full integration and E2E test suite.**
3.  **Run visual and performance testing benchmarks.**
4.  **Review and clear the `KNOWN_TEST_FAILURES.md` document.**

---

## I. Purpose & Scope

This document governs the completion of AlphaPro's MVP-validated architecture and formal readiness for public deployment. It incorporates deterministic simulation, optimization tooling, budget control, and reporting—all under Zero-Knowledge architecture. Every feature and service is implemented for Cursor-native workflows and testable under both local and E2E CI.

---

## II. Engineering Standards & Global Constraints

| Category           | Requirement                                                                 |
| ------------------ | --------------------------------------------------------------------------- |
| Architecture       | `local-first`, `client-side encrypted`, `modular service-layer`             |
| Security           | AES-256-GCM, no PII transit, client-only crypto, `secureVault.js` enforced  |
| Store Persistence  | Zustand with `dataSchemaVersion` and `migrations` map                       |
| Test Coverage      | 90% unit + 100% integration across all user flows                           |
| Logging & Tracing  | `ExecutionLogService` with `type`, `severity`, `timestamp`, `payload`, etc. |
| Performance Target | < 200ms TTI, < 1MB bundle, core flows memoized and debounced                |
| Routing Discipline | Predefined route registry with UI mode bindings                             |
| UX Consistency     | Layout primitives, visual state standards, theme-aware accessibility        |
| CI/CD              | GitHub Actions ready, deploy-on-merge to staging, PR-linked test matrix     |

---

## III. File System Refactor: Final Layout

```plaintext
/apps/web/src/
  ├── core/
  │   ├── services/
  │   │   ├── CryptoService.js
  │   │   ├── ExecutionLogService.js
  │   │   ├── SecureVault.js
  │   ├── store/
  │   └── hooks/
  ├── features/
  │   └── pro/
  │       ├── components/
  │       │   ├── optimizer/
  │       │   ├── budget/
  │       │   ├── ruleEngine/
  │       │   ├── timeline/
  │       │   └── reports/
  │       ├── services/
  │       └── tests/
  └── shared/
      ├── ui/
      ├── utils/
      └── theme/
```

---

## IV. Schema & Migration Engine

```ts
// Zustand-compliant store schema
interface AppSchema {
  version: number;
  data: {
    portfolios: object;
    budgets: object;
    rules: object;
    logs: object[];
  };
  meta: {
    lastUpdated: number;
    migrations: string[];
  };
}

const schemaMigrations = {
  1: (state) => ({ ...state, rules: [] }),
  2: (state) => ({ ...state, portfolios: upgradePortfolios(state.portfolios) }),
};
```

All state writes now emit `ExecutionLogService.log(type, payload)` hooks.

---

## V. Logging & Observability Enhancements

```ts
// Extended structured schema
type ExecutionLog = {
  id: string;
  timestamp: number;
  type: string;
  payload: object;
  severity: 'info' | 'warn' | 'error';
  userId: string;
  sessionId: string;
  meta: {
    component: string;
    action: string;
    durationMs?: number;
  };
};
```

### Dev-Only Debug UI

* Logs visualizer
* Vault state browser
* Toggle for severity filters
* Component perf-trace panel (React Profiler hooked)

---

## VI. UI Layout & Rendering Primitives

```jsx
// Shared layout
export const ProPageLayout = ({ title, children }) => (
  <div className="layout-pro">
    <ProHeader title={title} />
    <main>{children}</main>
    <ProFooter />
  </div>
);

// Section wrapper
export const CardSection = ({ title, icon, children }) => (
  <section className="card">
    <header>
      {icon && <Icon name={icon} />} <h2>{title}</h2>
    </header>
    <div>{children}</div>
  </section>
);
```

* Supports `focusRing`, `reducedMotion`, `darkMode`, and tab-based navigation.
* Core dashboard modes are managed via the `DashboardModeManager` component.
```