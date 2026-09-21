const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { createConfigStore, maskSecret } = require("../lib/config-store");

function createTempStore(env) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "xavis-config-"));
    const filePath = path.join(directory, "config.json");
    return { directory, store: createConfigStore({ filePath, env }) };
}

test("uses environment values as defaults and masks the API key", () => {
    const { directory, store } = createTempStore({
        YOUTUBE_API_KEY: "env-secret-key",
        YOUTUBE_CHANNEL_ID: "env-channel"
    });

    assert.deepEqual(store.read(), {
        youtubeApiKey: "env-secret-key",
        youtubeChannelId: "env-channel"
    });
    assert.equal(maskSecret("env-secret-key"), "en*********ey");
    assert.equal(store.public().youtubeApiKey, "en*********ey");
    fs.rmSync(directory, { recursive: true, force: true });
});

test("persists local overrides without exposing the API key", () => {
    const { directory, store } = createTempStore({
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
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory, "config.json"))), {
        YOUTUBE_API_KEY: "local-secret-key",
        YOUTUBE_CHANNEL_ID: "local-channel"
    });
    assert.equal(store.public().youtubeApiKey, "lo*********ey");
    fs.rmSync(directory, { recursive: true, force: true });
});
