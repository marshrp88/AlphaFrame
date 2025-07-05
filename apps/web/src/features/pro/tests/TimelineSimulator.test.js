/**
 * TimelineSimulator.test.js
 * 
 * Purpose: Comprehensive unit tests for the TimelineSimulator service to ensure
 * all timeline modeling functionality works correctly including scenario creation,
 * event management, simulation, comparison, and branching features.
 * 
 * Procedure:
 * 1. Test scenario creation and management
 * 2. Test life event addition and validation
 * 3. Test scenario simulation and projections
 * 4. Test scenario comparison functionality
 * 5. Test scenario branching
 * 6. Test ExecutionLogService integration
 * 7. Test error handling and edge cases
 * 
 * Conclusion: These tests validate that the TimelineSimulator properly
 * models financial timelines, handles complex scenarios, and integrates
 * seamlessly with the logging system.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Test mock without importing the actual service
describe('ExecutionLogService Mock Test', () => {
  it('should mock ExecutionLogService correctly', () => {
    // Mock the service directly
    const mockExecutionLogService = {
      log: vi.fn().mockResolvedValue({ id: 'test-log-id' }),
      logError: vi.fn().mockResolvedValue({ id: 'test-error-id' })
    };
    
    expect(mockExecutionLogService).toBeDefined();
    expect(typeof mockExecutionLogService.log).toBe('function');
    expect(typeof mockExecutionLogService.logError).toBe('function');
    expect(mockExecutionLogService.log.mockResolvedValue).toBeDefined();
    expect(mockExecutionLogService.logError.mockResolvedValue).toBeDefined();
  });
});

// Mock the module at the top level
vi.mock('../../../core/services/ExecutionLogService.js');

// Import after mocks are set up
import { TimelineSimulator, EVENT_TYPES } from '../services/TimelineSimulator.js';
import executionLogService from '../../../core/services/ExecutionLogService.js';

// Set up the mock implementation after import
const mockLog = vi.fn().mockResolvedValue({ id: 'test-log-id' });
const mockLogError = vi.fn().mockResolvedValue({ id: 'test-error-id' });

// Mock the default export
executionLogService.log = mockLog;
executionLogService.logError = mockLogError;
executionLogService.logPortfolioAnalysis = vi.fn().mockResolvedValue({ id: 'test-portfolio-log-id' });
executionLogService.logSimulationRun = vi.fn().mockResolvedValue({ id: 'test-simulation-log-id' });
executionLogService.logBudgetForecast = vi.fn().mockResolvedValue({ id: 'test-budget-log-id' });
executionLogService.logRuleTriggered = vi.fn().mockResolvedValue({ id: 'test-rule-log-id' });
executionLogService.queryLogs = vi.fn().mockResolvedValue([]);
executionLogService.getSessionLogs = vi.fn().mockResolvedValue([]);
executionLogService.getComponentLogs = vi.fn().mockResolvedValue([]);
executionLogService.getPerformanceLogs = vi.fn().mockResolvedValue([]);
executionLogService.clearOldLogs = vi.fn().mockResolvedValue(0);
executionLogService.exportLogs = vi.fn().mockResolvedValue({ logs: [] });
executionLogService.decryptPayload = vi.fn().mockResolvedValue({});
executionLogService.generateId = vi.fn(() => 'test-id');
executionLogService.generateSessionId = vi.fn(() => 'test-session');
executionLogService.getUserId = vi.fn(() => 'test-user');
executionLogService.initDatabase = vi.fn().mockResolvedValue();
executionLogService.initEncryption = vi.fn().mockResolvedValue();
executionLogService.encryptPayload = vi.fn().mockResolvedValue('encrypted-data');
executionLogService.storeLog = vi.fn().mockResolvedValue();

describe('TimelineSimulator', () => {
  let timelineSimulator;

  beforeEach(() => {
    timelineSimulator = new TimelineSimulator();
    
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Re-setup the mock functions with default resolved values
    executionLogService.log.mockResolvedValue({ id: 'test-log-id' });
    executionLogService.logError.mockResolvedValue({ id: 'test-error-id' });
    executionLogService.logPortfolioAnalysis.mockResolvedValue({ id: 'test-portfolio-log-id' });
    executionLogService.logSimulationRun.mockResolvedValue({ id: 'test-simulation-log-id' });
    executionLogService.logBudgetForecast.mockResolvedValue({ id: 'test-budget-log-id' });
    executionLogService.logRuleTriggered.mockResolvedValue({ id: 'test-rule-log-id' });
    executionLogService.queryLogs.mockResolvedValue([]);
    executionLogService.getSessionLogs.mockResolvedValue([]);
    executionLogService.getComponentLogs.mockResolvedValue([]);
    executionLogService.getPerformanceLogs.mockResolvedValue([]);
    executionLogService.clearOldLogs.mockResolvedValue(0);
    executionLogService.exportLogs.mockResolvedValue({ logs: [] });
    executionLogService.decryptPayload.mockResolvedValue({});
    executionLogService.generateId.mockReturnValue('test-id');
    executionLogService.generateSessionId.mockReturnValue('test-session');
    executionLogService.getUserId.mockReturnValue('test-user');
    executionLogService.initDatabase.mockResolvedValue();
    executionLogService.initEncryption.mockResolvedValue();
    executionLogService.encryptPayload.mockResolvedValue('encrypted-data');
    executionLogService.storeLog.mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Debug test to check mock structure
  it('should have proper ExecutionLogService mock', () => {
    expect(executionLogService).toBeDefined();
    expect(typeof executionLogService.log).toBe('function');
    expect(typeof executionLogService.logError).toBe('function');
    expect(executionLogService.log.mockResolvedValue).toBeDefined();
    expect(executionLogService.logError.mockResolvedValue).toBeDefined();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(timelineSimulator.scenarios).toBeInstanceOf(Map);
      expect(timelineSimulator.currentScenarioId).toBeNull();
      expect(timelineSimulator.eventTemplates).toBeInstanceOf(Map);
    });

    it('should start with empty scenarios', () => {
      expect(timelineSimulator.scenarios.size).toBe(0);
    });
  });

  describe('Scenario Creation', () => {
    it('should create a scenario with basic configuration', async () => {
      const config = {
        name: 'Test Scenario',
        description: 'A test scenario',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2034-01-01T00:00:00.000Z'
      };

      const scenarioId = await timelineSimulator.createScenario(config);
      const scenario = timelineSimulator.getScenario(scenarioId);

      expect(scenarioId).toBeDefined();
      expect(scenario.name).toBe('Test Scenario');
      expect(scenario.description).toBe('A test scenario');
      expect(scenario.startDate).toBe('2024-01-01T00:00:00.000Z');
      expect(scenario.endDate).toBe('2034-01-01T00:00:00.000Z');
      expect(scenario.events).toHaveLength(0);
      expect(timelineSimulator.currentScenarioId).toBe(scenarioId);

      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.scenario.created',
        expect.objectContaining({
          scenarioId,
          scenarioName: 'Test Scenario'
        })
      );
    });

    it('should create a scenario with default values', async () => {
      const scenarioId = await timelineSimulator.createScenario({});
      const scenario = timelineSimulator.getScenario(scenarioId);

      expect(scenario.name).toBe('Untitled Scenario');
      expect(scenario.description).toBe('');
      expect(scenario.baseline.income).toBe(0);
      expect(scenario.baseline.expenses).toBe(0);
      expect(scenario.baseline.assets).toBe(0);
      expect(scenario.baseline.liabilities).toBe(0);
    });

    it('should handle scenario creation errors', async () => {
      executionLogService.log.mockRejectedValue(new Error('Log error'));

      await expect(timelineSimulator.createScenario({}))
        .rejects.toThrow('Log error');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'timeline.scenario.creation.failed',
        expect.any(Error),
        { config: {} }
      );
    });
  });

  describe('Event Management', () => {
    let scenarioId;

    beforeEach(async () => {
      scenarioId = await timelineSimulator.createScenario({
        name: 'Event Test Scenario'
      });
    });

    it('should add a life event to a scenario', async () => {
      const event = {
        type: 'promotion',
        category: 'CAREER',
        name: 'Job Promotion',
        description: 'Promoted to senior position',
        date: '2025-06-15T00:00:00.000Z',
        probability: 0.8,
        impact: {
          income: 20000,
          expenses: 0,
          assets: 0,
          liabilities: 0
        },
        confidence: 'high'
      };

      const eventId = await timelineSimulator.addEvent(scenarioId, event);
      const scenario = timelineSimulator.getScenario(scenarioId);

      expect(eventId).toBeDefined();
      expect(scenario.events).toHaveLength(1);
      expect(scenario.events[0].type).toBe('promotion');
      expect(scenario.events[0].name).toBe('Job Promotion');
      expect(scenario.events[0].impact.income).toBe(20000);

      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.event.added',
        expect.objectContaining({
          scenarioId,
          eventId,
          eventType: 'promotion',
          eventName: 'Job Promotion'
        })
      );
    });

    it('should handle adding event to non-existent scenario', async () => {
      const event = {
        type: 'promotion',
        category: 'CAREER',
        name: 'Job Promotion',
        date: '2025-06-15T00:00:00.000Z'
      };

      await expect(timelineSimulator.addEvent('non-existent', event))
        .rejects.toThrow('Scenario non-existent not found');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'timeline.event.addition.failed',
        expect.any(Error),
        { scenarioId: 'non-existent', event }
      );
    });

    it('should add multiple events to a scenario', async () => {
      const events = [
        {
          type: 'promotion',
          category: 'CAREER',
          name: 'Job Promotion',
          date: '2025-06-15T00:00:00.000Z',
          impact: { income: 20000, expenses: 0, assets: 0, liabilities: 0 }
        },
        {
          type: 'children',
          category: 'PERSONAL',
          name: 'New Child',
          date: '2026-03-20T00:00:00.000Z',
          impact: { income: 0, expenses: 15000, assets: 0, liabilities: 0 }
        }
      ];

      for (const event of events) {
        await timelineSimulator.addEvent(scenarioId, event);
      }

      const scenario = timelineSimulator.getScenario(scenarioId);
      expect(scenario.events).toHaveLength(2);
      expect(scenario.events[0].type).toBe('promotion');
      expect(scenario.events[1].type).toBe('children');
    });
  });

  describe('Scenario Simulation', () => {
    let scenarioId;

    beforeEach(async () => {
      scenarioId = await timelineSimulator.createScenario({
        name: 'Simulation Test Scenario',
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2026-01-01T00:00:00.000Z',
        baseline: {
          income: 80000,
          expenses: 60000,
          assets: 100000,
          liabilities: 50000
        }
      });
    });

    it('should simulate a scenario with no events', async () => {
      const simulation = await timelineSimulator.simulateScenario(scenarioId);

      expect(simulation.scenarioId).toBe(scenarioId);
      expect(simulation.scenarioName).toBe('Simulation Test Scenario');
      expect(simulation.projections).toHaveLength(24); // 2 years * 12 months
      expect(simulation.summary.totalIncome).toBeGreaterThan(0);
      expect(simulation.summary.totalExpenses).toBeGreaterThan(0);
      expect(simulation.summary.netWorth).toBe(50000); // 100000 - 50000
      expect(simulation.summary.riskScore).toBe(0);
      expect(simulation.summary.confidence).toBe('high');

      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.scenario.simulated',
        expect.objectContaining({
          scenarioId,
          projectionMonths: 24,
          totalEvents: 0,
          finalNetWorth: 50000
        })
      );
    });

    it('should simulate a scenario with events', async () => {
      // Add events
      const event1 = {
        type: 'promotion',
        category: 'CAREER',
        name: 'Job Promotion',
        date: '2025-06-15T00:00:00.000Z',
        impact: { income: 20000, expenses: 0, assets: 0, liabilities: 0 }
      };
      const event2 = {
        type: 'children',
        category: 'PERSONAL',
        name: 'New Child',
        date: '2025-08-20T00:00:00.000Z',
        impact: { income: 0, expenses: 15000, assets: 0, liabilities: 0 }
      };
      await timelineSimulator.addEvent(scenarioId, event1);
      await timelineSimulator.addEvent(scenarioId, event2);

      const simulation = await timelineSimulator.simulateScenario(scenarioId);

      expect(simulation.events.length).toBeGreaterThanOrEqual(2);
      expect(simulation.summary.totalIncome).toBeGreaterThan(0);
      expect(simulation.summary.totalExpenses).toBeGreaterThan(0);
      expect(simulation.summary.riskScore).toBeGreaterThan(0);
    });

    it('should handle simulation of non-existent scenario', async () => {
      await expect(timelineSimulator.simulateScenario('non-existent'))
        .rejects.toThrow('Scenario non-existent not found');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'timeline.scenario.simulation.failed',
        expect.any(Error),
        { scenarioId: 'non-existent', options: {} }
      );
    });
  });

  describe('Scenario Comparison', () => {
    let scenario1Id, scenario2Id;

    beforeEach(async () => {
      scenario1Id = await timelineSimulator.createScenario({
        name: 'Conservative Scenario',
        baseline: { income: 80000, expenses: 60000, assets: 100000, liabilities: 50000 }
      });

      scenario2Id = await timelineSimulator.createScenario({
        name: 'Aggressive Scenario',
        baseline: { income: 120000, expenses: 80000, assets: 150000, liabilities: 75000 }
      });

      // Add events to make scenarios different
      await timelineSimulator.addEvent(scenario1Id, {
        type: 'promotion',
        category: 'CAREER',
        name: 'Modest Promotion',
        date: '2025-06-15T00:00:00.000Z',
        impact: { income: 10000, expenses: 0, assets: 0, liabilities: 0 }
      });

      await timelineSimulator.addEvent(scenario2Id, {
        type: 'promotion',
        category: 'CAREER',
        name: 'Major Promotion',
        date: '2025-06-15T00:00:00.000Z',
        impact: { income: 30000, expenses: 0, assets: 0, liabilities: 0 }
      });
    });

    it('should compare multiple scenarios', async () => {
      const comparison = await timelineSimulator.compareScenarios([scenario1Id, scenario2Id]);

      expect(comparison.scenarioIds).toEqual([scenario1Id, scenario2Id]);
      expect(comparison.simulations).toHaveLength(2);
      expect(comparison.comparison.bestNetWorth).toBeGreaterThan(comparison.comparison.worstNetWorth);
      expect(comparison.comparison.averageNetWorth).toBeGreaterThan(0);
      expect(comparison.comparison.riskiestScenario).toBeDefined();
      expect(comparison.comparison.safestScenario).toBeDefined();

      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.scenarios.compared',
        expect.objectContaining({
          scenarioCount: 2,
          bestNetWorth: expect.any(Number),
          worstNetWorth: expect.any(Number)
        })
      );
    });

    it('should handle comparison with single scenario', async () => {
      const comparison = await timelineSimulator.compareScenarios([scenario1Id]);

      expect(comparison.scenarioIds).toEqual([scenario1Id]);
      expect(comparison.simulations).toHaveLength(1);
      expect(comparison.comparison.bestNetWorth).toBe(comparison.comparison.worstNetWorth);
    });
  });

  describe('Scenario Branching', () => {
    let baseScenarioId;

    beforeEach(async () => {
      baseScenarioId = await timelineSimulator.createScenario({
        name: 'Base Scenario',
        baseline: { income: 80000, expenses: 60000, assets: 100000, liabilities: 50000 }
      });

      await timelineSimulator.addEvent(baseScenarioId, {
        type: 'promotion',
        category: 'CAREER',
        name: 'Base Promotion',
        date: '2025-06-15T00:00:00.000Z',
        impact: { income: 10000, expenses: 0, assets: 0, liabilities: 0 }
      });
    });

    it('should create a branch from existing scenario', async () => {
      const branchConfig = {
        name: 'Optimistic Branch',
        description: 'Optimistic version of base scenario',
        events: [
          {
            type: 'promotion',
            category: 'CAREER',
            name: 'Additional Promotion',
            date: '2026-01-15T00:00:00.000Z',
            impact: { income: 15000, expenses: 0, assets: 0, liabilities: 0 }
          }
        ]
      };

      const branchScenarioId = await timelineSimulator.createBranch(baseScenarioId, branchConfig);
      const branchScenario = timelineSimulator.getScenario(branchScenarioId);

      expect(branchScenario.name).toBe('Optimistic Branch');
      expect(branchScenario.description).toBe('Optimistic version of base scenario');
      expect(branchScenario.events).toHaveLength(2); // Base event + branch event

      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.scenario.branched',
        expect.objectContaining({
          baseScenarioId,
          branchScenarioId,
          branchName: 'Optimistic Branch',
          eventCount: 2
        })
      );
    });

    it('should handle branching from non-existent scenario', async () => {
      const branchConfig = { name: 'Test Branch' };

      await expect(timelineSimulator.createBranch('non-existent', branchConfig))
        .rejects.toThrow('Base scenario non-existent not found');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'timeline.scenario.branching.failed',
        expect.any(Error),
        { baseScenarioId: 'non-existent', branchConfig }
      );
    });
  });

  describe('Risk and Confidence Calculation', () => {
    it('should calculate risk score correctly', () => {
      const events = [
        {
          impact: { income: -10000, expenses: 0, assets: 0, liabilities: 0 },
          confidence: 'high'
        },
        {
          impact: { income: 0, expenses: 5000, assets: 0, liabilities: 0 },
          confidence: 'medium'
        }
      ];

      const riskScore = timelineSimulator.calculateRiskScore(events);
      expect(riskScore).toBeGreaterThan(0);
      expect(riskScore).toBeLessThanOrEqual(100);
    });

    it('should calculate confidence level correctly', () => {
      const highConfidenceEvents = [
        { confidence: 'high' },
        { confidence: 'high' }
      ];
      expect(timelineSimulator.calculateConfidence(highConfidenceEvents)).toBe('high');

      const mixedConfidenceEvents = [
        { confidence: 'high' },
        { confidence: 'low' }
      ];
      expect(timelineSimulator.calculateConfidence(mixedConfidenceEvents)).toBe('medium');

      const lowConfidenceEvents = [
        { confidence: 'low' },
        { confidence: 'low' }
      ];
      expect(timelineSimulator.calculateConfidence(lowConfidenceEvents)).toBe('low');
    });

    it('should handle empty events array', () => {
      expect(timelineSimulator.calculateRiskScore([])).toBe(0);
      expect(timelineSimulator.calculateConfidence([])).toBe('high');
    });
  });

  describe('Utility Methods', () => {
    it('should add years to date correctly', () => {
      const date = new Date('2024-06-15T00:00:00.000Z'); // Use mid-month to avoid edge cases
      const newDate = timelineSimulator.addYears(date, 5);
      // Check that 5 years were actually added
      expect(newDate.getFullYear()).toBe(date.getFullYear() + 5);
      expect(newDate.getMonth()).toBe(date.getMonth()); // June
      expect(newDate.getDate()).toBe(date.getDate()); // 15
    });

    it('should add months to date correctly', () => {
      const date = new Date('2024-01-01');
      const newDate = timelineSimulator.addMonths(date, 6);
      expect(newDate.getMonth()).toBe(6); // July
      expect(newDate.getFullYear()).toBe(2024);
    });

    it('should calculate months between dates correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2026-01-01');
      const months = timelineSimulator.getMonthsBetween(startDate, endDate);
      expect(months).toBe(24);
    });
  });

  describe('Scenario Management', () => {
    it('should get all scenarios', async () => {
      await timelineSimulator.createScenario({ name: 'Scenario 1' });
      await timelineSimulator.createScenario({ name: 'Scenario 2' });

      const scenarios = timelineSimulator.getAllScenarios();
      expect(scenarios).toHaveLength(2);
      expect(scenarios.map(s => s.name)).toContain('Scenario 1');
      expect(scenarios.map(s => s.name)).toContain('Scenario 2');
    });

    it('should get specific scenario', async () => {
      const scenarioId = await timelineSimulator.createScenario({ name: 'Test Scenario' });
      const scenario = timelineSimulator.getScenario(scenarioId);

      expect(scenario.name).toBe('Test Scenario');
    });

    it('should return null for non-existent scenario', () => {
      const scenario = timelineSimulator.getScenario('non-existent');
      expect(scenario).toBeNull();
    });

    it('should delete scenario', async () => {
      const scenarioId = await timelineSimulator.createScenario({ name: 'To Delete' });
      
      expect(timelineSimulator.getScenario(scenarioId)).toBeDefined();
      
      await timelineSimulator.deleteScenario(scenarioId);
      
      expect(timelineSimulator.getScenario(scenarioId)).toBeNull();
      expect(executionLogService.log).toHaveBeenCalledWith(
        'timeline.scenario.deleted',
        { scenarioId }
      );
    });

    it('should handle deleting non-existent scenario', async () => {
      await timelineSimulator.deleteScenario('non-existent');
      // Should not throw error, just log
      expect(executionLogService.log).not.toHaveBeenCalled();
    });
  });
}); 