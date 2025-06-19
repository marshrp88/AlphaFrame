# ✅ AlphaFrame Test Suite Triage – Punchlist Tracker (Post-MVP Audit)

_Last Reviewed: <!-- LAST_REVIEWED -->_
_Version Hash: <!-- VERSION_HASH -->_

| 🔢 | Test File                        | Status            | Primary Issue                            | Action Taken / Notes                   | ✅ Done |
| -- | -------------------------------- | ----------------- | ---------------------------------------- | -------------------------------------- | ------ |
| 1  | `PlaidActionForm.spec.jsx`       | 🔴 Blocked        | Rollup native binary error               | Resolve infra issue → rerun tests      | ⬜      |
| 2  | `WebhookActionForm.spec.jsx`     | 🔴 Failing        | Selector/query mismatch                  | Audit `getByRole`, fix query structure | ⬜      |
| 3  | `ruleEngine.unit.spec.js`        | 🟡 Inconsistent   | Contract logic & Zod schema mismatch     | Align `.safeParse` usage & test shape  | ⬜      |
| 4  | `ConfirmationModal.spec.js`      | 🔴 Broken import  | `executeAction` import path broken       | Fix mock + path                        | ⬜      |
| 5  | `ExecutionController.spec.js`    | 🔴 Incomplete     | Store hook not mocked                    | Mock Zustand store properly            | ⬜      |
| 6  | `FrameSyncIntegration.spec.js`   | 🟡 Incomplete     | State/spies not triggering               | Fix spies/state sync                   | ⬜      |
| 7  | `PermissionEnforcer.spec.js`     | ⚠️ Timeout        | Async leak or unawaited promise          | Audit lifecycle + add teardown         | ⬜      |
| 8  | `ruleEngine.integration.spec.js` | 🟡 Mismatched     | Payload/schema contract mismatch         | Enforce Zod validation end-to-end      | ⬜      |
| 9  | `secureVault.spec.js`            | 🔴 Logic flaw     | Key validation logic incorrect           | Edge test for missing/invalid keys     | ⬜      |
| 10 | `TriggerDispatcher.spec.js`      | 🔴 Method missing | `clearActionQueue` undefined or misnamed | Validate export & invocation           | ⬜      |

---

## ⚙️ Infra Task Tracker

| Task                      | Command/Action                         | ✅ Done |
| ------------------------- | -------------------------------------- | ------ |
| Rebuild native deps       | `pnpm rebuild`                         | ⬜      |
| Try npm install           | `rd /s /q node_modules && npm install` | ⬜      |
| Downgrade Rollup          | `pnpm add -Dw rollup@4.17.0`           | ⬜      |
| Lock `esbuild` + binaries | Add `resolutions` to `package.json`    | ⬜      |

---

## 🧭 Post-Triage Final Steps

| Task                              | Description                                       | ✅ Done |
| --------------------------------- | ------------------------------------------------- | ------ |
| Run full test suite               | Validate global stability                         | ⬜      |
| Run coverage script               | `pnpm run test:coverage`                          | ⬜      |
| Screenshot coverage & test report | For PR and audit purposes                         | ⬜      |
| Create final PR                   | Include links, description, screenshot, checklist | ⬜      | 
