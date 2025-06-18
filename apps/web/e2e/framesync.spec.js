/**
 * FrameSync End-to-End Test Suite
 * 
 * This suite validates the complete user journey of creating and executing
 * FrameSync rules, ensuring all components work together seamlessly.
 */

import { test, expect } from '@playwright/test';

test.describe('FrameSync Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the rules page and ensure we're logged in
    await page.goto('/rules');
    await expect(page.getByTestId('debug-rulespage')).toBeVisible();
    await expect(page).toHaveURL(/.*\/rules/);
  });

  test('should create and execute a Plaid transfer rule', async ({ page }) => {
    // Click the "Create Rule" button
    await page.click('button:has-text("Create Rule")');

    // Fill in the rule trigger
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000');

    // Select Plaid transfer action
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');

    // Fill in the Plaid transfer form
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Enable simulation
    await page.check('[data-testid="run-simulation"]');

    // Wait for simulation preview
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();

    // Save the rule
    await page.click('button:has-text("Save Rule")');

    // Wait for DOM update
    await page.waitForTimeout(250);
    // Verify success message with explicit wait
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
  });

  test('should handle high-risk action cancellation', async ({ page }) => {
    // Create a rule with a high-risk action
    await page.click('button:has-text("Create Rule")');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    
    // Fill in required fields
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');

    // Save the rule
    await page.click('button:has-text("Save Rule")');

    // Cancel the confirmation dialog
    await page.click('button:has-text("Cancel")');

    // Verify the rule was not created
    await expect(page.getByText("Rule created successfully")).not.toBeVisible();
  });

  test('should validate form inputs', async ({ page }) => {
    // Create a rule
    await page.click('button:has-text("Create Rule")');
    
    // Try to save without filling required fields
    await page.click('button:has-text("Save Rule")');

    // Verify validation messages
    await expect(page.getByText("Please fill in all required fields")).toBeVisible();
    
    // Fill in invalid data
    await page.fill('[data-testid="amount"]', '-100');
    await page.click('button:has-text("Save Rule")');

    // Verify validation message for negative amount
    await expect(page.getByText("Amount must be positive")).toBeVisible();
  });

  test('should handle simulation preview', async ({ page }) => {
    // Create a rule
    await page.click('button:has-text("Create Rule")');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    
    // Fill in required fields
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
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
    // Navigate to action log
    await page.click('a:has-text("Action Log")');

    // Verify action log table is visible
    await expect(page.locator('table')).toBeVisible();

    // Create and execute a rule
    await page.click('button:has-text("Create Rule")');
    await page.selectOption('[data-testid="action-selector"]', 'ADD_MEMO');
    await page.fill('[data-testid="memo-text"]', 'Test memo');
    await page.click('button:has-text("Save Rule")');

    // Navigate back to action log
    await page.click('a:has-text("Action Log")');

    // Wait for DOM update
    await page.waitForTimeout(250);
    // Verify new entry appears in log with explicit wait
    await expect(page.getByText("Test memo")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("ADD_MEMO")).toBeVisible({ timeout: 5000 });
  });

  // --- Rule Creation Edge Cases (AND/OR conditions) ---
  test('should create a rule with multiple AND/OR conditions', async ({ page }) => {
    // This test checks if the app can handle complex rule logic with AND/OR
    await page.click('button:has-text("Create Rule")');
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000 AND savings_account_balance > 10000 OR credit_score > 700');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '500');
    await page.click('button:has-text("Save Rule")');
    await page.waitForTimeout(250);
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
  });

  // --- Safeguards toggle and confirmation modal logic ---
  test('should show or skip confirmation modal based on Safeguards toggle', async ({ page }) => {
    // This test checks if toggling Safeguards affects the confirmation modal
    await page.click('button:has-text("Create Rule")');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    // Safeguards OFF: should skip confirmation
    await page.uncheck('[data-testid="safeguards-toggle"]');
    await page.click('button:has-text("Save Rule")');
    await expect(page.getByTestId('confirmation-modal')).not.toBeVisible();
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
    // Safeguards ON: should show confirmation
    await page.click('button:has-text("Create Rule")');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    await page.check('[data-testid="safeguards-toggle"]');
    await page.click('button:has-text("Save Rule")');
    await expect(page.getByTestId('confirmation-modal')).toBeVisible();
    await page.click('button:has-text("Cancel")');
    await expect(page.getByTestId("rule-toast")).not.toBeVisible();
  });

  // --- Golden Path test with ActionLog UI check ---
  test('should complete the Golden Path and verify ActionLog UI', async ({ page }) => {
    // This test simulates the main user journey and checks the ActionLog
    await page.click('button:has-text("Create Rule")');
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    await page.check('[data-testid="run-simulation"]');
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();
    await page.click('button:has-text("Save Rule")');
    await page.waitForTimeout(250);
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });
    // Go to Action Log and verify the new entry
    await page.click('a:has-text("Action Log")');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText("PLAID_TRANSFER")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("1000")).toBeVisible({ timeout: 5000 });
  });
}); 