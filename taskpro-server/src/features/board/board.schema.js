import mongoose from "mongoose";
const boardSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lists: [
    {
      title: String,
      tasks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Task",
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;
