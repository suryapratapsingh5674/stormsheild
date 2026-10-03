import { X, Building2, Zap, Waypoints, GraduationCap, Heart, Shield, Anchor, Home, ExternalLink } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { closeDrawer } from "../../store/slices/infrastructureSlice";
import { RISK_COLORS, RISK_BG_CLASSES } from "../../domain/risk/riskEngine";
import { InfrastructureType } from "../../types";

const TYPE_ICONS: Record<InfrastructureType, React.ElementType> = {
  HOSPITAL: Heart,
  POWER: Zap,
  BRIDGE: Waypoints,
  SCHOOL: GraduationCap,
  EMERGENCY: Shield,
  PORT: Anchor,
  SHELTER: Home,
  ROAD: ExternalLink,
};

const TYPE_LABELS: Record<InfrastructureType, string> = {
  HOSPITAL: "Medical Facility", POWER: "Power Infrastructure", BRIDGE: "Bridge / Crossing",
  SCHOOL: "School / Shelter", EMERGENCY: "Emergency Services", PORT: "Port / Harbor",
  SHELTER: "Cyclone Shelter", ROAD: "Road / Highway",
};

function ScoreBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="w-full bg-slate-800 rounded-full h-1.5">
      <div
        className="h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%`, background: color }}
      />
    </div>
  );
}

function ExposureRow({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#ef4444" : pct >= 60 ? "#f97316" : pct >= 40 ? "#eab308" : "#22c55e";
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium" style={{ color }}>{pct}%</span>
      </div>
      <ScoreBar value={pct} color={color} />
    </div>
  );
}

export default function InfraDrawer() {
  const dispatch = useAppDispatch();
  const { selectedInfrastructure: asset, isDrawerOpen } = useAppSelector((s) => s.infrastructure);

  if (!isDrawerOpen || !asset) return null;

  const Icon = TYPE_ICONS[asset.type] ?? Building2;
  const riskColor = RISK_COLORS[asset.risk.level];
  const riskClass = RISK_BG_CLASSES[asset.risk.level];

  const recommendedActions: Record<string, string[]> = {
    CRITICAL: [
      "Immediately dispatch NDRF/SDRF teams for structural assessment",
      "Activate emergency evacuation protocols",
      "Establish backup power and communication systems",
      "Coordinate with district administration for resource pre-positioning",
    ],
    HIGH: [
      "Place on priority monitoring list",
      "Pre-position emergency response teams nearby",
      "Verify structural integrity and emergency exits",
      "Establish direct communication channel with facility",
    ],
    MEDIUM: [
      "Include in standard monitoring rotation",
      "Verify emergency preparedness plans are activated",
      "Coordinate with local authorities for support",
    ],
    LOW: [
      "Standard monitoring — reassess if cyclone track shifts",
      "Ensure facility has received storm advisories",
    ],
  };

  const actions = recommendedActions[asset.risk.level] ?? [];

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] z-[2000] flex flex-col slide-in-right shadow-2xl">
      <div className="glass-dark h-full flex flex-col overflow-hidden border-l border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-slate-800/60">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: riskColor + "20", border: `1px solid ${riskColor}40` }}
          >
            <Icon size={18} style={{ color: riskColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight">{asset.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{TYPE_LABELS[asset.type]}</p>
          </div>
          <button
            onClick={() => dispatch(closeDrawer())}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {/* Risk Score */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 font-medium">Risk Assessment</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${riskClass}`}>
                {asset.risk.level}
              </span>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <div className="text-5xl font-black" style={{ color: riskColor }}>{asset.risk.score}</div>
              <div className="text-slate-500 text-sm pb-1">/100</div>
            </div>
            <ScoreBar value={asset.risk.score} color={riskColor} />
            <div className="text-xs text-slate-600 mt-2">Prototype Risk Model — Not scientifically validated</div>
          </div>

          {/* Exposure breakdown */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Exposure Breakdown</div>
            <div className="flex flex-col gap-3">
              <ExposureRow label="Wind Exposure" value={asset.risk.windExposure} />
              <ExposureRow label="Flood / Surge Exposure" value={asset.risk.floodExposure} />
              <div className="flex justify-between text-xs border-t border-slate-800 pt-3 mt-1">
                <span className="text-slate-400">Distance to Track</span>
                <span className="font-semibold text-slate-200">{asset.risk.distanceToTrack} km</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Asset Criticality</span>
                <span className="font-semibold text-slate-200">{asset.criticality}/10</span>
              </div>
              {asset.capacity && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-semibold text-slate-200">{asset.capacity.toLocaleString()} people</span>
                </div>
              )}
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Score Components</div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Distance", value: asset.risk.breakdown.distanceScore, max: 35 },
                { label: "Wind", value: asset.risk.breakdown.windScore, max: 30 },
                { label: "Flood", value: asset.risk.breakdown.floodScore, max: 20 },
                { label: "Criticality", value: asset.risk.breakdown.criticalityBonus, max: 15 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20">{item.label}</span>
                  <div className="flex-1">
                    <ScoreBar value={item.value} max={item.max} color={riskColor} />
                  </div>
                  <span className="text-xs font-mono text-slate-300 w-10 text-right">{item.value}/{item.max}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended actions */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Recommended Actions
            </div>
            <div className="flex flex-col gap-2">
              {actions.map((action, i) => (
                <div key={i} className="flex gap-2.5 text-xs text-slate-300">
                  <span
                    className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: riskColor + "25", color: riskColor }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div className="text-xs text-slate-600 text-center pb-2">
            {asset.latitude.toFixed(4)}°N, {asset.longitude.toFixed(4)}°E · ID: {asset.id}
          </div>
        </div>
      </div>
    </div>
  );
}
