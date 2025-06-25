#!/usr/bin/env node

/**
 * Console Test Script
 * 
 * Purpose: Capture browser console logs to debug component rendering
 * Procedure: Run test and capture all console output
 * Conclusion: Identify the root cause of rendering issues
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Console Debug Test...\n');

// Create a test that captures console logs
const consoleTestContent = `
import { test, expect } from '@playwright/test';

test('should capture console logs', async ({ page }) => {
  // Listen for console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(\`[BROWSER] \${msg.type()}: \${msg.text()}\`);
  });

  // Navigate to rules page
  await page.goto('/rules');
  
  // Wait for the page to load
  await page.waitForSelector('[data-testid="debug-rulespage"]', { timeout: 10000 });
  
  // Click create rule button
  await page.click('[data-testid="create-rule-button"]');
  
  // Wait for action selector to appear
  await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
  
  // Select PLAID_TRANSFER
  await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
  
  // Wait for any rendering and console messages
  await page.waitForTimeout(5000);
  
  // Log all console messages
  console.log('\\n📋 All console messages:');
  consoleMessages.forEach((msg, index) => {
    console.log(\`\${index + 1}. [\${msg.type}] \${msg.text}\`);
  });
  
  // Check if PlaidActionForm was mentioned in console
  const plaidLogs = consoleMessages.filter(msg => 
    msg.text.includes('PlaidActionForm') || 
    msg.text.includes('PLAID_TRANSFER') ||
    msg.text.includes('RuleBinderRoot')
  );
  
  console.log('\\n🎯 PlaidActionForm related logs:');
  plaidLogs.forEach((msg, index) => {
    console.log(\`\${index + 1}. [\${msg.type}] \${msg.text}\`);
  });
  
  // Take a screenshot
  await page.screenshot({ path: 'console-test-result.png', fullPage: true });
  
  // Check for errors
  const errors = consoleMessages.filter(msg => msg.type === 'error');
  if (errors.length > 0) {
    console.log('\\n❌ Errors found:');
    errors.forEach((error, index) => {
      console.log(\`\${index + 1}. \${error.text}\`);
    });
  }
});
`;

// Write the test file
import fs from 'fs';
fs.writeFileSync('e2e/console-debug.spec.js', consoleTestContent);

const command = 'npx playwright test e2e/console-debug.spec.js --reporter=line --project=chromium';

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
  console.log(`\n\n📊 Console test completed with exit code: ${code}`);
  
  // Save output to file
  fs.writeFileSync('console-test-output.txt', output);
  console.log('📄 Full output saved to console-test-output.txt');
});

child.on('error', (error) => {
  console.error('💥 Test execution error:', error.message);
}); 