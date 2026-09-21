const test = require("node:test");
const assert = require("node:assert/strict");
const Database = require("better-sqlite3");

const { createHistoryStore } = require("../lib/history-store");

function createStore() {
    const db = new Database(":memory:");
    return { db, store: createHistoryStore(db) };
}

test("updates a same-day snapshot instead of duplicating it", () => {
    const { db, store } = createStore();

    store.saveSnapshot({
        snapshotDate: "2026-09-20",
        capturedAt: "2026-09-20T08:00:00.000Z",
        subscribers: 10,
        views: 100,
        videos: 2
    });
    store.saveSnapshot({
        snapshotDate: "2026-09-20",
        capturedAt: "2026-09-20T20:00:00.000Z",
        subscribers: 0,
        views: 0,
        videos: 0
    });

    assert.deepEqual(store.findFrom("2026-09-20"), [{
        date: "2026-09-20",
        capturedAt: "2026-09-20T20:00:00.000Z",
        subscribers: 0,
        views: 0,
        videos: 0
    }]);
    db.close();
});

test("retains the cutoff date and removes older snapshots", () => {
    const { db, store } = createStore();
    const snapshot = (date) => ({
        snapshotDate: date,
        capturedAt: `${date}T12:00:00.000Z`,
        subscribers: 1,
        views: 1,
        videos: 1
    });

    store.saveSnapshot(snapshot("2026-08-21"));
    store.saveSnapshot(snapshot("2026-08-22"));
    store.saveSnapshot(snapshot("2026-08-23"));
    store.deleteBefore("2026-08-23");

    assert.deepEqual(store.findFrom("2026-08-01").map((row) => row.date), [
        "2026-08-23"
    ]);
    db.close();
});
