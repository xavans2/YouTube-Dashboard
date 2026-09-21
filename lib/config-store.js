const maskSecret = (value) => {
    if (!value) return "";
    if (value.length <= 4) return "*".repeat(value.length);
    return `${value.slice(0, 2)}*********${value.slice(-2)}`;
};

function createConfigStore({ db, env = {} }) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS app_config (
            config_key TEXT PRIMARY KEY,
            config_value TEXT NOT NULL
        )
    `);

    const findValue = db.prepare(
        "SELECT config_value FROM app_config WHERE config_key = ?"
    );
    const saveValue = db.prepare(`
        INSERT INTO app_config (config_key, config_value)
        VALUES (?, ?)
        ON CONFLICT(config_key) DO UPDATE SET config_value = excluded.config_value
    `);

    function readLocal() {
        return {
            YOUTUBE_API_KEY: findValue.get("YOUTUBE_API_KEY")?.config_value || "",
            YOUTUBE_CHANNEL_ID:
                findValue.get("YOUTUBE_CHANNEL_ID")?.config_value || ""
        };
    }

    function read() {
        const local = readLocal();
        return {
            youtubeApiKey: local.YOUTUBE_API_KEY || env.YOUTUBE_API_KEY || "",
            youtubeChannelId:
                local.YOUTUBE_CHANNEL_ID || env.YOUTUBE_CHANNEL_ID || ""
        };
    }

    return {
        read,
        isComplete() {
            const config = read();
            return Boolean(config.youtubeApiKey && config.youtubeChannelId);
        },
        public() {
            const config = read();
            return {
                youtubeApiKey: maskSecret(config.youtubeApiKey),
                youtubeApiKeyConfigured: Boolean(config.youtubeApiKey),
                youtubeChannelId: config.youtubeChannelId
            };
        },
        update(values) {
            const current = read();
            const next = {
                youtubeApiKey:
                    values.youtubeApiKey?.trim() || current.youtubeApiKey,
                youtubeChannelId:
                    values.youtubeChannelId?.trim() || current.youtubeChannelId
            };
            const transaction = db.transaction(() => {
                saveValue.run("YOUTUBE_API_KEY", next.youtubeApiKey);
                saveValue.run("YOUTUBE_CHANNEL_ID", next.youtubeChannelId);
            });
            transaction();
            return read();
        },
        reset() {
            const transaction = db.transaction(() => {
                saveValue.run("YOUTUBE_API_KEY", "");
                saveValue.run("YOUTUBE_CHANNEL_ID", "");
            });
            transaction();
            return read();
        }
    };
}

module.exports = { createConfigStore, maskSecret };
