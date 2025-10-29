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
import { authSelector } from "../reducer/authReducer.jsx";

export const HomePage = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector(taskSelector);
  const { boards, currentBoard, loading } = useSelector(boardSelector);
  const { isAuthenticated } = useSelector(authSelector);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

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
          boardsResult.forEach((board) => {
            if (board.lists) {
              board.lists.forEach((list) => {
                if (list.tasks) {
                  list.tasks.forEach((task) => {
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
      } catch (error) {
        toast.error("Failed to fetch data");
      }
    };
    fetchTasks();
  }, [dispatch, isAuthenticated]);

  const handleSelectedBoard = (board) => {
    dispatch(setSelectedBoard(board));
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const taskStats = {
    total: tasks.length,
    inbox: tasks.filter((task) => task.status === "inbox").length,
    todo: tasks.filter((task) => task.status === "todo").length,
    completed: tasks.filter((task) => task.status === "completed").length,
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Welcome to TaskPro
          </h1>
          <p className="text-slate-600 mb-8">
            Please login to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    TaskPro
                  </h1>
                  <p className="text-sm text-slate-500">
                    Organize • Collaborate • Achieve
                  </p>
                </div>
              </div>
            </div>

            {/* Task Statistics Cards */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span>{taskStats.total} Total</span>
              </div>
              <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{taskStats.todo} Active</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{taskStats.completed} Done</span>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  U
                </div>
                <span>Account</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Modern Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Modern Inbox Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-black/5">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Task Inbox
                  </h2>
                </div>

                {/* Modern Search */}
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTasks.map((task) => (
                    <InboxList key={task._id} task={task} />
                  ))}
                  {filteredTasks.length === 0 && searchTerm && (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-slate-300 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p className="text-slate-500 text-sm">
                        No tasks found matching "{searchTerm}"
                      </p>
                    </div>
                  )}
                  {tasks.length === 0 && !searchTerm && (
                    <div className="text-center py-8">
                      <svg
                        className="w-12 h-12 text-slate-300 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="text-slate-500 text-sm mb-3">
                        No tasks yet
                      </p>
                      <p className="text-slate-400 text-xs">
                        Create your first task below!
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <Inboxform />
                </div>
              </div>
            </div>
          </div>

          {/* Modern Board Section - PRESERVED DRAG AND DROP */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl shadow-black/5">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Project Boards
                    </h2>
                  </div>

                  <button
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    data-bs-toggle="modal"
                    data-bs-target="#createBoardModal"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-sm font-medium">New Board</span>
                  </button>
                </div>

                {/* Board Selection Tabs */}
                <div className="flex flex-wrap gap-2">
                  {boards.map((board) => (
                    <button
                      key={board._id}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        currentBoard?._id === board._id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      }`}
                      onClick={() => handleSelectedBoard(board)}
                    >
                      {board.title}
                    </button>
                  ))}
                  {boards.length === 0 && (
                    <div className="text-slate-500 text-sm italic">
                      No boards yet. Create your first board!
                    </div>
                  )}
                </div>
              </div>

              {/* PRESERVED: Main Drag and Drop Board View */}
              <div className="p-6">
                <BoardView />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <CreateBoardModal />
      </div>
    </div>
  );
};
