# AlphaFrame Green Path Contract (Consumer-Ready)

Purpose (10th grade): This is the single source of truth for what screens users are allowed to see based on who they are and where they are in onboarding. We use this to prevent loops, freezes, or confusing redirects.

Procedure: The app checks this table on every navigation. If a user tries to go somewhere that is not allowed, we send them to the correct page.

Conclusion: One clear rule set means predictable routing and fewer bugs.

## Definitions
- Unauth: Not signed in.
- Demo: Chose demo mode (no real accounts).
- Auth: Signed in user.
- FSM state: Onboarding state machine. `done` means onboarding finished.

## Truth Table (Allowed Routes)

| User Type | FSM = not done | FSM = done |
|---|---|---|
| Unauth | Allow: `/`, `/demo`, `/onboarding` (optional splash). Block: `/dashboard`. Redirect to `/` | Allow: `/` and `/onboarding` (optional). Block `/dashboard` until auth or demo. |
| Demo | Allow: `/onboarding`. Block: `/dashboard` until `done`. | Allow: `/dashboard`, `/`, `/settings` (if exists). |
| Auth | Force `/onboarding` until `done`. Block `/dashboard` until `done`. | Allow: `/dashboard`, `/`, `/settings`. |

Redirect Rules (short):
- Unauth visiting `/dashboard` → `/`.
- Demo/Auth with FSM `not done` visiting `/dashboard` → `/onboarding`.
- Demo/Auth finishing onboarding (`done`) → `/dashboard`.

Guard Ownership: Implement a single guard hook `useRouteGuard()` that reads `useAuthStore()` and `useOnboardingStore()` and applies this table.

Success Criteria
- Direct-linking to any page respects this contract.
- QA can flip store values and see the UI route correctly.

Notes
- Demo must always progress even if external services are offline.
- Timeouts or errors in onboarding must show Retry and Use Demo.


