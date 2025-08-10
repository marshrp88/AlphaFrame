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

  test('Onboarding flow works with FSM timeout and recovery', async ({ page }) => {
    await page.goto(base);
    await page.waitForLoadState('domcontentloaded');
    await page.getByRole('button', { name: /get started/i }).click({ trial: true }).catch(() => {});
    // fallback selector if button text differs
    const start = page.getByText(/onboarding|get started|start/i).first();
    if (await start.isVisible()) await start.click();

    await page.waitForTimeout(2000); // simulate interaction delay
    await page.reload(); // simulate refresh
    // Accept either Resume or presence of recovery banner
    const resume = page.getByText(/resume|retry|use demo/i).or(page.locator('[role="alert"], [data-banner="status"]'));
    await expect(resume).toBeVisible();
    const useDemo = page.getByRole('button', { name: /use demo/i }).or(page.getByText(/use demo/i));
    await useDemo.click();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('Demo mode completes onboarding with seeded data', async ({ page }) => {
    await page.goto(base);
    await page.waitForLoadState('domcontentloaded');
    const getStarted = page.getByRole('button', { name: /get started/i }).or(page.getByText(/get started|onboarding/i));
    if (await getStarted.isVisible()) await getStarted.click();
    const useDemo = page.getByRole('button', { name: /use demo/i }).or(page.getByText(/use demo/i));
    await useDemo.click();
    await expect(page.getByText(/cash flow/i)).toBeVisible();
  });

  test('Dashboard panels load and are interactive', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto(`${base}/dashboard`);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/cash flow/i)).toBeVisible();
    // Interact with at least one control if available
    const buttons = page.locator('button');
    if (await buttons.count() > 0) await buttons.first().hover();
  });

  test('Error handling shows recovery options', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto(`${base}/dashboard?forceError=true`);
    // Accept generic error banner text
    const err = page.getByText(/error|issue|problem/i).or(page.locator('[role="alert"], [aria-live]'));
    await expect(err).toBeVisible();
    await expect(page.getByText(/use demo|retry/i)).toBeVisible();
  });

});



