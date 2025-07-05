/**
 * MonteCarloRunner - Advanced Simulation Engine
 * 
 * Purpose: Provides comprehensive Monte Carlo simulation capabilities for
 * financial planning scenarios in the AlphaFrame Galileo V2.2 platform.
 * 
 * Procedure:
 * 1. Runs thousands of simulations with randomized market conditions
 * 2. Calculates statistical confidence intervals and success probabilities
 * 3. Generates probability distributions for financial outcomes
 * 4. Provides clear explanations of simulation results and methodology
 * 
 * Conclusion: This service enables users to understand the range of possible
 * financial outcomes with statistical confidence, helping them make informed
 * decisions about risk and uncertainty in their financial planning.
 */

class MonteCarloRunner {
  constructor() {
    // Default simulation configuration
    this.config = {
      defaultSimulationCount: 1000,
      maxSimulationCount: 10000,
      defaultTimeHorizon: 30,
      confidenceLevels: [0.05, 0.25, 0.5, 0.75, 0.95]
    };
    
    // Market parameters for simulations
    this.marketParams = {
      stockReturn: 0.07, // 7% average annual return
      stockVolatility: 0.15, // 15% annual volatility
      bondReturn: 0.04, // 4% average annual return
      bondVolatility: 0.05, // 5% annual volatility
      inflation: 0.025, // 2.5% average annual inflation
      correlation: 0.3 // Correlation between stocks and bonds
    };
  }

  /**
   * Run comprehensive Monte Carlo simulation
   * @param {Object} simulationConfig - Simulation configuration
   * @param {Object} financialData - Financial data for simulation
   * @returns {Object} Simulation results with statistical analysis
   */
  async runSimulation(simulationConfig, financialData) {
    try {
      const {
        simulationCount = this.config.defaultSimulationCount,
        timeHorizon = this.config.defaultTimeHorizon,
        assetAllocation = { stocks: 0.7, bonds: 0.3 },
        rebalancing = 'annual'
      } = simulationConfig;
      
      // Validate inputs
      this.validateSimulationInputs(simulationConfig, financialData);
      
      // Run simulations
      const simulationResults = [];
      for (let i = 0; i < simulationCount; i++) {
        const result = this.runSingleSimulation(financialData, timeHorizon, assetAllocation, rebalancing);
        simulationResults.push(result);
      }
      
      // Calculate statistical analysis
      const statisticalAnalysis = this.calculateStatisticalAnalysis(simulationResults);
      
      // Calculate confidence intervals
      const confidenceIntervals = this.calculateConfidenceIntervals(simulationResults);
      
      // Generate insights
      const insights = this.generateSimulationInsights(simulationResults, financialData);
      
      // Create comprehensive result
      const result = {
        simulationResults,
        statisticalAnalysis,
        confidenceIntervals,
        insights,
        summary: {
          simulationCount,
          timeHorizon,
          assetAllocation,
          successRate: statisticalAnalysis.successRate,
          medianReturn: statisticalAnalysis.medianReturn,
          worstCase: confidenceIntervals.percentile5,
          bestCase: confidenceIntervals.percentile95
        },
        timestamp: new Date().toISOString(),
        version: '2.2.0'
      };

      return result;
    } catch (error) {
      throw new Error(`Monte Carlo simulation failed: ${error.message}`);
    }
  }

  /**
   * Validate simulation inputs
   * @param {Object} simulationConfig - Simulation configuration
   * @param {Object} financialData - Financial data
   */
  validateSimulationInputs(simulationConfig, financialData) {
    const { simulationCount, timeHorizon } = simulationConfig;
    const { initialBalance, monthlyContribution } = financialData;
    
    if (simulationCount > this.config.maxSimulationCount) {
      throw new Error(`Simulation count cannot exceed ${this.config.maxSimulationCount}`);
    }
    
    if (timeHorizon <= 0 || timeHorizon > 50) {
      throw new Error('Time horizon must be between 1 and 50 years');
    }
    
    if (initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    
    if (monthlyContribution < 0) {
      throw new Error('Monthly contribution cannot be negative');
    }
  }

  /**
   * Run a single Monte Carlo simulation
   * @param {Object} financialData - Financial data
   * @param {number} timeHorizon - Time horizon in years
   * @param {Object} assetAllocation - Asset allocation
   * @param {string} rebalancing - Rebalancing frequency
   * @returns {Object} Single simulation result
   */
  runSingleSimulation(financialData, timeHorizon, assetAllocation, rebalancing) {
    const { initialBalance, monthlyContribution } = financialData;
    const { stocks, bonds } = assetAllocation;
    
    let portfolioValue = initialBalance;
    let stockValue = portfolioValue * stocks;
    let bondValue = portfolioValue * bonds;
    
    const yearlyValues = [portfolioValue];
    
    for (let year = 1; year <= timeHorizon; year++) {
      // Generate random returns for this year
      const stockReturn = this.generateRandomReturn(this.marketParams.stockReturn, this.marketParams.stockVolatility);
      const bondReturn = this.generateRandomReturn(this.marketParams.bondReturn, this.marketParams.bondVolatility);
      
      // Apply returns to portfolio
      stockValue *= (1 + stockReturn);
      bondValue *= (1 + bondReturn);
      
      // Add monthly contributions
      const annualContribution = monthlyContribution * 12;
      const contributionToStocks = annualContribution * stocks;
      const contributionToBonds = annualContribution * bonds;
      
      stockValue += contributionToStocks;
      bondValue += contributionToBonds;
      
      // Rebalance if needed
      if (rebalancing === 'annual') {
        portfolioValue = stockValue + bondValue;
        const targetStockValue = portfolioValue * stocks;
        const targetBondValue = portfolioValue * bonds;
        
        stockValue = targetStockValue;
        bondValue = targetBondValue;
      }
      
      portfolioValue = stockValue + bondValue;
      yearlyValues.push(portfolioValue);
    }
    
    return {
      finalValue: portfolioValue,
      totalReturn: (portfolioValue - initialBalance) / initialBalance,
      yearlyValues,
      timeHorizon
    };
  }

  /**
   * Generate random return using normal distribution
   * @param {number} mean - Mean return
   * @param {number} volatility - Volatility (standard deviation)
   * @returns {number} Random return
   */
  generateRandomReturn(mean, volatility) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    return mean + z0 * volatility;
  }

  /**
   * Calculate statistical analysis of simulation results
   * @param {Array} simulationResults - Array of simulation results
   * @returns {Object} Statistical analysis
   */
  calculateStatisticalAnalysis(simulationResults) {
    const finalValues = simulationResults.map(r => r.finalValue);
    const totalReturns = simulationResults.map(r => r.totalReturn);
    
    // Calculate basic statistics
    const meanFinalValue = finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length;
    const meanReturn = totalReturns.reduce((sum, ret) => sum + ret, 0) / totalReturns.length;
    
    // Calculate median
    const sortedFinalValues = [...finalValues].sort((a, b) => a - b);
    const medianFinalValue = sortedFinalValues[Math.floor(sortedFinalValues.length / 2)];
    
    const sortedReturns = [...totalReturns].sort((a, b) => a - b);
    const medianReturn = sortedReturns[Math.floor(sortedReturns.length / 2)];
    
    // Calculate standard deviation
    const variance = finalValues.reduce((sum, val) => sum + Math.pow(val - meanFinalValue, 2), 0) / finalValues.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calculate success rate (positive returns)
    const successCount = totalReturns.filter(ret => ret > 0).length;
    const successRate = successCount / totalReturns.length;
    
    return {
      meanFinalValue,
      meanReturn,
      medianFinalValue,
      medianReturn,
      standardDeviation,
      successRate,
      successCount,
      totalSimulations: simulationResults.length
    };
  }

  /**
   * Calculate confidence intervals
   * @param {Array} simulationResults - Array of simulation results
   * @returns {Object} Confidence intervals
   */
  calculateConfidenceIntervals(simulationResults) {
    const finalValues = [...simulationResults.map(r => r.finalValue)].sort((a, b) => a - b);
    const totalReturns = [...simulationResults.map(r => r.totalReturn)].sort((a, b) => a - b);
    
    const percentiles = [5, 25, 50, 75, 95];
    const intervals = {};
    
    percentiles.forEach(percentile => {
      const index = Math.floor((percentile / 100) * finalValues.length);
      intervals[`percentile${percentile}`] = finalValues[index];
      intervals[`returnPercentile${percentile}`] = totalReturns[index];
    });
    
    return intervals;
  }

  /**
   * Generate insights from simulation results
   * @param {Array} simulationResults - Array of simulation results
   * @param {Object} financialData - Financial data
   * @returns {Array} Array of insights
   */
  generateSimulationInsights(simulationResults, financialData) {
    const insights = [];
    const { initialBalance, monthlyContribution } = financialData;
    
    // Calculate basic statistics
    const finalValues = simulationResults.map(r => r.finalValue);
    const meanFinalValue = finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length;
    const successRate = simulationResults.filter(r => r.totalReturn > 0).length / simulationResults.length;
    
    // Portfolio growth insight
    const averageGrowth = (meanFinalValue - initialBalance) / initialBalance;
    insights.push({
      type: 'growth',
      title: 'Expected Portfolio Growth',
      description: `On average, your portfolio is expected to grow by ${(averageGrowth * 100).toFixed(1)}% over the simulation period.`,
      confidence: 'high',
      metric: `${(averageGrowth * 100).toFixed(1)}% average growth`
    });
    
    // Success probability insight
    insights.push({
      type: 'probability',
      title: 'Success Probability',
      description: `${(successRate * 100).toFixed(1)}% of simulations resulted in positive returns.`,
      confidence: 'high',
      metric: `${(successRate * 100).toFixed(1)}% success rate`
    });
    
    // Contribution impact insight
    const totalContributions = monthlyContribution * 12 * simulationResults[0].timeHorizon;
    const contributionRatio = totalContributions / (meanFinalValue - initialBalance);
    
    if (contributionRatio > 0.5) {
      insights.push({
        type: 'contribution',
        title: 'Contribution-Driven Growth',
        description: 'Your portfolio growth is primarily driven by contributions rather than investment returns.',
        confidence: 'medium',
        metric: `${(contributionRatio * 100).toFixed(1)}% from contributions`
      });
    }
    
    // Risk assessment insight
    const worstCase = Math.min(...finalValues);
    const bestCase = Math.max(...finalValues);
    const range = bestCase - worstCase;
    const riskLevel = range / meanFinalValue;
    
    if (riskLevel > 0.5) {
      insights.push({
        type: 'risk',
        title: 'High Portfolio Volatility',
        description: 'Your portfolio shows significant volatility, with a wide range of possible outcomes.',
        confidence: 'medium',
        metric: `${(riskLevel * 100).toFixed(1)}% volatility range`
      });
    }
    
    return insights;
  }

  /**
   * Run scenario comparison simulation
   * @param {Object} baseConfig - Base simulation configuration
   * @param {Object} scenarios - Different scenarios to compare
   * @returns {Object} Scenario comparison results
   */
  async runScenarioComparison(baseConfig, scenarios) {
    const results = {
      base: await this.runSimulation(baseConfig, baseConfig.financialData),
      scenarios: {}
    };
    
    for (const [scenarioName, scenarioConfig] of Object.entries(scenarios)) {
      const combinedConfig = { ...baseConfig, ...scenarioConfig };
      results.scenarios[scenarioName] = await this.runSimulation(combinedConfig, combinedConfig.financialData);
    }
    
    return results;
  }
}

export default MonteCarloRunner; 