import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchTasksThunk, taskSelector, setTask } from "../reducer/taskReducer";
import { Inboxform } from "./InboxForm.jsx";
import { InboxList } from "./InboxList.jsx";
import { CreateBoardModal } from "../components/CreateBoardModal.jsx";
import {
  boardSelector,
  fetchBoards,
  getBoardById,
  setSelectedBoard,
} from "../reducer/boardReducer.jsx";
import { BoardView } from "../components/BoardView.jsx";
import { authSelector, logOut } from "../reducer/authReducer.jsx";

export const HomePage = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(taskSelector);
  const { boards, currentBoard, loading } = useSelector(boardSelector);
  const { isAuthenticated } = useSelector(authSelector);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Debounce search input (300ms delay)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Fetch tasks when the component mounts
    const fetchTasks = async () => {
      try {
        const [boardsResult, tasksResult] = await Promise.all([
          dispatch(fetchBoards()).unwrap(),
          dispatch(fetchTasksThunk()).unwrap(),
        ]);

        // Extract tasks from all boards and add them to task store
        if (boardsResult && Array.isArray(boardsResult)) {
          const allBoardTasks = [];
          boardsResult.forEach((board) => {
            if (board.lists) {
              board.lists.forEach((list) => {
                if (list.tasks) {
                  list.tasks.forEach((task) => {
                    allBoardTasks.push({
                      ...task,
                      status: list.title,
                      boardId: board._id,
                    });
                  });
                }
              });
            }
          });

          if (allBoardTasks.length > 0) {
            dispatch(setTask(allBoardTasks));
          }

          // Auto-select the first board if none is selected and boards exist
          if (boardsResult.length > 0 && !currentBoard) {
            dispatch(setSelectedBoard(boardsResult[0]));
          }
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };
    fetchTasks();
  }, [dispatch, isAuthenticated]);

  const handleLogout = () => {
    dispatch(logOut());
    setShowAccountMenu(false);
    toast.success("Logged out successfully");
  };

  const handleSelectedBoard = (board) => {
    dispatch(setSelectedBoard(board));
  };

  // Filter tasks by current board first, then by search term
  const boardTasks = currentBoard
    ? tasks.filter((task) => task.boardId === currentBoard._id)
    : tasks;

  // Filter tasks based on search term
  const filteredTasks = debouncedSearchTerm.trim()
    ? boardTasks.filter(
        (task) =>
          task.title
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase().trim()) ||
          task.description
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase().trim())
      )
    : boardTasks; // Show all board tasks when search is empty

  const taskStats = {
    total: boardTasks.length,
    inbox: boardTasks.filter((task) => task.status === "inbox").length,
    todo: boardTasks.filter((task) => task.status === "todo").length,
    completed: boardTasks.filter((task) => task.status === "completed").length,
  };

  if (!isAuthenticated) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f1f5f9 0%, #e0f2fe 100%)",
        }}
      >
        <div className="text-center">
          <h1 className="display-4 fw-bold text-dark mb-4">
            Welcome to TaskPro
          </h1>
          <p className="text-muted mb-4">
            Please login to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
      }}
    >
      {/* Modern Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="container" style={{ padding: "1rem 1.5rem" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                    borderRadius: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    marginRight: "0.75rem",
                  }}
                >
                  <svg
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      color: "white",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h1
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      margin: 0,
                    }}
                  >
                    TaskPro
                  </h1>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    Organize • Collaborate • Achieve
                  </p>
                </div>
              </div>
            </div>

            {/* Task Statistics Cards */}
            <div
              className="d-none d-md-flex align-items-center"
              style={{ gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <svg
                  style={{ width: "1rem", height: "1rem" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{taskStats.total} Total</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "#fef3c7",
                  color: "#b45309",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <svg
                  style={{ width: "1rem", height: "1rem" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{taskStats.todo} Active</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "#dcfce7",
                  color: "#15803d",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <svg
                  style={{ width: "1rem", height: "1rem" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{taskStats.completed} Done</span>
              </div>
            </div>

            {/* Account Button with Dropdown */}
            <div style={{ position: "relative", marginLeft: "1rem" }}>
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 12px rgba(0,0,0,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showAccountMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    onClick={() => setShowAccountMenu(false)}
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 998,
                    }}
                  />

                  {/* Menu */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: 0,
                      background: "white",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                      minWidth: "200px",
                      zIndex: 999,
                      overflow: "hidden",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        border: "none",
                        background: "white",
                        color: "#ef4444",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: "1.5rem" }}>
        {/* Modern Cards Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(226, 232, 240, 0.3)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.75rem",
                  }}
                >
                  <svg
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "white",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h5 style={{ margin: 0, color: "#1f2937", fontWeight: "600" }}>
                  Add New Task
                </h5>
              </div>
              {!currentBoard && boards.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem 1rem",
                    color: "#6b7280",
                    background: "rgba(249, 115, 22, 0.05)",
                    borderRadius: "0.75rem",
                    border: "1px dashed rgba(249, 115, 22, 0.2)",
                  }}
                >
                  <svg
                    style={{
                      width: "3rem",
                      height: "3rem",
                      color: "#ea580c",
                      marginBottom: "1rem",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0a2 2 0 012 2v8a2 2 0 01-2 2m-6 0a2 2 0 002 2v-2a2 2 0 00-2-2m2-2v-2a2 2 0 00-2-2m2-2a2 2 0 012-2v2a2 2 0 002 2m-2 0h2m-6 0h2"
                    />
                  </svg>
                  <h6
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "#ea580c",
                      fontWeight: "600",
                    }}
                  >
                    Create a Board First!
                  </h6>
                  <p style={{ margin: "0 0 1rem 0", fontSize: "0.875rem" }}>
                    You need to create a project board before adding tasks.
                  </p>
                  <button
                    className="btn btn-warning btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#createBoardModal"
                    style={{
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      border: "none",
                      color: "white",
                      fontWeight: "500",
                    }}
                  >
                    <svg
                      style={{
                        width: "1rem",
                        height: "1rem",
                        marginRight: "0.5rem",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Your First Board
                  </button>
                </div>
              ) : !currentBoard ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1.5rem 1rem",
                    color: "#6b7280",
                    background: "rgba(59, 130, 246, 0.05)",
                    borderRadius: "0.75rem",
                    border: "1px dashed rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <svg
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      color: "#3b82f6",
                      marginBottom: "0.75rem",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontWeight: "500",
                      color: "#3b82f6",
                    }}
                  >
                    Select a Board
                  </p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    Choose a project board to add tasks to
                  </p>
                </div>
              ) : (
                <Inboxform />
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(10px)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(226, 232, 240, 0.3)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.75rem",
                  }}
                >
                  <svg
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "white",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h5 style={{ margin: 0, color: "#1f2937", fontWeight: "600" }}>
                  Task Inbox
                </h5>
              </div>

              {/* Search Input */}
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <svg
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "1rem",
                    height: "1rem",
                    color: "#9ca3af",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    paddingLeft: "2.5rem",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                  }}
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Task List */}
              <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task._id} style={{ marginBottom: "0.5rem" }}>
                      <InboxList task={task} />
                    </div>
                  ))
                ) : (
                  <div className="text-center" style={{ padding: "2rem 0" }}>
                    <svg
                      style={{
                        width: "3rem",
                        height: "3rem",
                        color: "#d1d5db",
                        margin: "0 auto 0.75rem",
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        margin: 0,
                      }}
                    >
                      {debouncedSearchTerm
                        ? `No tasks found matching "${debouncedSearchTerm}"`
                        : "No tasks yet"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Board Management Section */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            border: "1px solid rgba(226, 232, 240, 0.3)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid rgba(226, 232, 240, 0.3)",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ position: "relative" }}
            >
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "2rem",
                    height: "2rem",
                    background:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "0.75rem",
                  }}
                >
                  <svg
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      color: "white",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0a2 2 0 012 2v8a2 2 0 01-2 2m-6 0a2 2 0 002 2v-2a2 2 0 00-2-2m2-2v-2a2 2 0 00-2-2m2-2a2 2 0 012-2v2a2 2 0 002 2m-2 0h2m-6 0h2"
                    />
                  </svg>
                </div>
                <div>
                  <h5
                    style={{ margin: 0, color: "#1f2937", fontWeight: "600" }}
                  >
                    Project Boards
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: "#6b7280",
                    }}
                  >
                    Manage your task boards and workflow
                  </p>
                </div>
              </div>

              <CreateBoardModal />
            </div>
          </div>

          {/* Board Tabs */}
          <div style={{ padding: "0 1.5rem" }}>
            <nav
              className="nav nav-tabs"
              style={{ borderBottom: "none", paddingTop: "1rem" }}
            >
              <button
                className={`nav-link ${!currentBoard ? "active" : ""}`}
                style={{
                  background: !currentBoard
                    ? "rgba(59, 130, 246, 0.1)"
                    : "transparent",
                  color: !currentBoard ? "#3b82f6" : "#6b7280",
                  border: "none",
                  borderRadius: "0.5rem",
                  marginRight: "0.5rem",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  padding: "0.5rem 1rem",
                }}
                onClick={() => handleSelectedBoard(null)}
              >
                All Tasks
              </button>
              {boards.map((board) => (
                <button
                  key={board._id}
                  className={`nav-link ${
                    currentBoard?._id === board._id ? "active" : ""
                  }`}
                  style={{
                    background:
                      currentBoard?._id === board._id
                        ? "rgba(59, 130, 246, 0.1)"
                        : "transparent",
                    color:
                      currentBoard?._id === board._id ? "#3b82f6" : "#6b7280",
                    border: "none",
                    borderRadius: "0.5rem",
                    marginRight: "0.5rem",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    padding: "0.5rem 1rem",
                  }}
                  onClick={() => handleSelectedBoard(board)}
                >
                  {board.title}
                </button>
              ))}
              {boards.length === 0 && (
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    background: "rgba(249, 115, 22, 0.1)",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(249, 115, 22, 0.2)",
                  }}
                >
                  <svg
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      marginBottom: "0.5rem",
                      color: "#ea580c",
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontWeight: "500",
                      color: "#ea580c",
                    }}
                  >
                    No boards found!
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem" }}>
                    Create your first board to start adding tasks
                  </p>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Main Content - Drag and Drop Board View (Preserved Original Functionality) */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
            borderRadius: "1rem",
            border: "1px solid rgba(226, 232, 240, 0.3)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <BoardView selectedBoard={currentBoard} />
        </div>
      </div>
    </div>
  );
};
