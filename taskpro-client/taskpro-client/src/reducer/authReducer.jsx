import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../config/api.js";

// Check if user is already authenticated from localStorage
const getInitialState = () => {
  const token = localStorage.getItem("token");
  return {
    user: token ? { token } : null,
    isAuthenticated: !!token,
    loading: false,
    error: null,
  };
};

const INITIAL_STATE = getInitialState();

export const registerThunk = createAsyncThunk(
  "auth/Register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`Registration failed: ${res.status} ${errorData}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginthunk = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("failed to Login");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.loading = false;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
    builder
      .addCase(loginthunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginthunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem("token", action.payload.token);
        state.error = null;
      })
      .addCase(loginthunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer;

export const { logOut } = authSlice.actions;

export const authSelector = (state) => state.auth;
