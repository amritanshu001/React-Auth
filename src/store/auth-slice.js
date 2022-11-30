import { createSlice } from "@reduxjs/toolkit";

const initialState = { userLoggedIn: false, authToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logUserIn: (state, action) => {
      state.userLoggedIn = true;
      state.authToken = action.payload.authToken;
      localStorage.setItem("token", action.payload.authToken);
    },
    logUserOut: (state) => {
      state.userLoggedIn = false;
      state.authToken = null;
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
