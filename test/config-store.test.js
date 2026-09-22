const test = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");

const { createConfigStore, maskSecret } = require("../lib/config-store");

function createTempStore(env) {
    const db = new Database(":memory:");
    return { db, store: createConfigStore({ db, env }) };
}

test("uses environment values as defaults and masks the API key", () => {
    const { db, store } = createTempStore({
        YOUTUBE_API_KEY: "env-secret-key",
        YOUTUBE_CHANNEL_ID: "env-channel"
    });

    assert.deepEqual(store.read(), {
        youtubeApiKey: "env-secret-key",
        youtubeChannelId: "env-channel"
    });
    assert.equal(store.isComplete(), true);
    assert.equal(maskSecret("env-secret-key"), "en*********ey");
    assert.equal(store.public().youtubeApiKey, "en*********ey");
    db.close();
});

test("persists local overrides without exposing the API key", () => {
    const { db, store } = createTempStore({
        YOUTUBE_API_KEY: "env-secret-key",
        YOUTUBE_CHANNEL_ID: "env-channel"
    });

    store.update({
        youtubeApiKey: "local-secret-key",
        youtubeChannelId: "local-channel"
    });

    assert.deepEqual(store.read(), {
        youtubeApiKey: "local-secret-key",
        youtubeChannelId: "local-channel"
    });
    assert.deepEqual(
        db.prepare("SELECT config_key, config_value FROM app_config ORDER BY config_key").all(),
        [
            { config_key: "ALERT_GROWTH_THRESHOLD_PERCENT", config_value: "0" },
            { config_key: "DEFAULT_HISTORY_DAYS", config_value: "30" },
            { config_key: "REFRESH_INTERVAL_SECONDS", config_value: "60" },
            { config_key: "SHOW_CHANNEL_DESCRIPTION", config_value: "true" },
            { config_key: "YOUTUBE_API_KEY", config_value: "local-secret-key" },
            { config_key: "YOUTUBE_CHANNEL_ID", config_value: "local-channel" }
        ]
    );
    assert.equal(store.public().youtubeApiKey, "lo*********ey");
    store.reset();
    assert.equal(createConfigStore({ db }).isComplete(), false);
    assert.deepEqual(store.read(), {
        youtubeApiKey: "env-secret-key",
        youtubeChannelId: "env-channel"
    });
    db.close();
});

test("persists validated dashboard settings with safe defaults", () => {
    const { db, store } = createTempStore({});

    assert.deepEqual(store.public().settings, {
        refreshIntervalSeconds: 60,
        alertGrowthThresholdPercent: 0,
        defaultHistoryDays: 30,
        showChannelDescription: true
    });

    store.update({
        refreshIntervalSeconds: 120,
        alertGrowthThresholdPercent: 12.5,
        defaultHistoryDays: 90,
        showChannelDescription: false
    });

    assert.deepEqual(store.public().settings, {
        refreshIntervalSeconds: 120,
        alertGrowthThresholdPercent: 12.5,
        defaultHistoryDays: 90,
        showChannelDescription: false
    });

    store.update({
        refreshIntervalSeconds: 1,
        alertGrowthThresholdPercent: -4,
        defaultHistoryDays: 14,
        showChannelDescription: "no"
    });

    assert.deepEqual(store.public().settings, {
        refreshIntervalSeconds: 60,
        alertGrowthThresholdPercent: 0,
        defaultHistoryDays: 30,
        showChannelDescription: true
    });
    db.close();
});
