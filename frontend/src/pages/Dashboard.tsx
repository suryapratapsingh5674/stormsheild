import { useMemo } from "react";
import { useCyclones } from "../hooks/useCyclones";
import { useInfrastructure } from "../hooks/useInfrastructure";
import { useAppSelector } from "../store/store";
import StormMap from "../components/map/StormMap";
import CycloneSidebar from "../components/dashboard/CycloneSidebar";
import InfraFilter from "../components/dashboard/InfraFilter";
import InfraDrawer from "../components/infrastructure/InfraDrawer";
import AIAssistant from "../components/ai/AIAssistant";
import { Loader2, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { isLoading: cycloneLoading } = useCyclones();
  const { filtered, all, riskSummary, dataSource, isLoading: infraLoading } = useInfrastructure();
  const selectedCyclone = useAppSelector((s) => s.cyclone.selectedCyclone);

  // Build context for AI — only critical/high assets to keep prompt focused
  const criticalAssets = useMemo(
    () =>
      all
        .filter((a) => a.risk.level === "CRITICAL" || a.risk.level === "HIGH")
        .slice(0, 10)
        .map((a) => ({ name: a.name, type: a.type, score: a.risk.score, level: a.risk.level, distanceToTrack: a.risk.distanceToTrack })),
    [all]
  );

  const riskSummaryForAI = useMemo(
    () => ({ ...riskSummary } as Record<string, unknown>),
    [riskSummary]
  );

  if (cycloneLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-400" />
          <p className="text-slate-400 text-sm">Loading cyclone data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-72 flex-shrink-0 flex flex-col gap-3 p-3 border-r border-slate-800/60 overflow-y-auto bg-slate-950/50">
        {selectedCyclone ? (
          <CycloneSidebar
            cyclone={selectedCyclone}
            riskSummary={riskSummary}
            dataSource={dataSource}
          />
        ) : (
          <div className="flex items-center gap-2 text-slate-500 text-sm p-4">
            <AlertTriangle size={16} />
            No active cyclone data
          </div>
        )}
        <InfraFilter />
      </aside>

      {/* Map */}
      <div className="flex-1 relative">
        {infraLoading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] glass rounded-full px-4 py-2 flex items-center gap-2 text-xs text-slate-300">
            <Loader2 size={12} className="animate-spin" />
            Loading infrastructure data...
          </div>
        )}
        <StormMap cyclone={selectedCyclone} infrastructure={filtered} />
      </div>

      {/* Right drawers — layered */}
      <InfraDrawer />
      <AIAssistant riskSummary={riskSummaryForAI} criticalAssets={criticalAssets} />
    </div>
  );
}
