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

        <div className="content-grid">
          <section className="main-column">
            <header className="page-header">
              <div>
                <p className="section-label">{moduleLabels[activeModule]} intelligence · Public data mode</p>
                <h1>Competitive Command Center</h1>
                <p className="header-copy">
                  Factual public-web collection from official websites, robots.txt, sitemaps,
                  metadata, schema, and registry evidence. Restricted SEO, social, AEO visibility,
                  and paid metrics remain clearly marked until source data is connected.
                </p>
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
                <strong>Data status: collected public-web evidence</strong>
                <span>
                  Latest public collection: {generatedAt}. Composite scores now use framework-derived
                  public signals: website health, AEO readiness, technical SEO, content extractability,
                  accessibility proxies, security/privacy, and registry completeness. {dataGaps}
                  restricted data gaps are kept pending instead of guessed.
                </span>
              </div>
            </section>

            <ModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />

            <ModuleWorkspace
              activeModule={activeModule}
              ranked={ranked}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selected={selected}
            />
          </section>

          <aside className="insight-rail">
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
          </aside>
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
            ["Q headings", (brand) => brand.collected.homepage.counts.questionHeadings]
          ]}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        <section className="split-grid">
          <SignalPanel
            title={`${selected.name} AEO parameters`}
            description="Signals inspired by the AEO checklist."
            signals={[
              ["AEO readiness", selected.auditScores.aeoReadiness],
              ["Content extraction", selected.auditScores.contentExtraction],
              ["Schema blocks", selected.collected.homepage.counts.jsonLdBlocks],
              ["Answer blocks", selected.collected.homepage.contentStructure.answerFriendlyBlocks],
              ["Question headings", selected.collected.homepage.counts.questionHeadings],
              ["Trust signals", yesNo(selected.collected.homepage.signals.hasTrustSignals)]
            ]}
          />
          <SchemaPanel brand={selected} />
        </section>
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
