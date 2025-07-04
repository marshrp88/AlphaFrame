import { test, expect } from '@playwright/test';

test('Debug modal form to see what fields are available', async ({ page, browserName }) => {
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
  
  // 5. Print all form elements in the modal
  const modal = page.getByTestId('rule-creation-modal');
  
  // Check for labels
  const labels = await modal.locator('label').all();
  console.log(`🏷️ Found ${labels.length} labels in modal:`);
  for (let i = 0; i < labels.length; i++) {
    const text = await labels[i].textContent();
    const htmlFor = await labels[i].getAttribute('for');
    console.log(`  Label ${i}: "${text}" (for: ${htmlFor})`);
  }
  
  // Check for inputs
  const inputs = await modal.locator('input').all();
  console.log(`📝 Found ${inputs.length} inputs in modal:`);
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const id = await inputs[i].getAttribute('id');
    const placeholder = await inputs[i].getAttribute('placeholder');
    console.log(`  Input ${i}: type="${type}" id="${id}" placeholder="${placeholder}"`);
  }
  
  // Check for textareas
  const textareas = await modal.locator('textarea').all();
  console.log(`📄 Found ${textareas.length} textareas in modal:`);
  for (let i = 0; i < textareas.length; i++) {
    const id = await textareas[i].getAttribute('id');
    const placeholder = await textareas[i].getAttribute('placeholder');
    console.log(`  Textarea ${i}: id="${id}" placeholder="${placeholder}"`);
  }
  
  // Check for buttons
  const buttons = await modal.locator('button').all();
  console.log(`🔘 Found ${buttons.length} buttons in modal:`);
  for (let i = 0; i < buttons.length; i++) {
    const text = await buttons[i].textContent();
    const type = await buttons[i].getAttribute('type');
    console.log(`  Button ${i}: "${text}" (type: ${type})`);
  }
  
  // 6. Try to find elements by label text
  console.log('🔍 Trying to find elements by label text:');
  const ruleNameLabel = modal.getByText('Rule Name');
  const amountLabel = modal.getByText('Amount');
  const descriptionLabel = modal.getByText('Description');
  
  console.log(`  Rule Name label count: ${await ruleNameLabel.count()}`);
  console.log(`  Amount label count: ${await amountLabel.count()}`);
  console.log(`  Description label count: ${await descriptionLabel.count()}`);
  
  // 7. Try to find elements by ID
  console.log('🔍 Trying to find elements by ID:');
  const ruleNameInput = page.locator('#rule-name-input');
  const amountInput = page.locator('#rule-amount-input');
  const descriptionInput = page.locator('#rule-description-input');
  
  console.log(`  #rule-name-input count: ${await ruleNameInput.count()}`);
  console.log(`  #rule-amount-input count: ${await amountInput.count()}`);
  console.log(`  #rule-description-input count: ${await descriptionInput.count()}`);
  
  // 8. Print modal HTML for debugging
  const modalHtml = await modal.innerHTML();
  console.log('📄 Modal HTML (first 500 chars):', modalHtml.substring(0, 500));
}); 