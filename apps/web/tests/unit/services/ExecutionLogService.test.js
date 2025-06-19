/**
 * ExecutionLogService.test.js
 * 
 * Purpose: Comprehensive unit tests for the ExecutionLogService to ensure
 * all logging functionality works correctly including encryption, persistence,
 * and retrieval operations.
 * 
 * Procedure:
 * 1. Test service initialization and IndexedDB setup
 * 2. Test log creation with encryption
 * 3. Test log retrieval and decryption
 * 4. Test filtering and statistics
 * 5. Test error handling and edge cases
 * 
 * Conclusion: These tests validate that the ExecutionLogService properly
 * encrypts, stores, and retrieves log data while maintaining data integrity.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExecutionLogService } from '../../../src/lib/services/ExecutionLogService.js';

// Mock IndexedDB for testing
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

// Mock crypto service
vi.mock('../../../src/lib/services/crypto.js', () => ({
  encryptData: vi.fn((data) => Promise.resolve(`encrypted_${data}`)),
  decryptData: vi.fn((encryptedData) => Promise.resolve(encryptedData.replace('encrypted_', '')))
}));

// Mock global indexedDB
global.indexedDB = mockIndexedDB;

describe('ExecutionLogService', () => {
  let service;
  let mockDB;
  let mockStore;
  let mockTransaction;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create fresh service instance
    service = new ExecutionLogService();
    
    // Setup IndexedDB mocks
    mockStore = {
      add: vi.fn(),
      getAll: vi.fn(),
      clear: vi.fn(),
      createIndex: vi.fn()
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockStore)
    };

    mockDB = {
      objectStoreNames: {
        contains: vi.fn(() => false)
      },
      createObjectStore: vi.fn(() => mockStore),
      transaction: vi.fn(() => mockTransaction)
    };

    // Mock IndexedDB open request
    const mockRequest = {
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
      result: mockDB
    };

    mockIndexedDB.open.mockReturnValue(mockRequest);

    // Trigger upgrade needed first, then success
    setTimeout(() => {
      if (mockRequest.onupgradeneeded) {
        mockRequest.onupgradeneeded({ target: { result: mockDB } });
      }
      setTimeout(() => {
        if (mockRequest.onsuccess) {
          mockRequest.onsuccess();
        }
      }, 0);
    }, 0);
  });

  afterEach(async () => {
    // Clean up any stored data
    if (service.isInitialized) {
      try {
        await service.clearLogs();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  describe('Initialization', () => {
    it('should initialize IndexedDB connection successfully', async () => {
      await service.initialize();
      
      expect(mockIndexedDB.open).toHaveBeenCalledWith('AlphaProLogs', 1);
      expect(service.isInitialized).toBe(true);
    });

    it('should create object store and indexes on first initialization', async () => {
      await service.initialize();
      
      expect(mockDB.createObjectStore).toHaveBeenCalledWith('execution_logs', {
        keyPath: 'id',
        autoIncrement: true
      });
      expect(mockStore.createIndex).toHaveBeenCalledWith('timestamp', 'timestamp', { unique: false });
      expect(mockStore.createIndex).toHaveBeenCalledWith('type', 'type', { unique: false });
      expect(mockStore.createIndex).toHaveBeenCalledWith('severity', 'severity', { unique: false });
      expect(mockStore.createIndex).toHaveBeenCalledWith('sessionId', 'sessionId', { unique: false });
    });

    it('should not reinitialize if already initialized', async () => {
      await service.initialize();
      const initialCallCount = mockIndexedDB.open.mock.calls.length;
      
      await service.initialize();
      
      expect(mockIndexedDB.open.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe('Log Creation', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should create and store a log entry successfully', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const logPromise = service.log('test.type', { data: 'test' }, 'info');
      
      // Simulate successful storage
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);

      const result = await logPromise;
      
      expect(result).toBeDefined();
      expect(result.type).toBe('test.type');
      expect(result.severity).toBe('info');
      expect(result.sessionId).toBeDefined();
      expect(mockStore.add).toHaveBeenCalled();
    });

    it('should encrypt payload before storage', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const payload = { sensitive: 'data' };
      const logPromise = service.log('test.type', payload);
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);

      await logPromise;
      
      // Check that the stored log has encrypted payload
      const storedLog = mockStore.add.mock.calls[0][0];
      expect(storedLog.payload).toContain('encrypted_');
    });

    it('should validate log type parameter', async () => {
      const result = await service.log('', { data: 'test' });
      expect(result).toBeNull();
    });

    it('should validate payload parameter', async () => {
      const result = await service.log('test.type', 'invalid-payload');
      expect(result).toBeNull();
    });

    it('should validate severity parameter', async () => {
      const result = await service.log('test.type', { data: 'test' }, 'invalid');
      expect(result).toBeNull();
    });

    it('should handle storage errors gracefully', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const logPromise = service.log('test.type', { data: 'test' });
      
      setTimeout(() => {
        mockAddRequest.onerror();
      }, 0);

      const result = await logPromise;
      expect(result).toBeNull();
    });
  });

  describe('Log Retrieval', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should retrieve and decrypt logs successfully', async () => {
      const mockLogs = [
        {
          id: 1,
          timestamp: Date.now(),
          type: 'test.type',
          payload: 'encrypted_{"data":"test"}',
          severity: 'info',
          userId: 'default',
          sessionId: 'session_123'
        }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs();
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs).toHaveLength(1);
      expect(logs[0].payload).toEqual({ data: 'test' });
      expect(logs[0].type).toBe('test.type');
    });

    it('should apply type filter correctly', async () => {
      const mockLogs = [
        { type: 'portfolio.analysis', payload: 'encrypted_1' },
        { type: 'rule.triggered', payload: 'encrypted_2' },
        { type: 'portfolio.analysis', payload: 'encrypted_3' }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs({ type: 'portfolio.analysis' });
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs).toHaveLength(2);
      expect(logs.every(log => log.type === 'portfolio.analysis')).toBe(true);
    });

    it('should apply time range filter correctly', async () => {
      const now = Date.now();
      const mockLogs = [
        { timestamp: now - 1000, payload: 'encrypted_1' },
        { timestamp: now, payload: 'encrypted_2' },
        { timestamp: now + 1000, payload: 'encrypted_3' }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs({ 
        startTime: now - 500, 
        endTime: now + 500 
      });
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs).toHaveLength(1);
      expect(logs[0].timestamp).toBe(now);
    });

    it('should apply limit correctly', async () => {
      const mockLogs = [
        { timestamp: Date.now(), payload: 'encrypted_1' },
        { timestamp: Date.now() + 1, payload: 'encrypted_2' },
        { timestamp: Date.now() + 2, payload: 'encrypted_3' }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs({}, 2);
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs).toHaveLength(2);
    });

    it('should sort logs by timestamp (newest first)', async () => {
      const now = Date.now();
      const mockLogs = [
        { timestamp: now, payload: 'encrypted_1' },
        { timestamp: now + 1000, payload: 'encrypted_2' },
        { timestamp: now - 1000, payload: 'encrypted_3' }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs();
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs[0].timestamp).toBe(now + 1000);
      expect(logs[1].timestamp).toBe(now);
      expect(logs[2].timestamp).toBe(now - 1000);
    });
  });

  describe('Log Statistics', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should generate correct log statistics', async () => {
      const now = Date.now();
      const mockLogs = [
        { type: 'portfolio.analysis', severity: 'info', sessionId: 'session_1', timestamp: now },
        { type: 'portfolio.analysis', severity: 'info', sessionId: 'session_1', timestamp: now + 1000 },
        { type: 'rule.triggered', severity: 'warning', sessionId: 'session_2', timestamp: now + 2000 }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const statsPromise = service.getLogStats();
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const stats = await statsPromise;
      
      expect(stats.totalLogs).toBe(3);
      expect(stats.byType['portfolio.analysis']).toBe(2);
      expect(stats.byType['rule.triggered']).toBe(1);
      expect(stats.bySeverity.info).toBe(2);
      expect(stats.bySeverity.warning).toBe(1);
      expect(stats.bySession['session_1']).toBe(2);
      expect(stats.bySession['session_2']).toBe(1);
      expect(stats.timeRange.earliest).toBe(now);
      expect(stats.timeRange.latest).toBe(now + 2000);
    });
  });

  describe('Convenience Methods', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    it('should log portfolio analysis with correct type', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const payload = { allocation: { stocks: 60, bonds: 40 } };
      const logPromise = service.logPortfolioAnalysis(payload);
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);

      const result = await logPromise;
      
      expect(result.type).toBe('portfolio.analysis.run');
      expect(result.severity).toBe('info');
    });

    it('should log rule triggered with correct type', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const payload = { ruleId: 'high-spending-alert', triggered: true };
      const logPromise = service.logRuleTriggered(payload);
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);

      const result = await logPromise;
      
      expect(result.type).toBe('rule.triggered');
      expect(result.severity).toBe('info');
    });

    it('should log errors with correct severity', async () => {
      const mockAddRequest = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      mockStore.add.mockReturnValue(mockAddRequest);

      const error = new Error('Test error');
      const logPromise = service.logError('test.error', error, { context: 'test' });
      
      setTimeout(() => {
        mockAddRequest.onsuccess();
      }, 0);

      const result = await logPromise;
      
      expect(result.type).toBe('test.error');
      expect(result.severity).toBe('error');
    });
  });

  describe('Error Handling', () => {
    it('should handle IndexedDB initialization errors gracefully', async () => {
      const mockRequest = {
        onerror: null,
        onsuccess: null
      };
      mockIndexedDB.open.mockReturnValue(mockRequest);

      const initPromise = service.initialize();
      
      setTimeout(() => {
        mockRequest.onerror();
      }, 0);

      await expect(initPromise).rejects.toThrow();
    });

    it('should handle decryption errors gracefully', async () => {
      await service.initialize();
      
      // Mock decryption failure
      const { decryptData } = await import('../../../src/lib/services/crypto.js');
      decryptData.mockRejectedValueOnce(new Error('Decryption failed'));

      const mockLogs = [
        { payload: 'invalid_encrypted_data' }
      ];

      const mockGetRequest = {
        onsuccess: null,
        onerror: null,
        result: mockLogs
      };
      mockStore.getAll.mockReturnValue(mockGetRequest);

      const logsPromise = service.getLogs();
      
      setTimeout(() => {
        mockGetRequest.onsuccess();
      }, 0);

      const logs = await logsPromise;
      
      expect(logs[0].payload.error).toBe('Decryption failed');
    });
  });

  describe('Session Management', () => {
    it('should generate unique session IDs', () => {
      const service1 = new ExecutionLogService();
      const service2 = new ExecutionLogService();
      
      expect(service1.sessionId).not.toBe(service2.sessionId);
      expect(service1.sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
    });

    it('should use consistent session ID within service instance', async () => {
      await service.initialize();
      
      const mockAddRequest1 = {
        onsuccess: null,
        onerror: null,
        result: 1
      };
      const mockAddRequest2 = {
        onsuccess: null,
        onerror: null,
        result: 2
      };
      
      // Mock store.add to return different requests for each call
      mockStore.add
        .mockReturnValueOnce(mockAddRequest1)
        .mockReturnValueOnce(mockAddRequest2);

      const log1Promise = service.log('test1', { data: '1' });
      const log2Promise = service.log('test2', { data: '2' });
      
      // Simulate successful storage for both logs
      setTimeout(() => {
        mockAddRequest1.onsuccess();
        mockAddRequest2.onsuccess();
      }, 0);

      const [log1, log2] = await Promise.all([log1Promise, log2Promise]);
      
      expect(log1.sessionId).toBe(log2.sessionId);
      expect(log1.sessionId).toBe(service.sessionId);
    }, 15000); // Increase timeout to 15 seconds
  });
}); 