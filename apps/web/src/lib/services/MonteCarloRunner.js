/**
 * MonteCarloRunner.js
 * 
 * PURPOSE: Provides advanced Monte Carlo simulation capabilities for AlphaFrame Galileo V2.2
 * This service runs statistical simulations to model financial scenarios with uncertainty,
 * providing probabilistic forecasts and risk assessments for various financial planning needs.
 * 
 * PROCEDURE:
 * 1. Generates random scenarios based on historical market data distributions
 * 2. Runs multiple simulations to model different possible outcomes
 * 3. Calculates statistical measures (mean, median, percentiles, confidence intervals)
 * 4. Provides risk assessment and probability analysis
 * 5. Generates explainable insights from simulation results
 * 
 * CONCLUSION: Enables users to understand the range of possible financial outcomes
 * and make informed decisions based on statistical probability analysis.
 */

import { ExecutionLogService } from './ExecutionLogService.js';

class MonteCarloRunner {
  constructor() {
    this.executionLog = new ExecutionLogService('MonteCarloRunner');
    this.defaultSimulations = 10000;
    this.maxSimulations = 50000; // Performance limit
  }

  /**
   * Run comprehensive Monte Carlo simulation for financial forecasting
   * @param {Object} config - Simulation configuration
   * @param {number} config.simulations - Number of simulations to run
   * @param {Object} config.marketParams - Market parameters
   * @param {Object} config.userData - User financial data
   * @returns {Object} Simulation results with statistical analysis
   */
  async runSimulation(config) {
    try {
      const { simulations = this.defaultSimulations, marketParams, userData } = config;
      
      this.executionLog.logExecution('runSimulation', { 
        input: { simulations, marketParams, userData } 
      });

      // Validate and sanitize inputs
      const validatedSimulations = Math.min(simulations, this.maxSimulations);
      const validatedParams = this.validateMarketParams(marketParams);
      
      // Run simulations
      const results = await this.executeSimulations(validatedSimulations, validatedParams, userData);
      
      // Calculate statistical measures
      const statistics = this.calculateStatistics(results);
      
      // Generate insights
      const insights = this.generateSimulationInsights(statistics, validatedParams);
      
      // Assess risk levels
      const riskAssessment = this.assessRiskLevels(statistics);
      
      const simulationResult = {
        totalSimulations: validatedSimulations,
        executionTime: Date.now(),
        statistics,
        insights,
        riskAssessment,
        confidenceIntervals: this.calculateConfidenceIntervals(results),
        scenarioAnalysis: this.analyzeScenarios(results)
      };

      this.executionLog.logExecution('runSimulation', { 
        output: simulationResult,
        success: true 
      });

      return simulationResult;
    } catch (error) {
      this.executionLog.logExecution('runSimulation', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Monte Carlo simulation failed: ${error.message}`);
    }
  }

  /**
   * Validate and set default market parameters
   * @param {Object} marketParams - Market parameters
   * @returns {Object} Validated market parameters
   */
  validateMarketParams(marketParams) {
    const defaults = {
      marketReturn: { mean: 0.07, stdDev: 0.15 }, // 7% mean, 15% std dev
      inflation: { mean: 0.025, stdDev: 0.01 }, // 2.5% mean, 1% std dev
      bondReturn: { mean: 0.04, stdDev: 0.05 }, // 4% mean, 5% std dev
      correlation: 0.3 // Correlation between stock and bond returns
    };

    return {
      ...defaults,
      ...marketParams
    };
  }

  /**
   * Execute the Monte Carlo simulations
   * @param {number} simulations - Number of simulations
   * @param {Object} marketParams - Market parameters
   * @param {Object} userData - User financial data
   * @returns {Array} Array of simulation results
   */
  async executeSimulations(simulations, marketParams, userData) {
    const results = [];
    const batchSize = 1000; // Process in batches for performance
    
    for (let i = 0; i < simulations; i += batchSize) {
      const batchEnd = Math.min(i + batchSize, simulations);
      const batchResults = this.processBatch(i, batchEnd, marketParams, userData);
      results.push(...batchResults);
      
      // Allow other operations to run
      if (i % 5000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    return results;
  }

  /**
   * Process a batch of simulations
   * @param {number} start - Start index
   * @param {number} end - End index
   * @param {Object} marketParams - Market parameters
   * @param {Object} userData - User financial data
   * @returns {Array} Batch results
   */
  processBatch(start, end, marketParams, userData) {
    const batchResults = [];
    
    for (let i = start; i < end; i++) {
      // Generate random market scenarios
      const marketScenario = this.generateMarketScenario(marketParams);
      
      // Calculate financial outcomes
      const outcome = this.calculateFinancialOutcome(marketScenario, userData);
      
      batchResults.push({
        simulationId: i + 1,
        scenario: marketScenario,
        outcome,
        timestamp: Date.now()
      });
    }
    
    return batchResults;
  }

  /**
   * Generate a random market scenario
   * @param {Object} marketParams - Market parameters
   * @returns {Object} Market scenario
   */
  generateMarketScenario(marketParams) {
    // Generate correlated random variables using Cholesky decomposition
    const [stockReturn, bondReturn] = this.generateCorrelatedReturns(
      marketParams.marketReturn,
      marketParams.bondReturn,
      marketParams.correlation
    );
    
    const inflation = this.generateNormalRandom(
      marketParams.inflation.mean,
      marketParams.inflation.stdDev
    );
    
    return {
      stockReturn,
      bondReturn,
      inflation,
      realReturn: stockReturn - inflation,
      bondRealReturn: bondReturn - inflation
    };
  }

  /**
   * Generate correlated random returns
   * @param {Object} stockParams - Stock return parameters
   * @param {Object} bondParams - Bond return parameters
   * @param {number} correlation - Correlation coefficient
   * @returns {Array} [stockReturn, bondReturn]
   */
  generateCorrelatedReturns(stockParams, bondParams, correlation) {
    // Generate independent standard normal variables
    const z1 = this.generateStandardNormal();
    const z2 = this.generateStandardNormal();
    
    // Apply correlation using Cholesky decomposition
    const correlatedZ2 = correlation * z1 + Math.sqrt(1 - correlation * correlation) * z2;
    
    // Transform to desired distributions
    const stockReturn = stockParams.mean + z1 * stockParams.stdDev;
    const bondReturn = bondParams.mean + correlatedZ2 * bondParams.stdDev;
    
    return [stockReturn, bondReturn];
  }

  /**
   * Generate standard normal random variable using Box-Muller transform
   * @returns {number} Standard normal random variable
   */
  generateStandardNormal() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    // Box-Muller transform
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return z0;
  }

  /**
   * Generate normal random variable
   * @param {number} mean - Mean of distribution
   * @param {number} stdDev - Standard deviation
   * @returns {number} Normal random variable
   */
  generateNormalRandom(mean, stdDev) {
    const z = this.generateStandardNormal();
    return mean + z * stdDev;
  }

  /**
   * Calculate financial outcome based on market scenario
   * @param {Object} scenario - Market scenario
   * @param {Object} userData - User financial data
   * @returns {Object} Financial outcome
   */
  calculateFinancialOutcome(scenario, userData) {
    const {
      currentSavings,
      monthlyContribution,
      yearsToRetirement,
      targetRetirementIncome,
      assetAllocation = { stocks: 0.7, bonds: 0.3 }
    } = userData;
    
    // Calculate portfolio return
    const portfolioReturn = (assetAllocation.stocks * scenario.stockReturn) + 
                           (assetAllocation.bonds * scenario.bondReturn);
    
    // Calculate future value of current savings
    const futureValueOfCurrent = currentSavings * Math.pow(1 + portfolioReturn, yearsToRetirement);
    
    // Calculate future value of contributions
    const monthlyRate = portfolioReturn / 12;
    const totalMonths = yearsToRetirement * 12;
    const futureValueOfContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalRetirementSavings = futureValueOfCurrent + futureValueOfContributions;
    
    // Calculate retirement income adjusted for inflation
    const inflationAdjustedIncome = targetRetirementIncome * 
      Math.pow(1 + scenario.inflation, yearsToRetirement);
    
    // Calculate years of retirement income covered
    const yearsOfIncomeCovered = totalRetirementSavings / inflationAdjustedIncome;
    
    // Calculate retirement readiness score
    const readinessScore = this.calculateReadinessScore(yearsOfIncomeCovered, yearsToRetirement);
    
    return {
      totalRetirementSavings,
      inflationAdjustedIncome,
      yearsOfIncomeCovered,
      readinessScore,
      portfolioReturn,
      realReturn: portfolioReturn - scenario.inflation
    };
  }

  /**
   * Calculate retirement readiness score
   * @param {number} yearsOfIncomeCovered - Years of retirement income covered
   * @param {number} yearsToRetirement - Years until retirement
   * @returns {number} Readiness score (0-100)
   */
  calculateReadinessScore(yearsOfIncomeCovered, yearsToRetirement) {
    const targetYears = 25; // Target 25 years of retirement income
    const coverageRatio = yearsOfIncomeCovered / targetYears;
    
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
   * Calculate statistical measures from simulation results
   * @param {Array} results - Simulation results
   * @returns {Object} Statistical measures
   */
  calculateStatistics(results) {
    const readinessScores = results.map(r => r.outcome.readinessScore);
    const totalSavings = results.map(r => r.outcome.totalRetirementSavings);
    const portfolioReturns = results.map(r => r.outcome.portfolioReturn);
    
    return {
      readinessScore: {
        mean: this.calculateMean(readinessScores),
        median: this.calculateMedian(readinessScores),
        stdDev: this.calculateStdDev(readinessScores),
        min: Math.min(...readinessScores),
        max: Math.max(...readinessScores)
      },
      totalSavings: {
        mean: this.calculateMean(totalSavings),
        median: this.calculateMedian(totalSavings),
        stdDev: this.calculateStdDev(totalSavings),
        min: Math.min(...totalSavings),
        max: Math.max(...totalSavings)
      },
      portfolioReturn: {
        mean: this.calculateMean(portfolioReturns),
        median: this.calculateMedian(portfolioReturns),
        stdDev: this.calculateStdDev(portfolioReturns)
      }
    };
  }

  /**
   * Calculate mean of array
   * @param {Array} values - Array of numbers
   * @returns {number} Mean value
   */
  calculateMean(values) {
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
   * Calculate standard deviation of array
   * @param {Array} values - Array of numbers
   * @returns {number} Standard deviation
   */
  calculateStdDev(values) {
    const mean = this.calculateMean(values);
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = this.calculateMean(squaredDiffs);
    return Math.sqrt(variance);
  }

  /**
   * Calculate confidence intervals
   * @param {Array} results - Simulation results
   * @returns {Object} Confidence intervals
   */
  calculateConfidenceIntervals(results) {
    const readinessScores = results.map(r => r.outcome.readinessScore);
    const totalSavings = results.map(r => r.outcome.totalRetirementSavings);
    
    return {
      readinessScore: {
        '5th': this.calculatePercentile(readinessScores, 5),
        '25th': this.calculatePercentile(readinessScores, 25),
        '50th': this.calculatePercentile(readinessScores, 50),
        '75th': this.calculatePercentile(readinessScores, 75),
        '95th': this.calculatePercentile(readinessScores, 95)
      },
      totalSavings: {
        '5th': this.calculatePercentile(totalSavings, 5),
        '25th': this.calculatePercentile(totalSavings, 25),
        '50th': this.calculatePercentile(totalSavings, 50),
        '75th': this.calculatePercentile(totalSavings, 75),
        '95th': this.calculatePercentile(totalSavings, 95)
      }
    };
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
   * Generate insights from simulation results
   * @param {Object} statistics - Statistical measures
   * @param {Object} marketParams - Market parameters
   * @returns {Array} Array of insights
   */
  generateSimulationInsights(statistics, marketParams) {
    const insights = [];
    
    // Readiness score insights
    const avgReadiness = statistics.readinessScore.mean;
    if (avgReadiness >= 80) {
      insights.push({
        type: 'success',
        title: 'Strong Retirement Outlook',
        message: `On average, your retirement readiness score is ${avgReadiness.toFixed(1)}%, indicating strong preparation.`,
        action: 'Consider increasing contributions to retire early or enhance retirement lifestyle.'
      });
    } else if (avgReadiness >= 60) {
      insights.push({
        type: 'warning',
        title: 'Moderate Retirement Risk',
        message: `Your average retirement readiness score is ${avgReadiness.toFixed(1)}%, showing moderate risk.`,
        action: 'Consider increasing contributions or adjusting retirement timeline.'
      });
    } else {
      insights.push({
        type: 'danger',
        title: 'High Retirement Risk',
        message: `Your average retirement readiness score is ${avgReadiness.toFixed(1)}%, indicating significant risk.`,
        action: 'Immediate action required: increase contributions significantly or extend working years.'
      });
    }
    
    // Volatility insights
    const readinessVolatility = statistics.readinessScore.stdDev;
    if (readinessVolatility > 20) {
      insights.push({
        type: 'warning',
        title: 'High Outcome Variability',
        message: `Your retirement outcomes show high variability (${readinessVolatility.toFixed(1)}% standard deviation).`,
        action: 'Consider more conservative investment strategies or increase savings buffer.'
      });
    }
    
    // Success probability insights
    const successRate = this.calculateSuccessRate(statistics);
    insights.push({
      type: 'info',
      title: 'Success Probability',
      message: `Based on ${statistics.totalSimulations || 'simulations'}, you have a ${successRate.toFixed(1)}% chance of meeting your retirement goals.`,
      action: successRate < 70 ? 'Consider increasing contributions or adjusting goals.' : 'You\'re on track to meet your retirement goals.'
    });
    
    return insights;
  }

  /**
   * Calculate success rate (percentage of simulations with readiness score >= 70)
   * @param {Object} statistics - Statistical measures
   * @returns {number} Success rate percentage
   */
  calculateSuccessRate(statistics) {
    // This would need to be calculated from the full results array
    // For now, we'll estimate based on mean and standard deviation
    const mean = statistics.readinessScore.mean;
    const stdDev = statistics.readinessScore.stdDev;
    
    // Approximate success rate using normal distribution
    const zScore = (70 - mean) / stdDev;
    const successRate = (1 - this.normalCDF(zScore)) * 100;
    
    return Math.max(0, Math.min(100, successRate));
  }

  /**
   * Normal cumulative distribution function approximation
   * @param {number} z - Z-score
   * @returns {number} Cumulative probability
   */
  normalCDF(z) {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  /**
   * Error function approximation
   * @param {number} x - Input value
   * @returns {number} Error function value
   */
  erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);
    
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  }

  /**
   * Assess risk levels based on simulation results
   * @param {Object} statistics - Statistical measures
   * @returns {Object} Risk assessment
   */
  assessRiskLevels(statistics) {
    const avgReadiness = statistics.readinessScore.mean;
    const volatility = statistics.readinessScore.stdDev;
    
    let overallRisk = 'Low';
    if (avgReadiness < 50 || volatility > 25) {
      overallRisk = 'High';
    } else if (avgReadiness < 70 || volatility > 15) {
      overallRisk = 'Medium';
    }
    
    return {
      overallRisk,
      readinessRisk: avgReadiness < 70 ? 'High' : avgReadiness < 80 ? 'Medium' : 'Low',
      volatilityRisk: volatility > 20 ? 'High' : volatility > 10 ? 'Medium' : 'Low',
      recommendations: this.generateRiskRecommendations(overallRisk, avgReadiness, volatility)
    };
  }

  /**
   * Generate risk-based recommendations
   * @param {string} overallRisk - Overall risk level
   * @param {number} avgReadiness - Average readiness score
   * @param {number} volatility - Readiness score volatility
   * @returns {Array} Array of recommendations
   */
  generateRiskRecommendations(overallRisk, avgReadiness, volatility) {
    const recommendations = [];
    
    if (overallRisk === 'High') {
      recommendations.push('Significantly increase retirement contributions');
      recommendations.push('Consider extending working years');
      recommendations.push('Review and potentially reduce retirement income expectations');
    } else if (overallRisk === 'Medium') {
      recommendations.push('Moderately increase retirement contributions');
      recommendations.push('Consider more conservative investment strategies');
      recommendations.push('Regularly review and adjust retirement plan');
    } else {
      recommendations.push('Maintain current contribution levels');
      recommendations.push('Consider early retirement options');
      recommendations.push('Explore ways to enhance retirement lifestyle');
    }
    
    if (volatility > 15) {
      recommendations.push('Diversify investment portfolio to reduce volatility');
      recommendations.push('Consider adding more bonds to portfolio');
    }
    
    return recommendations;
  }

  /**
   * Analyze different scenarios from simulation results
   * @param {Array} results - Simulation results
   * @returns {Object} Scenario analysis
   */
  analyzeScenarios(results) {
    const readinessScores = results.map(r => r.outcome.readinessScore);
    
    // Find best and worst case scenarios
    const bestCase = results.reduce((best, current) => 
      current.outcome.readinessScore > best.outcome.readinessScore ? current : best
    );
    
    const worstCase = results.reduce((worst, current) => 
      current.outcome.readinessScore < worst.outcome.readinessScore ? worst : current
    );
    
    return {
      bestCase: {
        readinessScore: bestCase.outcome.readinessScore,
        totalSavings: bestCase.outcome.totalRetirementSavings,
        portfolioReturn: bestCase.outcome.portfolioReturn,
        scenario: bestCase.scenario
      },
      worstCase: {
        readinessScore: worstCase.outcome.readinessScore,
        totalSavings: worstCase.outcome.totalRetirementSavings,
        portfolioReturn: worstCase.outcome.portfolioReturn,
        scenario: worstCase.scenario
      },
      scenarioCounts: {
        excellent: readinessScores.filter(score => score >= 80).length,
        good: readinessScores.filter(score => score >= 60 && score < 80).length,
        moderate: readinessScores.filter(score => score >= 40 && score < 60).length,
        poor: readinessScores.filter(score => score < 40).length
      }
    };
  }
}

export default MonteCarloRunner; 