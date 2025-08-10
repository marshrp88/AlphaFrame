# Green Path — AlphaFrame GA100

Purpose (10th‑grade): This is the shortest happy path a new user takes. We use it for tests.

- Start at Landing → click Get Started
- Onboarding Step 1 appears
- Use Demo Instead → auto-complete onboarding
- Navigate to Dashboard → see dashboard shell

Truth table (simplified):

- demo_user=true AND alphaframe_onboarding_complete=true → dashboard allowed
- demo_user=false AND onboarding_complete=false → redirect to onboarding

Tests assert:

- `data-testid="onboarding-root"` is visible on onboarding
- `data-testid="dashboard-root"` and `data-testid="navbar"` on dashboard


