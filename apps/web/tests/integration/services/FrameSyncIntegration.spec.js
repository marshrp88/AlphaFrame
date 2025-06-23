import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';

// Mock ExecutionController properly - must be before imports
const mockExecuteAction = vi.fn();
vi.mock('../../../src/lib/services/ExecutionController', () => ({
  ExecutionController: {
    executeAction: mockExecuteAction
  }
}));

// Define stable mock instances at the top
let mockActionLog = [];
const mockQueueAction = vi.fn((action) => {
  // Simulate adding the action to the log
  const actionId = mockActionLog.length;
  mockActionLog.push({ ...action, id: actionId });
  return actionId;
});
const mockUpdateAction = vi.fn((index, updatedAction) => {
  if (mockActionLog[index]) {
    mockActionLog[index] = { ...mockActionLog[index], ...updatedAction };
  }
});

vi.mock('../../../src/core/store/logStore', () => ({
  useLogStore: {
    getState: () => ({
      queueAction: mockQueueAction,
      updateAction: mockUpdateAction,
      get actionLog() { return mockActionLog; }
    })
  }
}));

import { dispatchAction } from '../../../src/lib/services/TriggerDispatcher';
import { useLogStore } from '../../../src/core/store/logStore';
import { ExecutionController } from '../../../src/lib/services/ExecutionController';

// Suppress console.error during tests to avoid confusion from expected error logs
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  console.error.mockRestore();
});

describe('FrameSync Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueueAction.mockClear();
    mockUpdateAction.mockClear();
    mockActionLog = [];
    mockExecuteAction.mockClear();
  });

  it('should dispatch and execute a Plaid transfer action', async () => {
    // Arrange
    const mockRule = {
      id: 'rule_123',
      action: {
        type: 'PLAID_TRANSFER',
        payload: {
          amount: 100,
          sourceAccount: 'acc_123',
          destinationAccount: 'acc_456'
        }
      }
    };

    const mockTransaction = {
      id: 'tx_789',
      amount: 100,
      date: '2024-03-20'
    };

    const mockResult = { status: 'success' };
    mockExecuteAction.mockResolvedValue(mockResult);

    // Act
    await dispatchAction(mockRule, mockTransaction);

    // Assert
    expect(mockQueueAction).toHaveBeenCalledWith(
      expect.objectContaining({
        ruleId: 'rule_123',
        actionType: 'PLAID_TRANSFER',
        payload: expect.objectContaining({
          amount: 100,
          sourceAccount: 'acc_123',
          destinationAccount: 'acc_456',
          transactionId: 'tx_789'
        })
      })
    );

    expect(mockExecuteAction).toHaveBeenCalledWith(
      'PLAID_TRANSFER',
      expect.objectContaining({
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456',
        transactionId: 'tx_789'
      })
    );

    expect(mockUpdateAction).toHaveBeenCalledWith(
      0, // First action in the log
      expect.objectContaining({
        status: 'success'
      })
    );
  });

  it('should handle execution failures', async () => {
    // Arrange
    const mockRule = {
      id: 'rule_123',
      action: {
        type: 'PLAID_TRANSFER',
        payload: {
          amount: 100,
          sourceAccount: 'acc_123',
          destinationAccount: 'acc_456'
        }
      }
    };

    const mockTransaction = {
      id: 'tx_789',
      amount: 100,
      date: '2024-03-20'
    };

    const mockError = new Error('Transfer failed');
    mockExecuteAction.mockRejectedValue(mockError);

    // Act & Assert
    await expect(dispatchAction(mockRule, mockTransaction)).rejects.toThrow('Transfer failed');
    
    expect(mockQueueAction).toHaveBeenCalledWith(
      expect.objectContaining({
        ruleId: 'rule_123',
        actionType: 'PLAID_TRANSFER',
        payload: expect.objectContaining({
          amount: 100,
          sourceAccount: 'acc_123',
          destinationAccount: 'acc_456',
          transactionId: 'tx_789'
        })
      })
    );
    
    // Should not update action on failure
    expect(mockUpdateAction).not.toHaveBeenCalled();
  });

  it('should handle internal actions', async () => {
    // Arrange
    const mockRule = {
      id: 'rule_123',
      action: {
        type: 'ADJUST_GOAL',
        payload: {
          goalId: 'goal_123',
          adjustment: 100
        }
      }
    };

    const mockTransaction = {
      id: 'tx_789',
      amount: 100,
      date: '2024-03-20'
    };

    const mockResult = { status: 'success' };
    mockExecuteAction.mockResolvedValue(mockResult);

    // Act
    await dispatchAction(mockRule, mockTransaction);

    // Assert
    expect(mockQueueAction).toHaveBeenCalledWith(
      expect.objectContaining({
        ruleId: 'rule_123',
        actionType: 'ADJUST_GOAL',
        payload: expect.objectContaining({
          goalId: 'goal_123',
          adjustment: 100,
          transactionId: 'tx_789'
        })
      })
    );

    expect(mockExecuteAction).toHaveBeenCalledWith(
      'ADJUST_GOAL',
      expect.objectContaining({
        goalId: 'goal_123',
        adjustment: 100,
        transactionId: 'tx_789'
      })
    );
    
    expect(mockUpdateAction).toHaveBeenCalledWith(
      0, // First action in the log
      expect.objectContaining({
        status: 'success'
      })
    );
  });
}); 
