import fs from "node:fs/promises";
import path from "node:path";
import competitorSets from "../data/competitor-sets.json" with { type: "json" };

const outFile = path.resolve("data/generated/social-snapshot.json");
const activeSetSlug = process.env.MONITOR_BRAND_SLUG || "astral-pipes";
const activeSet = competitorSets.find((set) => set.slug === activeSetSlug) || competitorSets[0];
const brands = activeSet.brands || [];
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const xBearerToken = process.env.X_BEARER_TOKEN;
const userAgent =
  "CompareUS-SocialMonitor/1.0 (+https://github.com/aiastralt24-cpu/CompareUS; public competitive evidence monitor)";

const restrictedMetricNotes = [
  "Follower count requires platform API, approved browser capture, or exported evidence.",
  "Engagement rate requires post-level interactions from API/export/browser evidence.",
  "Follower growth requires historical platform snapshots.",
  "Paid-vs-organic classification requires ad-library collectors or campaign tagging evidence."
];

async function fetchText(url, { timeoutMs = 16000, retries = 1 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const started = Date.now();
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": userAgent,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "en-IN,en;q=0.9"
        }
      });
      const text = await response.text();
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url,
        text,
        responseMs: Date.now() - started
      };
    } catch (error) {
      lastError = error;
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 450 * (attempt + 1)));
    } finally {
      clearTimeout(timeout);
    }
  }
  return {
    ok: false,
    status: 0,
    finalUrl: url,
    text: "",
    responseMs: null,
    error: lastError?.message || "Fetch failed"
  };
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "user-agent": userAgent,
      accept: "application/json",
      ...headers
    }
  });
  const json = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    url: response.url,
    json
  };
}

function decodeEntities(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function extractFirst(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return "";
}

function extractMeta(html = "") {
  return {
    title: extractFirst(html, [/<title[^>]*>([\s\S]*?)<\/title>/i]),
    description: extractFirst(html, [
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i
    ]),
    canonical: extractFirst(html, [/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i])
  };
}

function platformFromUrl(url) {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/facebook\.com/i.test(url)) return "facebook";
  if (/linkedin\.com/i.test(url)) return "linkedin";
  if (/(twitter\.com|x\.com)/i.test(url)) return "x";
  return "web";
}

function youtubeChannelIdFrom(url, html = "") {
  const direct = url.match(/youtube\.com\/channel\/([^/?#]+)/i)?.[1];
  if (direct) return direct;
  return extractFirst(html, [
    /"channelId":"(UC[^"]+)"/,
    /"externalId":"(UC[^"]+)"/,
    /channel_id=(UC[A-Za-z0-9_-]+)/,
    /\/channel\/(UC[A-Za-z0-9_-]+)/
  ]);
}

function xUsernameFrom(url = "") {
  try {
    const parsed = new URL(url);
    const [, username] = parsed.pathname.split("/");
    return username ? username.replace("@", "") : "";
  } catch {
    return "";
  }
}

function parseYoutubeFeed(xml = "") {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, block]) => {
    const title = extractFirst(block, [/<title[^>]*>([\s\S]*?)<\/title>/i]);
    const published = extractFirst(block, [/<published>([^<]+)<\/published>/i]);
    const updated = extractFirst(block, [/<updated>([^<]+)<\/updated>/i]);
    const link = extractFirst(block, [/<link[^>]+href=["']([^"']+)["'][^>]*>/i]);
    const videoId = extractFirst(block, [/<yt:videoId>([^<]+)<\/yt:videoId>/i]);
    return { title, published, updated, link, videoId };
  });
  return entries.filter((entry) => entry.title && entry.published);
}

function countSince(entries, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return entries.filter((entry) => new Date(entry.published).getTime() >= cutoff).length;
}

function summarizeYoutube(entries) {
  if (!entries.length) {
    return {
      status: "No public RSS videos found",
      videosIn30Days: 0,
      videosIn90Days: 0,
      lastVideoAt: null,
      latestVideos: []
    };
  }
  const latest = [...entries].sort((a, b) => new Date(b.published) - new Date(a.published));
  const videosIn30Days = countSince(latest, 30);
  const videosIn90Days = countSince(latest, 90);
  return {
    status: videosIn30Days > 0 ? "Active in last 30 days" : videosIn90Days > 0 ? "Active in last 90 days" : "No recent public RSS video",
    videosIn30Days,
    videosIn90Days,
    lastVideoAt: latest[0]?.published || null,
    latestVideos: latest.slice(0, 5)
  };
}

async function collectYoutubeApiMetrics(channelId, entries) {
  if (!youtubeApiKey || !channelId) return null;
  const channelUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelUrl.searchParams.set("part", "snippet,statistics");
  channelUrl.searchParams.set("id", channelId);
  channelUrl.searchParams.set("key", youtubeApiKey);
  const channel = await fetchJson(channelUrl.toString());
  const channelItem = channel.json?.items?.[0];
  const videoIds = entries.map((entry) => entry.videoId).filter(Boolean).slice(0, 10);
  let videoStats = [];
  if (videoIds.length) {
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "snippet,statistics");
    videosUrl.searchParams.set("id", videoIds.join(","));
    videosUrl.searchParams.set("key", youtubeApiKey);
    const videos = await fetchJson(videosUrl.toString());
    videoStats = (videos.json?.items || []).map((item) => ({
      videoId: item.id,
      title: item.snippet?.title,
      publishedAt: item.snippet?.publishedAt,
      statistics: {
        viewCount: Number(item.statistics?.viewCount || 0),
        likeCount: Number(item.statistics?.likeCount || 0),
        commentCount: Number(item.statistics?.commentCount || 0)
      },
      evidence: {
        source: "YouTube Data API",
        collectedAt: new Date().toISOString(),
        method: "videos.list statistics",
        confidence: "Live API data"
      }
    }));
  }
  return {
    ok: channel.ok,
    status: channel.status,
    channel: channelItem
      ? {
          title: channelItem.snippet?.title,
          subscriberCount: Number(channelItem.statistics?.subscriberCount || 0),
          hiddenSubscriberCount: Boolean(channelItem.statistics?.hiddenSubscriberCount),
          viewCount: Number(channelItem.statistics?.viewCount || 0),
          videoCount: Number(channelItem.statistics?.videoCount || 0),
          evidence: {
            source: "YouTube Data API",
            collectedAt: new Date().toISOString(),
            method: "channels.list statistics",
            confidence: "Live API data"
          }
        }
      : null,
    latestVideoStats: videoStats
  };
}

async function collectXApiMetrics(url) {
  const username = xUsernameFrom(url);
  if (!xBearerToken || !username) return null;
  const apiUrl = `https://api.x.com/2/users/by/username/${encodeURIComponent(username)}?user.fields=created_at,description,public_metrics,verified`;
  const response = await fetchJson(apiUrl, {
    authorization: `Bearer ${xBearerToken}`
  });
  return {
    ok: response.ok,
    status: response.status,
    username,
    data: response.json?.data
      ? {
          id: response.json.data.id,
          name: response.json.data.name,
          username: response.json.data.username,
          verified: response.json.data.verified,
          publicMetrics: response.json.data.public_metrics,
          evidence: {
            source: "X API",
            collectedAt: new Date().toISOString(),
            method: "users/by/username public_metrics",
            confidence: "Live API data"
          }
        }
      : null
  };
}

async function collectProfile(brandName, platform, url) {
  const profile = await fetchText(url);
  const meta = extractMeta(profile.text);
  const base = {
    brand: brandName,
    platform,
    url,
    ok: profile.ok,
    status: profile.status,
    finalUrl: profile.finalUrl,
    responseMs: profile.responseMs,
    title: meta.title,
    description: meta.description,
    canonical: meta.canonical,
    collectionStatus: profile.ok ? "Public profile reached" : "Profile restricted or unavailable"
  };

  if (platform === "x") {
    const xApi = await collectXApiMetrics(url);
    return {
      ...base,
      xApi,
      collectionStatus: xApi?.data ? "X API public metrics collected" : base.collectionStatus
    };
  }

  if (platform !== "youtube") return base;

  const channelId = youtubeChannelIdFrom(url, profile.text);
  if (!channelId) {
    return {
      ...base,
      collectionStatus: profile.ok ? "YouTube reached; channel id not resolved" : base.collectionStatus,
      youtube: summarizeYoutube([])
    };
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const feed = await fetchText(feedUrl, { timeoutMs: 16000, retries: 1 });
  const entries = feed.ok ? parseYoutubeFeed(feed.text) : [];
  const youtube = summarizeYoutube(entries);
  const youtubeApi = await collectYoutubeApiMetrics(channelId, entries);
  return {
    ...base,
    channelId,
    feedUrl,
    feedStatus: feed.status,
    collectionStatus: youtubeApi?.channel ? "YouTube API metrics collected" : feed.ok ? "YouTube RSS collected" : "YouTube RSS unavailable",
    youtube: {
      ...youtube,
      apiMetrics: youtubeApi?.channel || null,
      latestVideoStats: youtubeApi?.latestVideoStats || []
    }
  };
}

function summarizeBrand(profiles) {
  const youtubeProfile = profiles.find((profile) => profile.platform === "youtube");
  const youtube = youtubeProfile?.youtube || null;
  return {
    profilesTracked: profiles.length,
    reachableProfiles: profiles.filter((profile) => profile.ok).length,
    youtubeVideos30d: youtube?.videosIn30Days ?? null,
    youtubeVideos90d: youtube?.videosIn90Days ?? null,
    lastYoutubeVideoAt: youtube?.lastVideoAt ?? null,
    youtubeSubscriberCount: youtube?.apiMetrics?.subscriberCount ?? null,
    youtubeChannelViews: youtube?.apiMetrics?.viewCount ?? null,
    youtubeVideoCount: youtube?.apiMetrics?.videoCount ?? null,
    xFollowerCount: profiles.find((profile) => profile.platform === "x")?.xApi?.data?.publicMetrics?.followers_count ?? null,
    status:
      profiles.length === 0
        ? "No handles in registry"
        : youtube
          ? youtube.status
          : "Profiles tracked; post metrics restricted"
  };
}

async function main() {
  const collected = [];
  for (const brand of brands) {
    const social = brand.social || {};
    const profiles = [];
    for (const [key, url] of Object.entries(social)) {
      const platform = key || platformFromUrl(url);
      profiles.push(await collectProfile(brand.name, platform, url));
    }
    collected.push({
      name: brand.name,
      website: brand.website,
      profiles,
      summary: summarizeBrand(profiles),
      unavailableMetrics: restrictedMetricNotes
    });
  }

  const output = {
    generatedAt: new Date().toISOString(),
    monitoredSet: activeSetSlug,
    methodology: {
      mode: "public social evidence collector",
      collected: [
        "Official social URL reachability and response metadata",
        "Public title/description/canonical metadata where platforms allow access",
        "YouTube public RSS latest-video cadence when channel id can be resolved",
        "YouTube Data API statistics when YOUTUBE_API_KEY is configured",
        "X API public metrics when X_BEARER_TOKEN is configured"
      ],
      notCollectedWithoutAccess: restrictedMetricNotes
    },
    brands: collected
  };

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${outFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
