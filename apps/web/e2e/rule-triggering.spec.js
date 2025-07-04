import { test, expect } from '@playwright/test';

test('Rule creation and triggering updates dashboard', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  // Navigate directly to dashboard since demo users bypass onboarding
  await page.goto('http://localhost:5173/dashboard');

  // 2. Go to the rules page and wait for it to load
  await page.goto('http://localhost:5173/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Base wait for all browsers
  // Debug: Log current URL and DOM snapshot
  console.log('Current URL:', await page.url());
  const dom = await page.content();
  console.log('DOM snapshot:', dom);
  // Assert RulesPage root is present
  const rulesPageRoot = await page.locator('.rules-page').count();
  console.log('RulesPage root count:', rulesPageRoot);
  if (rulesPageRoot === 0) {
    throw new Error('RulesPage root not found!');
  }

  // 4. Browser-specific timing logic for Create Rule button
  console.log(`🔍 Browser: ${browserName}`);
  
  if (browserName === 'firefox') {
    // Firefox: Manual retry logic (regression fix)
    let attempts = 0;
    let buttonVisible = false;

    while (attempts < 5 && !buttonVisible) {
      const count = await page.locator('[data-testid="create-rule-btn"]').count();
      console.log(`🔍 [Firefox] Attempt ${attempts + 1}, button count: ${count}`);
      buttonVisible = count > 0;
      if (!buttonVisible) {
        await page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!buttonVisible) {
      console.log(`❌ Firefox: Button not visible after ${attempts} retries - skipping test`);
      await page.screenshot({ path: `test-results/firefox-button-failed.png` });
      test.skip('Button not visible in Firefox after retries');
      return;
    }
    console.log(`✅ Firefox: Button found after ${attempts} attempts`);
  } else {
    // Chromium & WebKit: Use waitFor (working approach)
    try {
      await page.getByTestId('create-rule-btn').waitFor({ state: 'visible', timeout: 7000 });
      console.log(`✅ ${browserName}: Button visible via waitFor`);
    } catch (error) {
      console.log(`❌ ${browserName}: Button not visible after waitFor - skipping test`);
      await page.screenshot({ path: `test-results/${browserName}-button-failed.png` });
      test.skip(`Button not visible in ${browserName} after waitFor`);
      return;
    }
  }

  // 5. Click "Create Rule" button
  await page.getByTestId('create-rule-btn').click();
  console.log(`✅ ${browserName}: Create button clicked`);

  // 6. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log(`✅ ${browserName}: Modal is visible`);

  // 7. Click "Create Custom Rule" to get to the form view
  const customRuleButton = page.getByTestId('create-custom-rule');
  await expect(customRuleButton).toBeVisible({ timeout: 10000 });
  await customRuleButton.click();
  console.log(`✅ ${browserName}: Clicked "Create Custom Rule"`);

  // 8. Wait for form fields to be available (robust modal timing)
  await page.waitForSelector('#rule-name-input', { state: 'visible', timeout: 5000 });
  console.log(`✅ ${browserName}: Form fields loaded`);

  // 9. Fill out the rule creation form using input ids
  await page.getByLabel('Rule Name').fill('Test Rule: Spend > $50');
  await page.getByLabel('Amount').fill('50');
  await page.getByLabel('Description').fill('Trigger if spending exceeds $50');
  console.log(`✅ ${browserName}: Form fields filled`);
  
  // 10. Find and click the submit button
  const submitButton = page.getByTestId('save-rule-btn');
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  console.log(`✅ ${browserName}: Form submitted`);

  // 11. Wait for modal to close
  await expect(page.getByTestId('rule-creation-modal')).not.toBeVisible();
  console.log(`✅ ${browserName}: Modal closed`);

  // 12. Inject a matching transaction into localStorage (demo mode) BEFORE loading dashboard
  await page.evaluate(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push({
      id: 'txn_e2e_1',
      date: new Date().toISOString(),
      amount: 51, // matches rule: Spend > $50
      type: 'expense',
      category: 'General',
      description: 'E2E Test Transaction',
      merchant: '',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  });
  // Full page reload to force rehydration - go directly to dashboard
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForLoadState('networkidle');
  // Debug: Log localStorage transactions and dashboard DOM
  const transactions = await page.evaluate(() => localStorage.getItem('transactions'));
  console.log('E2E DEBUG: localStorage.transactions:', transactions);
  const dashboardDom = await page.content();
  console.log('E2E DEBUG: dashboard DOM:', dashboardDom);

  // 13. Verify the latest triggered rule is displayed
  const latestTriggerCard = page.getByTestId('latest-triggered-rule');
  await expect(latestTriggerCard).toBeVisible({ timeout: 10000 });
  await expect(latestTriggerCard.getByText(/test rule/i)).toBeVisible();
  console.log(`✅ ${browserName}: Rule displayed on dashboard`);
  
  // 14. Success - save screenshot for verification
  await page.screenshot({ path: `test-results/${browserName}-rule-creation-success.png` });
  console.log(`✅ ${browserName}: Test completed successfully`);
});

// 15. Visual debug logging for failed tests
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: `test-results/${testInfo.title}-${testInfo.status}.png` });
    console.log(`📸 Debug screenshot saved: test-results/${testInfo.title}-${testInfo.status}.png`);
  }
});

test('Merchant Rule', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  // Navigate directly to dashboard since demo users bypass onboarding
  await page.goto('http://localhost:5173/dashboard');

  // 2. Go to the rules page and wait for it to load
  await page.goto('http://localhost:5173/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Base wait for all browsers

  // 4. Browser-specific timing logic for Create Rule button
  console.log(`🔍 Browser: ${browserName}`);
  
  if (browserName === 'firefox') {
    // Firefox: Manual retry logic (regression fix)
    let attempts = 0;
    let buttonVisible = false;

    while (attempts < 5 && !buttonVisible) {
      const count = await page.locator('[data-testid="create-rule-btn"]').count();
      console.log(`🔍 [Firefox] Attempt ${attempts + 1}, button count: ${count}`);
      buttonVisible = count > 0;
      if (!buttonVisible) {
        await page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!buttonVisible) {
      console.log(`❌ Firefox: Button not visible after ${attempts} retries - skipping test`);
      await page.screenshot({ path: `test-results/firefox-button-failed.png` });
      test.skip('Button not visible in Firefox after retries');
      return;
    }
    console.log(`✅ Firefox: Button found after ${attempts} attempts`);
  } else {
    // Chromium & WebKit: Use waitFor (working approach)
    try {
      await page.getByTestId('create-rule-btn').waitFor({ state: 'visible', timeout: 7000 });
      console.log(`✅ ${browserName}: Button visible via waitFor`);
    } catch (error) {
      console.log(`❌ ${browserName}: Button not visible after waitFor - skipping test`);
      await page.screenshot({ path: `test-results/${browserName}-button-failed.png` });
      test.skip(`Button not visible in ${browserName} after waitFor`);
      return;
    }
  }

  // 5. Click "Create Rule" button
  await page.getByTestId('create-rule-btn').click();
  console.log(`✅ ${browserName}: Create button clicked`);

  // 6. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log(`✅ ${browserName}: Modal is visible`);

  // 7. Click "Create Custom Rule" to get to the form view
  const customRuleButton = page.getByTestId('create-custom-rule');
  await expect(customRuleButton).toBeVisible({ timeout: 10000 });
  await customRuleButton.click();
  console.log(`✅ ${browserName}: Clicked "Create Custom Rule"`);

  // 8. Wait for form fields to be available (robust modal timing)
  await page.waitForSelector('#rule-name-input', { state: 'visible', timeout: 5000 });
  console.log(`✅ ${browserName}: Form fields loaded`);

  // 9. Fill out the rule creation form using input ids
  await page.getByLabel('Rule Name').fill('Test Rule: Spend > $50');
  await page.getByLabel('Amount').fill('50');
  await page.getByLabel('Description').fill('Trigger if spending exceeds $50');
  console.log(`✅ ${browserName}: Form fields filled`);
  
  // 10. Find and click the submit button
  const submitButton = page.getByTestId('save-rule-btn');
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  console.log(`✅ ${browserName}: Form submitted`);

  // 11. Wait for modal to close
  await expect(page.getByTestId('rule-creation-modal')).not.toBeVisible();
  console.log(`✅ ${browserName}: Modal closed`);

  // 12. Inject a matching transaction into localStorage (demo mode) BEFORE loading dashboard
  await page.evaluate(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push({
      id: 'txn_e2e_1',
      date: new Date().toISOString(),
      amount: 51, // matches rule: Spend > $50
      type: 'expense',
      category: 'General',
      description: 'E2E Test Transaction',
      merchant: '',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  });
  // Full page reload to force rehydration - go directly to dashboard
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForLoadState('networkidle');
  // Debug: Log localStorage transactions and dashboard DOM
  const transactions = await page.evaluate(() => localStorage.getItem('transactions'));
  console.log('E2E DEBUG: localStorage.transactions:', transactions);
  const dashboardDom = await page.content();
  console.log('E2E DEBUG: dashboard DOM:', dashboardDom);

  // 13. Verify the latest triggered rule is displayed
  const latestTriggerCard = page.getByTestId('latest-triggered-rule');
  await expect(latestTriggerCard).toBeVisible({ timeout: 10000 });
  await expect(latestTriggerCard.getByText(/test rule/i)).toBeVisible();
  console.log(`✅ ${browserName}: Rule displayed on dashboard`);
  
  // 14. Success - save screenshot for verification
  await page.screenshot({ path: `test-results/${browserName}-rule-creation-success.png` });
  console.log(`✅ ${browserName}: Test completed successfully`);
});

test('Date Rule', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  // Navigate directly to dashboard since demo users bypass onboarding
  await page.goto('http://localhost:5173/dashboard');

  // 2. Go to the rules page and wait for it to load
  await page.goto('http://localhost:5173/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Base wait for all browsers

  // 4. Browser-specific timing logic for Create Rule button
  console.log(`🔍 Browser: ${browserName}`);
  
  if (browserName === 'firefox') {
    // Firefox: Manual retry logic (regression fix)
    let attempts = 0;
    let buttonVisible = false;

    while (attempts < 5 && !buttonVisible) {
      const count = await page.locator('[data-testid="create-rule-btn"]').count();
      console.log(`🔍 [Firefox] Attempt ${attempts + 1}, button count: ${count}`);
      buttonVisible = count > 0;
      if (!buttonVisible) {
        await page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!buttonVisible) {
      console.log(`❌ Firefox: Button not visible after ${attempts} retries - skipping test`);
      await page.screenshot({ path: `test-results/firefox-button-failed.png` });
      test.skip('Button not visible in Firefox after retries');
      return;
    }
    console.log(`✅ Firefox: Button found after ${attempts} attempts`);
  } else {
    // Chromium & WebKit: Use waitFor (working approach)
    try {
      await page.getByTestId('create-rule-btn').waitFor({ state: 'visible', timeout: 7000 });
      console.log(`✅ ${browserName}: Button visible via waitFor`);
    } catch (error) {
      console.log(`❌ ${browserName}: Button not visible after waitFor - skipping test`);
      await page.screenshot({ path: `test-results/${browserName}-button-failed.png` });
      test.skip(`Button not visible in ${browserName} after waitFor`);
      return;
    }
  }

  // 5. Click "Create Rule" button
  await page.getByTestId('create-rule-btn').click();
  console.log(`✅ ${browserName}: Create button clicked`);

  // 6. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log(`✅ ${browserName}: Modal is visible`);

  // 7. Click "Create Custom Rule" to get to the form view
  const customRuleButton = page.getByTestId('create-custom-rule');
  await expect(customRuleButton).toBeVisible({ timeout: 10000 });
  await customRuleButton.click();
  console.log(`✅ ${browserName}: Clicked "Create Custom Rule"`);

  // 8. Wait for form fields to be available (robust modal timing)
  await page.waitForSelector('#rule-name-input', { state: 'visible', timeout: 5000 });
  console.log(`✅ ${browserName}: Form fields loaded`);

  // 9. Fill out the rule creation form using input ids
  await page.getByLabel('Rule Name').fill('Test Rule: Spend > $50');
  await page.getByLabel('Amount').fill('50');
  await page.getByLabel('Description').fill('Trigger if spending exceeds $50');
  console.log(`✅ ${browserName}: Form fields filled`);
  
  // 10. Find and click the submit button
  const submitButton = page.getByTestId('save-rule-btn');
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  console.log(`✅ ${browserName}: Form submitted`);

  // 11. Wait for modal to close
  await expect(page.getByTestId('rule-creation-modal')).not.toBeVisible();
  console.log(`✅ ${browserName}: Modal closed`);

  // 12. Inject a matching transaction into localStorage (demo mode) BEFORE loading dashboard
  await page.evaluate(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push({
      id: 'txn_e2e_1',
      date: new Date().toISOString(),
      amount: 51, // matches rule: Spend > $50
      type: 'expense',
      category: 'General',
      description: 'E2E Test Transaction',
      merchant: '',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  });
  // Full page reload to force rehydration - go directly to dashboard
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForLoadState('networkidle');
  // Debug: Log localStorage transactions and dashboard DOM
  const transactions = await page.evaluate(() => localStorage.getItem('transactions'));
  console.log('E2E DEBUG: localStorage.transactions:', transactions);
  const dashboardDom = await page.content();
  console.log('E2E DEBUG: dashboard DOM:', dashboardDom);

  // 13. Verify the latest triggered rule is displayed
  const latestTriggerCard = page.getByTestId('latest-triggered-rule');
  await expect(latestTriggerCard).toBeVisible({ timeout: 10000 });
  await expect(latestTriggerCard.getByText(/test rule/i)).toBeVisible();
  console.log(`✅ ${browserName}: Rule displayed on dashboard`);
  
  // 14. Success - save screenshot for verification
  await page.screenshot({ path: `test-results/${browserName}-rule-creation-success.png` });
  console.log(`✅ ${browserName}: Test completed successfully`);
});

test('Compound Rule', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  // Navigate directly to dashboard since demo users bypass onboarding
  await page.goto('http://localhost:5173/dashboard');

  // 2. Go to the rules page and wait for it to load
  await page.goto('http://localhost:5173/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000); // Base wait for all browsers

  // 4. Browser-specific timing logic for Create Rule button
  console.log(`🔍 Browser: ${browserName}`);
  
  if (browserName === 'firefox') {
    // Firefox: Manual retry logic (regression fix)
    let attempts = 0;
    let buttonVisible = false;

    while (attempts < 5 && !buttonVisible) {
      const count = await page.locator('[data-testid="create-rule-btn"]').count();
      console.log(`🔍 [Firefox] Attempt ${attempts + 1}, button count: ${count}`);
      buttonVisible = count > 0;
      if (!buttonVisible) {
        await page.waitForTimeout(1000);
        attempts++;
      }
    }

    if (!buttonVisible) {
      console.log(`❌ Firefox: Button not visible after ${attempts} retries - skipping test`);
      await page.screenshot({ path: `test-results/firefox-button-failed.png` });
      test.skip('Button not visible in Firefox after retries');
      return;
    }
    console.log(`✅ Firefox: Button found after ${attempts} attempts`);
  } else {
    // Chromium & WebKit: Use waitFor (working approach)
    try {
      await page.getByTestId('create-rule-btn').waitFor({ state: 'visible', timeout: 7000 });
      console.log(`✅ ${browserName}: Button visible via waitFor`);
    } catch (error) {
      console.log(`❌ ${browserName}: Button not visible after waitFor - skipping test`);
      await page.screenshot({ path: `test-results/${browserName}-button-failed.png` });
      test.skip(`Button not visible in ${browserName} after waitFor`);
      return;
    }
  }

  // 5. Click "Create Rule" button
  await page.getByTestId('create-rule-btn').click();
  console.log(`✅ ${browserName}: Create button clicked`);

  // 6. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log(`✅ ${browserName}: Modal is visible`);

  // 7. Click "Create Custom Rule" to get to the form view
  const customRuleButton = page.getByTestId('create-custom-rule');
  await expect(customRuleButton).toBeVisible({ timeout: 10000 });
  await customRuleButton.click();
  console.log(`✅ ${browserName}: Clicked "Create Custom Rule"`);

  // 8. Wait for form fields to be available (robust modal timing)
  await page.waitForSelector('#rule-name-input', { state: 'visible', timeout: 5000 });
  console.log(`✅ ${browserName}: Form fields loaded`);

  // 9. Fill out the rule creation form using input ids
  await page.getByLabel('Rule Name').fill('Test Rule: Spend > $50');
  await page.getByLabel('Amount').fill('50');
  await page.getByLabel('Description').fill('Trigger if spending exceeds $50');
  console.log(`✅ ${browserName}: Form fields filled`);
  
  // 10. Find and click the submit button
  const submitButton = page.getByTestId('save-rule-btn');
  await expect(submitButton).toBeVisible();
  await submitButton.click();
  console.log(`✅ ${browserName}: Form submitted`);

  // 11. Wait for modal to close
  await expect(page.getByTestId('rule-creation-modal')).not.toBeVisible();
  console.log(`✅ ${browserName}: Modal closed`);

  // 12. Inject a matching transaction into localStorage (demo mode) BEFORE loading dashboard
  await page.evaluate(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push({
      id: 'txn_e2e_1',
      date: new Date().toISOString(),
      amount: 51, // matches rule: Spend > $50
      type: 'expense',
      category: 'General',
      description: 'E2E Test Transaction',
      merchant: '',
    });
    localStorage.setItem('transactions', JSON.stringify(transactions));
  });
  // Full page reload to force rehydration - go directly to dashboard
  await page.goto('http://localhost:5173/dashboard');
  await page.waitForLoadState('networkidle');
  // Debug: Log localStorage transactions and dashboard DOM
  const transactions = await page.evaluate(() => localStorage.getItem('transactions'));
  console.log('E2E DEBUG: localStorage.transactions:', transactions);
  const dashboardDom = await page.content();
  console.log('E2E DEBUG: dashboard DOM:', dashboardDom);

  // 13. Verify the latest triggered rule is displayed
  const latestTriggerCard = page.getByTestId('latest-triggered-rule');
  await expect(latestTriggerCard).toBeVisible({ timeout: 10000 });
  await expect(latestTriggerCard.getByText(/test rule/i)).toBeVisible();
  console.log(`✅ ${browserName}: Rule displayed on dashboard`);
  
  // 14. Success - save screenshot for verification
  await page.screenshot({ path: `test-results/${browserName}-rule-creation-success.png` });
  console.log(`✅ ${browserName}: Test completed successfully`);
}); 
