/**
 * Manual mock for ExecutionLogService
 * This ensures Jest can properly mock the service
 */

const mockLog = jest.fn().mockResolvedValue({ id: 'test-log-id' });
const mockLogError = jest.fn().mockResolvedValue({ id: 'test-error-id' });

const mockService = {
  log: mockLog,
  logError: mockLogError,
  logPortfolioAnalysis: mockLog,
  logSimulationRun: mockLog,
  logBudgetForecast: mockLog,
  logRuleTriggered: mockLog,
  queryLogs: jest.fn().mockResolvedValue([]),
  getSessionLogs: jest.fn().mockResolvedValue([]),
  getComponentLogs: jest.fn().mockResolvedValue([]),
  getPerformanceLogs: jest.fn().mockResolvedValue([]),
  clearOldLogs: jest.fn().mockResolvedValue(0),
  exportLogs: jest.fn().mockResolvedValue({ logs: [] }),
  decryptPayload: jest.fn().mockResolvedValue({}),
  generateId: jest.fn(() => 'test-id'),
  generateSessionId: jest.fn(() => 'test-session'),
  getUserId: jest.fn(() => 'test-user'),
  initDatabase: jest.fn().mockResolvedValue(),
  initEncryption: jest.fn().mockResolvedValue(),
  encryptPayload: jest.fn().mockResolvedValue('encrypted-data'),
  storeLog: jest.fn().mockResolvedValue()
};

module.exports = {
  executionLogService: mockService,
  default: mockService
}; 