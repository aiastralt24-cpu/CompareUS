import fs from "node:fs/promises";
import path from "node:path";
import competitorSets from "../data/competitor-sets.json" with { type: "json" };

const outFile = path.resolve("data/generated/ad-library-snapshot.json");
const activeSetSlug = process.env.MONITOR_BRAND_SLUG || "astral-pipes";
const activeSet = competitorSets.find((set) => set.slug === activeSetSlug) || competitorSets[0];
const brands = activeSet.brands || [];
const accessToken = process.env.META_AD_LIBRARY_ACCESS_TOKEN;
const reachedCountries = (process.env.META_AD_REACHED_COUNTRIES || "IN").split(",").map((item) => item.trim()).filter(Boolean);
const adType = process.env.META_AD_TYPE || "ALL";
const apiVersion = process.env.META_GRAPH_VERSION || "v20.0";

async function fetchMetaAds(brand) {
  if (!accessToken) {
    return {
      name: brand.name,
      status: "Setup Required",
      summary: { activeAds: null },
      ads: [],
      unavailableReason: "META_AD_LIBRARY_ACCESS_TOKEN is not configured."
    };
  }

  const url = new URL(`https://graph.facebook.com/${apiVersion}/ads_archive`);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("ad_reached_countries", JSON.stringify(reachedCountries));
  url.searchParams.set("ad_active_status", "ACTIVE");
  url.searchParams.set("ad_type", adType);
  url.searchParams.set("limit", "25");
  url.searchParams.set("search_terms", brand.name);
  url.searchParams.set("fields", [
    "id",
    "ad_archive_id",
    "page_id",
    "page_name",
    "ad_delivery_start_time",
    "ad_delivery_stop_time",
    "ad_snapshot_url",
    "publisher_platforms"
  ].join(","));

  try {
    const response = await fetch(url);
    const json = await response.json();
    const ads = (json.data || []).map((ad) => ({
      ...ad,
      evidence: {
        source: "Meta Ad Library API",
        collectedAt: new Date().toISOString(),
        method: "ads_archive active search_terms",
        confidence: "Live API data"
      }
    }));
    return {
      name: brand.name,
      status: response.ok ? "Live" : "Restricted",
      summary: { activeAds: ads.length },
      ads,
      error: response.ok ? null : json.error?.message || "Meta Ad Library request failed"
    };
  } catch (error) {
    return {
      name: brand.name,
      status: "Restricted",
      summary: { activeAds: null },
      ads: [],
      error: error?.message || "Meta Ad Library request failed"
    };
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  monitoredSet: activeSetSlug,
  methodology: {
    mode: "Meta Ad Library active creative collector",
    source: "Meta Graph API ads_archive",
    method: "Search by brand name, country filter, active ads only",
    confidence: accessToken ? "Live API data where returned" : "Setup required"
  },
  brands: []
};

for (const brand of brands) {
  console.log(`Collecting Meta ads for ${brand.name}...`);
  output.brands.push(await fetchMetaAds(brand));
}

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
