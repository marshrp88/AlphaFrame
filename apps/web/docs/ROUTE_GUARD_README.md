# Route Guard

Purpose (10th grade): Keep navigation predictable. We use one guard to decide where users can go based on auth, demo mode, and onboarding status.

Procedure:
- Hook: `src/core/routing/useRouteGuard.js`
- Reads: `useAuthStore()`, `useAppStore()`, and `useOnboardingFsmStore()`
- Applies the truth table in `docs/green-path.md`
- Redirects to the correct page if a route is not allowed

Conclusion: No more routing chaos. Direct links and refreshes use the same rules.
