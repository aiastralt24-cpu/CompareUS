import fs from "node:fs/promises";
import path from "node:path";
import googleProperties from "../data/google-properties.json" with { type: "json" };
import competitorSets from "../data/competitor-sets.json" with { type: "json" };
import promptBank from "../data/ai-prompt-bank.json" with { type: "json" };

const outFile = path.resolve("data/generated/ai-visibility-snapshot.json");
const enabled = process.env.AI_VISIBILITY_ENABLED === "1";
const collectedAt = new Date().toISOString();

function evidence({ source, method, confidence = "Setup Required" }) {
  return {
    source,
    evidenceUrl: source,
    collectedAt,
    method,
    confidence
  };
}

function brandTermsFor(config) {
  return [...new Set([config.brandName, ...(config.brandTerms || [])])].filter(Boolean);
}

function competitorTermsFor(slug) {
  const set = competitorSets.find((item) => item.slug === slug);
  return (set?.brands || []).map((brand) => brand.name).filter(Boolean);
}

function textHasAny(text, terms) {
  const lower = text.toLowerCase();
  return terms.some((term) => lower.includes(term.toLowerCase()));
}

function extractUrls(text = "") {
  return [...new Set(text.match(/https?:\/\/[^\s)]+/g) || [])];
}

function sentimentProxy(text = "") {
  const lower = text.toLowerCase();
  if (/\b(avoid|poor|bad|complaint|issue|not recommended)\b/.test(lower)) return "Negative proxy";
  if (/\b(best|recommended|trusted|leading|reliable|popular|strong)\b/.test(lower)) return "Positive proxy";
  return "Neutral proxy";
}

async function runPerplexity(prompt) {
  if (!process.env.PERPLEXITY_API_KEY) return null;
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.PERPLEXITY_MODEL || "sonar-pro",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error?.message || `Perplexity failed with ${response.status}`);
  const answer = json.choices?.[0]?.message?.content || "";
  return {
    provider: "Perplexity",
    answer,
    citations: json.citations || extractUrls(answer),
    evidence: evidence({
      source: "Perplexity API",
      method: "Prompt completion API",
      confidence: "Provider API response"
    })
  };
}

async function runGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) return null;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error?.message || `Gemini failed with ${response.status}`);
  const answer = (json.candidates?.[0]?.content?.parts || []).map((part) => part.text || "").join("\n");
  return {
    provider: "Gemini",
    answer,
    citations: extractUrls(answer),
    evidence: evidence({
      source: "Gemini API",
      method: "Prompt completion API",
      confidence: "Provider API response"
    })
  };
}

async function runOpenAiPrompt(prompt) {
  if (!process.env.OPENAI_API_KEY) return null;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error?.message || `OpenAI failed with ${response.status}`);
  const answer = json.choices?.[0]?.message?.content || "";
  return {
    provider: "OpenAI",
    answer,
    citations: extractUrls(answer),
    evidence: evidence({
      source: "OpenAI API",
      method: "Prompt completion API; not a platform impression source",
      confidence: "Provider API response"
    })
  };
}

async function runPrompt(prompt) {
  const results = [];
  for (const runner of [runPerplexity, runGemini, runOpenAiPrompt]) {
    const result = await runner(prompt);
    if (result) results.push(result);
  }
  return results;
}

function setupRequired(config, prompts, reason) {
  return {
    ownedBrandSlug: config.ownedBrandSlug,
    brandName: config.brandName,
    status: "Setup Required",
    reason,
    promptCount: prompts.length,
    providers: [],
    summary: {
      promptRuns: 0,
      ownedMentionRate: null,
      citationShare: null,
      competitorMentionCount: null,
      sentimentProxy: null
    },
    promptResults: [],
    missingCitations: prompts.map((prompt) => ({
      promptId: prompt.promptId,
      prompt: prompt.prompt,
      reason: "No provider result collected."
    })),
    evidence: evidence({
      source: "AI visibility prompt bank",
      method: "Setup check"
    })
  };
}

async function collectBrand(config) {
  const prompts = promptBank.filter((prompt) => prompt.ownedBrandSlug === config.ownedBrandSlug);
  if (!enabled) return setupRequired(config, prompts, "AI_VISIBILITY_ENABLED is not set to 1.");
  if (!process.env.PERPLEXITY_API_KEY && !process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
    return setupRequired(config, prompts, "No AI provider key is configured.");
  }

  const ownedTerms = brandTermsFor(config);
  const competitorTerms = competitorTermsFor(config.ownedBrandSlug).filter((term) => !textHasAny(term, ownedTerms));
  const promptResults = [];
  const providers = new Set();

  for (const prompt of prompts) {
    try {
      const providerResults = await runPrompt(prompt.prompt);
      for (const result of providerResults) {
        providers.add(result.provider);
        const answer = result.answer || "";
        const ownedMentioned = textHasAny(answer, ownedTerms);
        const competitorMentions = competitorTerms.filter((term) => textHasAny(answer, [term]));
        const ownedCitations = (result.citations || []).filter((url) =>
          (config.hostnames || []).some((hostname) => url.toLowerCase().includes(hostname.toLowerCase()))
        );
        promptResults.push({
          promptId: prompt.promptId,
          category: prompt.category,
          prompt: prompt.prompt,
          provider: result.provider,
          ownedMentioned,
          competitorMentions,
          citations: result.citations || [],
          ownedCitations,
          citationRank: ownedCitations.length ? Math.min(...ownedCitations.map((url) => (result.citations || []).indexOf(url) + 1)) : null,
          sentimentProxy: sentimentProxy(answer),
          answerExcerpt: answer.slice(0, 420),
          evidence: result.evidence
        });
      }
    } catch (error) {
      promptResults.push({
        promptId: prompt.promptId,
        category: prompt.category,
        prompt: prompt.prompt,
        provider: "Collector",
        ownedMentioned: false,
        competitorMentions: [],
        citations: [],
        ownedCitations: [],
        citationRank: null,
        sentimentProxy: "Not collected",
        error: error.message,
        evidence: evidence({
          source: "AI visibility collector",
          method: "Provider request failed",
          confidence: "Collector error"
        })
      });
    }
  }

  const promptRuns = promptResults.filter((result) => !result.error && result.provider !== "Collector").length;
  const ownedMentions = promptResults.filter((result) => result.ownedMentioned).length;
  const citations = promptResults.flatMap((result) => result.citations || []);
  const ownedCitations = promptResults.flatMap((result) => result.ownedCitations || []);
  const competitorMentions = promptResults.flatMap((result) => result.competitorMentions || []);
  const positive = promptResults.filter((result) => result.sentimentProxy === "Positive proxy").length;
  const negative = promptResults.filter((result) => result.sentimentProxy === "Negative proxy").length;

  return {
    ownedBrandSlug: config.ownedBrandSlug,
    brandName: config.brandName,
    status: promptRuns > 0 ? "Live" : "Setup Required",
    promptCount: prompts.length,
    providers: [...providers],
    summary: {
      promptRuns,
      ownedMentionRate: promptRuns ? ownedMentions / promptRuns : null,
      citationShare: citations.length ? ownedCitations.length / citations.length : null,
      competitorMentionCount: competitorMentions.length,
      sentimentProxy: promptRuns ? (positive >= negative ? "Positive/neutral proxy" : "Negative proxy") : null
    },
    promptResults,
    missingCitations: promptResults
      .filter((result) => !result.ownedCitations?.length)
      .map((result) => ({
        promptId: result.promptId,
        provider: result.provider,
        prompt: result.prompt,
        reason: result.error || "Owned domain was not cited in the collected answer."
      })),
    evidence: evidence({
      source: "AI visibility prompt bank",
      method: "Provider prompt runner; records mentions and citations, not impressions",
      confidence: promptRuns > 0 ? "Provider API response" : "Setup Required"
    })
  };
}

const brands = [];
for (const config of googleProperties) {
  brands.push(await collectBrand(config));
}

const snapshot = {
  generatedAt: collectedAt,
  source: "AI visibility prompt bank",
  dataMode: brands.some((brand) => brand.status === "Live") ? "prompt_monitoring" : "setup_required",
  note: "AI platforms do not expose brand impression counts. Periscope records prompt visibility, mentions, citations, and GA4 referral traffic.",
  brands
};

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${outFile}`);
