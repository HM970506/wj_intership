import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const nodeSlice = createSlice({
  name: "nodeReducer",
  initialState: {
    canvas: null,
    isDrawing: false,
    isPanning: false,
    textareaContainer: null,
    opacity: 0,
    zoom: 1,
  },

  reducers: {
    setCanvas: (state, action: PayloadAction<any>) => {
      state.canvas = action.payload;
      //console.log(JSON.stringify(action.payload));
    },
    setTextareaContainer: (state, action: PayloadAction<any>) => {
      state.textareaContainer = action.payload;
      //console.log(JSON.stringify(action.payload));
    },

    setOpacity: (state, action: PayloadAction<any>) => {
      state.opacity = action.payload;
      //console.log(JSON.stringify(action.payload));
    },
    setZoom: (state, action: PayloadAction<any>) => {
      state.opacity = action.payload;
      //console.log(JSON.stringify(action.payload));
    },
    setDraw: (state, action: PayloadAction<any>) => {
      state.isDrawing = action.payload;
      state.isPanning = false;
    },

    setPan: (state, action: PayloadAction<any>) => {
      state.isPanning = action.payload;
      state.isDrawing = false;
    },
  },
});

export const nodeActions = nodeSlice.actions;
export default nodeSlice.reducer;
