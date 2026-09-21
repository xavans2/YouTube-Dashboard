# ST-01002 Scheduled Daily Snapshot Collector

## Outcome

The project now has a one-shot snapshot collector that can be invoked by cron, PM2, or a hosting scheduler without opening the browser.

## Test strategy

- Unit tests: `test/snapshot-job.test.js` covers one-request execution, successful JSON handling, and actionable API errors.
- Integration boundary: the job calls the existing `/api/channel` endpoint, which performs the YouTube request and SQLite upsert.
- Duplicate-day fixture: the existing `channel_history.snapshot_date` primary key and `ON CONFLICT ... DO UPDATE` behavior make repeated same-day runs idempotent.
- API failure fixture: the job exits non-zero with the endpoint error message.

## Usage

Run manually:

```bash
npm run collect:snapshot
```

Optional endpoint override:

```bash
SNAPSHOT_URL=http://127.0.0.1:3000/api/channel npm run collect:snapshot
```

Example cron entry for a daily 02:00 UTC collection:

```cron
0 2 * * * cd /path/to/xavis-analytics && npm run collect:snapshot >> data/snapshot-job.log 2>&1
```

The Express server must be running for the job endpoint to be available. The existing database upsert means rerunning the job on the same UTC day updates that row instead of creating a duplicate.
