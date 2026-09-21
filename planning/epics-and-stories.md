# Xavis Analytics Backlog

## Backlog Conventions

- Epic IDs: `EP-01`, `EP-02`, ...
- Story IDs: `ST-XXYYY`, where `XX` is the epic and `YYY` is the epic-local sequence.
- Status and execution order live in `planning/kanban-queue.md`.
- Reassess downstream dependencies whenever a story changes.

## Epic Summary

| Epic ID | Epic Name | Outcome |
|---|---|---|
| EP-01 | Data Foundation & Reliability | Reliable scheduled history and testable data contracts |
| EP-02 | Trend & Content Analytics | Multi-period insight into growth and engagement |
| EP-03 | Exploration & Export | Drill-down, comparison, and portable data workflows |
| EP-04 | Alerts & Monitoring | Configurable performance and operational alerts |
| EP-05 | Production Operations | Secure, observable, persistent 24/7 deployment |

## EP-01 Data Foundation & Reliability

### ST-01001 Test and validation foundation
- User story: As a maintainer, I want a usable test runner and validation commands so that dashboard changes can be made safely.
- Priority: P0
- Estimate: M
- Dependencies: None
- Acceptance criteria:
  - `npm test` runs automated tests and returns a meaningful result.
  - Pure history/aggregation logic has unit coverage.
  - At least one API contract and one navigation/UI smoke path are covered or their manual boundary is documented.
  - A lint/static-analysis command is documented and runnable; if `pnpm lint` is unavailable, the checklist records the project-specific alternative.

### ST-01002 Scheduled daily snapshot collector
- User story: As a channel owner, I want daily snapshots collected without opening the dashboard so that history is complete.
- Priority: P0
- Estimate: M
- Dependencies: ST-01001
- Acceptance criteria:
  - A scheduled job calls the channel collector once per configured day.
  - Re-running the same day updates that day rather than duplicating it.
  - API failures are logged and do not corrupt prior history.
  - The scheduler has a documented local and production invocation.

### ST-01003 History quality and retention hardening
- User story: As an analyst, I want a consistent 30-day history with carry-forward metadata so that missing collection days do not distort charts.
- Priority: P0
- Estimate: S
- Dependencies: ST-01001, ST-01002
- Acceptance criteria:
  - The API returns the configured window with missing days filled from the previous known snapshot.
  - Synthetic points expose `carriedForward: true`.
  - Retention removes data older than the configured window without deleting the prior baseline needed for comparison.
  - Zero values remain valid data and are not treated as missing.

## EP-02 Trend & Content Analytics

### ST-02001 Multi-period trend charts
- User story: As a channel owner, I want 7-, 30-, and 90-day charts so that I can see short- and long-term growth.
- Priority: P0
- Estimate: M
- Dependencies: ST-01002, ST-01003
- Acceptance criteria:
  - Users can switch between 7, 30, and 90 days.
  - Subscribers, views, and videos have clear trend lines and labels.
  - Empty and sparse history states are explained.

### ST-02002 Engagement analytics
- User story: As a content analyst, I want like-rate, comment-rate, and average engagement metrics so that I can compare quality of attention, not only reach.
- Priority: P1
- Estimate: M
- Dependencies: ST-01002, ST-02001
- Acceptance criteria:
  - Engagement formulas are documented and use explicit denominators.
  - Metrics are available per video and as a period aggregate.
  - Division-by-zero and missing likes/comments are handled safely.

### ST-02003 Content performance insights
- User story: As a creator, I want performance grouped by upload timing, age, and title metadata so that I can identify patterns in successful content.
- Priority: P1
- Estimate: L
- Dependencies: ST-01002, ST-02001, ST-02002
- Acceptance criteria:
  - The view explains which fields are available from YouTube and which are unavailable.
  - Results can be filtered by period and sorted by a documented metric.
  - Small sample sizes are labeled instead of presented as strong conclusions.

## EP-03 Exploration & Export

### ST-03001 Video detail page
- User story: As a channel owner, I want a detail page for one video so that I can inspect its performance in context.
- Priority: P1
- Estimate: M
- Dependencies: ST-01001, ST-02002
- Acceptance criteria:
  - `/video/:id` shows title, publication date, thumbnail, views, likes, comments, and engagement.
  - The page handles deleted/unavailable videos and API errors.
  - Navigation back to `vid-data` works.

### ST-03002 Period and video comparison
- User story: As an analyst, I want to compare two videos or two periods so that I can evaluate changes and experiments.
- Priority: P1
- Estimate: M
- Dependencies: ST-02001, ST-02002, ST-03001
- Acceptance criteria:
  - Users can choose two valid comparison targets.
  - Absolute and percentage differences are shown with zero-baseline handling.
  - The comparison identifies the data timestamp and period.

### ST-03003 CSV and JSON export
- User story: As a channel owner, I want to export history and video data so that I can use it outside the dashboard.
- Priority: P1
- Estimate: S
- Dependencies: ST-01003, ST-02002
- Acceptance criteria:
  - Users can export the currently selected period.
  - CSV has stable headers and escaped values.
  - JSON includes metadata, source timestamp, and whether values were carried forward.

## EP-04 Alerts & Monitoring

### ST-04001 Configurable performance alerts
- User story: As a channel owner, I want configurable thresholds for views, growth, and engagement so that important changes are visible immediately.
- Priority: P1
- Estimate: M
- Dependencies: ST-02001, ST-02002, ST-05002
- Acceptance criteria:
  - Thresholds can be configured and validated.
  - Alerts show metric, actual value, threshold, period, and timestamp.
  - Duplicate alerts are suppressed for the same condition and period.

### ST-04002 Operational alerts
- User story: As an operator, I want alerts for API failures, stale snapshots, and missing uploads so that the dashboard can be trusted.
- Priority: P1
- Estimate: M
- Dependencies: ST-01002, ST-05001
- Acceptance criteria:
  - Stale collection and API failures produce visible alerts.
  - An optional notification target is documented and configurable.
  - Recovery clears or resolves the alert state.

## EP-05 Production Operations

### ST-05001 System health and diagnostics
- User story: As an operator, I want a reliable system page and health endpoint so that I can diagnose the server without reading logs first.
- Priority: P0
- Estimate: S
- Dependencies: ST-01001
- Acceptance criteria:
  - Health reports server status, uptime, API configuration status, history freshness, and safe error summaries.
  - Secrets and full API responses are never exposed.
  - The endpoint returns non-2xx when critical dependencies are unavailable.

### ST-05002 Settings and configuration page
- User story: As a channel owner, I want to configure refresh intervals, thresholds, and display preferences from one place.
- Priority: P2
- Estimate: M
- Dependencies: ST-05001
- Acceptance criteria:
  - Configuration has safe defaults and validation.
  - Secrets remain environment-managed.
  - Settings persist across restarts on the chosen deployment target.

### ST-05003 Persistent 24/7 deployment and backups
- User story: As a channel owner, I want the dashboard to run continuously with persistent history and recovery procedures.
- Priority: P0
- Estimate: L
- Dependencies: ST-01002, ST-05001, ST-05002
- Acceptance criteria:
  - Deployment runs with automatic restart and HTTPS.
  - SQLite is on persistent storage or replaced with a managed database.
  - Database backups and restore steps are documented and tested.
  - Environment variables are configured outside Git.

