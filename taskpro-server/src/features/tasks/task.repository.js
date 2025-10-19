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
    const updatedTask = await Task.findByIdAndUpdate(taskId, taskData, {
      new: true,
      runValidators: true,
    });

    return updatedTask;
  }

  async delete(taskId) {
    await Task.findByIdAndDelete(taskId);
  }
}
