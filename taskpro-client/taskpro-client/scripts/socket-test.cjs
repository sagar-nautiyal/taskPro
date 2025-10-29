const { io } = require("socket.io-client");

const url = process.env.SOCKET_URL || "http://13.60.50.193:3001";
const s = io(url, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
});

const timer = setTimeout(() => {
  // Connection timeout
  process.exit(2);
}, 10000);

s.on("connect", () => {
  // Connected successfully
  clearTimeout(timer);
  s.disconnect();
  process.exit(0);
});

s.on("connect_error", (e) => {
  // Connection error
});

s.on("reconnect_attempt", (n) => {
  // Reconnection attempt
});

s.on("error", (e) => {
  // Socket error
});
