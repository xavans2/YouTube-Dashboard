async function runSnapshotJob({
    url,
    fetchImpl = fetch,
    logger = console
}) {
    if (!url) {
        throw new Error("Snapshot URL is required");
    }

    const response = await fetchImpl(url, { method: "GET" });
    let body;

    try {
        body = await response.json();
    } catch (error) {
        throw new Error(`Snapshot endpoint returned invalid JSON (${response.status})`);
    }

    if (!response.ok) {
        throw new Error(body.error || `Snapshot endpoint failed (${response.status})`);
    }

    logger.info(`Snapshot collected: ${body.subscribers ?? "?"} subscribers, ${body.views ?? "?"} views`);
    return body;
}

module.exports = { runSnapshotJob };
