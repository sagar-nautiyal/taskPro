import { useDispatch, useSelector } from "react-redux";
import { setTask, taskSelector } from "../reducer/taskReducer";
import { boardSelector } from "../reducer/boardReducer";
import { ListColumn } from "./ListColumn";
import socket from "./Socket";
import { setBoard } from "../reducer/boardReducer";
import { useEffect, useState } from "react";

export const BoardView = () => {
  const { currentBoard, loading } = useSelector(boardSelector);
  const { tasks } = useSelector(taskSelector);
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  useEffect(() => {
    if (!currentBoard?._id) return;
    // Set initial connection state
    setIsConnected(socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socket.emit("joinBoard", currentBoard._id);
    // Extract tasks from current board if they exist
    if (currentBoard.lists) {
      const allTasks = currentBoard.lists.flatMap((list) =>
        (list.tasks || []).map((task) => ({
          ...task,
          status: list.title,
          boardId: currentBoard._id,
        }))
      );
      if (allTasks.length > 0) {
        dispatch(setTask(allTasks));
      }
    }

    const handleBoardUpdate = async (updatedBoard) => {
      try {
        // setBoard is a regular action, not an async thunk, so no .unwrap()
        dispatch(setBoard(updatedBoard));

        const allTasks = updatedBoard.lists.flatMap((list) =>
          (list.tasks || []).map((task) => ({
            ...task,
            status: list.title,
            boardId: updatedBoard._id,
          }))
        );
        dispatch(setTask(allTasks));
      } catch (err) {}
    };

    socket.on("taskMoved", handleBoardUpdate);

    // Add test listener to see if any events are received
    socket.onAny((eventName, ...args) => {});
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("taskMoved", handleBoardUpdate);
      socket.offAny(); // Remove the catch-all listener
    };
  }, [dispatch, currentBoard?._id]);

  if (!currentBoard) {
    return (
      <div className="board-placeholder">
        <div className="empty-board-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            className="empty-icon"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              ry="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="7"
              y="7"
              width="3"
              height="9"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="14"
              y="7"
              width="3"
              height="5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <h3>No Board Selected</h3>
          <p className="text-muted">
            Select a board from the tabs above to view tasks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="board-loading">
        <div className="loading-spinner">
          <span
            className="spinner-border"
            role="status"
            aria-hidden="true"
          ></span>
          <span className="ms-2">Loading board...</span>
        </div>
      </div>
    );
  }

  const filteredTask = tasks.filter(
    (task) => task.boardId === currentBoard._id
  );
  const getStatus = (status) => {
    const tasksForStatus = filteredTask.filter(
      (task) => task.status === status
    );
    return tasksForStatus;
  };

  const boardStats = {
    inbox: getStatus("inbox").length,
    todo: getStatus("todo").length,
    completed: getStatus("completed").length,
    total: filteredTask.length,
  };

  return (
    <div className="board-view">
      {/* Connection Status Indicator */}
      <div className="board-status">
        <div
          className={`connection-indicator ${
            isConnected ? "connected" : "disconnected"
          }`}
        >
          <div className="status-dot"></div>
          <span className="status-text">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>

        <div className="board-stats">
          <span className="stat-item">
            <span className="stat-number">{boardStats.total}</span>
            <span className="stat-label">Total</span>
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <span className="stat-number">{boardStats.inbox}</span>
            <span className="stat-label">Inbox</span>
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <span className="stat-number">{boardStats.todo}</span>
            <span className="stat-label">To Do</span>
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <span className="stat-number">{boardStats.completed}</span>
            <span className="stat-label">Done</span>
          </span>
        </div>
      </div>

      {/* Board Columns */}
      <div className="board-columns">
        <ListColumn
          title="Inbox"
          status="inbox"
          tasks={getStatus("inbox")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 12H16L14 15H10L8 12H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0005 16.76 4H7.24C6.86792 4.0005 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ListColumn
          title="To Do"
          status="todo"
          tasks={getStatus("todo")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <polyline
                points="12,6 12,12 16,14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
        <ListColumn
          title="Completed"
          status="completed"
          tasks={getStatus("completed")}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11L12 14L22 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
};
