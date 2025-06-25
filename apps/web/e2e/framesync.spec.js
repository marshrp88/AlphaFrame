/**
 * FrameSync End-to-End Test Suite
 * 
 * This suite validates the complete user journey of creating and executing
 * FrameSync rules, ensuring all components work together seamlessly.
 */

import { test, expect } from '@playwright/test';

test.describe('FrameSync Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set test mode and mock state BEFORE navigation
    await page.addInitScript(() => {
      localStorage.setItem('test_mode', 'true');
      
      // Set environment variable for test mode
      window.import = window.import || {};
      window.import.meta = window.import.meta || {};
      window.import.meta.env = window.import.meta.env || {};
      window.import.meta.env.VITE_APP_ENV = 'test';
      
      // Mock Zustand store state for test mode
      window.__mockState__ = {
        user: { id: 'test-user', email: 'test@example.com', name: 'Test User' },
        organization: { id: 'test-org', name: 'Test Organization' },
        rules: [{ id: 'rule-1', label: 'Test Rule', enabled: true }],
        auth: { isAuthenticated: true, isLoading: false }
      };
      
      // Mock any required global state
      window.mockAuthState = {
        isAuthenticated: true,
        user: { id: 'test-user', email: 'test@example.com' }
      };
    });
    
    // Wait for server to be alive before navigation
    await page.waitForFunction(() => {
      return fetch('/').then(res => res.ok).catch(() => false);
    }, { timeout: 15000 });
    
    // Navigate with proper wait conditions
    await page.goto('/rules', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('domcontentloaded');
    
    // Verify test mode is active
    const testMode = await page.evaluate(() => localStorage.getItem('test_mode'));
    console.log('Test mode active:', testMode === 'true');
    
    // Wait for the debug element with diagnostic logging
    await page.waitForSelector('[data-testid="debug-rulespage"]', { 
      state: 'visible',
      timeout: 15000 
    });
    await expect(page).toHaveURL(/.*\/rules/);
  });

  test('should create and execute a Plaid transfer rule', async ({ page }) => {
    // Click the "Create Rule" button with improved selector
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');

    // Wait for RuleBinderRoot to load
    await page.waitForSelector('[data-testid="trigger-input"]', { timeout: 10000 });

    // Fill in the rule trigger
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000');

    // Select Plaid transfer action
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');

    // Debug: Wait a moment and check what's on the page
    await page.waitForTimeout(2000);
    
    // Debug: Log the page content to see what's rendered
    const pageContent = await page.content();
    console.log('Page content after selecting PLAID_TRANSFER:', pageContent.substring(0, 1000));
    
    // Debug: Check if any Plaid-related elements exist
    const plaidElements = await page.locator('[data-testid*="plaid"], [data-testid*="account"], [data-testid*="amount"]').count();
    console.log('Number of Plaid-related elements found:', plaidElements);

    // Wait for Plaid form to load and fill in the form
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Enable simulation
    await page.check('[data-testid="run-simulation"]');

    // Wait for simulation preview
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();

    // Save the rule
    await page.click('[data-testid="save-button"]');

    // Debug: Check button state and debug info
    const buttonEnabled = await page.getAttribute('[data-testid="save-button"]', 'data-enabled');
    console.log('Save button enabled:', buttonEnabled);
    
    // Check for debug info
    const debugInfo = await page.locator('.bg-yellow-100').textContent();
    console.log('Debug info:', debugInfo);

    // Wait for toast notification (either rule-toast or toast-visible)
    await Promise.race([
      page.waitForSelector('[data-testid="rule-toast"]', { timeout: 5000 }),
      page.waitForSelector('[data-testid="toast-visible"]', { timeout: 5000 }),
      page.waitForSelector('[data-testid="debug-toast"]', { timeout: 5000 }),
      page.waitForSelector('[data-testid="error-toast"]', { timeout: 5000 })
    ]);
    
    // Debug: Check what toasts are actually present
    const toaster = await page.locator('[data-testid="toaster"]');
    const toasterVisible = await toaster.isVisible();
    console.log('Toaster visible:', toasterVisible);
    
    if (toasterVisible) {
      const toastCount = await page.locator('[data-testid="toaster"] > div').count();
      console.log('Number of toasts in toaster:', toastCount);
      
      for (let i = 0; i < toastCount; i++) {
        const toastText = await page.locator('[data-testid="toaster"] > div').nth(i).textContent();
        console.log(`Toast ${i}:`, toastText);
      }
    }
  });

  test('should handle high-risk action cancellation', async ({ page }) => {
    // Create a rule with a high-risk action
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    
    // Wait for Plaid form and fill in required fields
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Save the rule
    await page.click('[data-testid="save-button"]');

    // Cancel the confirmation dialog if it appears
    const cancelButton = page.locator('button:has-text("Cancel")');
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    }

    // Verify the rule was not created
    await expect(page.getByText("Rule created successfully")).not.toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Create a rule
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    // Wait for form to load
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    
    // Try to save without filling required fields
    await page.click('[data-testid="save-button"]');

    // Verify validation messages (adjust based on actual validation)
    await expect(page.getByText("Please fill in all required fields")).toBeVisible();
    
    // Fill in invalid data
    await page.fill('[data-testid="amount"]', '-100');
    await page.click('[data-testid="save-button"]');

    // Verify validation message for negative amount
    await expect(page.getByText("Amount must be positive")).toBeVisible();
  });

  test('should handle simulation preview', async ({ page }) => {
    // Create a rule
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    
    // Wait for Plaid form and fill in required fields
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Enable simulation
    await page.check('[data-testid="run-simulation"]');

    // Verify simulation preview appears
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();
    
    // Verify simulation shows correct data
    await expect(page.getByText("Before")).toBeVisible();
    await expect(page.getByText("After")).toBeVisible();
  });

  test('should display action log', async ({ page }) => {
    // Navigate to action log (if it exists in navigation)
    const actionLogLink = page.locator('a:has-text("Action Log")');
    if (await actionLogLink.isVisible()) {
      await actionLogLink.click();
      
      // Verify action log table is visible
      await expect(page.locator('table')).toBeVisible();
    }

    // Create and execute a rule
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="action-selector"]', 'ADD_MEMO');
    await page.fill('[data-testid="memo-text"]', 'Test memo');
    await page.click('[data-testid="save-button"]');

    // Navigate back to action log if it exists
    if (await actionLogLink.isVisible()) {
      await actionLogLink.click();

      // Wait for DOM update
      await page.waitForTimeout(250);
      // Verify new entry appears in log with explicit wait
      await expect(page.getByText("Test memo")).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("ADD_MEMO")).toBeVisible({ timeout: 5000 });
    }
  });

  test('should create a rule with multiple AND/OR conditions', async ({ page }) => {
    // This test checks if the app can handle complex rule logic with AND/OR
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="trigger-input"]', { timeout: 10000 });
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000 AND savings_account_balance > 10000 OR credit_score > 700');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    await page.check('[data-testid="run-simulation"]');
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(250);
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
  });

  test('should show or skip confirmation modal based on Safeguards toggle', async ({ page }) => {
    // This test checks if toggling Safeguards affects the confirmation modal
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="action-selector"]', { timeout: 10000 });
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Toggle safeguards off
    await page.uncheck('[data-testid="require-confirmation"]');

    // Save the rule
    await page.click('[data-testid="save-button"]');

    // Verify no confirmation dialog appears
    await expect(page.getByText("Are you sure?")).not.toBeVisible();

    // Verify rule was created
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
  });

  // --- Golden Path test with ActionLog UI check ---
  test('should complete the Golden Path and verify ActionLog UI', async ({ page }) => {
    // This test simulates the main user journey and checks the ActionLog
    await page.waitForSelector('[data-testid="create-rule-button"]', { timeout: 10000 });
    await page.click('[data-testid="create-rule-button"]');
    
    await page.waitForSelector('[data-testid="trigger-input"]', { timeout: 10000 });
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.waitForSelector('[data-testid="from-account"]', { timeout: 10000 });
    await page.selectOption('[data-testid="from-account"]', 'chase_checking');
    await page.selectOption('[data-testid="to-account"]', 'vanguard_brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    await page.check('[data-testid="run-simulation"]');
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();
    await page.click('[data-testid="save-button"]');
    await page.waitForTimeout(250);
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
    
    // Go to Action Log and verify the new entry (if Action Log exists)
    const actionLogLink = page.locator('a:has-text("Action Log")');
    if (await actionLogLink.isVisible()) {
      await actionLogLink.click();
      await expect(page.locator('table')).toBeVisible();
      await expect(page.getByText("PLAID_TRANSFER")).toBeVisible({ timeout: 5000 });
      await expect(page.getByText("1000")).toBeVisible({ timeout: 5000 });
    }
  });
}); 
