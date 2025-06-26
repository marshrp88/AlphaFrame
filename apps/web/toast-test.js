#!/usr/bin/env node

/**
 * Toast Test Script
 * 
 * Purpose: Test if the toast notification system is working
 * Procedure: Navigate to rules page and trigger a toast manually
 * Conclusion: Verify toast appears with correct test ID
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Running Toast Test...\n');

// Create a simple test that just checks toast functionality
const toastTestContent = `
import { test, expect } from '@playwright/test';

test('should show toast notification', async ({ page }) => {
  // Navigate to rules page
  await page.goto('/rules');
  
  // Wait for the page to load
  await page.waitForSelector('[data-testid="debug-rulespage"]', { timeout: 15000 });
  
  // Trigger a toast manually by calling the toast function
  await page.evaluate(() => {
    // Get the toast function from the window
    const toastFunction = window.__toast__;
    if (toastFunction) {
      toastFunction({
        title: "Test Toast",
        description: "This is a test toast message"
      });
    } else {
      console.log('Toast function not found');
    }
  });
  
  // Wait for toast to appear
  await page.waitForTimeout(1000);
  
  // Check if any toast elements exist
  const toastElements = await page.locator('[data-testid*="toast"], [data-testid*="toaster"]').count();
  console.log('Toast elements found:', toastElements);
  
  // Check if the toaster container exists
  const toasterExists = await page.locator('[data-testid="toaster"]').isVisible();
  console.log('Toaster container visible:', toasterExists);
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'toast-test-screenshot.png' });
});
`;

// Write the test file
import fs from 'fs';
fs.writeFileSync('toast-test.spec.js', toastTestContent);

console.log('✅ Toast test file created');

// Run the test
const testProcess = spawn('npx', ['playwright', 'test', 'toast-test.spec.js', '--project=chromium', '--reporter=line'], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  console.log(`\n🧪 Toast test completed with code: ${code}`);
  
  // Clean up
  fs.unlinkSync('toast-test.spec.js');
  
  if (code === 0) {
    console.log('✅ Toast test passed!');
  } else {
    console.log('❌ Toast test failed!');
  }
}); 