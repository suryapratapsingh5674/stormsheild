import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY not set");
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

interface AnalyzePayload {
  question: string;
  context: {
    cyclone: Record<string, unknown>;
    riskSummary: Record<string, unknown>;
    criticalAssets: Array<Record<string, unknown>>;
    selectedInfrastructure?: Record<string, unknown> | null;
  };
}

// System prompt that grounds Gemini in the disaster response context
const SYSTEM_PROMPT = `You are StormShield AI, an expert disaster-response intelligence assistant.
You are analyzing real-time cyclone impact data for emergency response teams in Odisha and Andhra Pradesh, India.

Your role:
- Provide concise, actionable analysis based ONLY on the provided data context
- Prioritize life-safety infrastructure (hospitals, emergency services, shelters)
- Give specific recommendations referencing actual asset names and risk scores
- Use a professional, direct tone appropriate for emergency operations
- Do NOT invent assets, locations, or data not present in the context
- Keep responses structured and scannable — use numbered lists where appropriate
- Always end with 1-2 immediate next actions

Disclaimer: Always note that this is a prototype risk model when giving risk assessments.`;

export async function analyzeContext(payload: AnalyzePayload): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const contextStr = JSON.stringify({
    activeCyclone: payload.context.cyclone,
    infrastructureRiskSummary: payload.context.riskSummary,
    topAtRiskAssets: payload.context.criticalAssets,
    selectedAsset: payload.context.selectedInfrastructure ?? "None selected",
  }, null, 2);

  const prompt = `${SYSTEM_PROMPT}

=== CURRENT SITUATION DATA ===
${contextStr}

=== USER QUESTION ===
${payload.question}

Provide a focused, actionable response:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
