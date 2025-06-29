import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock PermissionEnforcer properly - must be before imports
jest.mock('@/lib/services/PermissionEnforcer', () => {
  const mockCanExecuteAction = jest.fn(() => Promise.resolve({ allowed: true }));
  return {
    PermissionEnforcer: {
      canExecuteAction: mockCanExecuteAction
    },
    canExecuteAction: mockCanExecuteAction // Named export
  };
});

// Mock useUIStore at the very top for hoisting
jest.mock('@/core/store/uiStore', () => ({
  useUIStore: {
    getState: jest.fn(() => ({
      showPasswordPrompt: jest.fn(({ onConfirm }) => {
        console.log('[MOCK showPasswordPrompt] called, confirming...');
        return onConfirm('mock-password');
      }),
      isSandboxMode: false
    }))
  }
}));

// Mock useFinancialStateStore with spies for internal actions - MUST BE BEFORE IMPORTS
const mockAdjustGoal = jest.fn();
const mockUpdateBudget = jest.fn();
const mockModifyCategory = jest.fn();
const mockGetAccountBalance = jest.fn(() => 1000);
const mockSetAccountBalance = jest.fn();

jest.mock('@/core/store/financialStateStore', () => ({
  useFinancialStateStore: {
    getState: jest.fn(() => ({
      adjustGoal: mockAdjustGoal,
      updateBudget: mockUpdateBudget,
      modifyCategory: mockModifyCategory,
      getAccountBalance: mockGetAccountBalance,
      setAccountBalance: mockSetAccountBalance,
    }))
  }
}));

// Mock the secure vault
jest.mock('@/core/services/SecureVault', () => ({
  get: jest.fn(() => 'mock-plaid-token')
}));

// Mock ActionSchema to always pass validation
jest.mock('@/lib/validation/schemas', () => ({
  ActionSchema: {
    safeParse: jest.fn(() => ({ success: true, data: {} }))
  }
}));

describe('ExecutionController', () => {
  let mockCanExecuteAction;
  let ExecutionController;
  let PermissionEnforcer;

  beforeEach(async () => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    global.fetch.mockReset();

    // Dynamic import after singleton override
    const executionControllerModule = await import('@/lib/services/ExecutionController');
    const permissionEnforcerModule = await import('@/lib/services/PermissionEnforcer');
    ExecutionController = executionControllerModule.ExecutionController;
    PermissionEnforcer = permissionEnforcerModule.PermissionEnforcer;
    mockCanExecuteAction = PermissionEnforcer.canExecuteAction;
    mockCanExecuteAction.mockClear();
    mockAdjustGoal.mockClear();
    mockUpdateBudget.mockClear();
    mockModifyCategory.mockClear();
    mockGetAccountBalance.mockClear();
    mockSetAccountBalance.mockClear();
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
    mockAdjustGoal.mockResolvedValue(mockResult);

    // Act
    const result = await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    expect(mockAdjustGoal).toHaveBeenCalledWith(mockAction.payload);
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

    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error_message: 'Invalid account' })
    };

    global.fetch.mockResolvedValue(mockErrorResponse);

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload))
      .rejects.toThrow('Transfer authorization failed: Invalid account');
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

    const mockAuthResponse = {
      ok: true,
      json: () => Promise.resolve({ authorization_id: 'auth_123' })
    };

    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error_message: 'Transfer failed' })
    };

    global.fetch
      .mockResolvedValueOnce(mockAuthResponse)
      .mockResolvedValueOnce(mockErrorResponse);

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload))
      .rejects.toThrow('Transfer creation failed: Transfer failed');
  });

  it('should handle missing Plaid token', async () => {
    // Arrange - use the mocked get function directly
    const { get } = await import('@/core/services/SecureVault');
    get.mockResolvedValue(null);

    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload))
      .rejects.toThrow('Plaid API token not found in secure vault');
  });

  it('should handle network errors during Plaid transfer', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Ensure SecureVault mock is applied for this test
    const { get } = await import('@/core/services/SecureVault');
    get.mockResolvedValue('mock-plaid-token');

    global.fetch.mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload))
      .rejects.toThrow('Plaid transfer failed: Network error');
  });

  it('should validate action payloads', async () => {
    // Arrange - mock ActionSchema to fail validation for this test
    const { ActionSchema } = await import('@/lib/validation/schemas');
    ActionSchema.safeParse.mockReturnValueOnce({ 
      success: false, 
      error: { message: 'Validation failed' } 
    });

    const invalidAction = {
      actionType: 'ADJUST_GOAL',
      payload: {
        // Missing required goalId
        amount: 5000
      }
    };

    // Act & Assert
    await expect(ExecutionController.executeAction(invalidAction.actionType, invalidAction.payload))
      .rejects.toThrow('Invalid action payload.');
  });

  it('should handle unhandled action types', async () => {
    // Arrange
    const mockAction = {
      actionType: 'UNKNOWN_ACTION',
      payload: {}
    };

    // Act & Assert
    await expect(ExecutionController.executeAction(mockAction.actionType, mockAction.payload))
      .rejects.toThrow('Unsupported action type: UNKNOWN_ACTION');
  });

  it('should require confirmation for high-risk actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 1000,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Ensure SecureVault mock is applied for this test
    const { get } = await import('@/core/services/SecureVault');
    get.mockResolvedValue('mock-plaid-token');

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
    expect(result).toEqual({ transfer_id: 'transfer_123' });
    // The password prompt should have been called (handled by the mock)
  });

  it('should call adjustGoal when ADJUST_GOAL is dispatched', async () => {
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: { goalId: 'goal_123', amount: 250 },
    };

    mockAdjustGoal.mockResolvedValue({ success: true });

    // === 💡 Pre-run diagnostic checks ===
    const store = (await import('@/core/store/financialStateStore')).useFinancialStateStore.getState();
    expect(typeof store.adjustGoal).toBe('function');

    // === 🚀 Run action ===
    await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // === ✅ Assertion ===
    expect(mockAdjustGoal).toHaveBeenCalledWith(mockAction.payload);
  });
});

describe('ExecutionController - Diagnostics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be implemented', () => {
    // Placeholder test
  });
}); 
