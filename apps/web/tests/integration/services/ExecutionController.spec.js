import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeAction } from '../../../src/lib/services/ExecutionController';

// Mock the financial state store
vi.mock('../../../src/lib/store/financialStateStore', () => ({
  useFinancialStateStore: {
    getState: vi.fn(() => ({
      adjustGoal: vi.fn(),
      updateBudget: vi.fn(),
      modifyCategory: vi.fn()
    }))
  }
}));

// Mock the global fetch
global.fetch = vi.fn();

describe('ExecutionController', () => {
  let mockStore;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    mockStore = useFinancialStateStore.getState();
    global.fetch.mockReset();
  });

  it('should execute internal actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: {
        goalId: 'goal_123',
        newAmount: 5000
      }
    };

    const mockResult = { success: true };
    mockStore.adjustGoal.mockResolvedValue(mockResult);

    // Act
    const result = await executeAction(mockAction);

    // Assert
    expect(mockStore.adjustGoal).toHaveBeenCalledWith(mockAction.payload);
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
    const result = await executeAction(mockAction);

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

  it('should handle internal action errors', async () => {
    // Arrange
    const mockAction = {
      actionType: 'ADJUST_GOAL',
      payload: { goalId: 'invalid' }
    };

    mockStore.adjustGoal.mockRejectedValue(new Error('Invalid goal'));

    // Act & Assert
    await expect(executeAction(mockAction)).rejects.toThrow('Invalid goal');
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
    await expect(executeAction(mockAction)).rejects.toThrow('Communication action failed: Invalid recipient');
  });

  it('should reject unsupported action types', async () => {
    // Arrange
    const mockAction = {
      actionType: 'UNSUPPORTED_ACTION',
      payload: {}
    };

    // Act & Assert
    await expect(executeAction(mockAction)).rejects.toThrow('Unsupported action type: UNSUPPORTED_ACTION');
  });
}); 