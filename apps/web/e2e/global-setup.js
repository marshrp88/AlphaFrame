/**
 * Global Setup for E2E Tests
 * 
 * This file configures the test environment before running E2E tests.
 * It sets up mocks, authentication state, and browser API stubs.
 */

import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🔧 Setting up E2E test environment...');
  
  // Launch browser to set up test state
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the app and set up authentication state
    await page.goto('http://localhost:5174');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Mock localStorage for test data
    await page.evaluate(() => {
      // Set up test authentication state
      localStorage.setItem('auth_token', 'test_token_123');
      localStorage.setItem('user_id', 'test_user_123');
      localStorage.setItem('auth_state', JSON.stringify({
        isAuthenticated: true,
        user: {
          id: 'test_user_123',
          email: 'test@alphaframe.dev',
          name: 'Test User'
        }
      }));
      
      // Mock IndexedDB for test data
      const mockData = {
        rules: [
          {
            id: 'test_rule_1',
            trigger: 'checking_account_balance > 5000',
            action: 'PLAID_TRANSFER',
            enabled: true
          }
        ],
        transactions: [
          {
            id: 'test_txn_1',
            amount: 6000,
            account: 'Chase Checking',
            date: new Date().toISOString()
          }
        ]
      };
      
      // Store mock data in localStorage for tests
      localStorage.setItem('test_data', JSON.stringify(mockData));
    });
    
    console.log('✅ E2E test environment configured successfully');
    
  } catch (error) {
    console.error('❌ Failed to set up E2E test environment:', error);
  } finally {
    await browser.close();
  }
}

export default globalSetup; 