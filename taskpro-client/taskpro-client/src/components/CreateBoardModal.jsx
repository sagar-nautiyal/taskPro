import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBoard } from "../reducer/boardReducer";
import { toast } from "react-toastify";

export const CreateBoardModal = () => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await dispatch(createBoard(title)).unwrap();
      toast.success("Created Board, add your task now");
      setTitle("");
    } catch (err) {
      console.log("eror creating board", err);
      toast.error("failed to add Board");
    }
  };
  return (
    <div
      className="modal fade"
      id="createBoardModal"
      tabIndex="-1"
      aria-labelledby="createBoardModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <form onSubmit={handleCreateBoard} className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createBoardModalLabel">
              Create New Board
            </h5>
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
              placeholder="Enter board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
