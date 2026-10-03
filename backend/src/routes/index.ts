import { Router, Request, Response } from "express";
import { cycloneService, infrastructureService, aiService } from "../services";

const router = Router();

// GET /api/cyclones
router.get("/cyclones", (_req: Request, res: Response) => {
  try {
    const data = cycloneService.getAll();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch cyclones" });
  }
});

// GET /api/cyclones/:id
router.get("/cyclones/:id", (req: Request, res: Response) => {
  try {
    const cyclone = cycloneService.getById(req.params.id);
    if (!cyclone) return res.status(404).json({ success: false, error: "Cyclone not found" });
    res.json({ success: true, data: cyclone });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch cyclone" });
  }
});

// GET /api/infrastructure
router.get("/infrastructure", (_req: Request, res: Response) => {
  try {
    const result = infrastructureService.getAll();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch infrastructure" });
  }
});

// POST /api/ai/analyze
router.post("/ai/analyze", async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;
    if (!question || !context) {
      return res.status(400).json({ success: false, error: "question and context are required" });
    }
    const result = await aiService.analyze({ question, context });
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error("AI analyze error:", err.message);
    res.status(500).json({ success: false, error: "AI analysis failed. Check API key." });
  }
});

// GET /api/health
router.get("/health", (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

export default router;
