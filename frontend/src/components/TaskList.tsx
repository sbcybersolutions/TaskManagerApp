// frontend/src/components/TaskList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; // To get access token and user info
import { Task, PaginatedResponse } from '../types'; // Import the Task and PaginatedResponse interfaces
import '../index.css'; // Global styles for task list

interface TaskListProps {
  onEditTask: (task: Task) => void; // Callback to pass the task to the edit form
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { accessToken, logout } = useAuth(); // Get accessToken and logout function
  const [tasks, setTasks] = useState<Task[]>([]); // State to store the list of tasks
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching tasks
  const [error, setError] = useState<string | null>(null); // Error state for fetch operations
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null); // State to track which task is being deleted

  // Base URL for your Django backend API
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

  // Function to fetch tasks from the backend
  const fetchTasks = useCallback(async () => {
    if (!accessToken) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Include the access token for authentication
        },
      });

      if (response.ok) {
        // Correctly type the response data as PaginatedResponse<Task>
        const data: PaginatedResponse<Task> = await response.json();
        
        // Now, data.results is correctly typed as Task[]
        if (Array.isArray(data.results)) {
          setTasks(data.results); // Set tasks to the 'results' array
        } else {
          // Fallback for unexpected data structure (shouldn't happen with pagination)
          console.error("Received unexpected data format from /api/tasks/:", data);
          setError("Received unexpected data format from server.");
          setTasks([]); // Ensure tasks is an empty array to prevent map error
        }
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        logout(); // Log out if token is expired or invalid
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to fetch tasks.');
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Network error or server unavailable.');
    } finally {
      setLoading(false); // Always set loading to false after fetch attempt
    }
  }, [accessToken, logout]); // Dependencies: re-create if accessToken or logout changes

  // Effect hook to fetch tasks when the component mounts or accessToken changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]); // Dependency: fetchTasks function

  // Function to handle task deletion
  const handleDeleteTask = useCallback(async (taskId: number) => {
    if (!accessToken) {
      setError('Not authenticated. Please log in.');
      return;
    }

    // Use a custom modal or confirmation UI instead of window.confirm
    // For now, we'll use a simple alert as a placeholder for confirmation.
    // In a real app, you'd replace this with a styled modal.
    if (!window.confirm('Are you sure you want to delete this task?')) {
        return; // User cancelled deletion
    }

    setDeleteLoading(taskId); // Set loading state for the specific task being deleted
    setError(null); // Clear previous errors
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Include access token
        },
      });

      if (response.status === 204) { // 204 No Content for successful DELETE
        // Remove the deleted task from the state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to delete task.');
      }
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Network error or server unavailable.');
    } finally {
      setDeleteLoading(null); // Reset delete loading state
    }
  }, [accessToken, logout]); // Dependencies: accessToken, logout

  if (loading) {
    return <div className="loading-message">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="task-list-container">
      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks found. Add a new task to get started!</p>
      ) : (
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-description">{task.description}</p>}
                <div className="task-meta">
                  {task.due_date && <span className="task-due-date">Due: {task.due_date}</span>}
                  <span className={`task-status status-${task.status.replace('_', '-')}`}>
                    {task.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => onEditTask(task)} // Pass the task object to the edit handler
                  className="task-action-button edit-button"
                  aria-label={`Edit task ${task.title}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)} // Call the handleDeleteTask function
                  className="task-action-button delete-button"
                  disabled={deleteLoading === task.id} // Disable button if this task is being deleted
                  aria-label={`Delete task ${task.title}`}
                >
                  {deleteLoading === task.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

