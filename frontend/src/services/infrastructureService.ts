import axios from "axios";
import { Infrastructure } from "../types";
import { demoInfrastructure } from "../data/demoInfrastructure";
import { API_BASE } from "../lib/constants";

export async function fetchInfrastructure(): Promise<{ data: Infrastructure[]; dataSource: "LIVE" | "DEMO" }> {
  try {
    const { data } = await axios.get(`${API_BASE}/api/infrastructure`, { timeout: 5000 });
    if (data.success && data.data?.length > 0) {
      return { data: data.data, dataSource: data.dataSource ?? "LIVE" };
    }
    return { data: demoInfrastructure, dataSource: "DEMO" };
  } catch {
    return { data: demoInfrastructure, dataSource: "DEMO" };
  }
}
