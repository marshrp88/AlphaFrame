import { test, expect, devices } from '@playwright/test';

// Core green-path checks reused for mobile devices
async function runGreenPath(page) {
  await page.addInitScript(() => {
    sessionStorage.setItem('demo_user', 'true');
    localStorage.setItem('alphaframe_onboarding_complete', 'true');
  });
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  // Simple UI smoke: header present and a key card renders
  await expect(page.locator('.navbar-container')).toBeVisible();
  await expect(page.getByText('Financial Dashboard')).toBeVisible();
}

test.describe('Mobile smoke: iPhone 12', () => {
  test.use({ ...devices['iPhone 12'] });

  test('green path renders', async ({ page }) => {
    await runGreenPath(page);
  });
});

test.describe('Mobile smoke: Pixel 5', () => {
  test.use({ ...devices['Pixel 5'] });

  test('green path renders', async ({ page }) => {
    await runGreenPath(page);
  });
});


