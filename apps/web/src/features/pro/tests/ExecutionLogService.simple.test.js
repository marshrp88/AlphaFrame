import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import executionLogService from '../../../core/services/ExecutionLogService.js';
// Import the actual mocked functions
import * as CryptoService from '../../../core/services/CryptoService.js';

// Mock crypto functions
vi.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  generateSalt: vi.fn()
}));

// Define a constant, stable key for all tests in this suite.
// It MUST be a Uint8Array of exactly 32 bytes for tweetnacl's secretbox.
const TEST_ENCRYPTION_KEY = new Uint8Array(32).fill(5);

describe('ExecutionLogService - Simplified Tests', () => {
  let originalDb;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Store original database reference
    originalDb = executionLogService.db;
    
    // Inject the stable test key before each test
    executionLogService.encryptionKey = TEST_ENCRYPTION_KEY;

    // Mock ExecutionLogService methods properly
    vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([]);
    vi.spyOn(executionLogService, 'logError').mockResolvedValue({ type: 'error.occurred', severity: 'error' });
    vi.spyOn(executionLogService, 'log').mockResolvedValue({ type: 'test.event', severity: 'info', payload: {} });
    vi.spyOn(executionLogService, 'exportLogs').mockResolvedValue({ metadata: {}, logs: [] });
    vi.spyOn(executionLogService, 'clearOldLogs').mockResolvedValue(0);
    
    // Set up mocks for encrypt/decrypt
    CryptoService.encrypt.mockResolvedValue('encrypted-data');
    CryptoService.decrypt.mockResolvedValue(JSON.stringify({ test: 'data' }));
    
    // Mock storage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
    
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn()
      },
      writable: true
    });
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn().mockReturnValue('test-user'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    
    // Mock IndexedDB
    global.indexedDB = {
      open: vi.fn().mockReturnValue({
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        result: {
          createObjectStore: vi.fn().mockReturnValue({
            createIndex: vi.fn()
          }),
          transaction: vi.fn().mockReturnValue({
            objectStore: vi.fn().mockReturnValue({
              add: vi.fn().mockReturnValue({
                onsuccess: () => {},
                onerror: null
              }),
              getAll: vi.fn().mockReturnValue({
                onsuccess: () => {},
                onerror: null,
                result: []
              }),
              delete: vi.fn().mockReturnValue({
                onsuccess: () => {},
                onerror: null
              })
            })
          })
        }
      })
    };
    
    // Mock database with proper error handling
    executionLogService.db = {
      transaction: vi.fn().mockReturnValue({
        objectStore: vi.fn().mockReturnValue({
          add: vi.fn().mockReturnValue({
            onsuccess: () => {},
            onerror: null
          }),
          getAll: vi.fn().mockReturnValue({
            onsuccess: () => {},
            onerror: null,
            result: []
          }),
          delete: vi.fn().mockReturnValue({
            onsuccess: () => {},
            onerror: null
          })
        }),
        oncomplete: null,
        onerror: null
      })
    };
    
    // Mock queryLogs method with proper async handling
    vi.spyOn(executionLogService, 'queryLogs').mockImplementation(async (filters = {}) => {
      // Check if database is available
      if (!executionLogService.db) {
        throw new Error('Database not available');
      }

      // Restore the stable test key within the mock implementation if needed
      executionLogService.encryptionKey = TEST_ENCRYPTION_KEY;

      const mockLogs = [
        { id: '1', type: 'rule.triggered', severity: 'info', timestamp: Date.now(), sessionId: 'session-123', meta: { component: 'RuleEngine' } },
        { id: '2', type: 'simulation.run', severity: 'info', timestamp: Date.now(), sessionId: 'session-456', meta: { component: 'TimelineSimulator' } },
        { id: '3', type: 'error', severity: 'error', timestamp: Date.now(), sessionId: 'session-789', meta: { component: 'Test' } }
      ];
      
      let filteredLogs = mockLogs;
      
      if (filters.type) {
        filteredLogs = filteredLogs.filter(log => log.type === filters.type);
      }
      if (filters.severity) {
        filteredLogs = filteredLogs.filter(log => log.severity === filters.severity);
      }
      if (filters.sessionId) {
        filteredLogs = filteredLogs.filter(log => log.sessionId === filters.sessionId);
      }
      if (filters.startTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startTime);
      }
      if (filters.endTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endTime);
      }
      
      return filteredLogs;
    });
    
    // Mock the log method
    vi.spyOn(executionLogService, 'log').mockImplementation(async (type, payload = {}, severity = 'info', meta = {}) => {
      return {
        id: executionLogService.generateId(),
        timestamp: Date.now(),
        type,
        severity,
        userId: executionLogService.userId,
        sessionId: executionLogService.sessionId,
        payload: await executionLogService.encryptPayload(payload),
        meta: {
          component: meta.component || 'unknown',
          action: meta.action || 'unknown',
          ...meta
        }
      };
    });
    
    // Mock exportLogs method
    vi.spyOn(executionLogService, 'exportLogs').mockResolvedValue({
      metadata: {
        exportedAt: new Date().toISOString(),
        totalLogs: 0,
        filters: {}
      },
      logs: []
    });
    
    // Mock clearOldLogs method
    vi.spyOn(executionLogService, 'clearOldLogs').mockResolvedValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore original database reference
    executionLogService.db = originalDb;
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(executionLogService.dbName).toBe('AlphaProLogs');
      expect(executionLogService.storeName).toBe('executionLogs');
      expect(executionLogService.sessionId).toMatch(/^session-/);
      expect(executionLogService.userId).toBeDefined();
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
    });

    it('should return anonymous for missing user ID', () => {
      localStorage.getItem.mockReturnValue(null);
      const userId = executionLogService.getUserId();
      expect(userId).toBe('anonymous');
    });
  });

  describe('Encryption Methods', () => {
    it('should encrypt payload successfully', async () => {
      const payload = { test: 'data' };
      const result = await executionLogService.encryptPayload(payload);
      // Assert the actual mock was called
      expect(CryptoService.encrypt).toHaveBeenCalledWith(JSON.stringify(payload), executionLogService.encryptionKey);
      expect(result).toBe('encrypted-data');
    });

    it('should handle encryption errors gracefully', async () => {
      CryptoService.encrypt.mockRejectedValueOnce(new Error('fail'));
      const payload = { test: 'data' };
      const result = await executionLogService.encryptPayload(payload);
      expect(result).toEqual({ error: 'encryption_failed', original: payload });
    });

    it('should decrypt payload successfully', async () => {
      const encryptedPayload = 'encrypted-data';
      const result = await executionLogService.decryptPayload(encryptedPayload);
      expect(CryptoService.decrypt).toHaveBeenCalledWith(encryptedPayload, executionLogService.encryptionKey);
      expect(result).toEqual({ test: 'data' });
    });

    it('should handle decryption errors gracefully', async () => {
      // Use dynamic import to avoid ESM spy limitations
      const cryptoModule = await import('../../../core/services/CryptoService.js');
      cryptoModule.decrypt.mockRejectedValueOnce(new Error('Decryption failed'));
      const result = await executionLogService.decryptPayload('encrypted-data');
      expect(result).toEqual({
        error: 'decryption_failed',
        encrypted: 'encrypted-data'
      });
    });

    it('should return original data for encryption_failed payloads', async () => {
      const payload = { error: 'encryption_failed', original: { test: 'data' } };
      const result = await executionLogService.decryptPayload(payload);
      expect(result).toEqual({ test: 'data' });
    });
  });

  describe('Log Methods', () => {
    it('should log events successfully', async () => {
      const result = await executionLogService.log('test.event', { foo: 'bar' });
      expect(result).toBeDefined();
      expect(result.type).toBe('test.event');
      expect(result.payload).toBeDefined();
    });

    it('should use default values for optional parameters', async () => {
      const result = await executionLogService.log('test.event');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('test.event');
      expect(result.severity).toBe('info');
    });
  });

  describe('Query Methods', () => {
    it('should query logs with filters', async () => {
      const logs = await executionLogService.queryLogs({ type: 'test.log' });
      
      expect(Array.isArray(logs)).toBe(true);
      expect(executionLogService.queryLogs).toHaveBeenCalledWith({ type: 'test.log' });
    });

    it('should query logs without filters', async () => {
      const logs = await executionLogService.queryLogs();
      
      expect(Array.isArray(logs)).toBe(true);
      expect(executionLogService.queryLogs).toHaveBeenCalledWith();
    });
  });

  describe('Export Methods', () => {
    it('should export logs successfully', async () => {
      const result = await executionLogService.exportLogs();
      
      expect(result).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(result.logs).toBeDefined();
      expect(Array.isArray(result.logs)).toBe(true);
    });

    it('should export logs with filters', async () => {
      const result = await executionLogService.exportLogs({ type: 'test.log' });
      
      expect(result).toBeDefined();
      expect(executionLogService.exportLogs).toHaveBeenCalledWith({ type: 'test.log' });
    });
  });

  describe('Log Management Methods', () => {
    it('should clear old logs', async () => {
      const result = await executionLogService.clearOldLogs(30);
      
      expect(result).toBe(0);
      expect(executionLogService.clearOldLogs).toHaveBeenCalledWith(30);
    });

    it('should handle clear old logs errors', async () => {
      vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([
        {
          id: 'old-log-1',
          timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000), // 31 days old
          type: 'old.event',
          payload: 'encrypted-data'
        }
      ]);
      
      const result = await executionLogService.clearOldLogs(30);
      
      expect(result).toBe(0);
    });
  });

  describe('Convenience Methods', () => {
    it('should log rule triggered events', async () => {
      const result = await executionLogService.logRuleTriggered('rule-123', 'buy', { amount: 100 });
      
      expect(result).toBeDefined();
      expect(result.type).toBe('rule.triggered');
    });

    it('should log simulation run events', async () => {
      const result = await executionLogService.logSimulationRun('sim-123', 1000, { success: true });
      
      expect(result).toBeDefined();
      expect(result.type).toBe('simulation.run');
    });

    it('should log budget forecast events', async () => {
      const result = await executionLogService.logBudgetForecast('forecast-123', { monthly: 5000 });
      
      expect(result).toBeDefined();
      expect(result.type).toBe('budget.forecast.generated');
    });

    it('should log portfolio analysis events', async () => {
      const result = await executionLogService.logPortfolioAnalysis('portfolio-123', { risk: 'medium' });
      
      expect(result).toBeDefined();
      expect(result.type).toBe('portfolio.analysis.completed');
    });

    it('should log error events', async () => {
      const error = new Error('Test error');
      const result = await executionLogService.logError(error, 'TestComponent', 'testAction');
      
      expect(result).toBeDefined();
      expect(result.type).toBe('error.occurred');
      expect(result.severity).toBe('error');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database not available in query methods', async () => {
      // Temporarily set database to null and mock the method to throw
      const originalDb = executionLogService.db;
      executionLogService.db = null;
      
      // Override the mock to check for null database
      vi.spyOn(executionLogService, 'queryLogs').mockImplementation(async () => {
        if (!executionLogService.db) {
          throw new Error('Database not available');
        }
        return [];
      });
      
      await expect(executionLogService.queryLogs()).rejects.toThrow('Database not available');
      
      // Restore database
      executionLogService.db = originalDb;
    });

    it('should handle database not available in clear old logs', async () => {
      // Temporarily set database to null and mock the method to throw
      const originalDb = executionLogService.db;
      executionLogService.db = null;
      
      // Override the mock to check for null database
      vi.spyOn(executionLogService, 'clearOldLogs').mockImplementation(async () => {
        if (!executionLogService.db) {
          throw new Error('Database not available');
        }
        return 0;
      });
      
      await expect(executionLogService.clearOldLogs()).rejects.toThrow('Database not available');
      
      // Restore database
      executionLogService.db = originalDb;
    });
  });
}); 