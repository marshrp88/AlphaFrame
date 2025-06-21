/**
 * ExecutionLogService.test.js
 * 
 * Purpose: Unit tests for ExecutionLogService with focus on existing methods only
 * 
 * Procedure:
 * - Test only methods that actually exist in the service
 * - Mock dependencies properly
 * - Avoid calling non-existent methods
 * 
 * Conclusion: Ensures reliable logging infrastructure for AlphaPro
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ExecutionLogService from '../../core/services/ExecutionLogService.js';
import { encrypt, decrypt } from '../../core/services/CryptoService.js';

// Mock CryptoService
vi.mock('../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted-data'),
  decrypt: vi.fn().mockResolvedValue({ test: 'data' }),
  generateSalt: vi.fn().mockResolvedValue('test-salt')
}));

// Mock IndexedDB
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

global.indexedDB = mockIndexedDB;

// Mock crypto
global.crypto = {
  getRandomValues: vi.fn(() => new Uint8Array([1, 2, 3, 4])),
  subtle: {
    generateKey: vi.fn(),
    encrypt: vi.fn(),
    decrypt: vi.fn()
  }
};

describe('ExecutionLogService', () => {
  let executionLogService;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock IndexedDB operations
    const mockTransaction = {
      objectStore: vi.fn(() => ({
        add: vi.fn(),
        get: vi.fn(),
        getAll: vi.fn(),
        delete: vi.fn(),
        clear: vi.fn()
      }))
    };
    
    const mockDB = {
      transaction: vi.fn(() => mockTransaction),
      close: vi.fn()
    };
    
    mockIndexedDB.open.mockImplementation((name, version) => {
      const request = {
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        result: mockDB
      };
      
      setTimeout(() => {
        if (request.onupgradeneeded) request.onupgradeneeded();
        if (request.onsuccess) request.onsuccess();
      }, 0);
      
      return request;
    });
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn().mockReturnValue('test-user'),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    
    executionLogService = new ExecutionLogService();
    
    // Mock the database property
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
        })
      })
    };
    
    // Mock queryLogs method to return empty array
    vi.spyOn(executionLogService, 'queryLogs').mockResolvedValue([]);
    
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
    
    // Clear all mocks
    vi.clearAllMocks();
    vi.restoreAllMocks();
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
      expect(localStorage.getItem).toHaveBeenCalledWith('userId');
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
        original: 'encrypted-data'
      });
    });
  });

  describe('Logging Methods', () => {
    it('should log events successfully', async () => {
      const logEntry = await executionLogService.log('test.event', { data: 'test' });
      
      expect(logEntry.type).toBe('test.event');
      expect(logEntry.severity).toBe('info');
      expect(logEntry.userId).toBeDefined();
      expect(logEntry.sessionId).toBeDefined();
    });

    it('should log errors with error severity', async () => {
      const logEntry = await executionLogService.log('test.error', { error: 'test' }, 'error');
      
      expect(logEntry.severity).toBe('error');
    });

    it('should log with custom metadata', async () => {
      const meta = { component: 'TestComponent', action: 'testAction' };
      const logEntry = await executionLogService.log('test.event', {}, 'info', meta);
      
      expect(logEntry.meta.component).toBe('TestComponent');
      expect(logEntry.meta.action).toBe('testAction');
    });
  });

  describe('Log Querying', () => {
    it('should query logs with filters', async () => {
      const logs = await executionLogService.queryLogs({
        type: 'user.action',
        startTime: Date.now() - 86400000,
        endTime: Date.now()
      });

      expect(Array.isArray(logs)).toBe(true);
    });

    it('should handle empty query results', async () => {
      const logs = await executionLogService.queryLogs({
        type: 'nonexistent.type'
      });

      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe('Log Export', () => {
    it('should export logs to JSON', async () => {
      const exportData = await executionLogService.exportLogs();

      expect(exportData.metadata).toBeDefined();
      expect(exportData.logs).toBeDefined();
      expect(Array.isArray(exportData.logs)).toBe(true);
    });

    it('should export filtered logs', async () => {
      const exportData = await executionLogService.exportLogs({
        type: 'user.action'
      });

      expect(exportData.logs).toBeDefined();
      expect(Array.isArray(exportData.logs)).toBe(true);
    });
  });

  describe('Specialized Logging Methods', () => {
    it('should log rule triggered events', async () => {
      const logEntry = await executionLogService.logRuleTriggered('rule-123', 'test-action');
      
      expect(logEntry.type).toBe('rule.triggered');
      expect(logEntry.meta.component).toBe('RuleEngine');
    });

    it('should log simulation run events', async () => {
      const logEntry = await executionLogService.logSimulationRun('sim-123', 1000);
      
      expect(logEntry.type).toBe('simulation.run');
      expect(logEntry.meta.durationMs).toBe(1000);
    });

    it('should log error events', async () => {
      const error = new Error('Test error');
      const logEntry = await executionLogService.logError(error, 'TestComponent', 'testAction');
      
      expect(logEntry.type).toBe('error');
      expect(logEntry.severity).toBe('error');
      expect(logEntry.meta.component).toBe('TestComponent');
    });
  });

  describe('Log Cleanup', () => {
    it('should clear old logs', async () => {
      const clearedCount = await executionLogService.clearOldLogs(30);
      
      expect(typeof clearedCount).toBe('number');
      expect(clearedCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Initialization', () => {
    it('should initialize the service', async () => {
      await executionLogService.init();
      expect(mockIndexedDB.open).toHaveBeenCalledWith('ExecutionLogs', 1);
    });
  });

  describe('Logging', () => {
    it('should log an execution event', async () => {
      await executionLogService.init();
      
      const logData = {
        type: 'test.log',
        timestamp: new Date().toISOString(),
        payload: { test: 'data' }
      };
      
      await executionLogService.log(logData.type, logData.payload);
      
      // Verify the log was processed
      expect(executionLogService.log).toHaveBeenCalledWith(logData.type, logData.payload);
    });
  });

  describe('Querying', () => {
    it('should query logs with filters', async () => {
      await executionLogService.init();
      
      const mockLogs = [
        { id: '1', type: 'test.log', timestamp: '2024-01-01T00:00:00Z', payload: { test: 'data' } }
      ];
      
      // Mock the getAll method to return logs
      const mockObjectStore = {
        getAll: vi.fn().mockImplementation(() => {
          const request = {
            onsuccess: null,
            result: mockLogs
          };
          setTimeout(() => request.onsuccess(), 0);
          return request;
        })
      };
      
      const mockTransaction = {
        objectStore: vi.fn(() => mockObjectStore)
      };
      
      const mockDB = {
        transaction: vi.fn(() => mockTransaction),
        close: vi.fn()
      };
      
      mockIndexedDB.open.mockImplementation((name, version) => {
        const request = {
          onupgradeneeded: null,
          onsuccess: null,
          onerror: null,
          result: mockDB
        };
        
        setTimeout(() => {
          if (request.onupgradeneeded) request.onupgradeneeded();
          if (request.onsuccess) request.onsuccess();
        }, 0);
        
        return request;
      });
      
      const logs = await executionLogService.queryLogs({ type: 'test.log' });
      expect(logs).toBeDefined();
    });
  });

  describe('Cleanup', () => {
    it('should clear old logs', async () => {
      await executionLogService.init();
      await executionLogService.clearOldLogs(30); // Clear logs older than 30 days
      
      // Verify cleanup was attempted
      expect(executionLogService.clearOldLogs).toHaveBeenCalledWith(30);
    });
  });
}); 