import { useAppDispatch, useAppSelector } from "../../store/store";
import { setRiskFilter, setTypeFilter, setSearchQuery } from "../../store/slices/mapSlice";
import { RiskLevel, InfrastructureType } from "../../types";
import { Search, Filter } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { useState, useEffect } from "react";

const RISK_LEVELS: (RiskLevel | "ALL")[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const TYPE_FILTERS: { value: InfrastructureType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "HOSPITAL", label: "Hospitals" },
  { value: "POWER", label: "Power" },
  { value: "BRIDGE", label: "Bridges" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "SHELTER", label: "Shelters" },
  { value: "PORT", label: "Ports" },
];

const RISK_COLORS_MAP: Record<string, string> = {
  ALL: "#64748b", CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#22c55e",
};

export default function InfraFilter() {
  const dispatch = useAppDispatch();
  const riskFilter = useAppSelector((s) => s.map.activeRiskFilter);
  const typeFilter = useAppSelector((s) => s.map.activeTypeFilter);

  const [localSearch, setLocalSearch] = useState("");
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  return (
    <div className="glass rounded-xl p-3 flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search infrastructure..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Risk filter */}
      <div>
        <div className="text-xs text-slate-500 mb-1.5 flex items-center gap-1">
          <Filter size={10} />Risk Level
        </div>
        <div className="flex gap-1 flex-wrap">
          {RISK_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => dispatch(setRiskFilter(level))}
              className={`text-xs px-2 py-1 rounded-md border transition-all ${
                riskFilter === level
                  ? "border-transparent text-white font-medium"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
              style={riskFilter === level ? { background: RISK_COLORS_MAP[level] + "30", borderColor: RISK_COLORS_MAP[level] + "60", color: RISK_COLORS_MAP[level] } : {}}
            >
              {level === "ALL" ? "All" : level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div>
        <div className="text-xs text-slate-500 mb-1.5">Type</div>
        <div className="flex gap-1 flex-wrap">
          {TYPE_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => dispatch(setTypeFilter(value as InfrastructureType | "ALL"))}
              className={`text-xs px-2 py-1 rounded-md border transition-all ${
                typeFilter === value
                  ? "bg-blue-600/30 border-blue-500/50 text-blue-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
