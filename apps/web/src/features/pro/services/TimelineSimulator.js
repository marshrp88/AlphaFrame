/**
 * TimelineSimulator.js - AlphaPro VX.0 Enhanced
 * 
 * Purpose: Advanced timeline simulation system that models discrete life events,
 * scenario branches, and financial impact analysis for the AlphaPro suite.
 * 
 * Procedure:
 * 1. Creates and manages timeline scenarios with discrete life events
 * 2. Simulates financial impact of events across different time horizons
 * 3. Provides side-by-side scenario comparison and branching
 * 4. Integrates with ExecutionLogService for comprehensive tracking
 * 
 * Conclusion: Delivers sophisticated timeline modeling while maintaining
 * zero-knowledge compliance and robust error handling.
 */

import executionLogService from '../../../core/services/ExecutionLogService.js';

// Life event types and their financial impact categories
const EVENT_TYPES = {
  CAREER: {
    promotion: { impact: 'income_increase', confidence: 'high' },
    job_change: { impact: 'income_change', confidence: 'medium' },
    retirement: { impact: 'income_decrease', confidence: 'high' },
    layoff: { impact: 'income_decrease', confidence: 'medium' }
  },
  PERSONAL: {
    marriage: { impact: 'expense_increase', confidence: 'high' },
    divorce: { impact: 'expense_increase', confidence: 'high' },
    children: { impact: 'expense_increase', confidence: 'high' },
    inheritance: { impact: 'asset_increase', confidence: 'medium' }
  },
  HEALTH: {
    medical_emergency: { impact: 'expense_increase', confidence: 'high' },
    disability: { impact: 'income_decrease', confidence: 'medium' },
    wellness_improvement: { impact: 'expense_decrease', confidence: 'low' }
  },
  MARKET: {
    recession: { impact: 'portfolio_decrease', confidence: 'medium' },
    bull_market: { impact: 'portfolio_increase', confidence: 'medium' },
    inflation_spike: { impact: 'purchasing_power_decrease', confidence: 'high' }
  }
};

class TimelineSimulator {
  constructor() {
    this.scenarios = new Map();
    this.currentScenarioId = null;
    this.eventTemplates = new Map();
  }

  /**
   * Create a new timeline scenario
   * @param {Object} config - Scenario configuration
   * @returns {Promise<string>} Scenario ID
   */
  async createScenario(config) {
    try {
      const scenarioId = `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const scenario = {
        id: scenarioId,
        name: config.name || 'Untitled Scenario',
        description: config.description || '',
        startDate: config.startDate || new Date().toISOString(),
        endDate: config.endDate || this.addYears(new Date(), 30).toISOString(),
        events: [],
        assumptions: config.assumptions || {},
        baseline: {
          income: config.baseline?.income || 0,
          expenses: config.baseline?.expenses || 0,
          assets: config.baseline?.assets || 0,
          liabilities: config.baseline?.liabilities || 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.scenarios.set(scenarioId, scenario);
      this.currentScenarioId = scenarioId;

      await executionLogService.log('timeline.scenario.created', {
        scenarioId,
        scenarioName: scenario.name,
        startDate: scenario.startDate,
        endDate: scenario.endDate
      });

      return scenarioId;
    } catch (error) {
      await executionLogService.logError('timeline.scenario.creation.failed', error, { config });
      throw error;
    }
  }

  /**
   * Add a life event to a scenario
   * @param {string} scenarioId - Scenario ID
   * @param {Object} event - Event object
   * @returns {Promise<string>} Event ID
   */
  async addEvent(scenarioId, event) {
    try {
      const scenario = this.scenarios.get(scenarioId);
      if (!scenario) {
        throw new Error(`Scenario ${scenarioId} not found`);
      }

      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const lifeEvent = {
        id: eventId,
        type: event.type,
        category: event.category,
        name: event.name,
        description: event.description || '',
        date: event.date,
        probability: event.probability || 1.0,
        impact: {
          income: event.impact?.income || 0,
          expenses: event.impact?.expenses || 0,
          assets: event.impact?.assets || 0,
          liabilities: event.impact?.liabilities || 0
        },
        confidence: event.confidence || 'medium',
        tags: event.tags || [],
        createdAt: new Date().toISOString()
      };

      scenario.events.push(lifeEvent);
      scenario.updatedAt = new Date().toISOString();

      await executionLogService.log('timeline.event.added', {
        scenarioId,
        eventId,
        eventType: lifeEvent.type,
        eventName: lifeEvent.name,
        eventDate: lifeEvent.date
      });

      return eventId;
    } catch (error) {
      await executionLogService.logError('timeline.event.addition.failed', error, { scenarioId, event });
      throw error;
    }
  }

  /**
   * Simulate a scenario and calculate financial projections
   * @param {string} scenarioId - Scenario ID
   * @param {Object} options - Simulation options
   * @returns {Promise<Object>} Simulation results
   */
  async simulateScenario(scenarioId, options = {}) {
    try {
      const startTime = Date.now();
      const scenario = this.scenarios.get(scenarioId);
      if (!scenario) {
        throw new Error(`Scenario ${scenarioId} not found`);
      }

      const simulation = {
        scenarioId,
        scenarioName: scenario.name,
        startDate: scenario.startDate,
        endDate: scenario.endDate,
        projections: [],
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netWorth: 0,
          riskScore: 0,
          confidence: 'medium'
        },
        events: [],
        simulationTime: 0,
        timestamp: new Date().toISOString()
      };

      // Sort events by date
      const sortedEvents = [...scenario.events].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      let currentIncome = scenario.baseline.income;
      let currentExpenses = scenario.baseline.expenses;
      let currentAssets = scenario.baseline.assets;
      let currentLiabilities = scenario.baseline.liabilities;

      // Generate monthly projections
      const startDate = new Date(scenario.startDate);
      const endDate = new Date(scenario.endDate);
      const months = this.getMonthsBetween(startDate, endDate);

      for (let i = 0; i < months; i++) {
        const projectionDate = this.addMonths(startDate, i);
        const projectionYear = projectionDate.getFullYear();
        const projectionMonth = projectionDate.getMonth();

        // Apply events that occur in this month (ignore day-of-month mismatches)
        const monthEvents = sortedEvents.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === projectionYear &&
                 eventDate.getMonth() === projectionMonth;
        });

        monthEvents.forEach(event => {
          currentIncome += event.impact.income;
          currentExpenses += event.impact.expenses;
          currentAssets += event.impact.assets;
          currentLiabilities += event.impact.liabilities;

          simulation.events.push({
            eventId: event.id,
            eventName: event.name,
            eventType: event.type,
            date: event.date,
            impact: event.impact
          });
        });

        const netWorth = currentAssets - currentLiabilities;
        
        simulation.projections.push({
          month: i + 1,
          date: projectionDate.toISOString(),
          income: currentIncome,
          expenses: currentExpenses,
          netIncome: currentIncome - currentExpenses,
          assets: currentAssets,
          liabilities: currentLiabilities,
          netWorth,
          events: monthEvents.map(e => e.id)
        });

        simulation.summary.totalIncome += currentIncome;
        simulation.summary.totalExpenses += currentExpenses;
      }

      // After monthly projections, ensure all events within the period are included in simulation.events
      const includedEventIds = new Set(simulation.events.map(e => e.eventId));
      sortedEvents.forEach(event => {
        const eventDate = new Date(event.date);
        if (
          eventDate >= startDate &&
          eventDate <= endDate &&
          !includedEventIds.has(event.id)
        ) {
          simulation.events.push({
            eventId: event.id,
            eventName: event.name,
            eventType: event.type,
            date: event.date,
            impact: event.impact
          });
        }
      });

      simulation.summary.netWorth = currentAssets - currentLiabilities;
      simulation.summary.riskScore = this.calculateRiskScore(scenario.events);
      simulation.summary.confidence = this.calculateConfidence(scenario.events);
      simulation.simulationTime = Date.now() - startTime;

      await executionLogService.log('timeline.scenario.simulated', {
        scenarioId,
        scenarioName: scenario.name,
        projectionMonths: months,
        totalEvents: scenario.events.length,
        simulationTime: simulation.simulationTime,
        finalNetWorth: simulation.summary.netWorth
      });

      return simulation;
    } catch (error) {
      await executionLogService.logError('timeline.scenario.simulation.failed', error, { scenarioId, options });
      throw error;
    }
  }

  /**
   * Compare multiple scenarios side by side
   * @param {Array<string>} scenarioIds - Array of scenario IDs
   * @returns {Promise<Object>} Comparison results
   */
  async compareScenarios(scenarioIds) {
    try {
      const startTime = Date.now();
      const simulations = [];

      // Simulate each scenario
      for (const scenarioId of scenarioIds) {
        const simulation = await this.simulateScenario(scenarioId);
        simulations.push(simulation);
      }

      const comparison = {
        scenarioIds,
        simulations,
        comparison: {
          bestNetWorth: Math.max(...simulations.map(s => s.summary.netWorth)),
          worstNetWorth: Math.min(...simulations.map(s => s.summary.netWorth)),
          averageNetWorth: simulations.reduce((sum, s) => sum + s.summary.netWorth, 0) / simulations.length,
          riskiestScenario: simulations.reduce((riskiest, current) => 
            current.summary.riskScore > riskiest.summary.riskScore ? current : riskiest
          ),
          safestScenario: simulations.reduce((safest, current) => 
            current.summary.riskScore < safest.summary.riskScore ? current : safest
          )
        },
        comparisonTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };

      await executionLogService.log('timeline.scenarios.compared', {
        scenarioCount: scenarioIds.length,
        comparisonTime: comparison.comparisonTime,
        bestNetWorth: comparison.comparison.bestNetWorth,
        worstNetWorth: comparison.comparison.worstNetWorth
      });

      return comparison;
    } catch (error) {
      await executionLogService.logError('timeline.scenarios.comparison.failed', error, { scenarioIds });
      throw error;
    }
  }

  /**
   * Create a scenario branch from an existing scenario
   * @param {string} baseScenarioId - Base scenario ID
   * @param {Object} branchConfig - Branch configuration
   * @returns {Promise<string>} New scenario ID
   */
  async createBranch(baseScenarioId, branchConfig) {
    try {
      const baseScenario = this.scenarios.get(baseScenarioId);
      if (!baseScenario) {
        throw new Error(`Base scenario ${baseScenarioId} not found`);
      }

      const branchScenarioId = await this.createScenario({
        name: branchConfig.name || `${baseScenario.name} - Branch`,
        description: branchConfig.description || `Branch of ${baseScenario.name}`,
        startDate: branchConfig.startDate || baseScenario.startDate,
        endDate: branchConfig.endDate || baseScenario.endDate,
        assumptions: { ...baseScenario.assumptions, ...branchConfig.assumptions },
        baseline: { ...baseScenario.baseline, ...branchConfig.baseline }
      });

      const branchScenario = this.scenarios.get(branchScenarioId);

      // Copy events from base scenario
      baseScenario.events.forEach(event => {
        branchScenario.events.push({ ...event });
      });

      // Add branch-specific events
      if (branchConfig.events) {
        for (const event of branchConfig.events) {
          await this.addEvent(branchScenarioId, event);
        }
      }

      await executionLogService.log('timeline.scenario.branched', {
        baseScenarioId,
        branchScenarioId,
        branchName: branchScenario.name,
        eventCount: branchScenario.events.length
      });

      return branchScenarioId;
    } catch (error) {
      await executionLogService.logError('timeline.scenario.branching.failed', error, { baseScenarioId, branchConfig });
      throw error;
    }
  }

  /**
   * Get all scenarios
   * @returns {Array} Array of scenarios
   */
  getAllScenarios() {
    return Array.from(this.scenarios.values());
  }

  /**
   * Get a specific scenario
   * @param {string} scenarioId - Scenario ID
   * @returns {Object|null} Scenario object
   */
  getScenario(scenarioId) {
    return this.scenarios.get(scenarioId) || null;
  }

  /**
   * Delete a scenario
   * @param {string} scenarioId - Scenario ID
   */
  async deleteScenario(scenarioId) {
    if (this.scenarios.has(scenarioId)) {
      this.scenarios.delete(scenarioId);
      
      if (this.currentScenarioId === scenarioId) {
        this.currentScenarioId = null;
      }

      await executionLogService.log('timeline.scenario.deleted', { scenarioId });
    }
  }

  /**
   * Calculate risk score based on events
   * @param {Array} events - Array of events
   * @returns {number} Risk score (0-100)
   */
  calculateRiskScore(events) {
    if (events.length === 0) return 0;

    const riskFactors = {
      income_decrease: 30,
      expense_increase: 25,
      asset_decrease: 20,
      liability_increase: 35,
      portfolio_decrease: 15
    };

    let totalRisk = 0;
    events.forEach(event => {
      if (event.impact.income < 0) totalRisk += riskFactors.income_decrease;
      if (event.impact.expenses > 0) totalRisk += riskFactors.expense_increase;
      if (event.impact.assets < 0) totalRisk += riskFactors.asset_decrease;
      if (event.impact.liabilities > 0) totalRisk += riskFactors.liability_increase;
    });

    return Math.min(100, totalRisk / events.length);
  }

  /**
   * Calculate confidence level based on events
   * @param {Array} events - Array of events
   * @returns {string} Confidence level
   */
  calculateConfidence(events) {
    if (events.length === 0) return 'high';

    const confidenceScores = {
      high: 3,
      medium: 2,
      low: 1
    };

    const totalScore = events.reduce((sum, event) => 
      sum + confidenceScores[event.confidence], 0
    );

    const averageScore = totalScore / events.length;
    
    if (averageScore >= 2.5) return 'high';
    if (averageScore >= 1.5) return 'medium';
    return 'low';
  }

  /**
   * Utility: Add years to date
   * @param {Date} date - Base date
   * @param {number} years - Years to add
   * @returns {Date} New date
   */
  addYears(date, years) {
    const newDate = new Date(date.getTime());
    newDate.setFullYear(newDate.getFullYear() + years);
    return newDate;
  }

  /**
   * Utility: Add months to date
   * @param {Date} date - Base date
   * @param {number} months - Months to add
   * @returns {Date} New date
   */
  addMonths(date, months) {
    const newDate = new Date(date.getTime());
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  }

  /**
   * Utility: Get months between two dates
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Number of months
   */
  getMonthsBetween(startDate, endDate) {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    const dayDiff = endDate.getDate() - startDate.getDate();
    
    let months = yearDiff * 12 + monthDiff;
    
    // Adjust for day of month
    if (dayDiff < 0) {
      months -= 1;
    }
    
    return Math.max(0, months);
  }
}

// Export singleton instance
const timelineSimulator = new TimelineSimulator();
export default timelineSimulator;

// Export the class for testing
export { TimelineSimulator, EVENT_TYPES }; 