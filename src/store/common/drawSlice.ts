import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const drawSlice = createSlice({
  name: "drawReducer",
  initialState: {
    pencil: { color: "black", size: 1 },
    back: { color: "black", size: 1 },
    spray: { color: "black", size: 1 },
    eraser: { size: 1 },
  },

  reducers: {
    setPencil: (
      state,
      action: PayloadAction<{ color: string; size: number }>
    ) => {
      state.pencil = action.payload;
    },
    setBackgroundBrush: (
      state,
      action: PayloadAction<{ color: string; size: number }>
    ) => {
      state.back = action.payload;
    },
    setSpray: (
      state,
      action: PayloadAction<{ color: string; size: number }>
    ) => {
      state.spray = action.payload;
    },
    setEraser: (
      state,
      action: PayloadAction<{ color: string; size: number }>
    ) => {
      state.eraser = action.payload;
    },
  },
});

export const drawActions = drawSlice.actions;
export default drawSlice.reducer;