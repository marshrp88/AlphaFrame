/**
 * ExecutionLogService.test.js
 * 
 * Purpose: Unit tests for ExecutionLogService with 90%+ coverage target
 * 
 * Procedure:
 * - Test all public methods and edge cases
 * - Mock IndexedDB and CryptoService dependencies
 * - Verify log schema compliance and encryption
 * 
 * Conclusion: Ensures reliable logging infrastructure for AlphaPro
 */

import { describe, it, expect, beforeEach, afterEach, vi } from '@jest/globals';

// Mock CryptoService functions
jest.mock('../../core/services/CryptoService', () => ({
  encrypt: jest.fn(),
  decrypt: jest.fn(),
  generateSalt: jest.fn()
}));

// Import after mocking
import { executionLogService } from '../../core/services/ExecutionLogService';
import { encrypt, decrypt, generateSalt } from '../../core/services/CryptoService';

// Mock IndexedDB
const mockIndexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn()
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

// Mock crypto
const mockCrypto = {
  getRandomValues: jest.fn()
};

describe('ExecutionLogService', () => {
  let mockDb;
  let mockTransaction;
  let mockStore;
  let mockRequest;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock store methods
    mockStore = {
      add: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
      createIndex: jest.fn()
    };

    // Mock transaction
    mockTransaction = {
      objectStore: jest.fn(() => mockStore),
      oncomplete: null,
      onerror: null
    };

    // Mock database
    mockDb = {
      objectStoreNames: { contains: jest.fn() },
      createObjectStore: jest.fn(() => mockStore),
      transaction: jest.fn(() => mockTransaction)
    };

    // Setup IndexedDB mock
    mockRequest = {
      onupgradeneeded: null,
      onsuccess: null,
      onerror: null,
      result: mockDb
    };

    mockIndexedDB.open.mockImplementation((name) => {
      const request = {
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        result: mockDb
      };
      setTimeout(() => {
        if (request.onupgradeneeded) request.onupgradeneeded();
        if (request.onsuccess) request.onsuccess();
      }, 0);
      return request;
    });

    // Setup localStorage mock
    mockLocalStorage.getItem.mockReturnValue('test-user-id');
    mockLocalStorage.setItem.mockImplementation(() => {});

    // Setup sessionStorage mock
    mockSessionStorage.getItem.mockReturnValue('test-session-id');
    mockSessionStorage.setItem.mockImplementation(() => {});

    // Setup crypto mock
    mockCrypto.getRandomValues.mockReturnValue(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

    // Mock global objects
    global.indexedDB = mockIndexedDB;
    global.localStorage = mockLocalStorage;
    global.sessionStorage = mockSessionStorage;
    global.crypto = mockCrypto;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    if (typeof globalThis.clearTimeout === 'function') {
      // Clear any timers if they exist
      jest.runOnlyPendingTimers();
      jest.clearAllTimers();
    }
  });

  describe('Initialization', () => {
    it('should initialize with correct properties', () => {
      expect(executionLogService.dbName).toBe('AlphaProLogs');
      expect(executionLogService.storeName).toBe('executionLogs');
      expect(executionLogService.sessionId).toMatch(/^session-/);
      expect(executionLogService.userId).toBeDefined();
    });

    it('should initialize IndexedDB on construction', () => {
      expect(mockIndexedDB.open).toHaveBeenCalledWith('AlphaProLogs', 1);
    });

    it('should handle IndexedDB initialization error', async () => {
      const error = new Error('DB Error');
      mockRequest.error = error;
      mockRequest.onerror();

      // Should not throw during construction
      expect(() => new executionLogService.constructor()).not.toThrow();
    });
  });

  describe('Logging', () => {
    beforeEach(() => {
      // Setup successful DB initialization
      mockRequest.result = mockDb;
      mockRequest.onsuccess();
    });

    it('should create log entry with correct schema', async () => {
      const logEntry = await executionLogService.log('test.event', { data: 'test' }, 'info', {
        component: 'TestComponent',
        action: 'test'
      });

      expect(logEntry).toMatchObject({
        id: expect.any(String),
        timestamp: expect.any(Number),
        type: 'test.event',
        severity: 'info',
        userId: expect.any(String),
        sessionId: expect.any(String),
        meta: {
          component: 'TestComponent',
          action: 'test'
        }
      });
    });

    it('should encrypt payload before storage', async () => {
      const payload = { sensitive: 'data' };
      await executionLogService.log('test.event', payload);

      expect(encrypt).toHaveBeenCalledWith(JSON.stringify(payload), expect.any(String));
    });

    it('should handle encryption errors gracefully', async () => {
      encrypt.mockRejectedValue(new Error('Encryption failed'));
      
      const logEntry = await executionLogService.log('test.event', { data: 'test' });
      
      expect(logEntry.payload).toMatchObject({
        error: 'encryption_failed',
        original: { data: 'test' }
      });
    });

    it('should store log in IndexedDB', async () => {
      mockStore.add.mockImplementation((logEntry) => {
        mockRequest.onsuccess();
        return mockRequest;
      });

      await executionLogService.log('test.event', { data: 'test' });

      expect(mockStore.add).toHaveBeenCalled();
    });

    it('should handle storage errors', async () => {
      mockStore.add.mockImplementation(() => {
        mockRequest.error = new Error('Storage failed');
        mockRequest.onerror();
        return mockRequest;
      });

      await expect(executionLogService.log('test.event', { data: 'test' }))
        .rejects.toThrow('Storage failed');
    });
  });

  describe('Query Methods', () => {
    beforeEach(() => {
      mockRequest.result = mockDb;
      mockRequest.onsuccess();
    });

    it('should query logs with filters', async () => {
      const mockLogs = [
        { id: '1', type: 'test.event', severity: 'info', sessionId: 'session-1' },
        { id: '2', type: 'other.event', severity: 'error', sessionId: 'session-2' }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = mockLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      const logs = await executionLogService.queryLogs({ type: 'test.event' });

      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe('test.event');
    });

    it('should get session logs', async () => {
      const mockLogs = [
        { sessionId: 'session-1' },
        { sessionId: 'session-2' }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = mockLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      const logs = await executionLogService.getSessionLogs('session-1');

      expect(logs).toHaveLength(1);
      expect(logs[0].sessionId).toBe('session-1');
    });

    it('should get component logs', async () => {
      const mockLogs = [
        { meta: { component: 'TestComponent' } },
        { meta: { component: 'OtherComponent' } }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = mockLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      const logs = await executionLogService.getComponentLogs('TestComponent');

      expect(logs).toHaveLength(1);
      expect(logs[0].meta.component).toBe('TestComponent');
    });

    it('should get performance logs', async () => {
      const mockLogs = [
        { meta: { durationMs: 100 } },
        { meta: {} },
        { meta: { durationMs: 200 } }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = mockLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      const logs = await executionLogService.getPerformanceLogs();

      expect(logs).toHaveLength(2);
      expect(logs.every(log => log.meta.durationMs)).toBe(true);
    });
  });

  describe('Utility Methods', () => {
    it('should generate unique IDs', () => {
      const id1 = executionLogService.generateId();
      const id2 = executionLogService.generateId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should generate session IDs', () => {
      const sessionId = executionLogService.generateSessionId();

      expect(sessionId).toMatch(/^session-\d+-[a-z0-9]+$/);
    });

    it('should get user ID from localStorage', () => {
      localStorage.getItem.mockReturnValue('test-user');
      
      const userId = executionLogService.getUserId();
      
      expect(userId).toBe('test-user');
      expect(localStorage.getItem).toHaveBeenCalledWith('userId');
    });

    it('should return anonymous for missing user ID', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const userId = executionLogService.getUserId();
      
      expect(userId).toBe('anonymous');
    });
  });

  describe('Convenience Methods', () => {
    beforeEach(() => {
      mockRequest.result = mockDb;
      mockRequest.onsuccess();
    });

    it('should log rule triggered events', async () => {
      const logSpy = jest.spyOn(executionLogService, 'log');
      
      await executionLogService.logRuleTriggered('rule-1', 'buy', { amount: 100 });
      
      expect(logSpy).toHaveBeenCalledWith(
        'rule.triggered',
        { ruleId: 'rule-1', action: 'buy' },
        'info',
        expect.objectContaining({
          component: 'RuleEngine',
          action: 'trigger',
          amount: 100
        })
      );
    });

    it('should log simulation runs', async () => {
      const logSpy = jest.spyOn(executionLogService, 'log');
      
      await executionLogService.logSimulationRun('sim-1', 150, { scenarios: 3 });
      
      expect(logSpy).toHaveBeenCalledWith(
        'simulation.run',
        { simulationId: 'sim-1' },
        'info',
        expect.objectContaining({
          component: 'TimelineSimulator',
          action: 'simulate',
          durationMs: 150,
          scenarios: 3
        })
      );
    });

    it('should log budget forecasts', async () => {
      const logSpy = jest.spyOn(executionLogService, 'log');
      
      await executionLogService.logBudgetForecast('forecast-1', 200);
      
      expect(logSpy).toHaveBeenCalledWith(
        'budget.forecast.generated',
        { forecastId: 'forecast-1' },
        'info',
        expect.objectContaining({
          component: 'BudgetService',
          action: 'forecast',
          durationMs: 200
        })
      );
    });

    it('should log portfolio analysis', async () => {
      const logSpy = jest.spyOn(executionLogService, 'log');
      
      await executionLogService.logPortfolioAnalysis('portfolio-1', 300);
      
      expect(logSpy).toHaveBeenCalledWith(
        'portfolio.analysis.completed',
        { portfolioId: 'portfolio-1' },
        'info',
        expect.objectContaining({
          component: 'PortfolioAnalyzer',
          action: 'analyze',
          durationMs: 300
        })
      );
    });

    it('should log errors', async () => {
      const logSpy = jest.spyOn(executionLogService, 'log');
      const error = new Error('Test error');
      
      await executionLogService.logError(error, 'TestComponent', 'testAction');
      
      expect(logSpy).toHaveBeenCalledWith(
        'error.occurred',
        expect.objectContaining({
          message: 'Test error',
          stack: error.stack
        }),
        'error',
        expect.objectContaining({
          component: 'TestComponent',
          action: 'testAction'
        })
      );
    });
  });

  describe('Export and Cleanup', () => {
    beforeEach(() => {
      mockRequest.result = mockDb;
      mockRequest.onsuccess();
    });

    it('should export logs with decrypted payloads', async () => {
      const mockLogs = [
        { id: '1', payload: 'encrypted-1' },
        { id: '2', payload: 'encrypted-2' }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = mockLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      const exportData = await executionLogService.exportLogs();

      expect(exportData).toMatchObject({
        exportTime: expect.any(Number),
        sessionId: expect.any(String),
        userId: expect.any(String),
        logs: expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' })
        ])
      });

      expect(decrypt).toHaveBeenCalledTimes(2);
    });

    it('should clear old logs', async () => {
      const oldLogs = [
        { id: '1', timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000) },
        { id: '2', timestamp: Date.now() - (29 * 24 * 60 * 60 * 1000) }
      ];

      mockStore.getAll.mockImplementation(() => {
        mockRequest.result = oldLogs;
        mockRequest.onsuccess();
        return mockRequest;
      });

      mockStore.delete.mockImplementation(() => {
        mockRequest.onsuccess();
        return mockRequest;
      });

      const deletedCount = await executionLogService.clearOldLogs(30);

      expect(deletedCount).toBe(1);
      expect(mockStore.delete).toHaveBeenCalledWith('1');
    });
  });
}); 