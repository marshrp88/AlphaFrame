import { test, expect } from '@playwright/test';

test('Onboarding to dashboard flow in demo mode', async ({ page }) => {
  // 🔄 Clear all app state before page load
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });

  // 🌐 Load the app fresh in demo mode - navigate directly to onboarding
  await page.goto('http://localhost:5173/onboarding');

  // ⏳ Wait a moment for demo mode to be detected
  await page.waitForTimeout(1000);

  // 🔍 Wait for the onboarding container to confirm rendering
  await expect(page.getByTestId('onboarding-container')).toBeVisible();

  // 🧭 Click through all 6 onboarding steps using the test ID
  for (let i = 0; i < 6; i++) {
    await page.getByTestId('onboarding-continue', { timeout: 10000 }).click();
    await page.waitForTimeout(500);
  }

  // ✅ Verify dashboard content
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByRole('heading', { name: /net cash flow/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /latest triggered rule/i })).toBeVisible();
  await expect(page.getByText('Demo Mode Active:')).toBeVisible();
}); 