# Onboarding FSM

Purpose (10th grade): Replace confusing flags with a tiny state machine so onboarding can’t freeze. The FSM uses clear states and events and includes a 10-second timeout.

Procedure:
1) State machine lives at `src/core/fsm/onboardingMachine.js` with states: `idle → init → collecting → syncing → done | error | timeout`.
2) Wrapper store at `src/core/store/onboardingStore.js` exposes actions: `start, collectOk, syncOk, fail, retry` and sets a 10s timeout on `init/collecting`.
3) UI calls these actions instead of mutating flags.

Conclusion: Onboarding becomes predictable, recoverable, and easy to test.

Notes:
- Timeout flips state to `timeout`; UI should show Retry and Use Demo.
- When state becomes `done`, set `onboardingComplete` and navigate to `/dashboard`.
