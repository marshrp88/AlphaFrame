/**
 * ExplainabilityEngine.js
 * 
 * PURPOSE: Provides AI explainability capabilities for AlphaFrame Galileo V2.2
 * This service generates clear, understandable explanations for all financial
 * calculations, insights, and recommendations, making complex financial concepts
 * accessible to users of all knowledge levels.
 * 
 * PROCEDURE:
 * 1. Analyzes financial calculation results and context
 * 2. Generates natural language explanations using predefined templates
 * 3. Adapts explanation complexity based on user sophistication level
 * 4. Provides actionable recommendations with clear reasoning
 * 5. Creates confidence scores and uncertainty explanations
 * 
 * CONCLUSION: Enables users to understand the reasoning behind all financial
 * insights and make informed decisions with confidence.
 */

import { ExecutionLogService } from './ExecutionLogService.js';

class ExplainabilityEngine {
  constructor() {
    this.executionLog = new ExecutionLogService('ExplainabilityEngine');
    this.userSophisticationLevel = 'intermediate'; // beginner, intermediate, advanced
    this.explanationTemplates = this.initializeTemplates();
  }

  /**
   * Initialize explanation templates for different scenarios
   * @returns {Object} Template collection
   */
  initializeTemplates() {
    return {
      retirement: {
        readinessScore: {
          excellent: {
            beginner: "Your retirement readiness score of {score}% is excellent! This means you're well-prepared for retirement and likely to have enough savings to maintain your desired lifestyle.",
            intermediate: "With a retirement readiness score of {score}%, you're in excellent shape for retirement. Your projected savings of ${savings} should provide approximately {years} years of retirement income.",
            advanced: "Your retirement readiness score of {score}% indicates exceptional preparation. Your portfolio's projected value of ${savings} at retirement, combined with your current contribution rate of ${monthly}, positions you well above the 25x retirement income target."
          },
          good: {
            beginner: "Your retirement readiness score of {score}% shows good progress toward your retirement goals. You're on the right track but could benefit from some adjustments.",
            intermediate: "Your retirement readiness score of {score}% indicates good preparation with room for improvement. Your projected savings of ${savings} will cover approximately {years} years of retirement income.",
            advanced: "Your retirement readiness score of {score}% shows solid preparation. Your projected savings of ${savings} represents {coverage}% of your target retirement income needs, with a gap of ${gap} to address."
          },
          moderate: {
            beginner: "Your retirement readiness score of {score}% indicates moderate risk. While you have some savings, you may need to increase your contributions to meet your retirement goals.",
            intermediate: "Your retirement readiness score of {score}% shows moderate preparation with significant room for improvement. Your projected savings of ${savings} will cover approximately {years} years of retirement income.",
            advanced: "Your retirement readiness score of {score}% indicates moderate risk. Your projected savings of ${savings} represents {coverage}% of your target retirement income needs, requiring additional contributions of ${monthly} to reach your goals."
          },
          poor: {
            beginner: "Your retirement readiness score of {score}% indicates significant risk. You'll need to take immediate action to improve your retirement preparation.",
            intermediate: "Your retirement readiness score of {score}% shows poor preparation for retirement. Your projected savings of ${savings} will cover only approximately {years} years of retirement income.",
            advanced: "Your retirement readiness score of {score}% indicates critical retirement planning gaps. Your projected savings of ${savings} represents only {coverage}% of your target retirement income needs, requiring immediate action."
          }
        },
        recommendations: {
          increaseContributions: {
            beginner: "Consider increasing your monthly retirement contributions to improve your retirement readiness.",
            intermediate: "Increasing your monthly contributions by ${amount} could improve your retirement readiness score by approximately {points} points.",
            advanced: "To reach your retirement goals, consider increasing your monthly contributions from ${current} to ${target}. This would improve your retirement readiness score from {currentScore}% to approximately {targetScore}%."
          },
          extendWorkingYears: {
            beginner: "Working a few more years could significantly improve your retirement readiness by allowing more time for savings to grow.",
            intermediate: "Extending your working years by {years} years could increase your retirement readiness score by approximately {points} points.",
            advanced: "Extending your working years by {years} years would allow your portfolio to grow by an additional ${growth} and increase your retirement readiness score from {currentScore}% to approximately {targetScore}%."
          },
          adjustGoals: {
            beginner: "Consider adjusting your retirement goals to better align with your current savings rate.",
            intermediate: "Reducing your target retirement income by ${amount} could improve your retirement readiness score by approximately {points} points.",
            advanced: "Adjusting your retirement income target from ${current} to ${target} would improve your retirement readiness score from {currentScore}% to approximately {targetScore}%, making your goals more achievable."
          }
        }
      },
      tax: {
        optimization: {
          beginner: "Our tax optimization analysis shows potential savings of ${savings} by optimizing your deductions and credits.",
          intermediate: "Tax optimization could save you ${savings} annually by maximizing deductions, credits, and tax-efficient investment strategies.",
          advanced: "Our comprehensive tax analysis identifies ${savings} in potential annual savings through strategic deduction optimization, credit maximization, and tax-efficient investment allocation."
        },
        recommendations: {
          beginner: "Consider consulting with a tax professional to explore these optimization opportunities.",
          intermediate: "Implement these tax optimization strategies to reduce your effective tax rate and increase your after-tax income.",
          advanced: "Execute these tax optimization strategies systematically, monitoring their effectiveness and adjusting as tax laws change."
        }
      },
      debt: {
        payoff: {
          beginner: "Our debt payoff analysis shows you can become debt-free in {years} years using the {strategy} method.",
          intermediate: "Using the {strategy} payoff method, you can eliminate all debt in {years} years, saving ${interest} in interest payments.",
          advanced: "The {strategy} payoff strategy will eliminate your debt in {years} years, saving ${interest} in interest while optimizing your cash flow and credit utilization."
        },
        recommendations: {
          beginner: "Focus on making consistent payments and consider increasing your monthly payment amount if possible.",
          intermediate: "Implement the recommended payoff strategy and consider refinancing high-interest debt to accelerate your progress.",
          advanced: "Execute the optimized payoff strategy while monitoring your credit score and exploring refinancing opportunities for additional savings."
        }
      }
    };
  }

  /**
   * Generate comprehensive explanation for financial analysis results
   * @param {Object} analysisResults - Results from financial analysis
   * @param {string} analysisType - Type of analysis (retirement, tax, debt)
   * @param {Object} userContext - User context and preferences
   * @returns {Object} Comprehensive explanation with insights and recommendations
   */
  async generateExplanation(analysisResults, analysisType, userContext = {}) {
    try {
      this.executionLog.logExecution('generateExplanation', { 
        input: { analysisResults, analysisType, userContext } 
      });

      const sophisticationLevel = userContext.sophisticationLevel || this.userSophisticationLevel;
      
      // Generate base explanation
      const baseExplanation = this.generateBaseExplanation(analysisResults, analysisType, sophisticationLevel);
      
      // Generate detailed breakdown
      const detailedBreakdown = this.generateDetailedBreakdown(analysisResults, analysisType, sophisticationLevel);
      
      // Generate actionable recommendations
      const recommendations = this.generateRecommendations(analysisResults, analysisType, sophisticationLevel);
      
      // Calculate confidence scores
      const confidenceScores = this.calculateConfidenceScores(analysisResults, analysisType);
      
      // Generate uncertainty explanations
      const uncertaintyExplanation = this.generateUncertaintyExplanation(analysisResults, analysisType, sophisticationLevel);
      
      const explanation = {
        summary: baseExplanation,
        detailedBreakdown,
        recommendations,
        confidenceScores,
        uncertaintyExplanation,
        keyMetrics: this.extractKeyMetrics(analysisResults, analysisType),
        nextSteps: this.generateNextSteps(analysisResults, analysisType, userContext),
        timestamp: new Date().toISOString(),
        analysisType,
        sophisticationLevel
      };

      this.executionLog.logExecution('generateExplanation', { 
        output: explanation,
        success: true 
      });

      return explanation;
    } catch (error) {
      this.executionLog.logExecution('generateExplanation', { 
        error: error.message,
        success: false 
      });
      throw new Error(`Explanation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate base explanation using templates
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @param {string} level - Sophistication level
   * @returns {string} Base explanation
   */
  generateBaseExplanation(results, type, level) {
    const templates = this.explanationTemplates[type];
    if (!templates) {
      return this.generateGenericExplanation(results, level);
    }

    if (type === 'retirement') {
      return this.generateRetirementExplanation(results, templates, level);
    } else if (type === 'tax') {
      return this.generateTaxExplanation(results, templates, level);
    } else if (type === 'debt') {
      return this.generateDebtExplanation(results, templates, level);
    }

    return this.generateGenericExplanation(results, level);
  }

  /**
   * Generate retirement-specific explanation
   * @param {Object} results - Retirement analysis results
   * @param {Object} templates - Explanation templates
   * @param {string} level - Sophistication level
   * @returns {string} Retirement explanation
   */
  generateRetirementExplanation(results, templates, level) {
    const { readinessScore, projectedSavings, retirementIncomeNeeds, yearsToRetirement } = results;
    
    let scoreCategory = 'excellent';
    if (readinessScore < 40) scoreCategory = 'poor';
    else if (readinessScore < 60) scoreCategory = 'moderate';
    else if (readinessScore < 80) scoreCategory = 'good';
    
    const template = templates.readinessScore[scoreCategory][level];
    const yearsCovered = projectedSavings / retirementIncomeNeeds;
    const coveragePercentage = (projectedSavings / retirementIncomeNeeds) * 100;
    const gap = retirementIncomeNeeds - projectedSavings;
    
    return template
      .replace('{score}', readinessScore.toFixed(0))
      .replace('{savings}', projectedSavings.toLocaleString())
      .replace('{years}', yearsCovered.toFixed(1))
      .replace('{coverage}', coveragePercentage.toFixed(1))
      .replace('{gap}', gap.toLocaleString())
      .replace('{monthly}', results.monthlyContributionNeeded?.toLocaleString() || '0');
  }

  /**
   * Generate tax-specific explanation
   * @param {Object} results - Tax analysis results
   * @param {Object} templates - Explanation templates
   * @param {string} level - Sophistication level
   * @returns {string} Tax explanation
   */
  generateTaxExplanation(results, templates, level) {
    const { potentialSavings, optimizationScore, recommendations } = results;
    
    const template = templates.optimization[level];
    return template.replace('{savings}', potentialSavings.toLocaleString());
  }

  /**
   * Generate debt-specific explanation
   * @param {Object} results - Debt analysis results
   * @param {Object} templates - Explanation templates
   * @param {string} level - Sophistication level
   * @returns {string} Debt explanation
   */
  generateDebtExplanation(results, templates, level) {
    const { payoffYears, totalInterest, strategy, monthlyPayment } = results;
    
    const template = templates.payoff[level];
    return template
      .replace('{years}', payoffYears.toFixed(1))
      .replace('{strategy}', strategy)
      .replace('{interest}', totalInterest.toLocaleString());
  }

  /**
   * Generate generic explanation for unknown analysis types
   * @param {Object} results - Analysis results
   * @param {string} level - Sophistication level
   * @returns {string} Generic explanation
   */
  generateGenericExplanation(results, level) {
    if (level === 'beginner') {
      return "Our analysis shows positive results for your financial situation. Consider implementing the recommended strategies to improve your financial health.";
    } else if (level === 'intermediate') {
      return "The analysis indicates favorable outcomes with room for optimization. The recommended strategies could enhance your financial position significantly.";
    } else {
      return "Comprehensive analysis reveals strategic opportunities for financial optimization. Implementation of the recommended strategies should yield measurable improvements in your financial metrics.";
    }
  }

  /**
   * Generate detailed breakdown of analysis results
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @param {string} level - Sophistication level
   * @returns {Object} Detailed breakdown
   */
  generateDetailedBreakdown(results, type, level) {
    const breakdown = {
      keyMetrics: {},
      assumptions: {},
      calculations: {},
      comparisons: {}
    };

    if (type === 'retirement') {
      breakdown.keyMetrics = {
        readinessScore: `${results.readinessScore}%`,
        projectedSavings: `$${results.projectedSavings.toLocaleString()}`,
        yearsToRetirement: `${results.yearsToRetirement} years`,
        monthlyContributionNeeded: `$${results.monthlyContributionNeeded.toLocaleString()}`
      };
      
      breakdown.assumptions = {
        marketReturn: '7% annual return',
        inflation: '2.5% annual inflation',
        retirementAge: '67 years',
        lifeExpectancy: '90 years'
      };
      
      breakdown.calculations = {
        currentSavings: `$${results.breakdown?.currentSavings.toLocaleString() || '0'}`,
        projectedGrowth: `$${results.breakdown?.projectedGrowth.toLocaleString() || '0'}`,
        socialSecurityEstimate: `$${results.breakdown?.socialSecurityEstimate.toLocaleString() || '0'}`,
        gapAnalysis: `$${results.breakdown?.gapAnalysis.toLocaleString() || '0'}`
      };
    }

    return breakdown;
  }

  /**
   * Generate actionable recommendations
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @param {string} level - Sophistication level
   * @returns {Array} Array of recommendations
   */
  generateRecommendations(results, type, level) {
    const recommendations = [];
    const templates = this.explanationTemplates[type]?.recommendations;

    if (type === 'retirement') {
      const { readinessScore, monthlyContributionNeeded, yearsToRetirement } = results;
      
      if (readinessScore < 70) {
        if (monthlyContributionNeeded > 0) {
          const template = templates.increaseContributions[level];
          const points = Math.min(20, Math.max(5, (70 - readinessScore) / 2));
          recommendations.push(template
            .replace('{amount}', monthlyContributionNeeded.toLocaleString())
            .replace('{points}', points.toFixed(0)));
        }
        
        if (yearsToRetirement > 5) {
          const template = templates.extendWorkingYears[level];
          const additionalYears = Math.min(5, Math.max(1, (70 - readinessScore) / 10));
          const points = Math.min(15, additionalYears * 3);
          recommendations.push(template
            .replace('{years}', additionalYears.toFixed(0))
            .replace('{points}', points.toFixed(0)));
        }
      }
    }

    return recommendations;
  }

  /**
   * Calculate confidence scores for different aspects of the analysis
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @returns {Object} Confidence scores
   */
  calculateConfidenceScores(results, type) {
    const scores = {
      overall: 85,
      dataQuality: 90,
      assumptions: 80,
      methodology: 85
    };

    if (type === 'retirement') {
      // Adjust confidence based on data completeness
      if (results.breakdown?.currentSavings === 0) {
        scores.dataQuality -= 20;
        scores.overall -= 15;
      }
      
      if (results.yearsToRetirement < 5) {
        scores.assumptions -= 10;
        scores.overall -= 5;
      }
    }

    return scores;
  }

  /**
   * Generate uncertainty explanation
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @param {string} level - Sophistication level
   * @returns {string} Uncertainty explanation
   */
  generateUncertaintyExplanation(results, type, level) {
    if (level === 'beginner') {
      return "These projections are estimates based on current information and assumptions about future market conditions. Actual results may vary.";
    } else if (level === 'intermediate') {
      return "Projections are based on historical market data and current assumptions. Market volatility, inflation changes, and personal circumstances may affect actual outcomes.";
    } else {
      return "Projections incorporate historical market data, current economic indicators, and statistical modeling. Uncertainty factors include market volatility, inflation variability, tax law changes, and personal circumstance evolution. Consider running Monte Carlo simulations for probabilistic analysis.";
    }
  }

  /**
   * Extract key metrics for summary display
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @returns {Object} Key metrics
   */
  extractKeyMetrics(results, type) {
    if (type === 'retirement') {
      return {
        readinessScore: results.readinessScore,
        projectedSavings: results.projectedSavings,
        yearsToRetirement: results.yearsToRetirement,
        monthlyContributionNeeded: results.monthlyContributionNeeded
      };
    } else if (type === 'tax') {
      return {
        potentialSavings: results.potentialSavings,
        optimizationScore: results.optimizationScore,
        effectiveTaxRate: results.effectiveTaxRate
      };
    } else if (type === 'debt') {
      return {
        payoffYears: results.payoffYears,
        totalInterest: results.totalInterest,
        monthlyPayment: results.monthlyPayment
      };
    }
    
    return {};
  }

  /**
   * Generate next steps for user action
   * @param {Object} results - Analysis results
   * @param {string} type - Analysis type
   * @param {Object} userContext - User context
   * @returns {Array} Array of next steps
   */
  generateNextSteps(results, type, userContext) {
    const nextSteps = [];
    
    if (type === 'retirement') {
      if (results.readinessScore < 70) {
        nextSteps.push('Review and increase monthly retirement contributions');
        nextSteps.push('Consider consulting with a financial advisor');
      }
      nextSteps.push('Run Monte Carlo simulation for probabilistic analysis');
      nextSteps.push('Review retirement goals and timeline');
    } else if (type === 'tax') {
      nextSteps.push('Implement recommended tax optimization strategies');
      nextSteps.push('Consult with a tax professional for personalized advice');
      nextSteps.push('Review tax optimization opportunities quarterly');
    } else if (type === 'debt') {
      nextSteps.push('Implement the recommended debt payoff strategy');
      nextSteps.push('Set up automatic payments for consistency');
      nextSteps.push('Monitor progress and adjust strategy as needed');
    }
    
    nextSteps.push('Re-run analysis in 3-6 months to track progress');
    
    return nextSteps;
  }

  /**
   * Adapt explanation complexity based on user interaction patterns
   * @param {string} currentLevel - Current sophistication level
   * @param {Object} interactionData - User interaction data
   * @returns {string} Adjusted sophistication level
   */
  adaptSophisticationLevel(currentLevel, interactionData) {
    const { featureUsage, questionComplexity, timeSpent, repeatVisits } = interactionData;
    
    let newLevel = currentLevel;
    
    // Analyze user behavior to determine appropriate level
    if (featureUsage > 10 && questionComplexity > 7 && timeSpent > 300) {
      newLevel = 'advanced';
    } else if (featureUsage > 5 && questionComplexity > 4 && timeSpent > 120) {
      newLevel = 'intermediate';
    } else if (featureUsage <= 2 || questionComplexity <= 3 || timeSpent <= 60) {
      newLevel = 'beginner';
    }
    
    return newLevel;
  }

  /**
   * Generate explanation for Monte Carlo simulation results
   * @param {Object} simulationResults - Monte Carlo simulation results
   * @param {string} level - Sophistication level
   * @returns {Object} Simulation explanation
   */
  generateSimulationExplanation(simulationResults, level) {
    const { statistics, riskAssessment, confidenceIntervals } = simulationResults;
    
    let explanation = '';
    
    if (level === 'beginner') {
      explanation = `Based on ${simulationResults.totalSimulations} simulations, your average retirement readiness score is ${statistics.readinessScore.mean.toFixed(1)}%. `;
      explanation += `This means you have a ${riskAssessment.successRate?.toFixed(1) || 'good'} chance of meeting your retirement goals.`;
    } else if (level === 'intermediate') {
      explanation = `Monte Carlo analysis of ${simulationResults.totalSimulations} scenarios shows an average readiness score of ${statistics.readinessScore.mean.toFixed(1)}% `;
      explanation += `with a range from ${statistics.readinessScore.min.toFixed(1)}% to ${statistics.readinessScore.max.toFixed(1)}%. `;
      explanation += `Your success probability is ${riskAssessment.successRate?.toFixed(1) || 'good'}%.`;
    } else {
      explanation = `Comprehensive Monte Carlo analysis (${simulationResults.totalSimulations} simulations) reveals a readiness score distribution `;
      explanation += `with mean ${statistics.readinessScore.mean.toFixed(1)}% (σ=${statistics.readinessScore.stdDev.toFixed(1)}%), `;
      explanation += `ranging from ${statistics.readinessScore.min.toFixed(1)}% to ${statistics.readinessScore.max.toFixed(1)}%. `;
      explanation += `The 90th percentile confidence interval is ${confidenceIntervals.readinessScore['90th'].toFixed(1)}%, `;
      explanation += `indicating a ${riskAssessment.successRate?.toFixed(1) || 'good'}% success probability.`;
    }
    
    return {
      summary: explanation,
      riskLevel: riskAssessment.overallRisk,
      recommendations: riskAssessment.recommendations,
      confidenceIntervals,
      statistics
    };
  }
}

export default ExplainabilityEngine; 