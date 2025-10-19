import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authReducer";
import { taskReducer } from "./taskReducer";
import { boardReducer } from "./boardReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    board: boardReducer,
  },
});

export default store;
