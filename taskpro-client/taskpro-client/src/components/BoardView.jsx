import { useDispatch, useSelector } from "react-redux";
import { setTask, taskSelector } from "../reducer/taskReducer";
import { boardSelector } from "../reducer/boardReducer";
import { ListColumn } from "./ListColumn";
import socket from "./Socket";
import { setBoard } from "../reducer/boardReducer";
import { useEffect } from "react";

export const BoardView = () => {
  const { currentBoard } = useSelector(boardSelector);
  const { tasks } = useSelector(taskSelector);
  const dispatch = useDispatch();

  console.log("Current Board", currentBoard);
  console.log("Tasks in BoardView", tasks);

  useEffect(() => {
    if (!currentBoard?._id) return;

    console.log("🔌 Setting up socket connection for board:", currentBoard._id);
    console.log("🔌 Socket connected:", socket.connected);
    console.log("🔌 Socket ID:", socket.id);
    
    socket.emit("joinBoard", currentBoard._id);
    console.log("📡 Emitted joinBoard event for:", currentBoard._id);

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
        console.log("📩 Received taskMoved socket event", updatedBoard);
        console.log("🔍 Updated board details:", {
          boardId: updatedBoard._id,
          title: updatedBoard.title,
          listsCount: updatedBoard.lists?.length,
          totalTasks: updatedBoard.lists?.reduce((sum, list) => sum + (list.tasks?.length || 0), 0)
        });
        
        // setBoard is a regular action, not an async thunk, so no .unwrap()
        dispatch(setBoard(updatedBoard));
        
        const allTasks = updatedBoard.lists.flatMap((list) =>
          (list.tasks || []).map((task) => ({
            ...task,
            status: list.title,
            boardId: updatedBoard._id,
          }))
        );
        console.log("🔄 Updating tasks from socket:", allTasks);
        dispatch(setTask(allTasks));
        console.log("✅ Socket update completed successfully");
      } catch (err) {
        console.log("❌ Error while updating Socket", err);
      }
    };

    socket.on("taskMoved", handleBoardUpdate);
    
    // Add test listener to see if any events are received
    socket.onAny((eventName, ...args) => {
      console.log("🎧 Socket received event:", eventName, args);
    });

    console.log("✅ Socket listener added for 'taskMoved' event");

    return () => {
      socket.off("taskMoved", handleBoardUpdate);
      socket.offAny(); // Remove the catch-all listener
      console.log("❌ Socket listeners removed");
    };
  }, [dispatch, currentBoard?._id]);

  if (!currentBoard) return;

  const filteredTask = tasks.filter(
    (task) => task.boardId === currentBoard._id
  );

  console.log("All tasks:", tasks);
  console.log("Current board ID:", currentBoard._id);
  console.log("Filtered tasks for this board:", filteredTask);
  console.log("Tasks updated at:", new Date().toISOString());

  const getStatus = (status) => {
    const tasksForStatus = filteredTask.filter((task) => task.status === status);
    console.log(`Tasks for ${status}:`, tasksForStatus);
    return tasksForStatus;
  };
  return (
    <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
      <ListColumn title="Inbox" status="inbox" tasks={getStatus("inbox")} />
      <ListColumn title="To Do" status="todo" tasks={getStatus("todo")} />
      <ListColumn
        title="Completed"
        status="completed"
        tasks={getStatus("completed")}
      />
    </div>
  );
};
