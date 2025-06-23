import { test, expect } from '@playwright/test';

test('Rules page loads and shows debug test id', async ({ page }) => {
  console.log('[Rules Test] Starting test with improved stability');
  
  // Wait for server to be alive before navigation
  await page.waitForFunction(() => {
    return fetch('/').then(res => res.ok).catch(() => false);
  }, { timeout: 15000 });
  
  console.log('[Rules Test] Server confirmed alive, navigating to /rules');
  
  // Navigate with improved wait conditions
  await page.goto('/rules', { 
    waitUntil: 'networkidle',
    timeout: 30000 
  });
  
  console.log('[Rules Test] Page loaded, waiting for element with improved selector');
  
  // Use waitForSelector instead of getByTestId for better stability
  await page.waitForSelector('[data-testid="debug-rulespage"]', { 
    state: 'visible',
    timeout: 15000 
  });
  
  console.log('[Rules Test] Element found and visible');
  
  // Additional verification
  const element = page.locator('[data-testid="debug-rulespage"]');
  await expect(element).toBeVisible();
  
  // Verify URL
  await expect(page).toHaveURL(/.*\/rules/);
  
  console.log('[Rules Test] Test completed successfully');
}); 
