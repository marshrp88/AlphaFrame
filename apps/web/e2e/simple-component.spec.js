
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
