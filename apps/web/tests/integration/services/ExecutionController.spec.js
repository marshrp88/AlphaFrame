// Define spies for store methods
const adjustGoalSpy = vi.fn();
const updateBudgetSpy = vi.fn();
const modifyCategorySpy = vi.fn();
const getAccountBalanceSpy = vi.fn(() => 1000);
const setAccountBalanceSpy = vi.fn();

// Mock useUIStore at the very top for hoisting
vi.mock('@/core/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => ({
      showPasswordPrompt: vi.fn(({ onConfirm }) => {
        console.log('[MOCK showPasswordPrompt] called, confirming...');
        return onConfirm('mock-password');
      }),
      isSandboxMode: false
    }))
  }
}));

// Mock canExecuteAction to always allow
vi.mock('@/core/services/PermissionEnforcer', () => ({
  canExecuteAction: vi.fn(() => Promise.resolve({ allowed: true }))
}));

// Mock useFinancialStateStore with spies for internal actions
vi.mock('@/core/store/financialStateStore', () => ({
  useFinancialStateStore: {
    getState: vi.fn(() => {
      console.log('[MOCK getState()] returning store with spies...');
      return {
        adjustGoal: adjustGoalSpy,
        updateBudget: updateBudgetSpy,
        modifyCategory: modifyCategorySpy,
        getAccountBalance: getAccountBalanceSpy,
        setAccountBalance: setAccountBalanceSpy,
      };
    })
  }
}));

import { useFinancialStateStore } from '@/core/store/financialStateStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionController } from '@/core/services/ExecutionController';

// Mock the secure vault
vi.mock('@/core/services/secureVault', () => ({
  get: vi.fn(() => 'mock-plaid-token')
}));

// Mock the global fetch
global.fetch = vi.fn();

describe('ExecutionController', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    global.fetch.mockReset();
  });

  it('should execute internal actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: {
        goalId: 'goal_123',
        amount: 5000
      }
    };

    const mockResult = { success: true };
    adjustGoalSpy.mockResolvedValue(mockResult);

    // Act
    const result = await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    expect(adjustGoalSpy).toHaveBeenCalledWith(mockAction.payload);
    expect(result).toEqual(mockResult);
  });

  it('should execute communication actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'SEND_EMAIL',
      payload: {
        to: 'user@example.com',
        subject: 'Budget Alert',
        body: 'Your budget has been exceeded'
      }
    };

    const mockResponse = { success: true };
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    // Act
    const result = await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/send-email',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockAction.payload)
      })
    );
    expect(result).toEqual(mockResponse);
  });

  it('should execute Plaid transfer actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456',
        description: 'Test transfer'
      }
    };

    const mockAuthResponse = {
      ok: true,
      json: () => Promise.resolve({ authorization_id: 'auth_123' })
    };

    const mockTransferResponse = {
      ok: true,
      json: () => Promise.resolve({ transfer_id: 'transfer_123' })
    };

    global.fetch
      .mockResolvedValueOnce(mockAuthResponse)
      .mockResolvedValueOnce(mockTransferResponse);

    // Act
    const result = await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    expect(global.fetch).toHaveBeenCalledTimes(2);
    
    // Check authorization request
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://api.plaid.com/transfer/authorization/create',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Plaid-Version': '2020-09-14',
          'Authorization': 'Bearer mock-plaid-token'
        },
        body: JSON.stringify({
          access_token: 'mock-plaid-token',
          account_id: 'acc_123',
          type: 'credit',
          network: 'ach',
          amount: '1000',
          description: 'Test transfer'
        })
      })
    );

    // Check transfer request
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'https://api.plaid.com/transfer/create',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Plaid-Version': '2020-09-14',
          'Authorization': 'Bearer mock-plaid-token'
        },
        body: JSON.stringify({
          access_token: 'mock-plaid-token',
          authorization_id: 'auth_123',
          account_id: 'acc_456',
          description: 'Test transfer'
        })
      })
    );

    expect(result).toEqual({ transfer_id: 'transfer_123' });
  });

  it('should handle Plaid transfer authorization failure', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ error_message: 'Invalid token' })
    });

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Transfer authorization failed: Invalid token');
  });

  it('should handle Plaid transfer creation failure', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ authorization_id: 'auth_123' })
      })
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
        json: () => Promise.resolve({ error_message: 'Invalid account' })
      });

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Transfer creation failed: Invalid account');
  });

  it('should handle missing Plaid API token', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    const { get } = await import('@/core/services/secureVault');
    get.mockResolvedValueOnce(null);

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Plaid API token not found in secure vault');
  });

  it('should handle internal action errors', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: { goalId: 'invalid' }
    };

    adjustGoalSpy.mockRejectedValue(new Error('Invalid goal'));

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Invalid goal');
  });

  it('should handle communication action errors', async () => {
    // Arrange
    const mockAction = {
      actionType: 'SEND_EMAIL',
      payload: { to: 'invalid' }
    };

    global.fetch.mockResolvedValue({
      ok: false,
      statusText: 'Invalid recipient'
    });

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Communication action failed: Invalid recipient');
  });

  it('should reject unsupported action types', async () => {
    // Arrange
    const mockAction = {
      actionType: 'UNSUPPORTED_ACTION',
      payload: {}
    };

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload)).rejects.toThrow('Unsupported action type: UNSUPPORTED_ACTION');
  });
});

describe('ExecutionController - Diagnostics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call adjustGoal when ADJUST_GOAL is dispatched', async () => {
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: { goalId: 'goal_123', amount: 250 },
    };

    // Set up spy to return success
    adjustGoalSpy.mockResolvedValue({ success: true });

    // === 💡 Pre-run diagnostic checks ===
    const store = (await import('../../../src/core/store/financialStateStore')).useFinancialStateStore.getState();
    console.log('[TEST] Retrieved store:', store);
    console.log('[TEST] typeof store.adjustGoal =', typeof store.adjustGoal);
    expect(typeof store.adjustGoal).toBe('function');

    // === 🚀 Run action ===
    console.log('[TEST] Calling ExecutionController.executeAction...');
    await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);
    console.log('[TEST] Execution complete.');

    // === ✅ Assertion ===
    expect(adjustGoalSpy).toHaveBeenCalledWith(mockAction.payload);
  });
}); 
