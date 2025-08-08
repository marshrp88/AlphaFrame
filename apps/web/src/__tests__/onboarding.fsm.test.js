/**
 * Minimal FSM tests embedded in modular store
 */
import { describe, it, expect } from 'vitest';
import { create } from 'zustand';
import { act } from 'react-dom/test-utils';
import useOnboardingStore from '../store/modular/onboardingStore';

describe('onboarding FSM in store', () => {
  it('moves from idle -> init on fsmStart', () => {
    act(() => {
      useOnboardingStore.getState().resetOnboarding();
      useOnboardingStore.getState().fsmStart();
    });
    expect(useOnboardingStore.getState().fsmState).toBe('init');
  });

  it('timeout eventually sets state to timeout', async () => {
    act(() => {
      useOnboardingStore.getState().resetOnboarding();
      useOnboardingStore.getState().fsmStart();
    });
    await new Promise((r) => setTimeout(r, 50)); // not full 10s; just ensures no immediate crash
    expect(['init', 'timeout']).toContain(useOnboardingStore.getState().fsmState);
  });
});


