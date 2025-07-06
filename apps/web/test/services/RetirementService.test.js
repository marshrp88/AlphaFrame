import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the RetirementService mock
vi.mock('@/lib/services/RetirementService', () => ({
  default: {
    calculateRetirementReadiness: vi.fn(() => ({
      projectedSavings: 2500000,
      readinessScore: 85,
      monthlyContribution: 1500,
      yearsToRetirement: 25
    })),
    runMonteCarloSimulation: vi.fn(() => ({
      successRate: 78,
      totalSimulations: 1000,
      averageOutcome: 2800000,
      worstCase: 1800000,
      bestCase: 4200000
    }))
  }
}));

import RetirementService from '@/lib/services/RetirementService';

describe('RetirementService Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mocked RetirementService instead of real implementation', () => {
    const result = RetirementService.calculateRetirementReadiness({
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 100000,
      monthlyContributions: 1500
    });
    expect(result.projectedSavings).toBe(2500000);
    expect(result.readinessScore).toBe(85);
  });

  it('should mock Monte Carlo simulation', () => {
    const result = RetirementService.runMonteCarloSimulation({
      currentAge: 35,
      retirementAge: 65,
      currentSavings: 100000,
      monthlyContributions: 1500
    }, 1000);
    expect(result.successRate).toBe(78);
    expect(result.totalSimulations).toBe(1000);
  });
}); 