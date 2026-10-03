// Shared types mirror frontend types — keep in sync
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type InfrastructureType = "HOSPITAL" | "BRIDGE" | "ROAD" | "SCHOOL" | "POWER" | "EMERGENCY" | "PORT" | "SHELTER";

export interface Coordinate {
  lat: number;
  lng: number;
  timestamp?: string;
  windSpeed?: number;
}

export interface Cyclone {
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
  windRadius: { r34kt: number; r64kt: number };
  estimatedLandfall?: string;
  affectedDistricts: string[];
}

export interface Infrastructure {
  id: string;
  name: string;
  type: InfrastructureType;
  latitude: number;
  longitude: number;
  criticality: number;
  capacity?: number;
  tags?: Record<string, string>;
}
