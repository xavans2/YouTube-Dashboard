# ST-01003 — History quality and retention hardening

## Result

- Snapshot persistence is isolated in `lib/history-store.js`.
- A second snapshot on the same UTC day updates the existing row.
- Retention deletes dates older than the 30-day cutoff while keeping the cutoff date.
- Dates are calculated explicitly in UTC, so API requests and scheduled collection use the same window.
- Existing carry-forward behavior continues to fill missing days from the previous available snapshot.
- Zero-valued metrics remain valid stored values and are not replaced by fallback values.

## Validation

- `node --test test/history-store.test.js`
- `npm test` — 8 passing
- `npm run lint` — passing
