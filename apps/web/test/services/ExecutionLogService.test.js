import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the ExecutionLogService mock
vi.mock('@/core/services/ExecutionLogService', () => ({
  default: {
    logExecution: vi.fn(() => ({
      id: 'exec-123',
      status: 'success',
      timestamp: new Date().toISOString(),
      action: 'tax_calculation',
      output: { tax: 5000 }
    })),
    getExecutionHistory: vi.fn(() => [{
      id: 'exec-123',
      action: 'tax_calculation',
      status: 'success',
      timestamp: new Date().toISOString(),
      output: { tax: 5000 }
    }]),
    clearLogs: vi.fn(() => true)
  }
}));

import ExecutionLogService from '@/core/services/ExecutionLogService';

describe('ExecutionLogService Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mocked ExecutionLogService instead of real implementation', () => {
    const result = ExecutionLogService.logExecution('tax_calculation', {
      input: { income: 75000 },
      output: { tax: 5000 }
    });
    expect(result.id).toBe('exec-123');
    expect(result.status).toBe('success');
  });

  it('should mock execution history retrieval', () => {
    const history = ExecutionLogService.getExecutionHistory();
    
    expect(ExecutionLogService.getExecutionHistory).toHaveBeenCalled();
    expect(history).toHaveLength(1);
    expect(history[0].action).toBe('tax_calculation');
    expect(history[0].status).toBe('success');
  });

  it('should mock log clearing', () => {
    const result = ExecutionLogService.clearLogs();

    expect(ExecutionLogService.clearLogs).toHaveBeenCalled();
    expect(result).toBe(true);
  });
}); 