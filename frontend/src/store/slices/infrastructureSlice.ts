import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InfrastructureWithRisk } from "../../types";

// Redux owns selected infrastructure (drives drawer open/content and AI context)
interface InfrastructureState {
  selectedInfrastructure: InfrastructureWithRisk | null;
  isDrawerOpen: boolean;
}

const initialState: InfrastructureState = {
  selectedInfrastructure: null,
  isDrawerOpen: false,
};

const infrastructureSlice = createSlice({
  name: "infrastructure",
  initialState,
  reducers: {
    selectInfrastructure(state, action: PayloadAction<InfrastructureWithRisk>) {
      state.selectedInfrastructure = action.payload;
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
      state.selectedInfrastructure = null;
    },
  },
});

export const { selectInfrastructure, closeDrawer } = infrastructureSlice.actions;
export default infrastructureSlice.reducer;
