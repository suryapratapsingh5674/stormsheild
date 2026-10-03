import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import cycloneReducer from "./slices/cycloneSlice";
import infrastructureReducer from "./slices/infrastructureSlice";
import mapReducer from "./slices/mapSlice";

export const store = configureStore({
  reducer: {
    cyclone: cycloneReducer,
    infrastructure: infrastructureReducer,
    map: mapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks — use these instead of raw useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
