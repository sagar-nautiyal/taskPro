import Board from "../board/board.schema.js";
import Task from "./task.schema.js";

export default class TaskRepository {
  async get(userId) {
    const task = await Task.find({ userId });
    return task;
  }

  async addTask({ userId, title, description, boardId }) {
    const newTask = new Task({ userId, title, description, boardId });
    const savedTask = await newTask.save();

    const board = await Board.findById(boardId);
    if (!board) return "No Board found";

    //find the title
    const targetList = board.lists.find(
      (list) => list.title === savedTask.status
    );
    if (!targetList) return `No Column exists for ${status}`;

    //insert the task to the list

    targetList.tasks.push(savedTask._id);
    await board.save();

    return savedTask;
  }

  async update(taskId, taskData) {
    // Get the current task to check if status is changing
    const currentTask = await Task.findById(taskId);
    if (!currentTask) {
      return "Task not found";
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    });

    // If status is being changed, we need to move the task in the board's lists
    if (taskData.status && taskData.status !== currentTask.status) {
      const board = await Board.findById(currentTask.boardId);
      if (board) {
        // Find and remove from old list
        const oldList = board.lists.find(list => list.title === currentTask.status);
        if (oldList) {
          const taskIndex = oldList.tasks.findIndex(t => t.toString() === taskId);
          if (taskIndex !== -1) {
            oldList.tasks.splice(taskIndex, 1);
          }
        }

        // Add to new list
        const newList = board.lists.find(list => list.title === taskData.status);
        if (newList) {
          newList.tasks.push(taskId);
        }

        await board.save();
      }
    }

    return updatedTask;
  }

  async delete(taskId) {
    // Get the task to find its board and status
    const task = await Task.findById(taskId);
    if (!task) {
      return "Task not found";
    }

    // Remove from board's list array
    const board = await Board.findById(task.boardId);
    if (board) {
      const list = board.lists.find(l => l.title === task.status);
      if (list) {
        const taskIndex = list.tasks.findIndex(t => t.toString() === taskId);
        if (taskIndex !== -1) {
          list.tasks.splice(taskIndex, 1);
          await board.save();
        }
      }
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);
  }
}
