# CompareUS Monitoring Operations

## What This Monitor Can Factualy Detect

The current monitor detects public, evidence-backed competitor changes:

- New URLs added to sitemap or homepage crawl.
- URLs removed from sitemap or homepage crawl.
- New campaign-like URLs.
- New category or product URLs.
- Homepage title changes.
- Homepage visible text changes.
- Homepage JSON-LD schema changes.
- `robots.txt` changes.
- Normalized sitemap URL-list changes.
- Campaign-like terms appearing on the homepage.
- Homepage meta description changes.
- Homepage H1 changes.
- Schema type coverage changes, such as Product, Organization, BreadcrumbList, FAQPage, HowTo, or Article schema.
- Security/privacy header posture changes.
- Visible marketing and analytics tag changes, such as GA4, GTM, Clarity, Hotjar, and Meta Pixel.
- `llms.txt` availability or content changes when a real `llms.txt` file is present.

## Framework-Inspired Public Audit Logic

The collector now adds public-evidence signals inspired by the supplied AEO, SEO, Social Media, and Website Performance framework:

- AEO readiness: AI crawler policy, `llms.txt`, FAQ/schema signals, answer-friendly headings, content extractability, and E-E-A-T proxies.
- Technical SEO: title/meta length, H1 hygiene, canonical, sitemap, robots, viewport, Open Graph, Twitter Cards, breadcrumbs, and internal links.
- Content extraction: question headings, FAQ text/schema, answer-friendly blocks, freshness signals, author/editorial signals, trust signals, comparison tools, and resource hubs.
- Accessibility proxy: HTML language, viewport, image alt coverage, heading structure, form labels, lazy images, search UI, and breadcrumbs.
- Security/privacy: HTTPS, HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, privacy links, terms links, and cookie/DPDP signals.
- Tech stack and measurement: GA4, GTM, Microsoft Clarity, Hotjar, Meta Pixel, WordPress, Next.js, React, and Cloudflare indicators.

These are public proxies. They do not replace Lighthouse, CrUX, Search Console, social platform exports, or paid intelligence tools, but they make the baseline monitor much more useful without inventing data.

Every event stores:

- Competitor brand.
- Change type.
- Severity.
- Source URL.
- First-seen timestamp.
- Evidence hashes or matched terms.
- Confidence label.

## Commands

Install dependencies:

```bash
npm install
```

Collect public website audit data:

```bash
npm run collect
```

Create a fresh monitoring baseline:

```bash
npm run monitor:reset
```

Run normal change detection:

```bash
npm run monitor
```

Run the dashboard:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

## Telegram Setup

Create a Telegram bot using BotFather, then get:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Create a local `.env` file or export these variables in your shell:

```bash
export TELEGRAM_BOT_TOKEN="your_bot_token"
export TELEGRAM_CHAT_ID="your_chat_id"
```

Then run:

```bash
npm run monitor
```

If new events are detected, the monitor sends Telegram messages.

## Suggested Schedule

For practical competitor monitoring:

- Website/sitemap/schema/robots monitor: every 6 hours.
- Public website audit collector: daily.
- Dashboard review: daily morning.
- Reset baseline: only when intentionally restarting the study.

Example cron:

```cron
0 */6 * * * cd "/Volumes/Private data/CompareUS" && npm run monitor
```

## Important Accuracy Rule

The system should never say:

> Competitor is planning a campaign.

It should say:

> New public campaign-like URL detected.

That keeps the output factual and evidence-backed.
