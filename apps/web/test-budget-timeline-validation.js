/**
 * BudgetService & TimelineSimulator Integration Validation Test
 * AlphaFrame VX.1 End-to-End Testing
 * 
 * Purpose: Rigorously test budget setup, tracking, timeline simulation,
 * and scenario modeling with complex life events.
 * 
 * Procedure:
 * 1. Test budget creation and category management
 * 2. Validate budget calculations and forecasting
 * 3. Test timeline simulation with multiple scenarios
 * 4. Validate scenario impact modeling
 * 5. Test edge cases and stress conditions
 * 
 * Conclusion: Ensures accurate financial planning
 * and scenario modeling for production use.
 */

import { BudgetService } from './src/features/pro/services/BudgetService.js';
import { TimelineSimulator } from './src/features/pro/services/TimelineSimulator.js';
import { useFinancialStateStore } from './src/core/store/financialStateStore.js';

/**
 * Budget & Timeline Validation Test Suite
 */
class BudgetTimelineValidationTest {
  constructor() {
    this.testResults = [];
    this.currentTest = '';
    this.budgetService = new BudgetService();
    this.timelineSimulator = new TimelineSimulator();
    this.testData = {
      budgets: [],
      scenarios: [],
      projections: []
    };
  }

  /**
   * Log test result
   */
  logResult(testName, passed, details = '') {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`[${passed ? '✅' : '❌'}] ${testName}: ${details}`);
  }

  /**
   * Test 1: Budget Service Initialization
   */
  async testBudgetServiceInitialization() {
    this.currentTest = 'Budget Service Initialization';
    
    try {
      // Test service initialization
      const isInitialized = this.budgetService && typeof this.budgetService.createBudget === 'function';
      this.logResult(this.currentTest, isInitialized, 
        isInitialized ? 'Budget service initialized successfully' : 'Budget service initialization failed');
      
      // Test service methods
      const hasRequiredMethods = [
        'createBudget',
        'updateBudget',
        'getBudgets',
        'calculateSpending',
        'forecastBudget'
      ].every(method => typeof this.budgetService[method] === 'function');
      
      this.logResult('Budget Service Methods', hasRequiredMethods, 
        hasRequiredMethods ? 'All required methods available' : 'Missing required methods');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Initialization failed: ${error.message}`);
    }
  }

  /**
   * Test 2: Budget Creation and Category Management
   */
  async testBudgetCreation() {
    this.currentTest = 'Budget Creation and Category Management';
    
    try {
      // Create test budgets
      const testBudgets = [
        {
          id: 'budget_1',
          name: 'Monthly Budget',
          categories: [
            { name: 'Food & Dining', limit: 500, spent: 0 },
            { name: 'Transportation', limit: 300, spent: 0 },
            { name: 'Entertainment', limit: 200, spent: 0 },
            { name: 'Utilities', limit: 150, spent: 0 }
          ],
          period: 'monthly',
          startDate: new Date().toISOString()
        },
        {
          id: 'budget_2',
          name: 'Annual Budget',
          categories: [
            { name: 'Travel', limit: 5000, spent: 0 },
            { name: 'Home Improvement', limit: 3000, spent: 0 },
            { name: 'Emergency Fund', limit: 10000, spent: 0 }
          ],
          period: 'annual',
          startDate: new Date().toISOString()
        }
      ];
      
      // Test budget creation
      for (const budget of testBudgets) {
        const createdBudget = await this.budgetService.createBudget(budget);
        this.testData.budgets.push(createdBudget);
      }
      
      this.logResult(this.currentTest, this.testData.budgets.length === testBudgets.length, 
        `Created ${this.testData.budgets.length} budgets successfully`);
      
      // Test category validation
      const validCategories = this.testData.budgets.every(budget => 
        budget.categories && budget.categories.length > 0 &&
        budget.categories.every(cat => cat.name && typeof cat.limit === 'number')
      );
      
      this.logResult('Category Validation', validCategories, 
        validCategories ? 'All categories valid' : 'Invalid category structure');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Budget creation failed: ${error.message}`);
    }
  }

  /**
   * Test 3: Budget Calculations and Forecasting
   */
  async testBudgetCalculations() {
    this.currentTest = 'Budget Calculations and Forecasting';
    
    try {
      // Test spending calculations
      const testTransactions = [
        { amount: -50, category: 'Food & Dining', date: new Date().toISOString() },
        { amount: -25, category: 'Transportation', date: new Date().toISOString() },
        { amount: -100, category: 'Entertainment', date: new Date().toISOString() }
      ];
      
      // Update budget with spending
      const updatedBudget = await this.budgetService.updateBudgetSpending(
        this.testData.budgets[0].id,
        testTransactions
      );
      
      this.logResult(this.currentTest, !!updatedBudget, 
        updatedBudget ? 'Budget spending updated successfully' : 'Budget spending update failed');
      
      // Test total spending calculation
      const totalSpent = updatedBudget.categories.reduce((sum, cat) => sum + cat.spent, 0);
      const expectedSpent = 175; // 50 + 25 + 100
      
      this.logResult('Total Spending Calculation', totalSpent === expectedSpent, 
        `Total spent: $${totalSpent}, Expected: $${expectedSpent}`);
      
      // Test budget forecasting
      const forecast = await this.budgetService.forecastBudget(updatedBudget.id, 6); // 6 months
      
      this.logResult('Budget Forecasting', !!forecast && forecast.length === 6, 
        forecast ? `Generated ${forecast.length} month forecast` : 'Forecast generation failed');
      
      // Test surplus/deficit calculation
      const totalLimit = updatedBudget.categories.reduce((sum, cat) => sum + cat.limit, 0);
      const surplus = totalLimit - totalSpent;
      
      this.logResult('Surplus Calculation', surplus > 0, 
        `Budget surplus: $${surplus.toFixed(2)}`);
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Budget calculations failed: ${error.message}`);
    }
  }

  /**
   * Test 4: Timeline Simulator Initialization
   */
  async testTimelineSimulatorInitialization() {
    this.currentTest = 'Timeline Simulator Initialization';
    
    try {
      // Test simulator initialization
      const isInitialized = this.timelineSimulator && typeof this.timelineSimulator.createScenario === 'function';
      this.logResult(this.currentTest, isInitialized, 
        isInitialized ? 'Timeline simulator initialized successfully' : 'Timeline simulator initialization failed');
      
      // Test simulator methods
      const hasRequiredMethods = [
        'createScenario',
        'runSimulation',
        'getProjections',
        'analyzeImpact'
      ].every(method => typeof this.timelineSimulator[method] === 'function');
      
      this.logResult('Timeline Simulator Methods', hasRequiredMethods, 
        hasRequiredMethods ? 'All required methods available' : 'Missing required methods');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Initialization failed: ${error.message}`);
    }
  }

  /**
   * Test 5: Life Event Scenario Creation
   */
  async testLifeEventScenarios() {
    this.currentTest = 'Life Event Scenario Creation';
    
    try {
      // Create 5 distinct life events
      const lifeEvents = [
        {
          id: 'scenario_1',
          name: 'Job Loss',
          type: 'income_reduction',
          impact: {
            monthlyIncome: -3000,
            duration: 6, // months
            probability: 0.05
          },
          startDate: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000).toISOString() // 3 months from now
        },
        {
          id: 'scenario_2',
          name: 'Home Purchase',
          type: 'large_expense',
          impact: {
            oneTimeCost: -50000,
            monthlyExpense: 500, // mortgage
            duration: 360 // months (30 years)
          },
          startDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString() // 6 months from now
        },
        {
          id: 'scenario_3',
          name: 'Education Expenses',
          type: 'periodic_expense',
          impact: {
            annualCost: -15000,
            duration: 4 // years
          },
          startDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString() // 12 months from now
        },
        {
          id: 'scenario_4',
          name: 'Medical Emergency',
          type: 'unexpected_expense',
          impact: {
            oneTimeCost: -25000,
            monthlyExpense: 200, // ongoing medical costs
            duration: 24 // months
          },
          startDate: new Date(Date.now() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString() // 2 months from now
        },
        {
          id: 'scenario_5',
          name: 'Large Inheritance',
          type: 'windfall',
          impact: {
            oneTimeIncome: 100000,
            monthlyIncome: 500, // investment returns
            duration: 120 // months (10 years)
          },
          startDate: new Date(Date.now() + 1 * 30 * 24 * 60 * 60 * 1000).toISOString() // 1 month from now
        }
      ];
      
      // Create scenarios
      for (const event of lifeEvents) {
        const scenario = await this.timelineSimulator.createScenario(event);
        this.testData.scenarios.push(scenario);
      }
      
      this.logResult(this.currentTest, this.testData.scenarios.length === lifeEvents.length, 
        `Created ${this.testData.scenarios.length} life event scenarios`);
      
      // Test scenario validation
      const validScenarios = this.testData.scenarios.every(scenario => 
        scenario.id && scenario.name && scenario.impact && scenario.startDate
      );
      
      this.logResult('Scenario Validation', validScenarios, 
        validScenarios ? 'All scenarios valid' : 'Invalid scenario structure');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Scenario creation failed: ${error.message}`);
    }
  }

  /**
   * Test 6: Timeline Simulation and Projections
   */
  async testTimelineSimulation() {
    this.currentTest = 'Timeline Simulation and Projections';
    
    try {
      // Run simulation with all scenarios
      const simulation = await this.timelineSimulator.runSimulation({
        scenarios: this.testData.scenarios,
        duration: 60, // 5 years
        initialBalance: 25000,
        monthlyIncome: 5000,
        monthlyExpenses: 3000
      });
      
      this.logResult(this.currentTest, !!simulation, 
        simulation ? 'Timeline simulation completed successfully' : 'Simulation failed');
      
      // Test projection data
      const projections = simulation.projections;
      this.logResult('Projection Generation', projections && projections.length === 60, 
        projections ? `Generated ${projections.length} monthly projections` : 'Projection generation failed');
      
      // Test cash flow calculations
      const cashFlows = projections.map(p => p.cashFlow);
      const hasVariation = Math.max(...cashFlows) !== Math.min(...cashFlows);
      
      this.logResult('Cash Flow Variation', hasVariation, 
        hasVariation ? 'Cash flows vary as expected' : 'Cash flows are static');
      
      // Test net worth tracking
      const netWorths = projections.map(p => p.netWorth);
      const isMonotonic = netWorths.every((nw, i) => i === 0 || nw >= netWorths[i - 1] - 1000); // Allow some variation
      
      this.logResult('Net Worth Tracking', isMonotonic, 
        isMonotonic ? 'Net worth tracking consistent' : 'Net worth tracking inconsistent');
      
      this.testData.projections = projections;
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Timeline simulation failed: ${error.message}`);
    }
  }

  /**
   * Test 7: Scenario Impact Analysis
   */
  async testScenarioImpactAnalysis() {
    this.currentTest = 'Scenario Impact Analysis';
    
    try {
      // Analyze impact of each scenario
      const impactAnalysis = await this.timelineSimulator.analyzeImpact(
        this.testData.scenarios,
        this.testData.projections
      );
      
      this.logResult(this.currentTest, !!impactAnalysis, 
        impactAnalysis ? 'Impact analysis completed' : 'Impact analysis failed');
      
      // Test impact metrics
      const hasImpactMetrics = impactAnalysis.every(analysis => 
        analysis.scenarioId && 
        typeof analysis.totalImpact === 'number' &&
        typeof analysis.monthlyImpact === 'number'
      );
      
      this.logResult('Impact Metrics', hasImpactMetrics, 
        hasImpactMetrics ? 'All impact metrics calculated' : 'Missing impact metrics');
      
      // Test scenario ranking
      const rankedScenarios = impactAnalysis.sort((a, b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact));
      const hasRanking = rankedScenarios.length === this.testData.scenarios.length;
      
      this.logResult('Scenario Ranking', hasRanking, 
        hasRanking ? 'Scenarios ranked by impact' : 'Scenario ranking failed');
      
      // Test extreme impact detection
      const extremeImpacts = impactAnalysis.filter(analysis => Math.abs(analysis.totalImpact) > 50000);
      this.logResult('Extreme Impact Detection', extremeImpacts.length > 0, 
        `Detected ${extremeImpacts.length} scenarios with extreme impact`);
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Impact analysis failed: ${error.message}`);
    }
  }

  /**
   * Test 8: Edge Cases and Stress Testing
   */
  async testEdgeCasesAndStressTesting() {
    this.currentTest = 'Edge Cases and Stress Testing';
    
    try {
      // Test negative cash flow scenario
      const negativeCashFlowScenario = {
        id: 'stress_test_1',
        name: 'Negative Cash Flow Test',
        type: 'stress_test',
        impact: {
          monthlyIncome: -2000,
          monthlyExpense: 1000,
          duration: 12
        }
      };
      
      const negativeSimulation = await this.timelineSimulator.runSimulation({
        scenarios: [negativeCashFlowScenario],
        duration: 12,
        initialBalance: 5000,
        monthlyIncome: 3000,
        monthlyExpenses: 6000
      });
      
      this.logResult('Negative Cash Flow Handling', !!negativeSimulation, 
        negativeSimulation ? 'Negative cash flow handled' : 'Negative cash flow failed');
      
      // Test high debt load scenario
      const highDebtScenario = {
        id: 'stress_test_2',
        name: 'High Debt Load Test',
        type: 'stress_test',
        impact: {
          oneTimeCost: -100000,
          monthlyExpense: 2000, // debt payments
          duration: 60
        }
      };
      
      const highDebtSimulation = await this.timelineSimulator.runSimulation({
        scenarios: [highDebtScenario],
        duration: 60,
        initialBalance: 10000,
        monthlyIncome: 8000,
        monthlyExpenses: 4000
      });
      
      this.logResult('High Debt Load Handling', !!highDebtSimulation, 
        highDebtSimulation ? 'High debt load handled' : 'High debt load failed');
      
      // Test multiple concurrent scenarios
      const concurrentScenarios = this.testData.scenarios.slice(0, 3); // First 3 scenarios
      const concurrentSimulation = await this.timelineSimulator.runSimulation({
        scenarios: concurrentScenarios,
        duration: 24,
        initialBalance: 50000,
        monthlyIncome: 10000,
        monthlyExpenses: 5000
      });
      
      this.logResult('Concurrent Scenarios', !!concurrentSimulation, 
        concurrentSimulation ? 'Concurrent scenarios handled' : 'Concurrent scenarios failed');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Edge case testing failed: ${error.message}`);
    }
  }

  /**
   * Test 9: Data Persistence and State Management
   */
  async testDataPersistence() {
    this.currentTest = 'Data Persistence and State Management';
    
    try {
      // Test budget persistence
      const savedBudgets = await this.budgetService.getBudgets();
      this.logResult('Budget Persistence', savedBudgets.length >= this.testData.budgets.length, 
        `Saved ${savedBudgets.length} budgets`);
      
      // Test scenario persistence
      const savedScenarios = await this.timelineSimulator.getScenarios();
      this.logResult('Scenario Persistence', savedScenarios.length >= this.testData.scenarios.length, 
        `Saved ${savedScenarios.length} scenarios`);
      
      // Test state management integration
      const financialStore = useFinancialStateStore.getState();
      const hasStoreIntegration = financialStore && typeof financialStore.budgets === 'object';
      
      this.logResult('State Management Integration', hasStoreIntegration, 
        hasStoreIntegration ? 'State management integrated' : 'State management not integrated');
      
    } catch (error) {
      this.logResult(this.currentTest, false, `Data persistence failed: ${error.message}`);
    }
  }

  /**
   * Run all budget and timeline tests
   */
  async runAllTests() {
    console.log('🚀 Starting AlphaFrame VX.1 Budget & Timeline Validation Tests\n');
    
    await this.testBudgetServiceInitialization();
    await this.testBudgetCreation();
    await this.testBudgetCalculations();
    await this.testTimelineSimulatorInitialization();
    await this.testLifeEventScenarios();
    await this.testTimelineSimulation();
    await this.testScenarioImpactAnalysis();
    await this.testEdgeCasesAndStressTesting();
    await this.testDataPersistence();
    
    // Generate test summary
    const passedTests = this.testResults.filter(r => r.passed).length;
    const totalTests = this.testResults.length;
    const successRate = (passedTests / totalTests * 100).toFixed(1);
    
    console.log('\n📊 Budget & Timeline Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests} (${successRate}%)`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    
    // Return test results
    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: totalTests - passedTests,
        successRate: parseFloat(successRate)
      },
      results: this.testResults,
      testData: {
        budgetsCount: this.testData.budgets.length,
        scenariosCount: this.testData.scenarios.length,
        projectionsCount: this.testData.projections.length
      }
    };
  }
}

// Export for use in other test modules
export default BudgetTimelineValidationTest;

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const budgetTimelineTest = new BudgetTimelineValidationTest();
  budgetTimelineTest.runAllTests().then(results => {
    console.log('\n🎯 Budget & Timeline Validation Complete');
    console.log('Results:', JSON.stringify(results, null, 2));
  });
} 