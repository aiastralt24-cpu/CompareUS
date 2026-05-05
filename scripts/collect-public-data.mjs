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

function uniqueMatches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]).filter(Boolean);
}

function absoluteUrl(base, maybeUrl) {
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return "";
  }
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.sort();
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function isHtmlLikeUrl(url) {
  try {
    const lower = new URL(url).pathname.toLowerCase();
    return !/\.(jpg|jpeg|png|webp|gif|svg|pdf|zip|mp4|webm|css|js|woff|woff2|xml|txt)$/i.test(lower);
  } catch {
    return false;
  }
}

function extractSitemapUrls(xml, baseUrl) {
  return [
    ...new Set(
      [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
        .map((match) => normalizeUrl(absoluteUrl(baseUrl, decodeEntities(match[1].trim()))))
        .filter(Boolean)
        .filter(isHtmlLikeUrl)
    )
  ].sort();
}

function selectAuditUrls({ brand, homepageUrl, sitemapUrls, homePage }) {
  const origin = new URL(brand.website).origin;
  const homeLinks = [...homePage.internalLinks].map(normalizeUrl).filter(Boolean);
  const pool = [...new Set([normalizeUrl(homepageUrl || brand.website), ...sitemapUrls, ...homeLinks])]
    .filter(Boolean)
    .filter((url) => new URL(url).origin === origin)
    .filter(isHtmlLikeUrl);
  const groups = [
    /faq|frequently|question/i,
    /product|pipe|fitting|category|solution|system/i,
    /blog|article|news|press|resource|knowledge|guide/i,
    /dealer|locator|contact|distributor/i,
    /campaign|launch|offer|contest|awareness/i
  ];
  const selected = [normalizeUrl(homepageUrl || brand.website)];
  for (const pattern of groups) {
    for (const url of pool.filter((item) => pattern.test(item)).slice(0, 3)) {
      if (!selected.includes(url)) selected.push(url);
    }
  }
  for (const url of pool) {
    if (selected.length >= 14) break;
    if (!selected.includes(url)) selected.push(url);
  }
  return selected.filter(Boolean).slice(0, 14);
}

async function fetchText(url, options = {}) {
  const retries = options.retries ?? 2;
  let lastResult;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    lastResult = await fetchTextOnce(url, options);
    if (lastResult.ok || lastResult.status >= 300) return lastResult;
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }
  return lastResult;
}

async function fetchTextOnce(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? 22000);
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
  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const headings = uniqueMatches(html, /<h[2-3][^>]*>([\s\S]*?)<\/h[2-3]>/gi)
    .map((heading) => cleanText(heading.replace(/<[^>]+>/g, "")))
    .filter(Boolean);
  const visibleText = cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
  const wordCount = visibleText ? visibleText.split(/\s+/).length : 0;
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
      imagesWithoutAlt: imgTags.filter((tag) => !/\salt=["'][^"']+["']/i.test(tag)).length,
      lazyImages: imgTags.filter((tag) => /\sloading=["']lazy["']/i.test(tag)).length,
      links: links.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      jsonLdBlocks: countMatches(html, /<script[^>]+application\/ld\+json[^>]*>/gi),
      forms: countMatches(html, /<form[\s>]/gi),
      labels: countMatches(html, /<label[\s>]/gi),
      scripts: countMatches(html, /<script[\s>]/gi),
      stylesheets: countMatches(html, /<link[^>]+rel=["']stylesheet["']/gi),
      preloadHints: countMatches(html, /<link[^>]+rel=["']preload["']/gi),
      preconnectHints: countMatches(html, /<link[^>]+rel=["']preconnect["']/gi),
      questionHeadings: headings.filter((heading) => /\?|\b(what|why|how|which|when|where|can|does|is|are)\b/i.test(heading)).length,
      wordCount
    },
    signals: {
      hasTitle: title.length > 0,
      titleLength: title.length,
      hasMetaDescription: description.length > 0,
      descriptionLength: description.length,
      hasCanonical: Boolean(canonical),
      hasH1: Boolean(h1),
      hasSchema: schemaTypes.length > 0,
      hasFaqSchema: schemaTypes.some((type) => /FAQPage/i.test(type)),
      hasHowToSchema: schemaTypes.some((type) => /HowTo/i.test(type)),
      hasProductSchema: schemaTypes.some((type) => /Product/i.test(type)),
      hasOrganizationSchema: schemaTypes.some((type) => /Organization|Corporation|LocalBusiness/i.test(type)),
      hasBreadcrumbSchema: schemaTypes.some((type) => /BreadcrumbList/i.test(type)),
      hasArticleSchema: schemaTypes.some((type) => /Article|NewsArticle|BlogPosting/i.test(type)),
      hasViewportMeta: /<meta[^>]+name=["']viewport["']/i.test(html),
      hasHtmlLang: /<html[^>]+lang=["'][^"']+["']/i.test(html),
      hasOpenGraph: /<meta[^>]+property=["']og:/i.test(html),
      hasTwitterCard: /<meta[^>]+name=["']twitter:/i.test(html),
      hasFaqText: /faq|frequently asked/i.test(html),
      hasDealerText: /dealer|locator|distributor/i.test(html),
      hasContactText: /contact|enquiry|inquiry/i.test(html),
      hasProductText: /product|pipes?|fittings?/i.test(html),
      hasAuthorSignals: /author|reviewed by|written by|editorial/i.test(html),
      hasFreshnessSignals: /last updated|dateModified|updated on|published/i.test(html),
      hasTrustSignals: /ISI|BIS|certification|certified|award|testimonial|case study/i.test(html),
      hasPrivacyLink: /privacy policy/i.test(html),
      hasTermsLink: /terms|terms of use|terms & conditions/i.test(html),
      hasCookieConsent: /cookie|consent|gdpr|dpdp/i.test(html),
      hasSearchUi: /type=["']search["']|placeholder=["'][^"']*search|site search/i.test(html),
      hasBreadcrumbText: /breadcrumb/i.test(html),
      hasComparisonTool: /compare|comparison|calculator|selector|configurator/i.test(html),
      hasResourceHub: /resource|knowledge|blog|article|news|guide/i.test(html),
      hasPhoneOrWhatsapp: /tel:|wa\.me|whatsapp/i.test(html),
      hasEmailLink: /mailto:/i.test(html),
      hasDirectAnswerIntro: visibleText.split(/[.!?]/).slice(0, 2).join(" ").length <= 320 && wordCount > 50
    },
    techStack: {
      googleAnalytics: /gtag\(|google-analytics|G-[A-Z0-9]+/i.test(html),
      googleTagManager: /googletagmanager|GTM-[A-Z0-9]+/i.test(html),
      microsoftClarity: /clarity\.ms|Microsoft Clarity/i.test(html),
      hotjar: /hotjar|hj\(/i.test(html),
      metaPixel: /fbq\(|facebook\.net\/.*fbevents/i.test(html),
      wordpress: /wp-content|wp-includes/i.test(html),
      nextjs: /__NEXT_DATA__|next\/static/i.test(html),
      react: /react|data-reactroot/i.test(html),
      cloudflare: /cdn-cgi|cloudflare/i.test(html)
    },
    contentStructure: {
      questionHeadings: headings.filter((heading) => /\?|\b(what|why|how|which|when|where|can|does|is|are)\b/i.test(heading)).slice(0, 12),
      answerFriendlyBlocks: countMatches(html, /<(p|li)[^>]*>[\s\S]{320,900}?<\/(p|li)>/gi),
      headings: headings.slice(0, 20)
    },
    internalLinks,
    externalLinks
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

function scoreTechnicalSeo({ page, robots, sitemap, response }) {
  let score = 0;
  if (response.ok) score += 12;
  if (robots.ok) score += 10;
  if (sitemap.ok) score += 10;
  if (page.signals.hasCanonical) score += 10;
  if (page.signals.hasTitle && page.signals.titleLength >= 30 && page.signals.titleLength <= 65) score += 10;
  if (page.signals.hasMetaDescription && page.signals.descriptionLength >= 80 && page.signals.descriptionLength <= 180) score += 10;
  if (page.counts.h1 === 1) score += 8;
  if (page.signals.hasViewportMeta) score += 8;
  if (page.signals.hasOpenGraph) score += 5;
  if (page.signals.hasTwitterCard) score += 3;
  if (page.counts.internalLinks >= 20) score += 8;
  if (page.signals.hasBreadcrumbSchema || page.signals.hasBreadcrumbText) score += 6;
  return Math.min(score, 100);
}

function scoreContentExtraction(page) {
  let score = 0;
  if (page.signals.hasDirectAnswerIntro) score += 12;
  if (page.counts.questionHeadings >= 2) score += 14;
  if (page.signals.hasFaqText || page.signals.hasFaqSchema) score += 16;
  if (page.contentStructure.answerFriendlyBlocks >= 4) score += 14;
  if (page.counts.wordCount >= 500) score += 10;
  if (page.signals.hasFreshnessSignals) score += 10;
  if (page.signals.hasAuthorSignals) score += 8;
  if (page.signals.hasTrustSignals) score += 8;
  if (page.signals.hasComparisonTool) score += 4;
  if (page.signals.hasResourceHub) score += 4;
  return Math.min(score, 100);
}

function scoreAccessibilityProxy(page) {
  let score = 0;
  if (page.signals.hasHtmlLang) score += 20;
  if (page.signals.hasViewportMeta) score += 15;
  if (page.counts.images === 0 || page.counts.imagesWithoutAlt / page.counts.images <= 0.25) score += 25;
  if (page.counts.h1 === 1 && page.counts.h2 >= 2) score += 15;
  if (page.counts.forms === 0 || page.counts.labels >= page.counts.forms) score += 10;
  if (page.counts.lazyImages > 0) score += 5;
  if (page.signals.hasSearchUi) score += 5;
  if (page.signals.hasBreadcrumbText || page.signals.hasBreadcrumbSchema) score += 5;
  return Math.min(score, 100);
}

function scoreSecurityPrivacy({ response, page }) {
  const headers = response.headers || {};
  let score = 0;
  if (response.finalUrl?.startsWith("https://")) score += 20;
  if (headers["strict-transport-security"]) score += 14;
  if (headers["content-security-policy"]) score += 14;
  if (headers["x-frame-options"]) score += 10;
  if (headers["x-content-type-options"]) score += 8;
  if (headers["referrer-policy"]) score += 8;
  if (headers["permissions-policy"]) score += 6;
  if (page.signals.hasPrivacyLink) score += 8;
  if (page.signals.hasTermsLink) score += 5;
  if (page.signals.hasCookieConsent) score += 7;
  return Math.min(score, 100);
}

function aggregatePageAudit(pages) {
  const okPages = pages.filter((item) => item.ok);
  const schemaTypes = [...new Set(okPages.flatMap((item) => item.schemaTypes || []))].sort();
  const countPages = (predicate) => okPages.filter((item) => predicate(item)).length;
  const totals = okPages.reduce(
    (acc, item) => {
      acc.questionHeadings += item.counts.questionHeadings || 0;
      acc.answerFriendlyBlocks += item.contentStructure.answerFriendlyBlocks || 0;
      acc.wordCount += item.counts.wordCount || 0;
      acc.internalLinks += item.counts.internalLinks || 0;
      acc.externalLinks += item.counts.externalLinks || 0;
      return acc;
    },
    { questionHeadings: 0, answerFriendlyBlocks: 0, wordCount: 0, internalLinks: 0, externalLinks: 0 }
  );

  const schemaCoverage = {
    FAQPage: schemaTypes.some((type) => /FAQPage/i.test(type)),
    HowTo: schemaTypes.some((type) => /HowTo/i.test(type)),
    Article: schemaTypes.some((type) => /Article|NewsArticle|BlogPosting/i.test(type)),
    Product: schemaTypes.some((type) => /Product/i.test(type)),
    Organization: schemaTypes.some((type) => /Organization|Corporation|LocalBusiness/i.test(type)),
    BreadcrumbList: schemaTypes.some((type) => /BreadcrumbList/i.test(type)),
    LocalBusiness: schemaTypes.some((type) => /LocalBusiness/i.test(type))
  };

  return {
    pageCount: pages.length,
    okPageCount: okPages.length,
    schemaTypes,
    schemaCoverage,
    pagesWithFaqText: countPages((item) => item.signals.hasFaqText),
    pagesWithProductText: countPages((item) => item.signals.hasProductText),
    pagesWithAuthorSignals: countPages((item) => item.signals.hasAuthorSignals),
    pagesWithFreshnessSignals: countPages((item) => item.signals.hasFreshnessSignals),
    pagesWithTrustSignals: countPages((item) => item.signals.hasTrustSignals),
    pagesWithResourceHubSignals: countPages((item) => item.signals.hasResourceHub),
    pagesWithComparisonTools: countPages((item) => item.signals.hasComparisonTool),
    pagesWithDirectAnswerIntro: countPages((item) => item.signals.hasDirectAnswerIntro),
    totals,
    topEvidencePages: okPages
      .map((item) => ({
        url: item.url,
        title: item.title,
        schemaTypes: item.schemaTypes,
        questionHeadings: item.counts.questionHeadings,
        answerFriendlyBlocks: item.contentStructure.answerFriendlyBlocks,
        wordCount: item.counts.wordCount
      }))
      .sort((a, b) => b.answerFriendlyBlocks + b.questionHeadings - (a.answerFriendlyBlocks + a.questionHeadings))
      .slice(0, 6)
  };
}

function scoreAeoFromAudit({ page, audit, robots, llms }) {
  let score = 0;
  if (audit.schemaTypes.length > 0 || page.signals.hasSchema) score += 12;
  if (audit.schemaCoverage.FAQPage || page.signals.hasFaqSchema) score += 9;
  if (audit.schemaCoverage.Product) score += 7;
  if (audit.schemaCoverage.Organization || page.signals.hasOrganizationSchema) score += 7;
  if (audit.schemaCoverage.BreadcrumbList) score += 6;
  if (audit.pagesWithFaqText > 0 || page.signals.hasFaqText) score += 8;
  if (audit.totals.questionHeadings >= 8) score += 8;
  if (audit.totals.answerFriendlyBlocks >= 12) score += 8;
  if (audit.pagesWithFreshnessSignals > 0) score += 6;
  if (audit.pagesWithAuthorSignals > 0) score += 5;
  if (audit.pagesWithTrustSignals > 0) score += 5;
  if (audit.pagesWithResourceHubSignals > 0) score += 5;
  if (robots.ok && !/GPTBot[^\n]*Disallow:\s*\//i.test(robots.text || "")) score += 4;
  if (robots.ok && !/ClaudeBot[^\n]*Disallow:\s*\//i.test(robots.text || "")) score += 4;
  if (robots.ok && !/PerplexityBot[^\n]*Disallow:\s*\//i.test(robots.text || "")) score += 4;
  if (llms.ok) score += 2;
  return Math.min(score, 100);
}

async function collectBrand(brand) {
  const website = brand.website;
  const origin = new URL(website).origin;
  const [home, robots, sitemap, llms] = await Promise.all([
    fetchText(website),
    fetchText(`${origin}/robots.txt`, { timeout: 10000 }),
    fetchText(`${origin}/sitemap.xml`, { timeout: 10000 }),
    fetchText(`${origin}/llms.txt`, { timeout: 10000 })
  ]);
  const page = parsePage(home.finalUrl || website, home.text || "");
  const sitemapUrls = sitemap.ok ? extractSitemapUrls(sitemap.text || "", website) : [];
  const auditUrls = selectAuditUrls({
    brand,
    homepageUrl: home.finalUrl || website,
    sitemapUrls,
    homePage: page
  });
  const auditedPages = [];
  for (const url of auditUrls) {
    const response = normalizeUrl(url) === normalizeUrl(home.finalUrl || website) ? home : await fetchText(url, { timeout: 12000 });
    const parsed = parsePage(response.finalUrl || url, response.text || "");
    auditedPages.push({
      url,
      ok: response.ok,
      status: response.status,
      responseMs: response.ms,
      title: parsed.title,
      description: parsed.description,
      schemaTypes: parsed.schemaTypes,
      counts: parsed.counts,
      signals: parsed.signals,
      contentStructure: parsed.contentStructure
    });
  }
  const pageAudit = aggregatePageAudit(auditedPages);
  const websiteScore = scoreWebsite({ page, robots, sitemap, response: home });
  const aeoReadiness = scoreAeoFromAudit({ page, audit: pageAudit, robots, llms });
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
        xFrameOptions: Boolean(home.headers["x-frame-options"]),
        xContentTypeOptions: Boolean(home.headers["x-content-type-options"]),
        referrerPolicy: Boolean(home.headers["referrer-policy"]),
        permissionsPolicy: Boolean(home.headers["permissions-policy"])
      },
      techStack: page.techStack,
      contentStructure: page.contentStructure
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
        !/ClaudeBot[^\n]*Disallow:\s*\//i.test(robots.text || ""),
      aiCrawlerPolicy: {
        GPTBot: !/GPTBot[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        ClaudeBot: !/ClaudeBot[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        PerplexityBot: !/PerplexityBot[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        GoogleExtended: !/Google-Extended[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        CCBot: !/CCBot[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        Bytespider: !/Bytespider[^\n]*Disallow:\s*\//i.test(robots.text || ""),
        ApplebotExtended: !/Applebot-Extended[^\n]*Disallow:\s*\//i.test(robots.text || "")
      }
    },
    sitemap: {
      ok: sitemap.ok,
      status: sitemap.status,
      url: `${origin}/sitemap.xml`,
      byteLength: Buffer.byteLength(sitemap.text || "", "utf8"),
      urlCount: sitemapUrls.length || countMatches(sitemap.text || "", /<url>/gi),
      isSegmented:
        /sitemapindex/i.test(sitemap.text || "") ||
        /image|video|news|product|post|page|category/i.test(sitemap.text || "")
    },
    pageAudit,
    auditedPages,
    llms: {
      ok: llms.ok,
      status: llms.status,
      url: `${origin}/llms.txt`,
      byteLength: Buffer.byteLength(llms.text || "", "utf8")
    },
    social: socialPlatforms,
    scores: {
      publicWebsite: websiteScore.score,
      aeoReadiness,
      technicalSeo: scoreTechnicalSeo({ page, robots, sitemap, response: home }),
      contentExtraction: scoreContentExtraction(page),
      accessibilityProxy: scoreAccessibilityProxy(page),
      securityPrivacy: scoreSecurityPrivacy({ response: home, page }),
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
