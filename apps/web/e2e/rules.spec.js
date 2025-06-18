import { test, expect } from '@playwright/test';

test('Rules page loads and shows debug test id', async ({ page }) => {
  await page.goto('http://localhost:5178/rules', { waitUntil: 'load' });

  // Diagnostic: Capture full page HTML
  const content = await page.content();
  console.log('\n--- DOM Snapshot ---\n', content, '\n--- End Snapshot ---\n');

  // Diagnostic: Screenshot
  await page.screenshot({ path: 'rules-page.png', fullPage: true });

  // Proceed with original test
  await expect(page.getByTestId('debug-rulespage')).toBeVisible();
}); 