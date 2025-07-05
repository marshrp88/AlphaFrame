import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the useAppStore before importing
vi.mock('@/store/useAppStore', () => ({
  default: vi.fn(() => ({
    user: {
      id: 'test-user-123',
      email: 'test@example.com',
      isAuthenticated: true
    },
    financialData: {
      accounts: [
        { id: '1', name: 'Checking', balance: 5000 },
        { id: '2', name: 'Savings', balance: 15000 }
      ],
      totalBalance: 20000
    },
    updateUser: vi.fn(),
    updateFinancialData: vi.fn(),
    resetStore: vi.fn()
  }))
}));

import useAppStore from '@/store/useAppStore';

describe('useAppStore Mock Validation', () => {
  let mockStore;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = useAppStore();
  });

  it('should use mocked useAppStore instead of real implementation', () => {
    expect(mockStore.user.id).toBe('test-user-123');
    expect(mockStore.user.isAuthenticated).toBe(true);
    expect(mockStore.financialData.totalBalance).toBe(20000);
  });

  it('should have mockable action functions', () => {
    expect(mockStore.updateUser).toBeDefined();
    expect(mockStore.updateFinancialData).toBeDefined();
    expect(mockStore.resetStore).toBeDefined();
  });

  it('should allow calling mock actions', () => {
    mockStore.updateUser({ name: 'John Doe' });
    expect(mockStore.updateUser).toHaveBeenCalledWith({ name: 'John Doe' });
  });

  it('should provide realistic financial data structure', () => {
    expect(mockStore.financialData.accounts).toHaveLength(2);
    expect(mockStore.financialData.accounts[0].name).toBe('Checking');
    expect(mockStore.financialData.accounts[1].balance).toBe(15000);
  });
}); 