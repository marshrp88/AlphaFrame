/**
 * Onboarding Finite State Machine (FSM)
 *
 * Purpose (10th grade): This tiny engine tracks where the user is in onboarding
 * using clear labels instead of many booleans. It prevents freezes by having
 * well‑defined states and events.
 *
 * Procedure:
 * - Start in `idle`
 * - Move through: `init` → `collecting` → `syncing` → `done`
 * - If something goes wrong, go to `error` or `timeout`
 * - Only specific events cause state changes
 *
 * Conclusion: Simple, predictable onboarding flow that is easy to test.
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

// Transition table keeps logic in one place
const transitions = {
  [OnboardingStates.IDLE]: {
    [OnboardingEvents.START]: OnboardingStates.INIT,
  },
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
    [OnboardingEvents.SYNC_OK]: OnboardingStates.DONE, // allow idempotent OK to finalize
    [OnboardingEvents.FAIL]: OnboardingStates.ERROR,
    [OnboardingEvents.TIMEOUT]: OnboardingStates.TIMEOUT,
  },
  [OnboardingStates.ERROR]: {
    [OnboardingEvents.RETRY]: OnboardingStates.INIT,
  },
  [OnboardingStates.TIMEOUT]: {
    [OnboardingEvents.RETRY]: OnboardingStates.INIT,
  },
  [OnboardingStates.DONE]: {
    // terminal; no further transitions
  },
};

export class OnboardingStateMachine {
  constructor(initialState = OnboardingStates.IDLE) {
    this.state = initialState;
  }

  get current() {
    return this.state;
  }

  can(event) {
    const allowed = transitions[this.state] || {};
    return Boolean(allowed[event]);
  }

  send(event) {
    const allowed = transitions[this.state] || {};
    const next = allowed[event];
    if (next) {
      this.state = next;
      return this.state;
    }
    // If event not allowed, return current state without throwing to keep UI safe
    return this.state;
  }
}

export default OnboardingStateMachine;


