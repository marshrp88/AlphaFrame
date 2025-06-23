import { test, expect } from '@playwright/test';

test('Mounts diagnostic TestMount component', async ({ page }) => {
  console.log('[TestMount Test] Starting diagnostic test');
  
  // Navigate to the test mount page
  await page.goto('/test-mount', { waitUntil: 'networkidle' });
  
  console.log('[TestMount Test] Page loaded, checking for element');
  
  // Wait for the diagnostic element
  const element = await page.getByTestId('mount-check');
  
  // Check if element is visible
  await expect(element).toBeVisible({ timeout: 10000 });
  
  console.log('[TestMount Test] Element found and visible');
  
  // DOM Evaluation Check
  const html = await page.content();
  console.log('[HTML Snapshot]', html.substring(0, 500) + '...');
  
  // Visibility + Geometry Checks
  const isVisible = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="mount-check"]');
    return {
      exists: !!el,
      visible: el && el.offsetParent !== null,
      display: el ? getComputedStyle(el).display : 'none',
      opacity: el ? getComputedStyle(el).opacity : '0',
      textContent: el ? el.textContent : 'none'
    };
  });
  
  console.log('[Visibility Check]', isVisible);
  
  // Additional diagnostic: Check if any React components are rendering
  const reactRoot = await page.evaluate(() => {
    const root = document.querySelector('#root');
    return {
      exists: !!root,
      children: root ? root.children.length : 0,
      innerHTML: root ? root.innerHTML.substring(0, 200) : 'none'
    };
  });
  
  console.log('[React Root Check]', reactRoot);
}); 