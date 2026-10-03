import { demoCyclone } from "../data/demoCyclone";
import { demoInfrastructure } from "../data/demoInfrastructure";
import { analyzeContext } from "../adapters/geminiAdapter";

export const cycloneService = {
  getAll: () => [demoCyclone],
  getById: (id: string) => [demoCyclone].find((c) => c.id === id) ?? null,
};

export const infrastructureService = {
  getAll: () => ({ data: demoInfrastructure, dataSource: "DEMO" as const }),
};

export const aiService = {
  analyze: async (payload: Parameters<typeof analyzeContext>[0]) => {
    // If no API key, return a mock response so the demo still works
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
      return {
        answer: `**Mock AI Response** (Set GEMINI_API_KEY in backend/.env for real analysis)\n\nBased on the current risk assessment for ${(payload.context.cyclone as any)?.name ?? "the active cyclone"}:\n\n**Priority 1: Emergency Response Teams**\nDeploy NDRF/SDRF units to CRITICAL-rated facilities immediately.\n\n**Priority 2: Medical Facilities**\nEnsure backup power at all hospitals within the impact corridor.\n\n**Priority 3: Evacuation Routes**\nMonitor bridge structural integrity along coastal highways.\n\n⚠️ This is a prototype risk model — verify with official sources.`,
        modelUsed: "mock-response",
      };
    }
    const answer = await analyzeContext(payload);
    return { answer, modelUsed: "gemini-2.0-flash" };
  },
};
