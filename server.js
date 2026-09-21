const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const {
    buildHistoryWithCarryForward,
    calculateGrowth
} = require("./lib/history");
const { createHistoryStore } = require("./lib/history-store");
require("dotenv").config();

const app = express();
const PORT = 3000;
const HISTORY_DAYS = 30;

const dataDirectory = path.join(__dirname, "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, "analytics.db"));
const historyStore = createHistoryStore(db);

function utcDateKey(offsetDays = 0, baseDate = new Date()) {
    const date = new Date(baseDate);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + offsetDays);
    return date.toISOString().slice(0, 10);
}

function getHistoryWithCarryForward() {
    const snapshots = historyStore.findFrom(utcDateKey(-HISTORY_DAYS));
    return buildHistoryWithCarryForward(snapshots, HISTORY_DAYS);
}

function recordChannelSnapshot(channel) {
    const now = new Date();
    historyStore.saveSnapshot({
        snapshotDate: utcDateKey(0, now),
        capturedAt: now.toISOString(),
        subscribers: Number(channel.statistics.subscriberCount || 0),
        views: Number(channel.statistics.viewCount || 0),
        videos: Number(channel.statistics.videoCount || 0)
    });

    historyStore.deleteBefore(utcDateKey(-HISTORY_DAYS, now));
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
                subscribers: calculateGrowth(history, "subscribers"),
                views: calculateGrowth(history, "views"),
                videos: calculateGrowth(history, "videos")
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Kan geschiedenis niet ophalen" });
    }
});

app.get("/api/system", (req, res) => {
    try {
        const history = historyStore.findFrom(utcDateKey(-(HISTORY_DAYS - 1)));
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
