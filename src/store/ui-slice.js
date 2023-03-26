import { createSlice } from "@reduxjs/toolkit";

const initialState = { cartIsVisible: false }; //Cart is visible or not visible

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;
