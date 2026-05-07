import crypto from "node:crypto";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { URL } from "node:url";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function readJsonFile(filePath, label) {
  try {
    return {
      ok: true,
      value: JSON.parse(await fs.readFile(filePath, "utf8"))
    };
  } catch (error) {
    return {
      ok: false,
      reason: `Unable to read ${label}: ${error.message}`
    };
  }
}

async function writeJsonFile(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
}

function oauthClientFromCredentials(credentials) {
  const client = credentials.installed || credentials.web || {};
  return {
    clientId: client.client_id,
    clientSecret: client.client_secret
  };
}

async function exchangeOAuthCode({ clientId, clientSecret, code, redirectUri }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || `OAuth code exchange failed with ${response.status}.`);
  }
  return json;
}

async function refreshOAuthToken({ clientId, clientSecret, refreshToken }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || `OAuth refresh failed with ${response.status}.`);
  }
  return json;
}

function buildOAuthUrl({ clientId, redirectUri, scopes }) {
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  return authUrl.toString();
}

function waitForOAuthCode(server) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      server.close();
      reject(new Error("OAuth login timed out after 180 seconds."));
    }, 180000);

    server.on("request", (request, response) => {
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      if (requestUrl.pathname !== "/oauth2callback") {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const error = requestUrl.searchParams.get("error");
      const code = requestUrl.searchParams.get("code");
      clearTimeout(timer);
      response.writeHead(error ? 400 : 200, { "content-type": "text/html" });
      response.end(error ? "Authorization failed. You can close this tab." : "Astral Periscope is connected. You can close this tab.");
      server.close();
      if (error) {
        reject(new Error(error));
      } else if (!code) {
        reject(new Error("OAuth callback did not include a code."));
      } else {
        resolve(code);
      }
    });
  });
}

async function getOAuthAccessToken(scopes) {
  const clientPath = process.env.GSC_OAUTH_CLIENT_PATH;
  if (!clientPath) {
    return {
      ok: false,
      status: "Setup Required",
      reason: "GSC_OAUTH_CLIENT_PATH is not configured."
    };
  }

  const credentialsResult = await readJsonFile(clientPath, "GSC_OAUTH_CLIENT_PATH");
  if (!credentialsResult.ok) {
    return {
      ok: false,
      status: "Setup Required",
      reason: credentialsResult.reason
    };
  }

  const { clientId, clientSecret } = oauthClientFromCredentials(credentialsResult.value);
  if (!clientId || !clientSecret) {
    return {
      ok: false,
      status: "Setup Required",
      reason: "OAuth client JSON must include installed.client_id and installed.client_secret."
    };
  }

  const tokenPath =
    process.env.GSC_OAUTH_TOKEN_PATH ||
    path.join(path.dirname(clientPath), "periscope-gsc-oauth-token.json");
  const tokenResult = await readJsonFile(tokenPath, "GSC OAuth token");
  const now = Date.now();

  if (tokenResult.ok && tokenResult.value.access_token && tokenResult.value.expires_at > now + 60000) {
    return {
      ok: true,
      accessToken: tokenResult.value.access_token,
      clientEmail: "oauth-user",
      authMode: "oauth"
    };
  }

  if (tokenResult.ok && tokenResult.value.refresh_token) {
    try {
      const refreshed = await refreshOAuthToken({
        clientId,
        clientSecret,
        refreshToken: tokenResult.value.refresh_token
      });
      const nextToken = {
        ...tokenResult.value,
        ...refreshed,
        expires_at: now + (refreshed.expires_in || 3600) * 1000
      };
      await writeJsonFile(tokenPath, nextToken);
      return {
        ok: true,
        accessToken: nextToken.access_token,
        clientEmail: "oauth-user",
        authMode: "oauth"
      };
    } catch (error) {
      return {
        ok: false,
        status: "Setup Required",
        reason: `Unable to refresh GSC OAuth token: ${error.message}`
      };
    }
  }

  if (process.env.GSC_OAUTH_INTERACTIVE !== "1") {
    return {
      ok: false,
      status: "Setup Required",
      reason: "GSC OAuth token is not created yet. Run once with GSC_OAUTH_INTERACTIVE=1."
    };
  }

  try {
    const server = http.createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const port = server.address().port;
    const redirectUri = `http://127.0.0.1:${port}/oauth2callback`;
    const authUrl = buildOAuthUrl({ clientId, redirectUri, scopes });
    console.log("\nOpen this URL to authorize Astral Periscope GSC access:\n");
    console.log(authUrl);
    console.log("\nWaiting for Google OAuth callback...\n");
    const code = await waitForOAuthCode(server);
    const token = await exchangeOAuthCode({ clientId, clientSecret, code, redirectUri });
    const storedToken = {
      ...token,
      expires_at: Date.now() + (token.expires_in || 3600) * 1000
    };
    await writeJsonFile(tokenPath, storedToken);
    return {
      ok: true,
      accessToken: storedToken.access_token,
      clientEmail: "oauth-user",
      authMode: "oauth"
    };
  } catch (error) {
    return {
      ok: false,
      status: "Setup Required",
      reason: `Unable to complete GSC OAuth login: ${error.message}`
    };
  }
}

async function getServiceAccountAccessToken(scopes) {
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credentialsPath) {
    return {
      ok: false,
      status: "Setup Required",
      reason: "GOOGLE_APPLICATION_CREDENTIALS is not configured."
    };
  }

  let credentials;
  try {
    credentials = JSON.parse(await fs.readFile(credentialsPath, "utf8"));
  } catch (error) {
    return {
      ok: false,
      status: "Setup Required",
      reason: `Unable to read GOOGLE_APPLICATION_CREDENTIALS: ${error.message}`
    };
  }

  if (!credentials.client_email || !credentials.private_key) {
    return {
      ok: false,
      status: "Setup Required",
      reason: "Service account JSON must include client_email and private_key."
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope: scopes.join(" "),
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const assertion = `${unsigned}.${base64url(signer.sign(credentials.private_key))}`;

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const json = await response.json().catch(() => ({}));

  if (!response.ok || !json.access_token) {
    return {
      ok: false,
      status: "Setup Required",
      reason: json.error_description || json.error || `Google token request failed with ${response.status}.`
    };
  }

  return {
    ok: true,
    accessToken: json.access_token,
    clientEmail: credentials.client_email,
    authMode: "service_account"
  };
}

export async function getGoogleAccessToken(scopes) {
  if (process.env.GSC_AUTH_MODE === "oauth") {
    return getOAuthAccessToken(scopes);
  }
  return getServiceAccountAccessToken(scopes);
}

export function evidenceMeta({ source, evidenceUrl, method, confidence = "First-party property access", collectedAt }) {
  return {
    source,
    evidenceUrl,
    collectedAt: collectedAt || new Date().toISOString(),
    method,
    confidence
  };
}
