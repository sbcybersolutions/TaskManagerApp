// frontend/src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // To get access token
import { Task, TaskFormData } from '../types'; // Import Task and TaskFormData interfaces
import '../index.css'; // Global styles for task form

interface TaskFormProps {
  taskToEdit?: Task | null; // Optional prop: if present, the form is in edit mode for this task
  onSaveSuccess: () => void; // Callback after successful creation/update
  onCancelEdit: () => void; // Callback to cancel editing (only in edit mode)
}

const TaskForm: React.FC<TaskFormProps> = ({ taskToEdit, onSaveSuccess, onCancelEdit }) => {
  const { accessToken, logout } = useAuth(); // Get accessToken and logout function
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(''); // YYYY-MM-DD
  const [status, setStatus] = useState<Task['status']>('pending'); // Use Task['status'] for type safety
  const [loading, setLoading] = useState<boolean>(false); // Loading state for form submission
  const [error, setError] = useState<string | null>(null); // Error state for form submission

  // Base URL for your Django backend API
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

  // Effect to populate form fields when `taskToEdit` changes (i.e., when entering edit mode)
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || ''); // Handle null description
      setDueDate(taskToEdit.due_date || ''); // Handle null due_date
      setStatus(taskToEdit.status);
    } else {
      // Reset form fields when not in edit mode (e.g., creating a new task)
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
    }
  }, [taskToEdit]); // Dependency: re-run when taskToEdit changes

  // Options for the task status dropdown
  const statusOptions: Task['status'][] = ['pending', 'in_progress', 'completed', 'deferred', 'cancelled'];

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setError('Not authenticated. Please log in.');
      logout();
      return;
    }

    setLoading(true);
    setError(null);

    const taskData: TaskFormData = {
      title,
      description,
      due_date: dueDate || '', // Send empty string if due_date is empty
      status,
    };

    const method = taskToEdit ? 'PUT' : 'POST'; // Use PUT for update, POST for create
    const url = taskToEdit ? `${API_BASE_URL}/tasks/${taskToEdit.id}/` : `${API_BASE_URL}/tasks/`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        onSaveSuccess(); // Call success callback to refresh list/close form
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        logout();
      } else {
        const errorData = await response.json();
        // Handle specific field errors from Django
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || `Failed to ${taskToEdit ? 'update' : 'create'} task.`);
      }
    } catch (err) {
      console.error(`Task ${taskToEdit ? 'update' : 'create'} error:`, err);
      setError('Network error or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2 className="task-form-title">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
      <form onSubmit={handleSubmit} className="task-form">
        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Task Title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            aria-label="Task Description"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            className="form-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            aria-label="Task Due Date"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            className="form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value as Task['status'])}
            required
            aria-label="Task Status"
          >
            {statusOptions.map(option => (
              <option key={option} value={option}>
                {option.replace(/_/g, ' ')} {/* Display human-readable text */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (taskToEdit ? 'Updating...' : 'Creating...') : (taskToEdit ? 'Update Task' : 'Create Task')}
          </button>
          {taskToEdit && ( // Show cancel button only in edit mode
            <button type="button" onClick={onCancelEdit} className="auth-button cancel-button" disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;