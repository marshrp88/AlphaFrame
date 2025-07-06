/**
 * RetirementService.js
 * 
 * PURPOSE: Provides comprehensive retirement forecasting capabilities for AlphaFrame Galileo V2.2
 * This service calculates retirement readiness, forecasts future financial scenarios,
 * and provides actionable insights for retirement planning.
 * 
 * PROCEDURE:
 * 1. Analyzes current retirement accounts and contributions
 * 2. Calculates projected retirement savings using compound interest
 * 3. Estimates retirement income needs based on lifestyle factors
 * 4. Provides retirement readiness scoring and recommendations
 * 5. Generates explainable insights for user understanding
 * 
 * CONCLUSION: Enables users to make informed retirement planning decisions
 * with clear, actionable guidance and comprehensive forecasting.
 */

import { InsightFeedSchema } from '../validation/schemas.js';
import { ExecutionLogService } from '../../core/services/ExecutionLogService.js';

class RetirementService {
  constructor() {
    this.executionLog = new ExecutionLogService('RetirementService');
    this.retirementAge = 67; // Default retirement age
    this.lifeExpectancy = 90; // Default life expectancy
    this.inflationRate = 0.025; // 2.5% annual inflation
    this.marketReturnRate = 0.07; // 7% annual market return
    this.socialSecurityMultiplier = 0.4; // 40% of pre-retirement income
  }

  /**
   * Calculate retirement readiness score and comprehensive analysis
   * @param {Object} userData - User financial data
   * @returns {Object} Retirement analysis results
   */
  async calculateRetirementReadiness(userData) {
    try {
      this.executionLog.logExecution('calculateRetirementReadiness', { input: userData });

      const {
        currentAge,
        currentIncome,
        retirementAccounts,
        monthlyContributions,
        expectedRetirementAge = this.retirementAge,
        expectedLifeExpectancy = this.lifeExpectancy
      } = userData;

      // Calculate current retirement savings
      const currentSavings = this.calculateCurrentSavings(retirementAccounts);
      
      // Calculate projected savings at retirement
      const projectedSavings = this.calculateProjectedSavings(
        currentSavings,
        monthlyContributions,
        currentAge,
        expectedRetirementAge
      );

      // Calculate retirement income needs
      const retirementIncomeNeeds = this.calculateRetirementIncomeNeeds(
        currentIncome,
        expectedRetirementAge,
        expectedLifeExpectancy
      );

      // Calculate retirement readiness score
      const readinessScore = this.calculateReadinessScore(
        projectedSavings,
        retirementIncomeNeeds,
        expectedRetirementAge - currentAge
      );

      // Generate insights and recommendations
      const insights = this.generateRetirementInsights(
        readinessScore,
        projectedSavings,
        retirementIncomeNeeds,
        monthlyContributions,
        expectedRetirementAge - currentAge
      );

      const result = {
        readinessScore: Math.round(readinessScore * 100) / 100,
        projectedSavings: Math.round(projectedSavings),
        retirementIncomeNeeds: Math.round(retirementIncomeNeeds),
        yearsToRetirement: expectedRetirementAge - currentAge,
        monthlyContributionNeeded: this.calculateOptimalContribution(
          currentSavings,
          retirementIncomeNeeds,
          expectedRetirementAge - currentAge
        ),
        insights,
        breakdown: {
          currentSavings,
          projectedGrowth: projectedSavings - currentSavings,
          socialSecurityEstimate: currentIncome * this.socialSecurityMultiplier,
          gapAnalysis: retirementIncomeNeeds - projectedSavings
        }
      };

      this.executionLog.logExecution('calculateRetirementReadiness', { 
        output: result,
        success: true 
      });

      return InsightFeedSchema.validateRetirementResult(result);
    } catch (error) {
      this.executionLog.logExecution('calculateRetirementReadiness', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Retirement calculation failed: ${error.message}`);
    }
  }

  /**
   * Calculate current total retirement savings
   * @param {Array} retirementAccounts - Array of retirement account objects
   * @returns {number} Total current savings
   */
  calculateCurrentSavings(retirementAccounts) {
    if (!retirementAccounts || !Array.isArray(retirementAccounts)) {
      return 0;
    }

    return retirementAccounts.reduce((total, account) => {
      return total + (account.balance || 0);
    }, 0);
  }

  /**
   * Calculate projected savings at retirement using compound interest
   * @param {number} currentSavings - Current retirement savings
   * @param {number} monthlyContribution - Monthly contribution amount
   * @param {number} currentAge - Current age
   * @param {number} retirementAge - Expected retirement age
   * @returns {number} Projected savings at retirement
   */
  calculateProjectedSavings(currentSavings, monthlyContribution, currentAge, retirementAge) {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = this.marketReturnRate / 12;
    const totalMonths = yearsToRetirement * 12;

    // Future value of current savings
    const futureValueOfCurrent = currentSavings * Math.pow(1 + this.marketReturnRate, yearsToRetirement);
    
    // Future value of monthly contributions
    const futureValueOfContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    return futureValueOfCurrent + futureValueOfContributions;
  }

  /**
   * Calculate retirement income needs based on current lifestyle
   * @param {number} currentIncome - Current annual income
   * @param {number} retirementAge - Expected retirement age
   * @param {number} lifeExpectancy - Expected life expectancy
   * @returns {number} Annual retirement income needed
   */
  calculateRetirementIncomeNeeds(currentIncome, retirementAge, lifeExpectancy) {
    // Assume 80% of current income needed in retirement
    const baseRetirementIncome = currentIncome * 0.8;
    
    // Adjust for inflation over years to retirement
    const yearsToRetirement = retirementAge - 30; // Assume working from age 30
    const inflationAdjustedIncome = baseRetirementIncome * 
      Math.pow(1 + this.inflationRate, yearsToRetirement);
    
    return inflationAdjustedIncome;
  }

  /**
   * Calculate retirement readiness score (0-100)
   * @param {number} projectedSavings - Projected savings at retirement
   * @param {number} retirementIncomeNeeds - Annual retirement income needed
   * @param {number} yearsToRetirement - Years until retirement
   * @returns {number} Readiness score (0-100)
   */
  calculateReadinessScore(projectedSavings, retirementIncomeNeeds, yearsToRetirement) {
    // Calculate how many years of retirement income the savings will cover
    const yearsOfIncomeCovered = projectedSavings / retirementIncomeNeeds;
    
    // Target is to have enough savings for 25 years of retirement income
    const targetYears = 25;
    const coverageRatio = yearsOfIncomeCovered / targetYears;
    
    // Score based on coverage ratio, with bonus for early retirement
    let score = Math.min(coverageRatio * 100, 100);
    
    // Bonus for having more than 25 years covered
    if (coverageRatio > 1) {
      score = Math.min(score + (coverageRatio - 1) * 20, 100);
    }
    
    // Penalty for being close to retirement with insufficient savings
    if (yearsToRetirement < 10 && coverageRatio < 0.5) {
      score *= 0.8;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate optimal monthly contribution needed
   * @param {number} currentSavings - Current retirement savings
   * @param {number} targetRetirementIncome - Target annual retirement income
   * @param {number} yearsToRetirement - Years until retirement
   * @returns {number} Optimal monthly contribution
   */
  calculateOptimalContribution(currentSavings, targetRetirementIncome, yearsToRetirement) {
    const targetSavings = targetRetirementIncome * 25; // 25x rule
    const monthlyRate = this.marketReturnRate / 12;
    const totalMonths = yearsToRetirement * 12;
    
    const futureValueOfCurrent = currentSavings * 
      Math.pow(1 + this.marketReturnRate, yearsToRetirement);
    
    const neededFromContributions = targetSavings - futureValueOfCurrent;
    
    if (neededFromContributions <= 0) {
      return 0; // Already on track
    }
    
    const monthlyContribution = neededFromContributions / 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    return Math.max(0, monthlyContribution);
  }

  /**
   * Generate actionable retirement insights
   * @param {number} readinessScore - Retirement readiness score
   * @param {number} projectedSavings - Projected savings at retirement
   * @param {number} retirementIncomeNeeds - Annual retirement income needed
   * @param {number} currentContribution - Current monthly contribution
   * @param {number} yearsToRetirement - Years until retirement
   * @returns {Array} Array of insight objects
   */
  generateRetirementInsights(readinessScore, projectedSavings, retirementIncomeNeeds, currentContribution, yearsToRetirement) {
    const insights = [];
    
    // Readiness score insights
    if (readinessScore >= 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Retirement Readiness',
        message: `Your retirement readiness score of ${readinessScore.toFixed(0)}% indicates you're well-prepared for retirement.`,
        action: 'Consider increasing contributions to retire early or increase retirement income.'
      });
    } else if (readinessScore >= 60) {
      insights.push({
        type: 'warning',
        title: 'Good Progress, Room for Improvement',
        message: `Your retirement readiness score of ${readinessScore.toFixed(0)}% shows good progress, but there's room for improvement.`,
        action: 'Consider increasing your monthly contributions by 10-20% to improve your retirement outlook.'
      });
    } else if (readinessScore >= 40) {
      insights.push({
        type: 'warning',
        title: 'Moderate Retirement Risk',
        message: `Your retirement readiness score of ${readinessScore.toFixed(0)}% indicates moderate risk of insufficient retirement income.`,
        action: 'Significantly increase your monthly contributions and consider working longer to improve your retirement security.'
      });
    } else {
      insights.push({
        type: 'danger',
        title: 'Critical Retirement Gap',
        message: `Your retirement readiness score of ${readinessScore.toFixed(0)}% indicates a critical gap in retirement planning.`,
        action: 'Immediate action required: increase contributions, consider working longer, or adjust retirement expectations.'
      });
    }
    
    // Contribution insights
    const optimalContribution = this.calculateOptimalContribution(
      projectedSavings,
      retirementIncomeNeeds,
      yearsToRetirement
    );
    
    if (optimalContribution > currentContribution) {
      insights.push({
        type: 'info',
        title: 'Contribution Optimization',
        message: `To meet your retirement goals, consider increasing your monthly contribution from $${currentContribution.toFixed(0)} to $${optimalContribution.toFixed(0)}.`,
        action: 'Review your budget to identify areas where you can increase retirement contributions.'
      });
    }
    
    // Time-based insights
    if (yearsToRetirement < 10) {
      insights.push({
        type: 'warning',
        title: 'Approaching Retirement',
        message: `With ${yearsToRetirement} years until retirement, focus on maximizing contributions and reducing expenses.`,
        action: 'Consider catch-up contributions if eligible and review your retirement timeline.'
      });
    }
    
    return insights;
  }

  /**
   * Run Monte Carlo simulation for retirement forecasting
   * @param {Object} userData - User financial data
   * @param {number} simulations - Number of simulations to run
   * @returns {Object} Monte Carlo simulation results
   */
  async runMonteCarloSimulation(userData, simulations = 1000) {
    try {
      this.executionLog.logExecution('runMonteCarloSimulation', { 
        input: { userData, simulations } 
      });

      const results = [];
      const { currentAge, currentIncome, retirementAccounts, monthlyContributions } = userData;
      
      for (let i = 0; i < simulations; i++) {
        // Vary market returns (normal distribution around 7% with 15% standard deviation)
        const marketReturn = this.generateRandomReturn();
        
        // Vary inflation (normal distribution around 2.5% with 1% standard deviation)
        const inflation = this.generateRandomInflation();
        
        // Calculate projected savings with varied parameters
        const projectedSavings = this.calculateProjectedSavingsWithVariation(
          this.calculateCurrentSavings(retirementAccounts),
          monthlyContributions,
          currentAge,
          this.retirementAge,
          marketReturn
        );
        
        const retirementIncomeNeeds = this.calculateRetirementIncomeNeeds(
          currentIncome,
          this.retirementAge,
          this.lifeExpectancy
        ) * Math.pow(1 + inflation, this.retirementAge - currentAge);
        
        const readinessScore = this.calculateReadinessScore(
          projectedSavings,
          retirementIncomeNeeds,
          this.retirementAge - currentAge
        );
        
        results.push({
          simulation: i + 1,
          projectedSavings,
          retirementIncomeNeeds,
          readinessScore,
          marketReturn,
          inflation
        });
      }
      
      // Calculate statistics
      const readinessScores = results.map(r => r.readinessScore);
      const projectedSavings = results.map(r => r.projectedSavings);
      
      const simulationResult = {
        totalSimulations: simulations,
        averageReadinessScore: this.calculateAverage(readinessScores),
        medianReadinessScore: this.calculateMedian(readinessScores),
        minReadinessScore: Math.min(...readinessScores),
        maxReadinessScore: Math.max(...readinessScores),
        successRate: (readinessScores.filter(score => score >= 70).length / simulations) * 100,
        averageProjectedSavings: this.calculateAverage(projectedSavings),
        confidenceIntervals: {
          '25th': this.calculatePercentile(readinessScores, 25),
          '50th': this.calculatePercentile(readinessScores, 50),
          '75th': this.calculatePercentile(readinessScores, 75),
          '90th': this.calculatePercentile(readinessScores, 90)
        },
        riskAssessment: this.assessRisk(readinessScores)
      };

      this.executionLog.logExecution('runMonteCarloSimulation', { 
        output: simulationResult,
        success: true 
      });

      return simulationResult;
    } catch (error) {
      this.executionLog.logExecution('runMonteCarloSimulation', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Monte Carlo simulation failed: ${error.message}`);
    }
  }

  /**
   * Generate random market return based on historical data
   * @returns {number} Random market return rate
   */
  generateRandomReturn() {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Apply to market return distribution (7% mean, 15% std dev)
    return this.marketReturnRate + (z0 * 0.15);
  }

  /**
   * Generate random inflation rate
   * @returns {number} Random inflation rate
   */
  generateRandomInflation() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Apply to inflation distribution (2.5% mean, 1% std dev)
    return this.inflationRate + (z0 * 0.01);
  }

  /**
   * Calculate projected savings with varied market return
   * @param {number} currentSavings - Current retirement savings
   * @param {number} monthlyContribution - Monthly contribution amount
   * @param {number} currentAge - Current age
   * @param {number} retirementAge - Expected retirement age
   * @param {number} marketReturn - Market return rate for this simulation
   * @returns {number} Projected savings at retirement
   */
  calculateProjectedSavingsWithVariation(currentSavings, monthlyContribution, currentAge, retirementAge, marketReturn) {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = marketReturn / 12;
    const totalMonths = yearsToRetirement * 12;

    const futureValueOfCurrent = currentSavings * Math.pow(1 + marketReturn, yearsToRetirement);
    const futureValueOfContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    return futureValueOfCurrent + futureValueOfContributions;
  }

  /**
   * Calculate average of array
   * @param {Array} values - Array of numbers
   * @returns {number} Average value
   */
  calculateAverage(values) {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate median of array
   * @param {Array} values - Array of numbers
   * @returns {number} Median value
   */
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
  }

  /**
   * Calculate percentile of array
   * @param {Array} values - Array of numbers
   * @param {number} percentile - Percentile to calculate (0-100)
   * @returns {number} Percentile value
   */
  calculatePercentile(values, percentile) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    
    if (upper === lower) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  /**
   * Assess risk based on readiness scores
   * @param {Array} readinessScores - Array of readiness scores
   * @returns {Object} Risk assessment
   */
  assessRisk(readinessScores) {
    const lowRisk = readinessScores.filter(score => score >= 70).length;
    const mediumRisk = readinessScores.filter(score => score >= 50 && score < 70).length;
    const highRisk = readinessScores.filter(score => score < 50).length;
    
    return {
      lowRiskPercentage: (lowRisk / readinessScores.length) * 100,
      mediumRiskPercentage: (mediumRisk / readinessScores.length) * 100,
      highRiskPercentage: (highRisk / readinessScores.length) * 100,
      overallRisk: highRisk > lowRisk ? 'High' : mediumRisk > lowRisk ? 'Medium' : 'Low'
    };
  }
}

export default RetirementService; 