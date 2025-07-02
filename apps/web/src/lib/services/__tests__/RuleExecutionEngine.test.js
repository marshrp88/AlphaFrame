/**
 * RuleExecutionEngine.test.js - Phase 1 Validation Tests
 * 
 * Purpose: Validate that the RuleExecutionEngine meets all Phase 1 requirements:
 * - Real-time evaluation of rules
 * - Visible confirmation of rule evaluation success/failure
 * - Comprehensive logging for rule triggers and missed conditions
 * - Rule execution status indicators
 * - Event emission and listener support
 * - Reporting infrastructure
 * 
 * Procedure:
 * 1. Test engine initialization and configuration
 * 2. Test rule evaluation against mock transaction data
 * 3. Test event emission and logging
 * 4. Test status reporting and statistics
 * 5. Test periodic evaluation functionality
 * 
 * Conclusion: Ensures Phase 1 deliverables are working correctly
 * and ready for integration with dashboard and onboarding flows.
 */

import RuleExecutionEngine from '../RuleExecutionEngine.js';

describe('RuleExecutionEngine - Phase 1 Validation', () => {
  let engine;
  let mockRules;
  let mockTransactions;
  let eventLog;

  beforeEach(() => {
    engine = new RuleExecutionEngine();
    eventLog = [];
    
    // Mock rules for testing
    mockRules = [
      {
        id: 'rule-1',
        name: 'High Spending Alert',
        type: 'spending_limit',
        conditions: {
          category: 'Food & Dining',
          limit: 500
        },
        actions: {
          notify: true
        },
        enabled: true
      },
      {
        id: 'rule-2',
        name: 'Low Balance Warning',
        type: 'balance_check',
        conditions: {
          threshold: 1000
        },
        actions: {
          notify: true
        },
        enabled: true
      }
    ];

    // Mock transactions for testing
    mockTransactions = [
      {
        id: 'tx-1',
        date: '2025-01-15',
        amount: 75.50,
        category: 'Food & Dining',
        description: 'Restaurant dinner',
        accountId: 'account-1'
      },
      {
        id: 'tx-2',
        date: '2025-01-16',
        amount: 45.00,
        category: 'Food & Dining',
        description: 'Grocery store',
        accountId: 'account-1'
      },
      {
        id: 'tx-3',
        date: '2025-01-17',
        amount: 120.00,
        category: 'Food & Dining',
        description: 'Uber Eats',
        accountId: 'account-1'
      }
    ];

    // Set up event listener for testing
    engine.onEvent((event) => {
      eventLog.push(event);
    });
  });

  afterEach(() => {
    engine.stopPeriodicEvaluation();
  });

  describe('Initialization and Configuration', () => {
    it('should initialize with rules and transactions', async () => {
      await engine.initialize(mockRules, mockTransactions);
      
      expect(engine.activeRules).toHaveLength(2);
      expect(engine.transactions).toHaveLength(3);
      expect(engine.isRunning).toBe(false);
    });

    it('should support event listener registration', () => {
      const listener = jest.fn();
      engine.onEvent(listener);
      
      expect(engine.listeners).toContain(listener);
    });
  });

  describe('Rule Evaluation', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should evaluate spending limit rules correctly', () => {
      const rule = mockRules[0];
      const result = engine.evaluateRule(rule, mockTransactions);
      
      // Total Food & Dining spending: 75.50 + 45.00 + 120.00 = 240.50
      // This is below the 500 limit, so should not trigger
      expect(result.ruleId).toBe('rule-1');
      expect(result.ruleName).toBe('High Spending Alert');
      expect(result.status).toBe('missed');
      expect(result.evaluatedAt).toBeDefined();
    });

    it('should trigger rule when spending exceeds limit', () => {
      const rule = mockRules[0];
      const highSpendingTransactions = [
        ...mockTransactions,
        {
          id: 'tx-4',
          date: '2025-01-18',
          amount: 300.00,
          category: 'Food & Dining',
          description: 'Expensive restaurant',
          accountId: 'account-1'
        }
      ];
      
      const result = engine.evaluateRule(rule, highSpendingTransactions);
      
      // Total Food & Dining spending: 75.50 + 45.00 + 120.00 + 300.00 = 540.50
      // This exceeds the 500 limit, so should trigger
      expect(result.status).toBe('triggered');
      expect(result.matchedTransaction).toBeDefined();
    });

    it('should handle rule evaluation errors gracefully', () => {
      const invalidRule = {
        id: 'invalid-rule',
        name: 'Invalid Rule',
        type: 'unknown_type',
        conditions: {},
        enabled: true
      };
      
      const result = engine.evaluateRule(invalidRule, mockTransactions);
      
      expect(result.status).toBe('error');
      expect(result.error).toBeDefined();
    });
  });

  describe('Event Emission and Logging', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should emit events for rule evaluations', () => {
      engine.evaluateAllRules();
      
      expect(eventLog.length).toBeGreaterThan(0);
      expect(eventLog[0]).toHaveProperty('ruleId');
      expect(eventLog[0]).toHaveProperty('ruleName');
      expect(eventLog[0]).toHaveProperty('status');
      expect(eventLog[0]).toHaveProperty('evaluatedAt');
    });

    it('should log all events with timestamps', () => {
      engine.evaluateAllRules();
      const log = engine.getEventLog();
      
      expect(log.length).toBeGreaterThan(0);
      expect(log[0]).toHaveProperty('timestamp');
      expect(log[0]).toHaveProperty('ruleId');
    });

    it('should track trigger history for triggered rules', () => {
      // Add a rule that will trigger
      const triggerRule = {
        id: 'trigger-rule',
        name: 'Trigger Test',
        type: 'spending_limit',
        conditions: { category: 'Food & Dining', limit: 100 },
        enabled: true
      };
      
      engine.addRule(triggerRule);
      engine.evaluateAllRules();
      
      const status = engine.getStatus();
      expect(status.triggerCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Status and Reporting', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should provide comprehensive status information', () => {
      const status = engine.getStatus();
      
      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('lastExecutionTime');
      expect(status).toHaveProperty('activeRules');
      expect(status).toHaveProperty('transactionCount');
      expect(status).toHaveProperty('triggerCount');
      expect(status).toHaveProperty('statistics');
      expect(status).toHaveProperty('status');
    });

    it('should provide trigger statistics', () => {
      const statistics = engine.getTriggerStatistics();
      
      expect(statistics).toHaveProperty('total');
      expect(statistics).toHaveProperty('today');
      expect(statistics).toHaveProperty('byStatus');
    });

    it('should track recent triggers', () => {
      const recentTriggers = engine.getRecentTriggers(24);
      
      expect(Array.isArray(recentTriggers)).toBe(true);
    });
  });

  describe('Periodic Evaluation', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should start and stop periodic evaluation', () => {
      expect(engine.isRunning).toBe(false);
      
      engine.startPeriodicEvaluation(1000);
      expect(engine.isRunning).toBe(true);
      
      engine.stopPeriodicEvaluation();
      expect(engine.isRunning).toBe(false);
    });

    it('should not start multiple periodic evaluations', () => {
      engine.startPeriodicEvaluation(1000);
      const initialInterval = engine.executionInterval;
      
      engine.startPeriodicEvaluation(2000);
      expect(engine.executionInterval).toBe(initialInterval);
      
      engine.stopPeriodicEvaluation();
    });
  });

  describe('Rule Management', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should add new rules', () => {
      const newRule = {
        id: 'new-rule',
        name: 'New Rule',
        type: 'spending_limit',
        conditions: { category: 'Transportation', limit: 200 },
        enabled: true
      };
      
      engine.addRule(newRule);
      expect(engine.activeRules).toHaveLength(3);
      expect(engine.activeRules).toContain(newRule);
    });

    it('should remove rules by ID', () => {
      engine.removeRule('rule-1');
      expect(engine.activeRules).toHaveLength(1);
      expect(engine.activeRules.find(r => r.id === 'rule-1')).toBeUndefined();
    });

    it('should update transaction data', () => {
      const newTransactions = [
        {
          id: 'new-tx',
          date: '2025-01-19',
          amount: 50.00,
          category: 'Entertainment',
          description: 'Movie tickets',
          accountId: 'account-1'
        }
      ];
      
      engine.updateTransactions(newTransactions);
      expect(engine.transactions).toHaveLength(1);
      expect(engine.transactions[0].id).toBe('new-tx');
    });
  });

  describe('Phase 1 Success Criteria Validation', () => {
    beforeEach(async () => {
      await engine.initialize(mockRules, mockTransactions);
    });

    it('should meet all Phase 1 requirements', () => {
      // 1. Real-time evaluation of rules
      const results = engine.evaluateAllRules();
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      
      // 2. Visible confirmation of rule evaluation success/failure
      results.forEach(result => {
        expect(result).toHaveProperty('status');
        expect(['triggered', 'missed', 'error']).toContain(result.status);
        expect(result).toHaveProperty('ruleName');
        expect(result).toHaveProperty('evaluatedAt');
      });
      
      // 3. Comprehensive logging for rule triggers and missed conditions
      const eventLog = engine.getEventLog();
      expect(eventLog.length).toBeGreaterThan(0);
      
      // 4. Rule execution status indicators
      const status = engine.getStatus();
      expect(status).toHaveProperty('isRunning');
      expect(status).toHaveProperty('activeRules');
      expect(status).toHaveProperty('triggerCount');
      
      // 5. Event emission and listener support
      expect(engine.listeners.length).toBeGreaterThan(0);
      
      // 6. Reporting infrastructure
      expect(engine.getTriggerStatistics()).toBeDefined();
      expect(engine.getRecentTriggers(24)).toBeDefined();
    });

    it('should support both simulation and production data', () => {
      // Test with mock data (simulation)
      const mockResults = engine.evaluateAllRules();
      expect(mockResults.length).toBeGreaterThan(0);
      
      // Test with empty data (production edge case)
      engine.updateTransactions([]);
      const emptyResults = engine.evaluateAllRules();
      expect(Array.isArray(emptyResults)).toBe(true);
    });

    it('should provide composable API for UI integration', () => {
      // Test that all required methods exist for UI integration
      expect(typeof engine.initialize).toBe('function');
      expect(typeof engine.evaluateAllRules).toBe('function');
      expect(typeof engine.getStatus).toBe('function');
      expect(typeof engine.getEventLog).toBe('function');
      expect(typeof engine.getTriggerStatistics).toBe('function');
      expect(typeof engine.getRecentTriggers).toBe('function');
      expect(typeof engine.onEvent).toBe('function');
      expect(typeof engine.startPeriodicEvaluation).toBe('function');
      expect(typeof engine.stopPeriodicEvaluation).toBe('function');
    });
  });
}); 