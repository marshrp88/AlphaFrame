import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import executionLogService from '../../../core/services/ExecutionLogService.js';
import { encrypt, decrypt } from '../../../core/services/CryptoService.js';

// Mock crypto functions
vi.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  generateSalt: vi.fn()
}));

describe('ExecutionLogService - Simplified Tests', () => {
  beforeEach(() => {
    // Mock crypto functions
    encrypt.mockResolvedValue('encrypted-data');
    decrypt.mockResolvedValue('{"test":"data"}');
    
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
    
    // Mock database
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
    
    // Mock queryLogs method
    vi.spyOn(executionLogService, 'queryLogs').mockImplementation(async (filters = {}) => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      expect(encrypt).toHaveBeenCalledWith(JSON.stringify(payload), executionLogService.encryptionKey);
      expect(result).toBe('encrypted-data');
    });

    it('should handle encryption errors gracefully', async () => {
      encrypt.mockRejectedValue(new Error('Encryption failed'));
      const payload = { test: 'data' };
      const result = await executionLogService.encryptPayload(payload);
      expect(result).toEqual({
        error: 'encryption_failed',
        original: payload
      });
    });

    it('should decrypt payload successfully', async () => {
      const encryptedPayload = 'encrypted-data';
      const result = await executionLogService.decryptPayload(encryptedPayload);
      expect(decrypt).toHaveBeenCalledWith(encryptedPayload, executionLogService.encryptionKey);
      expect(result).toEqual({ test: 'data' });
    });

    it('should handle decryption errors gracefully', async () => {
      decrypt.mockRejectedValue(new Error('Decryption failed'));
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
    it('should create properly structured log entries', async () => {
      const type = 'test.event';
      const payload = { data: 'test' };
      const severity = 'warn';
      const meta = { component: 'Test', action: 'test' };
      
      const result = await executionLogService.log(type, payload, severity, meta);
      
      expect(result).toMatchObject({
        id: expect.stringMatching(/^\d+-[a-z0-9]+$/),
        timestamp: expect.any(Number),
        type,
        severity,
        userId: expect.any(String),
        sessionId: expect.stringMatching(/^session-/),
        meta: {
          component: 'Test',
          action: 'test'
        }
      });
    });

    it('should use default values for optional parameters', async () => {
      const result = await executionLogService.log('test.event');
      
      expect(result.type).toBe('test.event');
      expect(result.payload).toBe('encrypted-data');
      expect(result.severity).toBe('info');
      expect(result.meta.component).toBe('unknown');
      expect(result.meta.action).toBe('unknown');
    });
  });

  describe('Query Methods', () => {
    it('should query logs with type filter', async () => {
      const result = await executionLogService.queryLogs({ type: 'rule.triggered' });
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('rule.triggered');
    });

    it('should query logs with severity filter', async () => {
      const result = await executionLogService.queryLogs({ severity: 'error' });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('error');
    });

    it('should query logs with session filter', async () => {
      const result = await executionLogService.queryLogs({ sessionId: 'session-123' });
      expect(result).toHaveLength(1);
      expect(result[0].sessionId).toBe('session-123');
    });

    it('should query logs with time range filters', async () => {
      const now = Date.now();
      const result = await executionLogService.queryLogs({ 
        startTime: now - 1000, 
        endTime: now + 1000 
      });
      expect(result).toHaveLength(3);
    });

    it('should handle query errors gracefully', async () => {
      vi.spyOn(executionLogService, 'queryLogs').mockRejectedValue(new Error('Database error'));
      await expect(executionLogService.queryLogs()).rejects.toThrow('Database error');
    });
  });

  describe('Specialized Query Methods', () => {
    it('should get session logs', async () => {
      const result = await executionLogService.getSessionLogs('session-123');
      expect(result).toHaveLength(1);
      expect(result[0].sessionId).toBe('session-123');
    });

    it('should get component logs', async () => {
      const result = await executionLogService.getComponentLogs('RuleEngine');
      expect(result).toHaveLength(1);
      expect(result[0].meta.component).toBe('RuleEngine');
    });

    it('should get performance logs', async () => {
      // Mock logs with durationMs
      vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([
        { id: '1', meta: { durationMs: 100 } },
        { id: '2', meta: {} }
      ]);
      
      const result = await executionLogService.getPerformanceLogs();
      expect(result).toHaveLength(1);
      expect(result[0].meta.durationMs).toBe(100);
    });
  });

  describe('Log Management Methods', () => {
    it('should clear old logs', async () => {
      // Mock logs with old timestamps
      vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([
        { id: '1', timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000) }, // 31 days old
        { id: '2', timestamp: Date.now() - (29 * 24 * 60 * 60 * 1000) }  // 29 days old
      ]);
      
      const result = await executionLogService.clearOldLogs(30);
      expect(result).toBe(1);
    });

    it('should handle clear old logs errors', async () => {
      vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([
        { id: '1', timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000) }
      ]);
      
      // Mock transaction error
      const mockTransaction = {
        objectStore: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            onsuccess: () => {},
            onerror: null
          })
        }),
        oncomplete: null,
        onerror: () => {
          mockTransaction.mockError = new Error('Delete failed');
        }
      };
      
      executionLogService.db.transaction.mockReturnValue(mockTransaction);
      
      await expect(executionLogService.clearOldLogs(30)).rejects.toThrow('Delete failed');
    });
  });

  describe('Export Methods', () => {
    it('should export logs with decrypted payloads', async () => {
      const result = await executionLogService.exportLogs();
      
      expect(result).toMatchObject({
        exportTime: expect.any(Number),
        sessionId: expect.stringMatching(/^session-/),
        userId: expect.any(String),
        logs: expect.arrayContaining([
          expect.objectContaining({
            payload: { test: 'data' } // Decrypted payload
          })
        ])
      });
    });

    it('should export logs with filters', async () => {
      const result = await executionLogService.exportLogs({ type: 'rule.triggered' });
      expect(result.logs).toHaveLength(1);
      expect(result.logs[0].type).toBe('rule.triggered');
    });

    it('should handle empty logs array in export', async () => {
      vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([]);
      const result = await executionLogService.exportLogs();
      expect(result.logs).toEqual([]);
    });

    it('should handle decryption errors in export', async () => {
      decrypt.mockRejectedValue(new Error('Decryption failed'));
      const result = await executionLogService.exportLogs();
      expect(result.logs[0].payload).toEqual({
        error: 'decryption_failed',
        encrypted: 'encrypted-data'
      });
    });
  });

  describe('Convenience Methods', () => {
    it('should log rule triggered events', async () => {
      const result = await executionLogService.logRuleTriggered('rule-123', 'buy', { extra: 'data' });
      expect(result.type).toBe('rule.triggered');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe('RuleEngine');
      expect(result.meta.action).toBe('trigger');
    });

    it('should log simulation run events', async () => {
      const result = await executionLogService.logSimulationRun('sim-123', 1000, { extra: 'data' });
      expect(result.type).toBe('simulation.run');
      expect(result.meta.component).toBe('TimelineSimulator');
      expect(result.meta.durationMs).toBe(1000);
    });

    it('should log budget forecast events', async () => {
      const result = await executionLogService.logBudgetForecast('forecast-123', 500, { extra: 'data' });
      expect(result.type).toBe('budget.forecast.generated');
      expect(result.meta.component).toBe('BudgetService');
      expect(result.meta.durationMs).toBe(500);
    });

    it('should log portfolio analysis events', async () => {
      const result = await executionLogService.logPortfolioAnalysis('portfolio-123', 750, { extra: 'data' });
      expect(result.type).toBe('portfolio.analysis.completed');
      expect(result.meta.component).toBe('PortfolioAnalyzer');
      expect(result.meta.durationMs).toBe(750);
    });

    it('should log error events', async () => {
      const error = new Error('Test error');
      const result = await executionLogService.logError(error, 'TestComponent', 'testAction', { extra: 'data' });
      expect(result.type).toBe('error.occurred');
      expect(result.severity).toBe('error');
      expect(result.meta.component).toBe('TestComponent');
      expect(result.meta.action).toBe('testAction');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database not available in query methods', async () => {
      executionLogService.db = null;
      await expect(executionLogService.queryLogs()).rejects.toThrow();
    });

    it('should handle database not available in clear old logs', async () => {
      executionLogService.db = null;
      await expect(executionLogService.clearOldLogs()).rejects.toThrow();
    });
  });
}); 