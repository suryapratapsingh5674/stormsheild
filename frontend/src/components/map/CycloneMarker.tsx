import { CircleMarker, Popup } from "react-leaflet";
import { Cyclone } from "../../types";
import { hoursUntilLandfall, getCategoryColor } from "../../domain/cyclone/trackUtils";

interface Props {
  cyclone: Cyclone;
}

export default function CycloneMarker({ cyclone }: Props) {
  const hours = hoursUntilLandfall(cyclone.estimatedLandfall);
  const color = getCategoryColor(cyclone.windSpeed);

  return (
    <>
      {/* Outer pulsing ring */}
      <CircleMarker
        center={[cyclone.latitude, cyclone.longitude]}
        radius={28}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.08,
          weight: 1.5,
          opacity: 0.4,
        }}
        interactive={false}
      />
      {/* Middle ring */}
      <CircleMarker
        center={[cyclone.latitude, cyclone.longitude]}
        radius={18}
        pathOptions={{
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          weight: 1,
          opacity: 0.6,
        }}
        interactive={false}
      />
      {/* Core marker — clickable */}
      <CircleMarker
        center={[cyclone.latitude, cyclone.longitude]}
        radius={10}
        pathOptions={{
          color: "#fff",
          fillColor: color,
          fillOpacity: 1,
          weight: 2.5,
        }}
      >
        <Popup>
          <div className="min-w-[220px]">
            <div className="font-bold text-base mb-1">{cyclone.name}</div>
            <div className="text-xs text-slate-400 mb-3">{cyclone.category}</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-slate-500">Wind Speed</div>
                <div className="font-semibold text-orange-400">{cyclone.windSpeed} km/h</div>
              </div>
              <div>
                <div className="text-slate-500">Pressure</div>
                <div className="font-semibold">{cyclone.pressureHpa} hPa</div>
              </div>
              <div>
                <div className="text-slate-500">Direction</div>
                <div className="font-semibold">{cyclone.movementDirection}</div>
              </div>
              <div>
                <div className="text-slate-500">Landfall ETA</div>
                <div className="font-semibold text-red-400">
                  {hours !== null ? `~${hours}h` : "Unknown"}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 border-t border-slate-700 pt-2">
              Source: {cyclone.dataSource}
            </div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  );
}
