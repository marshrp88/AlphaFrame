/**
 * RetirementService.test.js
 * 
 * PURPOSE: Comprehensive unit tests for RetirementService to ensure accurate
 * retirement calculations, Monte Carlo simulations, and insight generation.
 * 
 * PROCEDURE:
 * 1. Test retirement readiness calculations with various scenarios
 * 2. Validate Monte Carlo simulation accuracy and performance
 * 3. Verify insight generation and recommendation logic
 * 4. Test edge cases and error handling
 * 5. Ensure data validation and security compliance
 * 
 * CONCLUSION: Validates that RetirementService provides reliable, accurate
 * retirement planning capabilities for AlphaFrame Galileo V2.2.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import RetirementService from '../RetirementService.js';

// Mock dependencies
vi.mock('../ExecutionLogService.js', () => ({
  ExecutionLogService: vi.fn().mockImplementation(() => ({
    logExecution: vi.fn()
  }))
}));

vi.mock('../validation/schemas.js', () => ({
  InsightFeedSchema: {
    validateRetirementResult: vi.fn((result) => result)
  }
}));

describe('RetirementService', () => {
  let retirementService;
  let mockUserData;

  beforeEach(() => {
    retirementService = new RetirementService();
    mockUserData = {
      currentAge: 35,
      currentIncome: 75000,
      retirementAccounts: [
        { name: '401(k)', balance: 50000 },
        { name: 'IRA', balance: 25000 }
      ],
      monthlyContributions: 1000,
      expectedRetirementAge: 67,
      expectedLifeExpectancy: 90
    };
  });

  describe('calculateRetirementReadiness', () => {
    it('should calculate retirement readiness for a typical user', async () => {
      const result = await retirementService.calculateRetirementReadiness(mockUserData);

      expect(result).toHaveProperty('readinessScore');
      expect(result).toHaveProperty('projectedSavings');
      expect(result).toHaveProperty('retirementIncomeNeeds');
      expect(result).toHaveProperty('yearsToRetirement');
      expect(result).toHaveProperty('monthlyContributionNeeded');
      expect(result).toHaveProperty('insights');
      expect(result).toHaveProperty('breakdown');

      expect(result.readinessScore).toBeGreaterThan(0);
      expect(result.readinessScore).toBeLessThanOrEqual(100);
      expect(result.projectedSavings).toBeGreaterThan(0);
      expect(result.retirementIncomeNeeds).toBeGreaterThan(0);
      expect(result.yearsToRetirement).toBe(32);
    });

    it('should handle empty retirement accounts', async () => {
      const userDataWithNoAccounts = {
        ...mockUserData,
        retirementAccounts: []
      };

      const result = await retirementService.calculateRetirementReadiness(userDataWithNoAccounts);

      expect(result.breakdown.currentSavings).toBe(0);
      expect(result.readinessScore).toBeLessThan(50); // Should be low without existing savings
    });

    it('should handle high-income users', async () => {
      const highIncomeUser = {
        ...mockUserData,
        currentIncome: 200000,
        monthlyContributions: 3000
      };

      const result = await retirementService.calculateRetirementReadiness(highIncomeUser);

      expect(result.retirementIncomeNeeds).toBeGreaterThan(mockUserData.currentIncome * 0.8);
      expect(result.monthlyContributionNeeded).toBeGreaterThan(0);
    });

    it('should handle users close to retirement', async () => {
      const nearRetirementUser = {
        ...mockUserData,
        currentAge: 60,
        expectedRetirementAge: 65
      };

      const result = await retirementService.calculateRetirementReadiness(nearRetirementUser);

      expect(result.yearsToRetirement).toBe(5);
      expect(result.readinessScore).toBeLessThan(100); // Likely lower due to short time horizon
    });

    it('should throw error for invalid input data', async () => {
      const invalidData = {
        currentAge: -5, // Invalid age
        currentIncome: 75000
      };

      await expect(retirementService.calculateRetirementReadiness(invalidData))
        .rejects.toThrow('Retirement calculation failed');
    });
  });

  describe('calculateCurrentSavings', () => {
    it('should calculate total savings from multiple accounts', () => {
      const accounts = [
        { name: '401(k)', balance: 50000 },
        { name: 'IRA', balance: 25000 },
        { name: 'Roth IRA', balance: 15000 }
      ];

      const total = retirementService.calculateCurrentSavings(accounts);
      expect(total).toBe(90000);
    });

    it('should handle null or undefined accounts', () => {
      expect(retirementService.calculateCurrentSavings(null)).toBe(0);
      expect(retirementService.calculateCurrentSavings(undefined)).toBe(0);
      expect(retirementService.calculateCurrentSavings([])).toBe(0);
    });

    it('should handle accounts with missing balance', () => {
      const accounts = [
        { name: '401(k)', balance: 50000 },
        { name: 'IRA' }, // Missing balance
        { name: 'Roth IRA', balance: 15000 }
      ];

      const total = retirementService.calculateCurrentSavings(accounts);
      expect(total).toBe(65000);
    });
  });

  describe('calculateProjectedSavings', () => {
    it('should calculate projected savings with compound interest', () => {
      const currentSavings = 75000;
      const monthlyContribution = 1000;
      const currentAge = 35;
      const retirementAge = 67;

      const projected = retirementService.calculateProjectedSavings(
        currentSavings,
        monthlyContribution,
        currentAge,
        retirementAge
      );

      expect(projected).toBeGreaterThan(currentSavings);
      expect(projected).toBeGreaterThan(currentSavings + (monthlyContribution * 12 * 32));
    });

    it('should handle zero current savings', () => {
      const projected = retirementService.calculateProjectedSavings(
        0,
        1000,
        35,
        67
      );

      expect(projected).toBeGreaterThan(0);
      expect(projected).toBeGreaterThan(1000 * 12 * 32); // Should be more than simple multiplication due to compound interest
    });

    it('should handle zero monthly contributions', () => {
      const currentSavings = 75000;
      const projected = retirementService.calculateProjectedSavings(
        currentSavings,
        0,
        35,
        67
      );

      expect(projected).toBeGreaterThan(currentSavings);
      expect(projected).toBeLessThan(currentSavings * 10); // Reasonable upper bound
    });
  });

  describe('calculateRetirementIncomeNeeds', () => {
    it('should calculate retirement income needs based on current income', () => {
      const currentIncome = 75000;
      const retirementAge = 67;
      const lifeExpectancy = 90;

      const needs = retirementService.calculateRetirementIncomeNeeds(
        currentIncome,
        retirementAge,
        lifeExpectancy
      );

      expect(needs).toBeGreaterThan(currentIncome * 0.6); // At least 60% of current income
      expect(needs).toBeLessThan(currentIncome * 1.2); // Not more than 120% of current income
    });

    it('should adjust for inflation over time', () => {
      const currentIncome = 75000;
      const earlyRetirement = 55;
      const lateRetirement = 70;

      const earlyNeeds = retirementService.calculateRetirementIncomeNeeds(
        currentIncome,
        earlyRetirement,
        90
      );

      const lateNeeds = retirementService.calculateRetirementIncomeNeeds(
        currentIncome,
        lateRetirement,
        90
      );

      expect(lateNeeds).toBeGreaterThan(earlyNeeds); // Later retirement should need more due to inflation
    });
  });

  describe('calculateReadinessScore', () => {
    it('should calculate high readiness score for well-funded retirement', () => {
      const projectedSavings = 2000000; // $2M
      const retirementIncomeNeeds = 80000; // $80K annual
      const yearsToRetirement = 20;

      const score = retirementService.calculateReadinessScore(
        projectedSavings,
        retirementIncomeNeeds,
        yearsToRetirement
      );

      expect(score).toBeGreaterThan(80);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('should calculate low readiness score for underfunded retirement', () => {
      const projectedSavings = 200000; // $200K
      const retirementIncomeNeeds = 80000; // $80K annual
      const yearsToRetirement = 20;

      const score = retirementService.calculateReadinessScore(
        projectedSavings,
        retirementIncomeNeeds,
        yearsToRetirement
      );

      expect(score).toBeLessThan(60);
    });

    it('should penalize users close to retirement with insufficient savings', () => {
      const projectedSavings = 300000;
      const retirementIncomeNeeds = 80000;
      const yearsToRetirement = 5; // Close to retirement

      const score = retirementService.calculateReadinessScore(
        projectedSavings,
        retirementIncomeNeeds,
        yearsToRetirement
      );

      expect(score).toBeLessThan(50); // Should be penalized
    });
  });

  describe('calculateOptimalContribution', () => {
    it('should calculate optimal contribution for underfunded retirement', () => {
      const currentSavings = 100000;
      const targetRetirementIncome = 80000;
      const yearsToRetirement = 20;

      const optimal = retirementService.calculateOptimalContribution(
        currentSavings,
        targetRetirementIncome,
        yearsToRetirement
      );

      expect(optimal).toBeGreaterThan(0);
      expect(optimal).toBeLessThan(5000); // Reasonable monthly contribution
    });

    it('should return zero for well-funded retirement', () => {
      const currentSavings = 2000000; // Already well-funded
      const targetRetirementIncome = 80000;
      const yearsToRetirement = 20;

      const optimal = retirementService.calculateOptimalContribution(
        currentSavings,
        targetRetirementIncome,
        yearsToRetirement
      );

      expect(optimal).toBe(0);
    });
  });

  describe('generateRetirementInsights', () => {
    it('should generate success insights for high readiness score', () => {
      const insights = retirementService.generateRetirementInsights(
        85, // High readiness score
        2000000, // High projected savings
        80000, // Retirement income needs
        1000, // Current contribution
        20 // Years to retirement
      );

      expect(insights).toHaveLength(1);
      expect(insights[0].type).toBe('success');
      expect(insights[0].title).toContain('Excellent');
    });

    it('should generate warning insights for moderate readiness score', () => {
      const insights = retirementService.generateRetirementInsights(
        65, // Moderate readiness score
        800000, // Moderate projected savings
        80000, // Retirement income needs
        1000, // Current contribution
        20 // Years to retirement
      );

      expect(insights).toHaveLength(2);
      expect(insights[0].type).toBe('warning');
      expect(insights[0].title).toContain('Good Progress');
    });

    it('should generate danger insights for low readiness score', () => {
      const insights = retirementService.generateRetirementInsights(
        35, // Low readiness score
        300000, // Low projected savings
        80000, // Retirement income needs
        500, // Low contribution
        20 // Years to retirement
      );

      expect(insights).toHaveLength(2);
      expect(insights[0].type).toBe('danger');
      expect(insights[0].title).toContain('Critical');
    });

    it('should generate contribution optimization insights when needed', () => {
      const insights = retirementService.generateRetirementInsights(
        60, // Moderate score
        600000, // Moderate savings
        80000, // Retirement income needs
        500, // Low contribution
        20 // Years to retirement
      );

      const contributionInsight = insights.find(insight => 
        insight.title.includes('Contribution Optimization')
      );
      expect(contributionInsight).toBeDefined();
    });
  });

  describe('runMonteCarloSimulation', () => {
    it('should run Monte Carlo simulation successfully', async () => {
      const result = await retirementService.runMonteCarloSimulation(mockUserData, 100);

      expect(result).toHaveProperty('totalSimulations');
      expect(result).toHaveProperty('averageReadinessScore');
      expect(result).toHaveProperty('medianReadinessScore');
      expect(result).toHaveProperty('minReadinessScore');
      expect(result).toHaveProperty('maxReadinessScore');
      expect(result).toHaveProperty('successRate');
      expect(result).toHaveProperty('confidenceIntervals');
      expect(result).toHaveProperty('riskAssessment');

      expect(result.totalSimulations).toBe(100);
      expect(result.averageReadinessScore).toBeGreaterThan(0);
      expect(result.averageReadinessScore).toBeLessThanOrEqual(100);
    });

    it('should handle different simulation counts', async () => {
      const result = await retirementService.runMonteCarloSimulation(mockUserData, 50);

      expect(result.totalSimulations).toBe(50);
    });

    it('should calculate confidence intervals correctly', async () => {
      const result = await retirementService.runMonteCarloSimulation(mockUserData, 100);

      expect(result.confidenceIntervals).toHaveProperty('25th');
      expect(result.confidenceIntervals).toHaveProperty('50th');
      expect(result.confidenceIntervals).toHaveProperty('75th');
      expect(result.confidenceIntervals).toHaveProperty('90th');

      // Percentiles should be in ascending order
      expect(result.confidenceIntervals['25th']).toBeLessThanOrEqual(result.confidenceIntervals['50th']);
      expect(result.confidenceIntervals['50th']).toBeLessThanOrEqual(result.confidenceIntervals['75th']);
      expect(result.confidenceIntervals['75th']).toBeLessThanOrEqual(result.confidenceIntervals['90th']);
    });

    it('should assess risk levels appropriately', async () => {
      const result = await retirementService.runMonteCarloSimulation(mockUserData, 100);

      expect(result.riskAssessment).toHaveProperty('overallRisk');
      expect(result.riskAssessment).toHaveProperty('readinessRisk');
      expect(result.riskAssessment).toHaveProperty('volatilityRisk');
      expect(result.riskAssessment).toHaveProperty('recommendations');

      expect(['Low', 'Medium', 'High']).toContain(result.riskAssessment.overallRisk);
      expect(Array.isArray(result.riskAssessment.recommendations)).toBe(true);
    });
  });

  describe('Statistical calculations', () => {
    it('should calculate mean correctly', () => {
      const values = [1, 2, 3, 4, 5];
      const mean = retirementService.calculateMean(values);
      expect(mean).toBe(3);
    });

    it('should calculate median correctly for odd number of values', () => {
      const values = [1, 3, 5, 7, 9];
      const median = retirementService.calculateMedian(values);
      expect(median).toBe(5);
    });

    it('should calculate median correctly for even number of values', () => {
      const values = [1, 3, 5, 7];
      const median = retirementService.calculateMedian(values);
      expect(median).toBe(4);
    });

    it('should calculate standard deviation correctly', () => {
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const stdDev = retirementService.calculateStdDev(values);
      expect(stdDev).toBeCloseTo(2, 1);
    });

    it('should calculate percentiles correctly', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const median = retirementService.calculatePercentile(values, 50);
      expect(median).toBe(5.5);
    });
  });

  describe('Random number generation', () => {
    it('should generate random returns within reasonable bounds', () => {
      const returns = [];
      for (let i = 0; i < 1000; i++) {
        returns.push(retirementService.generateRandomReturn());
      }

      const mean = retirementService.calculateMean(returns);
      expect(mean).toBeCloseTo(0.07, 1); // Should be close to 7%
    });

    it('should generate random inflation within reasonable bounds', () => {
      const inflationRates = [];
      for (let i = 0; i < 1000; i++) {
        inflationRates.push(retirementService.generateRandomInflation());
      }

      const mean = retirementService.calculateMean(inflationRates);
      expect(mean).toBeCloseTo(0.025, 2); // Should be close to 2.5%
    });
  });
}); 