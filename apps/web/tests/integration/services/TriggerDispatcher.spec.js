import { describe, it, expect, beforeEach, vi } from 'vitest';
import { queueAction, getActionQueue, clearActionQueue } from '../../../src/lib/services/TriggerDispatcher';
import { dispatchAction } from '../../../src/lib/services/TriggerDispatcher';
import { useLogStore } from '../../../src/lib/store/logStore';

// Mock the logStore
vi.mock('../../../src/lib/store/logStore', () => ({
  useLogStore: {
    getState: vi.fn(() => ({
      queueAction: vi.fn()
    }))
  }
}));

describe('TriggerDispatcher', () => {
  let mockQueueAction;

  beforeEach(() => {
    clearActionQueue();
    // Reset mocks
    vi.clearAllMocks();
    mockQueueAction = useLogStore.getState().queueAction;
  });

  it('should queue actions for processing', () => {
    // Arrange
    const mockAction = {
      type: 'TRANSFER',
      amount: 100,
      fromAccount: 'checking',
      toAccount: 'savings'
    };

    // Act
    queueAction(mockAction);

    // Assert
    const queue = getActionQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0]).toEqual(expect.objectContaining({
      type: 'TRANSFER',
      amount: 100,
      fromAccount: 'checking',
      toAccount: 'savings',
      status: 'queued',
      timestamp: expect.any(Number)
    }));
  });

  it('should maintain action order in queue', () => {
    // Arrange
    const mockAction1 = { type: 'TRANSFER', amount: 100 };
    const mockAction2 = { type: 'NOTIFICATION', message: 'Test' };

    // Act
    queueAction(mockAction1);
    queueAction(mockAction2);

    // Assert
    const queue = getActionQueue();
    expect(queue).toHaveLength(2);
    expect(queue[0].type).toBe('TRANSFER');
    expect(queue[1].type).toBe('NOTIFICATION');
  });

  it('should dispatch actions to the logStore', () => {
    // Arrange
    const mockRule = {
      id: 'rule_123',
      action: {
        type: 'TRANSFER',
        payload: {
          fromAccount: 'checking',
          toAccount: 'savings'
        }
      }
    };

    const mockTransaction = {
      id: 'tx_456',
      amount: 100,
      date: '2024-03-20'
    };

    // Act
    dispatchAction(mockRule, mockTransaction);

    // Assert
    expect(mockQueueAction).toHaveBeenCalledWith(expect.objectContaining({
      ruleId: 'rule_123',
      actionType: 'TRANSFER',
      payload: expect.objectContaining({
        fromAccount: 'checking',
        toAccount: 'savings',
        transactionId: 'tx_456',
        amount: 100,
        timestamp: expect.any(Number)
      })
    }));
  });

  it('should include all required fields in the action payload', () => {
    // Arrange
    const mockRule = {
      id: 'rule_789',
      action: {
        type: 'NOTIFICATION',
        payload: {
          message: 'Test notification'
        }
      }
    };

    const mockTransaction = {
      id: 'tx_101',
      amount: 50,
      date: '2024-03-20'
    };

    // Act
    dispatchAction(mockRule, mockTransaction);

    // Assert
    const [actionPayload] = mockQueueAction.mock.calls[0];
    expect(actionPayload).toHaveProperty('ruleId');
    expect(actionPayload).toHaveProperty('actionType');
    expect(actionPayload).toHaveProperty('payload');
    expect(actionPayload.payload).toHaveProperty('transactionId');
    expect(actionPayload.payload).toHaveProperty('amount');
    expect(actionPayload.payload).toHaveProperty('timestamp');
  });
}); 