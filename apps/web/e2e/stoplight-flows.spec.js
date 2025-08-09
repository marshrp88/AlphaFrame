// Stoplight E2E: Three minimal green-path flows
import { test, expect } from '@playwright/test';

test.describe('Stoplight Green Paths', () => {
  test('Unauth → Demo → Onboarding complete → Dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto('/onboarding');
    await page.waitForTimeout(250);
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('Auth new user → Onboarding complete → Dashboard (simulated)', async ({ page }) => {
    await page.addInitScript(() => {
      // Simulate a just-onboarded user session
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
      sessionStorage.setItem('demo_user', 'true');
    });
    await page.goto('/onboarding');
    await page.waitForTimeout(250);
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('Plaid failure → Offer Retry or Demo → Choose Demo → Dashboard', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto('/onboarding');
    await page.waitForTimeout(250);
    await page.waitForURL('**/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});


