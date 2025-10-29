import Task from "../tasks/task.schema.js";
import Board from "./board.schema.js";

export default class BoardRepository {
  async create(boardData) {
    const newBoard = new Board(boardData);
    await newBoard.save();
    return newBoard;
  }

  async get(boardId) {
    const boards = await Board.findById(boardId).populate("lists.tasks");
    return boards;
  }

  async getBoard(userId) {
    // Find boards where user is either owner OR member
    const board = await Board.find({
      $or: [{ owner: userId }, { members: userId }],
    }).populate("lists.tasks");
    return board;
  }

  async update(boardId, boardData) {
    const updatedBoard = await Board.findByIdAndUpdate(boardId, boardData, {
      new: true,
      runValidators: true,
    });
    return updatedBoard;
  }

  async move(boardId, taskId, fromList, toList, insertAt) {
    const board = await Board.findById(boardId);
    if (!board) {
      return "Board Not Found";
    }
    // Verify the task belongs to this board
    const task = await Task.findById(taskId);
    if (!task) {
      return "Task not found";
    }
    // If task has no boardId OR belongs to different board, update it to current board
    if (!task.boardId) {
      await Task.findByIdAndUpdate(taskId, { boardId: boardId });
    } else if (task.boardId.toString() !== boardId) {
      // Update the task's boardId to match the current board
      await Task.findByIdAndUpdate(taskId, { boardId: boardId });
    }

    const destinationList = board.lists.find((list) => list.title === toList);
    if (!destinationList) {
      return "Destination list not found";
    }

    // First, try to find the task in the specified source list
    let sourceList = board.lists.find((list) => list.title === fromList);
    let taskIndexFromList = -1;

    if (sourceList) {
      taskIndexFromList = sourceList.tasks.findIndex(
        (task) => task.toString() === taskId
      );
    }

    // If task not found in specified source list, search all lists (data inconsistency fix)
    if (taskIndexFromList === -1) {
      for (const list of board.lists) {
        const idx = list.tasks.findIndex((task) => task.toString() === taskId);
        if (idx !== -1) {
          sourceList = list;
          taskIndexFromList = idx;
          break;
        }
      }

      // If still not found, this is a task that exists but isn't in any list yet
      // Just add it to the destination list (data recovery)
      if (taskIndexFromList === -1) {
        // Add the task to the destination list
        destinationList.tasks.splice(insertAt, 0, taskId);

        // Update task status
        await Task.findByIdAndUpdate(taskId, { status: toList });

        await board.save();
        const populatedBoard = await Board.findById(boardId).populate(
          "lists.tasks"
        );
        return populatedBoard;
      }
    }
    //delete the task from source
    const [removedTask] = sourceList.tasks.splice(taskIndexFromList, 1);
    //insert the task to destination
    destinationList.tasks.splice(insertAt, 0, removedTask);
    // Update task status in Task collection
    await Task.findByIdAndUpdate(taskId, { status: toList });

    await board.save();

    // Return the populated board for real-time updates
    const populatedBoard = await Board.findById(boardId).populate(
      "lists.tasks"
    );
    return populatedBoard;
  }

  async delete(boardId) {
    await Board.findByIdAndDelete(boardId);
  }
}
