const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("persists terminal output and resets it at the next start command", () => {
    const html = fs.readFileSync("public/index.html", "utf8");

    assert.match(html, /xavis-terminal-history/);
    assert.match(html, /JSON\.parse\(saved\)/);
    assert.match(html, /appendTerminalLine\(`root@xavis:~\$ \$\{command\}`\)/);
    assert.match(html, /terminalHistory = \[\];/);
    assert.match(html, /renderTerminalHistory\(\);/);
    assert.match(html, /xavis-terminal-started/);
    assert.match(html, /api\/terminal\/status/);
});
