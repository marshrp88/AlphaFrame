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

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock CryptoService functions
vi.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  generateSalt: vi.fn()
}));

// Mock global objects BEFORE importing the service
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
};

// Mock global objects for Node environment
global.indexedDB = mockIndexedDB;
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn()
};

// Import after mocking
import { executionLogService } from '../../../core/services/ExecutionLogService.js';
import { encrypt, decrypt, generateSalt } from '../../../core/services/CryptoService.js';

describe('ExecutionLogService', () => {
  // Simple test to confirm runner is working
  it('should run basic test', () => {
    console.log('Basic test is running');
    expect(true).toBe(true);
  });

  let mockDb;
  let mockTransaction;
  let mockStore;
  let mockRequest;

  beforeEach(() => {
    console.log('Setting up test mocks');
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup IndexedDB mock with proper error handling
    mockRequest = {
      onerror: null,
      onsuccess: null,
      onupgradeneeded: null,
      result: null,
      error: null
    };

    mockStore = {
      add: vi.fn(),
      getAll: vi.fn(),
      delete: vi.fn(),
      createIndex: vi.fn()
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockStore),
      oncomplete: null,
      onerror: null
    };

    mockDb = {
      objectStoreNames: { contains: vi.fn() },
      createObjectStore: vi.fn(() => mockStore),
      transaction: vi.fn(() => mockTransaction)
    };

    // Mock IndexedDB.open to return a request that immediately fails
    // This prevents the async initialization from running
    mockIndexedDB.open.mockReturnValue(mockRequest);
    
    // Mock CryptoService methods
    encrypt.mockResolvedValue('encrypted-data');
    decrypt.mockResolvedValue('{"test": "data"}');
    generateSalt.mockResolvedValue('test-salt');
  });

  afterEach(() => {
    // Clean up
    vi.restoreAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      console.log('Testing basic properties');
      expect(executionLogService.dbName).toBe('AlphaProLogs');
      expect(executionLogService.storeName).toBe('executionLogs');
      expect(executionLogService.sessionId).toMatch(/^session-/);
      expect(executionLogService.userId).toBeDefined();
    });
  });

  describe('Utility Methods', () => {
    it('should generate unique IDs', () => {
      console.log('Testing ID generation');
      const id1 = executionLogService.generateId();
      const id2 = executionLogService.generateId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should generate session IDs', () => {
      console.log('Testing session ID generation');
      const sessionId = executionLogService.generateSessionId();

      expect(sessionId).toMatch(/^session-\d+-[a-z0-9]+$/);
    });

    it('should get user ID from localStorage', () => {
      console.log('Testing user ID retrieval');
      localStorage.getItem.mockReturnValue('test-user');
      
      const userId = executionLogService.getUserId();
      
      expect(userId).toBe('test-user');
      expect(localStorage.getItem).toHaveBeenCalledWith('userId');
    });

    it('should return anonymous for missing user ID', () => {
      console.log('Testing anonymous user ID');
      localStorage.getItem.mockReturnValue(null);
      
      const userId = executionLogService.getUserId();
      
      expect(userId).toBe('anonymous');
    });
  });

  describe('Encryption Methods', () => {
    it('should encrypt payload successfully', async () => {
      console.log('Testing payload encryption');
      const payload = { test: 'data' };
      
      const result = await executionLogService.encryptPayload(payload);
      
      expect(encrypt).toHaveBeenCalledWith(JSON.stringify(payload), executionLogService.encryptionKey);
      expect(result).toBe('encrypted-data');
    });

    it('should handle encryption errors gracefully', async () => {
      console.log('Testing encryption error handling');
      encrypt.mockRejectedValue(new Error('Encryption failed'));
      
      const payload = { test: 'data' };
      const result = await executionLogService.encryptPayload(payload);
      
      expect(result).toEqual({
        error: 'encryption_failed',
        original: payload
      });
    });

    it('should decrypt payload successfully', async () => {
      console.log('Testing payload decryption');
      const encryptedPayload = 'encrypted-data';
      
      const result = await executionLogService.decryptPayload(encryptedPayload);
      
      expect(decrypt).toHaveBeenCalledWith(encryptedPayload, executionLogService.encryptionKey);
      expect(result).toEqual({ test: 'data' });
    });

    it('should handle decryption errors gracefully', async () => {
      console.log('Testing decryption error handling');
      decrypt.mockRejectedValue(new Error('Decryption failed'));
      
      const result = await executionLogService.decryptPayload('encrypted-data');
      
      expect(result).toEqual({
        error: 'decryption_failed',
        encrypted: 'encrypted-data'
      });
    });

    it('should return original data for encryption_failed payloads', async () => {
      console.log('Testing encryption_failed payload handling');
      const payload = { error: 'encryption_failed', original: { test: 'data' } };
      
      const result = await executionLogService.decryptPayload(payload);
      
      expect(result).toEqual({ test: 'data' });
    });
  });

  describe('Convenience Methods', () => {
    it('should log rule triggered events', async () => {
      console.log('Testing rule triggered logging');
      const ruleId = 'rule-123';
      const action = 'transfer';
      const meta = { amount: 100 };
      
      const result = await executionLogService.logRuleTriggered(ruleId, action, meta);
      
      expect(result.type).toBe('rule.triggered');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe('RuleEngine');
      expect(result.meta.action).toBe('trigger');
      expect(result.meta.amount).toBe(100);
    });

    it('should log simulation run events', async () => {
      console.log('Testing simulation run logging');
      const simulationId = 'sim-123';
      const durationMs = 1500;
      const meta = { iterations: 100 };
      
      const result = await executionLogService.logSimulationRun(simulationId, durationMs, meta);
      
      expect(result.type).toBe('simulation.run');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe('TimelineSimulator');
      expect(result.meta.action).toBe('simulate');
      expect(result.meta.durationMs).toBe(1500);
      expect(result.meta.iterations).toBe(100);
    });

    it('should log budget forecast events', async () => {
      console.log('Testing budget forecast logging');
      const forecastId = 'forecast-123';
      const durationMs = 800;
      const meta = { months: 12 };
      
      const result = await executionLogService.logBudgetForecast(forecastId, durationMs, meta);
      
      expect(result.type).toBe('budget.forecast.generated');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe('BudgetService');
      expect(result.meta.action).toBe('forecast');
      expect(result.meta.durationMs).toBe(800);
      expect(result.meta.months).toBe(12);
    });

    it('should log portfolio analysis events', async () => {
      console.log('Testing portfolio analysis logging');
      const portfolioId = 'portfolio-123';
      const durationMs = 2000;
      const meta = { assets: 50 };
      
      const result = await executionLogService.logPortfolioAnalysis(portfolioId, durationMs, meta);
      
      expect(result.type).toBe('portfolio.analysis.completed');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe('PortfolioAnalyzer');
      expect(result.meta.action).toBe('analyze');
      expect(result.meta.durationMs).toBe(2000);
      expect(result.meta.assets).toBe(50);
    });

    it('should log error events', async () => {
      console.log('Testing error logging');
      const error = new Error('Test error');
      const component = 'TestComponent';
      const action = 'testAction';
      const meta = { context: 'test' };
      
      const result = await executionLogService.logError(error, component, action, meta);
      
      expect(result.type).toBe('error.occurred');
      expect(result.severity).toBe('error');
      expect(result.payload).toBe('encrypted-data');
      expect(result.meta.component).toBe(component);
      expect(result.meta.action).toBe(action);
      expect(result.meta.context).toBe('test');
    });
  });

  describe('Log Entry Structure', () => {
    it('should create properly structured log entries', async () => {
      console.log('Testing log entry structure');
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
      
      expect(result.timestamp).toBeGreaterThan(Date.now() - 1000);
      expect(result.timestamp).toBeLessThan(Date.now() + 1000);
      expect(result.payload).toBe('encrypted-data');
    });

    it('should use default values for optional parameters', async () => {
      console.log('Testing default parameter values');
      const result = await executionLogService.log('test.event');
      
      expect(result.type).toBe('test.event');
      expect(result.payload).toBe('encrypted-data');
      expect(result.severity).toBe('info');
      expect(result.meta.component).toBe('unknown');
      expect(result.meta.action).toBe('unknown');
    });
  });
}); 