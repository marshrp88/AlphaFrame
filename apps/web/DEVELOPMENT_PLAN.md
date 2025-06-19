# AlphaFrame Development Plan

## Current Status: MVP Foundation Complete

### ✅ Completed Foundation (Sprint 0)
1. **Project Setup**
   - [x] React + Vite project created
   - [x] Legacy cleanup (SvelteKit/TypeScript removed)
   - [x] Core dependencies installed
   - [x] Vite configuration
   - [x] Git hooks (Husky/lint-staged)
   - [x] ESLint/Prettier configuration

2. **Directory Structure**
   - [x] `src/` and subfolders created
   - [x] Basic component structure
   - [x] Store setup
   - [x] Test infrastructure

3. **Testing Infrastructure**
   - [x] Vitest configuration
   - [x] Testing Library setup
   - [x] Smoke test (Button component)
   - [x] Basic store tests

4. **Basic Features**
   - [x] React Router setup
   - [x] Basic API client
   - [x] Environment variable management
   - [x] Basic state management (counter store)

## Next Steps: Feature Implementation

### Sprint 1: Security & Core Services (Priority: HIGH)
1. **State Management**
   - [ ] Implement `authStore`
     - User authentication state
     - Session management
     - Token handling
   - [ ] Implement `financialStateStore`
     - Account data structure
     - Transaction management
     - Balance tracking
   - [ ] Implement `uiStore`
     - Theme management
     - Navigation state
     - Modal/overlay control

2. **Security Layer**
   - [ ] Create `src/types/` directory
     - [ ] Define Transaction interface
     - [ ] Define Account interface
     - [ ] Define Rule interface
   - [ ] Port `CryptoService`
     - [ ] Key derivation logic
     - [ ] Encryption/decryption
     - [ ] Security tests
   - [ ] Auth Flow Implementation
     - [ ] Signup component
     - [ ] Login component
     - [ ] Password recovery
     - [ ] Session management

### Sprint 2: Data & Visualization (Priority: HIGH)
1. **Data Integration**
   - [ ] Port `SyncEngine`
     - [ ] Plaid communication
     - [ ] Data synchronization
     - [ ] Error handling
   - [ ] Plaid Integration
     - [ ] Link component setup
     - [ ] Account connection flow
     - [ ] Transaction fetching

2. **Core UI Components**
   - [ ] `NetWorthLiveDashboard`
     - [ ] Balance display
     - [ ] Trend visualization
     - [ ] Account summary
   - [ ] `TransactionList`
     - [ ] Transaction display
     - [ ] Filtering/sorting
     - [ ] Pagination
   - [ ] `CategorySelector`
     - [ ] Category management
     - [ ] Merchant rules
     - [ ] Auto-categorization

### Sprint 3: Rule Engine & Simulation (Priority: MEDIUM)
1. **Rule Engine**
   - [ ] Port `RuleEngineService`
     - [ ] Rule evaluation logic
     - [ ] Condition parsing
     - [ ] Action execution
   - [ ] Build `RuleEditorModal`
     - [ ] Rule creation interface
     - [ ] Rule testing
     - [ ] Rule management

2. **Simulation Core**
   - [ ] Port `SimulationService`
     - [ ] Debt vs. Investment logic
     - [ ] Scenario generation
     - [ ] Result calculation
   - [ ] Simulation UI
     - [ ] Input forms
     - [ ] Results display
     - [ ] Chart integration

### Sprint 4: AI & Polish (Priority: MEDIUM)
1. **AI Integration**
   - [ ] Build AlphaGuide UI
     - [ ] Chat interface
     - [ ] Message history
     - [ ] Response handling
   - [ ] Implement AI Facade
     - [ ] API integration
     - [ ] PII stripping
     - [ ] Response processing

2. **Final Polish**
   - [ ] E2E Testing
     - [ ] Critical path tests
     - [ ] User flow validation
     - [ ] Edge case coverage
   - [ ] Performance Optimization
     - [ ] Load time improvement
     - [ ] State persistence
     - [ ] Offline support

## Development Guidelines

### Testing Strategy
- Unit tests for all services and utilities
- Component tests for UI elements
- Integration tests for feature workflows
- E2E tests for critical paths

### Code Quality
- Follow established ESLint/Prettier rules
- Document all major functions and components
- Maintain test coverage above 80%
- Regular code reviews

### State Management
- Use Zustand for global state
- Implement proper state persistence
- Handle loading and error states
- Maintain type safety with JSDoc

### Security
- Implement proper authentication flow
- Secure API communication
- Handle sensitive data appropriately
- Regular security audits

## Getting Started

1. **Environment Setup**
   ```bash
   pnpm install
   pnpm dev
   ```

2. **Development Workflow**
   - Create feature branch from `main`
   - Implement feature with tests
   - Submit PR for review
   - Merge after approval

3. **Testing**
   ```bash
   pnpm test        # Run unit tests
   pnpm test:e2e    # Run E2E tests
   ```

## Next Immediate Tasks

1. Begin Sprint 1 implementation:
   - Set up `authStore`
   - Create type definitions
   - Port `CryptoService`

2. Prepare development environment:
   - Set up Plaid development account
   - Configure environment variables
   - Initialize test data

3. Create initial documentation:
   - API integration guide
   - State management patterns
   - Testing procedures 
