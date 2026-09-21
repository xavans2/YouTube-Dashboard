function calculateGrowth(history, field) {
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

function buildHistoryWithCarryForward(snapshots, days, now = new Date()) {
    const snapshotsByDate = new Map(snapshots.map((snapshot) => [snapshot.date, snapshot]));
    const history = [];
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);
    const firstDate = new Date(today);
    firstDate.setUTCDate(firstDate.getUTCDate() - (days - 1));
    const firstDateKey = firstDate.toISOString().slice(0, 10);
    let previousSnapshot = snapshots.find((snapshot) => snapshot.date < firstDateKey) || null;

    for (let offset = days - 1; offset >= 0; offset -= 1) {
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

module.exports = {
    buildHistoryWithCarryForward,
    calculateGrowth
};
