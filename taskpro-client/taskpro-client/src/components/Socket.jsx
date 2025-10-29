import { io } from "socket.io-client";
import { API_ENDPOINTS } from "../config/api.js";

const socket = io(API_ENDPOINTS.SOCKET_URL, {
  transports: ["websocket", "polling"], // allow fallback
  withCredentials: false,
  path: "/socket.io",
});

// Add connection event listeners for debugging
socket.on("connect", () => {});

socket.on("disconnect", () => {});

socket.on("connect_error", (error) => {});

export default socket;
