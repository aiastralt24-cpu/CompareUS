import path from "node:path";
import astralBrands from "../data/astral-brands.json" with { type: "json" };
import {
  evidenceMeta,
  readJson,
  severityFromPriority,
  writeJson
} from "./lib/seo-aeo-utils.mjs";

const outFile = path.resolve("data/generated/content-opportunity-snapshot.json");
const collectedAt = new Date().toISOString();
const keywordMap = await readJson("data/generated/keyword-map-snapshot.json", { brands: [] });
const aiVisibility = await readJson("data/generated/ai-visibility-snapshot.json", { brands: [] });

function createOpportunity({ brand, type, title, detail, sourceQuery = "", currentPage = "", recommendedTargetPage = "", format, priority = "Medium", evidenceUrl, confidence }) {
  return {
    id: `${brand.slug}-${type}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 120),
    ownedBrandSlug: brand.slug,
    brandName: brand.name,
    type,
    priority,
    severity: severityFromPriority(priority),
    title,
    detail,
    sourceQuery,
    currentRankingPage: currentPage,
    recommendedTargetPage,
    recommendedContentFormat: format,
    evidence: evidenceMeta({
      source: "Public crawl, GSC keyword map, or AI prompt visibility",
      evidenceUrl: evidenceUrl || brand.website,
      method: "Rule-based SEO/AEO opportunity detection",
      confidence: confidence || "Evidence-backed recommendation",
      collectedAt
    })
  };
}

function snapshotForBrand(brand) {
  return readJson(`data/generated/competitive-snapshots/${brand.competitorSetSlug}.json`, null);
}

const brands = [];
for (const ownedBrand of astralBrands) {
  const competitiveSnapshot = await snapshotForBrand(ownedBrand);
  const primary = (competitiveSnapshot?.brands || []).find((brand) => brand.name === ownedBrand.name) || (competitiveSnapshot?.brands || [])[0];
  const keywordData = (keywordMap.brands || []).find((brand) => brand.ownedBrandSlug === ownedBrand.slug);
  const aiData = (aiVisibility.brands || []).find((brand) => brand.ownedBrandSlug === ownedBrand.slug);
  const opportunities = [];

  if (!primary) {
    opportunities.push(
      createOpportunity({
        brand: ownedBrand,
        type: "setup_required",
        title: "Public crawl baseline required",
        detail: "Run the public website collector before content/AEO recommendations can be generated.",
        format: "Baseline collection",
        priority: "High",
        confidence: "Setup Required"
      })
    );
  } else {
    const signals = primary.homepage?.signals || {};
    const audit = primary.pageAudit || {};
    const schema = audit.schemaCoverage || {};
    if (!schema.FAQPage && !signals.hasFaqSchema) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "missing_faq_schema",
        title: "Add FAQ schema to answer-led pages",
        detail: "FAQ text or question-style content exists, but FAQPage schema is not consistently detected.",
        format: "FAQ block + FAQPage schema",
        priority: "High",
        evidenceUrl: primary.website
      }));
    }
    if (!schema.Product && !signals.hasProductSchema) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "missing_product_schema",
        title: "Add product/category schema",
        detail: "Product schema is not detected in the current public audit. Product/category pages should expose machine-readable product entities where appropriate.",
        format: "Product schema",
        priority: "High",
        evidenceUrl: primary.website
      }));
    }
    if ((audit.pagesWithDirectAnswerIntro || 0) < Math.max(1, Math.ceil((audit.okPageCount || 1) * 0.4))) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "weak_direct_answer_coverage",
        title: "Increase direct-answer intros",
        detail: "Several audited pages do not appear to start with short answer-first copy.",
        format: "80-120 word answer block",
        priority: "Medium",
        evidenceUrl: primary.website
      }));
    }
    if (!schema.BreadcrumbList && !signals.hasBreadcrumbSchema) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "missing_breadcrumb_schema",
        title: "Add breadcrumb schema",
        detail: "BreadcrumbList schema is not consistently detected, which weakens hierarchy clarity for search and answer engines.",
        format: "BreadcrumbList schema",
        priority: "Medium",
        evidenceUrl: primary.website
      }));
    }
    if (!signals.hasFreshnessSignals && (audit.pagesWithFreshnessSignals || 0) === 0) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "missing_freshness_signals",
        title: "Add visible freshness signals",
        detail: "No visible last-updated, dateModified, or freshness proxy was detected in the current public crawl.",
        format: "Updated date + reviewed content",
        priority: "Medium",
        evidenceUrl: primary.website
      }));
    }
  }

  for (const item of (keywordData?.ctrOpportunities || []).slice(0, 10)) {
    opportunities.push(createOpportunity({
      brand: ownedBrand,
      type: "ctr_content_opportunity",
      title: `Improve snippet for "${item.keyword}"`,
      detail: "High impressions with low CTR indicate title/meta/content alignment should be reviewed.",
      sourceQuery: item.keyword,
      currentPage: item.landingPage,
      recommendedTargetPage: item.landingPage,
      format: "Title/meta rewrite + answer block",
      priority: "High",
      evidenceUrl: item.evidenceUrl,
      confidence: "First-party GSC evidence"
    }));
  }

  if (aiData?.status === "Live") {
    for (const missing of (aiData?.missingCitations || []).slice(0, 8)) {
      opportunities.push(createOpportunity({
        brand: ownedBrand,
        type: "ai_missing_citation",
        title: `AI answer not citing Astral for ${missing.promptId}`,
        detail: missing.reason || "AI provider answer did not cite an Astral-owned domain.",
        sourceQuery: missing.prompt,
        format: "Citable guide/FAQ/category page",
        priority: "Medium",
        evidenceUrl: aiData.evidence?.evidenceUrl,
        confidence: "AI prompt evidence"
      }));
    }
  }

  const competitorBrands = (competitiveSnapshot?.brands || []).filter((brand) => brand.name !== ownedBrand.name);
  const competitorFaq = competitorBrands.some((brand) => brand.pageAudit?.schemaCoverage?.FAQPage || brand.homepage?.signals?.hasFaqSchema);
  const astralFaq = primary?.pageAudit?.schemaCoverage?.FAQPage || primary?.homepage?.signals?.hasFaqSchema;
  if (competitorFaq && !astralFaq) {
    opportunities.push(createOpportunity({
      brand: ownedBrand,
      type: "competitor_content_gap",
      title: "Competitors expose FAQ schema that Astral does not",
      detail: "Public competitor crawl found FAQ schema where the Astral-owned baseline did not.",
      format: "FAQPage schema",
      priority: "High",
      evidenceUrl: ownedBrand.website
    }));
  }

  brands.push({
    ownedBrandSlug: ownedBrand.slug,
    brandName: ownedBrand.name,
    status: opportunities.length ? "Live" : "No Issues Found",
    summary: {
      opportunityCount: opportunities.length,
      highPriorityCount: opportunities.filter((item) => item.priority === "High").length,
      keywordBackedCount: opportunities.filter((item) => item.sourceQuery).length,
      aiCitationGapCount: opportunities.filter((item) => item.type === "ai_missing_citation").length
    },
    opportunities: opportunities.slice(0, 80),
    evidence: evidenceMeta({
      source: "Public crawl + keyword map + AI visibility",
      evidenceUrl: ownedBrand.website,
      method: "Rule-based opportunity engine",
      confidence: opportunities.some((item) => item.evidence.confidence === "Setup Required") ? "Mixed evidence" : "Verified public/first-party evidence",
      collectedAt
    })
  });
}

await writeJson(outFile, {
  generatedAt: collectedAt,
  source: "No-paid-API content and AEO opportunity engine",
  dataMode: "public_and_first_party_evidence",
  brands
});

console.log(`Wrote ${outFile}`);
