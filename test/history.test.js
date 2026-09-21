const test = require("node:test");
const assert = require("node:assert/strict");

const {
    calculateGrowth,
    buildHistoryWithCarryForward
} = require("../lib/history");

test("fills missing days with the previous snapshot", () => {
    const history = buildHistoryWithCarryForward([
        { date: "2026-09-18", subscribers: 10, views: 100, videos: 2 },
        { date: "2026-09-20", subscribers: 12, views: 140, videos: 3 }
    ], 3, new Date("2026-09-20T12:00:00.000Z"));

    assert.deepEqual(history.map((point) => point.date), [
        "2026-09-18",
        "2026-09-19",
        "2026-09-20"
    ]);
    assert.equal(history[1].views, 100);
    assert.equal(history[1].carriedForward, true);
    assert.equal(history[2].carriedForward, false);
});

test("calculates absolute and percentage growth", () => {
    const result = calculateGrowth([
        { views: 100 },
        { views: 125 }
    ], "views");

    assert.deepEqual(result, { value: 25, percentage: 25 });
});

test("returns no percentage for a zero baseline", () => {
    const result = calculateGrowth([
        { views: 0 },
        { views: 25 }
    ], "views");

    assert.deepEqual(result, { value: 25, percentage: null });
});

test("keeps a fixed history window and uses the oldest available baseline", () => {
    const history = buildHistoryWithCarryForward([
        { date: "2026-08-20", subscribers: 1, views: 10, videos: 1 },
        { date: "2026-09-01", subscribers: 2, views: 20, videos: 2 }
    ], 30, new Date("2026-09-21T12:00:00.000Z"));

    assert.equal(history.length, 30);
    assert.equal(history[0].date, "2026-08-23");
    assert.equal(history[0].views, 10);
});
