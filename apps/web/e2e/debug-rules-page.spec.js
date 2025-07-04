import { test, expect } from '@playwright/test';

test('Debug rules page to see what elements are available', async ({ page }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  
  await page.goto('http://localhost:5177/');
  console.log('✅ Home page loaded');
  
  // 2. Go directly to rules page
  await page.goto('http://localhost:5177/rules');
  console.log('✅ Rules page URL loaded');
  
  // 3. Wait for page to load
  await page.waitForLoadState('networkidle');
  console.log('✅ Network idle');
  
  // 4. Print page title and URL
  const title = await page.title();
  const url = page.url();
  console.log('📄 Page title:', title);
  console.log('🔗 Current URL:', url);
  
  // 5. Check if we're redirected somewhere else
  if (!url.includes('/rules')) {
    console.log('❌ Redirected away from rules page');
    return;
  }
  
  // 6. Print all buttons on the page
  const buttons = await page.locator('button').all();
  console.log(`🔘 Found ${buttons.length} buttons:`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const testId = await buttons[i].getAttribute('data-testid');
    console.log(`  Button ${i}: "${text}" (testid: ${testId})`);
  }
  
  // 7. Print all elements with data-testid
  const testIdElements = await page.locator('[data-testid]').all();
  console.log(`🏷️ Found ${testIdElements.length} elements with data-testid:`);
  for (let i = 0; i < testIdElements.length; i++) {
    const testId = await testIdElements[i].getAttribute('data-testid');
    const tagName = await testIdElements[i].evaluate(el => el.tagName);
    console.log(`  ${tagName} ${i}: data-testid="${testId}"`);
  }
  
  // 8. Print page HTML for debugging
  const html = await page.content();
  console.log('📄 Page HTML (first 1000 chars):', html.substring(0, 1000));
  
  // 9. Check if create button exists
  const createButton = page.getByTestId('create-rule-btn');
  const buttonCount = await createButton.count();
  console.log(`🔍 Create button count: ${buttonCount}`);
  
  if (buttonCount > 0) {
    const isVisible = await createButton.isVisible();
    console.log(`👁️ Create button visible: ${isVisible}`);
  }
}); 