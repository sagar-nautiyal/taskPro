import styles from "./InboxList.module.css";
import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { deleteTaskThunk, updateTaskThunk } from "../reducer/taskReducer";
import { toast } from "react-toastify";
import { useState } from "react";

export const InboxList = ({ task, onEdit }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TASK",
    item: {
      id: task._id,
      fromStatus: task.status,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTaskThunk(task._id)).unwrap();
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      await dispatch(
        updateTaskThunk({
          taskId: task._id,
          updates: {
            title: editTitle.trim(),
            description: editDescription.trim(),
          },
        })
      ).unwrap();
      toast.success("Task updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "var(--danger-color)";
      case "medium":
        return "var(--warning-color)";
      case "low":
        return "var(--success-color)";
      default:
        return "var(--text-muted)";
    }
  };

  return (
    <div
      ref={dragRef}
      className={`task-item ${isDragging ? "dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {isEditing ? (
        // Edit Form
        <div
          style={{
            padding: "1rem",
            background: "#f8fafc",
            borderRadius: "0.5rem",
          }}
        >
          <form onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                }}
              >
                Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                autoFocus
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                }}
              >
                Description <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
                rows="3"
                style={{
                  width: "100%",
                  padding: "0.625rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  background: "white",
                  color: "#6b7280",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "0.5rem",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline
                    points="20,6 9,17 4,12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Display Mode
        <div className="task-content">
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-actions">
              {task.priority && (
                <span
                  className="badge badge-sm"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
              )}
              <button
                className="btn-icon btn-icon-sm"
                onClick={handleEdit}
                title="Edit task"
                style={{
                  background: "transparent",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "0.375rem",
                  cursor: "pointer",
                  color: "#3b82f6",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#eff6ff";
                  e.currentTarget.style.borderColor = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 20H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.5 3.5C16.8978 3.1022 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04016C19.0692 3.14676 19.302 3.30301 19.4950 3.49597C19.688 3.68893 19.8442 3.92175 19.9508 4.17918C20.0574 4.43661 20.1123 4.71238 20.1123 4.99097C20.1123 5.26956 20.0574 5.54533 19.9508 5.80276C19.8442 6.06019 19.688 6.29301 19.4950 6.48597L7 19L3 20L4 16L16.5 3.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="btn-icon btn-icon-sm btn-danger"
                onClick={handleDelete}
                title="Delete task"
                style={{
                  background: "transparent",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.375rem",
                  padding: "0.375rem",
                  cursor: "pointer",
                  color: "#ef4444",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.borderColor = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline
                    points="3,6 5,6 21,6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta">
            <div className="task-status">
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
            </div>

            {task.dueDate && (
              <div className="task-due-date">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="4"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="16"
                    y1="2"
                    x2="16"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="2"
                    x2="8"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="3"
                    y1="10"
                    x2="21"
                    y2="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-sm text-muted">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {task.createdAt && (
              <div className="task-created">
                <span className="text-xs text-muted">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
