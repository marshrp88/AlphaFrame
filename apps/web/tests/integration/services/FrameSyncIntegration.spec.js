vi.mock('../../../src/lib/services/ExecutionController', () => ({
  ExecutionController: {
    executeAction: vi.fn()
  }
}));

vi.mock('../../../src/lib/store/logStore', () => ({
  useLogStore: {
    getState: vi.fn(() => ({
      queueAction: vi.fn(() => 'mock_action_id'),
      updateAction: vi.fn(),
      actionLog: []
    }))
  }
}));

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dispatchAction } from '../../../src/lib/services/TriggerDispatcher';
import { useLogStore } from '../../../src/lib/store/logStore';
import { ExecutionController } from '../../../src/lib/services/ExecutionController';

// Mock the ExecutionController static method
vi.spyOn(ExecutionController, 'executeAction').mockImplementation(() => Promise.resolve());

describe('FrameSync Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(useLogStore.getState().queueAction).toHaveBeenCalledWith(
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
      expect.objectContaining({
        ruleId: 'rule_123',
        actionType: 'PLAID_TRANSFER'
      })
    );

    expect(useLogStore.getState().updateAction).toHaveBeenCalledWith(
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
    await expect(dispatchAction(mockRule, mockTransaction)).rejects.toThrow('Transfer failed');

    expect(useLogStore.getState().queueAction).toHaveBeenCalled();
    expect(ExecutionController.executeAction).toHaveBeenCalled();
    expect(useLogStore.getState().updateAction).not.toHaveBeenCalled();
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
    expect(useLogStore.getState().queueAction).toHaveBeenCalledWith(
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
    expect(useLogStore.getState().updateAction).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({
        status: 'success'
      })
    );
  });
}); 