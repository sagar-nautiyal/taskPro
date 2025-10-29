import BoardRepository from "./board.repository.js";
import { User } from "../user/user.schema.js";

export default class BoardController {
  constructor() {
    this.boardRepository = new BoardRepository();
  }
  async createBoard(req, res) {
    try {
      const { title } = req.body;
      const owner = req.userId;
      
      // Get the user who is creating the board
      const creatorUser = await User.findById(req.userId);
      let members = [req.userId];

      // If the creator is an admin, add all users as members
      if (creatorUser && creatorUser.role === 'admin') {
        const allUsers = await User.find({}).select('_id');
        members = allUsers.map(user => user._id);
      }

      const defaultTasks = [
        { title: "inbox", tasks: [] },
        { title: "todo", tasks: [] },
        { title: "completed", tasks: [] },
      ];

      const newBoard = await this.boardRepository.create({
        title,
        owner,
        members,
        lists: defaultTasks,
      });
      return res.status(201).json({ newBoard });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getUserBoard(req, res) {
    try {
      const userId = req.userId;
      const boards = await this.boardRepository.getBoard(userId);
      if (!boards) {
        return res.status(404).json({ message: "No boards found" });
      }

      return res.status(200).json(boards);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getBoardDetails(req, res) {
    try {
      const boardId = req.params.boardId;
      const boards = await this.boardRepository.get(boardId);
      if (!boards) {
        return res.status(404).json({ error: "Board not found" });
      }
      return res.status(200).json({ boards });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateBoard(req, res) {
    try {
      const boardId = req.params.boardId;
      const updatedBoard = await this.boardRepository.update(boardId, req.body);
      return res.status(201).json(updatedBoard);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async moveTask(req, res) {
    try {
      const boardId = req.params.boardId;
      const { taskId, fromList, toList, insertAt } = req.body;
      const updatedBoard = await this.boardRepository.move(
        boardId,
        taskId,
        fromList,
        toList,
        insertAt
      );

      if (typeof updatedBoard === 'string') {
        return res.status(400).json({ error: updatedBoard });
      }

      const io = req.app.get("io");
      io.to(boardId).emit("taskMoved", updatedBoard);

      const rooms = io.sockets.adapter.rooms;
      return res.status(201).json(updatedBoard);
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteBoard(req, res) {
    try {
      const boardId = req.params.boardId;
      await this.boardRepository.delete(boardId);
      return res.status(200).json({ message: "Board Deleted Successfully" });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
