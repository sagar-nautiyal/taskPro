import { useDispatch, useSelector } from "react-redux";
import { boardSelector, moveTask } from "../reducer/boardReducer";
import { setTask } from "../reducer/taskReducer";
import { useDrop, useDrag } from "react-dnd";

const TaskItem = ({ task, status }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TASK",
    item: {
      id: task._id,
      fromStatus: status,
      title: task.title,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getPriorityColor = (priority) => {
    const colors = {
      high: "var(--danger-color)",
      medium: "var(--warning-color)",
      low: "var(--success-color)",
    };
    return colors[priority?.toLowerCase()] || "var(--text-muted)";
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      ref={dragRef}
      className={`task-card ${isDragging ? "dragging" : ""}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        {task.priority && (
          <span
            className="priority-badge"
            style={{
              "--badge-color": getPriorityColor(task.priority),
              backgroundColor: `${getPriorityColor(task.priority)}15`,
              color: getPriorityColor(task.priority),
            }}
          >
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        {task.category && (
          <span className="category-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12.005C21.1716 12.5384 20.9625 13.0453 20.59 13.41V13.41Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="7" cy="7" r="1.5" fill="currentColor" />
            </svg>
            {task.category}
          </span>
        )}

        {task.dueDate && (
          <span
            className={`due-date ${
              new Date(task.dueDate) < new Date() ? "overdue" : ""
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="3"
                y1="10"
                x2="21"
                y2="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export const ListColumn = ({ title, status, tasks, icon }) => {
  const dispatch = useDispatch();
  const { currentBoard } = useSelector(boardSelector);
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: "TASK",
      drop: async (draggedItem) => {
        if (draggedItem.fromStatus !== status.toLowerCase()) {
          try {
            const moveTaskPayload = {
              boardId: currentBoard._id,
              taskId: draggedItem.id,
              fromList: draggedItem.fromStatus.toLowerCase(),
              toList: status.toLowerCase(),
              insertAt: 0,
            };
            const result = await dispatch(moveTask(moveTaskPayload)).unwrap();
            // Immediately update the task store with the new board state
            if (result && result.lists) {
              const updatedTasks = result.lists.flatMap((list) =>
                (list.tasks || []).map((task) => ({
                  ...task,
                  status: list.title,
                  boardId: result._id,
                }))
              );
              await dispatch(setTask(updatedTasks));
            } else {
            }
          } catch (error) {}
        } else {
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [currentBoard, status, dispatch]
  ); // Add dependencies to recreate drop handler when board changes

  const getColumnColor = (status) => {
    const colors = {
      inbox: "var(--primary-color)",
      todo: "var(--warning-color)",
      completed: "var(--success-color)",
    };
    return colors[status?.toLowerCase()] || "var(--primary-color)";
  };

  return (
    <div
      ref={dropRef}
      className={`list-column ${isOver ? "drop-hover" : ""}`}
      style={{
        "--column-accent": getColumnColor(status),
      }}
    >
      <div className="column-header">
        <div className="column-title-wrapper">
          <div
            className="column-icon"
            style={{ color: getColumnColor(status) }}
          >
            {icon}
          </div>
          <h3 className="column-title">{title}</h3>
          <span className="task-count">{tasks.length}</span>
        </div>
      </div>

      <div className="column-content">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <div
              className="empty-icon"
              style={{ color: getColumnColor(status) }}
            >
              {icon}
            </div>
            <p className="empty-text">No tasks in {title.toLowerCase()}</p>
          </div>
        ) : (
          <div className="task-list">
            {tasks.map((task, index) => (
              <TaskItem
                key={task._id || `task-${index}-${task.title}`}
                task={task}
                status={status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
