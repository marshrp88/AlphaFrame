AlphaPro Initiative: Sprint Zero - The Hardening & Scaffolding Phase

Document Type: Engineering Work Order & Deliverables
Version: 2.0 (Final, CTO-Approved for Build)
Objective: To harden the existing FrameSync codebase and scaffold the necessary infrastructure to ensure the subsequent development of AlphaPro is stable, secure, and efficient.

Preamble: Post-MVP Hardening

This sprint constitutes Phase 2 of our Post-MVP development plan, executed immediately following the successful merge of the feature-complete FrameSync MVP into main. Its purpose is to transition our codebase from "functionally complete" to "production-grade" by implementing rigorous testing, validation, and foundational infrastructure for future features.

Module 1: Test Suite Hardening & Coverage Enforcement

Objective: To achieve >85% overall test coverage for all FrameSync modules, enforce per-module coverage targets, and lock the core user journey with a regression-proof "Golden Path" test.

Task 1.1: Configure Coverage Reporting

Action: Add c8 as a development dependency: pnpm add -D c8.

File to Modify: package.json (at the project root).

Deliverable: Add a new script: "test:coverage": "c8 pnpm test". This command will be used to validate all coverage targets.

Task 1.2: Expand Playwright E2E Coverage

File to Modify: apps/web/e2e/framesync.spec.js

Deliverables:

Add a new test block for "Rule Creation Edge Cases" (e.g., rules with multiple AND/OR conditions).

Add a new test block that specifically toggles the Safeguards switches and asserts that the confirmation modal appears or is skipped accordingly.

Enhance the "Golden Path" test to include an explicit check of the ActionLog UI.

Task 1.3: Implement Service-Level Unit Tests with Coverage Targets

Files to Create/Modify:

apps/web/tests/unit/services/PermissionEnforcer.spec.js

apps/web/tests/unit/services/ExecutionController.spec.js

apps/web/tests/unit/store/uiStore.spec.js

Deliverables:

Write focused unit tests for each function and store action, mocking all external dependencies.

Success Criterion: Achieve the following coverage targets, verified by running pnpm test:coverage:

PermissionEnforcer.js: 100%

ExecutionController.js: 90%

RuleEngine.js: 95%

uiStore.js: 100%

Task 1.4: Create the "Golden Path" Visual Regression Suite

File to Create: apps/web/e2e/golden-path.spec.js

Deliverables:

Create one single, comprehensive E2E test that executes the canonical user journey: Signup -> Login -> Create Rule -> Trigger Action -> See Log.

This test must use Playwright's visual regression capability (expect(page).toHaveScreenshot()) at all critical UI states (e.g., "Rule Created," "Action Executed," "Log Populated").

The baseline reference screenshots must be committed to apps/web/tests/screenshots and tracked in Git.

Task 1.5: Embed Metadata in Test Files

Deliverable: Prepend every .spec.js file created or modified in this sprint with a metadata block for traceability.

Generated javascript
// @test-id: RuleEngine-Unit
// @last-reviewed: 2025-06-18
// @version-hash: <git rev-parse HEAD>

Module 2: Runtime Integrity & Contract Testing

Objective: To build a robust security and validation layer that protects the system from invalid data and unauthorized access, with strict enforcement of data contracts.

Task 2.1: Implement Schema Definitions with Zod

Action: Add zod as a dependency: pnpm add zod.

File to Create: apps/web/src/lib/validation/schemas.js

Deliverable: Define and export Zod schemas for our core data structures: RuleSchema, ActionSchema, TransactionSchema.

Task 2.2: Enforce Schema Contracts in Services & Tests

Files to Modify: RuleEngineService.js, ExecutionController.js, and their corresponding test files.

Deliverables:

In the RuleEngineService, import RuleSchema and use RuleSchema.safeParse(rule) to validate any rule before it is evaluated. Reject invalid data.

In the ExecutionController, validate any incoming action payload against the ActionSchema.

Contract Testing: In all relevant integration tests, wrap mock payloads in their corresponding Zod schema parser and assert that .success === true.

Task 2.3: Formalize the Auth/Permissions Layer

File to Create: apps/web/src/lib/auth.js

Deliverable: Create a hook useAuth() that provides the user's authentication status and tier ('free' or 'pro').

File to Create: apps/web/src/components/PrivateRoute.jsx

Deliverable: A React component that uses the useAuth hook to protect routes, redirecting unauthorized users.

Task 2.4: Implement and Test Sandbox Mode

Deliverables:

Add a isSandboxMode boolean to the uiStore.

In the ExecutionController, check isSandboxMode before executing actions. If true, log the action to the console with a [SANDBOX] prefix and return a mocked success result.

File to Create: apps/web/tests/integration/services/ExecutionController.sandbox.spec.js to specifically verify that isSandboxMode === true logs actions but skips all real side effects.

Module 3: Foundational Scaffolding for AlphaPro

Objective: To create the basic, non-functional entry points for AlphaPro to prevent routing errors and establish the feature's location in the codebase.

Task 3.1: Create the Log Service Stub

File to Create: apps/web/src/lib/log.js

Deliverable: Create and export stub functions (log.info, log.warn, log.error) that wrap console.log with formatted prefixes.

Task 3.2: Create the Guarded AlphaPro Page

File to Create: apps/web/src/pages/AlphaPro.jsx

Deliverable:

A simple React component that renders a placeholder <h1>Welcome to AlphaPro</h1>.

Update the application's router to include a new route, /pro, that is wrapped in the <PrivateRoute /> component and renders the AlphaPro.jsx page.

Module 4: Process & Governance

Objective: To establish the formal engineering standards for this and all future development sprints.

Task 4.1: Branch & Merge Strategy

Policy: All work for this sprint will be done on a single feature branch created from main: feature/alphapro-sprint-zero.

Upon completion of all modules and success criteria, a Pull Request (PR) will be opened to merge this branch back into main.

Task 4.2: CI Layer & GitHub PR Policy

Policy: All PRs against main must include the following before they can be merged:

A link to this work order document.

A screenshot of the pnpm test:coverage output demonstrating all coverage targets have been met.

Confirmation that the "Golden Path" visual regression test (golden-path.spec.js) passes.

A clean pnpm lint and pnpm format run.