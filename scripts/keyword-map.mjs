import path from "node:path";
import googleProperties from "../data/google-properties.json" with { type: "json" };
import promptBank from "../data/ai-prompt-bank.json" with { type: "json" };
import {
  classifyIntent,
  classifyKeywordCluster,
  evidenceMeta,
  funnelStage,
  inferAeoOpportunity,
  isBrandQuery,
  readCsvIfExists,
  readJson,
  slugify,
  uniqueBy,
  writeJson
} from "./lib/seo-aeo-utils.mjs";

const outFile = path.resolve("data/generated/keyword-map-snapshot.json");
const collectedAt = new Date().toISOString();
const gscSnapshot = await readJson("data/generated/search-console-snapshot.json", { brands: [] });
const importedKeywords = await readCsvIfExists("data/imports/target-keywords.csv");
const gscBySlug = new Map((gscSnapshot.brands || []).map((brand) => [brand.ownedBrandSlug, brand]));

function seedKeywords(config) {
  return Object.entries(config.nonBrandKeywordGroups || {}).flatMap(([cluster, terms]) =>
    (terms || []).map((term) => ({
      ownedBrandSlug: config.ownedBrandSlug,
      keyword: term,
      cluster,
      intent: classifyIntent(term),
      funnelStage: funnelStage(classifyIntent(term)),
      targetPage: "",
      priority: "Medium",
      source: "Configured category keyword seed"
    }))
  );
}

function importedFor(config) {
  return importedKeywords
    .filter((row) => row.ownedBrandSlug === config.ownedBrandSlug && row.keyword)
    .map((row) => {
      const intent = row.intent || classifyIntent(row.keyword);
      return {
        ownedBrandSlug: config.ownedBrandSlug,
        keyword: row.keyword,
        cluster: row.cluster || classifyKeywordCluster(row.keyword, config),
        intent,
        funnelStage: row.funnelStage || funnelStage(intent),
        targetPage: row.targetPage || "",
        priority: row.priority || "Medium",
        source: "Manual target keyword bank import",
        evidenceUrl: row.evidenceUrl || ""
      };
    });
}

function mapGscRows(config, gsc) {
  const queryPageRows = gsc.queryPages || [];
  const queryRows = gsc.topQueries || [];
  const pageByQuery = new Map();
  for (const row of queryPageRows) {
    const query = row.dimensions?.query;
    const current = pageByQuery.get(query);
    if (!current || row.impressions > current.impressions) pageByQuery.set(query, row);
  }
  return queryRows.map((row) => {
    const query = row.dimensions?.query || "";
    const pageRow = pageByQuery.get(query);
    const intent = classifyIntent(query);
    return {
      ownedBrandSlug: config.ownedBrandSlug,
      keyword: query,
      landingPage: pageRow?.dimensions?.page || "",
      cluster: classifyKeywordCluster(query, config),
      intent,
      funnelStage: funnelStage(intent),
      aeoOpportunity: inferAeoOpportunity({ query, page: pageRow?.dimensions?.page || "" }),
      isBrand: isBrandQuery(query, config),
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      averagePosition: row.averagePosition,
      source: "Google Search Console",
      evidenceUrl: gsc.property,
      collectedAt: gsc.evidence?.collectedAt || collectedAt
    };
  });
}

function buildClusters(mappings) {
  const grouped = new Map();
  for (const mapping of mappings) {
    const key = mapping.cluster || "general";
    const cluster = grouped.get(key) || {
      cluster: key,
      keywordCount: 0,
      clicks: 0,
      impressions: 0,
      bestAveragePosition: null,
      intents: new Set(),
      funnelStages: new Set(),
      aeoOpportunities: new Set()
    };
    cluster.keywordCount += 1;
    cluster.clicks += mapping.clicks || 0;
    cluster.impressions += mapping.impressions || 0;
    if (mapping.averagePosition != null) {
      cluster.bestAveragePosition =
        cluster.bestAveragePosition == null ? mapping.averagePosition : Math.min(cluster.bestAveragePosition, mapping.averagePosition);
    }
    cluster.intents.add(mapping.intent);
    cluster.funnelStages.add(mapping.funnelStage);
    cluster.aeoOpportunities.add(mapping.aeoOpportunity || "Target page mapping");
    grouped.set(key, cluster);
  }
  return [...grouped.values()].map((cluster) => ({
    ...cluster,
    intents: [...cluster.intents],
    funnelStages: [...cluster.funnelStages],
    aeoOpportunities: [...cluster.aeoOpportunities],
    slug: slugify(cluster.cluster)
  }));
}

function cannibalization(mappings) {
  const grouped = new Map();
  for (const mapping of mappings.filter((item) => item.landingPage)) {
    const key = `${mapping.cluster}:${mapping.keyword.toLowerCase().replace(/\b(best|top|buy|price|cost)\b/g, "").trim()}`;
    const group = grouped.get(key) || [];
    group.push(mapping);
    grouped.set(key, group);
  }
  return [...grouped.values()]
    .filter((group) => new Set(group.map((item) => item.landingPage)).size > 1)
    .slice(0, 20)
    .map((group) => ({
      keywordFamily: group[0].keyword,
      cluster: group[0].cluster,
      pages: [...new Set(group.map((item) => item.landingPage))],
      evidence: "Multiple landing pages visible for similar query family"
    }));
}

const brands = googleProperties.map((config) => {
  const gsc = gscBySlug.get(config.ownedBrandSlug);
  const imports = importedFor(config);
  const seeds = seedKeywords(config);
  const gscMappings = gsc?.status === "Live" ? mapGscRows(config, gsc) : [];
  const mappings = uniqueBy([...gscMappings, ...imports, ...seeds], (item) => `${item.keyword}:${item.landingPage || item.targetPage || ""}`);
  const live = gscMappings.length > 0;
  const imported = imports.length > 0;
  return {
    ownedBrandSlug: config.ownedBrandSlug,
    brandName: config.brandName,
    status: live ? "Live" : imported ? "Imported" : "Setup Required",
    reason: live ? "" : imported ? "Manual keyword bank imported; GSC query data not connected." : gsc?.reason || "GSC keyword data is not connected.",
    summary: {
      keywordCount: mappings.length,
      gscKeywordCount: gscMappings.length,
      importedKeywordCount: imports.length,
      seedKeywordCount: seeds.length,
      brandKeywordCount: mappings.filter((item) => item.isBrand).length,
      nonBrandKeywordCount: mappings.filter((item) => item.isBrand === false || !item.isBrand).length,
      ctrOpportunityCount: mappings.filter((item) => (item.impressions || 0) >= 100 && (item.ctr || 0) < 0.02).length,
      cannibalizationCount: cannibalization(mappings).length
    },
    clusters: buildClusters(mappings),
    mappings: mappings.slice(0, 250),
    ctrOpportunities: mappings.filter((item) => (item.impressions || 0) >= 100 && (item.ctr || 0) < 0.02).slice(0, 50),
    cannibalization: cannibalization(mappings),
    promptMappings: promptBank
      .filter((prompt) => prompt.ownedBrandSlug === config.ownedBrandSlug)
      .map((prompt) => ({
        promptId: prompt.promptId,
        prompt: prompt.prompt,
        category: prompt.category,
        mappedCluster: classifyKeywordCluster(prompt.prompt, config)
      })),
    evidence: evidenceMeta({
      source: live ? "Google Search Console + public keyword config" : imported ? "Manual keyword import + public keyword config" : "Configured keyword seed",
      evidenceUrl: gsc?.property || config.gscPropertyUrl,
      method: live ? "GSC query/page mapping with intent and AEO classification" : "Setup-safe keyword mapping",
      confidence: live ? "First-party GSC evidence" : imported ? "Imported evidence" : "Setup Required",
      collectedAt
    })
  };
});

await writeJson(outFile, {
  generatedAt: collectedAt,
  source: "No-paid-API keyword mapping",
  dataMode: brands.some((brand) => brand.status === "Live") ? "first_party" : brands.some((brand) => brand.status === "Imported") ? "imported" : "setup_required",
  importNotes: {
    targetKeywordBank: "Optional CSV: data/imports/target-keywords.csv with ownedBrandSlug,keyword,cluster,intent,funnelStage,targetPage,priority,evidenceUrl"
  },
  brands
});

console.log(`Wrote ${outFile}`);
