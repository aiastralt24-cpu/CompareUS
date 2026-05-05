import { spawn } from "node:child_process";
import competitorSets from "../data/competitor-sets.json" with { type: "json" };

const requestedSlugs = (process.env.MONITOR_BRAND_SLUGS || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const slugs = requestedSlugs.length
  ? requestedSlugs
  : competitorSets
      .filter((set) => set.status === "Live" && (set.brands || []).length > 0)
      .map((set) => set.slug);

const tasks = [
  ["collect", ["run", "collect"]],
  ["social:collect", ["run", "social:collect"]],
  ["ads:collect", ["run", "ads:collect"]],
  ["monitor", ["run", process.env.MONITOR_RESET === "1" ? "monitor:reset" : "monitor"]]
];

function runNpmTask(slug, [label, args]) {
  return new Promise((resolve) => {
    console.log(`\n[${slug}] npm ${args.join(" ")}`);
    const child = spawn("npm", args, {
      stdio: "inherit",
      shell: false,
      env: {
        ...process.env,
        MONITOR_BRAND_SLUG: slug
      }
    });
    child.on("close", (code) => {
      if (code !== 0) {
        console.log(`[${slug}] ${label} exited with code ${code}`);
      }
      resolve(code);
    });
  });
}

const failures = [];
for (const slug of slugs) {
  for (const task of tasks) {
    const code = await runNpmTask(slug, task);
    if (code !== 0) failures.push(`${slug}:${task[0]}:${code}`);
  }
}

if (failures.length) {
  console.error(`Completed with failures: ${failures.join(", ")}`);
  process.exit(1);
}

console.log(`Completed multi-brand collection for ${slugs.length} brand set(s): ${slugs.join(", ")}`);
