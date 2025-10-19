import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api.js";

const INITIAL_STATE = {
  tasks: [],
  loading: false,
  error: null,
};

export const addTaskThunk = createAsyncThunk(
  "task/addTask",
  async (payload, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    console.log("Payload Data", payload);
    try {
      const response = await fetch(API_ENDPOINTS.TASK.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.tasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTasksThunk = createAsyncThunk(
  "task/fetchTasks",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await fetch(API_ENDPOINTS.TASK.BASE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        return rejectWithValue("Network response was not ok");
      }
      const data = await response.json();
      return data.tasks;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState: INITIAL_STATE,
  reducers: {
    setTask: (state, action) => {
      console.log("🔄 TaskReducer: setTask called with:", action.payload);
      state.tasks = action.payload;
      console.log("✅ TaskReducer: tasks updated, new count:", action.payload.length);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(addTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;

        // toast.success("Welcome to task Pro");
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const taskReducer = taskSlice.reducer;

export const { setTask } = taskSlice.actions;

export const taskSelector = (state) => state.task;
