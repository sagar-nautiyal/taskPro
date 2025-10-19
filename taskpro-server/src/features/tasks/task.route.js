import express from "express";
import TaskController from "./task.controller.js";
import { auth } from "../../middlewares/auth.js";
const taskRoute = express.Router();

const taskController = new TaskController();
// Define your task routes here
taskRoute.get("/", (req, res) => {
  taskController.getAllTasks(req, res);
});
taskRoute.post("/", (req, res) => {
  taskController.createTask(req, res);
});

taskRoute.put("/:taskId", (req, res) => {
  taskController.updateTask(req, res);
});

taskRoute.delete("/:taskId", (req, res) => {
  taskController.deleteTask(req, res);
});

export default taskRoute;
