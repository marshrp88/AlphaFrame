import { vi } from 'vitest';

class TaxService {
  constructor() {
    // Mock constructor - no real initialization needed
  }

  calculateTaxLiability = vi.fn().mockImplementation(async (financialData) => {
    return {
      totalTax: 5000,
      effectiveTaxRate: 15,
      breakdown: {
        federalTax: 4000,
        stateTax: 1000,
        income: financialData.income || 50000,
        taxableIncome: 35400,
        marginalRate: 22,
        averageRate: 15
      },
      recommendations: [
        {
          type: 'retirement',
          title: 'Increase 401(k) Contributions',
          description: 'You could save up to $500 in taxes by maximizing your 401(k) contributions.',
          potentialSavings: 500,
          priority: 'high',
          action: 'Increase 401(k) contribution to $22,500 annually'
        }
      ],
      timestamp: new Date().toISOString(),
      version: '2.2.0'
    };
  });

  calculateFederalTax = vi.fn().mockReturnValue(4000);

  calculateStateTax = vi.fn().mockReturnValue(1000);

  calculateDeductions = vi.fn().mockReturnValue({
    standard: 14600,
    itemized: 0,
    total: 14600,
    type: 'standard'
  });

  calculateCredits = vi.fn().mockReturnValue({
    total: 0,
    breakdown: {}
  });

  generateOptimizationRecommendations = vi.fn().mockReturnValue([
    {
      type: 'retirement',
      title: 'Increase 401(k) Contributions',
      description: 'You could save up to $500 in taxes by maximizing your 401(k) contributions.',
      potentialSavings: 500,
      priority: 'high',
      action: 'Increase 401(k) contribution to $22,500 annually'
    }
  ]);

  getMarginalTaxRate = vi.fn().mockReturnValue(0.22);

  runTaxSimulation = vi.fn().mockImplementation(async (baseFinancialData, scenarios) => {
    return {
      base: await this.calculateTaxLiability(baseFinancialData),
      scenarios: {
        optimized: await this.calculateTaxLiability({ ...baseFinancialData, retirementContributions: 22500 }),
        conservative: await this.calculateTaxLiability({ ...baseFinancialData, retirementContributions: 0 })
      }
    };
  });
}

export default TaxService; 