import { test, expect } from '@playwright/test';

test('Debug modal interaction step', async ({ page, browserName }) => {
  // 1. Go to the app in demo mode
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem('demo_user', 'true');
  });
  
  await page.goto('http://localhost:5177/rules');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // 2. Click create button (we know this works)
  const createButton = page.getByTestId('create-rule-btn');
  await createButton.waitFor({ state: 'visible', timeout: 10000 });
  await createButton.click();
  console.log(`✅ ${browserName}: Create button clicked`);

  // 3. Wait for modal to appear
  await expect(page.getByTestId('rule-creation-modal')).toBeVisible({ timeout: 10000 });
  console.log(`✅ ${browserName}: Modal is visible`);

  // 4. Debug modal contents
  const modal = page.getByTestId('rule-creation-modal');
  
  // Check for the "Create Custom Rule" button
  const customRuleButton = modal.getByTestId('create-custom-rule');
  const customButtonCount = await customRuleButton.count();
  console.log(`🔍 ${browserName}: Custom rule button count: ${customButtonCount}`);
  
  if (customButtonCount > 0) {
    const isVisible = await customRuleButton.isVisible();
    console.log(`👁️ ${browserName}: Custom rule button visible: ${isVisible}`);
    
    // Try to click it
    try {
      await customRuleButton.click();
      console.log(`✅ ${browserName}: Custom rule button clicked successfully`);
      
      // Wait a moment and check for form fields
      await page.waitForTimeout(2000);
      
      const nameInput = page.getByLabel('Rule Name');
      const amountInput = page.getByLabel('Amount');
      const descriptionInput = page.getByLabel('Description');
      
      console.log(`📝 ${browserName}: Form fields found:`);
      console.log(`  - Name input: ${await nameInput.count()}`);
      console.log(`  - Amount input: ${await amountInput.count()}`);
      console.log(`  - Description input: ${await descriptionInput.count()}`);
      
      if (await nameInput.count() > 0) {
        // Try to fill the form
        await nameInput.fill('Test Rule');
        await amountInput.fill('50');
        await descriptionInput.fill('Test description');
        console.log(`✅ ${browserName}: Form filled successfully`);
        
        // Look for submit button
        const submitButton = page.getByRole('button', { name: /save|create|submit/i });
        const submitCount = await submitButton.count();
        console.log(`🔘 ${browserName}: Submit button count: ${submitCount}`);
        
        if (submitCount > 0) {
          await submitButton.click();
          console.log(`✅ ${browserName}: Form submitted successfully`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${browserName}: Error clicking custom rule button:`, error.message);
    }
  } else {
    console.log(`❌ ${browserName}: Custom rule button not found`);
    
    // List all buttons in modal
    const allModalButtons = await modal.locator('button').all();
    console.log(`🔘 ${browserName}: All buttons in modal: ${allModalButtons.length}`);
    
    for (let i = 0; i < allModalButtons.length; i++) {
      const text = await allModalButtons[i].textContent();
      const testId = await allModalButtons[i].getAttribute('data-testid');
      console.log(`  Button ${i}: "${text}" (testid: ${testId})`);
    }
  }
  
  // 5. Save screenshot for debugging
  await page.screenshot({ path: `test-results/${browserName}-modal-debug.png` });
  console.log(`📸 ${browserName}: Modal debug screenshot saved`);
}); 