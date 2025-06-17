import { describe, it, expect, beforeEach, vi } from 'vitest';
import { executeAction } from '../../../src/lib/services/ExecutionController';
import { useUIStore } from '../../../src/lib/store/uiStore';
import { runSimulation } from '../../../src/lib/services/SimulationService';
import { useFinancialStateStore } from '../../../src/lib/store/financialStateStore';

// Mock the UI store
vi.mock('../../../src/lib/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => ({
      showConfirmationModal: vi.fn(),
      hideConfirmationModal: vi.fn()
    }))
  }
}));

// Mock the SimulationService
vi.mock('../../../src/lib/services/SimulationService', () => ({
  runSimulation: vi.fn()
}));

// Mock the FinancialStateStore
vi.mock('../../../src/lib/store/financialStateStore', () => ({
  useFinancialStateStore: {
    getState: vi.fn(() => ({
      getAccountBalance: vi.fn(),
      getGoal: vi.fn()
    }))
  }
}));

describe('Confirmation Modal Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show confirmation modal for high-risk actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'PLAID_TRANSFER',
      payload: {
        amount: 100,
        sourceAccount: 'acc_123',
        destinationAccount: 'acc_456'
      }
    };

    const mockUIStore = useUIStore.getState();
    const mockSimulationResult = {
      sourceBalance: 4500,
      destinationBalance: 10500,
      success: true
    };

    runSimulation.mockResolvedValue(mockSimulationResult);

    // Act
    const promise = executeAction(mockAction);

    // Assert
    expect(mockUIStore.showConfirmationModal).toHaveBeenCalledWith(
      mockAction,
      expect.any(Function),
      expect.any(Function)
    );

    // Simulate confirmation
    const [action, onConfirm] = mockUIStore.showConfirmationModal.mock.calls[0];
    await onConfirm();

    // Wait for the promise to resolve
    await expect(promise).resolves.toBeDefined();
  });

  it('should not show confirmation modal for low-risk actions', async () => {
    // Arrange
    const mockAction = {
      actionType: 'SEND_NOTIFICATION',
      payload: {
        message: 'Test notification'
      }
    };

    const mockUIStore = useUIStore.getState();

    // Act
    await executeAction(mockAction);

    // Assert
    expect(mockUIStore.showConfirmationModal).not.toHaveBeenCalled();
    expect(runSimulation).not.toHaveBeenCalled();
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

    const mockUIStore = useUIStore.getState();
    const mockSimulationResult = {
      sourceBalance: 4500,
      destinationBalance: 10500,
      success: true
    };

    runSimulation.mockResolvedValue(mockSimulationResult);

    // Act
    const promise = executeAction(mockAction);

    // Simulate cancellation
    const [action, onConfirm, onCancel] = mockUIStore.showConfirmationModal.mock.calls[0];
    onCancel();

    // Assert
    await expect(promise).rejects.toThrow('Action cancelled by user');
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

    const mockUIStore = useUIStore.getState();

    // Act
    await executeAction(mockAction, true);

    // Assert
    expect(mockUIStore.showConfirmationModal).not.toHaveBeenCalled();
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

    const mockUIStore = useUIStore.getState();
    const mockError = new Error('Simulation failed');
    runSimulation.mockRejectedValue(mockError);

    // Act
    const promise = executeAction(mockAction);

    // Assert
    expect(mockUIStore.showConfirmationModal).toHaveBeenCalled();
    expect(runSimulation).toHaveBeenCalledWith(mockAction, expect.any(Object));
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

    const mockUIStore = useUIStore.getState();
    const mockSimulationResult = {
      goalProgress: 75,
      remainingAmount: 500,
      success: true
    };

    runSimulation.mockResolvedValue(mockSimulationResult);

    // Act
    const promise = executeAction(mockAction);

    // Assert
    expect(mockUIStore.showConfirmationModal).toHaveBeenCalled();
    expect(runSimulation).toHaveBeenCalledWith(mockAction, expect.any(Object));

    // Simulate confirmation
    const [action, onConfirm] = mockUIStore.showConfirmationModal.mock.calls[0];
    await onConfirm();

    // Wait for the promise to resolve
    await expect(promise).resolves.toBeDefined();
  });
}); 