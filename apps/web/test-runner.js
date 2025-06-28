#!/usr/bin/env node

/**
 * Robust Test Runner for Playwright
 * 
 * Purpose: Run Playwright tests without PowerShell buffer issues
 * Procedure: Execute tests in chunks with proper output handling
 * Conclusion: Provides reliable test execution and clear results
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 AlphaFrame Test Runner Starting...\n');

// Test configurations
const testConfigs = [
  {
    name: 'Basic Component Tests',
    command: 'npx playwright test --grep "should create and execute a Plaid transfer rule" --reporter=line --project=chromium',
    timeout: 60000
  },
  {
    name: 'Form Validation Tests', 
    command: 'npx playwright test --grep "should validate form inputs" --reporter=line --project=chromium',
    timeout: 60000
  },
  {
    name: 'Simulation Tests',
    command: 'npx playwright test --grep "should handle simulation preview" --reporter=line --project=chromium', 
    timeout: 60000
  }
];

/**
 * Run a single test configuration
 */
function runTest(config) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔍 Running: ${config.name}`);
    console.log(`⏱️  Timeout: ${config.timeout}ms`);
    console.log(`📝 Command: ${config.command}\n`);

    const child = spawn(config.command, [], {
      cwd: __dirname,
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: config.timeout
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      process.stdout.write(output);
    });

    child.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      process.stderr.write(output);
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${config.name} - PASSED`);
        resolve({ success: true, stdout, stderr });
      } else {
        console.log(`\n❌ ${config.name} - FAILED (code: ${code})`);
        resolve({ success: false, stdout, stderr, code });
      }
    });

    child.on('error', (error) => {
      console.log(`\n💥 ${config.name} - ERROR: ${error.message}`);
      reject(error);
    });

    child.on('timeout', () => {
      console.log(`\n⏰ ${config.name} - TIMEOUT`);
      child.kill();
      resolve({ success: false, stdout, stderr, timeout: true });
    });
  });
}

/**
 * Main test execution
 */
async function runAllTests() {
  console.log('🚀 Starting comprehensive test suite...\n');
  
  const results = [];
  
  for (const config of testConfigs) {
    try {
      const result = await runTest(config);
      results.push({ ...result, config });
      
      // Add delay between tests to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.log(`💥 Test execution error: ${error.message}`);
      results.push({ success: false, error: error.message, config });
    }
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n🔍 FAILED TESTS:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`• ${result.config.name}`);
      if (result.timeout) console.log('  ↳ TIMEOUT');
      if (result.code) console.log(`  ↳ Exit code: ${result.code}`);
      if (result.error) console.log(`  ↳ Error: ${result.error}`);
    });
  }
  
  console.log('\n🎯 Test execution complete!');
  return results;
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test runner failed:', error);
  process.exit(1);
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
  if (typeof globalThis.clearTimeout === 'function') {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
  }
}); 