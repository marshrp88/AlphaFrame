Rollback Runbook (One Page)

When to rollback
- P0 regression in green-path flows (onboarding/dashboard), security incident, or crash on latest RC.

Pre-reqs
- Keep last N RC builds (tags) and their dist artifacts.

Steps
1) Identify last green RC tag (e.g., v2.2.0-rc1) and corresponding commit.
2) Create hotfix branch from that tag if a forward fix is obvious; otherwise rollback deploy to that RC artifact.
3) Announce in #engineering with incident note, create P0 issue with repro.
4) Post-rollback: run synthetic uptime and E2E; verify a11y/perf gates.

Commands (git)
```
git fetch --tags
git checkout v2.2.0-rc1
# or: git tag -d latest && git tag latest v2.2.0-rc1 && git push --tags --force-with-lease
```

Verification
- Synthetic uptime job green
- E2E stoplight all green
- Sentry error rate back to baseline

