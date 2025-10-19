import express from "express";
import http from "http";
import userRoute from "./src/features/user/user.routes.js";
import { connecToDB } from "./config/mongoose.js";
import cors from "cors";
import taskRoute from "./src/features/tasks/task.route.js";
import boardRoute from "./src/features/board/board.routes.js";
import { auth } from "./src/middlewares/auth.js";
import { Server } from "socket.io";
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // dev: allow all origins for Socket.IO
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  },
});

app.set("io", io);

app.use(express.json());

const corsOptions = {
  origin: true, // Allow all origins in dev
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Add a simple root route to confirm server is working
app.get('/', (req, res) => {
  res.json({ 
    message: 'TaskPro API Server is running!', 
    endpoints: [
      'POST /api/user/register',
      'POST /api/user/login', 
      'GET /api/board (requires auth)',
      'POST /api/task (requires auth)'
    ]
  });
});

app.use("/api/user", userRoute);
app.use("/api/task", auth, taskRoute);
app.use("/api/board", auth, boardRoute);

io.on("connection", (socket) => {
  console.log(
    "🔌 Client Connected",
    socket.id,
    "origin:",
    socket.handshake.headers?.origin
  );

  socket.on("joinBoard", (boardId) => {
    console.log("📡 Received joinBoard:", boardId, "from socket:", socket.id);
    socket.join(boardId);
    console.log(`✅ Socket ${socket.id} joined board room ${boardId}`);

    const room = io.sockets.adapter.rooms.get(boardId);
    console.log("👥 Sockets in board room:", room ? Array.from(room) : "No sockets");
  });
  
  socket.on("disconnect", () => {
    console.log("🔌 Client Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is listening at port 5000");
  connecToDB();
});
