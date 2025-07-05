import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the RetirementService mock
vi.mock('@/lib/services/RetirementService', () => ({
  default: {
    calculateRetirementReadiness: vi.fn().mockResolvedValue({
      projectedSavings: 2500000,
      monthlyContribution: 1500,
      yearsToRetirement: 25,
      readinessScore: 85,
      confidence: 0.85
    }),
    runMonteCarloSimulation: vi.fn().mockResolvedValue({
      totalSimulations: 1000,
      successRate: 78,
      averageReadinessScore: 75,
      confidenceIntervals: {
        '25th': 65,
        '50th': 75,
        '75th': 85,
        '90th': 90
      }
    })
  }
}));

import RetirementService from '@/lib/services/RetirementService';

describe('RetirementService Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mocked RetirementService instead of real implementation', async () => {
    const result = await RetirementService.calculateRetirementReadiness({
      currentAge: 35,
      currentIncome: 75000,
      retirementAccounts: [{ balance: 100000 }],
      monthlyContributions: 1500
    });
    
    expect(RetirementService.calculateRetirementReadiness).toHaveBeenCalledWith({
      currentAge: 35,
      currentIncome: 75000,
      retirementAccounts: [{ balance: 100000 }],
      monthlyContributions: 1500
    });
    expect(result.projectedSavings).toBe(2500000);
    expect(result.readinessScore).toBe(85);
  });

  it('should mock Monte Carlo simulation', async () => {
    const result = await RetirementService.runMonteCarloSimulation({
      currentAge: 35,
      currentIncome: 75000,
      retirementAccounts: [{ balance: 100000 }],
      monthlyContributions: 1500
    }, 1000);
    
    expect(RetirementService.runMonteCarloSimulation).toHaveBeenCalledWith({
      currentAge: 35,
      currentIncome: 75000,
      retirementAccounts: [{ balance: 100000 }],
      monthlyContributions: 1500
    }, 1000);
    expect(result.successRate).toBe(78);
    expect(result.totalSimulations).toBe(1000);
  });
}); 