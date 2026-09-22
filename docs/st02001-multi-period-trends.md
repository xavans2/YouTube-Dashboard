# ST-02001 Multi-period trend charts

## Behavior

The history API accepts `days=7`, `days=30`, or `days=90`. Unsupported or missing values use the 30-day default. Snapshot retention now keeps 90 days so every supported range can be rendered, while missing dates continue to use the previous known snapshot.

The dashboard defaults to 30 days and lets users switch between 7D, 30D, and 90D. Subscribers, views, and videos are rendered as separate normalized trend lines with a visible legend. Normalization keeps low-volume series readable beside total views; the growth cards continue to show the absolute values and percentages for the selected period.

If fewer than two history points are available, the existing empty-history message remains visible instead of showing a misleading line.

## Test and CI assessment

- Period normalization and the 90-day retention constant are covered by `test/trend-periods.test.js`.
- The same test verifies that all three period controls and trend series are present in the dashboard markup.
- No CI change is required; the existing `npm test` and `npm run lint` commands cover this story.
