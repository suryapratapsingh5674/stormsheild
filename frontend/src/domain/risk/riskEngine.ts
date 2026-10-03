import { Cyclone, Infrastructure, RiskAssessment, RiskLevel, InfrastructureWithRisk, RiskSummary } from "../../types";

// ─── Scoring Weights (configurable) ───────────────────────────────────────
const WEIGHTS = {
  distance: 0.35,     // how close to the track
  wind: 0.30,         // wind exposure based on cyclone intensity
  flood: 0.20,        // flood/surge exposure (coastal proximity)
  criticality: 0.15,  // asset importance multiplier
};

// ─── Distance Calculation ──────────────────────────────────────────────────

// Haversine formula — distance between two lat/lng points in km
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Minimum distance from infrastructure point to any segment of the cyclone track
function distanceToTrack(infra: Infrastructure, track: Cyclone["track"]): number {
  let minDist = Infinity;
  for (const point of track) {
    const d = haversineDistance(infra.latitude, infra.longitude, point.lat, point.lng);
    if (d < minDist) minDist = d;
  }
  return minDist;
}

// ─── Individual Exposure Calculations ─────────────────────────────────────

// Distance score: 0–35. Closer = higher score.
function calcDistanceScore(distKm: number): number {
  if (distKm <= 50)  return 35;
  if (distKm <= 100) return 28;
  if (distKm <= 200) return 20;
  if (distKm <= 350) return 12;
  if (distKm <= 500) return 5;
  return 0;
}

// Wind exposure: 0–1 based on cyclone wind speed and distance from center
function calcWindExposure(cyclone: Cyclone, distKm: number): number {
  const { r64kt, r34kt } = cyclone.windRadius;
  if (distKm <= r64kt)  return 1.0;
  if (distKm <= r34kt)  return 0.5 + 0.5 * (1 - (distKm - r64kt) / (r34kt - r64kt));
  if (distKm <= r34kt * 1.5) return 0.2 * (1 - (distKm - r34kt) / (r34kt * 0.5));
  return 0;
}

// Wind score: 0–30 from exposure ratio
function calcWindScore(windExposure: number): number {
  return Math.round(windExposure * 30);
}

// Flood exposure: 0–1 based on coastal proximity (simplified: low-lying coastal areas)
// Infrastructure near coast (lng near ~85–87 and lat near coastline) = higher flood risk
function calcFloodExposure(infra: Infrastructure): number {
  const coastalLat = 19.5; // rough Odisha coast latitude centre
  const latDist = Math.abs(infra.latitude - coastalLat);
  // Ports/bridges/shelters near coast get higher flood risk
  const typeMultiplier: Record<string, number> = {
    PORT: 1.0, BRIDGE: 0.85, SHELTER: 0.75, HOSPITAL: 0.65,
    SCHOOL: 0.6, EMERGENCY: 0.7, POWER: 0.6, ROAD: 0.5,
  };
  const base = Math.max(0, 1 - latDist / 3);
  return Math.min(1, base * (typeMultiplier[infra.type] ?? 0.6));
}

// Flood score: 0–20
function calcFloodScore(floodExposure: number): number {
  return Math.round(floodExposure * 20);
}

// Criticality bonus: 0–15 based on asset importance (1–10 scale)
function calcCriticalityBonus(criticality: number): number {
  return Math.round((criticality / 10) * 15);
}

// ─── Risk Classification ───────────────────────────────────────────────────

function classifyRiskLevel(score: number): RiskLevel {
  if (score >= 81) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

// ─── Main Risk Score Function ──────────────────────────────────────────────

export function calculateRiskScore(infra: Infrastructure, cyclone: Cyclone): RiskAssessment {
  const distKm = distanceToTrack(infra, cyclone.track);
  const windExposure = calcWindExposure(cyclone, distKm);
  const floodExposure = calcFloodExposure(infra);

  const distanceScore    = calcDistanceScore(distKm);
  const windScore        = calcWindScore(windExposure);
  const floodScore       = calcFloodScore(floodExposure);
  const criticalityBonus = calcCriticalityBonus(infra.criticality);

  const rawScore = distanceScore + windScore + floodScore + criticalityBonus;
  const score = Math.min(100, Math.max(0, rawScore));

  return {
    infrastructureId: infra.id,
    score,
    level: classifyRiskLevel(score),
    windExposure: Math.round(windExposure * 100) / 100,
    floodExposure: Math.round(floodExposure * 100) / 100,
    distanceToTrack: Math.round(distKm * 10) / 10,
    breakdown: { distanceScore, windScore, floodScore, criticalityBonus },
  };
}

// ─── Batch Assessment ──────────────────────────────────────────────────────

export function assessAllInfrastructure(
  assets: Infrastructure[],
  cyclone: Cyclone
): InfrastructureWithRisk[] {
  return assets
    .map((asset) => ({ ...asset, risk: calculateRiskScore(asset, cyclone) }))
    .sort((a, b) => b.risk.score - a.risk.score); // highest risk first
}

// ─── Risk Summary ──────────────────────────────────────────────────────────

export function buildRiskSummary(assessed: InfrastructureWithRisk[]): RiskSummary {
  return {
    totalAssessed: assessed.length,
    critical: assessed.filter((a) => a.risk.level === "CRITICAL").length,
    high:     assessed.filter((a) => a.risk.level === "HIGH").length,
    medium:   assessed.filter((a) => a.risk.level === "MEDIUM").length,
    low:      assessed.filter((a) => a.risk.level === "LOW").length,
    modelVersion: "prototype-v1",
    disclaimer: "Prototype risk model. Not scientifically validated. For demonstration only.",
  };
}

// ─── Risk Color Mapping ────────────────────────────────────────────────────

export const RISK_COLORS: Record<RiskLevel, string> = {
  LOW:      "#22c55e",
  MEDIUM:   "#eab308",
  HIGH:     "#f97316",
  CRITICAL: "#ef4444",
};

export const RISK_BG_CLASSES: Record<RiskLevel, string> = {
  LOW:      "risk-badge-low",
  MEDIUM:   "risk-badge-medium",
  HIGH:     "risk-badge-high",
  CRITICAL: "risk-badge-critical",
};
