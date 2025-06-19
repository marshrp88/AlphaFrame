// Define stable mock instances at the top
let mockActionLog = [];
const mockQueueAction = vi.fn((action) => {
  // Simulate adding the action to the log
  mockActionLog.push({ ...action, id: mockActionLog.length });
  return mockActionLog.length - 1;
});
const mockUpdateAction = vi.fn((index, updatedAction) => {
  mockActionLog[index] = updatedAction;
});

vi.mock('../../../src/lib/store/logStore', () => ({
  useLogStore: {
    getState: () => ({
      queueAction: mockQueueAction,
      updateAction: mockUpdateAction,
      get actionLog() { return mockActionLog; }
    })
  }
}));

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dispatchAction } from '../../../src/lib/services/TriggerDispatcher';
import { useLogStore } from '../../../src/lib/store/logStore';
import { ExecutionController } from '../../../src/lib/services/ExecutionController';

// Mock the ExecutionController static method
vi.spyOn(ExecutionController, 'executeAction').mockImplementation(() => Promise.resolve());

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
    ExecutionController.executeAction.mockClear();
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
    ExecutionController.executeAction.mockResolvedValue(mockResult);

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

    expect(ExecutionController.executeAction).toHaveBeenCalledWith(
      'PLAID_TRANSFER',
      expect.objectContaining({
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456',
        transactionId: 'tx_789'
      })
    );

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.any(Number),
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
    ExecutionController.executeAction.mockRejectedValue(mockError);

    // Act & Assert
    let error = null;
    try {
      await dispatchAction(mockRule, mockTransaction);
    } catch (e) {
      error = e;
      // Diagnostic output
      console.log('🧪 mockUpdateAction call count:', mockUpdateAction.mock.calls.length);
      console.log('🧪 mockQueueAction call count:', mockQueueAction.mock.calls.length);
      console.log('🧪 mockUpdateAction args:', mockUpdateAction.mock.calls);
      console.log('🧪 mockQueueAction args:', mockQueueAction.mock.calls);
      if (error) {
        console.log('❌ Full error object:', error);
        console.log('❌ Error message:', error.message);
        console.log('❌ Error name:', error.name);
      }
    }
    expect(mockQueueAction).toHaveBeenCalled();
    expect(mockUpdateAction).not.toHaveBeenCalled();
    expect(error && error.message).toBe('Transfer failed');
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
    ExecutionController.executeAction.mockResolvedValue(mockResult);

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

    expect(ExecutionController.executeAction).toHaveBeenCalled();
    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        status: 'success'
      })
    );
  });
}); 
