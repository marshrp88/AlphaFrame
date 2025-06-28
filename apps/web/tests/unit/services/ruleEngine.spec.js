import { describe, it, expect, vi, beforeEach, afterEach } from '@jest/globals';
import ruleEngine from '../../../src/lib/services/ruleEngine';
import { RuleSchema } from '@/lib/validation/schemas';

// CLUSTER 2 FIX: Proper transaction data with required fields
const mockTransaction = {
  id: 'txn_123',
  amount: 1500,
  date: '2024-01-15',
  category: 'income',
  description: 'Test transaction'
};

describe('ruleEngine (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should evaluate simple greater-than rule', async () => {
    const rule = {
      id: 'test-rule',
      name: 'Test Rule',
      description: 'Test rule for high amounts',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 1000
        }
      ],
      action: {
        type: 'notification',
        payload: { message: 'High balance alert' }
      },
      logicOperator: 'AND',
      enabled: true
    };

    const result = await ruleEngine.evaluateRule(rule, mockTransaction);
    
    expect(result.matched).toBe(true);
    expect(result.action).toEqual(rule.action);
  });

  it('should evaluate AND conditions', async () => {
    const rule = {
      id: 'complex-rule',
      name: 'Complex Rule',
      description: 'Complex rule with multiple conditions',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 1000
        },
        {
          field: 'category',
          operator: '===',
          value: 'income'
        }
      ],
      action: {
        type: 'webhook',
        payload: { url: 'https://api.example.com/webhook' }
      },
      logicOperator: 'AND',
      enabled: true
    };

    const result = await ruleEngine.evaluateRule(rule, mockTransaction);
    
    expect(result.matched).toBe(true);
  });

  it('should return false for unmet conditions', async () => {
    const rule = {
      id: 'test-rule',
      name: 'Test Rule',
      description: 'Test rule for high amounts',
      conditions: [
        {
          field: 'amount',
          operator: '>',
          value: 2000
        }
      ],
      action: {
        type: 'notification',
        payload: { message: 'High balance alert' }
      },
      logicOperator: 'AND',
      enabled: true
    };

    const result = await ruleEngine.evaluateRule(rule, mockTransaction);
    
    expect(result.matched).toBe(false);
  });

  it('should handle invalid rule format gracefully', async () => {
    const rule = {
      id: 'invalid-rule',
      name: 'Invalid Rule',
      description: 'Invalid rule for testing',
      conditions: [
        { field: 'nonexistent_field', operator: '>', value: 100 }
      ],
      action: {
        type: 'notification',
        payload: { message: 'Test' }
      },
      logicOperator: 'AND',
      enabled: true
    };
    
    // Test that invalid rules are handled gracefully
    const result = await ruleEngine.evaluateRule(rule, mockTransaction);
    expect(result.matched).toBe(false);
    expect(result.ruleId).toBe('invalid-rule');
  });

  // Add more tests for edge cases as needed
});

// Notes:
// - This file is focused on ruleEngine logic only.
// - All external dependencies are mocked or stubbed.
// - Each test is isolated and easy to understand for a 10th-grade reader.
// - CLUSTER 2 FIXES: Added proper transaction data with required fields and fixed rule operators.
// - PHASE 2 FIXES: Updated schema field names to match actual service implementation. 
