const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
require("dotenv").config();

const app = express();
const PORT = 3000;
const HISTORY_DAYS = 30;

const dataDirectory = path.join(__dirname, "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, "analytics.db"));
db.pragma("journal_mode = WAL");
db.exec(`
    CREATE TABLE IF NOT EXISTS channel_history (
        snapshot_date TEXT PRIMARY KEY,
        captured_at TEXT NOT NULL,
        subscribers INTEGER NOT NULL,
        views INTEGER NOT NULL,
        videos INTEGER NOT NULL
    )
`);

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

const pruneHistory = db.prepare(`
    DELETE FROM channel_history
    WHERE snapshot_date < date('now', ?)
`);

const historyQuery = db.prepare(`
    SELECT snapshot_date AS date, captured_at AS capturedAt,
           subscribers, views, videos
    FROM channel_history
    WHERE snapshot_date >= date('now', ?)
    ORDER BY snapshot_date ASC
`);

function getHistoryWithCarryForward() {
    const snapshots = historyQuery.all(`-${HISTORY_DAYS} days`);
    const snapshotsByDate = new Map(snapshots.map((snapshot) => [snapshot.date, snapshot]));
    const history = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const firstDate = new Date(today);
    firstDate.setUTCDate(firstDate.getUTCDate() - (HISTORY_DAYS - 1));
    const firstDateKey = firstDate.toISOString().slice(0, 10);
    let previousSnapshot = snapshots.find((snapshot) => snapshot.date < firstDateKey) || null;

    for (let offset = HISTORY_DAYS - 1; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setUTCDate(date.getUTCDate() - offset);
        const dateKey = date.toISOString().slice(0, 10);
        const snapshot = snapshotsByDate.get(dateKey);

        if (snapshot) {
            previousSnapshot = snapshot;
        }

        if (previousSnapshot) {
            history.push({
                ...previousSnapshot,
                date: dateKey,
                carriedForward: !snapshot
            });
        }
    }

    return history;
}

function recordChannelSnapshot(channel) {
    const now = new Date();
    saveSnapshot.run({
        snapshotDate: now.toISOString().slice(0, 10),
        capturedAt: now.toISOString(),
        subscribers: Number(channel.statistics.subscriberCount || 0),
        views: Number(channel.statistics.viewCount || 0),
        videos: Number(channel.statistics.videoCount || 0)
    });

    pruneHistory.run(`-${HISTORY_DAYS} days`);
}

function getGrowth(history, field) {
    if (history.length < 2) {
        return { value: null, percentage: null };
    }

    const first = Number(history[0][field]);
    const latest = Number(history[history.length - 1][field]);
    return {
        value: latest - first,
        percentage: first === 0 ? null : ((latest - first) / first) * 100
    };
}

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY
});

app.use(express.static("public"));

app.get(["/", "/vid-data", "/top-vids", "/alerts", "/system", "/help"], (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/subs", (req, res) => {
    res.redirect("/");
});

// ================================
// CHANNEL STATISTICS
// ================================

app.get("/api/channel", async (req, res) => {
    try {
        const response = await youtube.channels.list({
            part: "snippet,statistics",
            id: process.env.YOUTUBE_CHANNEL_ID
        });

        if (!response.data.items || response.data.items.length === 0) {
            return res.status(404).json({
                error: "YouTube-kanaal niet gevonden"
            });
        }

        const channel = response.data.items[0];

        recordChannelSnapshot(channel);

        res.json({
            name: channel.snippet.title,
            description: channel.snippet.description,
            thumbnail: channel.snippet.thumbnails.high.url,
            subscribers: channel.statistics.subscriberCount,
            views: channel.statistics.viewCount,
            videos: channel.statistics.videoCount
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "YouTube API fout"
        });
    }
});

// ================================
// CHANNEL HISTORY
// ================================

app.get("/api/history", (req, res) => {
    try {
        const history = getHistoryWithCarryForward();

        res.json({
            days: HISTORY_DAYS,
            history,
            growth: {
                subscribers: getGrowth(history, "subscribers"),
                views: getGrowth(history, "views"),
                videos: getGrowth(history, "videos")
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kan geschiedenis niet ophalen" });
    }
});

app.get("/api/system", (req, res) => {
    try {
        const history = historyQuery.all(`-${HISTORY_DAYS - 1} days`);
        res.json({
            status: "online",
            uptimeSeconds: Math.floor(process.uptime()),
            nodeVersion: process.version,
            historySnapshots: history.length,
            oldestSnapshot: history[0]?.date || null,
            latestSnapshot: history[history.length - 1]?.date || null,
            youtubeApiConfigured: Boolean(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID),
            serverTime: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kan systeemstatus niet ophalen" });
    }
});

// ================================
// VIDEO STATISTICS
// ================================

app.get("/api/videos", async (req, res) => {
    try {
        const channelResponse = await youtube.channels.list({
            part: "contentDetails",
            id: process.env.YOUTUBE_CHANNEL_ID
        });

        if (!channelResponse.data.items.length) {
            return res.status(404).json({
                error: "YouTube-kanaal niet gevonden"
            });
        }

        const uploadsPlaylistId =
            channelResponse.data.items[0]
                .contentDetails
                .relatedPlaylists
                .uploads;

        const playlistResponse = await youtube.playlistItems.list({
            part: "snippet,contentDetails",
            playlistId: uploadsPlaylistId,
            maxResults: 20
        });

        const videoIds = playlistResponse.data.items
            .map(item => item.contentDetails.videoId)
            .join(",");

        if (!videoIds) {
            return res.json([]);
        }

        const videoResponse = await youtube.videos.list({
            part: "snippet,statistics",
            id: videoIds
        });

        const videos = videoResponse.data.items.map(video => ({
            id: video.id,
            title: video.snippet.title,
            thumbnail: video.snippet.thumbnails.medium.url,
            publishedAt: video.snippet.publishedAt,
            views: video.statistics.viewCount || "0",
            likes: video.statistics.likeCount || "0",
            comments: video.statistics.commentCount || "0"
        }));

        res.json(videos);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Kan video's niet ophalen"
        });
    }
});

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
    console.log(`Xavis Analytics draait op http://localhost:${PORT}`);
});
