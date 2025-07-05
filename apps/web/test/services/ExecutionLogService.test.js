import { describe, it, expect, vi, beforeEach } from 'vitest';

// Manually inject the ExecutionLogService mock
vi.mock('@/lib/services/ExecutionLogService', () => ({
  default: {
    logExecution: vi.fn().mockReturnValue({
      id: 'exec-123',
      timestamp: '2024-01-01T00:00:00Z',
      status: 'success'
    }),
    getExecutionHistory: vi.fn().mockReturnValue([
      {
        id: 'exec-123',
        action: 'tax_calculation',
        timestamp: '2024-01-01T00:00:00Z',
        status: 'success',
        duration: 150
      }
    ]),
    clearLogs: vi.fn().mockReturnValue(true)
  }
}));

import ExecutionLogService from '@/lib/services/ExecutionLogService';

describe('ExecutionLogService Mock Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use mocked ExecutionLogService instead of real implementation', () => {
    const result = ExecutionLogService.logExecution({
      action: 'tax_calculation',
      input: { income: 50000 },
      output: { tax: 5000 }
    });
    
    expect(ExecutionLogService.logExecution).toHaveBeenCalledWith({
      action: 'tax_calculation',
      input: { income: 50000 },
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