import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from "react-leaflet";
import { useMemo, memo, useEffect } from "react";
import { Cyclone, InfrastructureWithRisk } from "../../types";
import { splitTrack } from "../../domain/cyclone/trackUtils";
import { RISK_COLORS } from "../../domain/risk/riskEngine";
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, TILE_URL, TILE_ATTRIBUTION } from "../../lib/constants";
import { useAppDispatch } from "../../store/store";
import { selectInfrastructure } from "../../store/slices/infrastructureSlice";
import ImpactCorridor from "./ImpactCorridor";
import CycloneMarker from "./CycloneMarker";
import MapLegend from "./MapLegend";

interface Props {
  cyclone: Cyclone | null;
  infrastructure: InfrastructureWithRisk[];
}

// Auto-fit map to cyclone track bounds
function MapFitter({ cyclone }: { cyclone: Cyclone | null }) {
  const map = useMap();
  useEffect(() => {
    if (!cyclone || cyclone.track.length === 0) return;
    const lats = cyclone.track.map((p) => p.lat);
    const lngs = cyclone.track.map((p) => p.lng);
    map.fitBounds(
      [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]],
      { padding: [60, 60] }
    );
  }, [cyclone?.id]);
  return null;
}

// Infrastructure markers — memoized to avoid re-rendering all markers on every map pan
const InfraMarkers = memo(({ assets, onSelect }: {
  assets: InfrastructureWithRisk[];
  onSelect: (a: InfrastructureWithRisk) => void;
}) => {
  return (
    <>
      {assets.map((asset) => (
        <CircleMarker
          key={asset.id}
          center={[asset.latitude, asset.longitude]}
          radius={asset.risk.level === "CRITICAL" ? 10 : asset.risk.level === "HIGH" ? 8 : 6}
          pathOptions={{
            color: RISK_COLORS[asset.risk.level],
            fillColor: RISK_COLORS[asset.risk.level],
            fillOpacity: 0.85,
            weight: 2,
          }}
          eventHandlers={{ click: () => onSelect(asset) }}
        >
          <Popup>
            <div className="text-slate-100 min-w-[180px]">
              <div className="font-semibold text-sm mb-1">{asset.name}</div>
              <div className="text-xs text-slate-400 mb-2">{asset.type}</div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: RISK_COLORS[asset.risk.level] + "30", color: RISK_COLORS[asset.risk.level] }}
                >
                  {asset.risk.level}
                </span>
                <span className="text-xs text-slate-400">Score: {asset.risk.score}/100</span>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
});

export default function StormMap({ cyclone, infrastructure }: Props) {
  const dispatch = useAppDispatch();

  const { past, forecast } = useMemo(
    () => (cyclone ? splitTrack(cyclone.track) : { past: [], forecast: [] }),
    [cyclone]
  );

  const pastCoords = past.map((p) => [p.lat, p.lng] as [number, number]);
  const forecastCoords = forecast.map((p) => [p.lat, p.lng] as [number, number]);

  const handleSelect = (asset: InfrastructureWithRisk) => {
    dispatch(selectInfrastructure(asset));
  };

  return (
    <MapContainer
      center={MAP_DEFAULT_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <MapFitter cyclone={cyclone} />

      {/* Past track — solid white line */}
      {pastCoords.length > 1 && (
        <Polyline
          positions={pastCoords}
          pathOptions={{ color: "#94a3b8", weight: 2, dashArray: undefined, opacity: 0.7 }}
        />
      )}

      {/* Forecast track — dashed orange line */}
      {forecastCoords.length > 1 && (
        <Polyline
          positions={forecastCoords}
          pathOptions={{ color: "#f97316", weight: 2.5, dashArray: "8 6", opacity: 0.9 }}
        />
      )}

      {/* Impact corridor polygon */}
      {cyclone && <ImpactCorridor cyclone={cyclone} />}

      {/* Cyclone current position */}
      {cyclone && <CycloneMarker cyclone={cyclone} />}

      {/* Infrastructure markers */}
      <InfraMarkers assets={infrastructure} onSelect={handleSelect} />

      <MapLegend />
    </MapContainer>
  );
}
