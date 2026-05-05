# Data Sources and Validation Plan

## Current State

The dashboard now uses a generated public-web snapshot from `npm run collect`.

What is real:

- Brand names.
- Official websites supplied in the research brief.
- Social handle registry supplied in the research brief.
- Monitoring categories from the PRD and study protocol.
- Scoring model structure.
- Public website reachability.
- Homepage response status and response time.
- Homepage title, meta description, canonical, H1, headings, links, images, forms, and JSON-LD schema detection.
- `robots.txt` status and AI-bot blocking checks.
- `sitemap.xml` status and URL count where available.
- Basic security header presence.
- Public website and AEO-readiness scores derived from the collected evidence.

What is not yet factual:

- Full competitive scores across all disciplines.
- True AEO answer-engine visibility scores.
- Organic SEO ranking scores.
- Social performance scores.
- Follower counts.
- Engagement rates.
- Posting frequency.
- Campaign impact labels.
- Paid campaign impact labels.
- Reputation and sentiment scores.

Unavailable metrics are intentionally marked as restricted or pending instead of being estimated.

## Required Source of Truth by Module

| Module | Required Source | Validation Method |
| --- | --- | --- |
| Brand registry | Official websites and platform profile URLs | Manual verification with evidence links |
| Social metrics | Native platform exports, approved social listening tool, or manual weekly capture | Store screenshot/source URL and capture date |
| YouTube metrics | YouTube Data API or manual channel/video capture | Match channel ID and video URL |
| SEO rankings | Ahrefs, Semrush, Similarweb, Google Search Console for Astral-owned properties | Fixed keyword bank and same location/device |
| AEO visibility | Profound, Otterly, Peec AI, or manual prompt testing | Fixed prompt bank, date, engine, location, cited sources |
| Website performance | Lighthouse, PageSpeed Insights, Chrome UX Report | Same URL set and same test schedule |
| Campaign monitoring | Meta Ad Library, Google Ads Transparency Center, website change logs, social posts | Evidence URL, screenshot, first-seen date |
| Reputation mentions | Google results, news, forums, Q&A, listening tool | Source URL, sentiment tag, analyst note |

## Minimum Factual Study Inputs

Before the dashboard should be used for strategic decisions, collect:

- One verified brand registry row per brand.
- 90-day social post and engagement sample per confirmed platform.
- Weekly SEO ranking export for the approved keyword bank.
- Weekly AEO result capture for the approved prompt bank.
- Lighthouse results for homepage, category page, dealer locator, contact page, and one campaign/content page per brand.
- Campaign evidence from Meta Ad Library, websites, YouTube, Instagram, LinkedIn, and press/news.
- Analyst notes explaining any manual score overrides.

## Scoring Rule

No score should be shown as final unless:

- The source is named.
- The capture date is stored.
- The input metric is visible.
- The calculation rule is documented.
- Manual judgment is marked separately from automated data.

## Dashboard Data Status Labels

Use these labels in the product:

- Demo data: placeholder values used for prototype review.
- Imported data: values loaded from CSV or manual study sheet.
- Verified data: values checked against a source with evidence.
- Live data: values pulled directly from an approved API or monitoring tool.
