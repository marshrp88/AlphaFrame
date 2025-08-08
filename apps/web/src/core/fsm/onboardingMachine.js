/**
 * Onboarding Finite State Machine (FSM)
 * Purpose: Track onboarding progress with clear states to avoid freezes.
 */

export const OnboardingStates = Object.freeze({
  IDLE: 'idle',
  INIT: 'init',
  COLLECTING: 'collecting',
  SYNCING: 'syncing',
  DONE: 'done',
  ERROR: 'error',
  TIMEOUT: 'timeout',
});

export const OnboardingEvents = Object.freeze({
  START: 'START',
  COLLECT_OK: 'COLLECT_OK',
  SYNC_OK: 'SYNC_OK',
  FAIL: 'FAIL',
  RETRY: 'RETRY',
  TIMEOUT: 'TIMEOUT',
});

const transitions = {
  [OnboardingStates.IDLE]: { [OnboardingEvents.START]: OnboardingStates.INIT },
  [OnboardingStates.INIT]: {
    [OnboardingEvents.COLLECT_OK]: OnboardingStates.COLLECTING,
    [OnboardingEvents.FAIL]: OnboardingStates.ERROR,
    [OnboardingEvents.TIMEOUT]: OnboardingStates.TIMEOUT,
  },
  [OnboardingStates.COLLECTING]: {
    [OnboardingEvents.SYNC_OK]: OnboardingStates.SYNCING,
    [OnboardingEvents.FAIL]: OnboardingStates.ERROR,
    [OnboardingEvents.TIMEOUT]: OnboardingStates.TIMEOUT,
  },
  [OnboardingStates.SYNCING]: {
    [OnboardingEvents.SYNC_OK]: OnboardingStates.DONE,
    [OnboardingEvents.FAIL]: OnboardingStates.ERROR,
    [OnboardingEvents.TIMEOUT]: OnboardingStates.TIMEOUT,
  },
  [OnboardingStates.ERROR]: { [OnboardingEvents.RETRY]: OnboardingStates.INIT },
  [OnboardingStates.TIMEOUT]: { [OnboardingEvents.RETRY]: OnboardingStates.INIT },
};

export class OnboardingStateMachine {
  constructor(initialState = OnboardingStates.IDLE) { this.state = initialState; }
  get current() { return this.state; }
  send(event) { const next = (transitions[this.state]||{})[event]; if (next) this.state = next; return this.state; }
}

export default OnboardingStateMachine;

