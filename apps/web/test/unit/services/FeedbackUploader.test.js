/**
 * FeedbackUploader.test.js
 *
 * Purpose: Comprehensive unit tests for the FeedbackUploader service to ensure
 * all snapshot generation, encryption, export, and data sanitization functionality
 * works correctly with proper error handling and privacy controls.
 *
 * Fixes Applied:
 * - Proper afterEach cleanup with vi.clearAllMocks()
 * - Added proper mock isolation
 * - Comments added for clarity
 */

// Mock dependencies with proper manual mocks that match the actual imports
const mockCryptoService = {
  encrypt: vi.fn(),
  decrypt: vi.fn()
};

const mockExecutionLogService = {
  getLogs: vi.fn(),
  log: vi.fn(),
  logError: vi.fn().mockImplementation(() => Promise.resolve()),
  queryLogs: vi.fn(),
  getSessionLogs: vi.fn(),
  getComponentLogs: vi.fn(),
  getPerformanceLogs: vi.fn(),
  clearOldLogs: vi.fn(),
  exportLogs: vi.fn(),
  decryptPayload: vi.fn()
};

const mockBudgetService = {
  getBudgetSummary: vi.fn()
};

const mockCashFlowService = {
  getCashFlowSummary: vi.fn()
};

const mockPortfolioAnalyzer = {
  analyzePortfolio: vi.fn()
};

vi.mock('../../../src/core/services/CryptoService.js', () => ({
  __esModule: true,
  default: mockCryptoService
}));

vi.mock('../../../src/core/services/ExecutionLogService.js', () => ({
  __esModule: true,
  default: mockExecutionLogService
}));

vi.mock('../../../src/features/pro/services/BudgetService.js', () => ({
  __esModule: true,
  default: mockBudgetService
}));

vi.mock('../../../src/features/pro/services/CashFlowService.js', () => ({
  __esModule: true,
  default: mockCashFlowService
}));

vi.mock('../../../src/features/pro/services/PortfolioAnalyzer.js', () => ({
  __esModule: true,
  default: mockPortfolioAnalyzer
}));

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('FeedbackUploader', () => {
  let feedbackUploader;
  let executionLogService;
  let budgetService;
  let cashFlowService;

  beforeEach(async () => {
    // Import after mocks are set up
    const { FeedbackUploader } = await import('../../../src/lib/services/FeedbackUploader.js');
    executionLogService = (await import('../../../src/core/services/ExecutionLogService.js')).default;
    budgetService = (await import('../../../src/features/pro/services/BudgetService.js')).default;
    cashFlowService = (await import('../../../src/features/pro/services/CashFlowService.js')).default;
    // Direct override of singleton methods
    executionLogService.logError = vi.fn().mockResolvedValue(true);
    executionLogService.log = vi.fn().mockResolvedValue({ id: 'mock-log-id' });
    executionLogService.getLogs = vi.fn().mockResolvedValue([
      { type: 'test.log', timestamp: new Date().toISOString(), payload: { test: 'data' } }
    ]);
    budgetService.getBudgetSummary = vi.fn().mockReturnValue({
      totalBudget: 5000,
      categories: 5,
      monthlyIncome: 6000
    });
    cashFlowService.getCashFlowSummary = vi.fn().mockReturnValue({
      netCashFlow: 1000,
      income: 6000,
      expenses: 5000
    });
    feedbackUploader = new FeedbackUploader();
    
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => {
          const defaults = {
            dashboardMode: 'PLANNER',
            theme: 'light',
            language: 'en',
            notifications: 'true',
            dataSchemaVersion: '1'
          };
          return defaults[key] || null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn()
      },
      writable: true
    });

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn();
    global.URL.revokeObjectURL = vi.fn();

    // Mock document methods
    document.createElement = vi.fn(() => ({
      href: '',
      download: '',
      click: vi.fn()
    }));
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();

    // Import and mock cryptoService singleton
    const cryptoService = (await import('../../../src/core/services/CryptoService.js')).default;
    cryptoService.encrypt = vi.fn().mockResolvedValue('encrypted-data');
    cryptoService.decrypt = vi.fn().mockResolvedValue('mock-decrypted');
    
    // Additional mock patches for complete alignment
    mockPortfolioAnalyzer.analyzePortfolio.mockResolvedValue({
      score: 88,
      recommendations: ['Rebalance to 70/30']
    });
    
    // Ensure all async mocks return promises
    mockBudgetService.getBudgetSummary.mockImplementation(() => ({
      totalBudget: 5000,
      categories: 5,
      monthlyIncome: 6000
    }));
    mockCashFlowService.getCashFlowSummary.mockImplementation(() => ({
      netCashFlow: 1000,
      income: 6000,
      expenses: 5000
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Snapshot Generation', () => {
    it('should generate snapshot with all data types', async () => {
      const options = {
        category: 'bug_report',
        feedback: 'Test feedback',
        includedData: {
          execution_logs: true,
          financial_summary: true,
          ui_preferences: true,
          error_logs: true,
          performance_metrics: true
        },
        timestamp: new Date().toISOString()
      };

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(true);
      expect(snapshot.data).toBe('encrypted-data');
      expect(snapshot.metadata.version).toBe('1.0');
      expect(executionLogService.log).toHaveBeenCalledWith('feedback.snapshot.generated', expect.any(Object));
    });

    it('should generate snapshot with selected data types only', async () => {
      const options = {
        category: 'feature_request',
        feedback: 'Feature request',
        includedData: {
          execution_logs: true,
          financial_summary: false,
          ui_preferences: true,
          error_logs: false,
          performance_metrics: false
        },
        timestamp: new Date().toISOString()
      };

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(true);
      expect(executionLogService.getLogs).toHaveBeenCalledTimes(1); // Only execution_logs
    });

    it('should handle encryption failure gracefully', async () => {
      const options = {
        category: 'general',
        feedback: 'Test feedback',
        includedData: { execution_logs: true },
        timestamp: new Date().toISOString()
      };

      executionLogService.getLogs.mockResolvedValue([]);
      
      // Override cryptoService to simulate encryption failure
      const cryptoService = (await import('../../../src/core/services/CryptoService.js')).default;
      cryptoService.encrypt = vi.fn().mockRejectedValue(new Error('Encryption failed'));

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(false);
      expect(snapshot.data).toHaveProperty('version');
      expect(snapshot.data).toHaveProperty('category', 'general');
    });

    it('should handle missing required fields', async () => {
      const options = {
        category: '',
        feedback: '',
        includedData: {},
        timestamp: new Date().toISOString()
      };

      mockCryptoService.encrypt.mockResolvedValue('encrypted-data');

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(true);
      expect(snapshot.data).toBe('encrypted-data');
      expect(snapshot.metadata.version).toBe('1.0');
    });
  });

  describe('Export Functionality', () => {
    it('should export snapshot as file', async () => {
      const snapshotData = {
        encrypted: true,
        data: 'test-data',
        metadata: { version: '1.0' }
      };

      const result = await feedbackUploader.exportSnapshot(snapshotData, 'file');

      expect(result.success).toBe(true);
      expect(result.format).toBe('file');
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(executionLogService.log).toHaveBeenCalledWith('feedback.snapshot.exported', expect.any(Object));
    });

    it('should export snapshot to clipboard', async () => {
      const snapshotData = {
        encrypted: true,
        data: 'test-data',
        metadata: { version: '1.0' }
      };

      navigator.clipboard.writeText.mockResolvedValue();

      const result = await feedbackUploader.exportSnapshot(snapshotData, 'clipboard');

      expect(result.success).toBe(true);
      expect(result.format).toBe('clipboard');
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('should handle export errors', async () => {
      const snapshotData = { test: 'data' };
      
      // Mock file download failure
      document.createElement.mockImplementation(() => {
        throw new Error('DOM error');
      });

      await expect(feedbackUploader.exportSnapshot(snapshotData, 'file'))
        .rejects.toThrow('Failed to export snapshot in file format');

      expect(executionLogService.logError).toHaveBeenCalled();
    });
  });

  describe('Data Sanitization', () => {
    it('should sanitize logs to remove sensitive information', () => {
      const logs = [
        {
          type: 'user.login',
          timestamp: new Date().toISOString(),
          payload: {
            email: 'user@example.com',
            password: 'secret123',
            token: 'jwt-token',
            accountNumber: '1234567890',
            message: 'Login successful'
          }
        }
      ];

      const sanitized = feedbackUploader.sanitizeLogs(logs);

      expect(sanitized[0].payload.email).toBe('[REDACTED]');
      expect(sanitized[0].payload.password).toBe('[REDACTED]');
      expect(sanitized[0].payload.token).toBe('[REDACTED]');
      expect(sanitized[0].payload.accountNumber).toBe('[REDACTED]');
      expect(sanitized[0].payload.message).toBe('Login successful');
    });

    it('should sanitize payload with various sensitive field names', () => {
      const payload = {
        userEmail: 'test@example.com',
        bankAccount: '1234567890',
        creditCard: '4111111111111111',
        personalInfo: 'sensitive',
        normalField: 'safe data',
        privateKey: 'secret-key'
      };

      const sanitized = feedbackUploader.sanitizePayload(payload);

      expect(sanitized.userEmail).toBe('[REDACTED]');
      expect(sanitized.bankAccount).toBe('[REDACTED]');
      expect(sanitized.creditCard).toBe('[REDACTED]');
      expect(sanitized.personalInfo).toBe('[REDACTED]');
      expect(sanitized.normalField).toBe('safe data');
      expect(sanitized.privateKey).toBe('[REDACTED]');
    });

    it('should handle null or undefined payloads', () => {
      expect(feedbackUploader.sanitizePayload(null)).toBeNull();
      expect(feedbackUploader.sanitizePayload(undefined)).toBeNull();
    });
  });

  describe('Financial Summary Generation', () => {
    it('should generate financial summary without personal details', async () => {
      const summary = await feedbackUploader.generateFinancialSummary();
      
      expect(summary.budget.totalBudget).toBe(5000);
      expect(summary.budget.categories).toBe(5);
      expect(summary.cashFlow.netCashFlow).toBe(1000);
      expect(summary.summary.hasBudget).toBe(true);
      expect(summary.summary.hasCashFlow).toBe(true);
      expect(summary.summary.dataPoints).toBe(7); // 5 categories + 2
    });

    it('should handle missing financial data', async () => {
      // Override singletons for this specific test
      budgetService.getBudgetSummary = vi.fn().mockReturnValue({});
      cashFlowService.getCashFlowSummary = vi.fn().mockReturnValue({});

      const summary = await feedbackUploader.generateFinancialSummary();

      expect(summary.budget.totalBudget).toBeUndefined();
      expect(summary.summary.hasBudget).toBe(false);
      expect(summary.summary.hasCashFlow).toBe(false);
    });

    it('should handle service errors gracefully', async () => {
      // Override singletons for this specific test
      budgetService.getBudgetSummary = vi.fn().mockImplementation(() => {
        throw new Error('Service error');
      });

      const summary = await feedbackUploader.generateFinancialSummary();

      expect(summary.error).toBe('Unable to generate financial summary');
    });
  });

  describe('UI Preferences Collection', () => {
    it('should collect UI preferences from localStorage', () => {
      const mockLocalStorage = {
        dashboardMode: 'INVESTOR',
        theme: 'dark',
        language: 'es',
        notifications: 'true',
        dataSchemaVersion: '1'
      };

      Object.entries(mockLocalStorage).forEach(() => {
        localStorage.getItem.mockImplementation((item) => {
          return mockLocalStorage[item] || null;
        });
      });

      const preferences = feedbackUploader.collectUIPreferences();

      expect(preferences.dashboardMode).toBe('INVESTOR');
      expect(preferences.theme).toBe('dark');
      expect(preferences.language).toBe('es');
      expect(preferences.notifications).toBe(true);
      expect(preferences.dataSchemaVersion).toBe('1');
    });

    it('should handle localStorage errors', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const preferences = feedbackUploader.collectUIPreferences();

      expect(preferences.error).toBe('Unable to collect UI preferences');
    });
  });

  describe('Performance Metrics Collection', () => {
    it('should collect basic performance metrics', async () => {
      // Mock performance API
      Object.defineProperty(window, 'performance', {
        value: {
          memory: {
            usedJSHeapSize: 1000000,
            totalJSHeapSize: 2000000,
            jsHeapSizeLimit: 5000000
          },
          timing: {
            loadEventEnd: 1000,
            navigationStart: 100,
            domContentLoadedEventEnd: 500
          }
        },
        writable: true
      });

      const metrics = await feedbackUploader.collectPerformanceMetrics();

      expect(metrics.timestamp).toBeDefined();
      expect(metrics.userAgent).toBe(navigator.userAgent);
      expect(metrics.screenResolution).toBe(`${screen.width}x${screen.height}`);
      expect(metrics.performance.memory.used).toBe(1000000);
      expect(metrics.performance.timing.loadTime).toBe(900);
    });

    it('should handle missing performance APIs', async () => {
      Object.defineProperty(window, 'performance', {
        value: {},
        writable: true
      });

      const metrics = await feedbackUploader.collectPerformanceMetrics();

      expect(metrics.performance.memory).toBeNull();
      expect(metrics.performance.timing).toBeNull();
    });
  });

  describe('Snapshot Validation', () => {
    it('should validate correct snapshot data', () => {
      const validSnapshot = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        category: 'bug_report',
        feedback: 'Test feedback',
        metadata: {}
      };

      expect(feedbackUploader.validateSnapshot(validSnapshot)).toBe(true);
    });

    it('should reject invalid snapshot data', () => {
      expect(feedbackUploader.validateSnapshot(null)).toBe(false);
      expect(feedbackUploader.validateSnapshot({})).toBe(false);
      expect(feedbackUploader.validateSnapshot({ version: '1.0' })).toBe(false);
    });
  });

  describe('Snapshot Statistics', () => {
    it('should calculate snapshot statistics correctly', () => {
      const snapshotData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        category: 'test',
        feedback: 'Test feedback',
        metadata: {
          includedDataTypes: ['execution_logs', 'financial_summary']
        }
      };

      const stats = feedbackUploader.getSnapshotStats(snapshotData);

      expect(stats.size).toBeGreaterThan(0);
      expect(stats.sizeKB).toBeGreaterThan(0);
      expect(stats.dataTypes).toBe(2);
      expect(stats.timestamp).toBe(snapshotData.timestamp);
    });

    it('should handle statistics calculation errors', () => {
      const invalidSnapshot = null;
      const stats = feedbackUploader.getSnapshotStats(invalidSnapshot);

      expect(stats.error).toBe('Unable to calculate statistics');
    });
  });

  describe('Error Handling', () => {
    it('should handle snapshot generation errors', async () => {
      const options = {
        category: 'test',
        feedback: 'test',
        includedData: { execution_logs: true },
        timestamp: new Date().toISOString()
      };

      executionLogService.getLogs.mockRejectedValue(new Error('Service error'));

      await expect(feedbackUploader.generateSnapshot(options))
        .rejects.toThrow('Failed to generate feedback snapshot');

      expect(executionLogService.logError).toHaveBeenCalledWith(
        'feedback.snapshot.generation.failed',
        expect.any(Error),
        options
      );
    });

    it('should handle export errors', async () => {
      const snapshotData = { test: 'data' };
      
      // Mock file download failure
      document.createElement.mockImplementation(() => {
        throw new Error('DOM error');
      });

      await expect(feedbackUploader.exportSnapshot(snapshotData, 'file'))
        .rejects.toThrow('Failed to export snapshot in file format');
    });
  });
}); 