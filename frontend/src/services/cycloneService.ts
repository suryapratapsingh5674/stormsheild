import axios from "axios";
import { Cyclone } from "../types";
import { demoCyclone } from "../data/demoCyclone";
import { API_BASE } from "../lib/constants";

// Fetches cyclone data from backend, falls back to demo data on failure
export async function fetchCyclones(): Promise<Cyclone[]> {
  try {
    const { data } = await axios.get(`${API_BASE}/api/cyclones`);
    if (data.success && data.data?.length > 0) return data.data;
    return [demoCyclone];
  } catch {
    // Backend unavailable — use demo data silently
    return [demoCyclone];
  }
}
