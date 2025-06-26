import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionController } from '../../../src/lib/services/ExecutionController';
import { ActionSchema } from '../../../src/lib/validation/schemas';

// Mock canExecuteAction to always allow
vi.mock('@/lib/services/PermissionEnforcer', () => ({
  canExecuteAction: vi.fn(() => Promise.resolve({ allowed: true }))
}));

// Mock useUIStore to provide showPasswordPrompt
vi.mock('@/core/store/uiStore', () => ({
  useUIStore: {
    getState: vi.fn(() => ({
      showPasswordPrompt: vi.fn(({ onConfirm }) => onConfirm('mock-password')),
      isSandboxMode: false
    }))
  }
}));

// Mock SecureVault to prevent vault locked errors - CLUSTER 4 FIX: Correct import path
vi.mock('@/core/services/SecureVault', () => ({
  isUnlocked: vi.fn(() => true),
  get: vi.fn(() => ({ token: 'mock-plaid-token' }))
}));

// Mock global fetch for Plaid API calls
vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({ transfer_id: 'mock-transfer-id' })
})));

it('sanity check', () => {
  expect(1 + 1).toBe(2);
});

describe('ExecutionController (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute a PLAID_TRANSFER action and return success', async () => {
    const action = { type: 'PLAID_TRANSFER', payload: { amount: 100 } };
    // Contract test: validate action with Zod
    const parsed = ActionSchema.safeParse(action);
    expect(parsed.success).toBe(true);
    const result = await ExecutionController.executeAction(action.type, action.payload);
    expect(result.transfer_id).toBe('mock-transfer-id');
  });

  it('should throw for unknown action type', async () => {
    await expect(ExecutionController.executeAction('UNKNOWN_TYPE', {})).rejects.toThrow('Unsupported action type: UNKNOWN_TYPE');
  });

  it('should throw for invalid action payload', async () => {
    await expect(ExecutionController.executeAction(undefined)).rejects.toThrow('Invalid action payload');
  });

  // Add more tests for edge cases as needed
});

// Notes:
// - This file is focused on ExecutionController logic only.
// - All external dependencies are mocked.
// - Each test is isolated and easy to understand for a 10th-grade reader. 
