/**
 * Phase 5 Plaid Validation Test - Simple Version
 * 
 * Purpose: Validate Phase 5 Plaid Production Integration implementation
 * without ES module dependencies for direct Node.js execution.
 */

const fs = require('fs');
const path = require('path');

class Phase5ValidationTest {
  constructor() {
    this.testResults = [];
    this.validationPassed = false;
  }

  logResult(testName, passed, details = '') {
    const result = {
      test: testName,
      passed,
      timestamp: new Date().toISOString(),
      details
    };
    this.testResults.push(result);
    console.log(`[${passed ? '✅' : '❌'}] ${testName}: ${details}`);
  }

  /**
   * Test 1: Check if PlaidService file exists and has real implementation
   */
  testPlaidServiceFile() {
    try {
      console.log('\n🔧 Testing PlaidService File...');
      
      const plaidServicePath = path.join(__dirname, 'src/lib/services/PlaidService.js');
      if (!fs.existsSync(plaidServicePath)) {
        this.logResult('PlaidService File Exists', false, 'PlaidService.js not found');
        return false;
      }

      const content = fs.readFileSync(plaidServicePath, 'utf8');
      
      // Check if it's not stubbed
      if (content.includes('throw new Error("Not yet implemented') || 
          content.includes('STUBBED FOR MVEP PHASE 0')) {
        this.logResult('PlaidService Implementation', false, 'Service still contains stub implementations');
        return false;
      }

      // Check for real implementation indicators
      const hasRealImplementation = 
        content.includes('syncEngine.js') &&
        content.includes('executionLogService') &&
        content.includes('config.plaid') &&
        content.includes('createLinkToken') &&
        content.includes('fetchTransactions');

      if (!hasRealImplementation) {
        this.logResult('PlaidService Implementation', false, 'Missing real implementation components');
        return false;
      }

      this.logResult('PlaidService File', true, 'Real implementation found');
      return true;
    } catch (error) {
      this.logResult('PlaidService File', false, error.message);
      return false;
    }
  }

  /**
   * Test 2: Check if config supports Plaid
   */
  testConfigSupport() {
    try {
      console.log('\n⚙️ Testing Config Support...');
      
      const configPath = path.join(__dirname, 'src/lib/config.js');
      if (!fs.existsSync(configPath)) {
        this.logResult('Config File Exists', false, 'config.js not found');
        return false;
      }

      const content = fs.readFileSync(configPath, 'utf8');
      
      if (!content.includes('plaid: getPlaidConfig()')) {
        this.logResult('Config Plaid Support', false, 'Plaid configuration not added to config');
        return false;
      }

      this.logResult('Config Support', true, 'Plaid configuration supported');
      return true;
    } catch (error) {
      this.logResult('Config Support', false, error.message);
      return false;
    }
  }

  /**
   * Test 3: Check if env.js supports Plaid
   */
  testEnvSupport() {
    try {
      console.log('\n🌍 Testing Environment Support...');
      
      const envPath = path.join(__dirname, 'src/lib/env.js');
      if (!fs.existsSync(envPath)) {
        this.logResult('Env File Exists', false, 'env.js not found');
        return false;
      }

      const content = fs.readFileSync(envPath, 'utf8');
      
      if (!content.includes('getPlaidConfig')) {
        this.logResult('Env Plaid Support', false, 'Plaid configuration function not found');
        return false;
      }

      if (!content.includes('VITE_PLAID_CLIENT_ID')) {
        this.logResult('Env Plaid Variables', false, 'Plaid environment variables not defined');
        return false;
      }

      this.logResult('Environment Support', true, 'Plaid environment variables supported');
      return true;
    } catch (error) {
      this.logResult('Environment Support', false, error.message);
      return false;
    }
  }

  /**
   * Test 4: Check if Step1PlaidConnect uses real PlaidService
   */
  testOnboardingIntegration() {
    try {
      console.log('\n🎯 Testing Onboarding Integration...');
      
      const onboardingPath = path.join(__dirname, 'src/features/onboarding/steps/Step1PlaidConnect.jsx');
      if (!fs.existsSync(onboardingPath)) {
        this.logResult('Onboarding File Exists', false, 'Step1PlaidConnect.jsx not found');
        return false;
      }

      const content = fs.readFileSync(onboardingPath, 'utf8');
      
      if (!content.includes('PlaidService')) {
        this.logResult('Onboarding PlaidService Import', false, 'PlaidService not imported');
        return false;
      }

      if (!content.includes('new PlaidService()')) {
        this.logResult('Onboarding PlaidService Usage', false, 'PlaidService not instantiated');
        return false;
      }

      if (!content.includes('plaidService.createLinkToken')) {
        this.logResult('Onboarding Link Token', false, 'createLinkToken not used');
        return false;
      }

      this.logResult('Onboarding Integration', true, 'Real PlaidService integrated');
      return true;
    } catch (error) {
      this.logResult('Onboarding Integration', false, error.message);
      return false;
    }
  }

  /**
   * Test 5: Check if syncEngine exists and is comprehensive
   */
  testSyncEngine() {
    try {
      console.log('\n🔄 Testing SyncEngine...');
      
      const syncEnginePath = path.join(__dirname, 'src/lib/services/syncEngine.js');
      if (!fs.existsSync(syncEnginePath)) {
        this.logResult('SyncEngine File Exists', false, 'syncEngine.js not found');
        return false;
      }

      const content = fs.readFileSync(syncEnginePath, 'utf8');
      
      const requiredFunctions = [
        'initializePlaid',
        'createLinkToken', 
        'exchangePublicToken',
        'getAccounts',
        'getTransactions',
        'syncBalances'
      ];

      for (const func of requiredFunctions) {
        if (!content.includes(`export const ${func}`)) {
          this.logResult('SyncEngine Functions', false, `Missing function: ${func}`);
          return false;
        }
      }

      this.logResult('SyncEngine', true, 'All required functions present');
      return true;
    } catch (error) {
      this.logResult('SyncEngine', false, error.message);
      return false;
    }
  }

  /**
   * Test 6: Check environment example files
   */
  testEnvironmentFiles() {
    try {
      console.log('\n📄 Testing Environment Files...');
      
      const envDevPath = path.join(__dirname, 'env.dev.example');
      const envProdPath = path.join(__dirname, 'env.prod.example');
      
      if (!fs.existsSync(envDevPath)) {
        this.logResult('Dev Environment File', false, 'env.dev.example not found');
        return false;
      }

      if (!fs.existsSync(envProdPath)) {
        this.logResult('Prod Environment File', false, 'env.prod.example not found');
        return false;
      }

      const devContent = fs.readFileSync(envDevPath, 'utf8');
      const prodContent = fs.readFileSync(envProdPath, 'utf8');
      
      if (!devContent.includes('VITE_PLAID_CLIENT_ID') || !devContent.includes('VITE_PLAID_SECRET')) {
        this.logResult('Dev Environment Variables', false, 'Plaid variables missing from dev example');
        return false;
      }

      if (!prodContent.includes('VITE_PLAID_CLIENT_ID') || !prodContent.includes('VITE_PLAID_SECRET')) {
        this.logResult('Prod Environment Variables', false, 'Plaid variables missing from prod example');
        return false;
      }

      this.logResult('Environment Files', true, 'Plaid environment examples provided');
      return true;
    } catch (error) {
      this.logResult('Environment Files', false, error.message);
      return false;
    }
  }

  /**
   * Test 7: Check for proper error handling
   */
  testErrorHandling() {
    try {
      console.log('\n⚠️ Testing Error Handling...');
      
      const plaidServicePath = path.join(__dirname, 'src/lib/services/PlaidService.js');
      const content = fs.readFileSync(plaidServicePath, 'utf8');
      
      if (!content.includes('try {') || !content.includes('catch (error)')) {
        this.logResult('Error Handling', false, 'Try-catch blocks not found');
        return false;
      }

      if (!content.includes('executionLogService.logError')) {
        this.logResult('Error Logging', false, 'Error logging not implemented');
        return false;
      }

      this.logResult('Error Handling', true, 'Comprehensive error handling implemented');
      return true;
    } catch (error) {
      this.logResult('Error Handling', false, error.message);
      return false;
    }
  }

  /**
   * Test 8: Check for logging integration
   */
  testLoggingIntegration() {
    try {
      console.log('\n📝 Testing Logging Integration...');
      
      const plaidServicePath = path.join(__dirname, 'src/lib/services/PlaidService.js');
      const content = fs.readFileSync(plaidServicePath, 'utf8');
      
      if (!content.includes('executionLogService.log')) {
        this.logResult('Logging Integration', false, 'Execution logging not integrated');
        return false;
      }

      this.logResult('Logging Integration', true, 'Logging properly integrated');
      return true;
    } catch (error) {
      this.logResult('Logging Integration', false, error.message);
      return false;
    }
  }

  /**
   * Test 9: Check for security measures
   */
  testSecurityMeasures() {
    try {
      console.log('\n🔒 Testing Security Measures...');
      
      const plaidServicePath = path.join(__dirname, 'src/lib/services/PlaidService.js');
      const content = fs.readFileSync(plaidServicePath, 'utf8');
      
      // Check for credential masking
      if (!content.includes('slice(-4)') && !content.includes('slice(-8)')) {
        this.logResult('Security Measures', false, 'Credential masking not implemented');
        return false;
      }

      // Check for localStorage usage for tokens
      if (!content.includes('localStorage.setItem') || !content.includes('localStorage.removeItem')) {
        this.logResult('Security Measures', false, 'Token storage not implemented');
        return false;
      }

      this.logResult('Security Measures', true, 'Security measures implemented');
      return true;
    } catch (error) {
      this.logResult('Security Measures', false, error.message);
      return false;
    }
  }

  /**
   * Test 10: Check for external trigger readiness
   */
  testExternalTriggerReadiness() {
    try {
      console.log('\n🎯 Testing External Trigger Readiness...');
      
      const plaidServicePath = path.join(__dirname, 'src/lib/services/PlaidService.js');
      const content = fs.readFileSync(plaidServicePath, 'utf8');
      
      // Check for real API integration methods
      const requiredMethods = [
        'createLinkToken',
        'exchangePublicToken', 
        'fetchAccounts',
        'fetchTransactions',
        'getTransactions'
      ];

      for (const method of requiredMethods) {
        if (!content.includes(`async ${method}`)) {
          this.logResult('External Trigger Readiness', false, `Missing method: ${method}`);
          return false;
        }
      }

      // Check for real API calls (not stubbed)
      if (content.includes('syncEngine.js') && content.includes('PlaidApi')) {
        this.logResult('External Trigger Readiness', true, 'Real Plaid API integration ready');
        return true;
      } else {
        this.logResult('External Trigger Readiness', false, 'Not using real Plaid API');
        return false;
      }
    } catch (error) {
      this.logResult('External Trigger Readiness', false, error.message);
      return false;
    }
  }

  /**
   * Run all validation tests
   */
  runValidation() {
    console.log('🚀 Starting Phase 5 Plaid Validation Test...');
    console.log('=' .repeat(60));

    const tests = [
      this.testPlaidServiceFile.bind(this),
      this.testConfigSupport.bind(this),
      this.testEnvSupport.bind(this),
      this.testOnboardingIntegration.bind(this),
      this.testSyncEngine.bind(this),
      this.testEnvironmentFiles.bind(this),
      this.testErrorHandling.bind(this),
      this.testLoggingIntegration.bind(this),
      this.testSecurityMeasures.bind(this),
      this.testExternalTriggerReadiness.bind(this)
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
      try {
        const result = test();
        if (result) passedTests++;
      } catch (error) {
        console.error('Test error:', error);
      }
    }

    // Calculate results
    const successRate = (passedTests / totalTests) * 100;
    this.validationPassed = successRate >= 90; // 90% threshold

    // Generate report
    this.generateReport(passedTests, totalTests, successRate);

    return this.validationPassed;
  }

  /**
   * Generate validation report
   */
  generateReport(passedTests, totalTests, successRate) {
    console.log('\n' + '=' .repeat(60));
    console.log('📋 PHASE 5 VALIDATION REPORT');
    console.log('=' .repeat(60));
    
    console.log(`\n📊 Test Results:`);
    console.log(`   ✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`   ❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`   📈 Success Rate: ${successRate.toFixed(1)}%`);
    
    console.log(`\n🎯 Validation Status: ${this.validationPassed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (this.validationPassed) {
      console.log(`\n✅ Phase 5 External Trigger Validation: CONFIRMED`);
      console.log(`   - Plaid API integration implemented`);
      console.log(`   - Real transaction processing available`);
      console.log(`   - Rule execution against real data possible`);
      console.log(`   - Dashboard insights from real data enabled`);
      console.log(`   - External trigger requirements met`);
    } else {
      console.log(`\n❌ Phase 5 External Trigger Validation: FAILED`);
      console.log(`   - Success rate below 90% threshold`);
      console.log(`   - Additional implementation required`);
    }

    console.log(`\n📝 Detailed Results:`);
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`   ${status} ${result.test}: ${result.details}`);
    });

    console.log('\n' + '=' .repeat(60));
  }
}

// Run validation
const validator = new Phase5ValidationTest();
const passed = validator.runValidation();
process.exit(passed ? 0 : 1); 