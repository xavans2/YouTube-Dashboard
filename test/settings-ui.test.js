const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("configuration UI exposes persisted settings controls", () => {
    const html = fs.readFileSync("public/index.html", "utf8");

    assert.match(html, /id="configRefreshInterval"/);
    assert.match(html, /id="configAlertThreshold"/);
    assert.match(html, /id="configHistoryDays"/);
    assert.match(html, /id="configShowDescription"/);
    assert.match(html, /refreshIntervalSeconds/);
    assert.match(html, /alertGrowthThresholdPercent/);
    assert.match(html, /showChannelDescription/);
});
