import fs from "node:fs/promises";
import path from "node:path";
import googleProperties from "../data/google-properties.json" with { type: "json" };
import { evidenceMeta, getGoogleAccessToken } from "./lib/google-service-account.mjs";

const outFile = path.resolve("data/generated/ai-referral-traffic-snapshot.json");
const enabled = process.env.GA4_ENABLED === "1";
const collectedAt = new Date().toISOString();
const scopes = ["https://www.googleapis.com/auth/analytics.readonly"];
const aiSources = [
  "chatgpt.com",
  "openai.com",
  "perplexity.ai",
  "gemini.google.com",
  "bard.google.com",
  "copilot.microsoft.com",
  "claude.ai",
  "poe.com",
  "you.com"
];

function setupRequired(config, reason) {
  return {
    ownedBrandSlug: config.ownedBrandSlug,
    brandName: config.brandName,
    status: "Setup Required",
    reason,
    propertyId: config.ga4PropertyId || null,
    summary: {
      sessions: null,
      totalUsers: null,
      eventCount: null,
      conversions: null,
      topSource: null
    },
    sources: [],
    landingPages: [],
    evidence: evidenceMeta({
      source: "Google Analytics 4",
      evidenceUrl: config.ga4PropertyId ? `GA4 property ${config.ga4PropertyId}` : "GA4 property not configured",
      method: "Setup check",
      confidence: "Setup Required",
      collectedAt
    })
  };
}

function isoDate(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function metricValue(row, index) {
  return Number(row.metricValues?.[index]?.value || 0);
}

function dimensionValue(row, index) {
  return row.dimensionValues?.[index]?.value || "";
}

function isAiSource(source = "") {
  const lower = source.toLowerCase();
  return aiSources.some((domain) => lower.includes(domain));
}

async function runReport({ accessToken, propertyId, dimensions, metrics, limit = 1000 }) {
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      dateRanges: [{ startDate: isoDate(28), endDate: isoDate(1) }],
      dimensions: dimensions.map((name) => ({ name })),
      metrics: metrics.map((name) => ({ name })),
      limit
    })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error?.message || `GA4 API failed with ${response.status}`);
  }
  return json.rows || [];
}

function summarize(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.sessions += row.sessions || 0;
      acc.totalUsers += row.totalUsers || 0;
      acc.eventCount += row.eventCount || 0;
      return acc;
    },
    { sessions: 0, totalUsers: 0, eventCount: 0, conversions: null, topSource: null }
  );
}

async function collectBrand(config, token) {
  if (!enabled) return setupRequired(config, "GA4_ENABLED is not set to 1.");
  if (!config.ga4PropertyId) return setupRequired(config, "GA4 property ID is not configured for this Astral brand.");
  if (!token.ok) return setupRequired(config, token.reason);

  try {
    const sourceRows = await runReport({
      accessToken: token.accessToken,
      propertyId: config.ga4PropertyId,
      dimensions: ["sessionSource", "landingPagePlusQueryString"],
      metrics: ["sessions", "totalUsers", "eventCount"]
    });

    const aiRows = sourceRows
      .map((row) => ({
        source: dimensionValue(row, 0),
        landingPage: dimensionValue(row, 1),
        sessions: metricValue(row, 0),
        totalUsers: metricValue(row, 1),
        eventCount: metricValue(row, 2)
      }))
      .filter((row) => isAiSource(row.source));

    const bySource = new Map();
    const byPage = new Map();
    for (const row of aiRows) {
      const source = bySource.get(row.source) || { source: row.source, sessions: 0, totalUsers: 0, eventCount: 0 };
      source.sessions += row.sessions;
      source.totalUsers += row.totalUsers;
      source.eventCount += row.eventCount;
      bySource.set(row.source, source);

      const page = byPage.get(row.landingPage) || { landingPage: row.landingPage, sessions: 0, totalUsers: 0, eventCount: 0 };
      page.sessions += row.sessions;
      page.totalUsers += row.totalUsers;
      page.eventCount += row.eventCount;
      byPage.set(row.landingPage, page);
    }

    const sources = [...bySource.values()].sort((a, b) => b.sessions - a.sessions);
    const landingPages = [...byPage.values()].sort((a, b) => b.sessions - a.sessions).slice(0, 20);
    const summary = summarize(aiRows);
    summary.topSource = sources[0]?.source || null;

    return {
      ownedBrandSlug: config.ownedBrandSlug,
      brandName: config.brandName,
      status: "Live",
      propertyId: config.ga4PropertyId,
      aiReferrerDomains: aiSources,
      dateRange: { startDate: isoDate(28), endDate: isoDate(1) },
      summary,
      sources,
      landingPages,
      evidence: evidenceMeta({
        source: "Google Analytics 4",
        evidenceUrl: `GA4 property ${config.ga4PropertyId}`,
        method: "Analytics Data API, AI referrer source filter, last 28 days",
        collectedAt
      })
    };
  } catch (error) {
    return setupRequired(config, error.message);
  }
}

const token = enabled ? await getGoogleAccessToken(scopes) : { ok: false, reason: "GA4_ENABLED is not set to 1." };
const brands = [];
for (const config of googleProperties) {
  brands.push(await collectBrand(config, token));
}

const snapshot = {
  generatedAt: collectedAt,
  source: "Google Analytics 4",
  dataMode: brands.some((brand) => brand.status === "Live") ? "first_party" : "setup_required",
  note: "AI platforms do not expose impressions here. This snapshot records first-party AI referral traffic only.",
  brands
};

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
