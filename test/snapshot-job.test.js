const test = require("node:test");
const assert = require("node:assert/strict");

const { runSnapshotJob } = require("../lib/snapshot-job");

test("runs one snapshot request and returns the channel response", async () => {
    let requestCount = 0;
    const logs = [];
    const result = await runSnapshotJob({
        url: "http://localhost:3000/api/channel",
        fetchImpl: async (url, options) => {
            requestCount += 1;
            assert.equal(url, "http://localhost:3000/api/channel");
            assert.deepEqual(options, { method: "GET" });
            return {
                ok: true,
                status: 200,
                json: async () => ({ subscribers: "10", views: "100", videos: "2" })
            };
        },
        logger: { info: (message) => logs.push(message) }
    });

    assert.equal(requestCount, 1);
    assert.equal(result.views, "100");
    assert.equal(logs.length, 1);
});

test("fails clearly when the channel endpoint returns an error", async () => {
    await assert.rejects(
        () => runSnapshotJob({
            url: "http://localhost:3000/api/channel",
            fetchImpl: async () => ({
                ok: false,
                status: 503,
                json: async () => ({ error: "YouTube API fout" })
            }),
            logger: { info: () => {} }
        }),
        /YouTube API fout/
    );
});
