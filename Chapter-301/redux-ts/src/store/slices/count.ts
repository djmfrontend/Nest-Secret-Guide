import { createSlice } from "@reduxjs/toolkit";

interface ICountState {
  value: number;
}
const initialState: ICountState = {
  value: 0,
};
const count = createSlice({
  name: "count",
  initialState: initialState,
  reducers: {
    add(state, action) {
      state.value += action.payload;
    },
    sub(state, action) {
      state.value -= action.payload;
    },
  },
});

export default count.reducer;
export const { add, sub } = count.actions;
