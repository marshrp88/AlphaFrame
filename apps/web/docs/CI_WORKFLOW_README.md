# CI Workflow (Starter Skeleton)

Purpose (10th grade): This explains the automatic checks that run on pull requests. The computer builds the app and runs tests so we don’t break the happy path.

Procedure:
- GitHub Actions reads `.github/workflows/ci.yml` in this app.
- It installs Node and pnpm, then installs dependencies.
- It runs unit tests (Vitest). Later we will add Playwright end-to-end tests.
- After Steps 6–8 in the plan, the job will fail on any test failure.

Conclusion: With CI turned on, every change is checked the same way. This keeps the app reliable and prevents broken demos.

Notes:
- This is a starter. We will switch off `continue-on-error` once tests are wired.
- Keep edits inside `apps/web` unless we explicitly move CI to the repo root.
