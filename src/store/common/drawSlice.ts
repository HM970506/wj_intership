import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PEN } from "../../components/newactivitytool/types";

const drawSlice = createSlice({
  name: "drawReducer",
  initialState: { tool: "pencil", color: "black", size: 5 },

  reducers: {
    toolChange: (state, action: PayloadAction<any>) => {
      state.tool = action.payload;
    },
    colorChange: (state, action: PayloadAction<any>) => {
      state.color = action.payload;
    },
    sizeChange: (state, action: PayloadAction<any>) => {
      state.size = action.payload;
    },
  },
});

export const drawActions = drawSlice.actions;
export default drawSlice.reducer;
