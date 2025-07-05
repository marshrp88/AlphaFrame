import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
/**
 * ExecutionLogService - Simplified Tests
 * 
 * Purpose: Test the core functionality of the ExecutionLogService with proper mocking
 * Procedure: Mock dependencies and test actual service methods
 * Conclusion: Ensures service works correctly in test environment
 */

import executionLogService from '../../../core/services/ExecutionLogService.js';

// Mock CryptoService
vi.mock('../../../core/services/CryptoService.js', () => ({
  encrypt: vi.fn().mockResolvedValue('encrypted-data'),
  decrypt: vi.fn().mockResolvedValue(JSON.stringify({ test: 'data' }))
}));

import CryptoService from '../../../core/services/CryptoService.js';

describe('ExecutionLogService - Simplified Tests', () => {
  const TEST_ENCRYPTION_KEY = 'test-key-123';
  const originalLogs = [...executionLogService.logs];

  beforeEach(() => {
    // Clear logs before each test
    executionLogService.clearLogs();
    
    // Set up mocks for encrypt/decrypt
    CryptoService.encrypt.mockResolvedValue('encrypted-data');
    CryptoService.decrypt.mockResolvedValue(JSON.stringify({ test: 'data' }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Restore original logs
    executionLogService.logs = [...originalLogs];
  });

  describe('Basic Properties', () => {
    it('should have correct basic properties', () => {
      expect(executionLogService.logs).toBeDefined();
      expect(Array.isArray(executionLogService.logs)).toBe(true);
      expect(executionLogService.maxLogs).toBe(1000);
    });
  });

  describe('Log Creation', () => {
    it('should create and store a log entry successfully', async () => {
      const ruleId = 'rule_123';
      const action = 'transfer';
      const result = { success: true, amount: 100 };
      const metadata = { account: 'checking' };

      const logId = executionLogService.logExecution(ruleId, action, result, metadata);
      
      expect(logId).toBeDefined();
      expect(executionLogService.logs.length).toBe(1);
      
      const logEntry = executionLogService.logs[0];
      expect(logEntry.ruleId).toBe(ruleId);
      expect(logEntry.action).toBe(action);
      expect(logEntry.result).toEqual(result);
      expect(logEntry.metadata).toEqual(metadata);
      expect(logEntry.status).toBe('success');
    });

    it('should handle failed executions', () => {
      const ruleId = 'rule_456';
      const action = 'transfer';
      const result = { success: false, error: 'Insufficient funds' };

      const logId = executionLogService.logExecution(ruleId, action, result);
      
      expect(logId).toBeDefined();
      expect(executionLogService.logs.length).toBe(1);
      
      const logEntry = executionLogService.logs[0];
      expect(logEntry.status).toBe('failed');
    });

    it('should maintain log size limit', () => {
      // Add more than maxLogs entries
      for (let i = 0; i < 1100; i++) {
        executionLogService.logExecution(`rule_${i}`, 'test', { success: true });
      }
      
      expect(executionLogService.logs.length).toBeLessThanOrEqual(executionLogService.maxLogs);
    });
  });

  describe('Log Retrieval', () => {
    beforeEach(() => {
      // Add some test logs
      executionLogService.logExecution('rule_1', 'transfer', { success: true }, { account: 'checking' });
      executionLogService.logExecution('rule_2', 'transfer', { success: false }, { account: 'savings' });
      executionLogService.logExecution('rule_1', 'notification', { success: true }, { email: 'test@example.com' });
    });

    it('should retrieve all logs without filters', () => {
      const logs = executionLogService.getLogs();
      
      expect(logs.length).toBe(3);
      expect(new Date(logs[0].timestamp).getTime()).toBeGreaterThanOrEqual(new Date(logs[1].timestamp).getTime()); // Convert to numbers for comparison
    });

    it('should filter logs by ruleId', () => {
      const logs = executionLogService.getLogs({ ruleId: 'rule_1' });
      
      expect(logs.length).toBe(2);
      expect(logs.every(log => log.ruleId === 'rule_1')).toBe(true);
    });

    it('should filter logs by status', () => {
      const successLogs = executionLogService.getLogs({ status: 'success' });
      const failedLogs = executionLogService.getLogs({ status: 'failed' });
      
      expect(successLogs.length).toBe(2);
      expect(failedLogs.length).toBe(1);
    });

    it('should filter logs by date range', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const logs = executionLogService.getLogs({ since: oneHourAgo });
      
      expect(logs.length).toBe(3); // All logs should be within the last hour
    });
  });

  describe('Log Management', () => {
    it('should get specific log entry', () => {
      const logId = executionLogService.logExecution('rule_123', 'test', { success: true });
      
      const log = executionLogService.getLog(logId);
      
      expect(log).toBeDefined();
      expect(log.id).toBe(logId);
      expect(log.ruleId).toBe('rule_123');
    });

    it('should return undefined for non-existent log', () => {
      const log = executionLogService.getLog('non-existent-id');
      
      expect(log).toBeUndefined();
    });

    it('should clear all logs', () => {
      executionLogService.logExecution('rule_1', 'test', { success: true });
      executionLogService.logExecution('rule_2', 'test', { success: true });
      
      expect(executionLogService.logs.length).toBe(2);
      
      executionLogService.clearLogs();
      
      expect(executionLogService.logs.length).toBe(0);
    });
  });

  describe('Statistics', () => {
    beforeEach(() => {
      // Add test logs with known success/failure rates
      executionLogService.logExecution('rule_1', 'test', { success: true });
      executionLogService.logExecution('rule_2', 'test', { success: true });
      executionLogService.logExecution('rule_3', 'test', { success: false });
    });

    it('should generate correct statistics', () => {
      const stats = executionLogService.getStats();
      
      expect(stats.total).toBe(3);
      expect(stats.successful).toBe(2);
      expect(stats.failed).toBe(1);
      expect(stats.successRate).toBeCloseTo(66.67, 1);
    });

    it('should handle empty logs', () => {
      executionLogService.clearLogs();
      
      const stats = executionLogService.getStats();
      
      expect(stats.total).toBe(0);
      expect(stats.successful).toBe(0);
      expect(stats.failed).toBe(0);
      expect(stats.successRate).toBe(0);
    });
  });
}); 