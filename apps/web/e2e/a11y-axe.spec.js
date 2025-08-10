import { test, expect } from '@playwright/test';
// Load AxeBuilder only if available to avoid hard dependency during quick runs
let AxeBuilder;

async function getAxe(page) {
  if (!AxeBuilder) {
    try {
      const mod = await import('@axe-core/playwright');
      AxeBuilder = mod.default;
    } catch {
      return null;
    }
  }
  return new AxeBuilder({ page });
}

// Skip if package not installed (local fallback)
test.skip(() => {
  try { require.resolve('@axe-core/playwright'); return false; } catch { return true; }
}, 'axe-core/playwright not installed');

test.describe('A11y smoke', () => {
  test('Landing page has no critical/high violations', async ({ page }) => {
    await page.goto('/');
    const axe = await getAxe(page);
    if (!axe) test.skip(true, 'axe-core/playwright not installed');
    const results = await axe.withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });

  test('Onboarding page has no critical/high violations', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
    });
    await page.goto('/onboarding');
    const axe = await getAxe(page);
    if (!axe) test.skip(true, 'axe-core/playwright not installed');
    const results = await axe.withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });

  test('Dashboard (demo) has no critical/high violations', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    });
    await page.goto('/dashboard');
    const axe = await getAxe(page);
    if (!axe) test.skip(true, 'axe-core/playwright not installed');
    const results = await axe.withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
  });
});


