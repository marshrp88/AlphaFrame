import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Firefox DOM inspection for RulesPage button issue', async ({ page, browserName }) => {
  // Only run this test for Firefox
  if (browserName !== 'firefox') {
    test.skip('This test is only for Firefox debugging');
    return;
  }

  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  
  await page.goto('http://localhost:5177/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Extra wait for Firefox

  // 2. Create logs directory if it doesn't exist
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // 3. Save detailed DOM inspection
  const html = await page.content();
  fs.writeFileSync(path.join(logsDir, 'firefox-rules.html'), html);
  await page.screenshot({ path: path.join(logsDir, 'firefox-rules.png') });

  // 4. Check if button exists in DOM at all
  const buttonInDOM = await page.locator('[data-testid="create-rule-btn"]').count();
  console.log(`🔍 Firefox: Button in DOM count: ${buttonInDOM}`);

  if (buttonInDOM > 0) {
    // 5. Check button properties
    const button = page.locator('[data-testid="create-rule-btn"]').first();
    const isVisible = await button.isVisible();
    const computedStyle = await button.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
        zIndex: style.zIndex,
        width: style.width,
        height: style.height
      };
    });

    console.log(`👁️ Firefox: Button visible: ${isVisible}`);
    console.log(`🎨 Firefox: Computed styles:`, computedStyle);

    // 6. Check parent container styles
    const parentContainer = await button.locator('..').first();
    const parentStyle = await parentContainer.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        visibility: style.visibility,
        overflow: style.overflow,
        height: style.height
      };
    });

    console.log(`📦 Firefox: Parent container styles:`, parentStyle);
  } else {
    console.log('❌ Firefox: Button not found in DOM at all');
  }

  // 7. Check for any CSS that might be hiding the button
  const allButtons = await page.locator('button').all();
  console.log(`🔘 Firefox: Total buttons found: ${allButtons.length}`);
  
  for (let i = 0; i < allButtons.length; i++) {
    const text = await allButtons[i].textContent();
    const testId = await allButtons[i].getAttribute('data-testid');
    console.log(`  Button ${i}: "${text}" (testid: ${testId})`);
  }

  // 8. Check if there are any CSS rules affecting the button
  const cssRules = await page.evaluate(() => {
    const button = document.querySelector('[data-testid="create-rule-btn"]');
    if (!button) return null;
    
    const rules = [];
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('create-rule-btn')) {
            rules.push({
              selector: rule.selectorText,
              cssText: rule.cssText
            });
          }
        }
      } catch (e) {
        // Cross-origin stylesheets will throw
      }
    }
    return rules;
  });

  console.log(`🎨 Firefox: CSS rules affecting button:`, cssRules);
}); 