# AlphaFrame Testing Documentation

## **Overview**

This document covers the complete testing infrastructure for AlphaFrame VX.1, including E2E tests, test data setup, and execution procedures.

## **Test Architecture**

### **Test Types**
- **E2E Tests**: Full browser automation using Playwright
- **Component Tests**: Individual component testing (future)
- **Unit Tests**: Business logic testing (future)

### **Test Structure**
```
apps/web/
├── e2e/                          # E2E test files
│   ├── framesync.spec.js         # Main FrameSync integration tests
│   ├── golden-path.spec.js       # User journey tests
│   ├── rulespage-mount.spec.js   # Component mounting tests
│   └── global-setup.js           # Test environment setup
├── test-runner.js                # Robust test execution script
├── test-diagnostics.js           # Test failure analysis
└── playwright.config.js          # Playwright configuration
```

## **Test Data Requirements**

### **Mock Account Data**
The tests expect the following account data to be available:

```javascript
accounts: [
  {
    id: 'chase_checking',
    name: 'Chase Checking', 
    balance: 6000,
    type: 'checking'
  },
  {
    id: 'vanguard_brokerage',
    name: 'Vanguard Brokerage',
    balance: 25000, 
    type: 'investment'
  },
  {
    id: 'ally_savings',
    name: 'Ally Savings',
    balance: 15000,
    type: 'savings'
  }
]
```

### **Test Selectors**
All tests use `data-testid` attributes for reliable element selection:

| Element | Selector | Purpose |
|---------|----------|---------|
| Create Rule Button | `[data-testid="create-rule-button"]` | Opens rule creation form |
| Trigger Input | `[data-testid="trigger-input"]` | Rule condition input |
| Action Selector | `[data-testid="action-selector"]` | Action type dropdown |
| From Account | `[data-testid="from-account"]` | Source account selection |
| To Account | `[data-testid="to-account"]` | Destination account selection |
| Amount Input | `[data-testid="amount"]` | Transfer amount input |
| Save Button | `[data-testid="save-rule-button"]` | Saves the rule |
| Simulation Toggle | `[data-testid="run-simulation"]` | Enables simulation preview |
| Confirmation Toggle | `[data-testid="require-confirmation"]` | Requires confirmation |

## **Test Execution**

### **Prerequisites**
1. **Dev Server Running**: `pnpm dev` must be running on `http://localhost:5173`
2. **Test Mode**: Tests automatically set `test_mode=true` in localStorage
3. **Mock Data**: Account data must be available in `useAppStore`

### **Running Tests**

#### **Option 1: Robust Test Runner (Recommended)**
```bash
cd apps/web
node test-runner.js
```

**Benefits:**
- Handles PowerShell buffer issues
- Provides clear progress feedback
- Runs tests in manageable chunks
- Detailed failure reporting

#### **Option 2: Direct Playwright Commands**
```bash
# Single test
npx playwright test --grep "should create and execute a Plaid transfer rule" --reporter=line --project=chromium

# All tests (may have terminal issues)
npx playwright test --reporter=list

# Generate HTML report
npx playwright test --reporter=html
```

#### **Option 3: Specific Test Categories**
```bash
# Basic functionality
npx playwright test --grep "should create and execute a Plaid transfer rule" --project=chromium

# Form validation
npx playwright test --grep "should validate form inputs" --project=chromium

# Simulation features
npx playwright test --grep "should handle simulation preview" --project=chromium
```

### **Test Results**

#### **Success Indicators**
- ✅ All test steps complete without errors
- ✅ Expected UI elements are visible and interactive
- ✅ Form submissions work correctly
- ✅ Toast notifications appear
- ✅ Simulation previews render

#### **Common Failure Modes**
1. **Timeout Errors**: Elements not found within 30 seconds
   - **Solution**: Check if dev server is running and responsive
   
2. **Selector Errors**: `data-testid` elements not found
   - **Solution**: Verify component rendering and test data availability
   
3. **Port Connection Errors**: Cannot connect to `localhost:5173`
   - **Solution**: Ensure dev server is running on correct port

4. **Account Selection Errors**: Account options not available
   - **Solution**: Verify mock account data is loaded in `useAppStore`

## **Test Development**

### **Adding New Tests**

1. **Create test file** in `e2e/` directory
2. **Use existing selectors** for consistency
3. **Add proper waits** for component loading
4. **Include error handling** for optional elements
5. **Test one browser** first, then expand to others

### **Example Test Structure**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rules');
    await page.waitForSelector('[data-testid="debug-rulespage"]');
  });

  test('should perform specific action', async ({ page }) => {
    // Test implementation
    await page.click('[data-testid="create-rule-button"]');
    await page.waitForSelector('[data-testid="action-selector"]');
    // ... more test steps
  });
});
```

### **Best Practices**

1. **Use data-testid**: Always use `data-testid` for element selection
2. **Add explicit waits**: Wait for elements to be visible before interaction
3. **Handle optional elements**: Check if elements exist before interacting
4. **Use realistic data**: Use mock data that matches real-world scenarios
5. **Test user flows**: Focus on complete user journeys, not just individual components

## **Troubleshooting**

### **Terminal Issues**
- **PowerShell Buffer**: Use `test-runner.js` instead of direct commands
- **Long Output**: Use `--reporter=line` for concise output
- **Hanging Tests**: Check dev server responsiveness

### **Test Failures**
- **Element Not Found**: Verify component rendering and test data
- **Timeout Errors**: Increase timeouts or check server performance
- **Port Issues**: Ensure dev server runs on correct port (5173)

### **Debugging**
1. **Screenshots**: Tests automatically capture screenshots on failure
2. **Console Logs**: Check browser console for JavaScript errors
3. **Trace Files**: Use `--trace on` for detailed execution traces
4. **Manual Verification**: Test the same flow manually in browser

## **Performance Considerations**

### **Test Execution Time**
- **Single Test**: ~30-60 seconds
- **Full Suite**: ~5-10 minutes
- **With Retries**: ~15-20 minutes

### **Optimization Tips**
- Run tests on single browser first (`--project=chromium`)
- Use specific grep patterns to run targeted tests
- Increase timeouts only when necessary
- Use `--workers=1` for debugging

## **Future Enhancements**

### **Planned Improvements**
1. **Component Tests**: Add individual component testing
2. **Unit Tests**: Add business logic unit tests
3. **Visual Regression**: Add visual comparison tests
4. **Performance Tests**: Add load and performance testing
5. **API Tests**: Add backend API integration tests

### **CI/CD Integration**
- GitHub Actions workflow for automated testing
- Pre-commit hooks for test validation
- Automated test reporting and notifications
- Test coverage reporting

---

**Last Updated**: December 2024  
**Version**: VX.1  
**Status**: Complete for Phase X 