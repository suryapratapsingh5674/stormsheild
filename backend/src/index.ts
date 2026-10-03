import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

// All API routes under /api
app.use("/api", routes);

// Start server
app.listen(PORT, () => {
  console.log(`\n🌀 StormShield Backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? "✅ Key found" : "⚠️  No key — mock responses active"}`);
  console.log(`   Data mode:  DEMO\n`);
});

export default app;
