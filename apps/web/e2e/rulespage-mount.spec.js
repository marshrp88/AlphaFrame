import { test, expect } from '@playwright/test';

test('Isolates and renders RulesPage directly', async ({ page }) => {
  console.log('[RulesPage Mount Test] Starting direct mount test');
  
  // Navigate to root where RulesPage is now mounted directly
  await page.goto('/', { waitUntil: 'networkidle' });
  
  console.log('[RulesPage Mount Test] Page loaded, checking for element');
  
  // Wait for the diagnostic element
  const element = await page.getByTestId('debug-rulespage');
  
  // Check if element is visible
  await expect(element).toBeVisible({ timeout: 10000 });
  
  console.log('[RulesPage Mount Test] Element found and visible');
  
  // DOM Evaluation Check
  const logs = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="debug-rulespage"]');
    return {
      exists: !!el,
      visible: el && el.offsetParent !== null,
      text: el?.textContent,
      html: el?.innerHTML
    };
  });
  
  console.log('[Render Status]', logs);
  
  // Check for any error elements
  const errorElement = await page.getByTestId('debug-rulespage-error');
  const errorExists = await errorElement.count() > 0;
  
  if (errorExists) {
    const errorText = await errorElement.textContent();
    console.log('[Error Found]', errorText);
  }
}); 