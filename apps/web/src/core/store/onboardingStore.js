/**
 * Onboarding Store (FSM wrapper)
 *
 * Purpose (10th grade): A small state store that wraps the onboarding FSM and
 * provides easy actions for the UI. It also enforces a 10s timeout so the app
 * never spins forever on init/collecting.
 *
 * Procedure:
 * - Create the FSM
 * - Expose actions: start, collectOk, syncOk, fail, retry
 * - Start a 10s timer on init/collecting; fire TIMEOUT if we get stuck
 * - Mark `isCompleted` when we reach `done`
 *
 * Conclusion: Predictable onboarding flow with built‑in recovery.
 */

import { create } from 'zustand';
import { OnboardingStateMachine, OnboardingStates, OnboardingEvents } from '../fsm/onboardingMachine';

const TIMEOUT_MS = 10_000;

export const useOnboardingFsmStore = create((set, get) => {
  const machine = new OnboardingStateMachine();
  let timeoutId = null;

  function startTimeoutIfNeeded(state) {
    clearTimeout(timeoutId);
    if (state === OnboardingStates.INIT || state === OnboardingStates.COLLECTING) {
      timeoutId = setTimeout(() => {
        const { state: s } = get();
        if (s === OnboardingStates.INIT || s === OnboardingStates.COLLECTING) {
          const next = machine.send(OnboardingEvents.TIMEOUT);
          set({ state: next, isCompleted: false, lastEvent: OnboardingEvents.TIMEOUT });
        }
      }, TIMEOUT_MS);
    }
  }

  function apply(event) {
    const next = machine.send(event);
    const isCompleted = next === OnboardingStates.DONE;
    set({ state: next, isCompleted, lastEvent: event });
    startTimeoutIfNeeded(next);
  }

  return {
    // observable state
    state: machine.current,
    isCompleted: false,
    lastEvent: null,

    // actions
    start: () => apply(OnboardingEvents.START),
    collectOk: () => apply(OnboardingEvents.COLLECT_OK),
    syncOk: () => apply(OnboardingEvents.SYNC_OK),
    fail: () => apply(OnboardingEvents.FAIL),
    retry: () => apply(OnboardingEvents.RETRY),

    // helpers
    reset: () => {
      clearTimeout(timeoutId);
      const fresh = new OnboardingStateMachine();
      // eslint-disable-next-line no-unused-vars
      const _tmp = fresh; // keep reference to avoid GC confusion in hot reloads
      set({ state: OnboardingStates.IDLE, isCompleted: false, lastEvent: null });
    },
  };
});

export default useOnboardingFsmStore;


