import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    expiresAt: localStorage.getItem("expiresAt") || null,
    first_name: localStorage.getItem("first_name") || null,
    last_name: localStorage.getItem("last_name") || null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
      localStorage.setItem("refreshToken", action.payload);
    },
    setExpiresAt: (state, action) => {
      state.expiresAt = action.payload;
      localStorage.setItem("expiresAt", action.payload);
    },

    setFirstName: (state, action) => {
      state.first_name = action.payload;
      localStorage.setItem("first_name", action.payload);

    },
    setLastName: (state, action) => {
      state.last_name = action.payload;
      localStorage.setItem("last_name", action.payload);

    },

    logout: (state) => {
      state.token = null;
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("expiresAt");
    },
  },
});

export const { setToken, setRefreshToken, setExpiresAt, setFirstName, setLastName, logout } =
  userSlice.actions;
export default userSlice.reducer;
