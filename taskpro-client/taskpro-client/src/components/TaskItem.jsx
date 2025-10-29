import { useDrag } from "react-dnd";
import { useDispatch } from "react-redux";
import { deleteTaskThunk, updateTaskThunk } from "../reducer/taskReducer";
import { toast } from "react-toastify";
import { useState } from "react";

export const TaskItem = ({ task, status }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || "");
  
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
      await dispatch(updateTaskThunk({
        taskId: task._id,
        updates: {
          title: editTitle.trim(),
          description: editDescription.trim()
        }
      })).unwrap();
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

  if (isEditing) {
    return (
      <div style={{
        backgroundColor: "#fff",
        padding: "1rem",
        margin: "0.5rem 0",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        border: "2px solid #8b5cf6"
      }}>
        <form onSubmit={handleSaveEdit}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#374151',
              fontSize: '0.875rem'
            }}>
              Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              required
              rows="3"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancelEdit}
              style={{
                padding: '0.5rem 0.875rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
                color: '#6b7280',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 0.875rem',
                border: 'none',
                borderRadius: '0.375rem',
                background: '#8b5cf6',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      style={{
        backgroundColor: "#fff",
        padding: "0.75rem",
        margin: "0.5rem 0",
        borderRadius: "8px",
        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        position: "relative"
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '600' }}>{task.title}</h4>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={handleEdit}
            title="Edit task"
            style={{
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              padding: '0.25rem',
              cursor: 'pointer',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={handleDelete}
            title="Delete task"
            style={{
              background: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              padding: '0.25rem',
              cursor: 'pointer',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      <p style={{ fontSize: "0.875rem", margin: 0, color: '#6b7280' }}>{task.description}</p>
    </div>
  );
};
