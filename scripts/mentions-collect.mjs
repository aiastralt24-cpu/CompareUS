import path from "node:path";
import astralBrands from "../data/astral-brands.json" with { type: "json" };
import {
  evidenceMeta,
  hostname,
  normalizeUrl,
  readCsvIfExists,
  readJson,
  uniqueBy,
  writeJson
} from "./lib/seo-aeo-utils.mjs";

const outFile = path.resolve("data/generated/known-links-mentions-snapshot.json");
const collectedAt = new Date().toISOString();
const manualLinks = await readCsvIfExists("data/imports/manual-links-mentions.csv");
const gscLinks = await readCsvIfExists("data/imports/gsc-links.csv");
const outreachProspects = await readCsvIfExists("data/imports/outreach-prospects.csv");
const aiReferral = await readJson("data/generated/ai-referral-traffic-snapshot.json", { brands: [] });
const monitorEvents = await readJson("data/generated/monitor-events.json", { events: [] });

function validateLinkRow(row, source) {
  const errors = [];
  if (!row.ownedBrandSlug) errors.push("ownedBrandSlug missing");
  if (!row.sourceUrl && !row.sourceDomain) errors.push("sourceUrl or sourceDomain missing");
  if (!row.evidenceUrl && !row.sourceUrl) errors.push("evidenceUrl or sourceUrl required");
  if (!row.status) errors.push("status missing");
  return errors.length
    ? { ok: false, row: row.__row, ownedBrandSlug: row.ownedBrandSlug || "", source, errors }
    : { ok: true };
}

function toKnownLink(row, source) {
  const sourceUrl = normalizeUrl(row.sourceUrl || row.evidenceUrl || "");
  const targetUrl = normalizeUrl(row.targetUrl || "");
  const linkStatus = row.status || "prospect";
  return {
    ownedBrandSlug: row.ownedBrandSlug,
    sourceDomain: row.sourceDomain || hostname(sourceUrl),
    sourceUrl,
    targetUrl,
    anchorText: row.anchorText || "",
    mentionText: row.mentionText || "",
    linkStatus,
    sourceType: row.sourceType || "manual",
    evidenceUrl: row.evidenceUrl || sourceUrl,
    action: row.action || (linkStatus === "mention-only" ? "Request link addition" : linkStatus === "prospect" ? "Review outreach fit" : "Monitor"),
    confidence: source,
    collectedAt: row.collectedAt || collectedAt
  };
}

function fromAiReferral(brandData, ownedBrand) {
  if (brandData?.status !== "Live") return [];
  return (brandData.sources || []).map((source) => ({
    ownedBrandSlug: ownedBrand.slug,
    sourceDomain: source.source,
    sourceUrl: source.source,
    targetUrl: ownedBrand.website,
    anchorText: "",
    mentionText: "Referral traffic source observed in GA4.",
    linkStatus: "confirmed-referrer",
    sourceType: "ga4_referrer",
    sessions: source.sessions,
    evidenceUrl: brandData.evidence?.evidenceUrl || `GA4 property ${brandData.propertyId}`,
    action: "Review referral quality and landing page path",
    confidence: "First-party GA4 evidence",
    collectedAt: brandData.evidence?.collectedAt || collectedAt
  }));
}

function fromMonitorEvents(ownedBrand) {
  return (monitorEvents.events || [])
    .filter((event) => event.ownedBrandSlug === ownedBrand.slug && /news|press|campaign|content|social/i.test(event.type))
    .slice(0, 20)
    .map((event) => ({
      ownedBrandSlug: ownedBrand.slug,
      sourceDomain: hostname(event.sourceUrl),
      sourceUrl: event.sourceUrl,
      targetUrl: ownedBrand.website,
      anchorText: "",
      mentionText: event.title,
      linkStatus: "public-evidence",
      sourceType: "monitor_event",
      evidenceUrl: event.sourceUrl,
      action: "Review for citation/link opportunity",
      confidence: event.confidence || "Verified public evidence",
      collectedAt: event.firstSeenAt || collectedAt
    }));
}

const importedRows = [
  ...manualLinks.map((row) => ({ row, source: "Manual links/mentions import" })),
  ...gscLinks.map((row) => ({ row, source: "GSC Links export import" })),
  ...outreachProspects.map((row) => ({ row: { ...row, status: row.status || "prospect" }, source: "Outreach prospect import" }))
];
const rejectedImports = importedRows
  .map(({ row, source }) => validateLinkRow(row, source))
  .filter((result) => !result.ok);
const acceptedImports = importedRows
  .filter(({ row, source }) => validateLinkRow(row, source).ok)
  .map(({ row, source }) => toKnownLink(row, source));

const brands = astralBrands.map((ownedBrand) => {
  const brandReferral = (aiReferral.brands || []).find((brand) => brand.ownedBrandSlug === ownedBrand.slug);
  const rows = uniqueBy(
    [
      ...acceptedImports.filter((row) => row.ownedBrandSlug === ownedBrand.slug),
      ...fromAiReferral(brandReferral, ownedBrand),
      ...fromMonitorEvents(ownedBrand)
    ],
    (row) => `${row.sourceUrl}|${row.targetUrl}|${row.linkStatus}`
  );
  const unlinked = rows.filter((row) => row.linkStatus === "mention-only" || (!row.targetUrl && row.mentionText));
  const lost = rows.filter((row) => row.linkStatus === "lost");
  const prospects = rows.filter((row) => row.linkStatus === "prospect" || row.linkStatus === "outreach needed");
  return {
    ownedBrandSlug: ownedBrand.slug,
    brandName: ownedBrand.name,
    status: rows.length ? "Live" : "Setup Required",
    label: "Known Links and Mentions",
    summary: {
      knownSourceCount: rows.length,
      confirmedCount: rows.filter((row) => /confirmed|public-evidence/.test(row.linkStatus)).length,
      unlinkedMentionCount: unlinked.length,
      lostKnownLinkCount: lost.length,
      outreachProspectCount: prospects.length,
      rejectedImportCount: rejectedImports.filter((item) => item.ownedBrandSlug === ownedBrand.slug).length
    },
    knownLinksAndMentions: rows.slice(0, 150),
    unlinkedMentions: unlinked,
    outreachQueue: prospects,
    rejectedImports: rejectedImports.filter((item) => item.ownedBrandSlug === ownedBrand.slug),
    evidence: evidenceMeta({
      source: "Manual imports, GA4 referral evidence, and public monitor events",
      evidenceUrl: ownedBrand.website,
      method: "Known links and mentions only; not a full backlink index",
      confidence: rows.length ? "Known evidence" : "Setup Required",
      collectedAt
    })
  };
});

await writeJson(outFile, {
  generatedAt: collectedAt,
  source: "Known Links and Mentions",
  dataMode: "known_evidence_only",
  warning: "This is not total backlinks. It only includes first-party, imported, or public evidence rows.",
  importNotes: {
    manualLinks: "Optional CSV: data/imports/manual-links-mentions.csv",
    gscLinks: "Optional CSV: data/imports/gsc-links.csv",
    outreachProspects: "Optional CSV: data/imports/outreach-prospects.csv"
  },
  brands
});

console.log(`Wrote ${outFile}`);
