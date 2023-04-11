import { createSlice } from "@reduxjs/toolkit";
import { logoutApi } from "api/api";
const initialState = {
  user: null,
  loading: false,
  fyear: "",
};

try {
  initialState.user = sessionStorage.getItem("userData")
    ? JSON.parse(sessionStorage.getItem("userData"))
    : null;
} catch {}

try {
  initialState.fyear = sessionStorage.getItem("fyear")
    ? sessionStorage.getItem("fyear")
    : "";
} catch {}

function getFinancialYear() {
  var fiscalyear = "";
  var today = new Date();
  if (today.getMonth() + 1 <= 3) {
    fiscalyear =
      (today.getFullYear() - 1).toString().substring(2, 4) +
      "-" +
      today.getFullYear().toString().substring(2, 4);
  } else {
    fiscalyear =
      today.getFullYear().toString().substring(2, 4) +
      "-" +
      (today.getFullYear() + 1).toString().substring(2, 4);
  }
  return fiscalyear;
}
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.user = payload;
      state.user = getFinancialYear();
      sessionStorage.setItem("userData", JSON.stringify(payload));
      sessionStorage.setItem("fyear", state.user);
    },
    logout: (state, { payload }) => {
      logoutApi();
      state.user = null;
      sessionStorage.removeItem("fyear", payload);
      sessionStorage.removeItem("userData");
    },
    setLoader: (state, { payload }) => {
      state.loading = payload;
    },
    setFyear: (state, { payload }) => {
      state.fyear = payload;
      sessionStorage.setItem("fyear", payload);
      window.location.reload();
    },
  },
});

export const { login, logout, setLoader, setFyear } = userSlice.actions;

export default userSlice.reducer;
