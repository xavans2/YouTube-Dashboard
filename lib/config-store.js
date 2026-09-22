const maskSecret = (value) => {
    if (!value) return "";
    if (value.length <= 4) return "*".repeat(value.length);
    return `${value.slice(0, 2)}*********${value.slice(-2)}`;
};

const DEFAULT_SETTINGS = {
    refreshIntervalSeconds: 60,
    alertGrowthThresholdPercent: 0,
    defaultHistoryDays: 30,
    showChannelDescription: true
};

function normalizeSettings(values = {}) {
    const refreshIntervalSeconds = Number(values.refreshIntervalSeconds);
    const alertGrowthThresholdPercent = Number(values.alertGrowthThresholdPercent);
    const defaultHistoryDays = Number(values.defaultHistoryDays);

    return {
        refreshIntervalSeconds:
            Number.isInteger(refreshIntervalSeconds) && refreshIntervalSeconds >= 15 && refreshIntervalSeconds <= 3600
                ? refreshIntervalSeconds
                : DEFAULT_SETTINGS.refreshIntervalSeconds,
        alertGrowthThresholdPercent:
            Number.isFinite(alertGrowthThresholdPercent) && alertGrowthThresholdPercent >= 0 && alertGrowthThresholdPercent <= 100
                ? alertGrowthThresholdPercent
                : DEFAULT_SETTINGS.alertGrowthThresholdPercent,
        defaultHistoryDays: [7, 30, 90].includes(defaultHistoryDays)
            ? defaultHistoryDays
            : DEFAULT_SETTINGS.defaultHistoryDays,
        showChannelDescription: typeof values.showChannelDescription === "boolean"
            ? values.showChannelDescription
            : DEFAULT_SETTINGS.showChannelDescription
    };
}

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

    function readSettings() {
        return normalizeSettings({
            refreshIntervalSeconds: findValue.get("REFRESH_INTERVAL_SECONDS")?.config_value,
            alertGrowthThresholdPercent: findValue.get("ALERT_GROWTH_THRESHOLD_PERCENT")?.config_value,
            defaultHistoryDays: findValue.get("DEFAULT_HISTORY_DAYS")?.config_value,
            showChannelDescription: findValue.get("SHOW_CHANNEL_DESCRIPTION")?.config_value === undefined
                ? undefined
                : findValue.get("SHOW_CHANNEL_DESCRIPTION").config_value === "true"
        });
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
                youtubeChannelId: config.youtubeChannelId,
                settings: readSettings()
            };
        },
        settings: readSettings,
        update(values) {
            const current = read();
            const currentSettings = readSettings();
            const nextSettings = normalizeSettings({
                refreshIntervalSeconds: values.refreshIntervalSeconds === undefined
                    ? currentSettings.refreshIntervalSeconds
                    : values.refreshIntervalSeconds,
                alertGrowthThresholdPercent: values.alertGrowthThresholdPercent === undefined
                    ? currentSettings.alertGrowthThresholdPercent
                    : values.alertGrowthThresholdPercent,
                defaultHistoryDays: values.defaultHistoryDays === undefined
                    ? currentSettings.defaultHistoryDays
                    : values.defaultHistoryDays,
                showChannelDescription: values.showChannelDescription === undefined
                    ? currentSettings.showChannelDescription
                    : values.showChannelDescription
            });
            const next = {
                youtubeApiKey:
                    values.youtubeApiKey?.trim() || current.youtubeApiKey,
                youtubeChannelId:
                    values.youtubeChannelId?.trim() || current.youtubeChannelId
            };
            const transaction = db.transaction(() => {
                saveValue.run("YOUTUBE_API_KEY", next.youtubeApiKey);
                saveValue.run("YOUTUBE_CHANNEL_ID", next.youtubeChannelId);
                saveValue.run("REFRESH_INTERVAL_SECONDS", String(nextSettings.refreshIntervalSeconds));
                saveValue.run("ALERT_GROWTH_THRESHOLD_PERCENT", String(nextSettings.alertGrowthThresholdPercent));
                saveValue.run("DEFAULT_HISTORY_DAYS", String(nextSettings.defaultHistoryDays));
                saveValue.run("SHOW_CHANNEL_DESCRIPTION", String(nextSettings.showChannelDescription));
            });
            transaction();
            return read();
        },
        reset() {
            const transaction = db.transaction(() => {
                saveValue.run("YOUTUBE_API_KEY", "");
                saveValue.run("YOUTUBE_CHANNEL_ID", "");
                saveValue.run("REFRESH_INTERVAL_SECONDS", String(DEFAULT_SETTINGS.refreshIntervalSeconds));
                saveValue.run("ALERT_GROWTH_THRESHOLD_PERCENT", String(DEFAULT_SETTINGS.alertGrowthThresholdPercent));
                saveValue.run("DEFAULT_HISTORY_DAYS", String(DEFAULT_SETTINGS.defaultHistoryDays));
                saveValue.run("SHOW_CHANNEL_DESCRIPTION", String(DEFAULT_SETTINGS.showChannelDescription));
            });
            transaction();
            return read();
        }
    };
}

module.exports = { createConfigStore, maskSecret };
