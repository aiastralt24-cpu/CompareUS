# Periscope

Production login-gated brand intelligence platform for Astral ecosystem monitoring.

## Run locally

```bash
npm install
npm run dev
```

## Access control

Periscope uses a single approved local credential gate for the current internal build.

## Monitoring collectors

```bash
npm run collect
npm run collect:all
npm run social:collect
npm run ads:collect
npm run browser-evidence:collect
npm run gsc:collect
npm run ga4:collect
npm run ai:collect
npm run measurement:collect
npm run keywords:collect
npm run keywords:map
npm run links:internal
npm run mentions:collect
npm run seo-aeo:collect
npm run monitor
```

Optional connector keys:

```bash
YOUTUBE_API_KEY=
X_BEARER_TOKEN=
META_AD_LIBRARY_ACCESS_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json
GSC_ENABLED=1
GA4_ENABLED=1
AI_VISIBILITY_ENABLED=1
OPENAI_API_KEY=
PERPLEXITY_API_KEY=
GEMINI_API_KEY=
COMMON_CRAWL_ENABLED=0
```

## First-party Astral measurement

Periscope supports an Astral-owned measurement layer for:

- Google Search Console keyword/page performance.
- GA4 AI referral traffic from ChatGPT, Perplexity, Gemini, Copilot, Claude, Poe, You.com, and related referrers.
- AI visibility prompt monitoring for mentions and citations.

The app does not show AI-platform impressions because ChatGPT, Perplexity, Gemini, Claude, and Copilot do not expose brand impression counts to site owners. It shows first-party AI referral traffic from GA4 and prompt-monitoring visibility only when evidence exists.

Configure owned brand properties in `data/google-properties.json`. Service account credentials must stay outside git and must be granted access to the relevant Search Console and GA4 properties.

## No-paid-API SEO/AEO growth layer

Periscope can now build SEO/AEO opportunities without DataForSEO, Ahrefs, Semrush, Majestic, or similar paid APIs.

- `npm run keywords:map` creates keyword clusters from GSC data when available, plus configured/manual keyword banks.
- `npm run links:internal` creates an internal-link graph proxy from public crawl and keyword evidence.
- `npm run mentions:collect` creates “Known Links and Mentions.” This is not a total backlink count.
- `npm run seo-aeo:collect` refreshes keyword mapping, internal links, content/AEO opportunities, known links/mentions, and Telegram-ready alert payloads.

Optional CSV imports live under `data/imports/`:

- `target-keywords.csv`: `ownedBrandSlug,keyword,cluster,intent,funnelStage,targetPage,priority,evidenceUrl`
- `manual-links-mentions.csv`: `ownedBrandSlug,sourceUrl,sourceDomain,targetUrl,anchorText,mentionText,status,sourceType,evidenceUrl,action`
- `gsc-links.csv`: `ownedBrandSlug,sourceUrl,sourceDomain,targetUrl,anchorText,status,sourceType,evidenceUrl`
- `outreach-prospects.csv`: `ownedBrandSlug,sourceUrl,sourceDomain,targetUrl,status,sourceType,evidenceUrl,action`
