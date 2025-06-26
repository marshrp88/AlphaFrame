import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '@/core/store/useAppStore'

describe('useAppStore Zustand Store', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    useAppStore.setState({
      counter: 0,
      accounts: [],
      isLoading: false,
      error: null
    });
  });

  it('should have initial counter value of 0', () => {
    const counter = useAppStore.getState().counter;
    expect(counter).toBe(0);
  });

  it('should increment the counter', () => {
    const initialState = useAppStore.getState();
    useAppStore.getState().increment();
    const newState = useAppStore.getState();
    expect(newState.counter).toBe(initialState.counter + 1);
  });

  it('should reset the counter', () => {
    // First increment to have a non-zero value
    useAppStore.getState().increment();
    expect(useAppStore.getState().counter).toBe(1);
    
    // Then reset
    useAppStore.getState().reset();
    expect(useAppStore.getState().counter).toBe(0);
  });

  it('should manage accounts', () => {
    const testAccount = { id: '1', name: 'Test Account' };
    
    // Add account
    useAppStore.getState().addAccount(testAccount);
    expect(useAppStore.getState().accounts).toHaveLength(1);
    expect(useAppStore.getState().accounts[0]).toEqual(testAccount);
    
    // Update account
    useAppStore.getState().updateAccount('1', { name: 'Updated Account' });
    expect(useAppStore.getState().accounts[0].name).toBe('Updated Account');
    
    // Remove account
    useAppStore.getState().removeAccount('1');
    expect(useAppStore.getState().accounts).toHaveLength(0);
  });
}); 
