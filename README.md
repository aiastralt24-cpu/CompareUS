# Astral Digital Universe

Production login-gated brand intelligence platform for Astral ecosystem monitoring.

## Run locally

```bash
npm install
npm run dev
```

## Required auth environment

The app uses Supabase Auth for production access control. Add these values before deploying:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Without these values, the app intentionally stays on the login/setup screen and does not expose the dashboard.

## Monitoring collectors

```bash
npm run collect
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
