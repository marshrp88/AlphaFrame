import { test } from '@playwright/test';

test('should debug element visibility', async ({ page }) => {
  // Navigate to rules page
  await page.goto('/rules');
  
  // Wait for the page to load
  await page.waitForSelector('[data-testid="debug-rulespage"]', { timeout: 10000 });
  
  // Click create rule button
  await page.click('[data-testid="create-rule-button"]');
  
  // Wait for action selector to appear
  await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
  
  // Select PLAID_TRANSFER
  await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
  
  // Wait for any rendering
  await page.waitForTimeout(3000);
  
  // Check all possible selectors
  const selectors = [
    '[data-testid="from-account"]',
    '[data-testid="to-account"]',
    '[data-testid="amount"]',
    'select[data-testid="from-account"]',
    'select[data-testid="to-account"]',
    'input[data-testid="amount"]',
    '.from-account',
    '.to-account',
    '.amount-input',
    'form select',
    'form input',
    'form [data-testid]'
  ];
  
  console.log('\n🔍 Checking all possible selectors:');
  for (const selector of selectors) {
    try {
      const count = await page.locator(selector).count();
      const isVisible = await page.locator(selector).first().isVisible().catch(() => false);
      console.log(`${selector}: count=${count}, visible=${isVisible}`);
    } catch (error) {
      console.log(`${selector}: error - ${error.message}`);
    }
  }
  
  // Check all form elements
  const formElements = await page.locator('form, select, input, [data-testid]').all();
  console.log('\n📋 All form-related elements:');
  for (let i = 0; i < Math.min(formElements.length, 20); i++) {
    try {
      const element = formElements[i];
      const tagName = await element.evaluate(el => el.tagName);
      const testId = await element.getAttribute('data-testid');
      const className = await element.getAttribute('class');
      const isVisible = await element.isVisible();
      console.log(`Element ${i}: ${tagName}, testid="${testId}", class="${className}", visible=${isVisible}`);
    } catch (error) {
      console.log(`Element ${i}: error - ${error.message}`);
    }
  }
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-visibility-result.png', fullPage: true });
  
  // Get page content and look for specific patterns
  const content = await page.content();
  const hasFromAccount = content.includes('from-account');
  const hasToAccount = content.includes('to-account');
  const hasAmount = content.includes('amount');
  
  console.log('\n🔍 Content analysis:');
  console.log('Contains "from-account":', hasFromAccount);
  console.log('Contains "to-account":', hasToAccount);
  console.log('Contains "amount":', hasAmount);
  
  // Look for the actual rendered form
  const formContent = await page.locator('form').first().innerHTML().catch(() => 'No form found');
  console.log('\n📄 Form content preview:');
  console.log(formContent.substring(0, 500));
});
