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

