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
```

## First-party Astral measurement

Periscope supports an Astral-owned measurement layer for:

- Google Search Console keyword/page performance.
- GA4 AI referral traffic from ChatGPT, Perplexity, Gemini, Copilot, Claude, Poe, You.com, and related referrers.
- AI visibility prompt monitoring for mentions and citations.

The app does not show AI-platform impressions because ChatGPT, Perplexity, Gemini, Claude, and Copilot do not expose brand impression counts to site owners. It shows first-party AI referral traffic from GA4 and prompt-monitoring visibility only when evidence exists.

Configure owned brand properties in `data/google-properties.json`. Service account credentials must stay outside git and must be granted access to the relevant Search Console and GA4 properties.
