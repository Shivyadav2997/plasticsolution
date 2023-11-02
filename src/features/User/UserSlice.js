import { createSlice } from "@reduxjs/toolkit";
import { logoutApi } from "api/api";
const initialState = {
  user: null,
  loading: false,
  fyear: "",
  collapseSidebar: false,
  isSidebarOpen: false,
};

try {
  initialState.user = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null;
} catch {}

try {
  initialState.fyear = localStorage.getItem("fyear")
    ? localStorage.getItem("fyear")
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
      state.fyear = getFinancialYear();
      localStorage.setItem("userData", JSON.stringify(payload));
      localStorage.setItem("fyear", state.fyear);
    },
    logout: (state, { payload }) => {
      logoutApi();
      state.user = null;
      localStorage.removeItem("fyear", payload);
      localStorage.removeItem("userData");
    },
    setLoader: (state, { payload }) => {
      state.loading = payload;
    },
    setFyear: (state, { payload }) => {
      state.fyear = payload;
      localStorage.setItem("fyear", payload);
    },
    toggleSidebar: (state, { payload }) => {
      state.collapseSidebar = payload;
    },
    keepSidebar: (state, { payload }) => {
      state.isSidebarOpen = payload;
    },
  },
});

export const {
  login,
  logout,
  setLoader,
  setFyear,
  toggleSidebar,
  keepSidebar,
} = userSlice.actions;

export default userSlice.reducer;
