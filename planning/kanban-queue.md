# Xavis Analytics Kanban Queue

## Queue Rules

- `Expedite` first, then `Ready`.
- Ready items are ordered by dependency-safe execution priority.
- Keep dependency metadata on Backlog items.
- Merged stories belong in `planning/archives/kanban-done-stories.md`.

## Expedite
- None

## In Review
- None

## In Progress
- None

## Ready
- [ ] ST-01001 Test and validation foundation
  - Branch: `chore/st-01001-test-validation-foundation`
- [ ] ST-05001 System health and diagnostics
  - Branch: `feat/st-05001-system-health-diagnostics`

## Backlog
- [ ] ST-01002 Scheduled daily snapshot collector
  - Depends on: ST-01001
- [ ] ST-01003 History quality and retention hardening
  - Depends on: ST-01001, ST-01002
- [ ] ST-02001 Multi-period trend charts
  - Depends on: ST-01002, ST-01003
- [ ] ST-02002 Engagement analytics
  - Depends on: ST-01002, ST-02001
- [ ] ST-02003 Content performance insights
  - Depends on: ST-01002, ST-02001, ST-02002
- [ ] ST-03001 Video detail page
  - Depends on: ST-01001, ST-02002
- [ ] ST-03002 Period and video comparison
  - Depends on: ST-02001, ST-02002, ST-03001
- [ ] ST-03003 CSV and JSON export
  - Depends on: ST-01003, ST-02002
- [ ] ST-04001 Configurable performance alerts
  - Depends on: ST-02001, ST-02002, ST-05002
- [ ] ST-04002 Operational alerts
  - Depends on: ST-01002, ST-05001
- [ ] ST-05002 Settings and configuration page
  - Depends on: ST-05001
- [ ] ST-05003 Persistent 24/7 deployment and backups
  - Depends on: ST-01002, ST-05001, ST-05002

## Deferred
- None

## Blocked
- None

## Done Archive
- `planning/archives/kanban-done-stories.md`

