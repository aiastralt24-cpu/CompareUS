import { spawn } from "node:child_process";

const intervalMinutes = Number(process.env.MONITOR_INTERVAL_MINUTES || 30);
const runCollectEvery = Number(process.env.COLLECT_EVERY_RUNS || 8);
let runCount = 0;
let running = false;

function runCommand(command, args) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      env: process.env
    });
    child.on("close", (code) => resolve(code));
  });
}

async function tick() {
  if (running) {
    console.log("[realtime-monitor] Previous run still active; skipping this tick.");
    return;
  }

  running = true;
  runCount += 1;
  const startedAt = new Date().toISOString();
  console.log(`[realtime-monitor] Run ${runCount} started at ${startedAt}`);

  if (runCount === 1 || runCount % runCollectEvery === 0) {
    const collectCode = await runCommand("npm", ["run", "collect"]);
    if (collectCode !== 0) {
      console.log(`[realtime-monitor] collect exited with code ${collectCode}`);
    }

    const socialCollectCode = await runCommand("npm", ["run", "social:collect"]);
    if (socialCollectCode !== 0) {
      console.log(`[realtime-monitor] social:collect exited with code ${socialCollectCode}`);
    }
  }

  const monitorCode = await runCommand("npm", ["run", "monitor"]);
  if (monitorCode !== 0) {
    console.log(`[realtime-monitor] monitor exited with code ${monitorCode}`);
  }

  console.log(`[realtime-monitor] Run ${runCount} finished at ${new Date().toISOString()}`);
  running = false;
}

console.log(`[realtime-monitor] Starting. Interval: ${intervalMinutes} minutes. Collect every ${runCollectEvery} monitor runs.`);
await tick();
setInterval(tick, intervalMinutes * 60 * 1000);
