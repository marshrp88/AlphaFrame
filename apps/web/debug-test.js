#!/usr/bin/env node

/**
 * Debug Test Script
 * 
 * Purpose: Run a single test with debug output to diagnose issues
 * Procedure: Execute test and capture console output
 * Conclusion: Provides debugging information for test failures
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Debug Test...\n');

const command = 'npx playwright test --grep "should create and execute a Plaid transfer rule" --reporter=line --project=chromium';

const child = spawn(command, [], {
  cwd: __dirname,
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';

child.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stdout.write(text);
});

child.stderr.on('data', (data) => {
  const text = data.toString();
  output += text;
  process.stderr.write(text);
});

child.on('close', (code) => {
  console.log(`\n\n📊 Test completed with exit code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Test passed!');
  } else {
    console.log('❌ Test failed. Check output above for details.');
    
    // Save output to file for analysis
    const fs = require('fs');
    fs.writeFileSync('debug-test-output.txt', output);
    console.log('📄 Full output saved to debug-test-output.txt');
  }
});

child.on('error', (error) => {
  console.error('💥 Test execution error:', error.message);
}); 