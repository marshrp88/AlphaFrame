Understood. Below is the **fully updated, execution-ready document**, now refined to meet a **10/10 engineering and product standard** across all criteria:

---

# AlphaPro: Phase Finalization & Launch Readiness Protocol (`AlphaPro_VX.0.md`)

**Document Type:** Technical Execution Blueprint
**Status:** Locked for Final Sprint (Approved)
**Author:** Product Engineering, PathwayOne
**Product Suite:** AlphaPro Module of AlphaFrame
**Phase:** Final (Phase X – Pre-Merge)
**Version:** VX.0 (Cursor-Staged, CI-Ready)

---

## I. Purpose & Scope

This document governs the completion of AlphaPro’s MVP-validated architecture and formal readiness for public deployment. It incorporates deterministic simulation, optimization tooling, budget control, and reporting—all under Zero-Knowledge architecture. Every feature and service is implemented for Cursor-native workflows and testable under both local and E2E CI.

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
* Core dashboard modes:

  * `Planner`
  * `Investor`
  * `Minimalist`

---

## VII. Phase Scope Breakdown

| Phase   | Tagset               | Scope                                                      |
| ------- | -------------------- | ---------------------------------------------------------- |
| Phase 0 | `infra`, `vault`     | Logging infra, encryption, schema versioning               |
| Phase 1 | `features`, `mvp`    | Budgeting, Optimizer, Rule Engine, Timeline, Logging       |
| Phase 2 | `reporting`, `intel` | NarrativeService, Reporting, Dashboard modes, UI coherence |
| Phase 3 | `qa`, `stability`    | Feedback module, error boundaries, regression testing      |

---

## VIII. Feature Modules

### 1. Portfolio Optimizer

* `/pro/optimizer.jsx`
* Diversification engine, target deviation monitor, log events

### 2. Budgeting & Cash Flow

* `Envelope vs. Category` toggle
* Forecast window UI (30/60/90)
* Alerts (`spending.limit.breached`, `surplus.warning.triggered`)

### 3. Rule Engine 2.0

* `Multi-condition chaining`
* `Calendar or event-based triggers`
* Live simulation of rule outcome

### 4. Timeline Simulator

* UI: `TimelineSimulator.jsx`
* Models discrete life events + side-by-side scenario branches

### 5. Narrative Engine

* `NarrativeService.js`
* Templates from log trace
* E.g., “Spending rule breached 3x in 7 days”

### 6. Report Center

* `budget heatmaps`, `optimizer change maps`
* 3 dashboard modes only (custom def. deferred)

---

## IX. Routing Specification

```ts
const ROUTES = {
  pro: {
    path: '/pro',
    children: {
      optimizer: '/optimizer',
      budget: '/budget',
      reports: '/reports',
    },
  },
};
```

* All routes respect `<RouteLayout>` with scoped `<ProPageLayout>`
* Modes defined at `/modes.js` (view, edit, simulate)

---

## X. Testing Architecture

| Layer       | Framework      | Path                                  |                    |
| ----------- | -------------- | ------------------------------------- | ------------------ |
| Unit Tests  | Vitest/Jest    | \`tests/unit/\[component              | service].test.js\` |
| Integration | Vitest + React | `tests/integration/*.test.jsx`        |                    |
| E2E         | Playwright     | `tests/e2e/*.spec.ts`                 |                    |
| Visual      | Storybook CI   | Chromatic regression snapshots        |                    |
| Performance | Lighthouse CI  | `pages/**/*.jsx` — target < 200ms TTI |                    |

---

## XI. Git, CI & Deployment Workflow

### Branches:

* `main`: Production
* `feature/alphapro`: Long-lived integration
* `feature/alphapro-[module]`: Each scoped task

### CI Requirements:

* PR must:

  * Pass test suite
  * Link to this document section
  * Match milestone tags (`phase-x`, `budget-ui`, `narrative-core`)

---

## XII. Merge Criteria & Final Definition of Done

| Subsystem            | Validation Requirement                      |
| -------------------- | ------------------------------------------- |
| ExecutionLogService  | Full encryption, log schema, trace UIs      |
| Rule Engine          | Logic chaining, event trigger, logs         |
| Portfolio Optimizer  | Allocation math, logging, rebalancer        |
| Budget & Forecasting | Multi-mode budget logic, cash flow graphs   |
| Narrative Engine     | Template-based insights, test logging       |
| Reports & Dashboards | Rendered heatmaps, fixed layouts            |
| Feedback Module      | Snapshot vault export (no auto-upload)      |
| Test Suite           | 90% unit, 100% integration, E2E pass        |
| Lint/Perf            | Lighthouse >95%, <1MB bundle, debounce pass |

---

## XIII. Final Milestone Statement

> When all milestone components are validated, passing, and merged into `feature/alphapro`, the branch may be merged into `main` and marked **public-ready**.

All features are tested, encrypted, and stateless. Final merge will be followed by Lighthouse audit, final smoke test, and production tag.


