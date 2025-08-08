/**
 * Onboarding Store (FSM wrapper) with 10s timeout.
 */
import { create } from 'zustand';
import { OnboardingStateMachine, OnboardingStates, OnboardingEvents } from '../fsm/onboardingMachine';

const TIMEOUT_MS = 10_000;

export const useOnboardingFsmStore = create((set, get) => {
  const machine = new OnboardingStateMachine();
  let timeoutId = null;

  function armTimeout(state) {
    clearTimeout(timeoutId);
    if (state === OnboardingStates.INIT || state === OnboardingStates.COLLECTING) {
      timeoutId = setTimeout(() => {
        const s = get().state;
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
    armTimeout(next);
  }

  return {
    state: machine.current,
    isCompleted: false,
    lastEvent: null,
    start: () => apply(OnboardingEvents.START),
    collectOk: () => apply(OnboardingEvents.COLLECT_OK),
    syncOk: () => apply(OnboardingEvents.SYNC_OK),
    fail: () => apply(OnboardingEvents.FAIL),
    retry: () => apply(OnboardingEvents.RETRY),
    reset: () => { clearTimeout(timeoutId); set({ state: OnboardingStates.IDLE, isCompleted: false, lastEvent: null }); },
  };
});

export default useOnboardingFsmStore;

