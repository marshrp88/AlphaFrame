import { test } from '@playwright/test';

test('should capture console logs', async ({ page }) => {
  // Listen for console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
    console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
  });

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
  
  // Wait for any rendering and console messages
  await page.waitForTimeout(5000);
  
  // Log all console messages
  console.log('\n📋 All console messages:');
  consoleMessages.forEach((msg, index) => {
    console.log(`${index + 1}. [${msg.type}] ${msg.text}`);
  });
  
  // Check if PlaidActionForm was mentioned in console
  const plaidLogs = consoleMessages.filter(msg => 
    msg.text.includes('PlaidActionForm') || 
    msg.text.includes('PLAID_TRANSFER') ||
    msg.text.includes('RuleBinderRoot')
  );
  
  console.log('\n🎯 PlaidActionForm related logs:');
  plaidLogs.forEach((msg, index) => {
    console.log(`${index + 1}. [${msg.type}] ${msg.text}`);
  });
  
  // Take a screenshot
  await page.screenshot({ path: 'console-test-result.png', fullPage: true });
  
  // Check for errors
  const errors = consoleMessages.filter(msg => msg.type === 'error');
  if (errors.length > 0) {
    console.log('\n❌ Errors found:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error.text}`);
    });
  }
});
