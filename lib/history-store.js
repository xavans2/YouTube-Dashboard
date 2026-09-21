const schema = `
    CREATE TABLE IF NOT EXISTS channel_history (
        snapshot_date TEXT PRIMARY KEY,
        captured_at TEXT NOT NULL,
        subscribers INTEGER NOT NULL,
        views INTEGER NOT NULL,
        videos INTEGER NOT NULL
    )
`;

function createHistoryStore(db) {
    db.pragma("journal_mode = WAL");
    db.exec(schema);

    const saveSnapshot = db.prepare(`
        INSERT INTO channel_history (
            snapshot_date, captured_at, subscribers, views, videos
        ) VALUES (@snapshotDate, @capturedAt, @subscribers, @views, @videos)
        ON CONFLICT(snapshot_date) DO UPDATE SET
            captured_at = excluded.captured_at,
            subscribers = excluded.subscribers,
            views = excluded.views,
            videos = excluded.videos
    `);
    const deleteBefore = db.prepare(`
        DELETE FROM channel_history
        WHERE snapshot_date < ?
    `);
    const findFrom = db.prepare(`
        SELECT snapshot_date AS date, captured_at AS capturedAt,
               subscribers, views, videos
        FROM channel_history
        WHERE snapshot_date >= ?
        ORDER BY snapshot_date ASC
    `);

    return {
        saveSnapshot(snapshot) {
            return saveSnapshot.run(snapshot);
        },
        deleteBefore(cutoffDate) {
            return deleteBefore.run(cutoffDate);
        },
        findFrom(startDate) {
            return findFrom.all(startDate);
        }
    };
}

module.exports = { createHistoryStore };
