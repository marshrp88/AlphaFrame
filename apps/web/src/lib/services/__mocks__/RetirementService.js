import { vi } from 'vitest';

class RetirementService {
  constructor() {
    // Mock constructor - no real initialization needed
  }

  calculateRetirementReadiness = vi.fn().mockImplementation(async (userData) => {
    return {
      projectedSavings: 2500000,
      monthlyContribution: 1500,
      yearsToRetirement: 25,
      readinessScore: 85,
      confidence: 0.85,
      retirementIncomeNeeds: 80000,
      optimalContribution: 2000,
      insights: [
        {
          type: 'contribution',
          title: 'Increase Retirement Contributions',
          description: 'You could improve your retirement readiness by increasing monthly contributions.',
          priority: 'high'
        }
      ]
    };
  });

  runMonteCarloSimulation = vi.fn().mockImplementation(async (userData, simulations = 1000) => {
    return {
      totalSimulations: simulations,
      successRate: 78,
      averageReadinessScore: 75,
      medianReadinessScore: 78,
      minReadinessScore: 45,
      maxReadinessScore: 95,
      averageProjectedSavings: 2500000,
      confidenceIntervals: {
        '25th': 65,
        '50th': 75,
        '75th': 85,
        '90th': 90
      },
      riskAssessment: {
        lowRiskPercentage: 60,
        mediumRiskPercentage: 25,
        highRiskPercentage: 15,
        overallRisk: 'Low'
      }
    };
  });

  calculateCurrentSavings = vi.fn().mockReturnValue(100000);
  calculateProjectedSavings = vi.fn().mockReturnValue(2500000);
  calculateRetirementIncomeNeeds = vi.fn().mockReturnValue(80000);
  calculateReadinessScore = vi.fn().mockReturnValue(85);
  calculateOptimalContribution = vi.fn().mockReturnValue(2000);
  generateRetirementInsights = vi.fn().mockReturnValue([
    {
      type: 'contribution',
      title: 'Increase Retirement Contributions',
      description: 'You could improve your retirement readiness by increasing monthly contributions.',
      priority: 'high'
    }
  ]);
}

export default RetirementService; 