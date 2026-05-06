import fs from "node:fs/promises";
import path from "node:path";

export async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

export function evidenceMeta({ source, evidenceUrl, collectedAt, method, confidence = "Verified evidence" }) {
  return {
    source,
    evidenceUrl,
    collectedAt: collectedAt || new Date().toISOString(),
    method,
    confidence
  };
}

export function normalizeUrl(value = "") {
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "");
  } catch {
    return value || "";
  }
}

export function hostname(value = "") {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function parseCsv(text = "") {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values, rowIndex) => ({
    __row: rowIndex + 2,
    ...Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))
  }));
}

export async function readCsvIfExists(file) {
  try {
    return parseCsv(await fs.readFile(file, "utf8"));
  } catch {
    return [];
  }
}

export function classifyIntent(query = "") {
  const value = query.toLowerCase();
  if (/\b(price|cost|buy|dealer|distributor|near me|supplier|where to buy)\b/.test(value)) return "Transactional";
  if (/\b(best|top|compare|vs|which|review|recommended)\b/.test(value)) return "Commercial";
  if (/\b(how|what|why|guide|meaning|difference|installation|use|types)\b/.test(value)) return "Informational";
  if (/\b(contact|warranty|catalogue|brochure|download|customer care)\b/.test(value)) return "Support";
  return "Category";
}

export function funnelStage(intent) {
  if (intent === "Transactional") return "Conversion";
  if (intent === "Commercial") return "Consideration";
  if (intent === "Support") return "Post-purchase";
  return "Awareness";
}

export function slugify(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function classifyKeywordCluster(query = "", config = {}) {
  const value = query.toLowerCase();
  for (const [cluster, terms] of Object.entries(config.nonBrandKeywordGroups || {})) {
    if ((terms || []).some((term) => value.includes(term.toLowerCase()))) return cluster;
  }
  const words = value.split(/\s+/).filter((word) => word.length > 3);
  return words.slice(0, 2).join("_") || "general";
}

export function isBrandQuery(query = "", config = {}) {
  const value = query.toLowerCase();
  return (config.brandTerms || []).some((term) => value.includes(term.toLowerCase()));
}

export function inferAeoOpportunity({ query, page = "", pageEvidence = null }) {
  const lower = query.toLowerCase();
  if (/\b(how|what|why|which|difference|can|does|is|are)\b/.test(lower)) return "FAQ/direct-answer block";
  if (/\b(best|top|compare|vs|recommended)\b/.test(lower)) return "Comparison answer page";
  if (/\b(price|cost|dealer|near me|supplier)\b/.test(lower)) return "Commercial landing page";
  if (pageEvidence && !(pageEvidence.schemaTypes || []).includes("FAQPage")) return "FAQ schema opportunity";
  if (page && /product|category|solution|pipe|paint|bath|adhesive/i.test(page)) return "Product/category schema";
  return "Entity and glossary reinforcement";
}

export function severityFromPriority(priority = "Medium") {
  if (/critical|high/i.test(priority)) return "High";
  if (/low/i.test(priority)) return "Low";
  return "Medium";
}

export function uniqueBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
