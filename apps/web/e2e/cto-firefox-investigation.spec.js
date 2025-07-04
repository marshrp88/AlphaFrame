import { test, expect } from '@playwright/test';

test('CTO-Level Firefox Button Investigation', async ({ page, browserName }) => {
  // Only run for Firefox
  if (browserName !== 'firefox') {
    test.skip('This test is only for Firefox investigation');
    return;
  }

  console.log(`\n🔍 CTO INVESTIGATION: ${browserName.toUpperCase()}`);
  console.log(`⏰ Test start time: ${new Date().toISOString()}`);

  // 1. Set demo mode and navigate
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
    console.log('🔍 [Test] Demo mode set');
  });
  
  const navigationStart = Date.now();
  await page.goto('http://localhost:5177/rules');
  const navigationEnd = Date.now();
  console.log(`⏱️ Navigation time: ${navigationEnd - navigationStart}ms`);

  // 2. Wait for network idle and component mount
  await page.waitForLoadState('networkidle');
  console.log('✅ Network idle reached');

  // 3. Listen for component mount logs
  const mountLogs = [];
  page.on('console', msg => {
    if (msg.text().includes('[RulesPage] Component mounted')) {
      mountLogs.push(msg.text());
      console.log('🔍 Component mount detected:', msg.text());
    }
  });

  // 4. Wait for component mount and log timing
  await page.waitForTimeout(2000);
  const componentMountTime = Date.now();
  console.log(`⏱️ Time to component mount: ${componentMountTime - navigationStart}ms`);

  // 5. Multiple detection methods for button
  console.log('\n🔍 METHOD 1: getByTestId count');
  const buttonCount1 = await page.locator('[data-testid="create-rule-btn"]').count();
  console.log(`  Button count (getByTestId): ${buttonCount1}`);

  console.log('\n🔍 METHOD 2: querySelector via evaluate');
  const buttonExists = await page.evaluate(() => {
    const button = document.querySelector('[data-testid="create-rule-btn"]');
    if (button) {
      const styles = window.getComputedStyle(button);
      return {
        exists: true,
        innerText: button.innerText,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex,
        offsetParent: button.offsetParent !== null,
        clientWidth: button.clientWidth,
        clientHeight: button.clientHeight,
        offsetWidth: button.offsetWidth,
        offsetHeight: button.offsetHeight
      };
    }
    return { exists: false };
  });
  console.log('  Button via querySelector:', buttonExists);

  console.log('\n🔍 METHOD 3: waitForSelector with timeout');
  try {
    await page.waitForSelector('[data-testid="create-rule-btn"]', { timeout: 5000 });
    console.log('  ✅ waitForSelector: Button found');
  } catch (error) {
    console.log('  ❌ waitForSelector: Button not found -', error.message);
  }

  console.log('\n🔍 METHOD 4: waitForFunction with innerText');
  try {
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-testid="create-rule-btn"]');
      return el && el.innerText.toLowerCase().includes('create');
    }, null, { timeout: 5000 });
    console.log('  ✅ waitForFunction: Button with text found');
  } catch (error) {
    console.log('  ❌ waitForFunction: Button with text not found -', error.message);
  }

  console.log('\n🔍 METHOD 5: Manual polling with evaluate');
  let buttonFound = false;
  for (let i = 0; i < 5; i++) {
    const exists = await page.evaluate(() => {
      return !!document.querySelector('[data-testid="create-rule-btn"]');
    });
    console.log(`  Attempt ${i+1}: Button exists = ${exists}`);
    if (exists) {
      buttonFound = true;
      break;
    }
    await page.waitForTimeout(1000);
  }
  console.log(`  Final result: Button found = ${buttonFound}`);

  // 6. Check all buttons on page
  console.log('\n🔍 METHOD 6: All buttons on page');
  const allButtons = await page.locator('button').all();
  console.log(`  Total buttons found: ${allButtons.length}`);
  
  for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
    const text = await allButtons[i].textContent();
    const testId = await allButtons[i].getAttribute('data-testid');
    const isVisible = await allButtons[i].isVisible();
    console.log(`  Button ${i}: "${text}" (testid: ${testId}, visible: ${isVisible})`);
  }

  // 7. Check page state
  console.log('\n🔍 METHOD 7: Page state analysis');
  const currentUrl = page.url();
  const pageTitle = await page.title();
  const demoMode = await page.evaluate(() => sessionStorage.getItem('demo_user'));
  console.log(`  URL: ${currentUrl}`);
  console.log(`  Title: ${pageTitle}`);
  console.log(`  Demo mode: ${demoMode}`);

  // 8. Check for any error states
  console.log('\n🔍 METHOD 8: Error state check');
  const errorElements = await page.locator('[class*="error"], [class*="Error"]').all();
  const loadingElements = await page.locator('[class*="loading"], [class*="Loading"]').all();
  console.log(`  Error elements: ${errorElements.length}`);
  console.log(`  Loading elements: ${loadingElements.length}`);

  // 9. Save comprehensive debug info
  console.log('\n📸 Saving debug information...');
  await page.screenshot({ path: `test-results/firefox-cto-investigation.png` });
  
  const html = await page.content();
  console.log(`📄 Debug HTML length: ${html.length} characters`);
  console.log(`📄 Page title: ${await page.title()}`);
  console.log(`📄 Current URL: ${page.url()}`);

  // 10. Final assessment
  console.log('\n📊 FINAL ASSESSMENT:');
  console.log(`  - Component mounted: ${mountLogs.length > 0 ? 'YES' : 'NO'}`);
  console.log(`  - Button in DOM: ${buttonExists.exists ? 'YES' : 'NO'}`);
  console.log(`  - Button visible: ${buttonExists.exists ? buttonExists.offsetParent !== null : 'N/A'}`);
  console.log(`  - Manual polling: ${buttonFound ? 'SUCCESS' : 'FAILED'}`);
  
  if (!buttonExists.exists) {
    console.log('\n❌ ROOT CAUSE: Button not in DOM at all');
    test.fail('Button not rendered in DOM - component mounting issue');
  } else if (!buttonExists.offsetParent) {
    console.log('\n❌ ROOT CAUSE: Button in DOM but not visible');
    test.fail('Button rendered but not visible - CSS/positioning issue');
  } else {
    console.log('\n✅ Button is both in DOM and visible');
  }
}); 