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
      $or: [
        { owner: userId },
        { members: userId }
      ]
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
    console.log("Repository move called with:", { boardId, taskId, fromList, toList, insertAt });
    
    const board = await Board.findById(boardId);
    if (!board) {
      console.log("Board not found:", boardId);
      return "Board Not Found";
    }

    console.log("Board found:", board.title);
    console.log("Board lists:", board.lists.map(l => ({ title: l.title, taskCount: l.tasks.length })));

    const sourceList = board.lists.find((list) => list.title === fromList);
    const destinationList = board.lists.find((list) => list.title === toList);

    if (!sourceList) {
      console.log("Source list not found:", fromList);
      console.log("Available lists:", board.lists.map(l => l.title));
      return "Source list not found";
    }

    if (!destinationList) {
      console.log("Destination list not found:", toList);
      return "Destination list not found";
    }

    console.log("Source list tasks:", sourceList.tasks.map(t => t.toString()));
    console.log("Looking for task:", taskId);

    //find and delete the task from source - convert ObjectIds to strings for comparison
    const taskIndexFromList = sourceList.tasks.findIndex(task => task.toString() === taskId);
    if (taskIndexFromList === -1) {
      console.log("Task not found in source list. Looking for:", taskId);
      console.log("Available tasks:", sourceList.tasks.map(t => t.toString()));
      return "No task found";
    }

    //delete the task
    const [removedTask] = sourceList.tasks.splice(taskIndexFromList, 1);
    console.log("removed Task is:", removedTask);

    //insert the task to destination
    destinationList.tasks.splice(insertAt, 0, removedTask);
    await Task.findByIdAndUpdate(taskId, { status: toList });

    const updatedBoard = await board.save();
    // Return the populated board for real-time updates
    const populatedBoard = await Board.findById(boardId).populate("lists.tasks");
    console.log("Move completed successfully");
    return populatedBoard;
  }

  async delete(boardId) {
    await Board.findByIdAndDelete(boardId);
  }
}
