// ─── Shared Domain Types ───────────────────────────────────────────────────
// Note: Using 'export type' for all interfaces for Vite/ESM compatibility

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type InfrastructureType =
  | "HOSPITAL"
  | "BRIDGE"
  | "ROAD"
  | "SCHOOL"
  | "POWER"
  | "EMERGENCY"
  | "PORT"
  | "SHELTER";

export type Coordinate = {
  lat: number;
  lng: number;
  timestamp?: string;
  windSpeed?: number;
};

export type Cyclone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  windSpeed: number;
  category: string;
  movementDirection: string;
  movementSpeed: number;
  pressureHpa: number;
  status: "ACTIVE" | "FORECAST" | "HISTORICAL";
  dataSource: "LIVE" | "DEMO";
  track: Coordinate[];
  windRadius: {
    r34kt: number;
    r64kt: number;
  };
  estimatedLandfall?: string;
  affectedDistricts: string[];
};

export type Infrastructure = {
  id: string;
  name: string;
  type: InfrastructureType;
  latitude: number;
  longitude: number;
  criticality: number;
  capacity?: number;
  tags?: Record<string, string>;
};

export type RiskAssessment = {
  infrastructureId: string;
  score: number;
  level: RiskLevel;
  windExposure: number;
  floodExposure: number;
  distanceToTrack: number;
  breakdown: {
    distanceScore: number;
    windScore: number;
    floodScore: number;
    criticalityBonus: number;
  };
};

export type InfrastructureWithRisk = Infrastructure & {
  risk: RiskAssessment;
};

export type RiskSummary = {
  totalAssessed: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  modelVersion: string;
  disclaimer: string;
};

export type AIMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};
