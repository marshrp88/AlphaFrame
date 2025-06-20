# KNOWN_TEST_FAILURES.md

> **Last updated:** [auto-generated]

This document catalogs all currently failing test files in the AlphaPro VX.0 codebase, with root causes and recommended actions. Use this as a reference for future sprints, audits, and onboarding.

---

## ❌ Failing Test Files & Root Causes

### 1. **Missing File / Import Errors**

| Test File | Error | Tag |
|-----------|-------|-----|
| `apps/web/tests/components/Button.test.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/components/framesync/InternalActionForm.spec.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/components/framesync/PlaidActionForm.spec.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/components/framesync/WebhookActionForm.spec.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/unit/components/DashboardPicker.test.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/unit/components/FeedbackForm.test.jsx` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |
| `apps/web/tests/store/financialStateStore.spec.js` | `Failed to resolve import "../../src/lib/store/financialStateStore"` | `MISSING_FILE` |
| `apps/web/tests/store/useAppStore.spec.js` | `Failed to resolve import "@/store/useAppStore"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/ConfirmationModal.spec.js` | `Failed to resolve import "@/lib/services/ExecutionController"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/crypto.spec.js` | `Failed to resolve import "../../../src/lib/services/crypto"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/ExecutionController.spec.js` | `Failed to resolve import "@/lib/store/financialStateStore"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/financialStateStore.spec.js` | `Failed to resolve import "../../../src/lib/store/financialStateStore"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/FrameSyncIntegration.spec.js` | `Failed to resolve import "../../../src/lib/store/logStore"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/PermissionEnforcer.spec.js` | `Failed to resolve import "../../../src/lib/store/authStore"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/secureVault.spec.js` | `Failed to resolve import "../../../src/lib/services/secureVault"` | `MISSING_FILE` |
| `apps/web/tests/integration/services/TriggerDispatcher.spec.js` | `Failed to resolve import "@/lib/services/TriggerDispatcher"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/BudgetService.test.js` | `Failed to resolve import "../../../src/lib/services/BudgetService.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/CashFlowService.test.js` | `Failed to resolve import "../../../src/lib/services/CashFlowService.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/ExecutionController.test.js` | `Failed to resolve import "../store/financialStateStore"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/ExecutionLogService.test.js` | `Failed to resolve import "../../../src/lib/services/ExecutionLogService.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/FeedbackUploader.test.js` | `Failed to resolve import "../../../src/lib/services/crypto.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/NarrativeService.test.js` | `Failed to resolve import "../../../src/lib/services/NarrativeService.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/PermissionEnforcer.spec.js` | `Failed to resolve import "@/lib/services/PermissionEnforcer"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/PortfolioAnalyzer.test.js` | `Failed to resolve import "../../../src/lib/services/PortfolioAnalyzer.js"` | `MISSING_FILE` |
| `apps/web/tests/unit/services/ruleEngine.spec.js` | `Failed to resolve import "@/lib/services/ruleEngine"` | `MISSING_FILE` |
| `apps/web/tests/unit/store/uiStore.spec.js` | `Failed to resolve import "@/lib/store/uiStore"` | `MISSING_FILE` |

### 2. **Timeouts / Test Logic Errors**

| Test File | Error | Tag |
|-----------|-------|-----|
| `apps/web/src/features/pro/tests/ExecutionLogService.simple.test.js` | `Test timed out in 5000ms` (multiple tests) | `TIMEOUT` |
| `apps/web/src/features/pro/tests/ExecutionLogService.simple.test.js` | `AssertionError: expected ...` (object mismatch) | `ASSERTION_FAIL` |

### 3. **Other**

| Test File | Error | Tag |
|-----------|-------|-----|
| `apps/web/tests/app.import.test.js` | `Failed to resolve import "react/jsx-dev-runtime"` | `MISSING_DEP` |

---

## 🏷️ Tag Legend
- `MISSING_FILE`: File was deleted or moved during refactor
- `MISSING_DEP`: Dependency not installed or missing from node_modules
- `TIMEOUT`: Test did not complete in allotted time
- `ASSERTION_FAIL`: Test assertion failed (likely due to refactor or mock mismatch)

---

## 🚩 Action Items
- **Restore or stub missing files** for critical services before next integration phase
- **Install missing dependencies** (e.g., `react/jsx-dev-runtime`)
- **Review and refactor test logic** for timeouts and assertion mismatches

---

> **FIX_BEFORE_PHASE_3**: All above must be addressed before Phase 3 QA and merge to `main`. 