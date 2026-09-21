# ST-05001 — System health and diagnostics

## Result

- Added `/api/health` with explicit healthy, degraded, and unhealthy states.
- Health reports configuration, history freshness, and safe dependency error codes.
- Missing API configuration and stale history return HTTP 503.
- `/api/system` now includes health and history freshness metadata for the existing system page.
- Diagnostics never include API keys, provider responses, or raw dependency errors.

## Validation

- `node --test test/health.test.js`
- `npm test` — 14 passing
- `npm run lint` — passing
