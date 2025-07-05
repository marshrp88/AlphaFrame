import { vi } from 'vitest';

const RuleEngine = {
  evaluateRules: vi.fn().mockResolvedValue([
    {
      matched: true,
      ruleId: 'rule_1',
      ruleName: 'High Spending Alert',
      action: 'notification',
      transactionId: 'txn_1'
    }
  ]),
  executeRule: vi.fn().mockResolvedValue({
    ruleId: 'rule_1',
    ruleName: 'High Spending Alert',
    actionType: 'notification',
    status: 'executed'
  }),
  simulateRule: vi.fn().mockResolvedValue({
    ruleId: 'rule_1',
    wouldTrigger: true,
    status: 'simulated'
  }),
  validateRule: vi.fn().mockResolvedValue({
    valid: true,
    errors: []
  }),
  registerRule: vi.fn().mockReturnValue('rule_123'),
  unregisterRule: vi.fn().mockResolvedValue(true)
};

// Make all methods spyable
Object.keys(RuleEngine).forEach(key => {
  if (typeof RuleEngine[key] === 'function') {
    RuleEngine[key] = vi.fn(RuleEngine[key]);
  }
});

export default RuleEngine;
export { RuleEngine }; 