import express from "express";
import BoardController from "./board.controller.js";
const boardRoute = express.Router();

const boardController = new BoardController();

boardRoute.get("/", (req, res) => {
  boardController.getUserBoard(req, res);
});

boardRoute.post("/", (req, res) => {
  boardController.createBoard(req, res);
});

boardRoute.get("/:boardId", (req, res) => {
  boardController.getBoardDetails(req, res);
});

boardRoute.put("/:boardId", (req, res) => {
  boardController.updateBoard(req, res);
});

boardRoute.put("/:boardId/move", (req, res) => {
  boardController.moveTask(req, res);
});

boardRoute.delete("/:boardId", (req, res) => {
  boardController.deleteBoard(req, res);
});

export default boardRoute;
