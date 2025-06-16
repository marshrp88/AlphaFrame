# AlphaFrame: The Definitive Technical & Operational Roadmap

**A Master Build Plan for the React-Vite Pivot**

**Document Version:** 7.0 (Final, Canonical Build Plan)
**Status:** Locked, Execution-Ready
**Audience:** Founding Engineer, Technical Leadership

---

## Preamble: The Strategic Pivot to Velocity and Stability

This document outlines the complete technical and operational plan for building the AlphaFrame MVP. It represents a formal strategic pivot away from a complex, brittle toolchain (SvelteKit/TypeScript/svelte-preprocess) to a high-velocity, high-stability stack: React, Vite, JavaScript, Zustand, and shadcn/ui.

This decision is made to unblock development, eliminate toolchain friction, and maximize our ability to ship a secure, valuable, and robust product within a predictable timeframe. This document is the single source of truth for the feat/react-pivot branch and all subsequent development.

---

## Part I: The Foundational Setup (Sprint 0)

### Objective: To establish a clean, stable, and "best practice" project foundation on the new stack. This phase must be completed and validated before any feature logic is ported.

#### 1.1. Environment & Branching
- Create a new branch from main named `feat/react-pivot`.
- Scaffold a new, clean React + Vite application in `apps/web`.
- Delete all legacy SvelteKit and related configuration files from the `apps/web` directory.

#### 1.2. Core Dependencies & Configuration
- Install all necessary dependencies for core app and dev/test.
- Initialize and configure Tailwind, PostCSS, ESLint, Prettier.
- Initialize shadcn/ui and establish the `src/components/ui` directory.
- Implement Git hooks using Husky and lint-staged.

#### 1.3. Canonical Vite Configuration
- File: `apps/web/vite.config.js`
- Set up with React plugin and path aliasing for `@` to `src/`.

#### 1.4. The "Smoke Test" Protocol
- Create a simple Button component and test.
- Success Metric: `pnpm test` passes, `pnpm dev` displays the button.

---

## Part II: The Feature Migration & Implementation (Phased Sprints)

### Sprint 1: Security, State & Core Services
- Create documented `src/` directory structure.
- Implement Zustand stores: `authStore`, `financialStateStore`, `uiStore`.
- Define core data objects in `src/types/` using JSDoc.
- Port and test `CryptoService`.
- Build Signup/Login UI and integrate with CryptoService.
- Implement password recovery kit.

### Sprint 2: Data Ingestion & Visualization
- Create `lib/services/api.js` wrapper.
- Port and test `SyncEngine` (mocked for MVP).
- Integrate Plaid Link React component.
- Build NetWorthLiveDashboard and TransactionList components.
- Implement manual categorization and merchant memory.

### Sprint 3: Rule Engine & Simulation Core
- Port and test `RuleEngineService`.
- Build RuleEditorModal UI.
- Port and test deterministic `SimulationService`.
- Create simulation input/results UI (with recharts).
- Integrate RuleEngine with simulation UI.

### Sprint 4: AI Facade & Final Polish
- Build AlphaGuide chat interface.
- Integrate secure AI facade for backend LLM calls.
- Write E2E Playwright test for golden path.
- Conduct QA, bug bash, and polish UI.

---

## Part III: Appendices & Protocols

### Appendix A: File Structure and Naming Conventions
- `src/`: All application source code.
- `src/components/ui/`: shadcn/ui base components.
- `src/components/app/`: Feature-specific components.
- `src/lib/services/`: Business logic and API interactions.
- `src/lib/store/`: Zustand stores.
- `src/pages/`: Route components.
- `tests/`: All test files, mirroring `src/` structure.

### Appendix B: Dev Environment Configuration
- All external service keys and URLs managed via `.env` (excluded from Git).
- State schema versioning for future migrations.

### Appendix C: Dev/Test Commands
- `pnpm dev`: Start dev server
- `pnpm test`: Run Vitest suite
- `pnpm test:e2e`: Run Playwright E2E
- `pnpm build`: Production build
- `pnpm preview`: Serve production build

### Appendix D: Offline Fallback & Contingency Protocol
- Use `VITE_USE_MOCK_DATA` for static data during dev.
- Manual sync trigger in dev mode.
- State persistence via localStorage/IndexedDB.

### Appendix E: Post-MVP Enhancements (Future-Proofing)
- TypeScript migration ready
- Advanced simulation engine ready
- TelosOS integration ready

---

**This document is the canonical reference for the AlphaFrame MVP and all future development.** 