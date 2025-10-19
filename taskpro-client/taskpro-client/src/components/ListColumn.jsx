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

export const ListColumn = ({ title, status, tasks }) => {
  const dispatch = useDispatch();
  const { currentBoard } = useSelector(boardSelector);
  
  console.log(`${title} column - tasks:`, tasks);
  console.log(`${title} column - status:`, status);
  
  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "TASK",
    drop: async (draggedItem) => {
      console.log("🎯 Drop event triggered!", { draggedItem, targetStatus: status });
      
      if (draggedItem.fromStatus !== status.toLowerCase()) {
        console.log("✅ Moving task from", draggedItem.fromStatus, "to", status.toLowerCase());
        
        try {
          const moveTaskPayload = {
            boardId: currentBoard._id,
            taskId: draggedItem.id,
            fromList: draggedItem.fromStatus.toLowerCase(),
            toList: status.toLowerCase(),
            insertAt: 0,
          };
          
          console.log("🚀 Dispatching moveTask:", moveTaskPayload);
          
          const result = await dispatch(moveTask(moveTaskPayload)).unwrap();
          
          console.log("✅ Move task completed successfully:", result);
          
          // Immediately update the task store with the new board state
          if (result && result.lists) {
            const updatedTasks = result.lists.flatMap((list) =>
              (list.tasks || []).map((task) => ({
                ...task,
                status: list.title,
                boardId: result._id,
              }))
            );
            console.log("🔄 Immediately updating local task store:", updatedTasks);
            await dispatch(setTask(updatedTasks));
            console.log("✅ Local task store updated successfully");
          } else {
            console.error("❌ Invalid result structure:", result);
          }
        } catch (error) {
          console.error("❌ Failed to move task:", error);
        }
      } else {
        console.log("⚠️ No move needed - same status:", draggedItem.fromStatus, "->", status.toLowerCase());
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  return (
    <div
      ref={dropRef}
      style={{
        flex: 1,
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: isOver ? "#e0f7fa" : "#f9f9f9",
        minHeight: "200px",
      }}
    >
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <TaskItem 
          key={task._id || `task-${index}-${task.title}`}
          task={task}
          status={status}
        />
      ))}
    </div>
  );
};
