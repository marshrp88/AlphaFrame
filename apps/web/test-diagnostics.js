#!/usr/bin/env node

/**
 * Playwright Test Diagnostics Script
 * 
 * Purpose: Parse Playwright JSON report and extract detailed failure information
 * Procedure: Read JSON file, iterate through test results, categorize failures
 * Conclusion: Provides actionable failure details for targeted fixes
 */

const fs = require('fs');
const path = require('path');

// Read the Playwright JSON report
const reportPath = path.join(__dirname, 'playwright-report.json');

if (!fs.existsSync(reportPath)) {
  console.log('❌ playwright-report.json not found. Run tests first with:');
  console.log('   npx playwright test --reporter=json > playwright-report.json');
  process.exit(1);
}

try {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  
  console.log('\n🔍 PLAYWRIGHT TEST DIAGNOSTICS REPORT');
  console.log('=====================================\n');
  
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  
  const failures = [];
  
  // Process each test suite
  report.suites.forEach(suite => {
    suite.specs.forEach(spec => {
      spec.tests.forEach(test => {
        totalTests++;
        
        switch (test.status) {
          case 'passed':
            passedTests++;
            break;
          case 'failed':
            failedTests++;
            failures.push({
              title: spec.title,
              file: spec.file,
              error: test.errors?.[0]?.message || 'Unknown error',
              duration: test.duration
            });
            break;
          case 'skipped':
            skippedTests++;
            break;
        }
      });
    });
  });
  
  // Summary statistics
  console.log(`📊 SUMMARY:`);
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   ⏭️  Skipped: ${skippedTests}`);
  console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n`);
  
  if (failures.length > 0) {
    console.log(`❌ FAILURES (${failures.length}):`);
    console.log('=====================================\n');
    
    // Group failures by error type for easier triage
    const errorGroups = {};
    
    failures.forEach(failure => {
      const errorKey = failure.error.includes('timeout') ? 'TIMEOUT' :
                      failure.error.includes('selector') ? 'SELECTOR' :
                      failure.error.includes('connection') ? 'CONNECTION' :
                      failure.error.includes('not found') ? 'NOT_FOUND' :
                      'OTHER';
      
      if (!errorGroups[errorKey]) {
        errorGroups[errorKey] = [];
      }
      errorGroups[errorKey].push(failure);
    });
    
    // Display failures by category
    Object.entries(errorGroups).forEach(([category, categoryFailures]) => {
      console.log(`\n🔴 ${category} ERRORS (${categoryFailures.length}):`);
      categoryFailures.forEach(failure => {
        console.log(`   • ${failure.title}`);
        console.log(`     File: ${failure.file}`);
        console.log(`     Error: ${failure.error}`);
        console.log(`     Duration: ${failure.duration}ms\n`);
      });
    });
    
    // Provide recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('==================');
    
    if (errorGroups.TIMEOUT) {
      console.log('⏰ TIMEOUT ISSUES:');
      console.log('   - Increase test timeouts in playwright.config.js');
      console.log('   - Check for slow-loading components or API calls');
      console.log('   - Verify server startup timing\n');
    }
    
    if (errorGroups.SELECTOR || errorGroups.NOT_FOUND) {
      console.log('🎯 SELECTOR ISSUES:');
      console.log('   - Verify element selectors exist in current UI');
      console.log('   - Check for conditional rendering or dynamic content');
      console.log('   - Ensure test data matches expected UI state\n');
    }
    
    if (errorGroups.CONNECTION) {
      console.log('🌐 CONNECTION ISSUES:');
      console.log('   - Verify server is running on correct port');
      console.log('   - Check for port conflicts or firewall issues');
      console.log('   - Ensure test environment matches dev environment\n');
    }
    
  } else {
    console.log('🎉 All tests passed! No failures to analyze.');
  }
  
} catch (error) {
  console.error('❌ Error parsing report:', error.message);
  process.exit(1);
} 