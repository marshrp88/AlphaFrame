/**
 * Global Setup for E2E Tests
 * 
 * This file configures the test environment before running E2E tests.
 * It sets up mocks, authentication state, and browser API stubs.
 */

const { chromium } = require('@playwright/test');

async function globalSetup(config) {
  console.log('[Global Setup] Starting test environment setup');
  
  // Launch browser to set up test state
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for server to be ready
    console.log('[Global Setup] Waiting for server to be ready...');
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Set test mode in localStorage
    await page.evaluate(() => {
      localStorage.setItem('test_mode', 'true');
      console.log('[Global Setup] test_mode set to true');
    });
    
    // Verify test mode is set
    const testMode = await page.evaluate(() => localStorage.getItem('test_mode'));
    console.log('[Global Setup] Verified test_mode:', testMode);
    
    // Test that the app loads correctly
    await page.waitForSelector('#root', { timeout: 10000 });
    console.log('[Global Setup] App root element found');
    
  } catch (error) {
    console.error('[Global Setup] Error during setup:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
  
  console.log('[Global Setup] Test environment setup complete');
}

module.exports = globalSetup; 