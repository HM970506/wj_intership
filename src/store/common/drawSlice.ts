import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PEN } from "../../components/newactivitytool/types";

const drawSlice = createSlice({
  name: "drawReducer",
  initialState: { tool: "pencil", color: "green", size: 5 },

  reducers: {
    reset: (state) => {
      state = { tool: "pencil", color: "black", size: 5 };
    },
    toolChange: (state, action: PayloadAction<string>) => {
      state.tool = action.payload;
    },
    colorChange: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    sizeChange: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
  },
});

export const drawActions = drawSlice.actions;
export default drawSlice.reducer;
