// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: SOCKET_URL,
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/user/register`,
    LOGIN: `${API_BASE_URL}/api/user/login`,
  },
  BOARD: {
    BASE: `${API_BASE_URL}/api/board`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/board/${id}`,
    MOVE_TASK: (id) => `${API_BASE_URL}/api/board/${id}/move`,
  },
  TASK: {
    BASE: `${API_BASE_URL}/api/task`,
  },
};

export default API_ENDPOINTS;
