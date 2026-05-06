# Astral Periscope Functionality Index

This document explains the current capabilities of Astral Periscope in plain language. It is written for marketing, digital, SEO, AEO, brand, and management teams so that anyone with access to the file can understand what the platform does, what data it uses, and where the current limitations are.

## 1. Platform Access

### 1.1 Login-gated Periscope access
Periscope is not an open public dashboard. It first shows a sign-in screen so only approved users can enter the platform. This protects sensitive brand intelligence, competitor monitoring, internal recommendations, and future first-party data such as Google Search Console or GA4.

### 1.2 Single authorized user credential
The current internal build supports one approved user ID and password. This is suitable for controlled review and internal testing. In a later production version, this can be upgraded to role-based access, multiple users, Supabase Auth, or SSO.

### 1.3 Protected Astral brand dashboard environment
After login, users land inside the Astral Periscope environment. All brand cards, dashboards, reports, and monitoring modules are hidden until access is granted. This ensures the tool behaves like an internal intelligence platform, not a public website.

### 1.4 Logout and session persistence
Users can log out from the dashboard. The app also remembers an active session locally, so users do not need to log in repeatedly during the same working period unless they log out or clear browser storage.

## 2. Astral Brand Universe

### 2.1 Central Astral Periscope home
The home screen acts as the command center for the Astral digital ecosystem. It gives a top-level view of all configured Astral brands instead of forcing users to start with one brand only.

### 2.2 Multi-brand dashboard cards
Each Astral brand is displayed as a separate card with its own score, status, and top pointers. This makes it easy to compare where each brand stands and which brand needs attention first.

### 2.3 Supported brands
The current configured Astral brands are Astral Pipes, Astral Adhesives, Astral Bathware, Astral Paints, and Astral Foundation. Each brand has its own registry, competitor set, public website baseline, and detailed dashboard view.

### 2.4 Brand health score
The health score summarizes public website, SEO, AEO, content extraction, accessibility proxy, security/privacy, and registry completeness signals. It is not a final business score; it is a digital evidence score based on the current collectors.

### 2.5 Top 10 brand-specific pointers
Each brand card shows the most important issues or opportunities for that brand. These pointers are generated from public evidence, setup gaps, weak scores, monitor events, and SEO/AEO recommendations.

### 2.6 View detailed dashboard per brand
The View Dashboard button opens a full workspace for the selected brand. The same dashboard structure is reused across all Astral brands, so the platform can scale without rebuilding every module from scratch.

## 3. Competitive Monitoring

### 3.1 Competitor registry per Astral brand
Each Astral brand has its own competitor set. For example, Astral Pipes has pipe competitors, while Astral Paints has paint competitors and Astral Foundation has comparable corporate foundations.

### 3.2 Public website tracking
Periscope monitors public websites only. It checks visible public pages, HTML, metadata, schema, sitemap, robots.txt, and related signals. It does not scrape private or login-protected competitor data.

### 3.3 Sitemap monitoring
The system checks sitemap availability and sitemap URL changes. If a competitor adds or removes URLs from the sitemap, Periscope can detect that as a public website change.

### 3.4 New URL detection
The monitor detects new public URLs found through the sitemap or homepage crawl. This is useful for identifying newly launched product pages, category pages, campaign pages, resource pages, or press pages.

### 3.5 Category/product page detection
Periscope classifies new URLs that appear to be product or category related. This helps users quickly notice when a competitor expands into a product line, service area, or category page.

### 3.6 Campaign-like URL detection
The monitor looks for public URLs containing campaign-like terms such as launch, offer, campaign, contest, plumber, dealer, festival, cricket, sustainability, video, news, or press. It does not claim intent; it only says public evidence was detected.

### 3.7 Homepage title/meta/H1 change detection
If a monitored homepage changes its title tag, meta description, or H1, Periscope creates an event. These changes can indicate SEO updates, campaign messaging changes, or brand positioning changes.

### 3.8 Schema change detection
The system detects changes in homepage JSON-LD schema and schema type coverage. Schema changes are important because they affect how search engines and answer engines understand the brand and page entities.

### 3.9 Robots.txt monitoring
Periscope checks robots.txt for availability and change. Robots.txt matters because it can allow or block search crawlers and AI crawlers from accessing parts of the website.

### 3.10 llms.txt monitoring
The platform checks whether `/llms.txt` exists and whether it changes. This file can provide guidance to AI crawlers about preferred brand, product, policy, and content URLs.

### 3.11 Security/privacy header monitoring
The monitor checks visible security and privacy-related headers such as HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy. These are proxies, not a full security audit.

### 3.12 Telegram-ready alert payloads
Periscope can format monitoring events into Telegram-ready alert payloads. Each alert includes brand, module, severity, change detected, evidence link, and recommended action.

## 4. AEO Intelligence

### 4.1 Complete AEO checklist
The AEO checklist maps each brand against a full answer-engine optimization framework. It covers AI answer presence, content extraction, schema, E-E-A-T signals, AI crawlability, topical authority, off-site citation sources, and measurement.

### 4.2 Evidence status indicators
The checklist uses simple dots to show status. Green means evidence was found. Amber means the system checked and did not find evidence. Grey means a dedicated collector, API, export, or first-party source is still needed.

### 4.3 AEO detail modal on checklist click
Users can click checklist items to open a detail window. The modal explains the meaning of the item, the current status, and the evidence basis behind the status.

### 4.4 AI crawler policy checks
Periscope reads robots.txt and checks whether known AI crawler policies appear to allow bots such as GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider, and Applebot-Extended.

### 4.5 FAQ/schema checks
The platform detects structured data such as FAQPage, Product, Organization, BreadcrumbList, Article, HowTo, and LocalBusiness schema. These help search engines and answer engines understand content more clearly.

### 4.6 Answer-friendly content checks
Periscope identifies content blocks that look extractable for AI answers, such as short explanatory paragraphs, lists, tables, and FAQ-style blocks. This helps evaluate whether a page is easy for answer engines to quote or summarize.

### 4.7 Question-heading detection
The collector counts question-style H2/H3 headings. Question headings are useful for AEO because they align with how people ask search and AI tools for answers.

### 4.8 Trust and E-E-A-T proxy checks
The system checks for visible trust proxies such as certifications, awards, case studies, author/editorial signals, freshness signals, and resource content. These are proxies and do not replace a full brand authority audit.

### 4.9 AI visibility prompt bank
Periscope includes a configured prompt bank for each Astral brand. These prompts represent real category questions that users may ask ChatGPT, Perplexity, Gemini, or other AI systems.

### 4.10 AI mention and citation tracking setup
When AI provider keys are connected, Periscope can run prompts and record whether Astral is mentioned, whether competitors are mentioned, and whether Astral-owned URLs are cited.

### 4.11 AI citation gap tracking
The system can flag prompts where an AI answer exists but Astral is not cited. This helps the team identify where stronger citable content, schema, or authority signals may be required.

## 5. SEO Intelligence

### 5.1 Technical SEO comparison
The SEO module compares each Astral brand and its competitors using public technical signals. It includes title, meta description, H1, canonical, sitemap, internal links, and schema-related evidence.

### 5.2 Title/meta/H1 checks
Periscope checks whether titles, meta descriptions, and H1 headings are present and measures their length. These signals help evaluate whether pages are clear for search engines and users.

### 5.3 Canonical checks
The system checks whether a canonical URL is declared. Canonical tags help search engines understand the preferred version of a page and reduce duplication confusion.

### 5.4 Sitemap checks
Sitemap checks confirm whether a public sitemap is available and how many URLs are discovered. This helps evaluate crawlability and site structure.

### 5.5 Internal link count
Periscope counts visible internal links from crawled pages. Internal links help search engines discover pages and understand relationships between topics.

### 5.6 Google Search Console integration setup
The platform is ready to collect first-party GSC data for Astral-owned websites. Until credentials are connected, the dashboard clearly shows Setup Required instead of fake clicks, impressions, or ranks.

### 5.7 Top queries
Once GSC is connected, Periscope can show the top search queries that generated impressions and clicks for Astral-owned domains.

### 5.8 Top pages
With GSC access, the dashboard can show which Astral pages receive search impressions and clicks. This helps identify which pages are already visible and which pages need support.

### 5.9 Brand vs non-brand keyword split
The system separates branded queries from non-branded category queries. This helps the team understand whether visibility is driven mainly by brand demand or by broader category discovery.

### 5.10 CTR opportunity detection
Periscope flags high-impression queries with low CTR. These are opportunities to improve title tags, meta descriptions, page positioning, or answer blocks.

### 5.11 Average-position buckets
The GSC collector groups queries into ranking buckets such as 1-3, 4-10, 11-20, 21-50, and 50+. This helps prioritize quick wins and longer-term SEO opportunities.

### 5.12 Keyword cannibalization detection
The keyword mapping engine can detect cases where similar query families appear across multiple landing pages. This helps identify when pages may be competing with each other instead of supporting one clear target page.

## 6. Keyword Mapping Engine

### 6.1 Keyword cluster mapping
Keywords are grouped into clusters such as pipes, water tanks, adhesives, bathware, paints, CSR, or other brand-specific categories. This makes keyword planning easier than reviewing isolated query rows.

### 6.2 Query-to-page mapping
When GSC data is connected, Periscope maps queries to the pages that are currently receiving impressions. This helps identify whether the right page is ranking for the right search intent.

### 6.3 Intent classification
Queries are classified into intent types such as informational, commercial, transactional, category, or support. Intent classification helps decide what kind of content should be created.

### 6.4 Funnel-stage mapping
Each keyword is mapped to a funnel stage: awareness, consideration, conversion, or post-purchase. This helps marketing teams balance education, comparison, and lead/dealer-focused content.

### 6.5 AEO opportunity mapping
Periscope suggests whether a keyword should become an FAQ, direct-answer block, comparison page, commercial landing page, glossary item, or schema opportunity.

### 6.6 Manual keyword bank import support
Teams can import a target keyword bank manually through CSV. This is useful for planned keywords that may not yet appear in GSC.

### 6.7 Target keyword seed system
Each brand has configured non-brand keyword seed groups. These seed keywords help start planning before GSC is connected, but they are clearly labeled as seeds and not ranking data.

### 6.8 GSC-powered keyword mapping when access is connected
Once GSC credentials are active, Periscope replaces setup-only views with first-party keyword evidence from Google Search Console.

## 7. Content and AEO Opportunity Engine

### 7.1 Missing FAQ block detection
The system identifies where FAQ-style content or schema is missing. FAQ blocks help answer engines understand question-answer content.

### 7.2 Missing Product schema detection
Periscope checks whether Product schema is detected where product/category context exists. Product schema can help machines understand product entities and commercial relevance.

### 7.3 Missing FAQ schema detection
If a brand has question-answer content but FAQPage schema is not detected, the tool flags it as an AEO opportunity.

### 7.4 Missing Breadcrumb schema detection
Breadcrumb schema helps clarify site hierarchy. Periscope flags missing breadcrumb schema where it can improve search and answer-engine understanding.

### 7.5 Weak direct-answer intro detection
Pages should ideally start with a short, clear answer to the main topic. Periscope checks for direct-answer style introductions and flags weak coverage.

### 7.6 Missing freshness signal detection
The system checks whether pages show visible updated dates or freshness signals. Freshness is especially useful for knowledge, guide, and category education pages.

### 7.7 Content gap recommendations
Periscope creates recommendations for missing or weak content formats such as FAQ blocks, comparison pages, citable guides, glossary pages, or better commercial landing pages.

### 7.8 AI answer not citing Astral detection
When AI prompt results are live, Periscope can identify prompts where Astral should ideally be cited but is not. This creates a focused AEO content opportunity.

### 7.9 Recommended content format per opportunity
Every opportunity includes a recommended format, such as FAQPage schema, Product schema, direct-answer block, citable guide, title/meta rewrite, or internal linking support.

## 8. Internal Linking Intelligence

### 8.1 Public crawl-based internal link graph
Periscope builds a crawl-based internal link graph from public URLs. This shows how pages connect to each other from a crawlability perspective.

### 8.2 Orphan page proxy detection
The system compares sitemap URLs with URLs discovered through crawl. If a sitemap URL is not discoverable through internal links, it may be treated as an orphan-page proxy.

### 8.3 Sitemap vs crawl discovery comparison
This comparison helps identify whether important pages are listed in the sitemap but not meaningfully connected through navigation or content links.

### 8.4 Weak priority page support detection
Priority pages from keyword mapping can be checked for internal link support. If important pages do not receive enough contextual links, the tool can recommend improvements.

### 8.5 Generic anchor proxy checks
The tool can flag generic anchor patterns such as read more, click here, or know more. Descriptive anchor text is better for users and search engines.

### 8.6 Suggested source page
Internal link recommendations include a suggested page where a link can be added. This helps content and SEO teams act faster.

### 8.7 Suggested destination page
Each internal link recommendation includes the destination page that should receive more internal support.

### 8.8 Suggested anchor text
Periscope suggests descriptive anchor text based on the keyword or topic being supported. This makes internal linking more SEO-friendly.

### 8.9 Internal link recommendation report
The Reports section can export internal linking recommendations for review, implementation, or agency handoff.

## 9. Known Links and Mentions

### 9.1 Backlink-lite module
Periscope includes a backlink-lite module designed for use without paid backlink tools. It tracks known evidence, not the full backlink universe.

### 9.2 Clearly labeled Known Links and Mentions
The module is intentionally named Known Links and Mentions so users do not confuse it with a full backlink index.

### 9.3 No total backlink claim
Periscope does not show total backlink counts unless a proper backlink index is connected in the future. This prevents misleading reporting.

### 9.4 Manual link/mention import
Teams can manually import known links and mentions using CSV. Each row must include evidence so the data remains traceable.

### 9.5 GSC links export import
If the team exports links from Google Search Console manually, Periscope can ingest that CSV as known evidence.

### 9.6 Outreach prospect import
The module can import outreach prospects, such as partner websites, trade publications, directories, dealers, or CSR portals.

### 9.7 GA4 referral-source evidence
GA4 referral sources can become known source evidence. This does not prove every backlink, but it confirms that a source sent traffic.

### 9.8 Unlinked mention workflow
If a source mentions Astral but does not link, the system can classify it as an unlinked mention and suggest outreach.

### 9.9 Lost known link tracking
Known links can be tracked as lost if they disappear from imported or verified evidence. This is not full lost-link monitoring, but it helps manage known sources.

### 9.10 Outreach queue
The outreach queue organizes sources that should be reviewed for link acquisition, citation requests, corrections, or partnership follow-up.

## 10. Social and Campaign Intelligence

### 10.1 Verified social handle registry
Periscope stores official social profile URLs where available. These act as the monitoring base for social evidence.

### 10.2 YouTube public feed support
The system can use public YouTube feed evidence to detect recent video activity without requiring paid tools.

### 10.3 YouTube API-ready metric support
When a YouTube API key is connected, the platform is ready to collect factual YouTube metrics such as subscriber count, video count, views, and latest video stats.

### 10.4 X API-ready metric support
The system is prepared for X public metrics through a bearer token. Until connected, it does not show fake follower or engagement numbers.

### 10.5 Restricted social metric labeling
Follower counts, engagement rates, and growth metrics remain hidden or labeled restricted unless supported by API, export, screenshot, or approved browser evidence.

### 10.6 Meta Ad Library-ready collector
Periscope includes a Meta Ad Library-ready path for detecting active campaign creatives when the required access token and setup are available.

### 10.7 Public campaign watch
The Campaigns module tracks public website evidence such as campaign URLs, launch pages, product/category pages, homepage changes, schema changes, and social/ad signals when available.

### 10.8 Social creative detection via available public evidence
Where public feeds are available, the system can detect new social creative activity, such as public YouTube uploads.

## 11. Website Quality Monitoring

### 11.1 Public website score
The public website score summarizes reachability, metadata, links, schema, sitemap, robots, and other public technical signals.

### 11.2 Accessibility proxy
The accessibility proxy checks visible HTML signals such as language tag, viewport, image alt coverage, heading structure, form labels, and semantic clues. It is not a full WCAG audit.

### 11.3 Security/privacy proxy
The security/privacy proxy checks HTTPS and visible security/privacy headers plus privacy, terms, and cookie-policy signals. It does not replace a dedicated security review.

### 11.4 Response status and response time
The collector records whether the page returns a successful HTTP status and how long the public request took. This helps identify basic availability and crawler responsiveness.

### 11.5 Image alt proxy
The crawler counts images missing alt text. Missing alt text can affect accessibility, content clarity, and image SEO.

### 11.6 HTML language and viewport checks
The system checks whether HTML language and viewport tags are present. These are basic quality signals for accessibility and mobile rendering.

### 11.7 Open Graph and Twitter Card checks
Periscope checks whether pages include Open Graph and Twitter/X card metadata. These tags affect how links appear when shared on social platforms.

### 11.8 Tech stack detection
The collector detects visible technology signals such as WordPress, React, Next.js, Cloudflare, GA4, GTM, Clarity, Hotjar, and Meta Pixel.

### 11.9 Analytics/marketing tag visibility
Periscope can detect visible marketing and analytics tags. If these change, the monitor can create an event because tracking setup may have changed.

## 12. First-Party Measurement Layer

### 12.1 Google Search Console collector
The GSC collector is designed to pull real query, page, device, country, click, impression, CTR, and average-position data for Astral-owned websites.

### 12.2 GA4 collector
The GA4 collector is designed to pull first-party analytics data such as sessions, users, events, landing pages, and AI referral sources.

### 12.3 AI referral traffic from GA4
Periscope can track traffic from known AI referrers such as ChatGPT, Perplexity, Gemini, Copilot, Claude, Poe, and You.com when GA4 access is connected.

### 12.4 AI visibility prompt collector
The AI prompt collector can run approved prompt banks against supported AI providers and record mentions, citations, competitor mentions, and sentiment proxy.

### 12.5 Service-account based Google access
Google access is designed around a service account. The credential file is never committed to the repo and must be granted access in GSC and GA4.

### 12.6 Setup Required state when credentials are missing
If credentials or API keys are not connected, the dashboard shows Setup Required. This prevents the platform from displaying false numbers.

### 12.7 No fake AI platform impressions
AI platforms generally do not expose brand impression counts to website owners. Periscope therefore tracks AI referral traffic and AI visibility, not AI impressions.

## 13. Reports and Exports

### 13.1 Brand-level report export
Each brand dashboard can export its current selected evidence as a JSON report. This can be used for review, documentation, or handoff.

### 13.2 Ecosystem report export
The home dashboard can export an ecosystem-level report covering all configured Astral brands and monitor events.

### 13.3 Keyword Mapping Report
This report includes keyword clusters, mapped queries, intent, funnel stage, CTR opportunities, and cannibalization issues.

### 13.4 Internal Linking Report
This report includes discovered URLs, sitemap comparison, orphan proxies, priority pages, weak pages, and internal link recommendations.

### 13.5 AEO Opportunity Report
This report lists content and AEO recommendations such as schema gaps, direct-answer gaps, FAQ needs, and AI citation opportunities.

### 13.6 Known Links and Mentions Report
This report exports the backlink-lite evidence CRM. It includes known sources, mentions, prospects, outreach actions, and rejected import rows.

### 13.7 Weekly SEO/AEO Action Plan
This report turns evidence-backed alerts into practical weekly actions for SEO and AEO teams.

### 13.8 Brand Executive Summary
This report summarizes the selected brand’s score, status, alerts, monitor events, and major evidence-backed recommendations.

## 14. Data Integrity Rules

### 14.1 Every metric carries source metadata
Metrics are expected to include source, evidence URL or property reference, collection time, method, and confidence.

### 14.2 Every snapshot includes collection time
Generated snapshots include timestamps so users know when the evidence was collected.

### 14.3 Restricted metrics remain hidden or marked Setup Required
If data is not available from an approved source, Periscope does not invent it. It marks the item as Setup Required, Restricted, or Need Collector.

### 14.4 No paid API assumptions
The current system does not assume DataForSEO, Ahrefs, Semrush, Majestic, or similar paid tools are available.

### 14.5 No fake follower counts
Social follower counts are not shown unless supported by API, export, screenshot, or approved evidence capture.

### 14.6 No fake keyword rankings
Keyword rankings are not estimated. For Astral-owned sites, Periscope uses GSC when connected. For competitors, rank data remains unavailable unless imported from an approved source.

### 14.7 No fake backlink totals
The Known Links and Mentions module does not claim total backlinks. It only shows known evidence from imports, GA4, public monitor events, or future approved sources.

### 14.8 No fake AI impressions
Periscope does not show AI platform impressions because those platforms do not provide reliable brand impression data to site owners. It shows AI visibility and AI referral traffic instead.

## 15. Available Backend Commands

### 15.1 `npm run collect`
Runs the public website collector for the active monitored brand set. It generates public crawl, SEO, AEO, website, and evidence snapshots.

### 15.2 `npm run collect:all`
Runs public collection across all configured Astral brand sets.

### 15.3 `npm run monitor`
Runs change detection against stored monitor baselines and creates monitor events.

### 15.4 `npm run monitor:realtime`
Runs monitoring continuously at the configured interval.

### 15.5 `npm run social:collect`
Runs the social evidence collector for configured public social profiles.

### 15.6 `npm run ads:collect`
Runs the ad-library collector path where access is configured.

### 15.7 `npm run gsc:collect`
Runs the Google Search Console collector. Without credentials, it produces Setup Required output.

### 15.8 `npm run ga4:collect`
Runs the GA4 collector. Without credentials or property IDs, it produces Setup Required output.

### 15.9 `npm run ai:collect`
Runs the AI visibility prompt collector. Without provider keys, it produces Setup Required output.

### 15.10 `npm run measurement:collect`
Runs GSC, GA4, and AI visibility collectors together.

### 15.11 `npm run keywords:collect`
Runs GSC collection and then builds keyword mapping.

### 15.12 `npm run keywords:map`
Builds keyword clusters, intent mapping, funnel mapping, CTR opportunities, and cannibalization detection from available evidence.

### 15.13 `npm run links:internal`
Builds the internal linking graph proxy and internal link recommendations.

### 15.14 `npm run mentions:collect`
Builds the Known Links and Mentions snapshot from imports, GA4 referrer evidence, and public monitor evidence.

### 15.15 `npm run seo-aeo:collect`
Runs the no-paid-API SEO/AEO growth layer, including keyword mapping, internal linking, content opportunities, known links/mentions, and alert payloads.

## 16. Current Limitation Notes

### 16.1 Competitor traffic is not available without approved third-party source
Periscope does not show competitor traffic estimates because that would require a third-party data provider or approved import.

### 16.2 Competitor keyword rankings are not shown without import/API
Competitor rankings cannot be collected from GSC because GSC only covers properties Astral owns or has access to.

### 16.3 Full backlink index is not available without paid backlink data source
A full backlink index requires web-scale crawling and link graph data. Periscope therefore tracks known links and mentions only.

### 16.4 Instagram/Facebook/LinkedIn metrics need API, export, or approved browser evidence
These platforms restrict public metric access. Periscope will not show follower growth or engagement unless evidence is connected.

### 16.5 AI platforms do not provide brand impression counts directly
ChatGPT, Perplexity, Gemini, Claude, Copilot, and similar platforms do not provide reliable brand-level impression reporting to website owners.

### 16.6 Periscope tracks AI visibility and AI referral traffic, not AI impressions directly
The practical measurement model is AI visibility from prompt testing plus AI referral traffic from GA4. This is factual and actionable without claiming unavailable impression data.
