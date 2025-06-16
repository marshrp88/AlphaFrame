import { describe, it, expect } from 'vitest';
import {
  evaluateRule,
  executeRule,
  validateRule,
  getMatchingRules,
} from '../../../src/lib/services/ruleEngine.js';

// Mock data for tests
const mockTransaction = {
  id: 'txn_1',
  amount: 150,
  description: 'Starbucks',
  category: 'Food',
};

const mockRule = {
  id: 'rule_1',
  name: 'High Spending Alert',
  conditions: [{ field: 'amount', operator: '>', value: 100 }],
  action: { type: 'alert', message: 'High amount purchase detected' },
};

const invalidTransaction = { id: 'txn_2' }; // Missing 'amount' field
const invalidRule = { id: 'rule_2' }; // Missing conditions/action

describe('RuleEngine Integration', () => {
  it('should evaluate rule conditions correctly', async () => {
    // Test that the async function resolves to the correct boolean
    await expect(evaluateRule(mockRule, mockTransaction)).resolves.toBe(true);
  });

  it('should execute rule actions', async () => {
    // Test that the async function resolves to the correct action object
    await expect(executeRule(mockRule)).resolves.toEqual(mockRule.action);
  });

  it('should validate rule structure', async () => {
    // Test that the async function correctly validates both good and bad rules
    await expect(validateRule(mockRule)).resolves.toBe(true);
    await expect(validateRule(invalidRule)).resolves.toBe(false);
  });

  it('should find matching rules for a transaction', async () => {
    const allRules = [mockRule, { ...mockRule, id: 'rule_3', conditions: [{ field: 'amount', operator: '<', value: 50 }] }];
    
    // CRITICAL FIX: We must `await` the result of the async function
    const matchingRules = await getMatchingRules(mockTransaction, allRules);
    
    expect(matchingRules).toBeInstanceOf(Array);
    expect(matchingRules.length).toBe(1);
    expect(matchingRules[0]).toHaveProperty('id', 'rule_1');
  });

  it('should handle invalid rule structures gracefully', async () => {
    // Test that `validateRule` correctly identifies an invalid rule
    await expect(validateRule(invalidRule)).resolves.toBe(false);
  });

  it('should handle rule execution errors by rejecting', async () => {
    // Test that `evaluateRule` rejects the promise for invalid inputs
    await expect(evaluateRule(mockRule, invalidTransaction)).rejects.toThrow();
  });
}); 