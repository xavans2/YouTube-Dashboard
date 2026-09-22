const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const {
    buildHistoryWithCarryForward,
    calculateGrowth,
    DEFAULT_HISTORY_DAYS,
    MAX_HISTORY_DAYS,
    normalizeHistoryDays
} = require("./lib/history");
const { createHistoryStore } = require("./lib/history-store");
const { createConfigStore } = require("./lib/config-store");
const { buildHealthStatus } = require("./lib/health");

const app = express();
const PORT = 3000;
const HISTORY_DAYS = MAX_HISTORY_DAYS;
let terminalStarted = false;

const dataDirectory = path.join(__dirname, "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new Database(path.join(dataDirectory, "analytics.db"));
const configStore = createConfigStore({ db });
const historyStore = createHistoryStore(db);

function utcDateKey(offsetDays = 0, baseDate = new Date()) {
    const date = new Date(baseDate);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + offsetDays);
    return date.toISOString().slice(0, 10);
}

function getHistoryWithCarryForward(days = DEFAULT_HISTORY_DAYS) {
    const snapshots = historyStore.findFrom(utcDateKey(-days));
    return buildHistoryWithCarryForward(snapshots, days);
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

function getYoutubeClient() {
    const { youtubeApiKey } = configStore.read();
    return google.youtube({ version: "v3", auth: youtubeApiKey });
}

app.use(express.json());
app.use(express.static("public", { index: false }));

app.get("/", (req, res) => res.redirect("/terminal"));

app.get(["/dashboard", "/vid-data", "/top-vids", "/alerts", "/system", "/help", "/config", "/terminal"], (req, res) => {
    if (!terminalStarted && req.path !== "/terminal") {
        return res.redirect("/terminal");
    }
    if (!configStore.isComplete() && !["/config", "/terminal"].includes(req.path)) {
        return res.redirect("/config");
    }
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/subs", (req, res) => {
    res.redirect("/dashboard");
});

// ================================
// CHANNEL STATISTICS
// ================================

app.get("/api/config", (req, res) => {
    res.json(configStore.public());
});

app.post("/api/terminal/start", (req, res) => {
    if (req.body?.command !== "/usr/local/system/start") {
        return res.status(400).json({
            error: "Unknown command. Use /usr/local/system/start."
        });
    }

    terminalStarted = true;
    res.json({
        ok: true,
        status: "already-running",
        message: "node server.js is already running in the background.",
        redirectPath: configStore.isComplete() ? "/dashboard" : "/config"
    });
});

app.get("/api/health", (req, res) => {
    const dependencyErrors = [];
    let history = [];
    try {
        history = historyStore.findFrom(utcDateKey(-(HISTORY_DAYS - 1)));
    } catch (error) {
        console.error(error);
        dependencyErrors.push("database");
    }

    const health = buildHealthStatus({
        config: configStore.read(),
        latestSnapshot: history[history.length - 1]?.date || null,
        dependencyErrors
    });
    res.status(health.httpStatus).json(health);
});

app.put("/api/config", (req, res) => {
    const values = req.body || {};
    if (values.reset === true) {
        configStore.reset();
        return res.json(configStore.public());
    }
    if (
        (values.youtubeApiKey !== undefined && typeof values.youtubeApiKey !== "string") ||
        (values.youtubeChannelId !== undefined && typeof values.youtubeChannelId !== "string")
    ) {
        return res.status(400).json({ error: "Ongeldige configuratie" });
    }

    try {
        configStore.update(values);
        res.json(configStore.public());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Configuratie kon niet worden opgeslagen" });
    }
});

app.get("/api/channel", async (req, res) => {
    try {
        const { youtubeChannelId } = configStore.read();
        const response = await getYoutubeClient().channels.list({
            part: "snippet,statistics",
            id: youtubeChannelId
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
        const days = normalizeHistoryDays(req.query.days);
        const history = getHistoryWithCarryForward(days);

        res.json({
            days,
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
        const config = configStore.read();
        const health = buildHealthStatus({
            config,
            latestSnapshot: history[history.length - 1]?.date || null
        });
        res.json({
            status: "online",
            uptimeSeconds: Math.floor(process.uptime()),
            nodeVersion: process.version,
            historySnapshots: history.length,
            oldestSnapshot: history[0]?.date || null,
            latestSnapshot: history[history.length - 1]?.date || null,
            healthStatus: health.status,
            historyFreshness: health.checks.history.status,
            historyAgeDays: health.checks.history.ageDays,
            youtubeApiConfigured: Boolean(config.youtubeApiKey && config.youtubeChannelId),
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
        const { youtubeChannelId } = configStore.read();
        const youtube = getYoutubeClient();
        const channelResponse = await youtube.channels.list({
            part: "contentDetails",
            id: youtubeChannelId
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
