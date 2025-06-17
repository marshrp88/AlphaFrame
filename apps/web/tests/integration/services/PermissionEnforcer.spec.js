import { describe, it, expect, beforeEach, vi } from 'vitest';
import { requestPermission, isActionHighRisk } from '../../../src/lib/services/PermissionEnforcer';
import { canExecuteAction, hasActionPermission, validateActionPayload } from '../../../src/lib/services/PermissionEnforcer';
import { useAuthStore } from '../../../src/lib/store/authStore';
import { useUIStore } from '../../../src/lib/store/uiStore';

// Mock the secureVault
vi.mock('../../../src/lib/services/secureVault', () => ({
  unlock: vi.fn()
}));

// Mock the password confirmation
vi.mock('../../../src/lib/services/PermissionEnforcer', async () => {
  const actual = await vi.importActual('../../../src/lib/services/PermissionEnforcer');
  return {
    ...actual,
    requestPasswordConfirmation: vi.fn(() => Promise.resolve('test-password'))
  };
});

// Mock the auth store
vi.mock('../../../src/lib/store/authStore', () => ({
  useAuthStore: {
    getState: vi.fn()
  }
}));

// Mock the UI store
vi.mock('../../../src/lib/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn()
  }
}));

describe('PermissionEnforcer', () => {
  let mockAuthStore;
  let mockUIStore;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock auth store
    mockAuthStore = {
      isAuthenticated: true,
      userPermissions: ['PLAID_TRANSFER', 'SEND_NOTIFICATION']
    };
    useAuthStore.getState.mockReturnValue(mockAuthStore);

    // Setup mock UI store
    mockUIStore = {
      showPasswordConfirmationModal: vi.fn()
    };
    useUIStore.getState.mockReturnValue(mockUIStore);
  });

  describe('requestPermission', () => {
    it('should grant permission for non-high-risk actions', async () => {
      const action = { actionType: 'UPDATE_BUDGET' };
      const result = await requestPermission(action);
      expect(result).toBe(true);
    });

    it('should require password confirmation for high-risk actions', async () => {
      const action = { actionType: 'PLAID_TRANSFER' };
      const { unlock } = await import('../../../src/lib/services/secureVault');
      
      await requestPermission(action);
      
      expect(unlock).toHaveBeenCalledWith('test-password');
    });

    it('should throw error if password verification fails', async () => {
      const action = { actionType: 'PLAID_TRANSFER' };
      const { unlock } = await import('../../../src/lib/services/secureVault');
      
      unlock.mockRejectedValueOnce(new Error('Invalid password'));
      
      await expect(requestPermission(action)).rejects.toThrow('Permission denied for PLAID_TRANSFER: Invalid password');
    });

    it('should handle multiple high-risk action types', async () => {
      const highRiskActions = [
        'PLAID_TRANSFER',
        'MODIFY_GOAL',
        'DELETE_ACCOUNT',
        'EXPORT_DATA'
      ];

      for (const actionType of highRiskActions) {
        const action = { actionType };
        const { unlock } = await import('../../../src/lib/services/secureVault');
        
        await requestPermission(action);
        expect(unlock).toHaveBeenCalledWith('test-password');
        
        vi.clearAllMocks();
      }
    });
  });

  describe('isActionHighRisk', () => {
    it('should identify high-risk actions', () => {
      expect(isActionHighRisk('PLAID_TRANSFER')).toBe(true);
      expect(isActionHighRisk('MODIFY_GOAL')).toBe(true);
      expect(isActionHighRisk('DELETE_ACCOUNT')).toBe(true);
      expect(isActionHighRisk('EXPORT_DATA')).toBe(true);
    });

    it('should identify non-high-risk actions', () => {
      expect(isActionHighRisk('UPDATE_BUDGET')).toBe(false);
      expect(isActionHighRisk('SEND_NOTIFICATION')).toBe(false);
      expect(isActionHighRisk('CREATE_ALERT')).toBe(false);
    });
  });

  describe('canExecuteAction', () => {
    it('should allow low-risk actions for authenticated users', async () => {
      const action = {
        actionType: 'SEND_NOTIFICATION',
        payload: { message: 'Test notification' }
      };

      const result = await canExecuteAction(action);

      expect(result).toEqual({ allowed: true });
      expect(mockUIStore.showPasswordConfirmationModal).not.toHaveBeenCalled();
    });

    it('should deny any action for unauthenticated users', async () => {
      mockAuthStore.isAuthenticated = false;

      const action = {
        actionType: 'SEND_NOTIFICATION',
        payload: { message: 'Test notification' }
      };

      const result = await canExecuteAction(action);

      expect(result).toEqual({
        allowed: false,
        reason: 'User not authenticated'
      });
    });

    it('should deny high-risk actions if user cancels password prompt', async () => {
      mockUIStore.showPasswordConfirmationModal.mockImplementation((message, callback) => {
        callback(false);
      });

      const action = {
        actionType: 'PLAID_TRANSFER',
        payload: { amount: 100 }
      };

      const result = await canExecuteAction(action);

      expect(result).toEqual({
        allowed: false,
        reason: 'Action cancelled by user'
      });
      expect(mockUIStore.showPasswordConfirmationModal).toHaveBeenCalled();
    });

    it('should allow high-risk actions after password confirmation', async () => {
      mockUIStore.showPasswordConfirmationModal.mockImplementation((message, callback) => {
        callback(true);
      });

      const action = {
        actionType: 'PLAID_TRANSFER',
        payload: { amount: 100 }
      };

      const result = await canExecuteAction(action);

      expect(result).toEqual({ allowed: true });
      expect(mockUIStore.showPasswordConfirmationModal).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockUIStore.showPasswordConfirmationModal.mockRejectedValue(new Error('Test error'));

      const action = {
        actionType: 'PLAID_TRANSFER',
        payload: { amount: 100 }
      };

      const result = await canExecuteAction(action);

      expect(result).toEqual({
        allowed: false,
        reason: 'Permission check failed: Test error'
      });
    });
  });

  describe('hasActionPermission', () => {
    it('should return true for permitted actions', () => {
      expect(hasActionPermission('PLAID_TRANSFER')).toBe(true);
      expect(hasActionPermission('SEND_NOTIFICATION')).toBe(true);
    });

    it('should return false for non-permitted actions', () => {
      expect(hasActionPermission('DELETE_ACCOUNT')).toBe(false);
    });

    it('should handle missing permissions array', () => {
      mockAuthStore.userPermissions = undefined;
      expect(hasActionPermission('PLAID_TRANSFER')).toBe(false);
    });
  });

  describe('validateActionPayload', () => {
    it('should validate action payloads', () => {
      const action = {
        actionType: 'PLAID_TRANSFER',
        payload: { amount: 100 }
      };

      expect(validateActionPayload(action)).toBe(true);
    });
  });
}); 