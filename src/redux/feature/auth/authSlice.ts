/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-shadow */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EXPIRES_IN } from "../../../constants/values";
import { User } from "../../../constants/types";
// import { RootState, AppThunk } from '../../store';
import {
  checkTimeout,
  forgotPassword,
  logout,
  setAuthToken,
} from "./authApiSlice";

// Get user from localStorage

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const hasPin = localStorage.getItem("hasPin");

export interface AuthState {
  userId: string | null;
  user: User | null;
  hasPin: boolean;
  error: string | null;
  message: string | null;
  loading: boolean;
  token: string | null;
  isAuthenticated: boolean;
  authType: "google" | "default";
}

const initialState: AuthState = {
  userId: null,
  user: user ? JSON.parse(user) : null,
  hasPin: !!hasPin,
  message: null,
  error: null,
  loading: false,
  token: token ? JSON.parse(token) : "",
  isAuthenticated: !!token,
  authType: "default",
};

export const forgotPasswordAsync = createAsyncThunk(
  "auth/forgot-password",
  async (email: string, thunkAPI) => {
    try {
      const response = await forgotPassword(email);
      return response;
    } catch (error) {
      // return error
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  await logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onSignUp: (
      state: AuthState,
      action: PayloadAction<{ message: string; url: string; email: string }>
    ) => {
      state.authType = "default";
      state.message = action.payload.message;
    },
    onGoogleSignUp: (
      state: AuthState,
      action: PayloadAction<{ message: string; url: string; email: string }>
    ) => {
      state.authType = "google";
      state.message = `${action.payload.message}. Sign in with google`;
    },
    onLogin: (
      state: AuthState,
      action: PayloadAction<{
        data: User;
        message: string;
        hasPin: boolean;
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
      }>
    ) => {
      const { data, message, hasPin, access, refresh } = action.payload;
      state.authType = "default";
      state.loading = false;
      state.user = data;
      state.message = message;
      state.hasPin = hasPin || data.preferences.length > 0;
      state.userId = data.id;
      state.token = access.token;
      state.isAuthenticated = true;
      console.log(access.token);
      setAuthToken(access.token);
      localStorage.setItem("hasPin", `${hasPin}`);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", JSON.stringify(access.token));
      localStorage.setItem("refreshToken", JSON.stringify(refresh.token));
      localStorage.setItem("expirationDate", `${access.expires}`);
      checkTimeout(EXPIRES_IN);
      console.log(action.payload);
    },
    onGoogleLogin: (
      state: AuthState,
      action: PayloadAction<{
        user: User;
        message: string;
        hasPin: boolean;
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
      }>
    ) => {
      const { user, message, hasPin, access, refresh } = action.payload;
      state.authType = "google";
      state.loading = false;
      state.user = user;
      state.message = message;
      state.hasPin = hasPin || user.preferences.length > 0;
      state.userId = user.id;
      state.token = access.token;
      state.isAuthenticated = true;
      console.log(access.token);
      setAuthToken(access.token);
      localStorage.setItem("hasPin", `${hasPin}`);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(access.token));
      localStorage.setItem("refreshToken", JSON.stringify(refresh.token));
      localStorage.setItem("expirationDate", `${access.expires}`);
      checkTimeout(EXPIRES_IN);
      console.log(action.payload);
    },
    logoutUser: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = null;
      state.userId = null;
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.message = action.payload;
      localStorage.clear();
    },
    tokenReceived: (
      state,
      action: PayloadAction<{
        access: { token: string; expires: string };
        refresh: { token: string; expires: string };
      }>
    ) => {
      const { access, refresh } = action.payload;
      state.token = access.token;
      localStorage.setItem("refreshToken", JSON.stringify(refresh.token));
      localStorage.setItem("token", JSON.stringify(access.token));
      localStorage.setItem("expirationDate", `${access.expires}`);
    },
    resetPassword: (
      state,
      action: PayloadAction<{ message: string; redirectUrl: string }>
    ) => {
      state.message = action.payload.message;
    },
    onEditAuthUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    onFirstLogin: (state) => {
      state.message = "You are all set up!";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.userId = null;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      .addCase(forgotPasswordAsync.pending, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = "";
        state.loading = true;
      })
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action?.payload?.message;
      })
      .addCase(forgotPasswordAsync.rejected, (state) => {
        state.message = "Success";
        state.loading = false;
      });
  },
});

export const {
  logoutUser,
  onSignUp,
  onLogin,
  resetPassword,
  onGoogleLogin,
  onGoogleSignUp,
  tokenReceived,
  onEditAuthUser,
  onFirstLogin,
} = authSlice.actions;

export default authSlice.reducer;
