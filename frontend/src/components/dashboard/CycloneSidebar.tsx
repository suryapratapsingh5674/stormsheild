import { Wind, Navigation, Gauge, Clock, MapPin, AlertTriangle } from "lucide-react";
import { Cyclone } from "../../types";
import { hoursUntilLandfall, getCategoryColor } from "../../domain/cyclone/trackUtils";
import { RiskSummary } from "../../types";

interface Props {
  cyclone: Cyclone;
  riskSummary: RiskSummary;
  dataSource: "LIVE" | "DEMO";
}

function StatRow({ icon: Icon, label, value, valueClass = "" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-800/60 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className={`text-sm font-semibold truncate ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}

export default function CycloneSidebar({ cyclone, riskSummary, dataSource }: Props) {
  const hours = hoursUntilLandfall(cyclone.estimatedLandfall);
  const catColor = getCategoryColor(cyclone.windSpeed);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
      {/* Header */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Active</span>
              {dataSource === "DEMO" && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30">
                  DEMO
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white">{cyclone.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{cyclone.category}</p>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
            style={{ background: catColor + "20", border: `2px solid ${catColor}60`, color: catColor }}
          >
            ⌀
          </div>
        </div>

        <div className="flex flex-col">
          <StatRow icon={Wind} label="Wind Speed" value={`${cyclone.windSpeed} km/h`} valueClass="text-orange-400" />
          <StatRow icon={Gauge} label="Pressure" value={`${cyclone.pressureHpa} hPa`} />
          <StatRow icon={Navigation} label="Movement" value={`${cyclone.movementDirection} @ ${cyclone.movementSpeed} km/h`} />
          <StatRow icon={MapPin} label="Position" value={`${cyclone.latitude.toFixed(2)}°N, ${cyclone.longitude.toFixed(2)}°E`} />
          <StatRow
            icon={Clock}
            label="Est. Landfall"
            value={hours !== null ? `~${hours} hours` : "Calculating..."}
            valueClass={hours !== null && hours < 12 ? "text-red-400" : "text-yellow-400"}
          />
        </div>
      </div>

      {/* Affected districts */}
      <div className="glass rounded-xl p-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Affected Districts
        </div>
        <div className="flex flex-wrap gap-1.5">
          {cyclone.affectedDistricts.map((d) => (
            <span key={d} className="text-xs bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5 rounded-full">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Risk summary */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-orange-400" />
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Infrastructure Risk
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-black text-red-400">{riskSummary.critical}</div>
            <div className="text-xs text-red-400/70">Critical</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-black text-orange-400">{riskSummary.high}</div>
            <div className="text-xs text-orange-400/70">High</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-black text-yellow-400">{riskSummary.medium}</div>
            <div className="text-xs text-yellow-400/70">Medium</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
            <div className="text-2xl font-black text-green-400">{riskSummary.low}</div>
            <div className="text-xs text-green-400/70">Low</div>
          </div>
        </div>
        <div className="mt-3 text-center text-xs text-slate-500">
          {riskSummary.totalAssessed} assets assessed · Prototype Risk Model
        </div>
      </div>
    </div>
  );
}
