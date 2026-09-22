# ST-05002 Settings and configuration page

The local configuration page now stores validated dashboard settings in SQLite alongside the existing channel configuration. Safe defaults are a 60-second refresh interval, a 0% alert growth threshold, a 30-day default history period, and a visible channel description.

Settings available on `/config`:

- Refresh interval: 15–3600 seconds.
- Alert growth threshold: 0–100 percent.
- Default history period: 7, 30, or 90 days.
- Channel description visibility.

The dashboard applies the selected default history period, uses the refresh interval for its polling loop, applies the threshold to growth alerts, and hides or shows the channel description according to the saved preference. Invalid values fall back to safe defaults and settings survive process restarts in the SQLite database.

The existing API key/channel handling remains masked and local; this story does not expose secrets through the settings response.

## Validation

- `test/config-store.test.js` covers defaults, persistence, and invalid-value fallback.
- `test/settings-ui.test.js` covers the settings controls and payload fields.
- No CI change is required; the existing npm test and lint commands cover the story.
