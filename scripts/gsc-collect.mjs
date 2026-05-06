import fs from "node:fs/promises";
import path from "node:path";
import googleProperties from "../data/google-properties.json" with { type: "json" };
import { evidenceMeta, getGoogleAccessToken } from "./lib/google-service-account.mjs";

const outFile = path.resolve("data/generated/search-console-snapshot.json");
const enabled = process.env.GSC_ENABLED === "1";
const collectedAt = new Date().toISOString();
const scopes = ["https://www.googleapis.com/auth/webmasters.readonly"];

function isoDate(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function setupRequired(config, reason) {
  return {
    ownedBrandSlug: config.ownedBrandSlug,
    brandName: config.brandName,
    status: "Setup Required",
    reason,
    property: config.gscPropertyUrl,
    summary: {
      clicks: null,
      impressions: null,
      ctr: null,
      averagePosition: null,
      brandQueryShare: null,
      nonBrandQueryShare: null
    },
    topQueries: [],
    topPages: [],
    keywordMovement: [],
    brandVsNonBrand: [],
    ctrIssues: [],
    queryPages: [],
    positionBuckets: [],
    devices: [],
    countries: [],
    evidence: evidenceMeta({
      source: "Google Search Console",
      evidenceUrl: config.gscPropertyUrl,
      method: "Setup check",
      confidence: "Setup Required",
      collectedAt
    })
  };
}

function rowToObject(row, dimensions) {
  const values = row.keys || [];
  return {
    dimensions: Object.fromEntries(dimensions.map((dimension, index) => [dimension, values[index] || ""])),
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    averagePosition: row.position || 0
  };
}

async function querySearchAnalytics({ accessToken, siteUrl, dimensions, rowLimit = 100 }) {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      startDate: isoDate(28),
      endDate: isoDate(1),
      dimensions,
      rowLimit,
      dataState: "final"
    })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json.error?.message || `GSC API failed with ${response.status}`);
  }
  return (json.rows || []).map((row) => rowToObject(row, dimensions));
}

function containsBrandTerm(query, brandTerms) {
  const value = query.toLowerCase();
  return brandTerms.some((term) => value.includes(term.toLowerCase()));
}

function summarizeRows(rows) {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition =
    impressions > 0
      ? rows.reduce((sum, row) => sum + row.averagePosition * row.impressions, 0) / impressions
      : null;
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : null,
    averagePosition: weightedPosition
  };
}

function buildPositionBuckets(queryRows) {
  const buckets = [
    ["1-3", (pos) => pos >= 1 && pos <= 3],
    ["4-10", (pos) => pos > 3 && pos <= 10],
    ["11-20", (pos) => pos > 10 && pos <= 20],
    ["21-50", (pos) => pos > 20 && pos <= 50],
    ["50+", (pos) => pos > 50]
  ];
  return buckets.map(([bucket, matcher]) => {
    const rows = queryRows.filter((row) => matcher(row.averagePosition));
    const summary = summarizeRows(rows);
    return { bucket, queryCount: rows.length, ...summary };
  });
}

async function collectBrand(config, token) {
  if (!enabled) {
    return setupRequired(config, "GSC_ENABLED is not set to 1.");
  }
  if (!config.gscPropertyUrl) {
    return setupRequired(config, "GSC property URL is not configured for this Astral brand.");
  }
  if (!token.ok) {
    return setupRequired(config, token.reason);
  }

  try {
    const [queryRows, pageRows, queryPageRows, deviceRows, countryRows] = await Promise.all([
      querySearchAnalytics({ accessToken: token.accessToken, siteUrl: config.gscPropertyUrl, dimensions: ["query"], rowLimit: 100 }),
      querySearchAnalytics({ accessToken: token.accessToken, siteUrl: config.gscPropertyUrl, dimensions: ["page"], rowLimit: 50 }),
      querySearchAnalytics({ accessToken: token.accessToken, siteUrl: config.gscPropertyUrl, dimensions: ["query", "page"], rowLimit: 500 }),
      querySearchAnalytics({ accessToken: token.accessToken, siteUrl: config.gscPropertyUrl, dimensions: ["device"], rowLimit: 10 }),
      querySearchAnalytics({ accessToken: token.accessToken, siteUrl: config.gscPropertyUrl, dimensions: ["country"], rowLimit: 20 })
    ]);
    const summary = summarizeRows(queryRows);
    const brandRows = queryRows.filter((row) => containsBrandTerm(row.dimensions.query, config.brandTerms || []));
    const nonBrandRows = queryRows.filter((row) => !containsBrandTerm(row.dimensions.query, config.brandTerms || []));
    const brandSummary = summarizeRows(brandRows);
    const nonBrandSummary = summarizeRows(nonBrandRows);

    return {
      ownedBrandSlug: config.ownedBrandSlug,
      brandName: config.brandName,
      status: "Live",
      property: config.gscPropertyUrl,
      dateRange: { startDate: isoDate(28), endDate: isoDate(1) },
      summary: {
        ...summary,
        brandQueryShare: summary.impressions ? brandSummary.impressions / summary.impressions : null,
        nonBrandQueryShare: summary.impressions ? nonBrandSummary.impressions / summary.impressions : null
      },
      topQueries: queryRows.slice(0, 25),
      topPages: pageRows.slice(0, 25),
      keywordMovement: [],
      brandVsNonBrand: [
        { segment: "Brand", ...brandSummary },
        { segment: "Non-brand", ...nonBrandSummary }
      ],
      ctrIssues: queryRows
        .filter((row) => row.impressions >= 100 && row.ctr < 0.02)
        .slice(0, 12),
      queryPages: queryPageRows,
      positionBuckets: buildPositionBuckets(queryRows),
      devices: deviceRows,
      countries: countryRows,
      evidence: evidenceMeta({
        source: "Google Search Console",
        evidenceUrl: config.gscPropertyUrl,
        method: "Search Analytics API, last 28 final days",
        collectedAt
      })
    };
  } catch (error) {
    return setupRequired(config, error.message);
  }
}

const token = enabled ? await getGoogleAccessToken(scopes) : { ok: false, reason: "GSC_ENABLED is not set to 1." };
const brands = [];
for (const config of googleProperties) {
  brands.push(await collectBrand(config, token));
}

const snapshot = {
  generatedAt: collectedAt,
  source: "Google Search Console",
  dataMode: brands.some((brand) => brand.status === "Live") ? "first_party" : "setup_required",
  brands
};

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
