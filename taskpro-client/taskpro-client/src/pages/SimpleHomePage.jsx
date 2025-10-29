import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducer/authReducer";
import { fetchTasksThunk, addTaskThunk } from "../reducer/taskReducer";
import { fetchBoards } from "../reducer/boardReducer";

export const SimpleHomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;
  const { tasks, loading: tasksLoading } = useSelector((state) => state.task);
  const { boards, loading: boardsLoading } = useSelector(
    (state) => state.board
  );

  const [activeView, setActiveView] = useState("tasks");
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  useEffect(() => {
    if (token) {
      dispatch(fetchTasksThunk());
      dispatch(fetchBoards());
    }
  }, [dispatch, token]);

  const handleLogout = () => {
    dispatch(logOut());
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !boards.length) return;

    try {
      await dispatch(
        addTaskThunk({
          title: newTask.title,
          description: newTask.description,
          boardId: boards[0]._id, // Use first available board
        })
      ).unwrap();

      setNewTask({ title: "", description: "" });
      // Refresh tasks
      dispatch(fetchTasksThunk());

      // Close modal
      const modal = document.getElementById("addTaskModal");
      const modalInstance = window.bootstrap?.Modal?.getInstance(modal);
      if (modalInstance) modalInstance.hide();
    } catch (error) {}
  };

  const tasksByStatus = {
    inbox: tasks?.filter((task) => task.status === "inbox") || [],
    todo: tasks?.filter((task) => task.status === "todo") || [],
    completed: tasks?.filter((task) => task.status === "completed") || [],
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Simple Header */}
      <header
        style={{
          background: "white",
          borderBottom: "1px solid var(--border)",
          padding: "1rem",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", color: "var(--primary)" }}>
            TaskPro
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span className="text-muted">
              Welcome, {user?.name || user?.email}
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={{ background: "var(--bg-secondary)", padding: "1rem" }}>
        <div className="container">
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              className={`btn ${
                activeView === "tasks" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveView("tasks")}
            >
              Tasks
            </button>
            <button
              className={`btn ${
                activeView === "boards" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setActiveView("boards")}
            >
              Boards
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ padding: "2rem 0" }}>
        <div className="container">
          {activeView === "tasks" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h2 style={{ margin: 0 }}>Your Tasks</h2>
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#addTaskModal"
                >
                  + Add Task
                </button>
              </div>

              {tasksLoading ? (
                <p>Loading tasks...</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {/* Inbox */}
                  <div className="card">
                    <h3
                      style={{ marginBottom: "1rem", color: "var(--primary)" }}
                    >
                      Inbox ({tasksByStatus.inbox.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {tasksByStatus.inbox.length === 0 ? (
                        <p className="text-muted">No tasks in inbox</p>
                      ) : (
                        tasksByStatus.inbox.map((task) => (
                          <div
                            key={task._id}
                            style={{
                              padding: "0.75rem",
                              background: "var(--bg-secondary)",
                              borderRadius: "0.375rem",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <h4 style={{ marginBottom: "0.25rem" }}>
                              {task.title}
                            </h4>
                            <p
                              className="text-muted"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {task.description}
                            </p>
                            {task.priority && (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  background:
                                    task.priority === "high"
                                      ? "var(--danger)"
                                      : task.priority === "medium"
                                      ? "var(--warning)"
                                      : "var(--success)",
                                  color: "white",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "0.25rem",
                                  marginTop: "0.5rem",
                                  display: "inline-block",
                                }}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Todo */}
                  <div className="card">
                    <h3
                      style={{ marginBottom: "1rem", color: "var(--warning)" }}
                    >
                      To Do ({tasksByStatus.todo.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {tasksByStatus.todo.length === 0 ? (
                        <p className="text-muted">No tasks in progress</p>
                      ) : (
                        tasksByStatus.todo.map((task) => (
                          <div
                            key={task._id}
                            style={{
                              padding: "0.75rem",
                              background: "var(--bg-secondary)",
                              borderRadius: "0.375rem",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <h4 style={{ marginBottom: "0.25rem" }}>
                              {task.title}
                            </h4>
                            <p
                              className="text-muted"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {task.description}
                            </p>
                            {task.priority && (
                              <span
                                style={{
                                  fontSize: "0.75rem",
                                  background:
                                    task.priority === "high"
                                      ? "var(--danger)"
                                      : task.priority === "medium"
                                      ? "var(--warning)"
                                      : "var(--success)",
                                  color: "white",
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "0.25rem",
                                  marginTop: "0.5rem",
                                  display: "inline-block",
                                }}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Completed */}
                  <div className="card">
                    <h3
                      style={{ marginBottom: "1rem", color: "var(--success)" }}
                    >
                      Completed ({tasksByStatus.completed.length})
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {tasksByStatus.completed.length === 0 ? (
                        <p className="text-muted">No completed tasks</p>
                      ) : (
                        tasksByStatus.completed.map((task) => (
                          <div
                            key={task._id}
                            style={{
                              padding: "0.75rem",
                              background: "var(--bg-secondary)",
                              borderRadius: "0.375rem",
                              border: "1px solid var(--border)",
                            }}
                          >
                            <h4
                              style={{
                                marginBottom: "0.25rem",
                                textDecoration: "line-through",
                                opacity: 0.7,
                              }}
                            >
                              {task.title}
                            </h4>
                            <p
                              className="text-muted"
                              style={{ fontSize: "0.875rem" }}
                            >
                              {task.description}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "boards" && (
            <div>
              <h2 style={{ marginBottom: "1.5rem" }}>Your Boards</h2>

              {boardsLoading ? (
                <p>Loading boards...</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {boards && boards.length === 0 ? (
                    <p className="text-muted">No boards created yet</p>
                  ) : (
                    boards?.map((board) => (
                      <div key={board._id} className="card">
                        <h3 style={{ marginBottom: "0.5rem" }}>
                          {board.title}
                        </h3>
                        <p
                          className="text-muted"
                          style={{ fontSize: "0.875rem" }}
                        >
                          {board.description}
                        </p>
                        <div style={{ marginTop: "1rem" }}>
                          <small className="text-muted">
                            {board.lists?.reduce(
                              (total, list) =>
                                total + (list.tasks?.length || 0),
                              0
                            )}{" "}
                            tasks
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add Task Modal */}
      <div
        className="modal fade"
        id="addTaskModal"
        tabIndex="-1"
        aria-labelledby="addTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleAddTask}>
              <div className="modal-header">
                <h5 className="modal-title" id="addTaskModalLabel">
                  Add New Task
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="taskTitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskTitle"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Enter task title"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="taskDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="taskDescription"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Enter task description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
