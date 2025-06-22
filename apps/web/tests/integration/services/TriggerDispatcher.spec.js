import { describe, it, expect, beforeEach, vi } from 'vitest';
import { queueAction, getActionQueue, clearActionQueue } from '@/lib/services/TriggerDispatcher';
import { dispatchAction } from '@/lib/services/TriggerDispatcher';
import { useLogStore } from '@/core/store/logStore';

// Polyfill crypto.randomUUID for Node test environment
if (!global.crypto) {
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => 'mock-uuid-' + Math.random().toString(36).substr(2, 9);
}

// Mock the logStore
let mockActionLog = [];
const mockQueueAction = vi.fn((action) => {
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
  const queuedAction = {
    id,
    type: action.type,
    payload: { ...action, type: action.type },
    retryCount: 0,
    status: 'queued',
    timestamp: Date.now()
  };
  mockActionLog.push(queuedAction);
  return mockActionLog.length - 1;
});
const mockUpdateAction = vi.fn((index, updatedAction) => {
  mockActionLog[index] = updatedAction;
});
vi.mock('@/core/store/logStore', () => ({
  useLogStore: {
    getState: vi.fn(() => ({
      queueAction: mockQueueAction,
      updateAction: mockUpdateAction,
      get actionLog() { return mockActionLog; }
    }))
  }
}));

// Mock useUIStore for showPasswordPrompt and isSandboxMode
vi.mock('../../../src/lib/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => ({
      showPasswordPrompt: vi.fn(),
      isSandboxMode: false
    }))
  }
}));

// Mock canExecuteAction from PermissionEnforcer
vi.mock('../../../src/lib/services/PermissionEnforcer', () => ({
  canExecuteAction: vi.fn(() => Promise.resolve({ allowed: true }))
}));

// Mock global fetch for communication actions
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ status: 'success' })
})));

describe('TriggerDispatcher', () => {
  beforeEach(() => {
    clearActionQueue();
    vi.clearAllMocks();
    mockActionLog = [];
  });

  it('should queue actions for processing', () => {
    // Arrange
    const mockAction = {
      type: 'PLAID_TRANSFER',
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
      type: 'PLAID_TRANSFER',
      payload: expect.objectContaining({
        amount: 100,
        fromAccount: 'checking',
        toAccount: 'savings',
        type: 'PLAID_TRANSFER'
      }),
      status: 'queued',
      retryCount: 0,
      id: expect.any(String)
    }));
  });

  it('should maintain action order in queue', () => {
    // Arrange
    const mockAction1 = { type: 'PLAID_TRANSFER', amount: 100 };
    const mockAction2 = { type: 'SEND_NOTIFICATION', message: 'Test' };

    // Act
    queueAction(mockAction1);
    queueAction(mockAction2);

    // Assert
    const queue = getActionQueue();
    expect(queue).toHaveLength(2);
    expect(queue[0].type).toBe('PLAID_TRANSFER');
    expect(queue[1].type).toBe('SEND_NOTIFICATION');
  });

  it('should dispatch actions to the logStore', () => {
    // Arrange
    const mockRule = {
      id: 'rule_123',
      action: {
        type: 'PLAID_TRANSFER',
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
      actionType: 'PLAID_TRANSFER',
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
        type: 'SEND_NOTIFICATION',
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
