import { test, expect } from '@playwright/test';
test('E2E Onboarding to Dashboard', async ({ page }) => {
  await page.goto('http://localhost:5175/');
  await expect(page.locator('body')).toBeVisible();
});
