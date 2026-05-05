import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import brands from "../data/brands.json" with { type: "json" };

const outDir = path.resolve("data/generated");
const outFile = path.join(outDir, "competitive-snapshot.json");
const userAgent =
  "CompareUSCompetitiveStudyBot/0.1 (+public website audit; contact: internal research)";

function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function extractFirst(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return cleanText(decodeEntities(match[1]));
  }
  return "";
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function countMatches(html, pattern) {
  return html.match(pattern)?.length ?? 0;
}

function absoluteUrl(base, maybeUrl) {
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return "";
  }
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? 15000);
  const start = performance.now();
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.9,*/*;q=0.8"
      }
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      finalUrl: response.url,
      ms: Math.round(performance.now() - start),
      headers: Object.fromEntries(response.headers.entries()),
      text
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      ms: Math.round(performance.now() - start),
      headers: {},
      text: "",
      error: error?.message || String(error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parsePage(baseUrl, html) {
  const title = extractFirst(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const description = extractFirst(html, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  ]);
  const canonical = extractFirst(html, [
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/i
  ]);
  const h1 = extractFirst(html, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]).replace(/<[^>]+>/g, "");
  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/gi)].map((match) => match[1]);
  const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => absoluteUrl(baseUrl, match[1]))
    .filter(Boolean);
  const internalLinks = links.filter((url) => new URL(url).host === new URL(baseUrl).host);
  const externalLinks = links.filter((url) => new URL(url).host !== new URL(baseUrl).host);

  return {
    title,
    description,
    canonical: canonical ? absoluteUrl(baseUrl, canonical) : "",
    h1,
    schemaTypes: [...new Set(schemaTypes)].slice(0, 12),
    counts: {
      h1: countMatches(html, /<h1[\s>]/gi),
      h2: countMatches(html, /<h2[\s>]/gi),
      images: countMatches(html, /<img[\s>]/gi),
      links: links.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      jsonLdBlocks: countMatches(html, /<script[^>]+application\/ld\+json[^>]*>/gi),
      forms: countMatches(html, /<form[\s>]/gi)
    },
    signals: {
      hasTitle: title.length > 0,
      titleLength: title.length,
      hasMetaDescription: description.length > 0,
      descriptionLength: description.length,
      hasCanonical: Boolean(canonical),
      hasH1: Boolean(h1),
      hasSchema: schemaTypes.length > 0,
      hasFaqText: /faq|frequently asked/i.test(html),
      hasDealerText: /dealer|locator|distributor/i.test(html),
      hasContactText: /contact|enquiry|inquiry/i.test(html),
      hasProductText: /product|pipes?|fittings?/i.test(html)
    }
  };
}

function scoreWebsite({ page, robots, sitemap, response }) {
  let score = 0;
  const evidence = [];

  if (response.ok) {
    score += 12;
    evidence.push("Homepage reachable");
  }
  if (response.ms && response.ms < 2000) {
    score += 8;
    evidence.push("Homepage response under 2s");
  }
  if (page.signals.hasTitle) score += 8;
  if (page.signals.hasMetaDescription) score += 8;
  if (page.signals.hasH1) score += 7;
  if (page.signals.hasCanonical) score += 5;
  if (page.signals.hasSchema) score += 10;
  if (robots.ok) score += 8;
  if (sitemap.ok) score += 8;
  if (page.signals.hasDealerText) score += 6;
  if (page.signals.hasContactText) score += 6;
  if (page.signals.hasProductText) score += 6;
  if (page.counts.internalLinks >= 20) score += 8;

  return {
    score: Math.min(score, 100),
    evidence
  };
}

function scoreAeoReadiness({ page, robots }) {
  let score = 0;
  if (page.signals.hasSchema) score += 25;
  if (page.signals.hasFaqText) score += 20;
  if (page.signals.hasMetaDescription) score += 12;
  if (page.signals.hasH1) score += 10;
  if (page.counts.h2 >= 3) score += 10;
  if (robots.text && !/GPTBot[^\n]*Disallow:\s*\//i.test(robots.text)) score += 8;
  if (robots.text && !/PerplexityBot[^\n]*Disallow:\s*\//i.test(robots.text)) score += 8;
  if (page.signals.hasProductText) score += 7;
  return Math.min(score, 100);
}

async function collectBrand(brand) {
  const website = brand.website;
  const origin = new URL(website).origin;
  const [home, robots, sitemap] = await Promise.all([
    fetchText(website),
    fetchText(`${origin}/robots.txt`, { timeout: 10000 }),
    fetchText(`${origin}/sitemap.xml`, { timeout: 10000 })
  ]);
  const page = parsePage(home.finalUrl || website, home.text || "");
  const websiteScore = scoreWebsite({ page, robots, sitemap, response: home });
  const aeoReadiness = scoreAeoReadiness({ page, robots });
  const socialPlatforms = Object.entries(brand.social || {}).map(([platform, url]) => ({
    platform,
    url,
    status: "registry_only",
    note: "Profile URL is in the registry. Platform metrics require approved API, export, or manual evidence capture."
  }));

  return {
    name: brand.name,
    type: brand.type,
    priority: brand.priority,
    website,
    collectedAt: new Date().toISOString(),
    dataMode: "collected_public_web",
    homepage: {
      ok: home.ok,
      status: home.status,
      finalUrl: home.finalUrl,
      responseMs: home.ms,
      byteLength: Buffer.byteLength(home.text || "", "utf8"),
      error: home.error || "",
      title: page.title,
      description: page.description,
      canonical: page.canonical,
      h1: page.h1,
      schemaTypes: page.schemaTypes,
      counts: page.counts,
      signals: page.signals,
      securityHeaders: {
        strictTransportSecurity: Boolean(home.headers["strict-transport-security"]),
        contentSecurityPolicy: Boolean(home.headers["content-security-policy"]),
        xFrameOptions: Boolean(home.headers["x-frame-options"])
      }
    },
    robots: {
      ok: robots.ok,
      status: robots.status,
      url: `${origin}/robots.txt`,
      byteLength: Buffer.byteLength(robots.text || "", "utf8"),
      mentionsSitemap: /sitemap:/i.test(robots.text || ""),
      allowsKnownAiBots:
        !/GPTBot[^\n]*Disallow:\s*\//i.test(robots.text || "") &&
        !/PerplexityBot[^\n]*Disallow:\s*\//i.test(robots.text || "") &&
        !/ClaudeBot[^\n]*Disallow:\s*\//i.test(robots.text || "")
    },
    sitemap: {
      ok: sitemap.ok,
      status: sitemap.status,
      url: `${origin}/sitemap.xml`,
      byteLength: Buffer.byteLength(sitemap.text || "", "utf8"),
      urlCount: countMatches(sitemap.text || "", /<url>/gi)
    },
    social: socialPlatforms,
    scores: {
      publicWebsite: websiteScore.score,
      aeoReadiness,
      registryCompleteness: Math.round((socialPlatforms.length / 5) * 100),
      seoVisibility: null,
      socialPerformance: null,
      campaignActivity: null,
      reputation: null
    },
    scoreEvidence: websiteScore.evidence,
    unavailableMetrics: [
      "Organic keyword ranks require an SEO source or search API.",
      "Social follower and engagement metrics require platform APIs, approved tools, exports, or manual captures.",
      "AEO visibility requires controlled answer-engine prompt runs.",
      "Paid campaign activity requires ad library capture or approved third-party monitoring."
    ]
  };
}

const startedAt = new Date().toISOString();
const results = [];
for (const brand of brands) {
  console.log(`Collecting ${brand.name}...`);
  results.push(await collectBrand(brand));
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  startedAt,
  dataMode: "collected_public_web",
  methodology:
    "Public website fetch of homepage, robots.txt, and sitemap.xml. Restricted social, SEO, AEO, and paid metrics are intentionally left null until approved sources are connected.",
  brands: results
};

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
