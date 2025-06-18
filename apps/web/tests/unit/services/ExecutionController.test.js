import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionController } from '../../../src/lib/services/ExecutionController';
import { ActionSchema } from '../../../src/lib/validation/schemas';

// Mock canExecuteAction to always allow
vi.mock('@/lib/services/PermissionEnforcer', () => ({
  canExecuteAction: vi.fn(() => Promise.resolve({ allowed: true }))
}));

// Mock useUIStore to provide showPasswordPrompt
vi.mock('@/lib/store/uiStore', () => ({
  useUIStore: {
    getState: () => ({
      showPasswordPrompt: vi.fn(({ onConfirm }) => onConfirm('mock-password')),
      isSandboxMode: false
    })
  }
}));

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
    expect(result.success).toBe(true);
    expect(result.transferId).toBeDefined();
  });

  it('should throw for unknown action type', async () => {
    await expect(ExecutionController.executeAction('UNKNOWN_TYPE', {})).rejects.toThrow('Unknown action type');
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