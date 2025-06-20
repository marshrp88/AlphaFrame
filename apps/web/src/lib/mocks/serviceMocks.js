/**
 * Centralized Mock Utilities for AlphaPro Services
 * 
 * This file provides standardized mocks and stubs for all AlphaPro services,
 * ensuring consistency across tests and reducing mock fragmentation.
 * 
 * Usage:
 * import { mockExecutionLogService, mockBudgetService } from '@/lib/mocks/serviceMocks';
 */

import { vi } from 'vitest';

// ============================================================================
// EXECUTION LOG SERVICE MOCKS
// ============================================================================

export const mockExecutionLogService = {
  log: vi.fn().mockResolvedValue({
    id: 'mock-log-id',
    timestamp: Date.now(),
    type: 'mock.event',
    payload: { data: 'mock' },
    severity: 'info',
    userId: 'mock-user',
    sessionId: 'mock-session',
    meta: { component: 'MockComponent', action: 'mockAction' }
  }),
  
  queryLogs: vi.fn().mockResolvedValue([
    {
      id: '1',
      type: 'rule.triggered',
      severity: 'info',
      timestamp: Date.now(),
      sessionId: 'session-123',
      meta: { component: 'RuleEngine' }
    }
  ]),
  
  exportLogs: vi.fn().mockResolvedValue({
    exportTime: Date.now(),
    sessionId: 'mock-session',
    userId: 'mock-user',
    logs: []
  }),
  
  clearOldLogs: vi.fn().mockResolvedValue(5),
  
  encryptPayload: vi.fn().mockResolvedValue('encrypted-data'),
  decryptPayload: vi.fn().mockResolvedValue({ test: 'data' }),
  
  // Convenience methods
  logRuleTriggered: vi.fn().mockResolvedValue({ type: 'rule.triggered' }),
  logSimulationRun: vi.fn().mockResolvedValue({ type: 'simulation.run' }),
  logBudgetForecast: vi.fn().mockResolvedValue({ type: 'budget.forecast.generated' }),
  logPortfolioAnalysis: vi.fn().mockResolvedValue({ type: 'portfolio.analysis.completed' }),
  logError: vi.fn().mockResolvedValue({ type: 'error.occurred' })
};

// ============================================================================
// BUDGET SERVICE MOCKS
// ============================================================================

export const mockBudgetService = {
  createBudget: vi.fn().mockResolvedValue({
    id: 'mock-budget-id',
    name: 'Mock Budget',
    categories: [],
    total: 1000,
    createdAt: Date.now()
  }),
  
  updateBudget: vi.fn().mockResolvedValue({
    id: 'mock-budget-id',
    name: 'Updated Budget',
    total: 1200
  }),
  
  getBudget: vi.fn().mockResolvedValue({
    id: 'mock-budget-id',
    name: 'Mock Budget',
    categories: [
      { name: 'Food', allocated: 300, spent: 250 },
      { name: 'Transport', allocated: 200, spent: 180 }
    ],
    total: 1000
  }),
  
  addExpense: vi.fn().mockResolvedValue({
    id: 'mock-expense-id',
    amount: 50,
    category: 'Food',
    date: Date.now()
  }),
  
  getBudgetAnalytics: vi.fn().mockResolvedValue({
    totalSpent: 430,
    remaining: 570,
    overspentCategories: [],
    underspentCategories: ['Transport']
  })
};

// ============================================================================
// CASH FLOW SERVICE MOCKS
// ============================================================================

export const mockCashFlowService = {
  calculateCashFlow: vi.fn().mockResolvedValue({
    income: 5000,
    expenses: 3500,
    netFlow: 1500,
    monthlyAverage: 1200
  }),
  
  forecastCashFlow: vi.fn().mockResolvedValue({
    nextMonth: 1600,
    nextQuarter: 4500,
    nextYear: 18000,
    confidence: 0.85
  }),
  
  getRecurringTransactions: vi.fn().mockResolvedValue([
    { type: 'income', amount: 5000, frequency: 'monthly', description: 'Salary' },
    { type: 'expense', amount: 1200, frequency: 'monthly', description: 'Rent' }
  ]),
  
  analyzeSpendingPatterns: vi.fn().mockResolvedValue({
    topCategories: ['Food', 'Transport', 'Entertainment'],
    seasonalTrends: { winter: 1.2, summer: 0.8 },
    recommendations: ['Reduce dining out', 'Consider carpooling']
  })
};

// ============================================================================
// PORTFOLIO ANALYZER MOCKS
// ============================================================================

export const mockPortfolioAnalyzer = {
  analyzePortfolio: vi.fn().mockResolvedValue({
    totalValue: 100000,
    allocation: {
      stocks: 60,
      bonds: 30,
      cash: 10
    },
    riskScore: 7.5,
    diversificationScore: 8.2,
    recommendations: ['Increase bond allocation', 'Add international exposure']
  }),
  
  calculateReturns: vi.fn().mockResolvedValue({
    totalReturn: 0.15,
    annualizedReturn: 0.12,
    volatility: 0.18,
    sharpeRatio: 0.67
  }),
  
  rebalancePortfolio: vi.fn().mockResolvedValue({
    trades: [
      { asset: 'VTI', action: 'buy', shares: 10 },
      { asset: 'BND', action: 'sell', shares: 5 }
    ],
    estimatedCost: 1500
  })
};

// ============================================================================
// NARRATIVE SERVICE MOCKS
// ============================================================================

export const mockNarrativeService = {
  generateInsight: vi.fn().mockResolvedValue({
    type: 'spending_alert',
    title: 'Unusual Spending Detected',
    description: 'Your dining expenses are 25% higher than usual this month.',
    severity: 'warning',
    actionable: true,
    recommendations: ['Review recent restaurant charges', 'Set dining budget limit']
  }),
  
  generateReport: vi.fn().mockResolvedValue({
    summary: 'Your financial health is improving with consistent savings.',
    insights: [
      'Savings rate increased by 15%',
      'Investment returns outperformed benchmark',
      'Emergency fund is well-funded'
    ],
    nextSteps: ['Consider increasing 401k contribution', 'Review insurance coverage']
  }),
  
  analyzeTrends: vi.fn().mockResolvedValue({
    trends: [
      { metric: 'savings_rate', direction: 'up', change: 0.15 },
      { metric: 'debt_to_income', direction: 'down', change: -0.08 }
    ],
    predictions: [
      'Savings will reach $50k by year-end',
      'Debt-free status achievable in 18 months'
    ]
  })
};

// ============================================================================
// CRYPTO SERVICE MOCKS
// ============================================================================

export const mockCryptoService = {
  encrypt: vi.fn().mockResolvedValue('encrypted-data'),
  decrypt: vi.fn().mockResolvedValue('decrypted-data'),
  generateSalt: vi.fn().mockResolvedValue('mock-salt'),
  deriveKey: vi.fn().mockResolvedValue('derived-key'),
  hash: vi.fn().mockResolvedValue('hashed-data')
};

// ============================================================================
// STORE MOCKS
// ============================================================================

export const mockFinancialStateStore = {
  getState: vi.fn().mockReturnValue({
    portfolios: [],
    budgets: [],
    transactions: [],
    goals: []
  }),
  
  setState: vi.fn(),
  
  subscribe: vi.fn().mockReturnValue(() => {}),
  
  // Actions
  addTransaction: vi.fn(),
  updatePortfolio: vi.fn(),
  setBudget: vi.fn(),
  addGoal: vi.fn()
};

export const mockUIStore = {
  getState: vi.fn().mockReturnValue({
    theme: 'light',
    sidebarOpen: false,
    notifications: [],
    loading: false
  }),
  
  setState: vi.fn(),
  
  subscribe: vi.fn().mockReturnValue(() => {}),
  
  // Actions
  setTheme: vi.fn(),
  toggleSidebar: vi.fn(),
  addNotification: vi.fn(),
  setLoading: vi.fn()
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Reset all mocks to their initial state
 */
export const resetAllMocks = () => {
  Object.values(mockExecutionLogService).forEach(mock => mock.mockClear());
  Object.values(mockBudgetService).forEach(mock => mock.mockClear());
  Object.values(mockCashFlowService).forEach(mock => mock.mockClear());
  Object.values(mockPortfolioAnalyzer).forEach(mock => mock.mockClear());
  Object.values(mockNarrativeService).forEach(mock => mock.mockClear());
  Object.values(mockCryptoService).forEach(mock => mock.mockClear());
  Object.values(mockFinancialStateStore).forEach(mock => mock.mockClear());
  Object.values(mockUIStore).forEach(mock => mock.mockClear());
};

/**
 * Create a mock error response
 */
export const createMockError = (message = 'Mock error', code = 'MOCK_ERROR') => ({
  error: true,
  message,
  code,
  timestamp: Date.now()
});

/**
 * Create a mock success response
 */
export const createMockSuccess = (data, message = 'Success') => ({
  success: true,
  data,
  message,
  timestamp: Date.now()
});

// ============================================================================
// TEST DATA GENERATORS
// ============================================================================

export const generateMockTransaction = (overrides = {}) => ({
  id: `txn-${Date.now()}`,
  amount: 100,
  category: 'Food',
  description: 'Grocery shopping',
  date: Date.now(),
  type: 'expense',
  ...overrides
});

export const generateMockPortfolio = (overrides = {}) => ({
  id: `portfolio-${Date.now()}`,
  name: 'My Portfolio',
  totalValue: 100000,
  assets: [
    { symbol: 'VTI', shares: 100, value: 25000 },
    { symbol: 'BND', shares: 200, value: 20000 }
  ],
  ...overrides
});

export const generateMockBudget = (overrides = {}) => ({
  id: `budget-${Date.now()}`,
  name: 'Monthly Budget',
  total: 5000,
  categories: [
    { name: 'Food', allocated: 800, spent: 600 },
    { name: 'Transport', allocated: 500, spent: 450 }
  ],
  ...overrides
});

// ============================================================================
// EXPORT ALL MOCKS
// ============================================================================

export default {
  mockExecutionLogService,
  mockBudgetService,
  mockCashFlowService,
  mockPortfolioAnalyzer,
  mockNarrativeService,
  mockCryptoService,
  mockFinancialStateStore,
  mockUIStore,
  resetAllMocks,
  createMockError,
  createMockSuccess,
  generateMockTransaction,
  generateMockPortfolio,
  generateMockBudget
}; 
