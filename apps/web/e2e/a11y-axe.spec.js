import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('A11y smoke', () => {
  test('Landing page has no critical/high violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });

  test('Onboarding page has no critical/high violations', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
    });
    await page.goto('/onboarding');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });

  test('Dashboard (demo) has no critical/high violations', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto('/dashboard');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });
});


