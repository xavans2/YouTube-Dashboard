const test = require("node:test");
const assert = require("node:assert/strict");

const { buildHealthStatus } = require("../lib/health");

const now = new Date("2026-09-21T12:00:00.000Z");

test("reports a healthy system with configured API and fresh history", () => {
    const health = buildHealthStatus({
        config: { youtubeApiKey: "key", youtubeChannelId: "channel" },
        latestSnapshot: "2026-09-21",
        now
    });

    assert.equal(health.status, "healthy");
    assert.equal(health.httpStatus, 200);
    assert.equal(health.checks.configuration.status, "ok");
    assert.equal(health.checks.history.status, "ok");
});

test("reports stale history as degraded with a non-2xx status", () => {
    const health = buildHealthStatus({
        config: { youtubeApiKey: "key", youtubeChannelId: "channel" },
        latestSnapshot: "2026-09-18",
        now
    });

    assert.equal(health.status, "degraded");
    assert.equal(health.httpStatus, 503);
    assert.equal(health.checks.history.status, "stale");
});

test("reports missing API configuration without exposing secrets", () => {
    const health = buildHealthStatus({
        config: { youtubeApiKey: "", youtubeChannelId: "" },
        latestSnapshot: null,
        now
    });

    assert.equal(health.status, "unhealthy");
    assert.equal(health.httpStatus, 503);
    assert.equal(health.checks.configuration.status, "missing");
    assert.equal(JSON.stringify(health).includes("secret"), false);
});

test("reports dependency failures with safe error codes", () => {
    const health = buildHealthStatus({
        config: { youtubeApiKey: "key", youtubeChannelId: "channel" },
        latestSnapshot: "2026-09-21",
        dependencyErrors: ["database"],
        now
    });

    assert.equal(health.status, "unhealthy");
    assert.deepEqual(health.errors, ["database"]);
    assert.equal(health.httpStatus, 503);
});
