import { useCyclones } from "../hooks/useCyclones";
import { Wind, Navigation, Clock, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { hoursUntilLandfall, getCategoryColor } from "../domain/cyclone/trackUtils";
import { Cyclone } from "../types";
import { Loader2 } from "lucide-react";

function CycloneCard({ cyclone }: { cyclone: Cyclone }) {
  const hours = hoursUntilLandfall(cyclone.estimatedLandfall);
  const catColor = getCategoryColor(cyclone.windSpeed);

  return (
    <div className="glass rounded-2xl p-6 hover:border-slate-600/60 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {cyclone.status === "ACTIVE" && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                ACTIVE
              </div>
            )}
            <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{cyclone.dataSource}</span>
          </div>
          <h3 className="text-2xl font-black text-white">{cyclone.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{cyclone.category}</p>
        </div>
        <div
          className="text-4xl font-black"
          style={{ color: catColor }}
        >
          {cyclone.windSpeed}
          <span className="text-sm font-normal text-slate-400 ml-1">km/h</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Wind size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500">Wind</span>
          </div>
          <div className="text-sm font-semibold" style={{ color: catColor }}>{cyclone.windSpeed} km/h</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500">Direction</span>
          </div>
          <div className="text-sm font-semibold text-slate-200">{cyclone.movementDirection}</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500">Position</span>
          </div>
          <div className="text-xs font-semibold text-slate-200">{cyclone.latitude.toFixed(1)}°N, {cyclone.longitude.toFixed(1)}°E</div>
        </div>
        <div className="bg-slate-900/60 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={12} className="text-slate-500" />
            <span className="text-xs text-slate-500">Landfall ETA</span>
          </div>
          <div className={`text-sm font-semibold ${hours !== null && hours < 12 ? "text-red-400" : "text-yellow-400"}`}>
            {hours !== null ? `~${hours}h` : "TBD"}
          </div>
        </div>
      </div>

      {/* Affected districts */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {cyclone.affectedDistricts.map((d) => (
          <span key={d} className="text-xs bg-orange-500/10 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded-full">{d}</span>
        ))}
      </div>

      <Link
        to="/dashboard"
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all w-full"
      >
        Analyze Impact
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function Cyclones() {
  const { data: cyclones, isLoading, isError } = useCyclones();

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Active Cyclones</h1>
          <p className="text-slate-400 text-sm">Tracked cyclones in the Bay of Bengal and Arabian Sea region</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-400" />
          </div>
        )}

        {isError && (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-slate-400">Failed to load cyclone data. Using demo data.</p>
          </div>
        )}

        {cyclones && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cyclones.map((c) => <CycloneCard key={c.id} cyclone={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
