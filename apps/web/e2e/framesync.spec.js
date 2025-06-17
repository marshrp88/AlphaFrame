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
}); 