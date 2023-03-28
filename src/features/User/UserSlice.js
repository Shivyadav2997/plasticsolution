import { createSlice } from "@reduxjs/toolkit";
import { logoutApi } from "api/api";
const initialState = {
  user: null,
};

try {
  initialState.user = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : null;
} catch {}
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.user = payload;
      sessionStorage.setItem("userData", JSON.stringify(payload));
    },
    logout: (state, { payload }) => {
      logoutApi();
      state.user = null;
      sessionStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
