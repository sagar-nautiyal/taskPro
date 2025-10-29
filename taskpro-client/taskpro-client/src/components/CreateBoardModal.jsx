import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPortal } from "react-dom";
import { createBoard } from "../reducer/boardReducer";
import { toast } from "react-toastify";

export const CreateBoardModal = () => {
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      await dispatch(createBoard(title)).unwrap();
      toast.success("Created Board, add your task now");
      setTitle("");
      setIsExpanded(false); // Collapse after successful creation
    } catch (err) {
      toast.error("failed to add Board");
    }
  };
  
  return (
    <>
      <button 
        className="btn btn-primary"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          background: isExpanded 
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
            : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          border: 'none',
          color: 'white',
          fontWeight: '600',
          padding: '0.625rem 1.25rem',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isExpanded ? (
            <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
          ) : (
            <>
              <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
            </>
          )}
        </svg>
        {isExpanded ? 'Cancel' : 'New Board'}
      </button>
      
      {isExpanded && createPortal(
        <>
          {/* Backdrop overlay */}
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 99998,
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Modal Form */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            border: '3px solid #8b5cf6',
            boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4), 0 0 0 4px rgba(139, 92, 246, 0.1)',
            width: '90%',
            maxWidth: '480px',
            zIndex: 99999,
            pointerEvents: 'auto',
            userSelect: 'auto'
          }}>

          {/* Header with Icon */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid rgba(139, 92, 246, 0.1)'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h6 style={{ 
                margin: 0,
                color: '#1f2937', 
                fontWeight: '700',
                fontSize: '1.125rem',
                background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Create New Board
              </h6>
              <p style={{ 
                margin: 0, 
                fontSize: '0.75rem', 
                color: '#6b7280',
                marginTop: '0.25rem'
              }}>
                Organize your tasks with a new project board
              </p>
            </div>
          </div>
          
          <form onSubmit={handleCreateBoard} style={{ display: 'block' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="boardTitle" style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem', 
                fontWeight: '600', 
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round"/>
                </svg>
                Board Title <span style={{ color: '#ef4444', fontSize: '1rem' }}>*</span>
              </label>
              <input
                type="text"
                id="boardTitle"
                placeholder="e.g., Marketing Campaign, Sprint Planning..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  background: 'white',
                  pointerEvents: 'auto',
                  userSelect: 'text',
                  cursor: 'text'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b5cf6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.375rem',
                marginTop: '0.625rem'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <small style={{ color: '#8b5cf6', fontSize: '0.75rem', fontWeight: '500' }}>
                  Choose a clear, descriptive name for better organization
                </small>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(226, 232, 240, 0.5)'
            }}>
              <button 
                type="button" 
                onClick={() => setIsExpanded(false)}
                style={{
                  padding: '0.625rem 1.25rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.625rem',
                  background: 'white',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = 'white';
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!title.trim()}
                style={{
                  padding: '0.625rem 1.5rem',
                  borderRadius: '0.625rem',
                  background: title.trim() 
                    ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' 
                    : '#e5e7eb',
                  border: 'none',
                  color: title.trim() ? 'white' : '#9ca3af',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: title.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: title.trim() ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (title.trim()) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (title.trim()) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Create Board
              </button>
            </div>
          </form>
          </div>
        </>,
        document.body
      )}
    </>
  );
};
