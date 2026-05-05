import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  Download,
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
import snapshot from "../data/generated/competitive-snapshot.json";
import monitorEvents from "../data/generated/monitor-events.json";
import "./styles.css";

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

function toDashboardBrand(brand) {
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
  return {
    name: brand.name,
    type: brand.type,
    priority: brand.priority,
    website: brand.website?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    score: composite,
    previous: composite,
    aeo: Math.round((aeoReadiness / 100) * 15),
    seo: Math.round((technicalSeo / 100) * 20),
    social: null,
    performance: Math.round((publicWebsite / 100) * 15),
    campaigns: null,
    content: Math.round((contentExtraction / 100) * 10),
    reputation: null,
    verified: Math.round((registryCompleteness / 100) * 5),
    followers: "Restricted",
    engagement: "Restricted",
    frequency: "Needs capture",
    momentum: 0,
    threat: brand.name === "Astral Pipes" ? "Reference" : "Watch",
    color: brandColors[brand.name] || "#6b7280",
    collected: brand,
    auditScores: {
      publicWebsite,
      aeoReadiness,
      technicalSeo,
      contentExtraction,
      accessibilityProxy,
      securityPrivacy,
      registryCompleteness
    },
    dataMode: "Collected"
  };
}

const brands = snapshot?.brands?.length ? snapshot.brands.map(toDashboardBrand) : seedBrands;

const generatedAt = snapshot?.generatedAt
  ? new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata"
    }).format(new Date(snapshot.generatedAt))
  : "Not collected";

const alerts = (monitorEvents.events || []).slice(0, 5).map((event) => ({
  level: event.severity,
  title: event.title,
  detail: event.detail,
  time: event.firstSeenAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
      }).format(new Date(event.firstSeenAt))
    : "Not run",
  sourceUrl: event.sourceUrl,
  brand: event.brand,
  confidence: event.confidence
}));

const recommendations = [
  "Run the approved AEO prompt bank and attach cited answer evidence.",
  "Import SEO keyword ranks for the fixed pipe-category query bank.",
  "Capture social follower, post, and engagement metrics with source screenshots.",
  "Run Lighthouse on homepage, category, dealer locator, contact, and campaign pages."
];

const campaigns = (monitorEvents.events || [])
  .filter((event) =>
    ["campaign_page", "category_or_product_page", "new_url_detected", "campaign_terms_detected"].includes(event.type)
  )
  .slice(0, 5)
  .map((event) => ({
    brand: event.brand,
    name: event.title,
    channel: "Public monitor",
    status: event.type === "baseline_created" ? "Baseline" : "Detected",
    impact: event.severity
  }));

const fallbackCampaigns = snapshot.brands.slice(0, 5).map((brand) => ({
  brand: brand.name,
  name: brand.homepage?.signals?.hasDealerText ? "Dealer signal detected" : "Website evidence captured",
  channel: "Official website",
  status: brand.homepage?.ok ? "Collected" : "Failed",
  impact: brand.homepage?.signals?.hasDealerText ? "Medium" : "Low"
}));

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
      ["Brand is named in top category-defining AI answers", "pending", "Needs scheduled AI prompt testing"],
      ["Brand cited with source link in Perplexity", "pending", "Needs Perplexity capture"],
      ["Brand appears in Google AI Overviews / AI Mode", "pending", "Needs SERP/AI Overview capture"],
      ["Brand mentioned in ChatGPT search results", "pending", "Needs browser-enabled prompt capture"],
      ["Brand surfaces in Gemini, Copilot, and Claude", "pending", "Needs multi-engine prompt run"],
      ["AI answer share of voice vs competitors", "pending", "Needs fixed query set"],
      ["Sentiment of AI mentions", "pending", "Needs answer text classification"],
      ["Unprompted brand mention frequency", "pending", "Needs category prompt bank"]
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
      ["AEO tracking tool connected", "pending", "Needs Profound/Otterly/Peec/etc."],
      ["Defined query set tested monthly", "pending", "Needs prompt runner"],
      ["Citation count and share-of-voice tracked", "pending", "Needs AEO results table"],
      ["AI referral traffic isolated in GA4", "pending", "First-party only"],
      ["AI referral conversion rate tracked", "pending", "First-party only"]
    ]
  }
];

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState("overview");
  const [selectedBrand, setSelectedBrand] = useState("Astral Pipes");
  const [range, setRange] = useState("Last 90 days");
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return brands;
    return brands.filter((brand) =>
      [brand.name, brand.type, brand.website, brand.threat].some((field) =>
        field.toLowerCase().includes(value)
      )
    );
  }, [query]);

  const selected = brands.find((brand) => brand.name === selectedBrand) || brands[0];
  const ranked = [...filteredBrands].sort((a, b) => b.score - a.score);
  const leader = [...brands].sort((a, b) => b.score - a.score)[0];
  const average = Math.round(brands.reduce((sum, brand) => sum + brand.score, 0) / brands.length);
  const dataGaps = snapshot.brands.reduce(
    (sum, brand) => sum + (brand.unavailableMetrics?.length || 0),
    0
  );
  const eventCount = monitorEvents.events?.length || 0;
  const latestMonitorRun = monitorEvents.generatedAt
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata"
      }).format(new Date(monitorEvents.generatedAt))
    : "Not run yet";
  const isOverview = activeModule === "overview";
  const header = moduleHeaders[activeModule] || moduleHeaders.overview;

  return (
    <main className="app-shell">
      <Sidebar collapsed={collapsed} activeModule={activeModule} onModule={setActiveModule} />

      <section className="workspace">
        <TopBar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          query={query}
          setQuery={setQuery}
          range={range}
          setRange={setRange}
        />

        <div className={`content-grid ${isOverview ? "" : "full-width"}`}>
          <section className="main-column">
            <header className="page-header">
              <div>
                <p className="section-label">{header.label}</p>
                <h1>{header.title}</h1>
                <p className="header-copy">{header.copy}</p>
              </div>
              <div className="brand-select">
                <span>Focus brand</span>
                <select value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
                  {brands.map((brand) => (
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
                    delta={`${brands.length} tracked brands`}
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
                      Latest collection: {generatedAt}. {dataGaps} restricted metrics remain pending
                      until APIs, exports, or browser evidence are connected.
                    </span>
                  </div>
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
                <span>Social pending</span>
              </div>
            </section>

            <section className="panel alert-panel">
              <div className="panel-heading compact">
                <h2>Alerts</h2>
                <Bell size={17} />
              </div>
              <div className="alert-list">
                {alerts.map((alert) => (
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
                {alerts.length === 0 ? (
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

function Sidebar({ collapsed, activeModule, onModule }) {
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
        <div className="logo-mark">A</div>
        <div>
          <strong>CompareUS</strong>
          <span>Pipe intelligence</span>
        </div>
      </div>
      <nav aria-label="Dashboard navigation">
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

function TopBar({ collapsed, setCollapsed, query, setQuery, range, setRange }) {
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
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This quarter</option>
            <option>Custom study</option>
          </select>
          <ChevronDown size={15} />
        </label>
        <button className="text-button">
          <Download size={16} />
          Report
        </button>
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

function ModuleWorkspace({ activeModule, ranked, selectedBrand, setSelectedBrand, selected }) {
  if (activeModule === "aeo") {
    return (
      <>
        <AEOCommandCenter brand={selected} competitors={ranked} />
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
            title="SEO data still pending"
            items={["Keyword rank distribution", "Non-brand query share", "Backlinks/referring domains", "SERP feature ownership", "Organic traffic estimates"]}
          />
        </section>
      </>
    );
  }

  if (activeModule === "social") {
    return (
      <>
        <DisciplineTable
          title="Social footprint"
          description="Confirmed handle registry and platform coverage. Engagement metrics are not guessed."
          rows={ranked}
          columns={[
            ["Platforms", (brand) => brand.collected.social.length],
            ["Facebook", (brand) => platformStatus(brand, "facebook")],
            ["Instagram", (brand) => platformStatus(brand, "instagram")],
            ["YouTube", (brand) => platformStatus(brand, "youtube")],
            ["LinkedIn", (brand) => platformStatus(brand, "linkedin")],
            ["X", (brand) => platformStatus(brand, "x")]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SocialHandlesPanel brand={selected} />
          <PendingPanel
            title="Social metrics pending"
            items={["Follower count", "Follower growth", "Posting frequency", "Engagement rate", "Creative format mix", "Paid vs organic activity"]}
          />
        </section>
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
        <CampaignPanel />
        <MonitorTimeline eventTypes={["campaign_page", "category_or_product_page", "new_url_detected", "campaign_terms_detected", "homepage_content_changed"]} />
      </>
    );
  }

  return (
    <>
      <RankPanel ranked={ranked} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
      <section className="split-grid">
        <ScoreBreakdown brand={selected} activeModule={activeModule} />
        <CampaignPanel />
      </section>
      <MonitorTimeline />
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
  const promptPending = {
    title: "AI answers",
    score: 0,
    status: "Pending prompt data",
    gap: "AI answer presence is not collected yet.",
    actions: ["Connect the scheduled AEO prompt runner for ChatGPT, Perplexity, Gemini, Claude, Copilot, and Google AI Overviews."]
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
      score: 0,
      status: "Pending AEO measurement",
      gap: "Citation share, sentiment, and AI referral conversion data are not connected yet.",
      actions: ["Store prompt results, citation URLs, mention order, sentiment, and share-of-voice monthly."]
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
              <th>Brand</th>
              {columns.map(([label]) => (
                <th key={label}>{label}</th>
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
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function PendingPanel({ title, items }) {
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>These need platform APIs, exports, browser evidence, or approved tools.</p>
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

function AEOChecklistPanel({ brand }) {
  return (
    <section className="panel checklist-panel">
      <div className="panel-heading">
        <div>
          <h2>Complete AEO checklist</h2>
          <p>{brand.name} mapped against the full framework. Collected items use public evidence; pending items need dedicated collectors or first-party access.</p>
        </div>
      </div>
      <div className="checklist-sections">
        {aeoChecklistSections.map((section) => (
          <article className="checklist-section" key={section.title}>
            <h3>{section.title}</h3>
            <div className="checklist-items">
              {section.items.map(([label, key, note]) => {
                const result = resolveAeoChecklistItem(brand, key, note);
                return (
                  <div className="checklist-item" key={label}>
                    <span className={`status-dot ${result.status}`} />
                    <div>
                      <strong>{label}</strong>
                      <small>{result.label}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
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
    contactSignals: [signals.hasPhoneOrWhatsapp || signals.hasEmailLink, "Contact/NAP proxy"]
  };
  if (key === "pending") return { status: "pending", label: note || "Pending collector" };
  const [passed, label] = map[key] || [false, "Not collected"];
  return { status: passed ? "passed" : "missing", label: passed ? label : "Not detected" };
}

function SocialHandlesPanel({ brand }) {
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>{brand.name} handles</h2>
          <p>Registry URLs currently tracked for platform monitoring.</p>
        </div>
      </div>
      <div className="handle-list">
        {brand.collected.social.map((item) => (
          <a href={item.url} target="_blank" rel="noreferrer" key={item.platform}>
            <strong>{item.platform}</strong>
            <span>{item.status}</span>
          </a>
        ))}
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
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CampaignPanel() {
  const rows = campaigns.length > 0 ? campaigns : fallbackCampaigns;
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>Campaign watch</h2>
          <p>Detected public URLs, campaign terms, or website evidence.</p>
        </div>
        <AlertTriangle size={18} />
      </div>
      <div className="campaign-list">
        {rows.map((campaign) => (
          <article key={`${campaign.brand}-${campaign.name}`}>
            <div>
              <strong>{campaign.name}</strong>
              <span>{campaign.brand} · {campaign.channel}</span>
            </div>
            <span className={`impact ${campaign.impact.toLowerCase()}`}>{campaign.impact}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function MonitorTimeline({ eventTypes = null }) {
  const events = eventTypes
    ? (monitorEvents.events || []).filter((event) => eventTypes.includes(event.type))
    : monitorEvents.events || [];
  return (
    <section className="panel monitor-panel">
      <div className="panel-heading">
        <div>
          <h2>Evidence timeline</h2>
          <p>Public competitor changes captured by the monitor with source links and confidence labels.</p>
        </div>
        <span className="monitor-count">{events.length} events</span>
      </div>
      <div className="timeline-list">
        {events.slice(0, 8).map((event) => (
          <article className="timeline-item" key={event.id}>
            <span className={`alert-level ${event.severity.toLowerCase()}`}>{event.severity}</span>
            <div>
              <strong>{event.title}</strong>
              <p>{event.detail}</p>
              <div className="timeline-meta">
                <span>{event.brand}</span>
                <span>{event.confidence}</span>
                <a href={event.sourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </div>
          </article>
        ))}
        {events.length === 0 ? (
          <article className="timeline-empty">
            <strong>No changes captured yet</strong>
            <p>Run the monitor once to create a baseline. Every later run compares against it and creates evidence-backed alerts.</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
