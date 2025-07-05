/**
 * Manual mock for ExecutionLogService
 * This ensures Vitest can properly mock the service
 * 
 * Purpose: Provides mock execution logging functionality for testing
 * Procedure: Exports mock functions that simulate the real service behavior
 * Conclusion: Enables testing without actual database or encryption dependencies
 */

import { vi } from 'vitest';

const mockLog = () => Promise.resolve({ id: 'test-log-id' });
const mockLogError = () => Promise.resolve({ id: 'test-error-id' });

const mockService = {
  log: vi.fn(),
  logError: vi.fn(),
  logPortfolioAnalysis: vi.fn(),
  logSimulationRun: vi.fn(),
  logBudgetForecast: vi.fn(),
  logRuleTriggered: vi.fn(),
  queryLogs: vi.fn(),
  getSessionLogs: vi.fn(),
  getComponentLogs: vi.fn(),
  getPerformanceLogs: vi.fn(),
  clearOldLogs: vi.fn(),
  exportLogs: vi.fn(),
  decryptPayload: vi.fn(),
  generateId: vi.fn(),
  generateSessionId: vi.fn(),
  getUserId: vi.fn(),
  initDatabase: vi.fn(),
  initEncryption: vi.fn(),
  encryptPayload: vi.fn(),
  storeLog: () => Promise.resolve()
};

export default mockService;
export { mockService }; 