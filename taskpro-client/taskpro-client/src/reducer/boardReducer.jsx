import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_ENDPOINTS } from "../config/api.js";
import { logOut } from "./authReducer.jsx";

const INITIAL_STATE = {
  boards: [],
  currentBoard: null,
  error: null,
  loading: false,
};

export const createBoard = createAsyncThunk(
  "board/create",
  async (title, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.BOARD.BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (res.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!res.ok) return rejectWithValue("failed to create board");
      const data = await res.json();
      //dipatch to fetch the board immediately

      dispatch(getBoardById(data.newBoard._id));
      return data.newBoard;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getBoardById = createAsyncThunk(
  "board/getBoard",
  async (boardId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.BOARD.GET_BY_ID(boardId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!res.ok) return rejectWithValue("failed to create board");
      const data = await res.json();

      return data.boards;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBoards = createAsyncThunk(
  "board/fetch",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.BOARD.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!res.ok) {
        return rejectWithValue("Failed", res.status);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const moveTask = createAsyncThunk(
  "board/moveTask",
  async (
    { boardId, taskId, fromList, toList, insertAt },
    { rejectWithValue, dispatch }
  ) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_ENDPOINTS.BOARD.MOVE_TASK(boardId), {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId,
          fromList,
          toList,
          insertAt,
        }),
      });
      if (res.status === 401) {
        dispatch(logOut());
        return rejectWithValue("Unauthorized");
      }

      if (!res.ok) {
        throw new Error("Failed to move task");
      }

      const updatedBoard = await res.json();
      return updatedBoard;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: INITIAL_STATE,
  reducers: {
    setSelectedBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    setBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
        state.boards.push(action.payload);
        state.error = null;
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(getBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBoardById.fulfilled, (state, action) => {
        state.currentBoard = action.payload;
        state.loading = false;
        const existingIndex = state.boards.findIndex(
          (b) => b._id === action.payload._id
        );
        if (existingIndex >= 0) {
          state.boards[existingIndex] = action.payload;
        } else {
          state.boards.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(moveTask.fulfilled, (state, action) => {
        state.currentBoard = action.payload;
      })
      .addCase(moveTask.rejected, (state, action) => {});
  },
});

export const boardReducer = boardSlice.reducer;
export const { setSelectedBoard, setBoard } = boardSlice.actions;
export const boardSelector = (state) => state.board;
