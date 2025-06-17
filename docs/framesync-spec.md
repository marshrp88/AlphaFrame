FrameSync: The Definitive Master Document & Implementation Guide V2.1

Document Type: Master Product & Technical Specification
Version: 2.1 (Final, CTO-Approved for Build)
Product Component: FrameSync (an integrated module of AlphaFrame)
Status: Locked, Execution-Ready

### 1. Executive Summary & Product Philosophy

FrameSync is the execution and automation layer of the AlphaFrame operating system. Its purpose is to close the loop between financial simulation and real-world action, transforming AlphaFrame from a passive planning tool into an active agent for user-defined financial strategies. The core principle is user-commanded automation, operating under our foundational commitment to Zero-Knowledge security and user sovereignty. FrameSync is the primary driver of the AlphaFrame Pro Tier.

### 2. Strategic Rationale & Business Case

FrameSync addresses the final, critical step in the value chain: execution.

-   Closes the Intention-Action Gap: Provides the behavioral scaffolding to ensure a user's long-term intentions are consistently executed.
    
-   Creates a "Sticky" Ecosystem: A user who has automated their financial strategy has a system that is actively working for them, dramatically increasing retention and Lifetime Value (LTV).
    
-   Unlocks High-Value Monetization: The ability to automate financial actions is a clear, premium feature that justifies our tiered SaaS model.
    

### 3. Core Capabilities & User Experience

FrameSync introduces "Actions" to the AlphaFrame RuleEngineService.

-   3.1. The Rule & Action Binding UI
    The primary user interface will be an extension of the existing Rule Editor React component. When a Pro user creates a rule, they will see a new "Action" <Select> component powered by shadcn/ui.
    
    -   Workflow:
        
        -   Trigger: IF checking_account_balance > $5,000...
            
        -   Action: ...THEN execute Plaid Transfer.
            
        -   Configuration: A new UI section appears to configure the transfer: From: 'Chase Checking', To: 'Vanguard Brokerage', Amount: 'Surplus above $5,000'.
            
        -   Safeguards: The user can enable toggles for "Require Confirmation Before Execution" and "Run Simulation Preview."
            
        
    
-   3.2. Execution Classes
    
    -   Class 1: Internal Actions (Zustand State Modification): Actions that modify the user's AlphaFrame state within our existing Zustand stores.
        
    -   Class 2: External Actions (API-Driven Execution): Actions that interact with third-party institutions (Plaid transfers, Zapier webhooks).
        
    -   Class 3: Communication Actions (Notification Execution): Actions that send information to the user (summary emails, Web Push API notifications).
        
    

### 4. Detailed Architecture & Engineering Scope (Corrected for React/Vite)

FrameSync is architected as a set of new, modular client-side services that extend the existing RuleEngineService.

-   4.1. Key Engineering Modules
    | Module Name | Function | Implementation Notes (React/Vite/JS Stack) |
    |---|---|---|
    | TriggerDispatcher.js | A client-side service that listens for events from the RuleEngineService and passes action payloads to the ExecutionController. | The central router, handling an action queue likely managed within a dedicated Zustand store. |
    | ExecutionController.js | A client-side service containing the logic for executing each type of action. | Securely manages API tokens stored in the client's encrypted state via CryptoService and handles fetch requests. No server-side vault. |
    | RuleBinderUI.jsx | The React components, built with shadcn/ui, that allow a user to configure FrameSync actions within the Rule Editor. | A declarative, step-by-step flow designed to be clear and prevent user error. |
    | ActionLogLayer | A new array, actionLog, within a dedicated logStore.js (Zustand store). | The schema includes timestamp, ruleId, actionType, payload, and result. State is persisted via our existing encrypted localStorage middleware. No Prisma or SQLite database. |
    | PermissionEnforcer.js | A security service that mediates all external actions. | For high-risk actions, this module triggers a modal dialog prompting for the user's master password before proceeding. It does not use Tauri APIs. |
    
-   4.2. De-Risked Development Milestone Timeline (12 Weeks)
    The timeline is structured into two parallel tracks to de-risk development and allow for concurrent progress.
    
    -   Track A: Backend Services & Core Logic (Weeks 1-6)
        
        -   Sprint A1 (Weeks 1-2): Architecture & Scaffolding
            
            -   Deliverables: Define all JSDoc types for Action Payloads. Scaffold TriggerDispatcher.js, ExecutionController.js, PermissionEnforcer.js. Create the complete, failing unit test suites for all new services.
                
            -   Success Criterion: pnpm test shows all new service tests failing with "Not implemented."
                
            
        -   Sprint A2 (Weeks 3-4): Internal & Communication Actions
            
            -   Deliverables: Implement the TriggerDispatcher logic. Implement ExecutionController handlers for Class 1 (Internal) and Class 3 (Communication) actions.
                
            -   Success Criterion: All unit tests for internal and communication actions now pass.
                
            
        -   Sprint A3 (Weeks 5-6): External Actions & Security
            
            -   Deliverables: Implement the secure client-side vault for API tokens. Implement ExecutionController handlers for Class 2 (External) actions (Plaid, Webhooks). Implement the PermissionEnforcer logic.
                
            -   Success Criterion: All remaining service tests now pass. Track A is complete.
                
            
        
    -   Track B: Frontend UI/UX & Safeguards (Weeks 1-10)
        
        -   Sprint B1 (Weeks 1-4): Rule Binder UI
            
            -   Deliverables: Build the complete RuleBinderUI.jsx component tree in Storybook or a similar isolated environment. This includes all forms and configuration flows for every action type.
                
            -   Success Criterion: All UI components are visually complete and pass accessibility checks.
                
            
        -   Sprint B2 (Weeks 5-8): Audit Log & Safeguard UIs
            
            -   Deliverables: Build the ActionLog UI view component. Build the UI for the "Require Confirmation" modal and the "Run Simulation Preview" component.
                
            -   Success Criterion: All new UI components are visually complete and functional with mock data.
                
            
        -   Sprint B3 (Weeks 9-10): Full UI Integration
            
            -   Deliverables: Integrate all UI components with the completed services from Track A. Wire up all state management and data flows.
                
            -   Success Criterion: The FrameSync feature is fully interactive and functional within the main AlphaFrame application.
                
            
        
    -   Final Phase: System-Wide Testing & Hardening (Weeks 11-12)
        
        -   Deliverables: A comprehensive Playwright E2E test suite covering the full flow from rule creation to action execution and audit logging. A report from an internal "red team" security exercise.
            
        -   Success Criterion: All E2E tests pass, and all critical/major bugs identified during the bug bash and security review are resolved.
            
        
    

### 5. Security, Privacy & Risk Mitigation

-   Zero-Knowledge Enforcement: The logic that decides when to trigger an action runs entirely locally on the user's encrypted data.
    
-   Session-Bound & User-Confirmed Execution: High-risk actions will always require a final, explicit confirmation from the user (master password prompt).
    
-   Immutable Auditing: The ActionLogLayer provides a transparent, client-side record of every action.
    
-   Scoped API Permissions: The OAuth flow will request only the absolute minimum required permissions.
    

By adhering to this updated specification, we can provide powerful automation while upholding our commitment to user sovereignty and control.