import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  user: AuthUser | null;
  status: "idle" | "loading" | "ready";
};

const initialState: AuthState = {
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading(state) {
      state.status = "loading";
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.status = "ready";
    },
    clearUser(state) {
      state.user = null;
      state.status = "ready";
    },
  },
});

export const { setAuthLoading, setUser, clearUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
