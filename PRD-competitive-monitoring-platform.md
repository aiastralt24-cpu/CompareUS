# PRD: Competitive Monitoring Platform for Astral Pipes and Competitor Brands

## 1. Product Summary

Build a competitive intelligence platform that continuously monitors Astral Pipes and selected competitor brands across AEO, SEO, social media, website performance, campaign activity, and digital reputation.

The platform should help marketing, brand, SEO, content, performance, and leadership teams understand how Astral Pipes compares against competitors, detect changes early, and convert findings into actionable recommendations.

## 2. Brands in Scope

### Primary Brand

- Astral Pipes

### Direct Competitors

- Supreme Pipes / Supreme Industries
- Prince Pipes
- Apollo Pipes / APL Apollo
- Ashirvad by Aliaxis
- Wavin India
- KPT Pipes

### Benchmark / Adjacent Competitors

- POLOPLAST
- REHAU India

## 3. Problem Statement

Competitive tracking is currently fragmented across manual website checks, social media browsing, SEO tools, ad libraries, and performance audits. This makes it difficult to maintain a consistent view of:

- Which competitors are gaining visibility.
- Which campaigns are active.
- Which platforms are driving engagement.
- Which websites are technically stronger.
- Which brands are more discoverable in AI search and answer engines.
- Which content themes, formats, and categories competitors are prioritizing.

The product should centralize this intelligence into a repeatable monitoring system with clear scoring, alerts, reports, and evidence trails.

## 4. Goals

- Track all listed brands across website, search, social, AEO, paid, content, and performance parameters.
- Create a normalized competitive scorecard across brands.
- Detect meaningful competitor changes, such as new campaigns, new pages, SEO ranking shifts, website redesigns, social growth spikes, and ad launches.
- Provide weekly and monthly reports for brand and marketing teams.
- Maintain a historical archive of competitor activity.
- Convert raw monitoring data into recommendations for Astral Pipes.

## 5. Non-Goals

- The platform will not publish content to social media.
- The platform will not run paid ad campaigns.
- The platform will not scrape private or login-only data.
- The platform will not replace enterprise SEO or social listening tools in phase 1.
- The platform will not guarantee exact follower, ranking, or ad spend data where platforms restrict access.

## 6. Target Users

### Brand Team

Needs to understand campaign themes, creative direction, competitor positioning, celebrity usage, product narratives, and engagement trends.

### SEO and Content Team

Needs visibility into keywords, SERP changes, content gaps, backlinks, schema, crawlability, and AI answer engine presence.

### Performance Marketing Team

Needs to monitor competitor paid campaigns, landing pages, Meta Ad Library activity, Google ad visibility, and conversion funnels.

### Leadership

Needs a concise competitive health dashboard, trend summaries, threat alerts, and opportunity areas.

### Agency / Analyst Team

Needs exportable reports, evidence links, scoring inputs, and repeatable audit workflows.

## 7. Key Use Cases

- Compare Astral Pipes against all competitors on a 90-point digital competitiveness score.
- Track competitor social media posting frequency, engagement rate, follower growth, and content mix.
- Monitor new campaign launches across websites, social platforms, YouTube, LinkedIn, and ad libraries.
- Track website performance metrics including Core Web Vitals, mobile usability, accessibility, page weight, and technical health.
- Monitor AEO readiness including schema, extractable FAQs, brand/entity clarity, AI bot accessibility, and citation presence.
- Identify SEO content gaps by comparing product category pages, blog topics, keywords, and SERP visibility.
- Generate weekly summary reports and monthly executive decks.
- Trigger alerts when competitors launch major campaigns, gain ranking positions, publish high-engagement posts, or significantly improve technical performance.

## 8. Monitored Channels and Sources

### Website

- Official brand websites.
- Product pages.
- Campaign pages.
- Blog/resource pages.
- Dealer/plumber/community pages.
- Press releases.
- Sitemap and robots.txt files.

### Social Media

- Facebook
- Instagram
- YouTube
- LinkedIn
- X / Twitter where confirmed

### Search and AEO

- Google SERPs.
- Featured snippets.
- People Also Ask.
- Knowledge panels.
- AI Overview visibility where available.
- ChatGPT, Perplexity, Gemini, Claude, and other answer-engine checks where supported.
- Third-party citations such as Wikipedia, Reddit, Quora, news sites, trade directories, and review platforms.

### Paid and Campaign Intelligence

- Meta Ad Library.
- Google Ads Transparency Center where available.
- YouTube promoted content indicators where visible.
- Landing pages linked from active ads.

### Technical and Performance

- Lighthouse.
- PageSpeed Insights.
- Chrome UX Report where available.
- BuiltWith / Wappalyzer-style technology detection.
- Security headers and SSL checks.
- Uptime monitoring.

## 9. Brand Data Model

Each brand profile should store:

- Brand name.
- Brand category.
- Priority level.
- Website URL.
- Facebook URL.
- Instagram URL.
- YouTube URL.
- LinkedIn URL.
- X / Twitter URL.
- Handle confirmation status per platform.
- Notes and source evidence.
- Last verified date.
- Monitoring status.
- Competitor type: direct, adjacent, or benchmark.

## 10. Monitoring Modules

### 10.1 AEO Monitoring

The system should evaluate:

- Whether the brand appears in answer-engine responses for target queries.
- Whether the brand is named accurately.
- Whether brand facts are consistent across AI engines.
- Whether product categories are understood correctly.
- Whether structured content is extractable.
- Whether pages contain FAQ, how-to, comparison, and technical education sections.
- Whether schema markup is present and valid.
- Whether AI crawlers are allowed in robots.txt.
- Whether third-party citations reinforce brand authority.

Example queries:

- Best PVC pipe brands in India.
- Best CPVC pipes for plumbing.
- Astral Pipes vs Supreme Pipes.
- Prince Pipes vs Astral Pipes.
- Top plumbing pipe brands for homes.
- Best pipes for hot and cold water.

### 10.2 SEO Monitoring

The system should evaluate:

- Organic keyword rankings.
- Category keyword coverage.
- Branded and non-branded visibility.
- SERP feature presence.
- Page titles and meta descriptions.
- Heading structure.
- Internal linking.
- Indexation health.
- Sitemap freshness.
- Robots.txt configuration.
- Schema coverage.
- Backlink profile.
- Content freshness.
- Local SEO presence.
- International targeting where applicable.

### 10.3 Social Media Monitoring

The system should evaluate:

- Platform presence.
- Follower count.
- Follower growth.
- Posting frequency.
- Engagement rate.
- Average likes, comments, shares, saves, and views.
- Top-performing posts.
- Content mix by theme.
- Creative format mix.
- Influencer or celebrity usage.
- Campaign hashtag usage.
- Community management quality.
- Response time where visible.
- Platform-specific strengths and weaknesses.

Content themes should include:

- Product education.
- Plumber/dealer connect.
- Installation guidance.
- Celebrity campaigns.
- Cricket/sports-led content.
- Sustainability.
- Innovation.
- Homeowner awareness.
- Technical superiority.
- Retail/dealer promotions.
- Corporate announcements.

### 10.4 Website Performance Monitoring

The system should evaluate:

- Core Web Vitals: LCP, INP, CLS.
- Mobile PageSpeed score.
- Desktop PageSpeed score.
- Page weight.
- JavaScript weight.
- Image optimization.
- Accessibility score.
- WCAG 2.2 issues.
- Mobile usability.
- Navigation clarity.
- Conversion path clarity.
- Dealer locator usability.
- Contact form health.
- Security headers.
- SSL status.
- Uptime and downtime events.

### 10.5 Campaign Monitoring

The system should detect:

- New landing pages.
- New hero banners.
- New product announcements.
- New celebrity campaigns.
- New festival campaigns.
- New dealer/plumber campaigns.
- New paid ads.
- High-performing social content.
- YouTube video uploads.
- Press releases and media coverage.

### 10.6 Reputation and Mention Monitoring

The system should track:

- Brand mentions across search results.
- News mentions.
- Forums and Q&A mentions.
- Review signals where available.
- Sentiment direction.
- Recurring complaints.
- Dealer or plumber feedback themes.
- Product quality discussions.

## 11. Scoring Framework

Each brand should receive category-level and total scores.

### Recommended Score Distribution

| Area | Max Score |
| --- | ---: |
| AEO Visibility and Readiness | 15 |
| SEO Visibility and Technical Health | 20 |
| Social Media Strength | 20 |
| Website Performance and UX | 15 |
| Campaign Activity | 10 |
| Content Quality and Authority | 10 |
| Reputation and Mentions | 5 |
| Data Completeness and Verification | 5 |
| **Total** | **100** |

### Score Output

- Overall rank.
- Score by category.
- Score change vs previous period.
- Strengths.
- Weaknesses.
- Threat level.
- Recommended actions for Astral Pipes.

## 12. Dashboard Requirements

### Executive Dashboard

- Overall competitive ranking.
- Astral Pipes score vs competitor average.
- Top 3 rising competitors.
- Top 3 risks.
- Top 3 opportunities.
- Major campaign alerts.
- Monthly trend line.

### Brand Comparison Dashboard

- Brand-by-brand scorecards.
- Channel presence comparison.
- Platform follower and engagement comparison.
- Content theme comparison.
- Campaign activity comparison.
- Website performance comparison.

### Social Dashboard

- Posting calendar by brand.
- Best posts by engagement.
- Follower growth chart.
- Content mix chart.
- Platform-wise performance.
- Hashtag and campaign tracker.

### SEO and AEO Dashboard

- Keyword visibility.
- SERP feature ownership.
- AI answer visibility.
- Schema health.
- Content gap matrix.
- Citation and authority sources.

### Website Health Dashboard

- Lighthouse scores.
- Core Web Vitals.
- Accessibility issues.
- Uptime.
- Page weight.
- Technical issue history.

## 13. Alerts

The system should generate alerts for:

- Competitor launches new campaign page.
- Competitor publishes high-engagement post.
- Competitor uploads new YouTube video.
- Competitor starts new paid ad campaign.
- Competitor gains or loses major keyword rankings.
- Competitor website performance improves or drops significantly.
- Competitor appears newly in AI answers for priority queries.
- Astral Pipes loses visibility against a competitor.
- Confirmed social handle changes or new platform profile appears.

Alert severity:

- Critical: major campaign launch, significant SEO loss, major outage, reputational issue.
- High: rapid engagement growth, new paid campaign, major website redesign.
- Medium: new content cluster, new video series, performance shift.
- Low: routine post, minor website update, small follower change.

## 14. Reporting Requirements

### Weekly Report

- Brand ranking snapshot.
- Major competitor activity.
- Top social posts.
- SEO/AEO movement.
- Website performance issues.
- Recommended actions for the next week.

### Monthly Report

- Full scorecard.
- Trend analysis.
- Share of voice.
- Campaign analysis.
- Content gap analysis.
- Platform-by-platform benchmark.
- Executive summary.

### Quarterly Report

- Strategic competitor review.
- Positioning shifts.
- Long-term SEO and AEO movement.
- Content strategy recommendations.
- Website and UX benchmark.
- Budget and campaign implications.

## 15. Functional Requirements

### Brand Management

- Users can add, edit, deactivate, and verify brand profiles.
- Users can update social handles and mark them as confirmed, unconfirmed, or rejected.
- Users can attach evidence links to each profile.

### Data Collection

- System can schedule automated checks.
- System can store raw snapshots.
- System can store normalized metrics.
- System can track changes over time.
- System can identify missing data.

### Analysis

- System can calculate scores by category.
- System can compare brands.
- System can detect anomalies.
- System can generate recommendations.
- System can classify content themes.

### Reporting

- Users can export reports as PDF, PPTX, CSV, or Google Sheets.
- Users can filter by brand, period, channel, and category.
- Users can save report templates.

### Governance

- System should display source links for all captured insights.
- System should store last checked date.
- System should separate confirmed data from inferred data.
- System should allow manual override with audit trail.

## 16. Non-Functional Requirements

- Dashboard should load primary views within 3 seconds for cached data.
- Data collection jobs should be retryable.
- System should support at least 25 monitored brands in future.
- System should preserve historical data for at least 24 months.
- System should use role-based access control.
- System should comply with platform terms and avoid private or unauthorized scraping.
- System should support manual data upload where APIs are unavailable.
- System should maintain clear audit logs for score changes.

## 17. Suggested Data Refresh Frequency

| Data Type | Refresh Frequency |
| --- | --- |
| Social profile metrics | Daily |
| Social posts | Daily |
| Website homepage changes | Daily |
| Campaign landing pages | Daily |
| SEO rankings | Weekly |
| AEO query checks | Weekly |
| Lighthouse performance | Weekly |
| Backlinks | Monthly |
| Full competitive score | Monthly |
| Handle verification | Monthly |

## 18. Integrations

### Phase 1

- Google Sheets import/export.
- Lighthouse / PageSpeed Insights.
- Manual social handle registry.
- Meta Ad Library links.
- CSV upload for SEO rankings.

### Phase 2

- Ahrefs, Semrush, or Similarweb.
- Sprinklr, Meltwater, Brandwatch, or equivalent social listening platform.
- YouTube Data API.
- LinkedIn manual/import workflow.
- Google Search Console for owned Astral properties.

### Phase 3

- AI answer engine monitoring tools such as Profound, Otterly, Peec AI, or equivalent.
- Automated screenshot capture.
- Automated campaign change detection.
- Slack, Teams, or email alerts.

## 19. MVP Scope

The MVP should include:

- Brand registry for all 9 brands.
- Confirmed handle tracking.
- Manual and semi-automated metric entry.
- Monthly 100-point scorecard.
- Social posting and engagement tracker.
- Website performance tracker using Lighthouse.
- SEO keyword ranking import.
- AEO query checklist.
- Weekly and monthly report generation.
- Basic alerts for new posts, new campaigns, and score changes.

## 20. Future Enhancements

- Automated social content classification.
- AI-generated competitor summaries.
- Screenshot archive of website and campaign pages.
- Share of voice dashboard.
- Automated recommendations by channel.
- Predictive competitor momentum score.
- Creative benchmark library.
- Dealer/plumber community sentiment monitoring.
- AI Overview and answer-engine share tracking.
- Executive PPT deck auto-generation.

## 21. Success Metrics

- 100% of priority brands have verified website and social profiles.
- Weekly competitive report produced with less than 2 hours of manual effort.
- Monthly scorecard produced for all brands.
- At least 80% of major competitor campaign launches detected within 48 hours.
- At least 20 actionable recommendations generated per month.
- Astral Pipes team adopts the dashboard for weekly review.
- Manual spreadsheet dependency reduced by at least 50% after MVP.

## 22. Risks and Constraints

- Social platforms may restrict direct metric access.
- LinkedIn and Instagram data may require manual tracking or approved third-party tools.
- AI answer engine results may vary by location, prompt, and personalization.
- SEO tools may report different keyword volumes and ranks.
- Exact paid media spend will likely be unavailable.
- Some competitor handles are not fully confirmed and require periodic manual verification.

## 23. Open Questions

- Should the platform be built as an internal dashboard, Google Sheets-first system, or full web application?
- Which SEO tool will be the source of truth: Ahrefs, Semrush, Similarweb, or another?
- Which social listening tool, if any, is available to the team?
- Which exact keywords and AEO prompts should be treated as priority?
- Should the scoring model be equal-weighted or customized for Astral Pipes’ business priorities?
- Who owns manual verification of unconfirmed handles?
- Should reports be generated for only Astral Pipes leadership or also agencies and regional teams?

## 24. Recommended Phase Plan

### Phase 1: Tracker and Scorecard

Build the brand registry, metric schema, manual input flows, and monthly scorecard.

### Phase 2: Automated Monitoring

Automate website checks, Lighthouse audits, social content capture where possible, SEO imports, and campaign change alerts.

### Phase 3: Intelligence Layer

Add AI-based content classification, recommendations, trend summaries, AEO visibility checks, and executive reporting.

### Phase 4: Strategic Command Center

Create a full competitive intelligence dashboard with historical analysis, predictive scores, automated decks, and alert workflows.

## 25. Research Study Protocol

This section defines how the competitive study should be conducted so the dashboard produces defensible, repeatable insights rather than isolated data points.

### 25.1 Study Objective

The study should answer:

- How does Astral Pipes compare against each competitor across digital visibility, discoverability, engagement, website quality, campaign activity, and reputation?
- Which competitors are currently leading by channel?
- Which competitors are gaining momentum?
- Which product categories, content themes, and audience segments are competitors prioritizing?
- Where does Astral Pipes have immediate improvement opportunities?
- Which gaps should be addressed through SEO, AEO, social content, website UX, campaign planning, or reputation management?

### 25.2 Study Period

Recommended baseline:

- Historical lookback: 90 days.
- Weekly tracking cycle: every Monday.
- Monthly reporting cycle: first week of every month.
- Quarterly strategic review: once every 3 months.

For launch or campaign periods, increase social, campaign, and website-change monitoring to daily.

### 25.3 Research Scope

The study should cover:

- Official websites.
- Confirmed social media handles.
- Organic search visibility.
- AI answer engine visibility.
- Paid campaign signals.
- Website technical performance.
- Content quality and topical authority.
- Brand mentions, PR, forums, Q&A, and review signals.

The study should not include private groups, login-only dashboards, personal profiles, leaked data, or any non-public source.

### 25.4 Fixed Brand Set

The first study should include:

- Astral Pipes.
- Supreme Pipes / Supreme Industries.
- Prince Pipes.
- Apollo Pipes / APL Apollo.
- Ashirvad by Aliaxis.
- Wavin India.
- KPT Pipes.
- POLOPLAST.
- REHAU India.

Brands should be tagged as primary, direct competitor, adjacent competitor, or international benchmark.

### 25.5 Keyword Bank

The SEO study should include a fixed query bank across these clusters:

- PVC pipes.
- CPVC pipes.
- uPVC pipes.
- SWR pipes.
- PPR pipes.
- plumbing pipes.
- pipe fittings.
- drainage pipes.
- agri pipes.
- water supply pipes.
- hot and cold water pipes.
- best pipe brands in India.
- top pipe manufacturers in India.
- plumber recommended pipe brands.
- Astral vs Supreme pipes.
- Astral vs Prince pipes.
- Astral vs Ashirvad pipes.
- CPVC pipe price.
- PVC pipe fittings price.
- pipe dealer near me.

Each keyword should store search volume, difficulty, ranking URL, current rank, previous rank, SERP feature ownership, and brand mapped to the ranking page.

### 25.6 AEO Prompt Bank

The AEO study should test repeatable prompts such as:

- What are the best PVC pipe brands in India?
- Which CPVC pipe brand is best for home plumbing?
- Compare Astral Pipes and Supreme Pipes.
- Compare Astral Pipes and Prince Pipes.
- Which pipe brand is best for hot and cold water?
- Which Indian pipe brands are trusted by plumbers?
- What should I check before buying plumbing pipes?
- Which brands make SWR drainage pipes in India?
- Which pipe brand is better for residential plumbing?
- What are the top plumbing pipe manufacturers in India?

For each answer engine result, record:

- Brands mentioned.
- Order of mention.
- Whether Astral Pipes appears.
- Whether the answer is accurate.
- Sources cited.
- Product categories associated with each brand.
- Recommendation sentiment.
- Missing or incorrect facts.

### 25.7 Social Study Method

For each confirmed platform:

- Record follower count at the beginning and end of the period.
- Capture all posts during the study period where platform access allows.
- Classify posts by theme, format, objective, campaign, and audience.
- Record engagement metrics.
- Identify top 10 posts by engagement rate and top 10 by absolute engagement.
- Track posting frequency by week.
- Track recurring campaign hashtags.
- Note celebrity, influencer, dealer, plumber, sports, festival, and product-led content.

Recommended content format taxonomy:

- Static image.
- Carousel.
- Reel / short video.
- Long-form video.
- Story highlight.
- Poll / interactive post.
- Corporate announcement.
- Testimonial.
- Technical education.
- Campaign film.
- Dealer or plumber feature.

### 25.8 Website and UX Study Method

For each website:

- Run homepage, product-category page, dealer-locator page, contact page, and one campaign/blog page through performance checks.
- Capture Lighthouse scores for mobile and desktop.
- Record Core Web Vitals where available.
- Review navigation clarity and depth.
- Check product page completeness.
- Check schema markup.
- Check sitemap and robots.txt.
- Check accessibility issues.
- Check form and dealer-locator usability.
- Capture screenshots for evidence.

### 25.9 Scoring Rubric

Use the 100-point model in section 11. Each score should be based on documented evidence.

Suggested interpretation:

- 90-100: category leader.
- 75-89: strong performer.
- 60-74: competitive but with clear gaps.
- 45-59: underperforming.
- Below 45: urgent improvement needed.

Scoring should include both automated metrics and analyst judgment. Any analyst override should include a note and evidence link.

### 25.10 Deliverables

The study should produce:

- Executive summary.
- Brand-by-brand scorecard.
- SEO visibility report.
- AEO visibility report.
- Social media performance report.
- Website performance and UX report.
- Campaign activity report.
- Content gap matrix.
- Opportunity roadmap for Astral Pipes.
- Evidence appendix with source URLs and screenshots.

### 25.11 Quality Controls

- Use the same keyword and prompt bank across all brands.
- Run AEO prompts from the same location and account state where possible.
- Keep date range consistent.
- Mark unavailable data clearly instead of estimating.
- Separate confirmed, inferred, and manual data.
- Capture source links for every major claim.
- Re-check unusually high or low results before reporting.

### 25.12 Final Study Output Structure

The final study report should include:

- What changed this period.
- Who is leading.
- Who is gaining.
- Where Astral Pipes is ahead.
- Where Astral Pipes is behind.
- What competitors are doing differently.
- What Astral Pipes should do next.
- Channel-level action plan.
- Priority roadmap: immediate, next 30 days, next quarter.
