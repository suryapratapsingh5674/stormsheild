import { Polygon } from "react-leaflet";
import { useMemo } from "react";
import { Cyclone } from "../../types";
import { CORRIDOR_BUFFER_KM } from "../../lib/constants";

interface Props {
  cyclone: Cyclone;
}

// Build a simple bounding-box corridor around the track
// This is a visually effective approximation — turf.js buffer would be more accurate but adds complexity
function buildCorridorPolygon(track: Cyclone["track"], bufferKm: number): [number, number][] {
  if (track.length < 2) return [];

  const latBuf = bufferKm / 111;
  // Create a polygon that wraps around the track with a buffer
  const upper: [number, number][] = track.map((p) => [p.lat + latBuf, p.lng] as [number, number]);
  const lower: [number, number][] = [...track].reverse().map((p) => [p.lat - latBuf, p.lng] as [number, number]);

  return [...upper, ...lower];
}

export default function ImpactCorridor({ cyclone }: Props) {
  const corridorPolygon = useMemo(
    () => buildCorridorPolygon(cyclone.track, CORRIDOR_BUFFER_KM),
    [cyclone.id, cyclone.track.length]
  );

  if (corridorPolygon.length === 0) return null;

  return (
    <Polygon
      positions={corridorPolygon}
      pathOptions={{
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.08,
        weight: 1.5,
        opacity: 0.5,
        dashArray: "6 4",
      }}
    />
  );
}
