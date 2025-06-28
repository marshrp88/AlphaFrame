import { describe, it, expect, beforeEach, vi } from '@jest/globals';
import { PermissionEnforcer } from '../../../src/lib/services/PermissionEnforcer';
import { useAuthStore } from '../../../src/core/store/authStore';
import { useUIStore } from '../../../src/core/store/uiStore';

// Mock the secureVault
jest.mock('../../../src/core/services/SecureVault', () => ({
  unlock: jest.fn()
}));

// Mock the auth store
jest.mock('../../../src/core/store/authStore', () => ({
  useAuthStore: {
    getState: jest.fn()
  }
}));

// Mock the UI store
jest.mock('../../../src/core/store/uiStore', () => ({
  useUIStore: {
    getState: jest.fn()
  }
}));

describe('PermissionEnforcer', () => {
  let mockAuthStore;
  let mockUIStore;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock auth store
    mockAuthStore = {
      isAuthenticated: true,
      user: {
        permissions: ['plaid:transfer', 'webhook:execute', 'goals:modify', 'transactions:modify']
      }
    };
    useAuthStore.getState.mockReturnValue(mockAuthStore);

    // Setup mock UI store
    mockUIStore = {
      showPasswordPrompt: jest.fn(({ onConfirm }) => onConfirm('test-password'))
    };
    useUIStore.getState.mockReturnValue(mockUIStore);
  });

  describe('canExecuteAction', () => {
    it('should allow low-risk actions for authenticated users', async () => {
      const result = await PermissionEnforcer.canExecuteAction('ADD_MEMO');
      expect(result).toEqual({ allowed: true });
    });

    it('should deny any action for unauthenticated users', async () => {
      mockAuthStore.isAuthenticated = false;

      const result = await PermissionEnforcer.canExecuteAction('ADD_MEMO');

      expect(result).toEqual({
        allowed: false,
        reason: 'User must be authenticated to execute actions'
      });
    });

    it('should deny actions if user lacks required permissions', async () => {
      mockAuthStore.user.permissions = ['transactions:modify']; // Missing plaid:transfer

      const result = await PermissionEnforcer.canExecuteAction('PLAID_TRANSFER');

      expect(result).toEqual({
        allowed: false,
        reason: 'User does not have required permissions'
      });
    });

    it('should allow high-risk actions after password confirmation', async () => {
      const result = await PermissionEnforcer.canExecuteAction('PLAID_TRANSFER');

      expect(result).toEqual({ allowed: true });
      expect(mockUIStore.showPasswordPrompt).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockUIStore.showPasswordPrompt.mockImplementation(() => { throw new Error('Test error'); });

      const result = await PermissionEnforcer.canExecuteAction('PLAID_TRANSFER');

      expect(result).toEqual({
        allowed: false,
        reason: 'Permission check failed'
      });
    });
  });

  describe('validateActionPayload', () => {
    it('should validate Plaid transfer payloads', () => {
      const validPayload = {
        amount: 100,
        fromAccount: 'acc_123',
        toAccount: 'acc_456'
      };
      expect(PermissionEnforcer.validateActionPayload('PLAID_TRANSFER', validPayload)).toBe(true);

      const invalidPayload = {
        amount: '100', // Should be number
        fromAccount: 'acc_123'
      };
      expect(PermissionEnforcer.validateActionPayload('PLAID_TRANSFER', invalidPayload)).toBe(false);
    });

    it('should validate webhook payloads', () => {
      const validPayload = {
        url: 'https://api.example.com/webhook',
        method: 'POST'
      };
      expect(PermissionEnforcer.validateActionPayload('WEBHOOK', validPayload)).toBe(true);

      const invalidPayload = {
        url: 'http://api.example.com/webhook', // Should be https
        method: 'GET' // Not allowed
      };
      expect(PermissionEnforcer.validateActionPayload('WEBHOOK', invalidPayload)).toBe(false);
    });

    it('should validate goal adjustment payloads', () => {
      const validPayload = {
        goalId: 'goal_123',
        amount: 100
      };
      expect(PermissionEnforcer.validateActionPayload('ADJUST_GOAL', validPayload)).toBe(true);

      const invalidPayload = {
        goalId: 'goal_123',
        amount: '100' // Should be number
      };
      expect(PermissionEnforcer.validateActionPayload('ADJUST_GOAL', invalidPayload)).toBe(false);
    });

    it('should validate memo payloads', () => {
      const validPayload = {
        memo: 'Test memo'
      };
      expect(PermissionEnforcer.validateActionPayload('ADD_MEMO', validPayload)).toBe(true);

      const invalidPayload = {
        memo: 'a'.repeat(201) // Too long
      };
      expect(PermissionEnforcer.validateActionPayload('ADD_MEMO', invalidPayload)).toBe(false);
    });

    it('should return false for unknown action types', () => {
      expect(PermissionEnforcer.validateActionPayload('UNKNOWN_ACTION', {})).toBe(false);
    });
  });
}); 
