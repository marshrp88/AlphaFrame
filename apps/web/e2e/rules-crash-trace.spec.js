import { test, expect } from '@playwright/test';

test('E2E Runtime Crash Trace - RulesPage', async ({ page }) => {
  console.log('[TRACE] Setting localStorage for test_mode');
  await page.addInitScript(() => {
    localStorage.setItem('test_mode', 'true');
    console.log('[PAGE INIT] test_mode set to true');
  });

  // Capture all console messages before navigation
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] ${msg.type()}: ${msg.text()}`);
  });

  // Capture all page errors
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });

  console.log('[TRACE] Navigating to /rules...');
  await page.goto('/rules', { waitUntil: 'load' });

  console.log('[TRACE] Waiting for domcontentloaded...');
  await page.waitForLoadState('domcontentloaded');

  console.log('[TRACE] Waiting for network idle...');
  await page.waitForLoadState('networkidle');

  // Check for the RulesPage marker
  const element = await page.$('[data-testid="debug-rulespage"]');
  const visible = await element?.isVisible();
  const html = await page.content();

  console.log('[TRACE] Element presence:', !!element);
  console.log('[TRACE] Element visible:', visible);
  console.log('[TRACE] Page HTML snapshot:', html.slice(0, 1000)); // Larger slice for debugging

  // Check for error elements
  const errorElement = await page.$('[data-testid="error-caught"]');
  const innerErrorElement = await page.$('[data-testid="debug-rulespage-error"]');
  
  if (errorElement) {
    const errorText = await errorElement.textContent();
    console.error('[TRACE] Error element found:', errorText);
  }
  
  if (innerErrorElement) {
    const innerErrorText = await innerErrorElement.textContent();
    console.error('[TRACE] Inner error element found:', innerErrorText);
  }

  // Check React root state
  const reactRoot = await page.evaluate(() => {
    const root = document.querySelector('#root');
    return {
      exists: !!root,
      children: root ? root.children.length : 0,
      innerHTML: root ? root.innerHTML.substring(0, 500) : 'none'
    };
  });
  
  console.log('[TRACE] React Root Check:', reactRoot);

  // Check for any console errors in the page context
  const consoleErrors = await page.evaluate(() => {
    return window.consoleErrors || [];
  });
  
  if (consoleErrors.length > 0) {
    console.error('[TRACE] Console errors captured:', consoleErrors);
  }

  expect(element).not.toBeNull();
  expect(visible).toBe(true);
}); 