import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addTaskThunk } from "../reducer/taskReducer";
import { boardSelector } from "../reducer/boardReducer";
import { authSelector } from "../reducer/authReducer";

export const Inboxform = ({ tasks }) => {
  const { currentBoard } = useSelector(boardSelector);
  const { isAuthenticated } = useSelector(authSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login first");
      navigate("/signIn");
    }
  }, [isAuthenticated, navigate]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const description = formData.get("description");

    if (!title.trim()) {
      toast.error("Task title is required");
      setIsLoading(false);
      return;
    }

    if (!description.trim()) {
      toast.error("Task description is required");
      setIsLoading(false);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      boardId: currentBoard?._id,
    };

    try {
      await dispatch(addTaskThunk(taskData)).unwrap();
      toast.success("Task added successfully");
      e.target.reset();
      setIsExpanded(false); // Collapse after successful creation
    } catch (err) {
      toast.error("Failed to add task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-3">
        <button
          className="btn btn-primary btn-block"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {isExpanded ? (
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <>
                <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
          {isExpanded ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {isExpanded && (
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '2px solid #3b82f6',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
          marginBottom: '1rem',
          animation: 'slideDown 0.3s ease-out',
          position: 'relative',
          zIndex: 1
        }}>
          <h6 style={{ 
            marginBottom: '1rem', 
            color: '#1f2937', 
            fontWeight: '600',
            fontSize: '1rem'
          }}>
            Create New Task
          </h6>

          {!currentBoard ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '1.5rem',
              color: '#6b7280',
              background: 'rgba(249, 115, 22, 0.05)',
              borderRadius: '0.5rem',
              border: '1px dashed rgba(249, 115, 22, 0.2)'
            }}>
              <svg style={{ width: '2rem', height: '2rem', color: '#ea580c', marginBottom: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p style={{ margin: 0, fontWeight: '500', color: '#ea580c' }}>Please select a board first!</p>
            </div>
          ) : (
            <form onSubmit={handleAddTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="taskTitle" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Task Title <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  id="taskTitle"
                  name="title"
                  placeholder="Enter task title..."
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    pointerEvents: 'auto'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="taskDescription" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Description <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <textarea
                  id="taskDescription"
                  name="description"
                  placeholder="Describe your task..."
                  rows="3"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    pointerEvents: 'auto',
                    userSelect: 'text',
                    cursor: 'text'
                  }}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsExpanded(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
};
