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
  const registryCompleteness = scores.registryCompleteness ?? 0;
  const composite = Math.round(publicWebsite * 0.55 + aeoReadiness * 0.35 + registryCompleteness * 0.1);
  const socialCount = brand.social?.length ?? 0;
  return {
    name: brand.name,
    type: brand.type,
    priority: brand.priority,
    website: brand.website?.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    score: composite,
    previous: composite,
    aeo: Math.round((aeoReadiness / 100) * 15),
    seo: null,
    social: null,
    performance: Math.round((publicWebsite / 100) * 15),
    campaigns: null,
    content: brand.homepage?.signals?.hasProductText ? 7 : 3,
    reputation: null,
    verified: Math.min(5, socialCount),
    followers: "Restricted",
    engagement: "Restricted",
    frequency: "Needs capture",
    momentum: 0,
    threat: brand.name === "Astral Pipes" ? "Reference" : "Watch",
    color: brandColors[brand.name] || "#6b7280",
    collected: brand,
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

const alerts = snapshot.brands
  .flatMap((brand) => {
    const items = [];
    if (!brand.sitemap?.ok) {
      items.push({
        level: "High",
        title: `${brand.name} sitemap check failed`,
        detail: `Expected sitemap returned status ${brand.sitemap?.status || "unavailable"}.`,
        time: "Latest collection"
      });
    }
    if ((brand.homepage?.responseMs || 0) > 2000) {
      items.push({
        level: "Medium",
        title: `${brand.name} homepage response is slow`,
        detail: `Public fetch took ${brand.homepage.responseMs} ms from the collector run.`,
        time: "Latest collection"
      });
    }
    if (!brand.homepage?.signals?.hasSchema) {
      items.push({
        level: "Medium",
        title: `${brand.name} schema not detected`,
        detail: "Homepage HTML did not expose JSON-LD schema in the public fetch.",
        time: "Latest collection"
      });
    }
    return items;
  })
  .slice(0, 4);

const recommendations = [
  "Run the approved AEO prompt bank and attach cited answer evidence.",
  "Import SEO keyword ranks for the fixed pipe-category query bank.",
  "Capture social follower, post, and engagement metrics with source screenshots.",
  "Run Lighthouse on homepage, category, dealer locator, contact, and campaign pages."
];

const campaigns = snapshot.brands.slice(0, 5).map((brand) => ({
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
                label="Restricted gaps"
                value={dataGaps}
                suffix=""
                delta="Need APIs, exports, or browser evidence"
              />
            </section>

            <section className="data-notice" aria-label="Data provenance">
              <ShieldCheck size={18} />
              <div>
                <strong>Data status: collected public-web evidence</strong>
                <span>
                  Latest public collection: {generatedAt}. Composite scores use collected website,
                  AEO-readiness, and registry-completeness signals only; unavailable metrics are not
                  guessed.
                </span>
              </div>
            </section>

            <ModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />

            <section className="panel score-panel">
              <div className="panel-heading">
                <div>
                  <h2>Competitive rank</h2>
                  <p>Evidence-backed public-web score from the latest collector run.</p>
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
                    <span className={`signal ${brand.momentum >= 3 ? "up" : brand.momentum < 0 ? "down" : ""}`}>
                      {brand.momentum > 0 ? `+${brand.momentum}` : brand.momentum}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="split-grid">
              <ScoreBreakdown brand={selected} activeModule={activeModule} />
              <CampaignPanel />
            </section>

            <section className="panel comparison-panel">
              <div className="panel-heading">
                <div>
                  <h2>Brand comparison</h2>
                  <p>Brand registry structure with sample social velocity and threat labels.</p>
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
                      <th>Priority</th>
                      <th>Website</th>
                      <th>Followers</th>
                      <th>Engagement</th>
                      <th>Frequency</th>
                      <th>Threat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((brand) => (
                      <tr key={brand.name}>
                        <td>
                          <span className="table-brand">
                            <span className="brand-dot" style={{ background: brand.color }} />
                            {brand.name}
                          </span>
                        </td>
                        <td>{brand.priority}</td>
                        <td>{brand.website}</td>
                        <td>{brand.followers}</td>
                        <td>{brand.engagement}</td>
                        <td>{brand.frequency}</td>
                        <td>
                          <span className={`threat ${brand.threat.toLowerCase()}`}>{brand.threat}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
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
                <span>Social {selected.social}/20</span>
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
                    <time>{alert.time}</time>
                  </article>
                ))}
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
  return (
    <section className="panel breakdown-panel">
      <div className="panel-heading">
        <div>
          <h2>{moduleLabels[activeModule]} score anatomy</h2>
          <p>{brand.name} against the approved 100-point rubric.</p>
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
    </section>
  );
}

function CampaignPanel() {
  return (
    <section className="panel campaign-panel">
      <div className="panel-heading">
        <div>
          <h2>Campaign watch</h2>
          <p>Recent movement that needs analyst review.</p>
        </div>
        <AlertTriangle size={18} />
      </div>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
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

createRoot(document.getElementById("root")).render(<App />);
