import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InfrastructureType, RiskLevel } from "../../types";

// Redux owns UI/filter state — shared across Sidebar, Map, FilterBar
interface MapState {
  activeRiskFilter: RiskLevel | "ALL";
  activeTypeFilter: InfrastructureType | "ALL";
  isAIPanelOpen: boolean;
  searchQuery: string;
}

const initialState: MapState = {
  activeRiskFilter: "ALL",
  activeTypeFilter: "ALL",
  isAIPanelOpen: false,
  searchQuery: "",
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setRiskFilter(state, action: PayloadAction<RiskLevel | "ALL">) {
      state.activeRiskFilter = action.payload;
    },
    setTypeFilter(state, action: PayloadAction<InfrastructureType | "ALL">) {
      state.activeTypeFilter = action.payload;
    },
    toggleAIPanel(state) {
      state.isAIPanelOpen = !state.isAIPanelOpen;
    },
    closeAIPanel(state) {
      state.isAIPanelOpen = false;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setRiskFilter, setTypeFilter, toggleAIPanel, closeAIPanel, setSearchQuery } = mapSlice.actions;
export default mapSlice.reducer;
