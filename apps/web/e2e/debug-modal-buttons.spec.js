import { test, expect } from '@playwright/test';

test('Debug modal buttons to see exact text content', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  
  await page.goto('http://localhost:5177/rules');
  await page.waitForLoadState('networkidle');
  
  // 2. Check if create button is available
  const createButton = page.getByTestId('create-rule-btn');
  const buttonCount = await createButton.count();
  console.log(`🔍 Browser: ${browserName}, Create button count: ${buttonCount}`);
  
  if (buttonCount === 0) {
    console.log('❌ Create button not found - skipping test');
    return;
  }
  
  // 3. Click create button
  await createButton.click();
  console.log('✅ Create button clicked');
  
  // 4. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log('✅ Modal is visible');
  
  // 5. Print all buttons in the modal with exact text
  const modal = page.getByTestId('rule-creation-modal');
  const buttons = await modal.locator('button').all();
  console.log(`🔘 Found ${buttons.length} buttons in modal:`);
  
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const type = await buttons[i].getAttribute('type');
    const isVisible = await buttons[i].isVisible();
    console.log(`  Button ${i}: "${text}" (type: ${type}, visible: ${isVisible})`);
  }
  
  // 6. Try to find the custom rule button with different approaches
  console.log('🔍 Trying different approaches to find custom rule button:');
  
  // Approach 1: Exact text match
  const customRuleButton1 = modal.getByRole('button', { name: 'Create Custom Rule' });
  console.log(`  Exact text "Create Custom Rule": ${await customRuleButton1.count()}`);
  
  // Approach 2: Partial text match
  const customRuleButton2 = modal.getByRole('button', { name: /create custom rule/i });
  console.log(`  Partial text /create custom rule/i: ${await customRuleButton2.count()}`);
  
  // Approach 3: Contains text
  const customRuleButton3 = modal.getByText('Create Custom Rule');
  console.log(`  getByText "Create Custom Rule": ${await customRuleButton3.count()}`);
  
  // Approach 4: Contains partial text
  const customRuleButton4 = modal.getByText(/custom rule/i);
  console.log(`  getByText /custom rule/i: ${await customRuleButton4.count()}`);
  
  // 7. Print all text content in the modal
  const allText = await modal.textContent();
  console.log('📄 All text content in modal:', allText);
  
  // 8. Try clicking the button if found
  if (await customRuleButton1.count() > 0) {
    console.log('✅ Found custom rule button, trying to click...');
    await customRuleButton1.click();
    console.log('✅ Custom rule button clicked');
    
    // Wait a moment and check if form appears
    await page.waitForTimeout(2000);
    
    // Check for form fields
    const inputs = await modal.locator('input').all();
    console.log(`📝 Found ${inputs.length} inputs after clicking custom rule button:`);
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const id = await inputs[i].getAttribute('id');
      console.log(`  Input ${i}: type="${type}" id="${id}"`);
    }
  } else {
    console.log('❌ Custom rule button not found');
  }
}); 