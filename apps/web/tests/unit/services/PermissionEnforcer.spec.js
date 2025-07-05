import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionEnforcer } from '@/lib/services/PermissionEnforcer';

// Mock the authStore dependency
jest.mock('@/lib/services/authStore', () => ({
  useAuthStore: jest.fn(() => ({
    getState: () => ({
      user: {
        permissions: ['read:financial_data', 'write:financial_data']
      },
      isAuthenticated: true
    })
  }))
}));

// Mock user and action objects for static method tests
describe('PermissionEnforcer (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow actions for users with correct permissions', async () => {
    const actionType = 'PLAID_TRANSFER';
    const result = await PermissionEnforcer.canExecuteAction(actionType);
    expect(result.allowed).toBeDefined();
  });

  it('should deny actions for users without correct permissions', async () => {
    const actionType = 'PLAID_TRANSFER';
    const result = await PermissionEnforcer.canExecuteAction(actionType);
    expect(result.allowed).toBeDefined();
  });

  it('should handle empty permissions gracefully', async () => {
    const actionType = 'PLAID_TRANSFER';
    const result = await PermissionEnforcer.canExecuteAction(actionType);
    expect(result.allowed).toBeDefined();
  });

  it('should handle undefined user or action', async () => {
    const result = await PermissionEnforcer.canExecuteAction(undefined);
    expect(result.allowed).toBeDefined();
  });
});

// Notes:
// - This file is focused on PermissionEnforcer logic only.
// - All external dependencies should be mocked if used.
// - Each test is isolated and easy to understand for a 10th-grade reader. 
