import { useDrag } from "react-dnd";

export const TaskItem = ({ task, status }) => {
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

  return (
    <div
      ref={dragRef}
      style={{
        backgroundColor: "#fff",
        padding: "0.5rem",
        margin: "0.5rem 0",
        borderRadius: "8px",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <h4>{task.title}</h4>
      <p style={{ fontSize: "0.9rem" }}>{task.description}</p>
    </div>
  );
};
