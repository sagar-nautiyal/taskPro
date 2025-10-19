import { useEffect, useState } from "react";
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

export const HomePage = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(taskSelector);
  const { boards, currentBoard } = useSelector(boardSelector);

  useEffect(() => {
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
          boardsResult.forEach(board => {
            if (board.lists) {
              board.lists.forEach(list => {
                if (list.tasks) {
                  list.tasks.forEach(task => {
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
        }
      } catch (err) {
        console.log(err);
        toast.error("failed to fetch data");
      }
    };
    fetchTasks();
  }, [dispatch]);

  const handleSelectedBoard = (board) => {
    dispatch(setSelectedBoard(board));
  };

  return (
    <>
      <div className="mt-3 p-5">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-3">
            <div
              className="inbox-card p-4"
              style={{ border: "1px solid #ccc" }}
            >
              <h1>Inbox</h1>
              {tasks.map((task) => (
                <InboxList
                  key={task._id}
                  task={task}

                  // onEdit={() => setSelectedTask(task)}
                />
              ))}
              <Inboxform />
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-9">
            <div className="board-box">
              <h1>Board</h1>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createBoardModal"
              >
                + New Board
              </button>

              {boards.map((board) => (
                <button
                  key={board._id}
                  className={`btn btn-outline-dark ${
                    currentBoard === board._id ? "active" : ""
                  }`}
                  onClick={() => handleSelectedBoard(board)}
                >
                  {board.title}
                </button>
              ))}

              {currentBoard ? (
                <div>
                  <h3>Board: {currentBoard.title}</h3>
                  {/* Later: Render board columns, drag-drop area, etc */}
                </div>
              ) : (
                <p>Select a board to view</p>
              )}

              <BoardView />

              <CreateBoardModal />
            </div>
          </div>
        </div>
      </div>

      {/* {selectedTask && (
        <div
          className="modal fade"
          id="updateModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form>
                <div className="modal-header">
                  <h5 className="modal-title">Update Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    defaultValue={selectedTask.title}
                    placeholder="Title.."
                  />
                  <textarea
                    className="form-control mt-2"
                    name="description"
                    defaultValue={selectedTask.description}
                    placeholder="Description..."
                    rows="3"
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Update changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};
