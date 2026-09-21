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
