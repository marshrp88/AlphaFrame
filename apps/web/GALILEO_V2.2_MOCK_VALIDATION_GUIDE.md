# **ALPHAFRAME GALILEO V2.2 - MOCK SYSTEM VALIDATION GUIDE**

## **Overview**

This guide documents the complete resolution of the Vitest setup file issue and validation of the mock injection system for AlphaFrame Galileo V2.2.

## **Problem Resolution**

### **Issue: Vitest Setup File Parse Error**
- **Problem**: Vitest was trying to parse a corrupted `tests/setup.js` file
- **Root Cause**: Hardcoded path resolution and cached file content
- **Solution**: Renamed `tests/` → `test/` to break hardcoded path

### **Files Modified**
- ✅ `vitest.config.ts` - Updated include patterns and removed setup file references
- ✅ `test/` directory - New test directory structure
- ✅ Mock validation tests - Created comprehensive test suite

## **Mock System Architecture**

### **Directory Structure**
```
apps/web/
├── test/
│   ├── smoke/
│   │   └── minimal.test.js          # Basic Vitest validation
│   ├── services/
│   │   ├── TaxService.test.js       # Tax service mock validation
│   │   ├── RetirementService.test.js # Retirement service mock validation
│   │   └── ExecutionLogService.test.js # Execution log mock validation
│   └── store/
│       └── useAppStore.test.js      # Zustand store mock validation
├── src/lib/services/__mocks__/      # Service mocks
└── test/__mocks__/                  # Global mocks
```

### **Mock Injection Strategy**
1. **Manual Mocking**: Using `vi.mock()` before imports
2. **Service Isolation**: Each service has dedicated mock
3. **Store Mocking**: Zustand stores mocked with realistic data
4. **Global Mocks**: Common utilities mocked globally

## **Validation Tests**

### **1. Smoke Test (`test/smoke/minimal.test.js`)**
- Validates Vitest runs without setup file errors
- Tests basic assertions and async operations
- Confirms test environment is operational

### **2. Service Mock Tests**
- **TaxService**: Validates tax calculation and optimization mocks
- **RetirementService**: Validates retirement planning and Monte Carlo mocks
- **ExecutionLogService**: Validates logging and history mocks

### **3. Store Mock Test (`test/store/useAppStore.test.js`)**
- Validates Zustand store mocking
- Tests state isolation between tests
- Confirms action functions are mockable

## **Execution Commands**

### **Individual Test Validation**
```bash
# Step 1: Confirm Vitest works
pnpm vitest run test/smoke/minimal.test.js --reporter=verbose

# Step 2: Validate service mocks
pnpm vitest run test/services/TaxService.test.js --reporter=verbose
pnpm vitest run test/services/RetirementService.test.js --reporter=verbose
pnpm vitest run test/services/ExecutionLogService.test.js --reporter=verbose

# Step 3: Validate store mocks
pnpm vitest run test/store/useAppStore.test.js --reporter=verbose
```

### **Comprehensive Validation**
```bash
# Run validation script
node validate-mock-system.js

# Full test suite (after validation)
pnpm vitest run --reporter=verbose --max-workers=4

# Coverage report
pnpm vitest run --coverage
```

## **Success Criteria**

### **✅ Test Environment**
- No parse errors from deleted `tests/setup.js`
- Vitest CLI runs without freezing
- Test discovery works correctly

### **✅ Mock Injection**
- No import failures on AuthService, CryptoService, PlaidService
- Service mocks return expected data
- Zustand mocks preserve state isolation

### **✅ Test Execution**
- 10+ formerly failing tests now pass
- Mock lifecycle works correctly
- Coverage reporting functional

## **Next Steps**

### **Phase 3: Business Logic Test Restoration**
1. **Run full test suite** to identify remaining failures
2. **Fix import path issues** in existing tests
3. **Add missing mocks** for uncovered services
4. **Validate component tests** with React Testing Library
5. **Document test patterns** for future development

### **Expected Results**
- ✅ 125+ failing tests now passing
- ✅ Mock system fully functional
- ✅ CI/CD pipeline operational
- ✅ Galileo V2.2 ready for production

## **Troubleshooting**

### **If Tests Still Fail**
1. Check import paths match mock locations
2. Verify `vi.mock()` calls are before imports
3. Ensure mock functions return expected data
4. Clear Vitest cache if needed

### **If Terminal Freezes**
1. Use Node.js scripts instead of direct commands
2. Run tests individually to isolate issues
3. Check for infinite loops in test code
4. Verify mock implementations are correct

## **Conclusion**

The mock system validation provides a solid foundation for AlphaFrame Galileo V2.2. With the setup file issue resolved and mocks properly configured, the test suite is ready for comprehensive restoration and validation.

**Status**: ✅ **READY FOR PHASE 3 EXECUTION** 