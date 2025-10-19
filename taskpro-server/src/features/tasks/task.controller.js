import TaskRepository from "./task.repository.js";

export default class TaskController {
  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getAllTasks(req, res) {
    try {
      const userId = req.userId;
      console.log("User Id:", userId);

      const allTasks = await this.taskRepository.get(userId);
      if (!allTasks) {
        return res
          .status(404)
          .json({ message: "No Task found , please create to work on them" });
      }
      return res.status(200).json({ tasks: allTasks });
    } catch (err) {
      return res.status(501).json({
        message: "Something went wrong while fetching all the tasks for you",
      });
    }
  }

  async createTask(req, res) {
    try {
      const userId = req.userId;
      const { title, description, boardId } = req.body;
      console.log("body", req.body);
      console.log("User:", userId);
      const newTask = await this.taskRepository.addTask({
        userId,
        title,
        description,
        boardId,
      });
      return res.status(201).json({ tasks: newTask });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateTask(req, res) {
    try {
      const taskId = req.params.taskId;
      const updatedTask = await this.taskRepository.update(taskId, req.body);
      return res
        .status(201)
        .json({ message: "Updated Task", task: updatedTask });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteTask(req, res) {
    try {
      const taskId = req.params.taskId;
      await this.taskRepository.delete(taskId);
      return res.status(200).json({ message: "Deleted Task" });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
