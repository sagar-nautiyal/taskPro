import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
      const res = await fetch("http://localhost:5000/api/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return rejectWithValue("failed to create board");
      const data = await res.json();
      //dipatch to fetch the board immediately

      dispatch(getBoardById(data.newBoard._id));
      return data.newBoard;
    } catch (err) {
      console.log("error from reducer", err);
      return rejectWithValue(err.message);
    }
  }
);

export const getBoardById = createAsyncThunk(
  "board/getBoard",
  async (boardId, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/board/${boardId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return rejectWithValue("failed to create board");
      const data = await res.json();

      return data.boards;
    } catch (err) {
      console.log("error from reducer", err);
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBoards = createAsyncThunk(
  "board/fetch",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/board", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  async ({ boardId, taskId, fromList, toList, insertAt }, rejectWithValue) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:5000/api/board/${boardId}/move`,
        {
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
        }
      );

      console.log("response from server", res);

      if (!res.ok) {
        throw new Error("Failed to move task");
      }

      const updatedBoard = await res.json();
      console.log("Updated Board", updatedBoard);
      return updatedBoard;
    } catch (err) {
      console.log("error while moving", err);
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
        console.log("Move task fulfilled, updated board:", action.payload);
      })
      .addCase(moveTask.rejected, (state, action) => {
        console.error("Move task failed:", action.payload);
      });
  },
});

export const boardReducer = boardSlice.reducer;
export const { setSelectedBoard, setBoard } = boardSlice.actions;
export const boardSelector = (state) => state.board;
