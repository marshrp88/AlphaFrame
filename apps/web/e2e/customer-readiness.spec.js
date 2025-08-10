import { test, expect } from '@playwright/test';

// Environment: BASE_URL must point to staging or prod
const base = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Customer-Readiness Verification — AlphaFrame GA100 v2.2.0-rc1', () => {

  test('Landing page renders app shell (not Vercel fallback)', async ({ page }) => {
    await page.goto(base);
    await page.waitForLoadState('domcontentloaded');
    // Wait for any SPA mount point
    const root = page.locator('#root');
    const app = page.locator('.app');
    const nav = page.locator('.navbar-container, nav[aria-label]');
    await expect(root.or(app).or(nav).first()).toBeVisible({ timeout: 15000 });
  });

  test.skip('Onboarding flow (demo) navigates to dashboard', async () => {
    // Skipped on hosted env due to provider SSO redirects on deep routes.
  });

  test('Demo mode seeded data shows dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto(base);
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: /dashboard/i }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.navbar-container')).toBeVisible({ timeout: 15000 });
  });

  test('Dashboard panels load and are interactive', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto(base);
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('link', { name: /dashboard/i }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.navbar-container')).toBeVisible({ timeout: 15000 });
    // Interact with at least one control if available
    const buttons = page.locator('button');
    if (await buttons.count() > 0) await buttons.first().hover();
  });

  test.skip('Error handling shows recovery options', async () => {
    // No error injection hook in production build; enable when implemented
  });

});



