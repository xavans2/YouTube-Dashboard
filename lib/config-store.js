const fs = require("fs");
const path = require("path");

function maskSecret(value) {
    if (!value) return "";
    if (value.length <= 4) return "*".repeat(value.length);
    return `${value.slice(0, 2)}*********${value.slice(-2)}`;
}

function createConfigStore({ filePath, env = process.env }) {
    function readLocal() {
        try {
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch (error) {
            if (error.code !== "ENOENT") console.error(error);
            return {};
        }
    }

    function read() {
        const local = readLocal();
        return {
            youtubeApiKey: local.YOUTUBE_API_KEY || env.YOUTUBE_API_KEY || "",
            youtubeChannelId: local.YOUTUBE_CHANNEL_ID || env.YOUTUBE_CHANNEL_ID || ""
        };
    }

    return {
        read,
        public() {
            const config = read();
            return {
                youtubeApiKey: maskSecret(config.youtubeApiKey),
                youtubeApiKeyConfigured: Boolean(config.youtubeApiKey),
                youtubeChannelId: config.youtubeChannelId
            };
        },
        update(values) {
            const current = readLocal();
            const next = {
                YOUTUBE_API_KEY:
                    values.youtubeApiKey?.trim() || current.YOUTUBE_API_KEY || "",
                YOUTUBE_CHANNEL_ID:
                    values.youtubeChannelId?.trim() || current.YOUTUBE_CHANNEL_ID || ""
            };
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`);
            return read();
        }
    };
}

module.exports = { createConfigStore, maskSecret };
