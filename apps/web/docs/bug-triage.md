Bug Triage Workflow

Purpose
- Consistent intake and prioritization so critical issues are fixed fast.

Severity & SLA
- P0 (Critical): crash/data loss/security | fix/rollback within 24h
- P1 (High): key flow broken (onboarding/dashboard) | fix within 3 days
- P2 (Medium): degraded UX/cosmetic | schedule within sprint
- P3 (Low): copy/style/NTH | backlog

Intake Template
- Title: [P#] short description
- Steps to reproduce
- Expected vs actual
- Environment (browser/device, commit)
- Screenshots/logs
- Suspected area (route/store/service)

Labels
- severity/P0..P3, area/ui, area/store, area/service, type/bug, type/regression

Cadence
- Daily: triage new P0/P1
- Weekly: review backlog and assign owners

Rollback Policy
- If P0 regression on GA flow → rollback to last green RC and hotfix.

