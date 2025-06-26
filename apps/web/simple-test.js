#!/usr/bin/env node

/**
 * Simple Test Script
 * 
 * Purpose: Test basic component rendering without complex interactions
 * Procedure: Navigate to rules page and check if components exist
 * Conclusion: Verify basic functionality works
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Simple Component Test...\n');

// Create a simple test file
const simpleTestContent = `
import { test, expect } from '@playwright/test';

test('should render basic components', async ({ page }) => {
  // Navigate to rules page
  await page.goto('/rules');
  
  // Wait for the page to load
  await page.waitForSelector('[data-testid="debug-rulespage"]', { timeout: 10000 });
  console.log('✅ Rules page loaded');
  
  // Check if create rule button exists
  await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
  console.log('✅ Create rule button found');
  
  // Click create rule button
  await page.click('[data-testid="create-rule-button"]');
  console.log('✅ Create rule button clicked');
  
  // Wait for action selector to appear
  await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
  console.log('✅ Action selector found');
  
  // Check if PLAID_TRANSFER option exists
  const options = await page.locator('[data-testid="action-selector"] option').allTextContents();
  console.log('Available options:', options);
  
  // Select PLAID_TRANSFER
  await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
  console.log('✅ PLAID_TRANSFER selected');
  
  // Wait a moment for any rendering
  await page.waitForTimeout(3000);
  
  // Check if any form elements appear
  const formElements = await page.locator('form, [data-testid*="account"], [data-testid*="amount"]').count();
  console.log('Form elements found:', formElements);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'simple-test-result.png', fullPage: true });
  console.log('✅ Screenshot saved as simple-test-result.png');
  
  // Log page content for debugging
  const content = await page.content();
  console.log('Page content length:', content.length);
  console.log('Page content preview:', content.substring(0, 500));
});
`;

// Write the test file
import fs from 'fs';
fs.writeFileSync('e2e/simple-component.spec.js', simpleTestContent);

const command = 'npx playwright test e2e/simple-component.spec.js --reporter=line --project=chromium';

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
  console.log(`\n\n📊 Simple test completed with exit code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Simple test passed!');
  } else {
    console.log('❌ Simple test failed. Check output above for details.');
  }
  
  // Save output to file
  fs.writeFileSync('simple-test-output.txt', output);
  console.log('📄 Full output saved to simple-test-output.txt');
});

child.on('error', (error) => {
  console.error('💥 Test execution error:', error.message);
}); 