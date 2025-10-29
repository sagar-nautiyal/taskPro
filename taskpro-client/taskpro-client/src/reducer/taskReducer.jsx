import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { act } from "react";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api.js";
import { logOut } from "./authReducer.jsx";

const INITIAL_STATE = {
  tasks: [],
  loading: false,
  error: null,
};

export const addTaskThunk = createAsyncThunk(
  "task/addTask",
  async (payload, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await fetch(API_ENDPOINTS.TASK.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (response.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

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
  async (_, { rejectWithValue, dispatch }) => {
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
      if (response.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

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

export const deleteTaskThunk = createAsyncThunk(
  "task/deleteTask",
  async (taskId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await fetch(`${API_ENDPOINTS.TASK.BASE}/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return taskId; // Return the deleted task ID
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTaskThunk = createAsyncThunk(
  "task/updateTask",
  async ({ taskId, updates }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }
    try {
      const response = await fetch(`${API_ENDPOINTS.TASK.BASE}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (response.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const data = await response.json();
      return data.task;
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
      state.tasks = action.payload;
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

    // Delete Task
    builder
      .addCase(deleteTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Task
    builder
      .addCase(updateTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const taskReducer = taskSlice.reducer;

export const { setTask } = taskSlice.actions;

export const taskSelector = (state) => state.task;
