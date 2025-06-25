#!/usr/bin/env node

/**
 * Quick Test Script for Playwright
 * 
 * Purpose: Run a single Playwright test to verify fixes work
 * Procedure: Execute test with specific grep pattern and capture output
 * Conclusion: Provides immediate feedback on test status
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Quick Playwright Test...\n');

try {
  // Run a single test with specific grep pattern
  const command = 'npx playwright test --grep "should create and execute a Plaid transfer rule" --reporter=line --project=chromium';
  
  console.log(`Executing: ${command}\n`);
  
  const output = execSync(command, { 
    cwd: __dirname,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 60000 // 60 second timeout
  });
  
  console.log('✅ Test completed successfully!');
  console.log('\n📋 Output:');
  console.log(output);
  
} catch (error) {
  console.log('❌ Test failed or timed out');
  console.log('\n📋 Error output:');
  console.log(error.stdout || 'No stdout');
  console.log('\n🚨 Error details:');
  console.log(error.stderr || 'No stderr');
  console.log('\n⏱️  Exit code:', error.code);
} 