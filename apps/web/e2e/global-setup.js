/**
 * Global setup for Playwright tests
 * This runs once before all tests and ensures the server is ready
 */

import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🌐 Starting global setup...');
  
  // Launch browser to test server connectivity
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Wait for server to be ready with retries
  let serverReady = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!serverReady && attempts < maxAttempts) {
    try {
      console.log(`🔄 Attempt ${attempts + 1}/${maxAttempts}: Checking server...`);
      await page.goto('http://localhost:5173', { timeout: 10000 });
      
      // Wait for the app to be fully loaded
      await page.waitForSelector('#root', { timeout: 15000 });
      
      // Check if the app is responsive
      const title = await page.title();
      console.log(`✅ Server ready! Page title: ${title}`);
      serverReady = true;
      
    } catch (error) {
      attempts++;
      console.log(`❌ Attempt ${attempts} failed: ${error.message}`);
      
      if (attempts < maxAttempts) {
        console.log(`⏳ Waiting 2 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  await browser.close();
  
  if (!serverReady) {
    throw new Error(`Server failed to start after ${maxAttempts} attempts`);
  }
  
  console.log('✅ Global setup completed successfully');
}

export default globalSetup; 