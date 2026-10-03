import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchInfrastructure } from "../services/infrastructureService";
import { assessAllInfrastructure, buildRiskSummary } from "../domain/risk/riskEngine";
import { useAppSelector } from "../store/store";
import { InfrastructureType, RiskLevel } from "../types";

// TanStack Query fetches infrastructure (server state)
// Risk engine runs client-side on the result — pure computation, no extra round trip
export function useInfrastructure() {
  const selectedCyclone = useAppSelector((s) => s.cyclone.selectedCyclone);
  const riskFilter = useAppSelector((s) => s.map.activeRiskFilter);
  const typeFilter = useAppSelector((s) => s.map.activeTypeFilter);
  const searchQuery = useAppSelector((s) => s.map.searchQuery);

  const query = useQuery({
    queryKey: ["infrastructure"],
    queryFn: fetchInfrastructure,
    staleTime: 2 * 60_000,
  });

  // Run risk engine on fetched data — memoized so it only re-runs when data or cyclone changes
  const assessed = useMemo(() => {
    if (!query.data?.data || !selectedCyclone) return [];
    return assessAllInfrastructure(query.data.data, selectedCyclone);
  }, [query.data?.data, selectedCyclone]);

  // Build summary — memoized
  const riskSummary = useMemo(() => buildRiskSummary(assessed), [assessed]);

  // Apply filters — memoized to avoid re-filtering on every render
  const filtered = useMemo(() => {
    return assessed.filter((a) => {
      if (riskFilter !== "ALL" && a.risk.level !== riskFilter) return false;
      if (typeFilter !== "ALL" && a.type !== typeFilter) return false;
      if (searchQuery && !a.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [assessed, riskFilter, typeFilter, searchQuery]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    dataSource: query.data?.dataSource ?? "DEMO",
    all: assessed,
    filtered,
    riskSummary,
  };
}
