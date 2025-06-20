/**
 * Browser-Compatible AlphaFrame VX.1 Validation Runner
 * 
 * This version is designed to run in the browser context and can be injected
 * via Playwright's addInitScript method.
 */

// Make the validation runner available globally in the browser
window.ComprehensiveValidationRunner = class ComprehensiveValidationRunner {
  constructor() {
    this.testResults = [];
    this.overallResults = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      successRate: 0,
      testSuites: []
    };
  }

  /**
   * Log test result
   */
  logResult(testName, passed, details = '') {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`[${passed ? '✅' : '❌'}] ${testName}: ${details}`);
  }

  /**
   * Test 1: Browser Environment Validation
   */
  async testBrowserEnvironment() {
    this.currentTest = 'Browser Environment';
    
    try {
      // Test window object
      const hasWindow = typeof window !== 'undefined';
      this.logResult(this.currentTest, hasWindow, 
        hasWindow ? 'Window object available' : 'Window object not available');
      
      // Test localStorage
      const hasLocalStorage = typeof localStorage !== 'undefined';
      this.logResult('LocalStorage', hasLocalStorage, 
        hasLocalStorage ? 'LocalStorage available' : 'LocalStorage not available');
      
      // Test IndexedDB
      const hasIndexedDB = typeof indexedDB !== 'undefined';
      this.logResult('IndexedDB', hasIndexedDB, 
        hasIndexedDB ? 'IndexedDB available' : 'IndexedDB not available');
      
      // Test fetch API
      const hasFetch = typeof fetch !== 'undefined';
      this.logResult('Fetch API', hasFetch, 
        hasFetch ? 'Fetch API available' : 'Fetch API not available');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Browser environment test failed: ${error.message}`);
    }
  }

  /**
   * Test 2: App Loading Validation
   */
  async testAppLoading() {
    this.currentTest = 'App Loading';
    
    try {
      // Test if React is loaded
      const hasReact = typeof React !== 'undefined';
      this.logResult(this.currentTest, hasReact, 
        hasReact ? 'React loaded successfully' : 'React not loaded');
      
      // Test if the app root element exists
      const appRoot = document.getElementById('root');
      const hasAppRoot = !!appRoot;
      this.logResult('App Root Element', hasAppRoot, 
        hasAppRoot ? 'App root element found' : 'App root element not found');
      
      // Test if the app has rendered content
      const hasContent = appRoot && appRoot.children.length > 0;
      this.logResult('App Content', hasContent, 
        hasContent ? 'App has rendered content' : 'App has no rendered content');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `App loading test failed: ${error.message}`);
    }
  }

  /**
   * Test 3: Store Integration Validation
   */
  async testStoreIntegration() {
    this.currentTest = 'Store Integration';
    
    try {
      // Test localStorage persistence
      localStorage.setItem('alphaframe_test_key', 'test_value');
      const retrieved = localStorage.getItem('alphaframe_test_key');
      localStorage.removeItem('alphaframe_test_key');
      const localStorageWorks = retrieved === 'test_value';
      this.logResult('LocalStorage Persistence', localStorageWorks, 
        localStorageWorks ? 'LocalStorage is accessible and persistent.' : 'LocalStorage failed.');

      // Check for auth token as evidence of authStore working
      const authToken = localStorage.getItem('alphaframe_access_token');
      this.logResult('Auth Store Evidence', !!authToken, 
        authToken ? 'Auth token found in localStorage.' : 'Auth token not found.');

    } catch (error) {
      this.logResult(this.currentTest, false, `Store integration test failed: ${error.message}`);
    }
  }

  /**
   * Test 4: Service Availability Validation
   */
  async testServiceAvailability() {
    this.currentTest = 'Service Availability';
    
    try {
        // Check for sync status widget as evidence of syncEngine
        const syncWidget = document.querySelector('[data-testid="sync-status-widget"]');
        const syncStatusText = syncWidget ? syncWidget.textContent : '';
        const isConnected = syncStatusText.includes('Connected');
        this.logResult('Sync Engine Evidence', isConnected, 
            isConnected ? 'SyncStatusWidget shows "Connected".' : 'SyncStatusWidget not found or not connected.');

        // Check for logs in IndexedDB as evidence of ExecutionLogService
        const logs = await this.getLogsFromIndexedDB();
        const hasLogs = logs.length > 0;
        this.logResult('ExecutionLogService Evidence', hasLogs, 
            hasLogs ? `Found ${logs.length} logs in IndexedDB.` : 'No logs found in IndexedDB.');

    } catch (error) {
      this.logResult(this.currentTest, false, `Service availability test failed: ${error.message}`);
    }
  }

  /**
   * Test 5: UI Component Validation
   */
  async testUIComponents() {
    this.currentTest = 'UI Components';
    
    try {
      // Test if key UI elements are present
      const uiElements = [
        { selector: 'body', name: 'Body Element' },
        { selector: '#root', name: 'Root Element' },
        { selector: 'div', name: 'Div Elements' },
        { selector: 'button', name: 'Button Elements' }
      ];
      
      let presentElements = 0;
      for (const element of uiElements) {
        const found = document.querySelectorAll(element.selector);
        if (found.length > 0) {
          presentElements++;
          console.log(`✅ ${element.name}: ${found.length} found`);
        } else {
          console.log(`❌ ${element.name}: not found`);
        }
      }
      
      this.logResult(this.currentTest, presentElements > 0, 
        `${presentElements}/${uiElements.length} UI element types present`);
      
    } catch (error) {
      this.logResult(this.currentTest, false, `UI component test failed: ${error.message}`);
    }
  }

  /**
   * Test 6: Network Connectivity Validation
   */
  async testNetworkConnectivity() {
    this.currentTest = 'Network Connectivity';
    
    try {
      // Test if we can make network requests
      const testUrl = 'https://httpbin.org/get';
      
      try {
        const response = await fetch(testUrl, { 
          method: 'GET',
          mode: 'cors'
        });
        
        const isSuccess = response.ok;
        this.logResult(this.currentTest, isSuccess, 
          isSuccess ? 'Network connectivity working' : 'Network request failed');
        
      } catch (error) {
        this.logResult(this.currentTest, false, `Network test failed: ${error.message}`);
      }
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Network connectivity test failed: ${error.message}`);
    }
  }

  /**
   * Test 7: Performance Validation
   */
  async testPerformance() {
    this.currentTest = 'Performance';
    
    try {
      // Test page load performance
      const loadTime = performance.now();
      this.logResult(this.currentTest, loadTime < 10000, 
        `Page load time: ${loadTime.toFixed(2)}ms`);
      
      // Test memory usage (if available)
      if (performance.memory) {
        const memoryUsage = performance.memory.usedJSHeapSize;
        const memoryLimit = performance.memory.jsHeapSizeLimit;
        const memoryPercent = (memoryUsage / memoryLimit) * 100;
        
        this.logResult('Memory Usage', memoryPercent < 80, 
          `Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB (${memoryPercent.toFixed(1)}%)`);
      }
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Performance test failed: ${error.message}`);
    }
  }

  /**
   * Test 8: Security Validation
   */
  async testSecurity() {
    this.currentTest = 'Security';
    
    try {
      // Test if we're running on HTTPS or localhost
      const isSecure = location.protocol === 'https:' || location.hostname === 'localhost';
      this.logResult(this.currentTest, isSecure, 
        isSecure ? 'Running on secure context' : 'Not running on secure context');
      
      // Test if service workers are available
      const hasServiceWorker = 'serviceWorker' in navigator;
      this.logResult('Service Worker Support', hasServiceWorker, 
        hasServiceWorker ? 'Service workers available' : 'Service workers not available');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Security test failed: ${error.message}`);
    }
  }

  /**
   * Run all validation tests
   */
  async runComprehensiveValidation() {
    console.log('🚀 Starting AlphaFrame VX.1 Browser-Based Comprehensive Validation\n');
    
    await this.testBrowserEnvironment();
    await this.testAppLoading();
    await this.testStoreIntegration();
    await this.testServiceAvailability();
    await this.testUIComponents();
    await this.testNetworkConnectivity();
    await this.testPerformance();
    await this.testSecurity();
    
    // Generate test summary
    const passedTests = this.testResults.filter(r => r.passed).length;
    const totalTests = this.testResults.length;
    const successRate = (passedTests / totalTests * 100).toFixed(1);
    
    console.log('\n📊 Browser-Based Validation Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    // Production readiness assessment
    const isProductionReady = successRate >= 90;
    console.log(`\n🚀 PRODUCTION READINESS ASSESSMENT:`);
    console.log(`   ${isProductionReady ? '✅' : '❌'} AlphaFrame VX.1 is ${isProductionReady ? 'READY' : 'NOT READY'} for production deployment`);
    
    if (isProductionReady) {
      console.log(`   🎉 Browser-based validation successful`);
      console.log(`   🚀 Ready for Phase X UI/UX finalization and market launch`);
    } else {
      console.log(`   ⚠️  Critical issues detected - requires resolution before deployment`);
    }
    
    // Return test results
    const results = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: parseFloat(successRate),
        productionReady: isProductionReady
      },
      results: this.testResults,
      timestamp: new Date().toISOString(),
      environment: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        protocol: location.protocol,
        hostname: location.hostname
      }
    };
    
    return results;
  }

  /**
   * Helper to get logs from IndexedDB
   */
  async getLogsFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('alphaframe-logs', 1);
      request.onerror = (event) => reject('Database error: ' + event.target.errorCode);
      request.onsuccess = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('logs')) {
          resolve([]);
          return;
        }
        const transaction = db.transaction(['logs'], 'readonly');
        const store = transaction.objectStore('logs');
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => resolve(getAllRequest.result);
        getAllRequest.onerror = (event) => reject('Request error: ' + event.target.errorCode);
      };
    });
  }
};

// Also expose a simple function for direct calling
window.runAlphaFrameValidation = async () => {
  const runner = new window.ComprehensiveValidationRunner();
  return await runner.runComprehensiveValidation();
}; 