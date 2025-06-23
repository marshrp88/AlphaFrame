# E2E Test Solution with Dynamic Port Detection

## 🎯 **Problem Solved**

**Issue:** E2E tests were failing due to port mismatch between Vite dev server and Playwright configuration. Vite automatically increments ports (5173 → 5174 → 5175 → 5176) when ports are in use, but Playwright was hardcoded to target specific ports, causing test timeouts.

**Solution:** Implemented dynamic port detection that automatically detects the actual Vite dev server port and configures Playwright accordingly.

---

## 🛠️ **Implementation Details**

### **Core Components**

1. **`run-e2e-tests.js`** - Main test runner script
2. **`playwright.config.js`** - Updated with dynamic port detection
3. **`e2e/global-setup.js`** - Simplified global setup
4. **`package.json`** - Added `test:e2e` script

### **How It Works**

1. **Port Detection:** Spawns Vite dev server and parses output for port number
2. **Dynamic Configuration:** Updates Playwright config with detected port
3. **Test Execution:** Runs E2E tests against correct port
4. **Cleanup:** Restores original config and stops dev server

---

## 🚀 **Usage**

### **Run E2E Tests**
```bash
# From apps/web directory
pnpm test:e2e

# Or directly
node run-e2e-tests.js
```

### **Manual Playwright Tests**
```bash
# Standard Playwright commands still work
npx playwright test
npx playwright test --headed
npx playwright show-report
```

---

## 📋 **Test Files**

### **E2E Test Suite**
- `e2e/golden-path.spec.js` - Main user journey tests
- `e2e/framesync.spec.js` - FrameSync feature tests
- `e2e/rules.spec.js` - Rules management tests
- `e2e/vx1-comprehensive-validation.spec.js` - Comprehensive validation

### **Test Utilities**
- `e2e/browser-validation-runner.js` - Browser compatibility tests
- `e2e/global-setup.js` - Global test setup

---

## 🔧 **Technical Architecture**

### **Dynamic Port Detection Flow**
```
1. Start Vite dev server
   ↓
2. Parse stdout for "Local: http://localhost:PORT"
   ↓
3. Extract port number
   ↓
4. Update Playwright config with detected port
   ↓
5. Run E2E tests
   ↓
6. Cleanup and restore config
```

### **Error Handling**
- **Timeout Protection:** 15-second timeout for port detection
- **Process Management:** Proper cleanup of spawned processes
- **Config Backup:** Original config restored after tests
- **Graceful Failure:** Clear error messages and exit codes

---

## 🎯 **Success Metrics**

### **Before (Failing)**
- ❌ Tests timeout waiting for app to load
- ❌ Port mismatch errors
- ❌ Inconsistent test results
- ❌ Manual port configuration required

### **After (Working)**
- ✅ Automatic port detection
- ✅ Reliable test execution
- ✅ Consistent test results
- ✅ Zero manual configuration

---

## 🧪 **Testing the Solution**

### **Verification Steps**
1. **Start dev server:** `pnpm dev` (note the port)
2. **Run E2E tests:** `pnpm test:e2e`
3. **Verify detection:** Check console for "Detected Vite dev server on port: XXXX"
4. **Check results:** Tests should pass without port-related timeouts

### **Debug Mode**
```bash
# Run with verbose output
DEBUG=* node run-e2e-tests.js
```

---

## 🔄 **Integration with CI/CD**

### **GitHub Actions Integration**
```yaml
- name: Run E2E Tests
  run: |
    cd apps/web
    pnpm test:e2e
```

### **Environment Variables**
- `CI=true` - Disables reuse of existing server
- `DEBUG=*` - Enables verbose logging

---

## 📚 **Related Documentation**

- [Playwright Configuration](./playwright.config.js)
- [E2E Test Files](./e2e/)
- [Test Results](./playwright-report/)
- [Development Setup](./DEVELOPMENT.md)

---

## 🎉 **Benefits Achieved**

1. **Reliability:** Tests now run consistently regardless of port conflicts
2. **Automation:** Zero manual intervention required
3. **Maintainability:** Self-healing port detection
4. **Developer Experience:** Simple `pnpm test:e2e` command
5. **CI/CD Ready:** Works seamlessly in automated environments

---

## ✅ **Status: IMPLEMENTED & TESTED**

**Implementation Date:** December 2024  
**Status:** ✅ Production Ready  
**Test Coverage:** ✅ All E2E scenarios  
**Documentation:** ✅ Complete  

This solution resolves the critical port mismatch issue and provides a robust foundation for E2E testing in the AlphaFrame project. 