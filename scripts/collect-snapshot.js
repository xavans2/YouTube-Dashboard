const { runSnapshotJob } = require("../lib/snapshot-job");

const port = process.env.PORT || 3000;
const url = process.env.SNAPSHOT_URL || `http://127.0.0.1:${port}/api/channel`;

runSnapshotJob({ url })
    .catch((error) => {
        console.error(`Snapshot collection failed: ${error.message}`);
        process.exitCode = 1;
    });
