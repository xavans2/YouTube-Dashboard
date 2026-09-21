const DAY_MS = 24 * 60 * 60 * 1000;

function utcMidnight(value) {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}

function buildHealthStatus({ config, latestSnapshot, dependencyErrors = [], now = new Date() }) {
    const missingFields = [];
    if (!config?.youtubeApiKey) missingFields.push("youtubeApiKey");
    if (!config?.youtubeChannelId) missingFields.push("youtubeChannelId");

    const configuration = missingFields.length
        ? { status: "missing", missingFields }
        : { status: "ok" };

    const ageDays = latestSnapshot
        ? Math.max(
              0,
              Math.floor(
                  (utcMidnight(now) - utcMidnight(`${latestSnapshot}T00:00:00.000Z`)) /
                      DAY_MS
              )
          )
        : null;
    const history = !latestSnapshot
        ? { status: "missing", latestSnapshot: null, ageDays: null }
        : ageDays > 1
          ? { status: "stale", latestSnapshot, ageDays }
          : { status: "ok", latestSnapshot, ageDays };

    const errors = [...new Set(dependencyErrors)].filter((error) =>
        ["database", "history"].includes(error)
    );
    const status = errors.length || configuration.status === "missing"
        ? "unhealthy"
        : history.status !== "ok"
          ? "degraded"
          : "healthy";

    return {
        status,
        httpStatus: status === "healthy" ? 200 : 503,
        checks: { configuration, history },
        errors
    };
}

module.exports = { buildHealthStatus };
