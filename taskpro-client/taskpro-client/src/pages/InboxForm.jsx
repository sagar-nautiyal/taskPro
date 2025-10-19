import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTaskThunk } from "../reducer/taskReducer";
import { boardSelector } from "../reducer/boardReducer";

export const Inboxform = ({ tasks }) => {
  const { currentBoard } = useSelector(boardSelector);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login First");
      navigate("/signIn");
    }
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");

    const taskData = {
      title,
      description,
      boardId: currentBoard._id,
    };

    try {
      await dispatch(addTaskThunk(taskData)).unwrap();
      toast.success("Task added successfully");
      e.target.reset();
    } catch (err) {
      console.log(err);
      toast.error("failed to add task");
      return;
    }
  };
  return (
    <>
      <div className="text-center">
        <button
          className="btn btn-outline-success"
          data-bs-toggle="modal"
          data-bs-target="#taskModal"
        >
          Add Task
        </button>
      </div>

      <div
        className="modal fade"
        id="taskModal"
        tabIndex="-1"
        aria-labelledby="taskModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="taskModal">
                Add Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="p-3">
              <form onSubmit={handleAddTask}>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Title.."
                />
                <textarea
                  className="form-control mt-2"
                  name="description"
                  placeholder="Description..."
                  rows="3"
                ></textarea>
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
