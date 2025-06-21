# Test Fix Strategy - AlphaFrame VX.1

**Status:** 121 failing tests across 32 files  
**Priority:** Critical - Auth0 integration and core functionality  
**Date:** December 2024

---

## 🔍 **Root Cause Analysis**

### **1. React 18 createRoot Issues (Primary)**
- **Problem:** `createRoot(...): Target container is not a DOM element`
- **Impact:** 80+ test failures in React components
- **Cause:** Test environment not properly configured for React 18

### **2. Auth0 Integration Test Failures**
- **Problem:** Mock configuration and import.meta.env issues
- **Impact:** 15+ Auth0-related test failures
- **Cause:** ES module mocking and environment variable access

### **3. PlaidService Mock Failures**
- **Problem:** `PlaidApi.mockImplementation is not a function`
- **Impact:** 20+ Plaid integration test failures
- **Cause:** Incorrect mock setup for Plaid SDK

### **4. RuleEngine Schema Validation**
- **Problem:** Test data doesn't match current Zod schemas
- **Impact:** 10+ RuleEngine test failures
- **Cause:** Schema changes without test updates

---

## 🛠️ **Immediate Fixes Required**

### **Phase 1: React 18 Compatibility (Critical)**

#### **Fix 1: Update Test Environment**
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    globals: true,
    css: false
  }
});
```

#### **Fix 2: Component Test Wrapper**
```javascript
// Create test-utils.jsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

export const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};
```

### **Phase 2: Auth0 Test Fixes**

#### **Fix 1: Environment Variable Mocking**
```javascript
// In test files
vi.mock('../../config.js', () => ({
  config: {
    auth0: {
      domain: 'test.auth0.com',
      clientId: 'test_client_id',
      audience: 'https://test.api.alphaframe.dev'
    },
    env: 'test'
  }
}));
```

#### **Fix 2: Import.meta.env Mocking**
```javascript
// setupTests.js addition
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_APP_ENV: 'test',
    VITE_AUTH0_DOMAIN: 'test.auth0.com',
    VITE_AUTH0_CLIENT_ID: 'test_client_id',
    // ... other env vars
  }
});
```

### **Phase 3: PlaidService Mock Fixes**

#### **Fix 1: Proper Plaid Mocking**
```javascript
// In PlaidService tests
vi.mock('plaid', () => ({
  PlaidApi: vi.fn().mockImplementation(() => ({
    linkTokenCreate: vi.fn().mockResolvedValue({ data: { link_token: 'test_token' } }),
    itemPublicTokenExchange: vi.fn().mockResolvedValue({ data: { access_token: 'test_access' } }),
    accountsBalanceGet: vi.fn().mockResolvedValue({ data: { accounts: [] } }),
    transactionsGet: vi.fn().mockResolvedValue({ data: { transactions: [] } })
  })),
  Configuration: vi.fn(),
  PlaidEnvironments: {
    sandbox: 'sandbox',
    development: 'development',
    production: 'production'
  }
}));
```

### **Phase 4: RuleEngine Schema Fixes**

#### **Fix 1: Update Test Data**
```javascript
// Update test data to match current schemas
const validRule = {
  id: 'test-rule',
  name: 'Test Rule',
  description: 'Test rule description',
  conditions: [{
    field: 'amount',
    operator: 'gt',
    value: 100
  }],
  actions: [{
    type: 'notification',
    config: { message: 'Test notification' }
  }],
  priority: 5,
  enabled: true
};
```

---

## 🎯 **Priority Order**

### **High Priority (Fix First)**
1. **React 18 createRoot issues** - Blocks 80+ tests
2. **Auth0 environment mocking** - Blocks Auth0 integration
3. **PlaidService mock setup** - Blocks Plaid integration

### **Medium Priority**
1. **RuleEngine schema updates** - Core functionality
2. **Component test wrappers** - UI testing
3. **Error handling tests** - Edge cases

### **Low Priority**
1. **Performance tests** - Non-critical
2. **Integration tests** - Can be fixed later
3. **E2E tests** - Separate from unit tests

---

## 🚀 **Implementation Plan**

### **Step 1: Quick Wins (30 minutes)**
- [ ] Fix React 18 createRoot in setupTests.js
- [ ] Add import.meta.env mocking
- [ ] Update PlaidService mocks

### **Step 2: Core Fixes (1 hour)**
- [ ] Fix Auth0 test configuration
- [ ] Update RuleEngine test data
- [ ] Add component test utilities

### **Step 3: Validation (30 minutes)**
- [ ] Run focused test suites
- [ ] Verify Auth0 integration works
- [ ] Confirm Plaid integration works

---

## 📊 **Success Metrics**

### **Target: Reduce failures by 80%**
- **Current:** 121 failing tests
- **Target:** <25 failing tests
- **Timeline:** 2 hours

### **Critical Path Tests**
- [ ] Auth0 login/logout flow
- [ ] Plaid token exchange
- [ ] RuleEngine basic operations
- [ ] React component rendering

---

## 🔧 **Quick Fix Commands**

```bash
# Run only critical tests
npm test -- --run AuthService.test.js PlaidService.test.js

# Run with verbose output
npm test -- --run --reporter=verbose

# Run specific test file
npm test -- --run src/lib/services/__tests__/AuthService.test.js
```

---

## ⚠️ **Known Issues**

1. **FeedbackModule tests** - React 18 createRoot issues
2. **ExecutionLogService tests** - Database mocking issues
3. **RuleEngine tests** - Schema validation mismatches
4. **PlaidService tests** - Mock implementation errors

---

## ✅ **Next Steps**

1. **Immediate:** Apply React 18 fixes
2. **Short-term:** Fix Auth0 and Plaid mocks
3. **Medium-term:** Update test data for schemas
4. **Long-term:** Comprehensive test refactoring

---

## 📝 **Notes**

- Focus on getting Auth0 integration tests passing first
- Plaid integration is secondary but important
- RuleEngine tests can be updated incrementally
- React component tests need proper DOM setup

**Estimated Time to Fix:** 2-3 hours for critical issues
**Estimated Success Rate:** 80% reduction in failures 