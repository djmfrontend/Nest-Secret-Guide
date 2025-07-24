import { createSlice } from "@reduxjs/toolkit";

interface State {
  messgaes: string[];
}

const initialState: State = {
  messgaes: [],
};
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messgaes.push(action.payload);
    },
  },
});

export default messageSlice.reducer;
