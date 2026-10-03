import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchCyclones } from "../services/cycloneService";
import { useAppDispatch } from "../store/store";
import { selectCyclone } from "../store/slices/cycloneSlice";

// TanStack Query owns the cyclone list (server state)
// Redux is notified of the "selected" cyclone for cross-component access
export function useCyclones() {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: ["cyclones"],
    queryFn: fetchCyclones,
    staleTime: 5 * 60_000, // cyclone data changes slowly — 5min fresh window
  });

  // Auto-select the first active cyclone on load
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const active = query.data.find((c) => c.status === "ACTIVE") ?? query.data[0];
      dispatch(selectCyclone(active));
    }
  }, [query.data, dispatch]);

  return query;
}
