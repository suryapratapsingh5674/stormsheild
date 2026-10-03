import axios from "axios";
import { API_BASE } from "../lib/constants";

interface AIAnalyzePayload {
  question: string;
  context: {
    cyclone: Record<string, unknown>;
    riskSummary: Record<string, unknown>;
    criticalAssets: Array<Record<string, unknown>>;
    selectedInfrastructure?: Record<string, unknown> | null;
  };
}

interface AIAnalyzeResponse {
  answer: string;
  modelUsed: string;
}

export async function analyzeWithAI(payload: AIAnalyzePayload): Promise<AIAnalyzeResponse> {
  const { data } = await axios.post(`${API_BASE}/api/ai/analyze`, payload, { timeout: 30000 });
  if (!data.success) throw new Error(data.error || "AI analysis failed");
  return { answer: data.answer, modelUsed: data.modelUsed };
}
