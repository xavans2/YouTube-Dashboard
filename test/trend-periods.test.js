const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const {
    DEFAULT_HISTORY_DAYS,
    MAX_HISTORY_DAYS,
    normalizeHistoryDays
} = require("../lib/history");

test("accepts only the supported 7, 30, and 90 day periods", () => {
    assert.equal(normalizeHistoryDays("7"), 7);
    assert.equal(normalizeHistoryDays("30"), 30);
    assert.equal(normalizeHistoryDays("90"), 90);
    assert.equal(normalizeHistoryDays("14"), DEFAULT_HISTORY_DAYS);
    assert.equal(normalizeHistoryDays(undefined), DEFAULT_HISTORY_DAYS);
});

test("keeps enough history for the longest supported period", () => {
    assert.equal(MAX_HISTORY_DAYS, 90);
});

test("renders controls and all trend series in the dashboard", () => {
    const html = fs.readFileSync("public/index.html", "utf8");
    assert.match(html, /data-days="7"/);
    assert.match(html, /data-days="30"/);
    assert.match(html, /data-days="90"/);
    assert.match(html, /\["subscribers", "var\(--green\)"\]/);
    assert.match(html, /\["views", "#8cff66"\]/);
    assert.match(html, /\["videos", "#b5ff9d"\]/);
});
