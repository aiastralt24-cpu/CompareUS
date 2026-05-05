import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import brands from "../data/brands.json" with { type: "json" };

const stateDir = path.resolve("data/monitor");
const stateFile = path.join(stateDir, "state.json");
const generatedDir = path.resolve("data/generated");
const eventsFile = path.join(generatedDir, "monitor-events.json");
const userAgent =
  "CompareUSChangeMonitor/0.1 (+public competitor monitoring; contact: internal research)";

const campaignPatterns = [
  "campaign",
  "offer",
  "contest",
  "launch",
  "new-product",
  "new product",
  "plumber",
  "dealer",
  "distributor",
  "festival",
  "cricket",
  "sustainability",
  "awareness",
  "video",
  "blog",
  "news",
  "press"
];

function hash(value = "") {
  return crypto.createHash("sha256").update(value).digest("hex");
}

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

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout ?? 20000);
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
      responseMs: Math.round(performance.now() - start),
      headers: Object.fromEntries(response.headers.entries()),
      text
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      finalUrl: url,
      responseMs: Math.round(performance.now() - start),
      headers: {},
      text: "",
      error: error?.message || String(error)
    };
  } finally {
    clearTimeout(timeout);
  }
}

function absoluteUrl(base, maybeUrl) {
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return "";
  }
}

function extractSitemapUrls(xml, baseUrl) {
  const locs = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)]
    .map((match) => absoluteUrl(baseUrl, decodeEntities(match[1].trim())))
    .filter(isMonitorableUrl)
    .map(normalizeUrl)
    .filter(Boolean);
  return [...new Set(locs)].sort();
}

function extractLinks(html, baseUrl) {
  return [
    ...new Set(
      [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)]
        .map((match) => absoluteUrl(baseUrl, match[1]))
        .filter(Boolean)
        .filter(isMonitorableUrl)
        .map(normalizeUrl)
        .filter((url) => {
          const parsed = new URL(url);
          const base = new URL(baseUrl);
          return parsed.host === base.host && /^https?:$/.test(parsed.protocol);
        })
    )
  ].sort();
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

function isMonitorableUrl(url) {
  try {
    const parsed = new URL(url);
    const lower = parsed.toString().toLowerCase();
    if (!/^https?:$/.test(parsed.protocol)) return false;
    if (lower.includes("/cdn-cgi/")) return false;
    if (lower.includes("email-protection")) return false;
    if (/\.(jpg|jpeg|png|webp|gif|svg|pdf|zip|mp4|webm|css|js|woff|woff2)(\?|$)/i.test(lower)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function extractSchema(html) {
  return [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => cleanText(match[1]))
    .filter(Boolean)
    .join("\n---schema-block---\n");
}

function extractSchemaTypes(html) {
  return [...new Set([...html.matchAll(/"@type"\s*:\s*"([^"]+)"/gi)].map((match) => match[1]))].sort();
}

function securityHeaderState(headers = {}) {
  return {
    strictTransportSecurity: Boolean(headers["strict-transport-security"]),
    contentSecurityPolicy: Boolean(headers["content-security-policy"]),
    xFrameOptions: Boolean(headers["x-frame-options"]),
    xContentTypeOptions: Boolean(headers["x-content-type-options"]),
    referrerPolicy: Boolean(headers["referrer-policy"]),
    permissionsPolicy: Boolean(headers["permissions-policy"])
  };
}

function extractPageSignals(html) {
  const title = extractFirst(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
  const description = extractFirst(html, [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  ]);
  const h1 = extractFirst(html, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]).replace(/<[^>]+>/g, "");
  const visibleText = cleanText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).slice(0, 12000);
  return {
    title,
    description,
    h1,
    textHash: hash(visibleText),
    schemaHash: hash(extractSchema(html)),
    schemaTypes: extractSchemaTypes(html),
    techStack: {
      googleAnalytics: /gtag\(|google-analytics|G-[A-Z0-9]+/i.test(html),
      googleTagManager: /googletagmanager|GTM-[A-Z0-9]+/i.test(html),
      microsoftClarity: /clarity\.ms|Microsoft Clarity/i.test(html),
      hotjar: /hotjar|hj\(/i.test(html),
      metaPixel: /fbq\(|facebook\.net\/.*fbevents/i.test(html)
    },
    campaignTerms: campaignPatterns.filter((term) =>
      new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(`${title} ${description} ${h1} ${visibleText}`)
    )
  };
}

function classifyUrl(url) {
  const lower = url.toLowerCase();
  const matchedTerms = campaignPatterns.filter((term) => lower.includes(term.replace(" ", "-")) || lower.includes(term));
  let type = "new_page";
  if (/campaign|contest|offer|launch|awareness|festival|cricket/i.test(lower)) type = "campaign_page";
  if (/blog|news|press|media/i.test(lower)) type = "content_page";
  if (/product|pipes|fittings|category|solutions/i.test(lower)) type = "category_or_product_page";
  return { type, matchedTerms };
}

function createEvent({ brand, type, severity, title, detail, sourceUrl, evidence, confidence = "Verified public evidence" }) {
  const firstSeenAt = new Date().toISOString();
  return {
    id: hash(`${brand.name}|${type}|${title}|${sourceUrl}|${JSON.stringify(evidence)}`).slice(0, 16),
    brand: brand.name,
    type,
    severity,
    title,
    detail,
    sourceUrl,
    firstSeenAt,
    confidence,
    evidence
  };
}

async function collectBrandState(brand) {
  const origin = new URL(brand.website).origin;
  const [home, robots, sitemap, llms] = await Promise.all([
    fetchText(brand.website),
    fetchText(`${origin}/robots.txt`, { timeout: 12000 }),
    fetchText(`${origin}/sitemap.xml`, { timeout: 15000 }),
    fetchText(`${origin}/llms.txt`, { timeout: 12000 })
  ]);
  const pageSignals = extractPageSignals(home.text || "");
  const sitemapUrls = sitemap.ok ? extractSitemapUrls(sitemap.text, brand.website) : [];
  const homepageUrls = home.ok ? extractLinks(home.text, home.finalUrl || brand.website).slice(0, 500) : [];
  const discoveredUrls = [...new Set([...sitemapUrls, ...homepageUrls])].sort();
  const campaignUrls = discoveredUrls
    .map((url) => ({ url, ...classifyUrl(url) }))
    .filter((item) => item.type !== "new_page" || item.matchedTerms.length > 0);

  return {
    name: brand.name,
    website: brand.website,
    collectedAt: new Date().toISOString(),
    homepage: {
      ok: home.ok,
      status: home.status,
      finalUrl: home.finalUrl,
      responseMs: home.responseMs,
      htmlHash: hash(home.text || ""),
      textHash: pageSignals.textHash,
      schemaHash: pageSignals.schemaHash,
      schemaTypes: pageSignals.schemaTypes,
      title: pageSignals.title,
      description: pageSignals.description,
      h1: pageSignals.h1,
      campaignTerms: pageSignals.campaignTerms,
      techStack: pageSignals.techStack,
      securityHeaders: securityHeaderState(home.headers),
      securityHeadersHash: hash(JSON.stringify(securityHeaderState(home.headers)))
    },
    robots: {
      ok: robots.ok,
      status: robots.status,
      url: `${origin}/robots.txt`,
      hash: hash(robots.text || "")
    },
    llms: {
      ok: llms.ok,
      status: llms.status,
      url: `${origin}/llms.txt`,
      hash: hash(llms.text || "")
    },
    sitemap: {
      ok: sitemap.ok,
      status: sitemap.status,
      url: `${origin}/sitemap.xml`,
      hash: hash(sitemapUrls.join("\n")),
      urls: sitemapUrls
    },
    discoveredUrls,
    campaignUrls
  };
}

function diffBrand(brand, previous, current) {
  const events = [];
  if (!previous) {
    events.push(
      createEvent({
        brand,
        type: "baseline_created",
        severity: "Info",
        title: `${brand.name} monitoring baseline created`,
        detail: `${current.discoveredUrls.length} public URLs are now tracked for future change alerts.`,
        sourceUrl: brand.website,
        evidence: {
          homepageStatus: current.homepage.status,
          sitemapStatus: current.sitemap.status,
          trackedUrls: current.discoveredUrls.length,
          campaignLikeUrls: current.campaignUrls.length
        }
      })
    );
    return events;
  }

  if (previous.homepage?.title !== current.homepage.title) {
    events.push(
      createEvent({
        brand,
        type: "homepage_title_changed",
        severity: "Medium",
        title: `${brand.name} changed homepage title`,
        detail: `Homepage title changed from "${previous.homepage?.title || "missing"}" to "${current.homepage.title || "missing"}".`,
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { before: previous.homepage?.title || "", after: current.homepage.title || "" }
      })
    );
  }

  if (previous.homepage?.description !== current.homepage.description) {
    events.push(
      createEvent({
        brand,
        type: "meta_description_changed",
        severity: "Medium",
        title: `${brand.name} changed homepage meta description`,
        detail: "Homepage meta description changed. Review snippet messaging and campaign positioning.",
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { before: previous.homepage?.description || "", after: current.homepage.description || "" }
      })
    );
  }

  if (previous.homepage?.h1 !== current.homepage.h1) {
    events.push(
      createEvent({
        brand,
        type: "h1_changed",
        severity: "Medium",
        title: `${brand.name} changed homepage H1`,
        detail: `Homepage H1 changed from "${previous.homepage?.h1 || "missing"}" to "${current.homepage.h1 || "missing"}".`,
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { before: previous.homepage?.h1 || "", after: current.homepage.h1 || "" }
      })
    );
  }

  if (previous.homepage?.schemaHash !== current.homepage.schemaHash) {
    events.push(
      createEvent({
        brand,
        type: "schema_changed",
        severity: "High",
        title: `${brand.name} changed homepage schema`,
        detail: "JSON-LD schema hash changed on the public homepage.",
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { beforeHash: previous.homepage?.schemaHash, afterHash: current.homepage.schemaHash }
      })
    );
  }

  const previousSchemaTypes = new Set(previous.homepage?.schemaTypes || []);
  const currentSchemaTypes = new Set(current.homepage.schemaTypes || []);
  const addedSchemaTypes = [...currentSchemaTypes].filter((type) => !previousSchemaTypes.has(type));
  const removedSchemaTypes = [...previousSchemaTypes].filter((type) => !currentSchemaTypes.has(type));
  if (addedSchemaTypes.length || removedSchemaTypes.length) {
    events.push(
      createEvent({
        brand,
        type: "schema_types_changed",
        severity: "High",
        title: `${brand.name} changed schema type coverage`,
        detail: `Schema types changed. Added: ${addedSchemaTypes.join(", ") || "none"}. Removed: ${removedSchemaTypes.join(", ") || "none"}.`,
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { addedSchemaTypes, removedSchemaTypes }
      })
    );
  }

  if (previous.homepage?.securityHeadersHash !== current.homepage.securityHeadersHash) {
    events.push(
      createEvent({
        brand,
        type: "security_headers_changed",
        severity: "High",
        title: `${brand.name} changed security header posture`,
        detail: "Homepage security/privacy header presence changed.",
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: {
          before: previous.homepage?.securityHeaders || {},
          after: current.homepage.securityHeaders || {}
        }
      })
    );
  }

  const previousTech = previous.homepage?.techStack || {};
  const currentTech = current.homepage.techStack || {};
  const techChanges = Object.keys({ ...previousTech, ...currentTech }).filter(
    (key) => Boolean(previousTech[key]) !== Boolean(currentTech[key])
  );
  if (techChanges.length) {
    events.push(
      createEvent({
        brand,
        type: "measurement_stack_changed",
        severity: "Medium",
        title: `${brand.name} changed visible measurement tags`,
        detail: `Detected change in visible marketing/analytics tags: ${techChanges.join(", ")}.`,
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { before: previousTech, after: currentTech, changed: techChanges }
      })
    );
  }

  if (previous.homepage?.textHash !== current.homepage.textHash) {
    events.push(
      createEvent({
        brand,
        type: "homepage_content_changed",
        severity: "Medium",
        title: `${brand.name} changed homepage content`,
        detail: "Visible homepage text hash changed. Review for new banners, campaign copy, category messaging, or product updates.",
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { beforeHash: previous.homepage?.textHash, afterHash: current.homepage.textHash }
      })
    );
  }

  if (previous.robots?.ok && current.robots.ok && previous.robots?.hash !== current.robots.hash) {
    events.push(
      createEvent({
        brand,
        type: "robots_changed",
        severity: "High",
        title: `${brand.name} changed robots.txt`,
        detail: "Robots.txt hash changed. Review crawler permissions and sitemap directives.",
        sourceUrl: current.robots.url,
        evidence: { beforeHash: previous.robots?.hash, afterHash: current.robots.hash }
      })
    );
  }

  const llmsAvailabilityChanged = Boolean(previous.llms?.ok) !== Boolean(current.llms.ok);
  const llmsContentChanged = previous.llms?.ok && current.llms.ok && previous.llms?.hash !== current.llms.hash;
  if (llmsAvailabilityChanged || llmsContentChanged) {
    events.push(
      createEvent({
        brand,
        type: "llms_txt_changed",
        severity: "Medium",
        title: `${brand.name} changed llms.txt`,
        detail: "llms.txt availability or content changed. Review AI crawler guidance.",
        sourceUrl: current.llms.url,
        evidence: {
          beforeStatus: previous.llms?.status,
          afterStatus: current.llms.status,
          beforeHash: previous.llms?.hash,
          afterHash: current.llms.hash
        }
      })
    );
  }

  if (previous.sitemap?.ok && current.sitemap.ok && previous.sitemap?.hash !== current.sitemap.hash) {
    events.push(
      createEvent({
        brand,
        type: "sitemap_changed",
        severity: "Medium",
        title: `${brand.name} changed sitemap`,
        detail: "Sitemap content hash changed.",
        sourceUrl: current.sitemap.url,
        evidence: { beforeHash: previous.sitemap?.hash, afterHash: current.sitemap.hash }
      })
    );
  }

  const previousUrls = new Set(previous.discoveredUrls || previous.sitemap?.urls || []);
  const currentUrls = new Set(current.discoveredUrls || []);
  const addedUrls = [...currentUrls].filter((url) => !previousUrls.has(url)).slice(0, 25);
  const removedUrls = [...previousUrls].filter((url) => !currentUrls.has(url)).slice(0, 25);

  for (const url of addedUrls) {
    const classification = classifyUrl(url);
    const severity = classification.type === "campaign_page" ? "Critical" : "High";
    events.push(
      createEvent({
        brand,
        type: classification.type === "new_page" ? "new_url_detected" : classification.type,
        severity,
        title: `${brand.name} added a new public URL`,
        detail: `New ${classification.type.replaceAll("_", " ")} detected in public crawl.`,
        sourceUrl: url,
        evidence: { matchedTerms: classification.matchedTerms, source: "sitemap_or_homepage_link" }
      })
    );
  }

  for (const url of removedUrls) {
    events.push(
      createEvent({
        brand,
        type: "url_removed",
        severity: "Medium",
        title: `${brand.name} removed a public URL`,
        detail: "URL disappeared from the tracked public crawl set.",
        sourceUrl: url,
        evidence: { source: "sitemap_or_homepage_link" }
      })
    );
  }

  const previousTerms = new Set(previous.homepage?.campaignTerms || []);
  const newTerms = current.homepage.campaignTerms.filter((term) => !previousTerms.has(term));
  if (newTerms.length > 0) {
    events.push(
      createEvent({
        brand,
        type: "campaign_terms_detected",
        severity: "Medium",
        title: `${brand.name} added campaign-like homepage language`,
        detail: `New monitored terms detected: ${newTerms.join(", ")}.`,
        sourceUrl: current.homepage.finalUrl || brand.website,
        evidence: { newTerms }
      })
    );
  }

  return events;
}

function dedupeEvents(events) {
  const seen = new Set();
  return events.filter((event) => {
    if (seen.has(event.id)) return false;
    seen.add(event.id);
    return true;
  });
}

function formatTelegramEvent(event) {
  return [
    `🚨 ${event.severity} competitor update`,
    "",
    `Brand: ${event.brand}`,
    `Change: ${event.title}`,
    `Detail: ${event.detail}`,
    `First seen: ${event.firstSeenAt}`,
    `Source: ${event.sourceUrl}`,
    `Confidence: ${event.confidence}`
  ].join("\n");
}

async function sendTelegram(events) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId || events.length === 0) {
    return { attempted: false, sent: 0, reason: "Telegram env vars missing or no events" };
  }

  let sent = 0;
  for (const event of events.slice(0, 10)) {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatTelegramEvent(event),
        disable_web_page_preview: false
      })
    });
    if (response.ok) sent += 1;
  }
  return { attempted: true, sent };
}

const resetBaseline = process.env.MONITOR_RESET === "1";
const previousState = resetBaseline ? { brands: {} } : await readJson(stateFile, { brands: {} });
const existingEvents = resetBaseline ? { events: [] } : await readJson(eventsFile, { events: [] });
const nextState = {
  generatedAt: new Date().toISOString(),
  brands: {}
};
let newEvents = [];

for (const brand of brands) {
  console.log(`Monitoring ${brand.name}...`);
  const current = await collectBrandState(brand);
  const previous = previousState.brands?.[brand.name];
  nextState.brands[brand.name] = current;
  newEvents.push(...diffBrand(brand, previous, current));
}

newEvents = dedupeEvents(newEvents);
const allEvents = dedupeEvents([...newEvents, ...(existingEvents.events || [])])
  .sort((a, b) => new Date(b.firstSeenAt) - new Date(a.firstSeenAt))
  .slice(0, 500);

const telegram = await sendTelegram(newEvents);
await writeJson(stateFile, nextState);
await writeJson(eventsFile, {
  generatedAt: new Date().toISOString(),
  newEventCount: newEvents.length,
  telegram,
  events: allEvents
});

console.log(`Detected ${newEvents.length} new event(s).`);
console.log(`Wrote ${eventsFile}`);
