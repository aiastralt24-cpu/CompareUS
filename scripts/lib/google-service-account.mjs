import crypto from "node:crypto";
import fs from "node:fs/promises";

function base64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function getGoogleAccessToken(scopes) {
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
    clientEmail: credentials.client_email
  };
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
