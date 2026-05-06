import { spawnSync } from "node:child_process";
import path from "node:path";
import astralBrands from "../data/astral-brands.json" with { type: "json" };
import { evidenceMeta, readJson, writeJson } from "./lib/seo-aeo-utils.mjs";

const steps = [
  ["keywords:map", "scripts/keyword-map.mjs"],
  ["links:internal", "scripts/internal-link-graph.mjs"],
  ["content:opportunities", "scripts/content-opportunities.mjs"],
  ["mentions:collect", "scripts/mentions-collect.mjs"]
];

for (const [label, script] of steps) {
  const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

const collectedAt = new Date().toISOString();
const keywordMap = await readJson("data/generated/keyword-map-snapshot.json", { brands: [] });
const content = await readJson("data/generated/content-opportunity-snapshot.json", { brands: [] });
const links = await readJson("data/generated/internal-link-graph-snapshot.json", { brands: [] });
const mentions = await readJson("data/generated/known-links-mentions-snapshot.json", { brands: [] });

function brandData(snapshot, slug) {
  return (snapshot.brands || []).find((brand) => brand.ownedBrandSlug === slug) || {};
}

function telegramPayload({ brand, module, severity, change, evidenceUrl, action }) {
  return {
    brand: brand.name,
    module,
    severity,
    changeDetected: change,
    evidenceUrl,
    recommendedAction: action
  };
}

const alerts = [];
for (const brand of astralBrands) {
  const keyword = brandData(keywordMap, brand.slug);
  const contentData = brandData(content, brand.slug);
  const linkData = brandData(links, brand.slug);
  const mentionData = brandData(mentions, brand.slug);

  for (const item of (keyword.ctrOpportunities || []).slice(0, 5)) {
    alerts.push(telegramPayload({
      brand,
      module: "SEO",
      severity: "High",
      change: `High-impression low-CTR query detected: ${item.keyword}`,
      evidenceUrl: item.evidenceUrl || brand.website,
      action: "Review title, meta description, and answer block for the ranking page."
    }));
  }

  for (const item of (keyword.cannibalization || []).slice(0, 5)) {
    alerts.push(telegramPayload({
      brand,
      module: "SEO",
      severity: "Medium",
      change: `Keyword cannibalization detected: ${item.keywordFamily}`,
      evidenceUrl: brand.website,
      action: "Choose a primary target page and consolidate internal links."
    }));
  }

  for (const item of (contentData.opportunities || []).filter((opportunity) => opportunity.priority === "High").slice(0, 5)) {
    alerts.push(telegramPayload({
      brand,
      module: "AEO",
      severity: item.severity,
      change: item.title,
      evidenceUrl: item.evidence.evidenceUrl,
      action: item.recommendedContentFormat
    }));
  }

  for (const item of (linkData.recommendations || []).filter((row) => row.priority === "High").slice(0, 5)) {
    alerts.push(telegramPayload({
      brand,
      module: "Internal Linking",
      severity: "Medium",
      change: item.reason,
      evidenceUrl: item.evidence.evidenceUrl,
      action: `Add contextual link to ${item.destinationPage}`
    }));
  }

  for (const item of (mentionData.unlinkedMentions || []).slice(0, 5)) {
    alerts.push(telegramPayload({
      brand,
      module: "Known Links and Mentions",
      severity: "Medium",
      change: `Unlinked mention detected from ${item.sourceDomain}`,
      evidenceUrl: item.evidenceUrl,
      action: item.action
    }));
  }
}

await writeJson(path.resolve("data/generated/seo-aeo-alerts.json"), {
  generatedAt: collectedAt,
  source: "No-paid-API SEO/AEO alert payloads",
  alertCount: alerts.length,
  alerts,
  evidence: evidenceMeta({
    source: "Keyword map, content opportunities, internal link graph, known links and mentions",
    evidenceUrl: "data/generated",
    method: "Telegram-ready payload generation",
    confidence: "Evidence-backed payloads",
    collectedAt
  })
});

console.log("Wrote data/generated/seo-aeo-alerts.json");
