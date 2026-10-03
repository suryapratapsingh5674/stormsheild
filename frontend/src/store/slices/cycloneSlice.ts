import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cyclone } from "../../types";

// Redux owns the *selected* cyclone (UI state) — not the list of cyclones (TanStack Query owns that)
interface CycloneState {
  selectedCycloneId: string | null;
  selectedCyclone: Cyclone | null;
}

const initialState: CycloneState = {
  selectedCycloneId: null,
  selectedCyclone: null,
};

const cycloneSlice = createSlice({
  name: "cyclone",
  initialState,
  reducers: {
    selectCyclone(state, action: PayloadAction<Cyclone>) {
      state.selectedCycloneId = action.payload.id;
      state.selectedCyclone = action.payload;
    },
    clearCyclone(state) {
      state.selectedCycloneId = null;
      state.selectedCyclone = null;
    },
  },
});

export const { selectCyclone, clearCyclone } = cycloneSlice.actions;
export default cycloneSlice.reducer;
