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
npm run monitor
```

Optional connector keys:

```bash
YOUTUBE_API_KEY=
X_BEARER_TOKEN=
META_AD_LIBRARY_ACCESS_TOKEN=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```
