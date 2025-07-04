/**
 * Demo Data Index - Centralized Demo Data Management
 * 
 * Purpose: Single source for all demo data across AlphaFrame.
 * Provides consistent mock data for testing and demo mode.
 * 
 * Procedure:
 * 1. Export mock transactions
 * 2. Export mock rules
 * 3. Export mock triggered rules
 * 4. Provide data generation utilities
 * 
 * Conclusion: Centralized demo data prevents inconsistencies.
 */

// Mock transactions for demo mode
export const mockTransactions = [
  {
    id: 'txn_demo_1',
    date: new Date().toISOString(),
    amount: 51.00,
    type: 'expense',
    category: 'Food & Dining',
    description: 'Starbucks Coffee',
    merchant: 'Starbucks',
  },
  {
    id: 'txn_demo_2',
    date: new Date().toISOString(),
    amount: 125.50,
    type: 'expense',
    category: 'Shopping',
    description: 'Amazon Purchase',
    merchant: 'Amazon',
  },
  {
    id: 'txn_demo_3',
    date: new Date().toISOString(),
    amount: 2500.00,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    merchant: 'Company Inc',
  }
];

// Mock rules for demo mode
export const mockRules = [
  {
    id: 'rule_demo_1',
    name: 'High Spending Alert',
    description: 'Alert when spending exceeds $50',
    type: 'amount',
    condition: 'greater_than',
    value: 50,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule_demo_2',
    name: 'Starbucks Monitor',
    description: 'Track Starbucks spending',
    type: 'merchant',
    condition: 'equals',
    value: 'Starbucks',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule_demo_3',
    name: 'Large Purchase Alert',
    description: 'Alert for purchases over $100',
    type: 'amount',
    condition: 'greater_than',
    value: 100,
    active: true,
    createdAt: new Date().toISOString(),
  }
];

// Mock triggered rules for demo mode
export const mockTriggeredRules = [
  {
    id: 'trigger_demo_1',
    ruleId: 'rule_demo_1',
    ruleName: 'High Spending Alert',
    transactionId: 'txn_demo_1',
    transactionDescription: 'Starbucks Coffee',
    amount: 51.00,
    triggeredAt: new Date().toISOString(),
    status: 'new'
  },
  {
    id: 'trigger_demo_2',
    ruleId: 'rule_demo_2',
    ruleName: 'Starbucks Monitor',
    transactionId: 'txn_demo_1',
    transactionDescription: 'Starbucks Coffee',
    amount: 51.00,
    triggeredAt: new Date().toISOString(),
    status: 'new'
  },
  {
    id: 'trigger_demo_3',
    ruleId: 'rule_demo_3',
    ruleName: 'Large Purchase Alert',
    transactionId: 'txn_demo_2',
    transactionDescription: 'Amazon Purchase',
    amount: 125.50,
    triggeredAt: new Date().toISOString(),
    status: 'new'
  }
];

// Demo data utilities
export const DemoDataService = {
  /**
   * Get all demo data for initialization
   */
  getAll: () => ({
    transactions: mockTransactions,
    rules: mockRules,
    triggeredRules: mockTriggeredRules
  }),

  /**
   * Generate a new mock transaction
   */
  generateTransaction: (overrides = {}) => ({
    id: `txn_demo_${Date.now()}`,
    date: new Date().toISOString(),
    amount: 50.00,
    type: 'expense',
    category: 'General',
    description: 'Demo Transaction',
    merchant: '',
    ...overrides
  }),

  /**
   * Generate a new mock rule
   */
  generateRule: (overrides = {}) => ({
    id: `rule_demo_${Date.now()}`,
    name: 'Demo Rule',
    description: 'Demo rule for testing',
    type: 'amount',
    condition: 'greater_than',
    value: 50,
    active: true,
    createdAt: new Date().toISOString(),
    ...overrides
  })
};

export default DemoDataService; 