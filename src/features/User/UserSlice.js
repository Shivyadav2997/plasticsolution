import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  user: null,
  type: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload, type }) => {
      state.id = payload.id;
      state.user = payload;
      state.type = type;
    },
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
