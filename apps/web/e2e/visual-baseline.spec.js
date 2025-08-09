import { test, expect } from '@playwright/test';

// Only run visual baselines when explicitly enabled to avoid flaky CI before baselines are approved
test.skip(process.env.VISUAL_BASELINE !== '1', 'Visual baselines disabled unless VISUAL_BASELINE=1');

const pages = [
  { path: '/', name: 'landing' },
  { path: '/onboarding', name: 'onboarding' },
  { path: '/dashboard', name: 'dashboard', init: () => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    } },
  { path: '/rules', name: 'rules', init: () => {
      sessionStorage.setItem('demo_user', 'true');
      localStorage.setItem('alphaframe_onboarding_complete', 'true');
    } },
  { path: '/settings', name: 'settings' },
];

for (const p of pages) {
  test(`visual baseline: ${p.name}`, async ({ page }) => {
    if (p.init) {
      await page.addInitScript(p.init);
    }
    await page.goto(p.path);
    await page.waitForLoadState('networkidle');
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`${p.name}.png`);
  });
}


