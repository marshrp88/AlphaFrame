#!/usr/bin/env node

/**
 * Debug Visibility Test Script
 * 
 * Purpose: Check if PlaidActionForm elements are visible and have correct attributes
 * Procedure: Navigate to rules page, select PLAID_TRANSFER, and inspect all form elements
 * Conclusion: Identify why tests can't find the from-account selector
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running Debug Visibility Test...\n');

// Create a test that checks element visibility
const debugTestContent = `
import { test, expect } from '@playwright/test';

test('should debug element visibility', async ({ page }) => {
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
  
  // Wait for any rendering
  await page.waitForTimeout(3000);
  
  // Check all possible selectors
  const selectors = [
    '[data-testid="from-account"]',
    '[data-testid="to-account"]',
    '[data-testid="amount"]',
    'select[data-testid="from-account"]',
    'select[data-testid="to-account"]',
    'input[data-testid="amount"]',
    '.from-account',
    '.to-account',
    '.amount-input',
    'form select',
    'form input',
    'form [data-testid]'
  ];
  
  console.log('\\n🔍 Checking all possible selectors:');
  for (const selector of selectors) {
    try {
      const count = await page.locator(selector).count();
      const isVisible = await page.locator(selector).first().isVisible().catch(() => false);
      console.log(\`\${selector}: count=\${count}, visible=\${isVisible}\`);
    } catch (error) {
      console.log(\`\${selector}: error - \${error.message}\`);
    }
  }
  
  // Check all form elements
  const formElements = await page.locator('form, select, input, [data-testid]').all();
  console.log('\\n📋 All form-related elements:');
  for (let i = 0; i < Math.min(formElements.length, 20); i++) {
    try {
      const element = formElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const testId = await element.getAttribute('data-testid');
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      console.log(\`Element \${i}: \${tagName}, testid="\${testId}", class="\${className}", visible=\${isVisible}\`);
    } catch (error) {
      console.log(\`Element \${i}: error - \${error.message}\`);
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-visibility-result.png', fullPage: true });
  
  // Get page content and look for specific patterns
  const content = await page.content();
  const hasFromAccount = content.includes('from-account');
  const hasToAccount = content.includes('to-account');
  const hasAmount = content.includes('amount');
  
  console.log('\\n🔍 Content analysis:');
  console.log('Contains "from-account":', hasFromAccount);
  console.log('Contains "to-account":', hasToAccount);
  console.log('Contains "amount":', hasAmount);
  
  // Look for the actual rendered form
  const formContent = await page.locator('form').first().innerHTML().catch(() => 'No form found');
  console.log('\\n📄 Form content preview:');
  console.log(formContent.substring(0, 500));
});
`;

// Write the test file
import fs from 'fs';
fs.writeFileSync('e2e/debug-visibility.spec.js', debugTestContent);

const command = 'npx playwright test e2e/debug-visibility.spec.js --reporter=line --project=chromium';

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
  console.log(`\n\n📊 Debug visibility test completed with exit code: ${code}`);
  
  // Save output to file
  fs.writeFileSync('debug-visibility-output.txt', output);
  console.log('📄 Full output saved to debug-visibility-output.txt');
});

child.on('error', (error) => {
  console.error('💥 Test execution error:', error.message);
}); 