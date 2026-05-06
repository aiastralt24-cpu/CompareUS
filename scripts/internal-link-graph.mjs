import path from "node:path";
import astralBrands from "../data/astral-brands.json" with { type: "json" };
import { evidenceMeta, readJson, writeJson } from "./lib/seo-aeo-utils.mjs";

const outFile = path.resolve("data/generated/internal-link-graph-snapshot.json");
const collectedAt = new Date().toISOString();
const keywordMap = await readJson("data/generated/keyword-map-snapshot.json", { brands: [] });

function isGenericAnchor(value = "") {
  return /^(read more|learn more|click here|view more|know more|explore|details)$/i.test(value.trim());
}

function recommendation({ brand, type, sourcePage, destinationPage, anchorText, reason, priority = "Medium" }) {
  return {
    ownedBrandSlug: brand.slug,
    brandName: brand.name,
    type,
    sourcePage,
    destinationPage,
    suggestedAnchorText: anchorText,
    reason,
    priority,
    evidence: evidenceMeta({
      source: "Public site crawl and GSC keyword map",
      evidenceUrl: destinationPage || brand.website,
      method: "Google crawlable link and anchor-text rule proxy",
      confidence: "Public crawl proxy",
      collectedAt
    })
  };
}

const brands = [];
for (const ownedBrand of astralBrands) {
  const snapshot = await readJson(`data/generated/competitive-snapshots/${ownedBrand.competitorSetSlug}.json`, null);
  const primary = (snapshot?.brands || []).find((brand) => brand.name === ownedBrand.name) || (snapshot?.brands || [])[0];
  const monitorState = await readJson(`data/monitor/${ownedBrand.competitorSetSlug}.json`, { brands: [] });
  const monitorBrands = Array.isArray(monitorState.brands) ? monitorState.brands : Object.values(monitorState.brands || {});
  const stateBrand = monitorBrands.find((brand) => brand.name === ownedBrand.name);
  const urls = stateBrand?.discoveredUrls || [];
  const sitemapUrls = stateBrand?.sitemap?.urls || [];
  const keywordData = (keywordMap.brands || []).find((brand) => brand.ownedBrandSlug === ownedBrand.slug);
  const priorityPages = [...new Set((keywordData?.mappings || []).map((item) => item.landingPage || item.targetPage).filter(Boolean))].slice(0, 20);
  const homepageLinks = primary?.homepage?.counts?.internalLinks || 0;
  const auditedInternalLinks = primary?.pageAudit?.totals?.internalLinks || homepageLinks;
  const orphanPages = sitemapUrls.filter((url) => !urls.includes(url)).slice(0, 50);
  const genericAnchors = (primary?.homepage?.contentStructure?.headings || []).filter(isGenericAnchor);
  const recommendations = [];

  if (!primary) {
    recommendations.push(recommendation({
      brand: ownedBrand,
      type: "setup_required",
      sourcePage: ownedBrand.website,
      destinationPage: ownedBrand.website,
      anchorText: "Run public crawl",
      reason: "Public crawl baseline is required before internal link recommendations can be generated.",
      priority: "High"
    }));
  }

  for (const page of priorityPages.slice(0, 10)) {
    recommendations.push(recommendation({
      brand: ownedBrand,
      type: "priority_page_support",
      sourcePage: ownedBrand.website,
      destinationPage: page,
      anchorText: keywordData?.mappings?.find((item) => item.landingPage === page || item.targetPage === page)?.keyword || "Relevant category keyword",
      reason: "Priority GSC/keyword-bank page should receive contextual links from relevant hub or homepage sections.",
      priority: "High"
    }));
  }

  for (const page of orphanPages.slice(0, 10)) {
    recommendations.push(recommendation({
      brand: ownedBrand,
      type: "sitemap_not_discoverable",
      sourcePage: ownedBrand.website,
      destinationPage: page,
      anchorText: "Relevant descriptive anchor",
      reason: "URL appears in sitemap but not in the tracked homepage/internal crawl set.",
      priority: "Medium"
    }));
  }

  if (homepageLinks < 20) {
    recommendations.push(recommendation({
      brand: ownedBrand,
      type: "weak_homepage_linking",
      sourcePage: ownedBrand.website,
      destinationPage: ownedBrand.website,
      anchorText: "Category hub links",
      reason: "Homepage internal link count is low for a brand/category site.",
      priority: "High"
    }));
  }

  brands.push({
    ownedBrandSlug: ownedBrand.slug,
    brandName: ownedBrand.name,
    status: primary ? "Live" : "Setup Required",
    summary: {
      discoveredUrlCount: urls.length,
      sitemapUrlCount: sitemapUrls.length || primary?.sitemap?.urlCount || 0,
      orphanPageCount: orphanPages.length,
      priorityPageCount: priorityPages.length,
      homepageInternalLinks: homepageLinks,
      auditedInternalLinks,
      genericAnchorProxyCount: genericAnchors.length,
      recommendationCount: recommendations.length
    },
    orphanPages,
    weakPages: priorityPages.map((page) => ({ page, reason: "Priority keyword page should receive contextual internal support." })),
    genericAnchors,
    recommendations: recommendations.slice(0, 80),
    evidence: evidenceMeta({
      source: "Public crawl, sitemap, and keyword map",
      evidenceUrl: ownedBrand.website,
      method: "Internal link graph proxy from public crawl evidence",
      confidence: primary ? "Public crawl proxy" : "Setup Required",
      collectedAt
    })
  });
}

await writeJson(outFile, {
  generatedAt: collectedAt,
  source: "No-paid-API internal link graph",
  dataMode: "public_crawl_proxy",
  ruleBasis: "Crawlable <a href> links and descriptive anchor text guidance",
  brands
});

console.log(`Wrote ${outFile}`);
