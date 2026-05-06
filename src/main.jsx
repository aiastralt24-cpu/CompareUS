import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FileText,
  Gauge,
  Globe2,
  LayoutDashboard,
  LineChart,
  Megaphone,
  Menu,
  MonitorSmartphone,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound
} from "lucide-react";
import periscopeIcon from "./assets/periscope-icon.png";
import periscopeLogo from "./assets/periscope-logo.png";
import astralBrands from "../data/astral-brands.json";
import competitorSets from "../data/competitor-sets.json";
import competitorTaxonomy from "../data/competitor-taxonomy.json";
import snapshot from "../data/generated/competitive-snapshot.json";
import monitorEvents from "../data/generated/monitor-events.json";
import socialSnapshot from "../data/generated/social-snapshot.json";
import searchConsoleSnapshot from "../data/generated/search-console-snapshot.json";
import aiReferralSnapshot from "../data/generated/ai-referral-traffic-snapshot.json";
import aiVisibilitySnapshot from "../data/generated/ai-visibility-snapshot.json";
import "./styles.css";

const PERISCOPE_USER_ID = "digital@astral";
const PERISCOPE_PASSWORD = "digital@2050";
const PERISCOPE_SESSION_KEY = "periscope_session";

const seedBrands = [
  {
    name: "Astral Pipes",
    type: "Primary brand",
    priority: "Core",
    website: "astralpipes.com",
    score: 78,
    previous: 75,
    aeo: 11,
    seo: 15,
    social: 16,
    performance: 12,
    campaigns: 8,
    content: 8,
    reputation: 4,
    verified: 5,
    followers: "1.1M",
    engagement: "2.8%",
    frequency: "18 posts/mo",
    momentum: 3,
    threat: "Reference",
    color: "#1473e6"
  },
  {
    name: "Supreme Pipes",
    type: "Direct competitor",
    priority: "P1",
    website: "supreme.co.in",
    score: 84,
    previous: 80,
    aeo: 12,
    seo: 17,
    social: 18,
    performance: 12,
    campaigns: 9,
    content: 8,
    reputation: 4,
    verified: 4,
    followers: "1.4M",
    engagement: "3.4%",
    frequency: "24 posts/mo",
    momentum: 4,
    threat: "High",
    color: "#0f9f6e"
  },
  {
    name: "Prince Pipes",
    type: "Direct competitor",
    priority: "P1",
    website: "princepipes.com",
    score: 81,
    previous: 79,
    aeo: 11,
    seo: 16,
    social: 17,
    performance: 12,
    campaigns: 8,
    content: 8,
    reputation: 4,
    verified: 5,
    followers: "980K",
    engagement: "3.1%",
    frequency: "21 posts/mo",
    momentum: 2,
    threat: "High",
    color: "#b25a16"
  },
  {
    name: "Ashirvad by Aliaxis",
    type: "Direct competitor",
    priority: "P1",
    website: "ashirvad.com",
    score: 79,
    previous: 76,
    aeo: 13,
    seo: 15,
    social: 14,
    performance: 13,
    campaigns: 7,
    content: 9,
    reputation: 4,
    verified: 4,
    followers: "760K",
    engagement: "2.4%",
    frequency: "14 posts/mo",
    momentum: 3,
    threat: "High",
    color: "#5e6ad2"
  },
  {
    name: "Apollo Pipes",
    type: "Direct competitor",
    priority: "P1",
    website: "apollopipes.com",
    score: 76,
    previous: 72,
    aeo: 9,
    seo: 14,
    social: 18,
    performance: 10,
    campaigns: 9,
    content: 7,
    reputation: 4,
    verified: 5,
    followers: "890K",
    engagement: "3.7%",
    frequency: "27 posts/mo",
    momentum: 4,
    threat: "Rising",
    color: "#e03e73"
  },
  {
    name: "Wavin India",
    type: "Direct competitor",
    priority: "P2",
    website: "wavin.com/in",
    score: 73,
    previous: 74,
    aeo: 12,
    seo: 14,
    social: 12,
    performance: 14,
    campaigns: 5,
    content: 8,
    reputation: 4,
    verified: 4,
    followers: "410K",
    engagement: "1.9%",
    frequency: "10 posts/mo",
    momentum: -1,
    threat: "Watch",
    color: "#00a7b5"
  },
  {
    name: "KPT Pipes",
    type: "Direct competitor",
    priority: "P2",
    website: "kptpipes.com",
    score: 67,
    previous: 62,
    aeo: 7,
    seo: 11,
    social: 15,
    performance: 11,
    campaigns: 7,
    content: 7,
    reputation: 4,
    verified: 5,
    followers: "260K",
    engagement: "3.9%",
    frequency: "20 posts/mo",
    momentum: 5,
    threat: "Rising",
    color: "#f2a900"
  },
  {
    name: "POLOPLAST",
    type: "International benchmark",
    priority: "P3",
    website: "poloplast.com",
    score: 65,
    previous: 66,
    aeo: 8,
    seo: 12,
    social: 9,
    performance: 15,
    campaigns: 4,
    content: 8,
    reputation: 4,
    verified: 5,
    followers: "95K",
    engagement: "1.6%",
    frequency: "7 posts/mo",
    momentum: -1,
    threat: "Benchmark",
    color: "#6b7280"
  },
  {
    name: "REHAU India",
    type: "Adjacent competitor",
    priority: "P3",
    website: "rehau.com/in-en",
    score: 69,
    previous: 68,
    aeo: 9,
    seo: 13,
    social: 13,
    performance: 13,
    campaigns: 5,
    content: 7,
    reputation: 4,
    verified: 5,
    followers: "340K",
    engagement: "2.1%",
    frequency: "11 posts/mo",
    momentum: 1,
    threat: "Adjacent",
    color: "#263238"
  }
];

const brandColors = {
  "Astral Pipes": "#1473e6",
  "Supreme Pipes": "#0f9f6e",
  "Prince Pipes": "#b25a16",
  "Apollo Pipes": "#e03e73",
  "Ashirvad by Aliaxis": "#5e6ad2",
  "Wavin India": "#00a7b5",
  "KPT Pipes": "#f2a900",
  POLOPLAST: "#6b7280",
  "REHAU India": "#263238"
};

const snapshotSets = snapshot?.sets?.length
  ? snapshot.sets
  : [
      {
        generatedAt: snapshot?.generatedAt,
        monitoredSet: snapshot?.monitoredSet || "astral-pipes",
        ownedBrandSlug: snapshot?.ownedBrandSlug || "astral-pipes",
        brands: snapshot?.brands || []
      }
    ];
const snapshotBySetSlug = new Map(snapshotSets.map((set) => [set.monitoredSet, set]));
const socialSets = socialSnapshot?.sets?.length
  ? socialSnapshot.sets
  : [
      {
        generatedAt: socialSnapshot?.generatedAt,
        monitoredSet: socialSnapshot?.monitoredSet || "astral-pipes",
        ownedBrandSlug: socialSnapshot?.ownedBrandSlug || "astral-pipes",
        brands: socialSnapshot?.brands || []
      }
    ];
const socialByBrand = new Map(
  socialSets.flatMap((set) =>
    (set.brands || []).map((brand) => [
      `${set.monitoredSet}:${brand.name}`,
      {
        ...brand,
        monitoredSet: set.monitoredSet,
        ownedBrandSlug: set.ownedBrandSlug,
        generatedAt: set.generatedAt
      }
    ])
  )
);
const searchConsoleBySlug = new Map((searchConsoleSnapshot.brands || []).map((brand) => [brand.ownedBrandSlug, brand]));
const aiReferralBySlug = new Map((aiReferralSnapshot.brands || []).map((brand) => [brand.ownedBrandSlug, brand]));
const aiVisibilityBySlug = new Map((aiVisibilitySnapshot.brands || []).map((brand) => [brand.ownedBrandSlug, brand]));
const taxonomyByBrandSlug = new Map(competitorTaxonomy.map((entry) => [entry.ownedBrandSlug, entry]));

const metricHelp = {
  "Public website":
    "Homepage and public-site reachability score: status, response, title, meta description, H1, canonical, schema, robots, sitemap, contact/product signals, and internal links.",
  "Technical SEO":
    "Public crawl and on-page SEO proxy: metadata quality, headings, canonical, Open Graph/Twitter card, sitemap, robots, schema, and link structure.",
  "AEO readiness":
    "Answer-engine readiness proxy: schema, AI-crawler robots policy, answer-friendly content blocks, FAQ/question structure, trust signals, sitemap, and llms.txt.",
  "Content extraction":
    "How easily AI/search systems can extract direct answers: question headings, FAQ text, short answer blocks, list/table structure, and self-contained paragraphs.",
  "Accessibility proxy":
    "Public HTML accessibility proxy: lang/viewport basics, heading structure, image-alt coverage, link text, labels, and visible semantic clues. This is not a full WCAG audit.",
  "Security/privacy":
    "Public security and privacy proxy: HTTPS, HSTS/CSP and related headers, plus visible privacy, terms, and cookie-policy signals.",
  "Registry completeness":
    "How complete the official brand registry is: website plus confirmed social handles available for monitoring. It does not prove account ownership beyond the stored source evidence.",
  "Homepage status": "HTTP status returned by the selected brand homepage during collection.",
  "Robots status": "HTTP status for robots.txt, used to inspect crawler and AI-bot policy.",
  "Sitemap URLs": "Public URLs discovered from the selected brand sitemap.",
  "Open Graph": "Whether the homepage exposes Open Graph tags for rich link previews.",
  "Twitter Card": "Whether the homepage exposes Twitter/X card metadata.",
  "Pages audited": "Number of public pages successfully audited from sitemap and important URL discovery.",
  "Schema types": "Unique schema.org types detected in JSON-LD/microdata on audited pages.",
  "Answer blocks": "Short, extractable paragraphs, lists, tables, and FAQ-like blocks suitable for AI answers.",
  "Question headings": "H2/H3-style headings phrased as questions.",
  "AEO score": "Overall answer-engine readiness score from public evidence: schema, AI crawler policy, extractable answer content, trust signals, sitemap, and llms.txt.",
  "FAQ schema": "Whether FAQPage structured data is detected in the public homepage or audited pages. This helps search and AI systems identify question-answer content.",
  "Product schema": "Whether Product structured data is detected. This helps machines understand product/category entities, attributes, and commercial relevance.",
  "Org schema": "Whether Organization structured data is detected, including brand/entity identity signals such as name, logo, contact, or sameAs links where available.",
  "AI bots": "Whether robots.txt appears to allow known AI crawlers such as GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider, and Applebot-Extended.",
  "llms.txt": "Whether /llms.txt is publicly available. This file can guide AI systems toward approved brand, product, FAQ, and policy URLs.",
  "Q headings": "Count of public H2/H3 headings phrased as questions. Higher counts usually mean the content is easier for answer engines to extract.",
  "Lazy images": "Images with lazy loading detected in public HTML.",
  "Preconnect hints": "Preconnect or DNS-prefetch hints found in the page head.",
  "Search UI": "Visible search-form or search-input signal detected in public HTML.",
  Brand: "The selected Astral brand or competitor being compared in this table. Click a row to change the focus brand.",
  "SEO score": "Composite public SEO score from collected evidence: title, meta description, H1, canonical, sitemap, robots, schema, Open Graph/Twitter card, and internal linking.",
  "Title chars": "Number of characters in the homepage title tag. Very short, missing, or overly long titles can weaken search result clarity.",
  "Meta chars": "Number of characters in the homepage meta description. This is a snippet-quality proxy, not a direct ranking score.",
  "H1 count": "Number of H1 headings found on the homepage. Usually one clear H1 is preferred for page-topic clarity.",
  Canonical: "Whether a canonical URL is declared on the homepage. Canonical tags help search engines understand the preferred version of a page.",
  Sitemap: "HTTP status or availability of the public sitemap. A working sitemap helps search engines discover important URLs.",
  "Internal links": "Number of internal links detected on the homepage. This is a crawl-depth and site architecture proxy.",
  "GSC clicks": "First-party Google Search Console clicks for the Astral-owned property over the collector date range.",
  "GSC impressions": "First-party Google Search Console impressions for the Astral-owned property. This is search impression data, not competitor traffic.",
  "Average position": "Google Search Console weighted average position for collected queries.",
  "AI referral sessions": "GA4 sessions where the traffic source matches known AI referrers such as ChatGPT, Perplexity, Gemini, Claude, Copilot, Poe, or You.com.",
  "AI visibility": "Prompt-bank visibility score from approved AI provider captures. This measures mentions/citations, not platform impressions.",
  "Citation share": "Share of collected AI answer citations that point to the Astral-owned domain."
};

function toDashboardBrand(brand, monitoredSet = snapshot.activeMonitoredSet || snapshot.monitoredSet || "astral-pipes") {
  const socialData = socialByBrand.get(`${monitoredSet}:${brand.name}`) || socialByBrand.get(`astral-pipes:${brand.name}`);
  const ownedBrandSlug = brand.ownedBrandSlug || monitoredSet;
  const searchConsoleData = searchConsoleBySlug.get(ownedBrandSlug) || null;
  const aiReferralData = aiReferralBySlug.get(ownedBrandSlug) || null;
  const aiVisibilityData = aiVisibilityBySlug.get(ownedBrandSlug) || null;
  const scores = brand.scores || {};
  const publicWebsite = scores.publicWebsite ?? 0;
  const aeoReadiness = scores.aeoReadiness ?? 0;
  const technicalSeo = scores.technicalSeo ?? publicWebsite;
  const contentExtraction = scores.contentExtraction ?? aeoReadiness;
  const accessibilityProxy = scores.accessibilityProxy ?? publicWebsite;
  const securityPrivacy = scores.securityPrivacy ?? publicWebsite;
  const registryCompleteness = scores.registryCompleteness ?? 0;
  const composite = Math.round(
    publicWebsite * 0.2 +
      aeoReadiness * 0.2 +
      technicalSeo * 0.2 +
      contentExtraction * 0.15 +
      accessibilityProxy * 0.1 +
      securityPrivacy * 0.1 +
      registryCompleteness * 0.05
  );
  const socialCount = brand.social?.length ?? 0;
  const youtubeVideos30d = socialData?.summary?.youtubeVideos30d;
  return {
    name: brand.name,
    type: brand.type,
    priority: brand.priority,
    website: brand.website?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    score: composite,
    previous: composite,
    aeo: Math.round((aeoReadiness / 100) * 15),
    seo: Math.round((technicalSeo / 100) * 20),
    social: socialData ? Math.min(20, Math.round(((socialData.summary.reachableProfiles || 0) / Math.max(socialData.summary.profilesTracked || 1, 1)) * 12) + Math.min(8, youtubeVideos30d || 0)) : null,
    performance: Math.round((publicWebsite / 100) * 15),
    campaigns: null,
    content: Math.round((contentExtraction / 100) * 10),
    reputation: null,
    verified: Math.round((registryCompleteness / 100) * 5),
    followers: "API restricted",
    engagement: "Restricted",
    frequency: youtubeVideos30d != null ? `${youtubeVideos30d} YouTube videos / 30d` : "Needs capture",
    momentum: 0,
    threat: brand.name === "Astral Pipes" ? "Reference" : "Watch",
    color: brandColors[brand.name] || "#6b7280",
    collected: brand,
    ownedBrandSlug,
    monitoredSet,
    auditScores: {
      publicWebsite,
      aeoReadiness,
      technicalSeo,
      contentExtraction,
      accessibilityProxy,
      securityPrivacy,
      registryCompleteness
    },
    socialData,
    searchConsoleData,
    aiReferralData,
    aiVisibilityData,
    dataMode: "Collected"
  };
}

function getSnapshotForOwnedBrand(ownedBrand) {
  return snapshotBySetSlug.get(ownedBrand.competitorSetSlug) || null;
}

function getBrandsForOwnedBrand(ownedBrand) {
  const setSnapshot = getSnapshotForOwnedBrand(ownedBrand);
  if (setSnapshot?.brands?.length) return setSnapshot.brands.map((brand) => toDashboardBrand(brand, setSnapshot.monitoredSet));
  if (ownedBrand.slug === "astral-pipes") return seedBrands;
  return [];
}

const brands = snapshotSets.flatMap((set) =>
  (set.brands || []).map((brand) => toDashboardBrand(brand, set.monitoredSet))
);

const socialGeneratedAt = socialSnapshot?.generatedAt
  ? new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata"
    }).format(new Date(socialSnapshot.generatedAt))
  : "Not collected";

function formatSnapshotTime(value) {
  return value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
      }).format(new Date(value))
    : "Not collected";
}

const generatedAt = snapshot?.generatedAt
  ? new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata"
    }).format(new Date(snapshot.generatedAt))
  : "Not collected";

function toAlert(event) {
  return {
    level: event.severity,
    title: event.title,
    detail: event.detail,
    time: event.firstSeenAt ? formatSnapshotTime(event.firstSeenAt) : "Not run",
    sourceUrl: event.sourceUrl,
    brand: event.brand,
    confidence: event.confidence
  };
}

const recommendations = [
  "Run the approved AEO prompt bank and attach cited answer evidence.",
  "Import SEO keyword ranks for the fixed pipe-category query bank.",
  "Capture social follower, post, and engagement metrics with source screenshots.",
  "Run Lighthouse on homepage, category, dealer locator, contact, and campaign pages."
];

const campaigns = (monitorEvents.events || [])
  .filter((event) =>
    ["campaign_page", "category_or_product_page", "new_url_detected", "campaign_terms_detected", "social_post_detected", "ad_library_creative_detected"].includes(event.type)
  )
  .slice(0, 5)
  .map((event) => ({
    brand: event.brand,
    name: event.title,
    channel: event.type === "social_post_detected" ? "YouTube RSS" : event.type === "ad_library_creative_detected" ? "Meta Ad Library" : "Public monitor",
    status: event.type === "baseline_created" ? "Baseline" : "Detected",
    impact: event.severity
  }));

const ownedBrandHealth = astralBrands.map((ownedBrand) => {
  const ownedBrands = getBrandsForOwnedBrand(ownedBrand);
  const primary = ownedBrands.find((brand) => brand.name === ownedBrand.name) || ownedBrands[0] || null;
  const taxonomy = taxonomyByBrandSlug.get(ownedBrand.slug);
  const pointers = generateTopPointers({ ownedBrand, primary, taxonomy });
  return {
    ...ownedBrand,
    score: primary?.score ?? null,
    scoreLabel: primary ? `${primary.score}/100` : "--/100",
    dataStatus: primary ? "Live" : ownedBrand.status,
    pointers,
    taxonomy,
    primary
  };
});

function generateTopPointers({ ownedBrand, primary, taxonomy }) {
  if (!primary) {
    const taxonomyCount = taxonomy ? Object.values(taxonomy.segments || {}).flat().length : 0;
    return [
      createPointer("Setup", "High", "Registry", `${ownedBrand.name} needs its verified official social handles before scoring can start.`, ownedBrand.evidence.evidenceUrl),
      taxonomyCount
        ? createPointer("Setup", "High", "Competitor taxonomy", `${taxonomyCount} competitor and comparable entities are mapped; next step is official URL verification.`, ownedBrand.evidence.evidenceUrl)
        : createPointer("Setup", "High", "Competitor taxonomy", "Competitor taxonomy is not mapped yet.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "High", "Website", `Run public website collection for ${ownedBrand.website}.`, ownedBrand.website),
      createPointer("Setup", "Medium", "Social", "Connect YouTube/X APIs or browser evidence before showing follower or engagement metrics.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "Medium", "Campaigns", "Add Meta Ad Library page IDs and campaign keywords for active creative monitoring.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "Medium", "AEO", "Run the AEO checklist and prompt bank after the first website crawl.", ownedBrand.website),
      createPointer("Setup", "Medium", "SEO", "Create the first category keyword bank and ranking source for this brand.", ownedBrand.website),
      createPointer("Setup", "Low", "Reports", "Prepare brand-level report exports once baseline data exists.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "Low", "Monitoring", "Add Telegram routing for brand-specific alerts.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "Low", "Evidence", "Store every metric with source, collection method, confidence, and evidence URL.", ownedBrand.evidence.evidenceUrl),
      createPointer("Setup", "Low", "Governance", "Keep this card in Setup Required until factual baselines are collected.", ownedBrand.evidence.evidenceUrl)
    ].slice(0, 10);
  }

  const audit = primary.auditScores || {};
  const events = (monitorEvents.events || []).filter((event) => event.brand === primary.name);
  const weakScores = [
    ["AEO", audit.aeoReadiness, "Improve answer-engine readiness with schema, FAQs, llms.txt, and prompt evidence."],
    ["SEO", audit.technicalSeo, "Review metadata, sitemap, canonical, internal links, and structured data."],
    ["Accessibility", audit.accessibilityProxy, "Run a proper accessibility crawl and fix image alt, labels, headings, and mobile semantics."],
    ["Security", audit.securityPrivacy, "Review HTTPS/security headers and privacy policy signals."],
    ["Content", audit.contentExtraction, "Add direct-answer summaries, FAQs, tables, and extractable educational blocks."]
  ]
    .filter(([, score]) => Number(score) < 75)
    .map(([module, score, action]) => createPointer(score < 50 ? "Critical" : "Watch", score < 50 ? "High" : "Medium", module, `${module} score is ${score}/100. ${action}`, primary.collected?.website || primary.website));

  const eventPointers = events.slice(0, 4).map((event) =>
    createPointer(event.severity, event.severity, formatEventType(event.type), event.detail, event.sourceUrl)
  );

  const social = primary.socialData?.summary;
  const socialPointers = [
    social?.youtubeVideos30d != null
      ? createPointer("Live", "Medium", "Social", `${primary.name} has ${social.youtubeVideos30d} public YouTube uploads in the last 30 days.`, primary.socialData?.profiles?.find((profile) => profile.platform === "youtube")?.url)
      : createPointer("Restricted", "Medium", "Social", "YouTube cadence is not available until channel/feed evidence is connected.", primary.collected?.website || primary.website),
    createPointer("Restricted", "Medium", "Social", "Follower growth and engagement rate remain hidden until API, export, or browser evidence is attached.", primary.collected?.website || primary.website)
  ];

  const checklistPointers = [
    createPointer("Action", "Medium", "AEO", "Run scheduled AI prompt testing for ChatGPT, Perplexity, Gemini, Claude, Copilot, and Google AI Overviews.", primary.collected?.website || primary.website),
    createPointer("Action", "Medium", "SEO", "Import rank tracking for the approved non-brand pipe category keyword bank.", primary.collected?.website || primary.website),
    createPointer("Action", "Low", "Reports", "Generate the next monthly executive summary from verified monitor events and public evidence.", primary.collected?.website || primary.website)
  ];

  return [...eventPointers, ...weakScores, ...socialPointers, ...checklistPointers].slice(0, 10);
}

function createPointer(status, severity, module, title, evidenceUrl) {
  return {
    status,
    severity,
    module,
    title,
    action: title,
    source: evidenceUrl ? "Verified public evidence" : "Setup required",
    evidenceUrl
  };
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const moduleLabels = {
  overview: "Overview",
  aeo: "AEO",
  seo: "SEO",
  social: "Social",
  website: "Website",
  campaigns: "Campaigns"
};

const moduleHeaders = {
  overview: {
    label: "Executive view",
    title: "Competitive Command Center",
    copy: "A live public-evidence summary of competitor movement, open alerts, and next actions."
  },
  aeo: {
    label: "Answer engine optimization",
    title: "AEO Study",
    copy: "AI crawlability, schema, extractable content, citation readiness, and answer-engine evidence for each brand."
  },
  seo: {
    label: "Search visibility",
    title: "SEO Study",
    copy: "Technical and on-page SEO evidence from public pages, with rank and backlink inputs kept separate until connected."
  },
  social: {
    label: "Social intelligence",
    title: "Social Study",
    copy: "Confirmed official profiles and the collection status for public social evidence."
  },
  website: {
    label: "Website quality",
    title: "Website Study",
    copy: "Public performance proxies, UX signals, accessibility indicators, security headers, and visible technology stack."
  },
  campaigns: {
    label: "Campaign watch",
    title: "Campaign Monitor",
    copy: "Public campaign-like URLs, category launches, homepage changes, schema shifts, and evidence-backed alerts."
  }
};

const aeoChecklistSections = [
  {
    title: "1.1 Brand presence in AI answers",
    items: [
      ["Brand is named in top category-defining AI answers", "aiBrandMention", "Needs scheduled AI prompt testing"],
      ["Brand cited with source link in Perplexity", "aiPerplexityCitation", "Needs Perplexity capture"],
      ["Brand appears in Google AI Overviews / AI Mode", "pending", "Needs SERP/AI Overview capture"],
      ["Brand mentioned in ChatGPT search results", "aiOpenAiMention", "Needs browser-enabled prompt capture"],
      ["Brand surfaces in Gemini, Copilot, and Claude", "aiMultiEngine", "Needs multi-engine prompt run"],
      ["AI answer share of voice vs competitors", "aiShareOfVoice", "Needs fixed query set"],
      ["Sentiment of AI mentions", "aiSentiment", "Needs answer text classification"],
      ["Unprompted brand mention frequency", "aiPromptBank", "Needs category prompt bank"]
    ]
  },
  {
    title: "1.2 Content structure for extraction",
    items: [
      ["Direct-answer intro paragraph", "directAnswer"],
      ["Question-form H2/H3 headings", "questionHeadings"],
      ["FAQ blocks on commercial/informational pages", "faqText"],
      ["Definition boxes, summary callouts, TL;DR sections", "answerBlocks"],
      ["Numbered lists and tables", "answerBlocks"],
      ["Self-contained extractable paragraphs", "answerBlocks"],
      ["Conversational question-answer phrasing", "questionHeadings"],
      ["80-120 word answer-friendly blocks", "answerBlocks"]
    ]
  },
  {
    title: "1.3 Structured data and schema",
    items: [
      ["FAQPage schema", "faqSchema"],
      ["HowTo schema", "howToSchema"],
      ["Article / NewsArticle schema", "articleSchema"],
      ["Product schema", "productSchema"],
      ["Organization schema with sameAs/contact signals", "organizationSchema"],
      ["BreadcrumbList schema", "breadcrumbSchema"],
      ["Speakable schema", "pending", "Needs schema validator detail"],
      ["LocalBusiness schema", "localBusinessSchema"],
      ["Schema validator clean pass", "pending", "Needs Rich Results / Schema.org validator"]
    ]
  },
  {
    title: "1.4 E-E-A-T signals",
    items: [
      ["Named authors / editorial signals", "authorSignals"],
      ["Author-level topical authority", "pending", "Needs author-page crawl"],
      ["Editorial / fact-check / review process", "authorSignals"],
      ["Visible last-updated / freshness signals", "freshnessSignals"],
      ["Primary-source citations", "pending", "Needs outbound citation audit"],
      ["First-party data / original research", "pending", "Needs content-level crawl"],
      ["Customer case studies", "trustSignals"],
      ["Awards, certifications, BIS/ISI marks", "trustSignals"],
      ["Wikipedia/Wikidata/directory presence", "pending", "Needs off-site collector"]
    ]
  },
  {
    title: "1.5 Crawlability for AI crawlers",
    items: [
      ["robots.txt allows GPTBot", "gptbot"],
      ["robots.txt allows ClaudeBot", "claudebot"],
      ["robots.txt allows PerplexityBot", "perplexitybot"],
      ["robots.txt allows Google-Extended", "googleextended"],
      ["robots.txt allows CCBot / Bytespider / Applebot-Extended", "otherAiBots"],
      ["No known AI-bot block in robots.txt", "aiBots"],
      ["Server-rendered/pre-rendered HTML proxy", "wordCount"],
      ["llms.txt published at root", "llms"],
      ["Sitemap referenced/publicly available", "sitemap"],
      ["Fast crawler response / TTFB proxy", "response"],
      ["No login wall on homepage", "homepageReachable"]
    ]
  },
  {
    title: "1.6 Topical authority and entity building",
    items: [
      ["Pillar + cluster architecture", "resourceHub"],
      ["Internal linking density", "internalLinks"],
      ["Brand-entity association", "pending", "Needs knowledge graph/off-site checks"],
      ["Consistent NAP", "contactSignals"],
      ["Brand mentioned with category keywords off-site", "pending", "Needs web mention collector"],
      ["Glossary / encyclopedia-style category content", "resourceHub"],
      ["Branded SERP ownership", "pending", "Needs branded SERP capture"]
    ]
  },
  {
    title: "1.7 Off-site AI training and citation sources",
    items: [
      ["Wikipedia / Wikidata presence", "pending", "Needs off-site collector"],
      ["Reddit presence", "pending", "Needs social/listening collector"],
      ["Quora answers", "pending", "Needs off-site collector"],
      ["YouTube transcripts indexed", "pending", "Needs YouTube collector"],
      ["Industry publication mentions", "pending", "Needs news/PR collector"],
      ["Third-party best-of/listicle mentions", "pending", "Needs SERP collector"],
      ["Public datasets / open documentation", "pending", "Needs off-site collector"],
      ["Podcast appearances with transcripts", "pending", "Needs media collector"]
    ]
  },
  {
    title: "1.8 AEO measurement and tracking",
    items: [
      ["AEO tracking tool connected", "aiVisibilityTracking", "Needs Profound/Otterly/Peec/etc."],
      ["Defined query set tested monthly", "aiPromptRunner", "Needs prompt runner"],
      ["Citation count and share-of-voice tracked", "aiCitationShare", "Needs AEO results table"],
      ["AI referral traffic isolated in GA4", "aiReferralTraffic", "First-party only"],
      ["AI referral conversion rate tracked", "aiReferralConversion", "First-party only"]
    ]
  }
];

function App() {
  const [session, setSession] = useState(() => {
    if (window.localStorage.getItem(PERISCOPE_SESSION_KEY) === PERISCOPE_USER_ID) {
      return { user: { email: PERISCOPE_USER_ID } };
    }
    return null;
  });
  const [activeOwnedBrandSlug, setActiveOwnedBrandSlug] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("brand") || null;
  });

  const handleLogin = ({ userId, password }) => {
    const isApprovedUser =
      userId.trim().toLowerCase() === PERISCOPE_USER_ID &&
      password === PERISCOPE_PASSWORD;
    if (!isApprovedUser) return false;
    window.localStorage.setItem(PERISCOPE_SESSION_KEY, PERISCOPE_USER_ID);
    setSession({ user: { email: PERISCOPE_USER_ID } });
    return true;
  };

  const handleLogout = () => {
    window.localStorage.removeItem(PERISCOPE_SESSION_KEY);
    setSession(null);
    setActiveOwnedBrandSlug(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const openOwnedBrand = (slug) => {
    setActiveOwnedBrandSlug(slug);
    window.history.replaceState(null, "", `?brand=${slug}`);
  };

  const goHome = () => {
    setActiveOwnedBrandSlug(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const activeOwnedBrand = astralBrands.find((brand) => brand.slug === activeOwnedBrandSlug);
  if (!activeOwnedBrand) {
    return (
      <UniverseHome
        user={session.user}
        onLogout={handleLogout}
        onOpenBrand={openOwnedBrand}
      />
    );
  }

  return (
    <BrandDashboard
      ownedBrand={activeOwnedBrand}
      user={session.user}
      onHome={goHome}
      onLogout={handleLogout}
    />
  );
}

function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    const success = onLogin({ userId, password });
    setInvalid(!success);
  };

  return (
    <main className="auth-shell">
      <section className="auth-card login-card">
        <img className="periscope-logo" src={periscopeLogo} alt="Periscope" />
        <form className="login-form" onSubmit={handleLogin}>
          <label>
            <span>User ID</span>
            <input
              className={invalid ? "invalid" : ""}
              value={userId}
              onChange={(event) => {
                setUserId(event.target.value);
                setInvalid(false);
              }}
              type="text"
              autoComplete="username"
              aria-invalid={invalid}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              className={invalid ? "invalid" : ""}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setInvalid(false);
              }}
              type="password"
              autoComplete="current-password"
              aria-invalid={invalid}
            />
          </label>
          <button className="text-button auth-submit">
            Login
          </button>
        </form>
        <button className="link-button" onClick={() => setInvalid(false)}>Forgot Password</button>
      </section>
    </main>
  );
}

function BrandDashboard({ ownedBrand, user, onHome, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState(() => {
    const requested = new URLSearchParams(window.location.search).get("module");
    return moduleHeaders[requested] ? requested : "overview";
  });
  const activeSnapshot = getSnapshotForOwnedBrand(ownedBrand);
  const activeBrands = useMemo(() => getBrandsForOwnedBrand(ownedBrand), [ownedBrand.slug]);
  const [selectedBrand, setSelectedBrand] = useState(ownedBrand.name);
  const [range, setRange] = useState("Last 90 days");
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return activeBrands;
    return activeBrands.filter((brand) =>
      [brand.name, brand.type, brand.website, brand.threat].some((field) =>
        field.toLowerCase().includes(value)
      )
    );
  }, [activeBrands, query]);

  const selected = activeBrands.find((brand) => brand.name === selectedBrand) || activeBrands[0];
  const ranked = [...filteredBrands].sort((a, b) => b.score - a.score);
  const leader = [...activeBrands].sort((a, b) => b.score - a.score)[0];
  const average = activeBrands.length ? Math.round(activeBrands.reduce((sum, brand) => sum + brand.score, 0) / activeBrands.length) : 0;
  const dataGaps = (activeSnapshot?.brands || []).reduce(
    (sum, brand) => sum + (brand.unavailableMetrics?.length || 0),
    0
  );
  const activeBrandNames = new Set(activeBrands.map((brand) => brand.name));
  const activeEvents = (monitorEvents.events || []).filter((event) => activeBrandNames.has(event.brand));
  const activeAlerts = activeEvents.slice(0, 5).map(toAlert);
  const eventCount = activeEvents.length;
  const latestMonitorRun = monitorEvents.generatedAt ? formatSnapshotTime(monitorEvents.generatedAt) : "Not run yet";
  const activeGeneratedAt = formatSnapshotTime(activeSnapshot?.generatedAt);
  const isOverview = activeModule === "overview";
  const header = moduleHeaders[activeModule] || moduleHeaders.overview;

  if (!activeBrands.length || !selected) {
    return (
      <SetupBrandDashboard
        ownedBrand={ownedBrand}
        user={user}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onHome={onHome}
        onLogout={onLogout}
      />
    );
  }

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} activeModule={activeModule} onModule={setActiveModule} onHome={onHome} />

      <section className="workspace">
        <TopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          query={query}
          setQuery={setQuery}
          range={range}
          setRange={setRange}
          user={user}
          onLogout={onLogout}
          onReport={() =>
            downloadJson(`${ownedBrand.slug}-brand-report.json`, {
              generatedAt: new Date().toISOString(),
              ownedBrand,
              selectedBrand: selected,
              ranked,
              alerts: activeAlerts,
              monitorEvents: activeEvents
            })
          }
        />

        <div className={`content-grid ${isOverview ? "" : "full-width"}`}>
          <section className="main-column">
            <header className="page-header">
              <div>
                <p className="section-label">{header.label}</p>
                <h1>{ownedBrand.name} {header.title}</h1>
                <p className="header-copy">{header.copy}</p>
              </div>
              <div className="brand-select">
                <span>Focus brand</span>
                <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
                  {activeBrands.map((brand) => (
                    <option key={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </header>

            {isOverview ? (
              <>
                <section className="metric-grid" aria-label="Competitive summary">
                  <MetricCard
                    icon={<ShieldCheck size={19} />}
                    label="Astral public score"
                    value={selected.score}
                    suffix="/100"
                    delta="Collected from official public sources"
                  />
                  <MetricCard
                    icon={<TrendingUp size={19} />}
                    label="Public leader"
                    value={leader.score}
                    suffix="/100"
                    delta={leader.name}
                  />
                  <MetricCard
                    icon={<Activity size={19} />}
                    label="Market average"
                    value={average}
                    suffix="/100"
                    delta={`${activeBrands.length} tracked brands`}
                  />
                  <MetricCard
                    icon={<Sparkles size={19} />}
                    label="Monitor events"
                    value={eventCount}
                    suffix=""
                    delta={`Latest run: ${latestMonitorRun}`}
                  />
                </section>

                <section className="data-notice" aria-label="Data provenance">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Live public monitor</strong>
                    <span>
                      Latest collection: {activeGeneratedAt}. {dataGaps} restricted metrics remain pending
                      until APIs, exports, or browser evidence are connected.
                    </span>
                  </div>
                </section>
                <section className="split-grid">
                  <AIReferralPanel brand={selected} compact />
                  <AIVisibilityPanel brand={selected} compact />
                </section>
              </>
            ) : null}

            <ModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />

            <ModuleWorkspace
              activeModule={activeModule}
              ranked={ranked}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selected={selected}
              ownedBrand={ownedBrand}
              events={activeEvents}
            />
          </section>

          {isOverview ? <aside className="insight-rail">
            <section className="panel focus-panel">
              <div className="focus-score" style={{ "--score": selected.score }}>
                <span>{selected.score}</span>
              </div>
              <h2>{selected.name}</h2>
              <p>{selected.type}</p>
              <div className="mini-stats">
                <span>AEO {selected.aeo}/15</span>
                <span>SEO {selected.seo}/20</span>
                <span>{selected.social === null ? "Social restricted" : `Social ${selected.social}/20`}</span>
              </div>
            </section>

            <section className="panel alert-panel">
              <div className="panel-heading compact">
                <h2>Alerts</h2>
                <Bell size={17} />
              </div>
              <div className="alert-list">
                {activeAlerts.map((alert) => (
                  <article className="alert-item" key={alert.title}>
                    <span className={`alert-level ${alert.level.toLowerCase()}`}>{alert.level}</span>
                    <h3>{alert.title}</h3>
                    <p>{alert.detail}</p>
                    {alert.sourceUrl ? (
                      <a href={alert.sourceUrl} target="_blank" rel="noreferrer">
                        Evidence
                      </a>
                    ) : null}
                    <time>{alert.time}</time>
                  </article>
                ))}
                {activeAlerts.length === 0 ? (
                  <article className="alert-item">
                    <span className="alert-level info">Ready</span>
                    <h3>No monitor events yet</h3>
                    <p>Run npm run monitor to create a baseline and detect future website changes.</p>
                    <time>Waiting for first run</time>
                  </article>
                ) : null}
              </div>
            </section>

            <section className="panel recommendations">
              <div className="panel-heading compact">
                <h2>Next actions</h2>
                <FileText size={17} />
              </div>
              {recommendations.map((item, index) => (
                <label className="check-row" key={item}>
                  <input type="checkbox" defaultChecked={index < 2} />
                  <span>{item}</span>
                </label>
              ))}
            </section>
          </aside> : null}
        </div>
      </section>
    </main>
  );
}

function UniverseHome({ user, onLogout, onOpenBrand }) {
  const [selectedSlug, setSelectedSlug] = useState("astral-pipes");
  const selected = ownedBrandHealth.find((brand) => brand.slug === selectedSlug) || ownedBrandHealth[0];
  const liveCount = ownedBrandHealth.filter((brand) => brand.dataStatus === "Live").length;
  const setupCount = ownedBrandHealth.length - liveCount;

  return (
    <main className="universe-shell">
      <header className="universe-topbar">
        <div className="brand-lockup universe-lockup">
          <img className="periscope-icon-mark" src={periscopeIcon} alt="Periscope" />
          <div>
            <strong>Periscope</strong>
            <span>Astral intelligence</span>
          </div>
        </div>
        <div className="universe-user">
          <span>{user?.email}</span>
          <button
            className="text-button subtle"
            onClick={() =>
              downloadJson("periscope-ecosystem-report.json", {
                generatedAt: new Date().toISOString(),
                brands: ownedBrandHealth,
                monitorEvents: monitorEvents.events || []
              })
            }
          >
            <Download size={16} />
            Ecosystem report
          </button>
          <button className="text-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <section className="universe-hero">
        <div>
          <p className="section-label">Ecosystem command center</p>
          <h1>Astral Periscope</h1>
          <p className="header-copy">
            One protected home for brand health, competitive intelligence, campaign monitoring, social evidence, and next actions across the Astral ecosystem.
          </p>
        </div>
        <div className="universe-summary">
          <article>
            <span>Live dashboards</span>
            <strong>{liveCount}</strong>
          </article>
          <article>
            <span>Setup required</span>
            <strong>{setupCount}</strong>
          </article>
          <article>
            <span>Monitor events</span>
            <strong>{monitorEvents.events?.length || 0}</strong>
          </article>
        </div>
      </section>

      <section className="owned-brand-rail" aria-label="Astral brands">
        {ownedBrandHealth.map((brand) => (
          <article
            key={brand.slug}
            className={`owned-brand-card ${brand.slug === selected.slug ? "active" : ""}`}
            onClick={() => setSelectedSlug(brand.slug)}
            tabIndex="0"
            role="button"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setSelectedSlug(brand.slug);
            }}
          >
            <div className="owned-card-topline">
              <span>{brand.priority}</span>
              <b className={brand.dataStatus === "Live" ? "status-live" : "status-setup"}>{brand.dataStatus}</b>
            </div>
            <h2>{brand.name}</h2>
            <p>{brand.category}</p>
            <div className="owned-score-row">
              <strong>{brand.scoreLabel}</strong>
              <span>Overall Health Score</span>
            </div>
            <button className="text-button" onClick={(event) => {
              event.stopPropagation();
              onOpenBrand(brand.slug);
            }}>
              <Eye size={16} />
              View Dashboard
            </button>
          </article>
        ))}
      </section>

      <section className="universe-detail-grid">
        <div className="panel selected-brand-panel">
          <div className="panel-heading">
            <div>
              <h2>{selected.name}</h2>
              <p>{selected.category}</p>
            </div>
            <span className={`monitor-count ${selected.dataStatus === "Live" ? "" : "setup"}`}>{selected.dataStatus}</span>
          </div>
          <div className="universe-score-lockup">
            <div className="focus-score" style={{ "--score": selected.score || 0 }}>
              <span>{selected.score ?? "--"}</span>
            </div>
            <div>
              <h3>Overall Health Score</h3>
              <p>
                {selected.score === null
                  ? "Score is intentionally withheld until factual baselines are collected."
                  : "Score uses the current verified public-evidence model."}
              </p>
            </div>
          </div>
          <button className="text-button" onClick={() => onOpenBrand(selected.slug)}>
            <Eye size={16} />
            View Dashboard
          </button>
        </div>
        <TopPointersPanel pointers={selected.pointers} title="Top 10 Most Important Pointers" />
      </section>
    </main>
  );
}

function TopPointersPanel({ pointers, title }) {
  return (
    <section className="panel pointer-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>Dynamic concerns, evidence gaps, and next actions for the selected brand.</p>
        </div>
      </div>
      <div className="pointer-list">
        {pointers.map((pointer, index) => (
          <article className={`pointer-item severity-${pointer.severity.toLowerCase()}`} key={`${pointer.module}-${index}`}>
            <span>{index + 1}</span>
            <div>
              <strong>{pointer.title}</strong>
              <small>{pointer.module} · {pointer.source}</small>
            </div>
            {pointer.evidenceUrl ? <a href={pointer.evidenceUrl} target="_blank" rel="noreferrer">Evidence</a> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function SetupBrandDashboard({ ownedBrand, user, collapsed, setCollapsed, onHome, onLogout }) {
  const taxonomy = taxonomyByBrandSlug.get(ownedBrand.slug);
  const setupPointers = generateTopPointers({ ownedBrand, primary: null, taxonomy });
  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} activeModule="overview" onModule={() => {}} onHome={onHome} />
      <section className="workspace">
        <TopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          query=""
          setQuery={() => {}}
          range="Setup"
          setRange={() => {}}
          user={user}
          onLogout={onLogout}
          onReport={() =>
            downloadJson(`${ownedBrand.slug}-setup-report.json`, {
              generatedAt: new Date().toISOString(),
              ownedBrand,
              setupPointers
            })
          }
        />
        <section className="setup-dashboard">
          <header className="page-header">
            <div>
              <p className="section-label">Brand setup workspace</p>
              <h1>{ownedBrand.name} Dashboard</h1>
              <p className="header-copy">
                This brand is registered in Periscope, but the factual monitoring baseline is not complete yet.
              </p>
            </div>
            <span className="monitor-count setup">Setup Required</span>
          </header>
          <section className="metric-grid">
            <MetricCard icon={<ShieldCheck size={19} />} label="Overall Health Score" value="--" suffix="/100" delta="Withheld until baseline collection" />
            <MetricCard icon={<Globe2 size={19} />} label="Official website" value="1" suffix="" delta={ownedBrand.website.replace(/^https?:\/\//, "")} />
            <MetricCard icon={<Activity size={19} />} label="Data status" value="0" suffix="/100" delta="No fake metrics shown" />
            <MetricCard icon={<Sparkles size={19} />} label="Next stage" value="10" suffix="" delta="Setup pointers ready" />
          </section>
          <section className="split-grid">
            <TopPointersPanel pointers={setupPointers} title={`${ownedBrand.name} setup pointers`} />
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Source registry</h2>
                  <p>Initial source evidence for this Astral brand.</p>
                </div>
              </div>
              <div className="evidence-grid">
                <div>
                  <span>Website</span>
                  <a href={ownedBrand.website} target="_blank" rel="noreferrer">{ownedBrand.website}</a>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>{ownedBrand.evidence.confidence}</strong>
                </div>
                <div>
                  <span>Evidence</span>
                  <a href={ownedBrand.evidence.evidenceUrl} target="_blank" rel="noreferrer">Open evidence</a>
                </div>
              </div>
            </section>
          </section>
          <CompetitorTaxonomyPanel taxonomy={taxonomy} />
        </section>
      </section>
    </main>
  );
}

function CompetitorTaxonomyPanel({ taxonomy }) {
  if (!taxonomy) {
    return (
      <section className="panel taxonomy-panel">
        <div className="panel-heading">
          <div>
            <h2>Competitor taxonomy</h2>
            <p>No competitor taxonomy has been mapped for this brand yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel taxonomy-panel">
      <div className="panel-heading">
        <div>
          <h2>Competitor taxonomy</h2>
          <p>{taxonomy.category}</p>
        </div>
        {taxonomy.needsConfirmation ? <span className="monitor-count setup">Needs Confirmation</span> : null}
      </div>
      {taxonomy.note ? <p className="taxonomy-note">{taxonomy.note}</p> : null}
      {taxonomy.assumption ? <p className="taxonomy-note">{taxonomy.assumption}</p> : null}
      <div className="taxonomy-grid">
        {Object.entries(taxonomy.segments || {}).map(([segment, items]) => (
          <article key={segment}>
            <h3>{formatSegmentLabel(segment)}</h3>
            <div className="pending-list">
              {items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatSegmentLabel(value) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function Sidebar({ collapsed, activeModule, onModule, onHome }) {
  const items = [
    ["overview", LayoutDashboard, "Overview"],
    ["aeo", Bot, "AEO"],
    ["seo", Globe2, "SEO"],
    ["social", UsersRound, "Social"],
    ["website", Gauge, "Website"],
    ["campaigns", Megaphone, "Campaigns"],
    ["reports", FileText, "Reports"]
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand-lockup">
        <img className="periscope-icon-mark" src={periscopeIcon} alt="Periscope" />
        <div>
          <strong>Periscope</strong>
          <span>Brand intelligence</span>
        </div>
      </div>
      <nav aria-label="Dashboard navigation">
        <button onClick={onHome}>
          <LayoutDashboard size={19} />
          <span>Home</span>
        </button>
        {items.map(([id, Icon, label]) => (
          <button key={id} className={activeModule === id ? "active" : ""} onClick={() => onModule(id)}>
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button>
          <Settings size={19} />
          <span>Study setup</span>
        </button>
      </div>
    </aside>
  );
}

function TopBar({ collapsed, setCollapsed, query, setQuery, range, setRange, user, onLogout, onReport }) {
  return (
    <header className="topbar">
      <button className="icon-button" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
        <Menu size={19} />
      </button>
      <label className="search-field">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brands, sources, threats"
        />
      </label>
      <div className="topbar-actions">
        <label className="range-control">
          <CalendarDays size={17} />
          <select value={range} onChange={(event) => setRange(event.target.value)}>
            {range === "Setup" ? <option>Setup</option> : null}
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This quarter</option>
            <option>Custom study</option>
          </select>
          <ChevronDown size={15} />
        </label>
        <button className="text-button" onClick={onReport}>
          <Download size={16} />
          Report
        </button>
        {user ? (
          <button className="text-button subtle" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}

function MetricCard({ icon, label, value, suffix, delta }) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>
        {value}
        <small>{suffix}</small>
      </strong>
      <p>{delta}</p>
    </article>
  );
}

function ModuleTabs({ activeModule, setActiveModule }) {
  const tabs = [
    ["overview", "Overview", BarChart3],
    ["aeo", "AEO", Bot],
    ["seo", "SEO", LineChart],
    ["social", "Social", UsersRound],
    ["website", "Website", MonitorSmartphone],
    ["campaigns", "Campaigns", Megaphone]
  ];
  return (
    <div className="module-tabs" role="tablist" aria-label="Study modules">
      {tabs.map(([id, label, Icon]) => (
        <button key={id} className={activeModule === id ? "active" : ""} onClick={() => setActiveModule(id)}>
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}

function ModuleWorkspace({ activeModule, ranked, selectedBrand, setSelectedBrand, selected, ownedBrand, events = [] }) {
  if (activeModule === "aeo") {
    return (
      <>
        <AEOCommandCenter brand={selected} competitors={ranked} />
        <AIVisibilityPanel brand={selected} />
        <DisciplineTable
          title="AEO comparison"
          description="AI crawler readiness, schema coverage, extractable content, E-E-A-T proxies, and llms.txt evidence."
          rows={ranked}
          columns={[
            ["AEO score", (brand) => `${brand.auditScores.aeoReadiness}/100`],
            ["FAQ schema", (brand) => yesNo(brand.collected.homepage.signals.hasFaqSchema)],
            ["Product schema", (brand) => yesNo(brand.collected.homepage.signals.hasProductSchema)],
            ["Org schema", (brand) => yesNo(brand.collected.homepage.signals.hasOrganizationSchema)],
            ["AI bots", (brand) => yesNo(brand.collected.robots.allowsKnownAiBots)],
            ["llms.txt", (brand) => statusLabel(brand.collected.llms?.ok)],
            ["Q headings", (brand) => brand.collected.pageAudit?.totals?.questionHeadings || brand.collected.homepage.counts.questionHeadings]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SignalPanel
            title={`${selected.name} AEO snapshot`}
            description="Collected public signals for the selected brand."
            signals={[
              ["AEO readiness", selected.auditScores.aeoReadiness],
              ["Content extraction", selected.auditScores.contentExtraction],
              ["Pages audited", selected.collected.pageAudit?.okPageCount || 1],
              ["Schema types", selected.collected.pageAudit?.schemaTypes?.length || selected.collected.homepage.schemaTypes.length],
              ["Answer blocks", selected.collected.pageAudit?.totals?.answerFriendlyBlocks || selected.collected.homepage.contentStructure.answerFriendlyBlocks],
              ["Question headings", selected.collected.pageAudit?.totals?.questionHeadings || selected.collected.homepage.counts.questionHeadings]
            ]}
          />
          <SchemaPanel brand={selected} />
        </section>
        <AEOChecklistPanel brand={selected} />
      </>
    );
  }

  if (activeModule === "seo") {
    return (
      <>
        <DisciplineTable
          title="SEO comparison"
          description="Technical SEO and on-page public signals only. Rank/traffic data stays pending until a rank source is connected."
          rows={ranked}
          columns={[
            ["SEO score", (brand) => `${brand.auditScores.technicalSeo}/100`],
            ["Title chars", (brand) => brand.collected.homepage.signals.titleLength],
            ["Meta chars", (brand) => brand.collected.homepage.signals.descriptionLength],
            ["H1 count", (brand) => brand.collected.homepage.counts.h1],
            ["Canonical", (brand) => yesNo(brand.collected.homepage.signals.hasCanonical)],
            ["Sitemap", (brand) => brand.collected.sitemap.status],
            ["Internal links", (brand) => brand.collected.homepage.counts.internalLinks]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SignalPanel
            title={`${selected.name} SEO components`}
            description="On-page and crawlability evidence from public HTML."
            signals={[
              ["Technical SEO", selected.auditScores.technicalSeo],
              ["Homepage status", selected.collected.homepage.status],
              ["Robots status", selected.collected.robots.status],
              ["Sitemap URLs", selected.collected.sitemap.urlCount],
              ["Open Graph", yesNo(selected.collected.homepage.signals.hasOpenGraph)],
              ["Twitter Card", yesNo(selected.collected.homepage.signals.hasTwitterCard)]
            ]}
          />
          <PendingPanel
            title="External SEO data still pending"
            items={["Backlinks/referring domains", "SERP feature ownership", "Third-party rank tracking", "Competitor organic traffic estimates"]}
          />
        </section>
        <SearchConsolePanel brand={selected} ownedBrand={ownedBrand} />
      </>
    );
  }

  if (activeModule === "social") {
    return (
      <>
        <DisciplineTable
          title="Social public metrics"
          description={`Public social evidence collected where platforms allow it. Latest social collection: ${socialGeneratedAt}.`}
          rows={ranked}
          columns={[
            ["Profiles", (brand) => socialProfilesText(brand)],
            ["Reachable", (brand) => socialReachText(brand)],
            ["YouTube 30d", (brand) => youtubeCountText(brand, "youtubeVideos30d")],
            ["YouTube 90d", (brand) => youtubeCountText(brand, "youtubeVideos90d")],
            ["Last YouTube", (brand) => formatShortDate(brand.socialData?.summary?.lastYoutubeVideoAt)],
            ["Metric status", (brand) => brand.socialData?.summary?.status || "Needs collection"]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SocialEvidencePanel brand={selected} />
          <PendingPanel
            title="Restricted social metrics"
            description="These are not shown as numbers until connected through APIs, approved browser evidence, or platform exports."
            items={["Follower count", "Follower growth", "Engagement rate", "Creative format mix", "Paid vs organic activity", "Post-level comments/reactions"]}
          />
        </section>
        <SocialHandlesPanel brand={selected} />
      </>
    );
  }

  if (activeModule === "website") {
    return (
      <>
        <DisciplineTable
          title="Website performance and UX proxy"
          description="Public technical, accessibility, security, and UX signals. Lighthouse/CrUX can be added as the next collector."
          rows={ranked}
          columns={[
            ["Website score", (brand) => `${brand.auditScores.publicWebsite}/100`],
            ["Accessibility", (brand) => `${brand.auditScores.accessibilityProxy}/100`],
            ["Security", (brand) => `${brand.auditScores.securityPrivacy}/100`],
            ["Response", (brand) => `${brand.collected.homepage.responseMs}ms`],
            ["Images w/o alt", (brand) => brand.collected.homepage.counts.imagesWithoutAlt],
            ["HSTS", (brand) => yesNo(brand.collected.homepage.securityHeaders.strictTransportSecurity)]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SignalPanel
            title={`${selected.name} website components`}
            description="Public evidence proxies from the website-performance checklist."
            signals={[
              ["Public website", selected.auditScores.publicWebsite],
              ["Accessibility proxy", selected.auditScores.accessibilityProxy],
              ["Security/privacy", selected.auditScores.securityPrivacy],
              ["Lazy images", selected.collected.homepage.counts.lazyImages],
              ["Preconnect hints", selected.collected.homepage.counts.preconnectHints],
              ["Search UI", yesNo(selected.collected.homepage.signals.hasSearchUi)]
            ]}
          />
          <TechStackPanel brand={selected} />
        </section>
      </>
    );
  }

  if (activeModule === "campaigns") {
    return (
      <>
        <CampaignPanel events={events} />
        <MonitorTimeline
          events={events}
          eventTypes={["campaign_page", "category_or_product_page", "new_url_detected", "campaign_terms_detected", "homepage_content_changed", "social_post_detected", "ad_library_creative_detected"]}
        />
      </>
    );
  }

  return (
    <>
      <RankPanel ranked={ranked} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
      <section className="split-grid">
        <ScoreBreakdown brand={selected} activeModule={activeModule} />
        <CampaignPanel events={events} />
      </section>
      <MonitorTimeline events={events} />
    </>
  );
}

function RankPanel({ ranked, selectedBrand, setSelectedBrand }) {
  return (
    <section className="panel score-panel">
      <div className="panel-heading">
        <div>
          <h2>Competitive overview</h2>
          <p>Executive summary using the current public-evidence composite.</p>
        </div>
        <button className="icon-button" aria-label="Share rank view">
          <Share2 size={18} />
        </button>
      </div>
      <div className="rank-list">
        {ranked.map((brand, index) => (
          <button
            className={`rank-row ${brand.name === selectedBrand ? "selected" : ""}`}
            key={brand.name}
            onClick={() => setSelectedBrand(brand.name)}
          >
            <span className="rank-number">{index + 1}</span>
            <span className="brand-dot" style={{ background: brand.color }} />
            <span className="rank-name">
              <strong>{brand.name}</strong>
              <small>{brand.type}</small>
            </span>
            <span className="bar-track">
              <span className="bar-fill" style={{ width: `${brand.score}%`, background: brand.color }} />
            </span>
            <span className="rank-score">{brand.score}</span>
            <span className="signal">{brand.dataMode}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function AEOCommandCenter({ brand, competitors }) {
  const sections = getAeoSectionSummaries(brand);
  const critical = sections.filter((section) => section.score < 3).slice(0, 3);
  const leader = [...competitors].sort((a, b) => b.auditScores.aeoReadiness - a.auditScores.aeoReadiness)[0];
  return (
    <section className="panel aeo-command">
      <div className="panel-heading">
        <div>
          <h2>AEO command center</h2>
          <p>{brand.name} against the full answer-engine framework, using multi-page public evidence where available.</p>
        </div>
        <span className="monitor-count">Leader: {leader.name}</span>
      </div>
      <div className="aeo-score-grid">
        {sections.map((section) => (
          <article className="aeo-score-card" key={section.title}>
            <div>
              <strong>{section.title}</strong>
              <span>{section.status}</span>
            </div>
            <b>{section.score}/5</b>
          </article>
        ))}
      </div>
      <div className="split-grid aeo-actions-grid">
        <section className="sub-panel">
          <h3>Priority gaps</h3>
          {critical.length ? critical.map((section) => <p key={section.title}>{section.gap}</p>) : <p>No critical public-evidence gaps in collected AEO signals.</p>}
        </section>
        <section className="sub-panel">
          <h3>Next actions</h3>
          {sections.flatMap((section) => section.actions).slice(0, 5).map((action) => <p key={action}>{action}</p>)}
        </section>
      </div>
    </section>
  );
}

function getAeoSectionSummaries(brand) {
  const audit = brand.collected.pageAudit || {};
  const homepage = brand.collected.homepage;
  const schema = audit.schemaCoverage || {};
  const aiPolicy = brand.collected.robots.aiCrawlerPolicy || {};
  const aiVisibility = brand.aiVisibilityData || {};
  const aiReferral = brand.aiReferralData || {};
  const aiSummary = aiVisibility.summary || {};
  const referralSummary = aiReferral.summary || {};
  const hasAiVisibility = aiVisibility.status === "Live" && (aiSummary.promptRuns || 0) > 0;
  const hasAiReferral = aiReferral.status === "Live";
  const promptPending = {
    title: "AI answers",
    score: hasAiVisibility
      ? scoreToFive(
          (aiSummary.promptRuns || 0) > 0,
          (aiSummary.ownedMentionRate || 0) > 0,
          (aiSummary.citationShare || 0) > 0,
          (aiVisibility.providers || []).length > 1,
          (aiSummary.competitorMentionCount || 0) > 0
        )
      : 0,
    status: hasAiVisibility
      ? `${Math.round((aiSummary.ownedMentionRate || 0) * 100)}% mention rate · ${Math.round((aiSummary.citationShare || 0) * 100)}% citation share`
      : "Pending prompt data",
    gap: hasAiVisibility ? "AI answer prompt data is live; review missing citations." : "AI answer presence is not collected yet.",
    actions: hasAiVisibility
      ? ["Review missing citations and update pages that AI answers should cite."]
      : ["Connect the scheduled AEO prompt runner for ChatGPT, Perplexity, Gemini, Claude, Copilot, and Google AI Overviews."]
  };
  return [
    promptPending,
    {
      title: "Content extraction",
      score: scoreToFive((audit.totals?.answerFriendlyBlocks || 0) >= 12, (audit.totals?.questionHeadings || 0) >= 8, audit.pagesWithFaqText > 0, audit.pagesWithDirectAnswerIntro > 0, (audit.okPageCount || 0) >= 5),
      status: `${audit.totals?.answerFriendlyBlocks || 0} answer blocks across ${audit.okPageCount || 0} pages`,
      gap: "Some pages may still need tighter direct-answer summaries and FAQ blocks.",
      actions: ["Add short answer-first summaries and FAQ blocks to priority product/category pages."]
    },
    {
      title: "Schema",
      score: scoreToFive(schema.FAQPage, schema.Product, schema.Organization || homepage.signals.hasOrganizationSchema, schema.BreadcrumbList, schema.Article || schema.HowTo),
      status: `${audit.schemaTypes?.length || 0} schema types detected`,
      gap: "Schema coverage is incomplete across Product, Breadcrumb, Article, HowTo, and FAQ opportunities.",
      actions: ["Add Product and Breadcrumb schema to category/product pages; validate FAQ and Organization schema."]
    },
    {
      title: "E-E-A-T",
      score: scoreToFive(audit.pagesWithAuthorSignals > 0, audit.pagesWithFreshnessSignals > 0, audit.pagesWithTrustSignals > 0, audit.pagesWithResourceHubSignals > 0, audit.pagesWithComparisonTools > 0),
      status: `${audit.pagesWithTrustSignals || 0} pages with trust signals`,
      gap: "Author, freshness, original research, and citation signals are not consistent yet.",
      actions: ["Add last-updated dates, reviewer/editorial details, and primary-source citations to knowledge pages."]
    },
    {
      title: "AI crawlability",
      score: scoreToFive(aiPolicy.GPTBot, aiPolicy.ClaudeBot, aiPolicy.PerplexityBot, brand.collected.sitemap.ok, brand.collected.llms?.ok),
      status: brand.collected.llms?.ok ? "AI crawler basics plus llms.txt" : "AI crawler basics; llms.txt missing",
      gap: "llms.txt is missing or not publicly available.",
      actions: ["Publish /llms.txt with canonical brand, product, category, FAQ, and policy URLs."]
    },
    {
      title: "Topical authority",
      score: scoreToFive((audit.okPageCount || 0) >= 8, (audit.totals?.internalLinks || 0) >= 100, audit.pagesWithResourceHubSignals > 0, audit.pagesWithProductText > 2, homepage.signals.hasPhoneOrWhatsapp || homepage.signals.hasEmailLink),
      status: `${audit.okPageCount || 0} pages audited`,
      gap: "Off-site entity and branded SERP evidence still need collection.",
      actions: ["Build pillar-cluster views for PVC, CPVC, SWR, agri, fittings, and plumber education."]
    },
    {
      title: "Off-site citations",
      score: 0,
      status: "Pending off-site collectors",
      gap: "Wikipedia, Reddit, Quora, news, listicles, and YouTube transcript evidence are not connected yet.",
      actions: ["Add off-site citation collectors for SERPs, news, YouTube transcripts, Reddit, Quora, Wikipedia, and Wikidata."]
    },
    {
      title: "Measurement",
      score: scoreToFive(
        hasAiVisibility,
        hasAiReferral,
        (aiSummary.citationShare || 0) > 0,
        (referralSummary.sessions || 0) > 0,
        referralSummary.conversions != null
      ),
      status: hasAiReferral
        ? `${formatCompactNumber(referralSummary.sessions || 0)} AI referral sessions`
        : "Pending AEO measurement",
      gap: "Citation share, sentiment, and AI referral conversion data need live first-party sources.",
      actions: ["Store prompt results, citation URLs, mention order, sentiment, GA4 AI referral sessions, and conversion evidence monthly."]
    }
  ];
}

function scoreToFive(...checks) {
  return checks.filter(Boolean).length;
}

function DisciplineTable({ title, description, rows, columns, selectedBrand, setSelectedBrand }) {
  return (
    <section className="panel comparison-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <button className="text-button">
          <Download size={16} />
          Export CSV
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <span className="table-heading-help">
                  Brand
                  <HelpTip label="Brand" />
                </span>
              </th>
              {columns.map(([label]) => (
                <th key={label}>
                  <span className="table-heading-help">
                    {label}
                    <HelpTip label={label} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((brand) => (
              <tr
                key={brand.name}
                className={brand.name === selectedBrand ? "selected-row" : ""}
                onClick={() => setSelectedBrand(brand.name)}
              >
                <td>
                  <span className="table-brand">
                    <span className="brand-dot" style={{ background: brand.color }} />
                    {brand.name}
                  </span>
                </td>
                {columns.map(([label, getter]) => (
                  <td key={label}>{getter(brand)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SignalPanel({ title, description, signals }) {
  return (
    <section className="panel breakdown-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="audit-signal-grid">
        {signals.map(([label, value]) => (
          <div className="audit-signal" key={label}>
            <span className="label-with-help">
              {label}
              <HelpTip label={label} />
            </span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function HelpTip({ label, text }) {
  const copy = text || metricHelp[label];
  const [position, setPosition] = useState(null);
  if (!copy) return null;
  const show = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    const left = Math.min(Math.max(16, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 16);
    const top = Math.max(16, rect.top - 12);
    setPosition({ left, top, width });
  };
  return (
    <>
      <span
        className="help-tip"
        tabIndex="0"
        aria-label={copy}
        onMouseEnter={show}
        onFocus={show}
        onMouseLeave={() => setPosition(null)}
        onBlur={() => setPosition(null)}
      >
        i
      </span>
      {position
        ? createPortal(
            <div
              className="tooltip-portal"
              style={{
                left: position.left,
                top: position.top,
                width: position.width
              }}
            >
              {copy}
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function PendingPanel({ title, description = "These need platform APIs, exports, browser evidence, or approved tools.", items }) {
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="pending-list">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function SchemaPanel({ brand }) {
  const types = brand.collected.homepage.schemaTypes || [];
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>Schema coverage</h2>
          <p>Schema types detected on the selected homepage.</p>
        </div>
      </div>
      <div className="pending-list">
        {types.length ? types.map((type) => <span key={type}>{type}</span>) : <span>No schema detected</span>}
      </div>
    </section>
  );
}

function SearchConsolePanel({ brand, ownedBrand }) {
  const data = brand.searchConsoleData;
  const summary = data?.summary || {};
  const isOwnedFocus = brand.name === ownedBrand?.name;
  const live = data?.status === "Live";
  return (
    <section className="panel measurement-panel">
      <div className="panel-heading">
        <div>
          <h2>Google Search Console</h2>
          <p>
            {isOwnedFocus
              ? "First-party keyword and page performance for the Astral-owned property."
              : `First-party GSC data belongs to ${ownedBrand?.name}; competitor keyword data is not available from Astral Search Console.`}
          </p>
        </div>
        <span className={`monitor-count ${live ? "" : "setup"}`}>{data?.status || "Setup Required"}</span>
      </div>
      {!live ? (
        <div className="setup-measurement">
          <strong>Setup Required</strong>
          <p>{data?.reason || "Connect the Astral-owned Search Console property with service-account access."}</p>
          <span>{data?.evidence?.method || "No GSC evidence collected yet."}</span>
        </div>
      ) : (
        <>
          <div className="measurement-metrics">
            <MetricMini label="GSC clicks" value={formatCompactNumber(summary.clicks)} />
            <MetricMini label="GSC impressions" value={formatCompactNumber(summary.impressions)} />
            <MetricMini label="Average position" value={summary.averagePosition ? summary.averagePosition.toFixed(1) : "--"} />
            <MetricMini label="CTR" value={formatPercent(summary.ctr)} />
          </div>
          <div className="measurement-grid">
            <MeasurementList title="Top queries" rows={(data.topQueries || []).slice(0, 8)} primaryKey="query" />
            <MeasurementList title="Top pages" rows={(data.topPages || []).slice(0, 8)} primaryKey="page" />
            <MeasurementList title="Brand vs non-brand" rows={data.brandVsNonBrand || []} primaryKey="segment" />
            <MeasurementList title="Position buckets" rows={data.positionBuckets || []} primaryKey="bucket" />
          </div>
          {(data.ctrIssues || []).length ? (
            <MeasurementList title="CTR issues" rows={data.ctrIssues.slice(0, 8)} primaryKey="query" />
          ) : null}
        </>
      )}
    </section>
  );
}

function AIReferralPanel({ brand, compact = false }) {
  const data = brand.aiReferralData;
  const summary = data?.summary || {};
  const live = data?.status === "Live";
  return (
    <section className={`panel measurement-panel ${compact ? "compact-measurement" : ""}`}>
      <div className="panel-heading">
        <div>
          <h2>AI referral traffic</h2>
          <p>GA4 sessions from known AI referrers. This is traffic evidence, not AI-platform impressions.</p>
        </div>
        <span className={`monitor-count ${live ? "" : "setup"}`}>{data?.status || "Setup Required"}</span>
      </div>
      {!live ? (
        <div className="setup-measurement">
          <strong>Setup Required</strong>
          <p>{data?.reason || "Connect GA4 property access for this Astral-owned brand."}</p>
          <span>{data?.evidence?.method || "No GA4 evidence collected yet."}</span>
        </div>
      ) : (
        <>
          <div className="measurement-metrics">
            <MetricMini label="AI referral sessions" value={formatCompactNumber(summary.sessions)} />
            <MetricMini label="Users" value={formatCompactNumber(summary.totalUsers)} />
            <MetricMini label="Events" value={formatCompactNumber(summary.eventCount)} />
            <MetricMini label="Top source" value={summary.topSource || "--"} />
          </div>
          {!compact ? (
            <div className="measurement-grid">
              <MeasurementList title="AI sources" rows={data.sources || []} primaryKey="source" />
              <MeasurementList title="Landing pages" rows={data.landingPages || []} primaryKey="landingPage" />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function AIVisibilityPanel({ brand, compact = false }) {
  const data = brand.aiVisibilityData;
  const summary = data?.summary || {};
  const live = data?.status === "Live";
  return (
    <section className={`panel measurement-panel ${compact ? "compact-measurement" : ""}`}>
      <div className="panel-heading">
        <div>
          <h2>AI visibility</h2>
          <p>Prompt-bank monitoring for mentions, competitor mentions, citations, and sentiment proxy.</p>
        </div>
        <span className={`monitor-count ${live ? "" : "setup"}`}>{data?.status || "Setup Required"}</span>
      </div>
      {!live ? (
        <div className="setup-measurement">
          <strong>Setup Required</strong>
          <p>{data?.reason || "Connect an approved AI provider key and enable prompt monitoring."}</p>
          <span>{data?.promptCount || 0} prompts ready · No impressions invented</span>
        </div>
      ) : (
        <>
          <div className="measurement-metrics">
            <MetricMini label="AI visibility" value={formatPercent(summary.ownedMentionRate)} />
            <MetricMini label="Citation share" value={formatPercent(summary.citationShare)} />
            <MetricMini label="Prompt runs" value={formatCompactNumber(summary.promptRuns)} />
            <MetricMini label="Providers" value={(data.providers || []).join(", ") || "--"} />
          </div>
          {!compact ? (
            <div className="measurement-grid">
              <MeasurementList title="Prompt results" rows={(data.promptResults || []).slice(0, 8)} primaryKey="promptId" />
              <MeasurementList title="Missing citations" rows={(data.missingCitations || []).slice(0, 8)} primaryKey="promptId" />
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function MetricMini({ label, value }) {
  return (
    <div className="metric-mini">
      <span>{label}</span>
      <strong>{value ?? "--"}</strong>
      <InfoTooltip label={label} />
    </div>
  );
}

function InfoTooltip({ label }) {
  return (
    <span className="info-tooltip" tabIndex="0" aria-label={metricHelp[label] || label}>
      i
      <span role="tooltip">{metricHelp[label] || "Evidence-backed metric detail."}</span>
    </span>
  );
}

function MeasurementList({ title, rows, primaryKey }) {
  return (
    <article className="measurement-list">
      <h3>{title}</h3>
      {rows?.length ? (
        rows.map((row, index) => {
          const primary = row.dimensions?.[primaryKey] || row[primaryKey] || row.prompt || row.reason || "Item";
          return (
            <div className="measurement-row" key={`${title}-${primary}-${index}`}>
              <strong>{primary}</strong>
              <span>
                {row.clicks != null ? `${formatCompactNumber(row.clicks)} clicks` : null}
                {row.impressions != null ? ` · ${formatCompactNumber(row.impressions)} impressions` : null}
                {row.sessions != null ? `${formatCompactNumber(row.sessions)} sessions` : null}
                {row.ownedMentioned != null ? (row.ownedMentioned ? "Mentioned" : "Not mentioned") : null}
                {row.reason ? row.reason : null}
              </span>
            </div>
          );
        })
      ) : (
        <div className="measurement-row empty">
          <strong>No evidence yet</strong>
          <span>This table fills only after the collector returns factual data.</span>
        </div>
      )}
    </article>
  );
}

function formatCompactNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value));
}

function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return "--";
  return `${Math.round(Number(value) * 100)}%`;
}

function AEOChecklistPanel({ brand }) {
  const [activeItem, setActiveItem] = useState(null);
  return (
    <section className="panel checklist-panel">
      <div className="panel-heading">
        <div>
          <h2>Complete AEO checklist</h2>
          <p>{brand.name} mapped against the full framework. Collected items use public evidence; pending items need dedicated collectors or first-party access.</p>
        </div>
      </div>
      <div className="status-legend" aria-label="AEO checklist status legend">
        <span><span className="status-dot passed" /> Green dot = Evidence Found</span>
        <span><span className="status-dot missing" /> Amber = No Evidence Found</span>
        <span><span className="status-dot pending" /> Grey = Need Collector</span>
      </div>
      <div className="checklist-sections">
        {aeoChecklistSections.map((section) => (
          <article className="checklist-section" key={section.title}>
            <h3>{section.title}</h3>
            <div className="checklist-items">
              {section.items.map(([label, key, note]) => {
                const result = resolveAeoChecklistItem(brand, key, note);
                return (
                  <button
                    className="checklist-item"
                    key={label}
                    onClick={() => setActiveItem({ section: section.title, label, result })}
                    type="button"
                  >
                    <span className={`status-dot ${result.status}`} />
                    <div>
                      <strong>{label}</strong>
                      <small>{result.label}</small>
                    </div>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      {activeItem ? (
        <AEOChecklistDetailModal
          brand={brand}
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      ) : null}
    </section>
  );
}

function AEOChecklistDetailModal({ brand, item, onClose }) {
  const status = getAeoStatusMeta(item.result.status);
  return createPortal(
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aeo-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close detail window">×</button>
        <p className="section-label">{item.section}</p>
        <h2 id="aeo-detail-title">{item.label}</h2>
        <div className="detail-status-row">
          <span className={`status-dot ${item.result.status}`} />
          <strong>{status.label}</strong>
        </div>
        <dl className="detail-list">
          <div>
            <dt>Brand</dt>
            <dd>{brand.name}</dd>
          </div>
          <div>
            <dt>Meaning</dt>
            <dd>{status.meaning}</dd>
          </div>
          <div>
            <dt>Current Detail</dt>
            <dd>{item.result.label}</dd>
          </div>
          <div>
            <dt>Evidence Basis</dt>
            <dd>{status.evidenceBasis}</dd>
          </div>
        </dl>
      </section>
    </div>,
    document.body
  );
}

function getAeoStatusMeta(status) {
  if (status === "passed") {
    return {
      label: "Green dot = Evidence Found",
      meaning: "The collector found public evidence that supports this checklist item.",
      evidenceBasis: "Public website crawl, robots.txt, sitemap, schema, or audited page signals."
    };
  }
  if (status === "missing") {
    return {
      label: "Amber = No Evidence Found",
      meaning: "The collector checked this item but did not find evidence in the currently collected public data.",
      evidenceBasis: "Public evidence was checked; the signal was not detected."
    };
  }
  return {
    label: "Grey = Need Collector",
    meaning: "This item cannot be honestly marked pass or fail until a dedicated collector, prompt runner, API, export, or first-party source is connected.",
    evidenceBasis: "Not collected by the current public website collector."
  };
}

function resolveAeoChecklistItem(brand, key, note) {
  const signals = brand.collected.homepage.signals;
  const counts = brand.collected.homepage.counts;
  const audit = brand.collected.pageAudit || {};
  const robots = brand.collected.robots;
  const llms = brand.collected.llms;
  const aiPolicy = robots.aiCrawlerPolicy || {};
  const answerBlocks = brand.collected.homepage.contentStructure.answerFriendlyBlocks;
  const schemaTypes = brand.collected.homepage.schemaTypes || [];
  const aiVisibility = brand.aiVisibilityData || {};
  const aiReferral = brand.aiReferralData || {};
  const aiSummary = aiVisibility.summary || {};
  const referralSummary = aiReferral.summary || {};
  const aiLive = aiVisibility.status === "Live" && (aiSummary.promptRuns || 0) > 0;
  const aiProviders = aiVisibility.providers || [];
  const aiPromptCount = aiVisibility.promptCount || 0;
  const map = {
    directAnswer: [signals.hasDirectAnswerIntro, "Public HTML intro checked"],
    questionHeadings: [(audit.totals?.questionHeadings || counts.questionHeadings) > 0, `${audit.totals?.questionHeadings || counts.questionHeadings} question headings`],
    faqText: [(audit.pagesWithFaqText || 0) > 0 || signals.hasFaqText, `${audit.pagesWithFaqText || 0} audited pages with FAQ text`],
    answerBlocks: [(audit.totals?.answerFriendlyBlocks || answerBlocks) > 0, `${audit.totals?.answerFriendlyBlocks || answerBlocks} answer-friendly blocks`],
    faqSchema: [audit.schemaCoverage?.FAQPage || signals.hasFaqSchema, "FAQPage schema"],
    howToSchema: [audit.schemaCoverage?.HowTo || signals.hasHowToSchema, "HowTo schema"],
    articleSchema: [audit.schemaCoverage?.Article || signals.hasArticleSchema, "Article schema"],
    productSchema: [audit.schemaCoverage?.Product || signals.hasProductSchema, "Product schema"],
    organizationSchema: [audit.schemaCoverage?.Organization || signals.hasOrganizationSchema, "Organization schema"],
    breadcrumbSchema: [audit.schemaCoverage?.BreadcrumbList || signals.hasBreadcrumbSchema, "Breadcrumb schema"],
    localBusinessSchema: [audit.schemaCoverage?.LocalBusiness || schemaTypes.some((type) => /LocalBusiness/i.test(type)), "LocalBusiness schema"],
    authorSignals: [(audit.pagesWithAuthorSignals || 0) > 0 || signals.hasAuthorSignals, `${audit.pagesWithAuthorSignals || 0} audited pages with author/editorial proxy`],
    freshnessSignals: [(audit.pagesWithFreshnessSignals || 0) > 0 || signals.hasFreshnessSignals, `${audit.pagesWithFreshnessSignals || 0} audited pages with freshness proxy`],
    trustSignals: [(audit.pagesWithTrustSignals || 0) > 0 || signals.hasTrustSignals, `${audit.pagesWithTrustSignals || 0} audited pages with trust proxy`],
    gptbot: [aiPolicy.GPTBot, "robots.txt policy"],
    claudebot: [aiPolicy.ClaudeBot, "robots.txt policy"],
    perplexitybot: [aiPolicy.PerplexityBot, "robots.txt policy"],
    googleextended: [aiPolicy.GoogleExtended, "robots.txt policy"],
    otherAiBots: [aiPolicy.CCBot && aiPolicy.Bytespider && aiPolicy.ApplebotExtended, "robots.txt policy"],
    aiBots: [robots.allowsKnownAiBots, "Known AI bots not blocked"],
    wordCount: [(audit.totals?.wordCount || counts.wordCount) > 300, `${audit.totals?.wordCount || counts.wordCount} visible words`],
    llms: [llms?.ok, llms?.ok ? "llms.txt present" : "Not detected"],
    sitemap: [brand.collected.sitemap.ok, `Sitemap status ${brand.collected.sitemap.status}`],
    response: [brand.collected.homepage.responseMs < 800, `${brand.collected.homepage.responseMs}ms response`],
    homepageReachable: [brand.collected.homepage.ok, `Homepage status ${brand.collected.homepage.status}`],
    resourceHub: [(audit.pagesWithResourceHubSignals || 0) > 0 || signals.hasResourceHub, `${audit.pagesWithResourceHubSignals || 0} audited pages with resource signal`],
    internalLinks: [(audit.totals?.internalLinks || counts.internalLinks) >= 20, `${audit.totals?.internalLinks || counts.internalLinks} internal links`],
    contactSignals: [signals.hasPhoneOrWhatsapp || signals.hasEmailLink, "Contact/NAP proxy"],
    aiBrandMention: [aiLive && (aiSummary.ownedMentionRate || 0) > 0, aiLive ? `${formatPercent(aiSummary.ownedMentionRate)} mention rate` : "Need prompt runner"],
    aiPerplexityCitation: [
      aiLive && aiProviders.includes("Perplexity") && (aiSummary.citationShare || 0) > 0,
      aiProviders.includes("Perplexity") ? `${formatPercent(aiSummary.citationShare)} citation share` : "Need Perplexity capture"
    ],
    aiOpenAiMention: [
      aiLive && aiProviders.includes("OpenAI") && (aiSummary.ownedMentionRate || 0) > 0,
      aiProviders.includes("OpenAI") ? `${formatPercent(aiSummary.ownedMentionRate)} mention rate` : "Need OpenAI/browser capture"
    ],
    aiMultiEngine: [aiLive && aiProviders.length >= 2, `${aiProviders.length} provider(s) captured`],
    aiShareOfVoice: [aiLive && aiSummary.ownedMentionRate != null, aiLive ? `${formatPercent(aiSummary.ownedMentionRate)} owned mention rate` : "Need fixed query set"],
    aiSentiment: [aiLive && Boolean(aiSummary.sentimentProxy), aiSummary.sentimentProxy || "Need answer classification"],
    aiPromptBank: [aiPromptCount > 0, `${aiPromptCount} approved prompts ready`],
    aiVisibilityTracking: [aiLive, aiLive ? `${aiSummary.promptRuns} prompt runs collected` : "Need AI visibility collector"],
    aiPromptRunner: [aiLive, aiLive ? `${aiSummary.promptRuns} prompt runs collected` : `${aiPromptCount} prompts ready; not run`],
    aiCitationShare: [aiLive && aiSummary.citationShare != null, aiLive ? `${formatPercent(aiSummary.citationShare)} citation share` : "Need AEO results table"],
    aiReferralTraffic: [aiReferral.status === "Live", aiReferral.status === "Live" ? `${formatCompactNumber(referralSummary.sessions || 0)} AI referral sessions` : "Need GA4 collector"],
    aiReferralConversion: [
      aiReferral.status === "Live" && referralSummary.conversions != null,
      referralSummary.conversions != null ? `${formatCompactNumber(referralSummary.conversions)} conversions` : "Need GA4 conversion/key-event mapping"
    ]
  };
  if (key === "pending") return { status: "pending", label: note || "Pending collector" };
  const [passed, label] = map[key] || [false, "Not collected"];
  return { status: passed ? "passed" : "missing", label: passed ? label : "Not detected" };
}

function SocialHandlesPanel({ brand }) {
  const profiles = brand.socialData?.profiles || [];
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>{brand.name} handles</h2>
          <p>Registry URLs tracked for platform monitoring, with public reachability from the latest collector.</p>
        </div>
      </div>
      <div className="handle-list">
        {brand.collected.social.map((item) => (
          <a href={item.url} target="_blank" rel="noreferrer" key={item.platform}>
            <strong>{item.platform}</strong>
            <span>{profiles.find((profile) => profile.platform === item.platform)?.collectionStatus || item.status}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function SocialEvidencePanel({ brand }) {
  const summary = brand.socialData?.summary;
  const youtube = brand.socialData?.profiles?.find((profile) => profile.platform === "youtube")?.youtube;
  const latestVideos = youtube?.latestVideos || [];
  return (
    <section className="panel social-evidence-panel">
      <div className="panel-heading">
        <div>
          <h2>{brand.name} social evidence</h2>
          <p>Real public signals currently collected. Restricted metrics remain clearly marked instead of estimated.</p>
        </div>
      </div>
      <div className="social-metric-grid">
        <article>
          <span>Profiles tracked</span>
          <strong>{summary?.profilesTracked ?? brand.collected.social.length}</strong>
        </article>
        <article>
          <span>Reachable profiles</span>
          <strong>{summary ? `${summary.reachableProfiles}/${summary.profilesTracked}` : "Not collected"}</strong>
        </article>
        <article>
          <span>YouTube cadence</span>
          <strong>{summary?.youtubeVideos30d != null ? `${summary.youtubeVideos30d} / 30d` : "No public feed"}</strong>
        </article>
        <article>
          <span>Last YouTube post</span>
          <strong>{formatShortDate(summary?.lastYoutubeVideoAt)}</strong>
        </article>
        <article>
          <span>YouTube subscribers</span>
          <strong>{summary?.youtubeSubscriberCount != null ? formatNumber(summary.youtubeSubscriberCount) : "API restricted"}</strong>
        </article>
        <article>
          <span>X followers</span>
          <strong>{summary?.xFollowerCount != null ? formatNumber(summary.xFollowerCount) : "API restricted"}</strong>
        </article>
      </div>
      <div className="latest-video-list">
        <h3>Latest public YouTube evidence</h3>
        {latestVideos.length ? latestVideos.map((video) => (
          <a href={video.link} target="_blank" rel="noreferrer" key={video.videoId || video.link}>
            <span>{formatShortDate(video.published)}</span>
            <strong>{video.title}</strong>
          </a>
        )) : (
          <p>No public YouTube RSS entries collected for this brand.</p>
        )}
      </div>
    </section>
  );
}

function TechStackPanel({ brand }) {
  const stack = brand.collected.homepage.techStack || {};
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>Visible tech stack</h2>
          <p>Public HTML indicators for analytics, CMS, and frontend tooling.</p>
        </div>
      </div>
      <div className="pending-list">
        {Object.entries(stack).map(([key, value]) => (
          <span key={key} className={value ? "available" : ""}>
            {key}: {yesNo(value)}
          </span>
        ))}
      </div>
    </section>
  );
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function statusLabel(value) {
  return value ? "Present" : "Missing";
}

function platformStatus(brand, platform) {
  return brand.collected.social.some((item) => item.platform === platform) ? "Tracked" : "Missing";
}

function socialProfilesText(brand) {
  const tracked = brand.socialData?.summary?.profilesTracked ?? brand.collected.social.length;
  return `${tracked} tracked`;
}

function socialReachText(brand) {
  const summary = brand.socialData?.summary;
  if (!summary) return "Needs collection";
  return `${summary.reachableProfiles}/${summary.profilesTracked}`;
}

function youtubeCountText(brand, key) {
  const value = brand.socialData?.summary?.[key];
  return value == null ? "No public feed" : value;
}

function formatShortDate(value) {
  if (!value) return "Not collected";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function ScoreBreakdown({ brand, activeModule }) {
  const categories = [
    ["AEO", brand.aeo, 15],
    ["SEO", brand.seo, 20],
    ["Social", brand.social, 20],
    ["Website", brand.performance, 15],
    ["Campaigns", brand.campaigns, 10],
    ["Content", brand.content, 10],
    ["Reputation", brand.reputation, 5],
    ["Verified data", brand.verified, 5]
  ];
  const auditRows = brand.auditScores
    ? [
        ["Public website", brand.auditScores.publicWebsite],
        ["Technical SEO", brand.auditScores.technicalSeo],
        ["AEO readiness", brand.auditScores.aeoReadiness],
        ["Content extraction", brand.auditScores.contentExtraction],
        ["Accessibility proxy", brand.auditScores.accessibilityProxy],
        ["Security/privacy", brand.auditScores.securityPrivacy],
        ["Registry completeness", brand.auditScores.registryCompleteness]
      ]
    : [];
  return (
    <section className="panel breakdown-panel">
      <div className="panel-heading">
        <div>
          <h2>{moduleLabels[activeModule]} score anatomy</h2>
          <p>{brand.name} against the expanded public-evidence rubric.</p>
        </div>
      </div>
      <div className="breakdown-list">
        {categories.map(([name, value, max]) => (
          <div className="breakdown-row" key={name}>
            <span>{name}</span>
            <div className="thin-track">
              <span style={{ width: value === null ? "0%" : `${(value / max) * 100}%` }} />
            </div>
            <strong>
              {value === null ? "Pending" : `${value}/${max}`}
            </strong>
          </div>
        ))}
      </div>
      {auditRows.length > 0 ? (
        <div className="audit-signal-grid">
          {auditRows.map(([label, value]) => (
            <div className="audit-signal" key={label}>
              <span className="label-with-help">
                {label}
                <HelpTip label={label} />
              </span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CampaignPanel({ events = [] }) {
  const scopedCampaigns = events
    .filter((event) =>
      ["campaign_page", "category_or_product_page", "new_url_detected", "campaign_terms_detected", "social_post_detected", "ad_library_creative_detected"].includes(event.type)
    )
    .slice(0, 5)
    .map((event) => ({
      brand: event.brand,
      name: event.title,
      channel: event.type === "social_post_detected" ? "YouTube RSS" : event.type === "ad_library_creative_detected" ? "Meta Ad Library" : "Public monitor",
      impact: event.severity
    }));
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>Campaign signal watch</h2>
          <p>
            Evidence-backed indicators from sitemap changes, new URLs, homepage copy, schema shifts, and campaign-like terms.
            A signal is not treated as a confirmed paid campaign unless ad-library or platform evidence is attached.
          </p>
        </div>
        <AlertTriangle size={18} />
      </div>
      <div className="campaign-list">
        {scopedCampaigns.map((campaign) => (
          <article key={`${campaign.brand}-${campaign.name}`}>
            <div>
              <strong>{campaign.name}</strong>
              <span>{campaign.brand} · {campaign.channel}</span>
            </div>
            <span className={`impact ${campaign.impact.toLowerCase()}`}>{campaign.impact}</span>
          </article>
        ))}
        {scopedCampaigns.length === 0 ? (
          <article className="campaign-empty">
            <div>
              <strong>No confirmed campaign-change events yet</strong>
              <span>
                The monitor is watching for new campaign pages, launch/offer/contest language, category or product page additions,
                sitemap movement, homepage copy shifts, and schema changes.
              </span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function MonitorTimeline({ events = [], eventTypes = null }) {
  const scopedEvents = eventTypes ? events.filter((event) => eventTypes.includes(event.type)) : events;
  const visibleEvents = scopedEvents.slice(0, 8);
  const scopedNewCount = scopedEvents.filter((event) => event.firstSeenAt && Date.now() - new Date(event.firstSeenAt).getTime() < 24 * 60 * 60 * 1000).length;
  return (
    <section className="panel monitor-panel">
      <div className="panel-heading">
        <div>
          <h2>Evidence timeline</h2>
          <p>Verified public changes, newest first.</p>
        </div>
        <div className="timeline-summary">
          <span>{scopedEvents.length} events</span>
          <span>{scopedNewCount} new</span>
        </div>
      </div>
      <div className="timeline-list">
        {visibleEvents.map((event) => (
          <details className={`timeline-item severity-${event.severity.toLowerCase()}`} key={event.id}>
            <summary>
              <span className="timeline-severity">{event.severity}</span>
              <span className="timeline-summary-copy">
                <strong>{event.title}</strong>
                <small>{event.brand} · {formatEventType(event.type)}</small>
              </span>
              <time>{formatEventTime(event.firstSeenAt)}</time>
              <span className="timeline-chevron">⌄</span>
            </summary>
            <div className="timeline-content">
              <p>{event.detail}</p>
              <div className="evidence-grid">
                <div>
                  <span>Confidence</span>
                  <strong>{event.confidence}</strong>
                </div>
                <div>
                  <span>First seen</span>
                  <strong>{formatEventTime(event.firstSeenAt)}</strong>
                </div>
                <div>
                  <span>Source</span>
                  <a href={event.sourceUrl} target="_blank" rel="noreferrer">Open evidence</a>
                </div>
              </div>
            </div>
          </details>
        ))}
        {scopedEvents.length === 0 ? (
          <article className="timeline-empty">
            <strong>No changes captured yet</strong>
            <p>Run the monitor once to create a baseline. Every later run compares against it and creates evidence-backed alerts.</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function formatEventTime(value) {
  if (!value) return "Not timestamped";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
}

function formatEventType(value = "") {
  return value.replaceAll("_", " ");
}

createRoot(document.getElementById("root")).render(<App />);
