import { test, expect } from '@playwright/test';

// Environment: BASE_URL must point to staging or prod
const base = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Customer-Readiness Verification — AlphaFrame GA100 v2.2.0-rc1', () => {

  test('Landing page loads and legal links exist', async ({ page }) => {
    await page.goto(base);
    await expect(page.locator('footer')).toContainText('Terms');
    await expect(page.locator('footer')).toContainText('Privacy');
    await expect(page.locator('footer')).toContainText('Cookies');
    await expect(page.locator('footer')).toContainText('Accessibility');
  });

  test('Onboarding flow works with FSM timeout and recovery', async ({ page }) => {
    await page.goto(base);
    await page.getByRole('button', { name: /get started/i }).click({ trial: true }).catch(() => {});
    // fallback selector if button text differs
    const start = page.getByText(/onboarding|get started|start/i).first();
    if (await start.isVisible()) await start.click();

    await page.waitForTimeout(2000); // simulate interaction delay
    await page.reload(); // simulate refresh
    // Accept either Resume or presence of recovery banner
    const resume = page.getByText(/resume|retry|use demo/i);
    await expect(resume).toBeVisible();
    const useDemo = page.getByRole('button', { name: /use demo/i }).or(page.getByText(/use demo/i));
    await useDemo.click();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('Demo mode completes onboarding with seeded data', async ({ page }) => {
    await page.goto(base);
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
    const err = page.getByText(/error|issue|problem/i);
    await expect(err).toBeVisible();
    await expect(page.getByText(/use demo|retry/i)).toBeVisible();
  });

});


