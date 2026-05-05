import fs from "node:fs/promises";
import path from "node:path";
import competitorSets from "../data/competitor-sets.json" with { type: "json" };

const outDir = path.resolve("data/generated/browser-evidence");
const outFile = path.resolve("data/generated/browser-evidence.json");
const activeSetSlug = process.env.MONITOR_BRAND_SLUG || "astral-pipes";
const activeSet = competitorSets.find((set) => set.slug === activeSetSlug) || competitorSets[0];
const brands = activeSet.brands || [];
const platforms = new Set(["instagram", "facebook", "linkedin"]);

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

function safeName(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const output = {
  generatedAt: new Date().toISOString(),
  monitoredSet: activeSetSlug,
  methodology: {
    mode: "Approved browser evidence collector",
    collected: "Screenshots and visible page metadata for restricted social platforms",
    confidence: "Browser evidence when Playwright is installed and pages are reachable"
  },
  brands: []
};

const playwright = await loadPlaywright();
if (!playwright) {
  output.status = "Setup Required";
  output.unavailableReason = "Install the playwright package to enable browser evidence collection.";
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${outFile}`);
  process.exit(0);
}

await fs.mkdir(outDir, { recursive: true });
let browser;
try {
  browser = await playwright.chromium.launch({ headless: true });
} catch (error) {
  output.status = "Restricted";
  output.unavailableReason = "Browser launch was blocked by the local sandbox or OS permissions. Run outside the sandbox or with approved browser automation permissions.";
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${outFile}`);
  process.exit(0);
}

for (const brand of brands) {
  const profiles = [];
  for (const [platform, url] of Object.entries(brand.social || {})) {
    if (!platforms.has(platform)) continue;
    const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
    const screenshotPath = path.join(outDir, `${safeName(brand.name)}-${platform}.png`);
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.screenshot({ path: screenshotPath, fullPage: false });
      profiles.push({
        platform,
        url,
        title: await page.title(),
        screenshotPath,
        status: "Captured",
        evidence: {
          source: "Approved browser evidence",
          collectedAt: new Date().toISOString(),
          method: "Headless browser screenshot",
          confidence: "Captured public page evidence"
        }
      });
    } catch (error) {
      profiles.push({
        platform,
        url,
        status: "Restricted",
        error: error?.message || "Capture failed"
      });
    } finally {
      await page.close();
    }
  }
  output.brands.push({ name: brand.name, profiles });
}

await browser.close();
await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
