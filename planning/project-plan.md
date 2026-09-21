# Xavis Analytics Project Plan

## Executive Summary

Xavis Analytics is a terminal-style YouTube channel dashboard. The current baseline provides live channel/video statistics, 30-day SQLite history, carry-forward handling for missing days, dashboard navigation, top-video ranking, alerts, system status, and a help page. This plan turns the remaining expansion ideas into an execution-ready Kanban backlog.

## Problem Statement

The dashboard currently offers useful snapshots, but historical collection depends on page traffic, trend analysis is limited, alerts are basic, and the app has no production-grade test, scheduling, export, configuration, or deployment workflow.

## Objectives and Success Metrics

- Collect one reliable channel snapshot per day without requiring an open browser.
- Show useful 7-, 30-, and 90-day trends with clear engagement and content comparisons.
- Make alerts actionable and configurable.
- Provide drill-down and export workflows for video analysis.
- Make the app testable, observable, secure, and deployable 24/7.

## Scope

### In scope

- Scheduled snapshots and history quality.
- Trend, engagement, content performance, comparison, detail, and export views.
- Threshold and operational alerts.
- System health, settings, backups, HTTPS, and deployment documentation.
- Automated test and validation foundations.

### Out of scope

- Private subscriber identity lists; YouTube OAuth and privacy restrictions make this a separate product decision.
- Automated publishing, editing, or managing YouTube videos.
- Predictive ML recommendations before reliable historical data exists.

## Functional Requirements

- Store daily channel metrics with timestamps and source metadata.
- Fill missing display days from the latest previous snapshot.
- Support 7-, 30-, and 90-day views for subscribers, views, videos, likes, comments, and engagement rates where data exists.
- Rank videos by total and period growth.
- Show video details, period comparisons, and CSV/JSON exports.
- Generate configurable performance and operational alerts.
- Expose system health and configuration status without exposing secrets.
- Run scheduled collection independently from browser traffic.

## Non-Functional Requirements

- Never commit `.env`, API keys, OAuth tokens, or database files.
- Preserve SQLite data across restarts and deployments.
- Keep API errors visible and actionable in the terminal UI.
- Add automated coverage for data transformations, API contracts, and critical navigation.
- Keep route names and terminal commands stable and documented in `/help`.

## Solution Architecture

```text
YouTube Data API
        |
        v
Scheduled collector ---> SQLite history store ---> History/carry-forward service
        |                         |                         |
        +-------------------------+-------------------------+
                                  v
                        Express JSON endpoints
                                  |
                                  v
                     Terminal-style single-page UI
```

The current Express server and static frontend remain the foundation. A small collector module should own scheduled snapshots, while pure data functions should own period aggregation, carry-forward, alerts, and export formatting.

## Delivery Phases

1. **Foundation:** test runner, data contracts, scheduled snapshots, and history quality.
2. **Analytics:** period charts, engagement metrics, and content performance.
3. **Exploration:** video detail, comparison, and exports.
4. **Alerts:** configurable thresholds and operational notifications.
5. **Operations:** health checks, settings, persistence, deployment, HTTPS, and backup runbooks.

## Risks and Mitigations

- **YouTube quota/rate limits:** cache snapshots, schedule one collection per day, and expose quota/API errors.
- **Sparse history:** carry forward values and label synthetic points with `carriedForward`.
- **Ephemeral hosting storage:** require persistent disk or move history to managed storage before production.
- **Secrets leakage:** maintain `.env.example`, `.gitignore`, and secret-scanning checks.
- **No existing test runner:** deliver `ST-01001` before relying on automated regression claims.

## Dependencies

- YouTube Data API key and channel ID.
- A persistent runtime for SQLite or a future managed database.
- Scheduler capability (cron, PM2 timer, worker, or host scheduler).
- Production domain and TLS certificate for public deployment.

## Immediate Next Steps

1. Execute `ST-01001` to establish tests and validation commands.
2. Execute `ST-01002` to decouple snapshots from page visits.
3. Promote analytics stories as the history dataset becomes reliable.
4. Decide the target 24/7 hosting environment before `ST-05003`.

