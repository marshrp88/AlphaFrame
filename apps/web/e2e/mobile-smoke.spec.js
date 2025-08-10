import { test, expect, devices } from '@playwright/test';

// Firefox does not support isMobile contexts; skip these on Firefox
test.skip(({ browserName }) => browserName === 'firefox', 'Firefox mobile emulation not supported');

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

// iPhone 12
test('Mobile smoke (iPhone 12) — green path renders', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['iPhone 12'] });
  const page = await context.newPage();
  await runGreenPath(page);
  await context.close();
});

// Pixel 5
test('Mobile smoke (Pixel 5) — green path renders', async ({ browser }) => {
  const context = await browser.newContext({ ...devices['Pixel 5'] });
  const page = await context.newPage();
  await runGreenPath(page);
  await context.close();
});


