import { test, expect } from '@playwright/test';

test.describe('Golden Path Visual Regression', () => {
  test('should complete the canonical user journey and lock UI with screenshots', async ({ page }) => {
    // --- Step 1: Signup ---
    await page.goto('/signup');
    await page.fill('[data-testid="signup-email"]', 'testuser@example.com');
    await page.fill('[data-testid="signup-password"]', 'TestPassword123');
    await page.click('button:has-text("Sign Up")');
    // Take a screenshot after signup
    await expect(page).toHaveScreenshot('01-signup.png');

    // --- Step 2: Login ---
    await page.goto('/login');
    await page.fill('[data-testid="login-email"]', 'testuser@example.com');
    await page.fill('[data-testid="login-password"]', 'TestPassword123');
    await page.click('button:has-text("Log In")');
    // Take a screenshot after login
    await expect(page).toHaveScreenshot('02-login.png');

    // --- Step 3: Create Rule ---
    await page.goto('/rules');
    await page.click('button:has-text("Create Rule")');
    await page.fill('[data-testid="trigger-input"]', 'checking_account_balance > 5000');
    await page.selectOption('[data-testid="action-selector"]', 'PLAID_TRANSFER');
    await page.fill('[data-testid="from-account"]', 'Chase Checking');
    await page.fill('[data-testid="to-account"]', 'Vanguard Brokerage');
    await page.fill('[data-testid="amount"]', '1000');
    await page.check('[data-testid="run-simulation"]');
    await expect(page.locator('[data-testid="simulation-preview"]')).toBeVisible();
    await expect(page).toHaveScreenshot('03-create-rule.png');
    await page.click('button:has-text("Save Rule")');
    await expect(page.getByTestId("rule-toast")).toBeVisible({ timeout: 5000 });

    // --- Step 4: Trigger Action (simulate action execution) ---
    // This step may be implicit if the rule triggers automatically
    // Take a screenshot after action is triggered
    await expect(page).toHaveScreenshot('04-action-triggered.png');

    // --- Step 5: See Log ---
    await page.click('a:has-text("Action Log")');
    await expect(page.locator('table')).toBeVisible();
    await expect(page).toHaveScreenshot('05-action-log.png');
  });
});

// Notes:
// - This test covers the full user journey and locks the UI visually at each step.
// - Screenshots are named for easy review and regression tracking.
// - All steps include clear comments for 10th-grade-level understanding. 
