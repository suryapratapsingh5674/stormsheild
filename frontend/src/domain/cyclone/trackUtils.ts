import { Cyclone } from "../../types";

// Calculate a bounding box around the full cyclone track + buffer (km)
export function getTrackBbox(cyclone: Cyclone, bufferKm = 300) {
  const lats = cyclone.track.map((p) => p.lat);
  const lngs = cyclone.track.map((p) => p.lng);

  // 1 degree lat ≈ 111 km, 1 degree lng ≈ 111*cos(lat) km
  const latBuf = bufferKm / 111;
  const lngBuf = bufferKm / (111 * Math.cos(((Math.max(...lats) + Math.min(...lats)) / 2) * Math.PI / 180));

  return {
    minLat: Math.min(...lats) - latBuf,
    maxLat: Math.max(...lats) + latBuf,
    minLng: Math.min(...lngs) - lngBuf,
    maxLng: Math.max(...lngs) + lngBuf,
  };
}

// Get index of current position in track (the last past/present point)
export function getCurrentTrackIndex(track: Cyclone["track"]): number {
  const now = Date.now();
  let current = 0;
  for (let i = 0; i < track.length; i++) {
    const t = track[i].timestamp ? new Date(track[i].timestamp!).getTime() : 0;
    if (t <= now) current = i;
  }
  return current;
}

// Split track into past and forecast segments for rendering
export function splitTrack(track: Cyclone["track"]): {
  past: Cyclone["track"];
  forecast: Cyclone["track"];
  currentIdx: number;
} {
  const currentIdx = getCurrentTrackIndex(track);
  return {
    past: track.slice(0, currentIdx + 1),
    forecast: track.slice(currentIdx),
    currentIdx,
  };
}

// Hours until estimated landfall
export function hoursUntilLandfall(estimatedLandfall?: string): number | null {
  if (!estimatedLandfall) return null;
  const diff = new Date(estimatedLandfall).getTime() - Date.now();
  return Math.max(0, Math.round(diff / 3600000));
}

// Category color for wind speed
export function getCategoryColor(windSpeed: number): string {
  if (windSpeed >= 220) return "#7c3aed"; // Super Cyclonic Storm
  if (windSpeed >= 166) return "#dc2626"; // Extremely Severe
  if (windSpeed >= 118) return "#ea580c"; // Very Severe
  if (windSpeed >= 89)  return "#d97706"; // Severe
  if (windSpeed >= 63)  return "#ca8a04"; // Cyclonic Storm
  return "#16a34a";                        // Depression
}
