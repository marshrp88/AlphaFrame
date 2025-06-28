/**
 * FeedbackUploader.test.js
 *
 * Purpose: Comprehensive unit tests for the FeedbackUploader service to ensure
 * all snapshot generation, encryption, export, and data sanitization functionality
 * works correctly with proper error handling and privacy controls.
 *
 * Fixes Applied:
 * - Proper afterEach cleanup with jest.restoreAllMocks()
 * - Added proper mock isolation
 * - Comments added for clarity
 */

import { describe, it, expect, beforeEach, vi, afterEach } from '@jest/globals';
import { FeedbackUploader } from '../../../src/lib/services/FeedbackUploader.js';

// Mock dependencies
jest.mock('../../../src/core/services/CryptoService.js', () => ({
  default: {
    encrypt: jest.fn(),
    decrypt: jest.fn()
  }
}));

jest.mock('../../../src/core/services/ExecutionLogService.js', () => ({
  default: {
    getLogs: jest.fn(),
    log: jest.fn(),
    logError: jest.fn()
  }
}));

jest.mock('../../../src/features/pro/services/BudgetService.js', () => ({
  default: {
    getBudgetSummary: jest.fn()
  }
}));

jest.mock('../../../src/features/pro/services/CashFlowService.js', () => ({
  default: {
    getCashFlowSummary: jest.fn()
  }
}));

jest.mock('../../../src/features/pro/services/PortfolioAnalyzer.js', () => ({
  default: {
    analyzePortfolio: jest.fn()
  }
}));

describe('FeedbackUploader', () => {
  let feedbackUploader;
  let mockCryptoService;
  let mockExecutionLogService;
  let mockBudgetService;
  let mockCashFlowService;

  beforeEach(async () => {
    feedbackUploader = new FeedbackUploader();
    
    // Get mocked services
    mockCryptoService = (await import('../../../src/core/services/CryptoService.js')).default;
    mockExecutionLogService = (await import('../../../src/core/services/ExecutionLogService.js')).default;
    mockBudgetService = (await import('../../../src/features/pro/services/BudgetService.js')).default;
    mockCashFlowService = (await import('../../../src/features/pro/services/CashFlowService.js')).default;

    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn()
      },
      writable: true
    });

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    // Mock document methods
    document.createElement = jest.fn(() => ({
      href: '',
      download: '',
      click: jest.fn()
    }));
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

      // Mock service responses
      mockExecutionLogService.getLogs.mockResolvedValue([
        { type: 'test.log', timestamp: new Date().toISOString(), payload: { test: 'data' } }
      ]);
      mockBudgetService.getBudgetSummary.mockReturnValue({
        totalBudget: 5000,
        categories: 5,
        monthlyIncome: 6000
      });
      mockCashFlowService.getCashFlowSummary.mockReturnValue({
        netCashFlow: 1000,
        income: 6000,
        expenses: 5000
      });
      mockCryptoService.encrypt.mockResolvedValue('encrypted-data');

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(true);
      expect(snapshot.data).toBe('encrypted-data');
      expect(snapshot.metadata.version).toBe('1.0');
      expect(mockExecutionLogService.log).toHaveBeenCalledWith('feedback.snapshot.generated', expect.any(Object));
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

      mockExecutionLogService.getLogs.mockResolvedValue([]);
      mockCryptoService.encrypt.mockResolvedValue('encrypted-data');

      const snapshot = await feedbackUploader.generateSnapshot(options);

      expect(snapshot.encrypted).toBe(true);
      expect(mockExecutionLogService.getLogs).toHaveBeenCalledTimes(1); // Only execution_logs
    });

    it('should handle encryption failure gracefully', async () => {
      const options = {
        category: 'general',
        feedback: 'General feedback',
        includedData: { execution_logs: true },
        timestamp: new Date().toISOString()
      };

      mockExecutionLogService.getLogs.mockResolvedValue([]);
      mockCryptoService.encrypt.mockRejectedValue(new Error('Encryption failed'));

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
      expect(mockExecutionLogService.log).toHaveBeenCalledWith('feedback.snapshot.exported', expect.any(Object));
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
      
      // Mock clipboard failure
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

      await expect(feedbackUploader.exportSnapshot(snapshotData, 'clipboard'))
        .rejects.toThrow('Failed to export snapshot in clipboard format');

      expect(mockExecutionLogService.logError).toHaveBeenCalled();
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
      mockBudgetService.getBudgetSummary.mockReturnValue({
        totalBudget: 5000,
        categories: 5,
        monthlyIncome: 6000
      });
      mockCashFlowService.getCashFlowSummary.mockReturnValue({
        netCashFlow: 1000,
        income: 6000,
        expenses: 5000
      });

      const summary = await feedbackUploader.generateFinancialSummary();

      expect(summary.budget.totalBudget).toBe(5000);
      expect(summary.budget.categories).toBe(5);
      expect(summary.cashFlow.netCashFlow).toBe(1000);
      expect(summary.summary.hasBudget).toBe(true);
      expect(summary.summary.hasCashFlow).toBe(true);
      expect(summary.summary.dataPoints).toBe(7); // 5 categories + 2
    });

    it('should handle missing financial data', async () => {
      mockBudgetService.getBudgetSummary.mockReturnValue({});
      mockCashFlowService.getCashFlowSummary.mockReturnValue({});

      const summary = await feedbackUploader.generateFinancialSummary();

      expect(summary.budget.totalBudget).toBeUndefined();
      expect(summary.summary.hasBudget).toBe(false);
      expect(summary.summary.hasCashFlow).toBe(false);
    });

    it('should handle service errors gracefully', async () => {
      mockBudgetService.getBudgetSummary.mockImplementation(() => {
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

      mockExecutionLogService.getLogs.mockRejectedValue(new Error('Service error'));

      await expect(feedbackUploader.generateSnapshot(options))
        .rejects.toThrow('Failed to generate feedback snapshot');

      expect(mockExecutionLogService.logError).toHaveBeenCalledWith(
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