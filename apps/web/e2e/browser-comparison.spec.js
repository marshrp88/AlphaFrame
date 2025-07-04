import { test, expect } from '@playwright/test';

test('Compare button rendering across all browsers', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  
  await page.goto('http://localhost:5177/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000); // Long wait for all browsers

  // 2. Check button existence and properties
  const createButton = page.getByTestId('create-rule-btn');
  const buttonCount = await createButton.count();
  
  console.log(`\n🔍 ${browserName.toUpperCase()} ANALYSIS:`);
  console.log(`🔘 Button count: ${buttonCount}`);
  
  if (buttonCount > 0) {
    const isVisible = await createButton.isVisible();
    console.log(`👁️ Button visible: ${isVisible}`);
    
    // Get computed styles
    const styles = await createButton.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
        zIndex: style.zIndex,
        width: style.width,
        height: style.height,
        transform: style.transform
      };
    });
    console.log(`🎨 Computed styles:`, styles);
    
    // Check if button is clickable
    const isClickable = await createButton.isEnabled();
    console.log(`🖱️ Button clickable: ${isClickable}`);
    
  } else {
    console.log(`❌ Button not found in DOM`);
    
    // Check what buttons ARE available
    const allButtons = await page.locator('button').all();
    console.log(`🔘 Total buttons found: ${allButtons.length}`);
    
    for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
      const text = await allButtons[i].textContent();
      const testId = await allButtons[i].getAttribute('data-testid');
      console.log(`  Button ${i}: "${text}" (testid: ${testId})`);
    }
  }
  
  // 3. Check if the page is actually the rules page
  const currentUrl = page.url();
  const pageTitle = await page.title();
  console.log(`🔗 URL: ${currentUrl}`);
  console.log(`📄 Title: ${pageTitle}`);
  
  // 4. Check for any error messages or loading states
  const errorElements = await page.locator('[class*="error"], [class*="Error"]').all();
  const loadingElements = await page.locator('[class*="loading"], [class*="Loading"]').all();
  console.log(`⚠️ Error elements: ${errorElements.length}`);
  console.log(`⏳ Loading elements: ${loadingElements.length}`);
  
  // 5. Save screenshot for visual comparison
  await page.screenshot({ path: `test-results/${browserName}-rules-page-comparison.png` });
  
  console.log(`📸 Screenshot saved: test-results/${browserName}-rules-page-comparison.png`);
}); 