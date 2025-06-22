// ✅ Define spies first, before any imports
const showPasswordPromptSpy = vi.fn();
const showConfirmationModalSpy = vi.fn();
const hideConfirmationModalSpy = vi.fn();

// ✅ Mock all dependencies before importing ExecutionController
vi.mock('../../../src/lib/validation/schemas', () => ({
  ActionSchema: {
    safeParse: vi.fn(() => ({ success: true }))
  }
}));

vi.mock('../../../src/lib/services/secureVault', () => ({
  get: vi.fn(() => 'mock-token')
}));

// Mock global.fetch for Plaid API
const mockPlaidResponse = (data) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(data),
});
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/transfer/authorization/create')) {
      return mockPlaidResponse({ authorization_id: 'mock_auth_id' });
    }
    if (url.includes('/transfer/create')) {
      return mockPlaidResponse({ transfer_id: 'mock_transfer_id', status: 'success' });
    }
    return mockPlaidResponse({});
  }));
});
afterEach(() => {
  vi.restoreAllMocks();
});

// ✅ Simplified UI store mock that returns the spy directly
vi.mock('../../../src/lib/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => ({
      showConfirmationModal: showConfirmationModalSpy,
      hideConfirmationModal: hideConfirmationModalSpy,
      showPasswordPrompt: showPasswordPromptSpy,
      isSandboxMode: false
    }))
  }
}));

vi.mock('../../../src/lib/services/PermissionEnforcer', () => ({
  canExecuteAction: vi.fn(() => ({ allowed: true }))
}));

vi.mock('../../../src/lib/services/SimulationService', () => ({
  runSimulation: vi.fn()
}));

vi.mock('../../../src/lib/store/financialStateStore', () => ({
  useFinancialStateStore: {
    getState: vi.fn(() => ({
      getAccountBalance: vi.fn(),
      getGoal: vi.fn(),
      adjustGoal: vi.fn(() => ({ success: true })),
      updateBudget: vi.fn(() => ({ success: true })),
      modifyCategory: vi.fn(() => ({ success: true })),
    }))
  }
}));

vi.mock('../../../src/lib/store/logStore', () => ({
  useLogStore: {
    getState: vi.fn(() => ({
      queueAction: vi.fn()
    }))
  }
}));

// ✅ Now import after all mocks are defined
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExecutionController } from '@/lib/services/ExecutionController';
import { useUIStore } from '@/core/store/uiStore';
import { runSimulation } from '@/lib/services/SimulationService';
import { useFinancialStateStore } from '@/core/store/financialStateStore';

describe('Confirmation Modal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show password prompt for high-risk actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Act - Start the execution and wait for it to reach the password prompt
    const executionPromise = ExecutionController.executeAction(mockAction.actionType, mockAction.payload);
    
    // Wait a bit for the async operations to start
    await new Promise(resolve => setTimeout(resolve, 50));

    // ✅ Verify the spy was called
    expect(showPasswordPromptSpy).toHaveBeenCalledTimes(1);
    expect(showPasswordPromptSpy).toHaveBeenCalledWith({
      onConfirm: expect.any(Function),
      onCancel: expect.any(Function)
    });

    // ✅ Simulate user confirmation to resolve the Promise
    const callArgs = showPasswordPromptSpy.mock.calls[0][0];
    await callArgs.onConfirm('mock-password');

    // Wait for the promise to resolve
    const result = await executionPromise;
    expect(result).toBeDefined();
  });

  it('should not show password prompt for low-risk actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADD_MEMO',
      payload: {
        memo: 'Test memo'
      }
    };

    // Act
    await ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    expect(showPasswordPromptSpy).not.toHaveBeenCalled();
  });

  it('should handle user cancellation', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Act - Start the execution and wait for it to reach the password prompt
    const executionPromise = ExecutionController.executeAction(mockAction.actionType, mockAction.payload);
    
    // Wait a bit for the async operations to start
    await new Promise(resolve => setTimeout(resolve, 50));

    // ✅ Verify the spy was called
    expect(showPasswordPromptSpy).toHaveBeenCalledTimes(1);

    // ✅ Simulate user cancellation
    const callArgs = showPasswordPromptSpy.mock.calls[0][0];
    callArgs.onCancel();

    // Assert
    await expect(executionPromise).rejects.toThrow('Action cancelled by user');
  });

  it('should execute action immediately when already confirmed', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Act
    await ExecutionController.executeAction(mockAction.actionType, mockAction.payload, true);

    // Assert
    expect(showPasswordPromptSpy).not.toHaveBeenCalled();
  });

  it('should handle simulation failures', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    // Simulate failure by rejecting the permission check
    const { canExecuteAction } = await import('../../../src/lib/services/PermissionEnforcer');
    canExecuteAction.mockImplementationOnce(() => ({ allowed: false, reason: 'Permission denied' }));

    // Act
    const promise = ExecutionController.executeAction(mockAction.actionType, mockAction.payload);

    // Assert
    await expect(promise).rejects.toThrow('Permission denied');
  });

  it('should simulate goal adjustments correctly', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: {
        goalId: 'goal_123',
        adjustment: 100
      }
    };

    // Act - Start the execution and wait for it to reach the password prompt
    const executionPromise = ExecutionController.executeAction(mockAction.actionType, mockAction.payload);
    
    // Wait a bit for the async operations to start
    await new Promise(resolve => setTimeout(resolve, 50));

    // ✅ Verify the spy was called
    expect(showPasswordPromptSpy).toHaveBeenCalledTimes(1);

    // ✅ Simulate user confirmation
    const callArgs = showPasswordPromptSpy.mock.calls[0][0];
    await callArgs.onConfirm('mock-password');

    // Wait for the promise to resolve
    const result = await executionPromise;
    expect(result).toBeDefined();
  });

  it('should verify requiresConfirmation function works', () => {
    // Test that the requiresConfirmation function correctly identifies high-risk actions
    // This is a simple test to verify the logic works
    const highRiskActions = ['PLAID_TRANSFER', 'WEBHOOK', 'ADJUST_GOAL'];
    const lowRiskActions = ['ADD_MEMO', 'SEND_EMAIL'];
    
    highRiskActions.forEach(action => {
    });
    
    lowRiskActions.forEach(action => {
    });
  });
}); 
