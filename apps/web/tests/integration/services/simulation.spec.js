import { describe, it, expect, beforeEach } from 'vitest';
import { runDebtVsInvestment, generateScenario, calculateOptimalStrategy, projectFutureState } from '../../../src/lib/services/simulation';

describe('SimulationService Integration', () => {
  let mockParams;
  let mockFinancialState;
  let mockStrategy;

  beforeEach(() => {
    mockParams = {
      initialDebt: 10000,
      interestRate: 0.05,
      investmentReturn: 0.07,
      monthlyPayment: 500,
      timeframe: 24
    };

    mockFinancialState = {
      debt: 10000,
      investments: 5000,
      monthlyIncome: 5000,
      monthlyExpenses: 3000
    };

    mockStrategy = {
      type: 'aggressive',
      monthlyDebtPayment: 1000,
      monthlyInvestment: 500
    };
  });

  it('should run debt vs investment simulation', async () => {
    const results = await runDebtVsInvestment(mockParams);
    expect(results).toHaveProperty('totalDebtPaid');
    expect(results).toHaveProperty('totalInvestmentGain');
    expect(results).toHaveProperty('netBenefit');
  });

  it('should generate realistic scenarios', async () => {
    const scenario = await generateScenario(mockFinancialState);
    expect(scenario).toHaveProperty('projectedDebt');
    expect(scenario).toHaveProperty('projectedInvestments');
    expect(scenario).toHaveProperty('monthlyCashFlow');
  });

  it('should calculate optimal strategy', async () => {
    const strategy = await calculateOptimalStrategy(mockParams);
    expect(strategy).toHaveProperty('monthlyDebtPayment');
    expect(strategy).toHaveProperty('monthlyInvestment');
    expect(strategy).toHaveProperty('expectedOutcome');
  });

  it('should project future state', async () => {
    const futureState = await projectFutureState(mockFinancialState, mockStrategy);
    expect(futureState).toHaveProperty('projectedDebt');
    expect(futureState).toHaveProperty('projectedInvestments');
    expect(futureState).toHaveProperty('projectedNetWorth');
  });

  it('should handle invalid parameters', async () => {
    const invalidParams = { ...mockParams, initialDebt: -1000 };
    await expect(runDebtVsInvestment(invalidParams)).rejects.toThrow();
  });

  it('should handle edge cases', async () => {
    const edgeCaseParams = {
      ...mockParams,
      monthlyPayment: 0,
      timeframe: 1
    };
    const results = await runDebtVsInvestment(edgeCaseParams);
    expect(results).toBeDefined();
  });
}); 