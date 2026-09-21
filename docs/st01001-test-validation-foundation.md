# ST-01001 Test and Validation Foundation

## Outcome

The project now has a runnable Node test suite and a small pure history module. History carry-forward and growth calculations can be tested without starting Express or calling YouTube.

## Test strategy

- Unit tests: `test/history.test.js` covers missing-day carry-forward, fixed-window behavior, growth, and zero-baseline handling.
- API integration: deferred to the next story when the scheduled collector and endpoint seams are introduced.
- UI/e2e smoke coverage: deferred; the current static page has no browser test harness.
- First failing test: the new test file initially failed with `MODULE_NOT_FOUND` for `../lib/history`; production extraction then made the focused tests pass.

## Implementation

- Added `lib/history.js` with pure `buildHistoryWithCarryForward` and `calculateGrowth` functions.
- Updated `server.js` to consume those functions.
- Added `npm test` and `npm run lint` scripts.

## Validation

- `node --test test/history.test.js`: 4 passing.
- `npm test`: 4 tests passing.
- `npm run lint`: passing (`node --check server.js` and `node --check lib/history.js`).
- No CI change is required yet; the repository has no CI workflow. CI automation remains a production-operations follow-up.
