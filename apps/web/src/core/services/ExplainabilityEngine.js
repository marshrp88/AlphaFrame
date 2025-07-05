/**
 * ExplainabilityEngine - AI Explainability and Educational Content Generator
 * 
 * Purpose: Provides comprehensive explanation generation and educational content
 * for financial analysis results in the AlphaFrame Galileo V2.2 platform.
 * 
 * Procedure:
 * 1. Analyzes financial analysis results and user context
 * 2. Generates clear, educational explanations of complex financial concepts
 * 3. Provides step-by-step breakdowns of calculations and recommendations
 * 4. Creates personalized educational content based on user sophistication
 * 
 * Conclusion: This service ensures that all financial insights are transparent
 * and educational, helping users understand the reasoning behind recommendations
 * and build financial literacy through clear, accessible explanations.
 */

class ExplainabilityEngine {
  constructor() {
    // Explanation templates for different analysis types
    this.explanationTemplates = {
      tax: {
        primary: 'Your tax liability of ${totalTax} represents an effective tax rate of ${effectiveRate}%.',
        stepByStep: [
          'We calculated your taxable income by subtracting deductions from your gross income.',
          'We applied the progressive tax brackets to determine your federal tax liability.',
          'We subtracted applicable credits to arrive at your final tax amount.'
        ],
        educational: 'The progressive tax system means higher income is taxed at higher rates, but only the amount above each bracket threshold.'
      },
      debt: {
        primary: 'Your debt portfolio analysis shows ${totalDebt} in total obligations with an average interest rate of ${avgRate}%.',
        stepByStep: [
          'We analyzed each debt\'s balance, interest rate, and minimum payment.',
          'We calculated the total interest cost under different payoff strategies.',
          'We identified the most cost-effective approach for your situation.'
        ],
        educational: 'The avalanche method prioritizes high-interest debt to minimize total interest costs, while the snowball method provides psychological wins.'
      },
      retirement: {
        primary: 'Your retirement readiness score is ${score}/100, indicating ${status} progress toward your retirement goals.',
        stepByStep: [
          'We projected your future savings based on current contributions and expected returns.',
          'We calculated the amount needed to support your desired retirement lifestyle.',
          'We compared your projected savings to your retirement needs.'
        ],
        educational: 'The 4% rule suggests withdrawing 4% of your retirement savings annually, adjusted for inflation.'
      },
      investment: {
        primary: 'Your investment simulation shows a ${successRate}% probability of achieving your financial goals.',
        stepByStep: [
          'We ran thousands of simulations with varying market conditions.',
          'We calculated the probability of different outcomes based on historical patterns.',
          'We identified the range of possible results you might expect.'
        ],
        educational: 'Monte Carlo simulations help understand the uncertainty in financial planning by modeling many possible future scenarios.'
      }
    };
    
    // Educational content for different topics
    this.educationalContent = {
      tax: {
        basics: 'Taxes are mandatory payments to government based on income, with rates that increase as income rises.',
        deductions: 'Deductions reduce your taxable income, lowering your tax bill. You can choose standard or itemized deductions.',
        credits: 'Tax credits directly reduce your tax bill dollar-for-dollar, making them more valuable than deductions.',
        optimization: 'Tax optimization involves legally minimizing your tax burden through strategic use of deductions and credits.'
      },
      debt: {
        types: 'Different types of debt have different characteristics: credit cards (high interest), student loans (low interest), mortgages (secured).',
        strategies: 'Debt payoff strategies include avalanche (highest interest first) and snowball (lowest balance first) methods.',
        consolidation: 'Debt consolidation combines multiple debts into one loan, potentially reducing interest rates and simplifying payments.',
        management: 'Effective debt management involves understanding interest rates, payment schedules, and payoff strategies.'
      },
      retirement: {
        planning: 'Retirement planning involves estimating future needs and creating a savings strategy to meet those needs.',
        accounts: 'Retirement accounts like 401(k)s and IRAs offer tax advantages to encourage long-term saving.',
        withdrawal: 'The 4% rule suggests withdrawing 4% of retirement savings annually, adjusted for inflation.',
        socialSecurity: 'Social Security provides a foundation of retirement income, but shouldn\'t be your only source.'
      },
      investment: {
        basics: 'Investing involves putting money to work to generate returns over time, accepting some risk for potential reward.',
        diversification: 'Diversification spreads risk across different investments, reducing the impact of any single investment\'s performance.',
        assetAllocation: 'Asset allocation determines the mix of stocks, bonds, and other investments in your portfolio.',
        rebalancing: 'Rebalancing periodically adjusts your portfolio back to target allocations as investments grow at different rates.'
      }
    };
  }

  /**
   * Generate comprehensive explanation for financial analysis results
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis (tax, debt, retirement, investment)
   * @param {Object} userContext - User context and preferences
   * @returns {Object} Comprehensive explanation with educational content
   */
  async generateExplanation(analysisData, analysisType, userContext) {
    try {
      // Generate primary explanation
      const primary = this.generatePrimaryExplanation(analysisData, analysisType);
      
      // Generate step-by-step breakdown
      const stepByStep = this.generateStepByStepExplanation(analysisData, analysisType);
      
      // Generate educational content
      const educational = this.generateEducationalContent(analysisType, userContext);
      
      // Generate personalized insights
      const insights = this.generatePersonalizedInsights(analysisData, analysisType, userContext);
      
      // Create comprehensive result
      const result = {
        primary,
        stepByStep,
        educational,
        insights,
        summary: {
          analysisType,
          complexity: this.assessComplexity(analysisData),
          userLevel: this.assessUserLevel(userContext),
          keyTakeaways: this.extractKeyTakeaways(analysisData, analysisType)
        },
        timestamp: new Date().toISOString(),
        version: '2.2.0'
      };

      return result;
    } catch (error) {
      throw new Error(`Explanation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate primary explanation for analysis results
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis
   * @returns {string} Primary explanation
   */
  generatePrimaryExplanation(analysisData, analysisType) {
    const template = this.explanationTemplates[analysisType]?.primary;
    if (!template) {
      return `Analysis completed for ${analysisType} with key results.`;
    }
    
    // Replace placeholders with actual values
    let explanation = template;
    
    if (analysisType === 'tax') {
      explanation = explanation
        .replace('${totalTax}', `$${analysisData.totalTax?.toLocaleString() || '0'}`)
        .replace('${effectiveRate}', `${analysisData.effectiveTaxRate?.toFixed(1) || '0'}%`);
    } else if (analysisType === 'debt') {
      explanation = explanation
        .replace('${totalDebt}', `$${analysisData.portfolioMetrics?.totalDebt?.toLocaleString() || '0'}`)
        .replace('${avgRate}', `${(analysisData.portfolioMetrics?.averageRate * 100)?.toFixed(1) || '0'}%`);
    } else if (analysisType === 'retirement') {
      explanation = explanation
        .replace('${score}', analysisData.readinessScore?.toFixed(0) || '0')
        .replace('${status}', this.getRetirementStatus(analysisData.readinessScore));
    } else if (analysisType === 'investment') {
      explanation = explanation
        .replace('${successRate}', `${(analysisData.statisticalAnalysis?.successRate * 100)?.toFixed(1) || '0'}%`);
    }
    
    return explanation;
  }

  /**
   * Generate step-by-step explanation
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis
   * @returns {Array} Array of explanation steps
   */
  generateStepByStepExplanation(analysisData, analysisType) {
    const template = this.explanationTemplates[analysisType]?.stepByStep;
    if (!template) {
      return ['Analysis completed using standard financial planning methodologies.'];
    }
    
    // Customize steps based on actual data
    const steps = [...template];
    
    if (analysisType === 'tax' && analysisData.breakdown) {
      steps.push(`Your marginal tax rate is ${(analysisData.breakdown.marginalRate * 100).toFixed(1)}%, meaning additional income is taxed at this rate.`);
    }
    
    if (analysisType === 'debt' && analysisData.strategies) {
      const bestStrategy = Object.keys(analysisData.strategies).find(key => 
        analysisData.strategies[key].totalInterest === Math.min(...Object.values(analysisData.strategies).map(s => s.totalInterest))
      );
      if (bestStrategy) {
        steps.push(`The ${bestStrategy} strategy would save you the most money in interest costs.`);
      }
    }
    
    return steps;
  }

  /**
   * Generate educational content based on analysis type and user level
   * @param {string} analysisType - Type of analysis
   * @param {Object} userContext - User context
   * @returns {Object} Educational content
   */
  generateEducationalContent(analysisType, userContext) {
    const content = this.educationalContent[analysisType];
    if (!content) {
      return { basics: 'Financial analysis helps you make informed decisions about your money.' };
    }
    
    const userLevel = this.assessUserLevel(userContext);
    
    // Filter content based on user level
    const filteredContent = {};
    Object.keys(content).forEach(key => {
      if (userLevel === 'beginner' && ['basics'].includes(key)) {
        filteredContent[key] = content[key];
      } else if (userLevel === 'intermediate' && ['basics', 'strategies', 'types'].includes(key)) {
        filteredContent[key] = content[key];
      } else if (userLevel === 'advanced') {
        filteredContent[key] = content[key];
      }
    });
    
    return filteredContent;
  }

  /**
   * Generate personalized insights based on analysis results
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis
   * @param {Object} userContext - User context
   * @returns {Array} Array of personalized insights
   */
  generatePersonalizedInsights(analysisData, analysisType, userContext) {
    const insights = [];
    
    if (analysisType === 'tax') {
      if (analysisData.recommendations?.length > 0) {
        insights.push({
          type: 'optimization',
          title: 'Tax Optimization Opportunity',
          description: `You have ${analysisData.recommendations.length} potential tax optimization strategies available.`,
          priority: 'high'
        });
      }
      
      if (analysisData.effectiveTaxRate > 0.25) {
        insights.push({
          type: 'awareness',
          title: 'High Tax Burden',
          description: 'Your effective tax rate is above average. Consider exploring additional deduction opportunities.',
          priority: 'medium'
        });
      }
    }
    
    if (analysisType === 'debt') {
      if (analysisData.portfolioMetrics?.highInterestDebt > 0) {
        insights.push({
          type: 'urgent',
          title: 'High-Interest Debt Alert',
          description: `You have $${analysisData.portfolioMetrics.highInterestDebt.toLocaleString()} in high-interest debt that should be prioritized.`,
          priority: 'critical'
        });
      }
    }
    
    if (analysisType === 'retirement') {
      if (analysisData.readinessScore < 50) {
        insights.push({
          type: 'action',
          title: 'Retirement Planning Needed',
          description: 'Your retirement readiness score indicates you need to increase your savings rate.',
          priority: 'high'
        });
      }
    }
    
    return insights;
  }

  /**
   * Assess complexity of analysis results
   * @param {Object} analysisData - Financial analysis results
   * @returns {string} Complexity level
   */
  assessComplexity(analysisData) {
    const factors = [];
    
    if (analysisData.recommendations?.length > 3) factors.push('multiple_recommendations');
    if (analysisData.breakdown?.marginalRate !== analysisData.breakdown?.averageRate) factors.push('progressive_taxation');
    if (analysisData.strategies && Object.keys(analysisData.strategies).length > 2) factors.push('multiple_strategies');
    
    if (factors.length >= 3) return 'high';
    if (factors.length >= 1) return 'medium';
    return 'low';
  }

  /**
   * Assess user sophistication level
   * @param {Object} userContext - User context
   * @returns {string} User level
   */
  assessUserLevel(userContext) {
    const { age, income, education, experience } = userContext;
    
    let score = 0;
    if (age > 40) score += 1;
    if (income > 75000) score += 1;
    if (education === 'college') score += 1;
    if (experience === 'advanced') score += 1;
    
    if (score >= 3) return 'advanced';
    if (score >= 1) return 'intermediate';
    return 'beginner';
  }

  /**
   * Extract key takeaways from analysis results
   * @param {Object} analysisData - Financial analysis results
   * @param {string} analysisType - Type of analysis
   * @returns {Array} Array of key takeaways
   */
  extractKeyTakeaways(analysisData, analysisType) {
    const takeaways = [];
    
    if (analysisType === 'tax') {
      takeaways.push(`Your effective tax rate is ${analysisData.effectiveTaxRate?.toFixed(1)}%`);
      if (analysisData.recommendations?.length > 0) {
        takeaways.push(`${analysisData.recommendations.length} optimization opportunities identified`);
      }
    }
    
    if (analysisType === 'debt') {
      takeaways.push(`Total debt: $${analysisData.portfolioMetrics?.totalDebt?.toLocaleString()}`);
      if (analysisData.summary?.potentialSavings > 0) {
        takeaways.push(`Potential savings: $${analysisData.summary.potentialSavings.toLocaleString()}`);
      }
    }
    
    if (analysisType === 'retirement') {
      takeaways.push(`Retirement readiness: ${analysisData.readinessScore?.toFixed(0)}/100`);
      takeaways.push(`Years to retirement: ${analysisData.deterministicForecast?.yearsToRetirement}`);
    }
    
    return takeaways;
  }

  /**
   * Get retirement status based on readiness score
   * @param {number} readinessScore - Retirement readiness score
   * @returns {string} Status description
   */
  getRetirementStatus(readinessScore) {
    if (readinessScore >= 80) return 'excellent';
    if (readinessScore >= 60) return 'good';
    if (readinessScore >= 40) return 'fair';
    return 'needs improvement';
  }

  /**
   * Generate explanation for specific recommendation
   * @param {Object} recommendation - Recommendation object
   * @param {string} analysisType - Type of analysis
   * @returns {Object} Detailed explanation
   */
  generateRecommendationExplanation(recommendation, analysisType) {
    return {
      title: recommendation.title,
      description: recommendation.description,
      reasoning: this.generateReasoning(recommendation, analysisType),
      impact: this.assessImpact(recommendation),
      action: recommendation.action
    };
  }

  /**
   * Generate reasoning for recommendation
   * @param {Object} recommendation - Recommendation object
   * @param {string} analysisType - Type of analysis
   * @returns {string} Reasoning explanation
   */
  generateReasoning(recommendation, analysisType) {
    if (analysisType === 'tax' && recommendation.type === 'retirement') {
      return 'Retirement contributions reduce your taxable income, lowering your tax bill while building savings for the future.';
    }
    
    if (analysisType === 'debt' && recommendation.type === 'avalanche') {
      return 'Paying off high-interest debt first minimizes the total interest you\'ll pay over time.';
    }
    
    return 'This recommendation is based on standard financial planning principles and your specific situation.';
  }

  /**
   * Assess impact of recommendation
   * @param {Object} recommendation - Recommendation object
   * @returns {string} Impact level
   */
  assessImpact(recommendation) {
    if (recommendation.priority === 'critical' || recommendation.priority === 'high') {
      return 'high';
    }
    if (recommendation.priority === 'medium') {
      return 'medium';
    }
    return 'low';
  }
}

export default ExplainabilityEngine; 