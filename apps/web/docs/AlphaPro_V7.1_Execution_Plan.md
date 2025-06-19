AlphaPro_V7.1_Execution_Plan.md
===============================

Final Engineering Plan for MVP-Pro Execution in Cursor

🧭 Phase Overview
-----------------

Phase

Scope

Tags

Phase 0

Logging Infrastructure & Scaffolding

`infra`, `logging`, `telemetry`

Phase 1

Core Pro Features (MVP-Pro Tier)

`feature`, `MVP-Pro`

Phase 2

Reporting, Narrative Engine, UI Enhancements

`UX`, `intel`, `reporting`

Phase 3

Feedback loop, bug audit, polish

`QA`, `feedback`, `debug`

✅ Global Build Standards
------------------------

-   Local-First: All features must remain fully operational with `localStorage` / `IndexedDB`.
    
-   Zero-Knowledge Compliance: No user data leaves the client. All encryption via `CryptoService.js`.
    
-   100% Test Coverage: Each component must include both unit and integration tests.
    
-   Execution Logs Required: All significant computations must emit log entries.
    
-   Schema Versioning: All new states include `dataSchemaVersion` in Zustand.
    

🔧 Phase 0 – Infrastructure Setup
---------------------------------

Component

Files

Tasks

ExecutionLogService

`services/ExecutionLogService.js`, `tests/unit/services/ExecutionLogService.test.js`

- Create log schema (timestamp, type, payload) - Encrypt using `CryptoService` - Persist via local IndexedDB

State Schema

`store/useAppStore.js`

- Add `dataSchemaVersion: 1` - Prepare upgrade plan for future migrations

Crypto Update

`services/CryptoService.js`

- Extend support to encrypt logs, portfolios, budgets

Tests

Full coverage for all above components

🚀 Phase 1 – MVP-Pro Core Features
----------------------------------

### 🔹 Portfolio Optimizer

-   Files:
    
    -   `pages/pro/optimizer.jsx`
        
    -   `services/PortfolioAnalyzer.js`
        
    -   `tests/unit/services/PortfolioAnalyzer.test.js`
        
-   Features:
    
    -   Manual input: ticker, quantity, cost basis
        
    -   Live deviation from user target (e.g., 60/40)
        
    -   Diversification scoring (sector + asset class)
        
-   Log Events:
    
    -   `portfolio.analysis.run`
        
    -   `portfolio.divergence.detected`
        

### 🔹 Asset Allocation Advisor

-   Files:
    
    -   `components/AllocationAdvisor.jsx`
        
    -   `tests/unit/components/AllocationAdvisor.test.js`
        
-   Features:
    
    -   Static model presets (e.g., Three-Fund, 60/40)
        
    -   Rebalancing logic and suggestion output
        
-   Log Events:
    
    -   `advisor.recommendation.generated`
        
    -   `rebalancing.suggestion.made`
        

### 🔹 Budgeting & Cash Flow

-   Files:
    
    -   `pages/pro/budget.jsx`
        
    -   `services/BudgetService.js`, `tests/unit/services/BudgetService.test.js`
        
    -   `services/CashFlowService.js`, `tests/unit/services/CashFlowService.test.js`
        
-   Features:
    
    -   Envelope & category budgeting toggle
        
    -   Predictive monthly caps
        
    -   30/60/90 day forecast UI
        
-   Log Events:
    
    -   `budget.forecast.generated`
        
    -   `spending.limit.breached`
        
    -   `surplus.warning.triggered`
        

### 🔹 Rule Engine 2.0

-   Files:
    
    -   `components/RuleEditor.jsx`, `tests/unit/components/RuleEditor.test.js`
        
    -   `services/RuleEvaluator.js`, `tests/unit/services/RuleEvaluator.test.js`
        
-   Features:
    
    -   Multi-condition chaining (AND/OR)
        
    -   Calendar-based triggers
        
-   Log Events:
    
    -   `rule.evaluation.run`
        
    -   `rule.triggered`
        

### 🔹 Deterministic Simulation Engine

-   Files:
    
    -   `components/TimelineSimulator.jsx`, `tests/unit/components/TimelineSimulator.test.js`
        
    -   `services/Simulator.js`, `tests/unit/services/Simulator.test.js`
        
-   Features:
    
    -   Discrete event modeling (job change, windfall)
        
    -   Side-by-side scenario comparison
        
-   Log Events:
    
    -   `simulation.run`
        
    -   `event.impact.calculated`
        

📊 Phase 2 – Reporting & Insights
---------------------------------

### 🔹 Narrative Engine (Deterministic)

-   Files:
    
    -   `services/NarrativeService.js`
        
    -   `tests/unit/services/NarrativeService.test.js`
        
-   Features:
    
    -   Template-based insight generation from logs
        
    -   Examples:
        
        -   `"Technology sector allocation rose by 5%"`
            
        -   `"Rule 'High Spending Alert' fired 3 times this week"`
            
-   Log Events:
    
    -   `narrative.insight.generated`
        

### 🔹 Report Center & Dashboards

-   Files:
    
    -   `pages/pro/reports.jsx`, `tests/unit/pages/reports.test.js`
        
    -   `components/DashboardPicker.jsx`, `tests/unit/components/DashboardPicker.test.js`
        
-   Features:
    
    -   Hardcoded dashboard modes: Planner, Investor, Minimalist
        
    -   Reports: budget adherence, spending heatmaps, allocation drift
        

📩 Phase 3 – Feedback & QA
--------------------------

### 🔹 Pioneer Feedback Module

-   Files:
    
    -   `components/FeedbackForm.jsx`, `tests/unit/components/FeedbackForm.test.js`
        
    -   `services/FeedbackUploader.js`, `tests/unit/services/FeedbackUploader.test.js`
        
-   Features:
    
    -   Export user-approved snapshot of vault + logs
        
    -   No automatic upload for MVP
        
-   Log Events:
    
    -   `feedback.snapshot.created`
        
    -   `feedback.submission.logged`
        

🧬 Optional Cursor Integration Notes
------------------------------------

    // @cursor task: Encrypt and persist logs using CryptoService and secureStore.
    // @cursor success: ExecutionLogService stores and decrypts correctly in unit test.
    

    // @cursor task: NarrativeService consumes logs and state to generate insights.
    // @cursor test: Insight: "Your cash reserve is below 3-month threshold"
    

🏛️ Branch & Merge Strategy
---------------------------

-   All AlphaPro work will take place on a long-lived feature branch from `main`:
    `feature/alphapro`
    
-   Each component or subfeature will be developed on sub-branches:
    `feature/alphapro-[component-name]`
    
-   Merge into `main` only after all four phases are complete and verified by the Summary Checkpoint.
    
-   All PRs must link to this plan and clearly state what milestones are satisfied.
    

✅ Summary Checkpoint Before Merge
---------------------------------

System

Status

ExecutionLogService

✅ Complete

MVP-Pro Features (Phase 1)

✅ Verified

Schema versioning

✅ Implemented

Narrative Engine

✅ Templated

Reports & Dashboards

✅ 3 Modes only

Feedback Module

✅ Export-only

Test Coverage

✅ 100%

Definition of Done:

> "Successful validation of this entire checkpoint signifies that the `feature/alphapro` branch is ready to be merged into `main`, making the AlphaPro suite available for public release."

Let me know if you’d like this exported into a `.md` or `.txt` file for upload.