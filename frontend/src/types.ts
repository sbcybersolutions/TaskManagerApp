// frontend/src/types.ts

// Defines the structure of a Task object as received from the backend API.
export interface Task {
  id: number;
  user: string; // The username of the user who owns the task
  title: string;
  description: string | null; // Description can be null
  due_date: string | null; // Due date can be null, typically YYYY-MM-DD format
  status: 'pending' | 'in_progress' | 'completed' | 'deferred' | 'cancelled'; // Predefined status options
  created_at: string; // ISO 8601 format string (e.g., "2025-07-08T19:00:00.123456Z")
  updated_at: string; // ISO 8601 format string
}

// Defines the structure of data sent when creating or updating a task.
// 'user' and timestamps are omitted as they are managed by the backend.
export interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
}

// NEW: Interface for the paginated response from Django REST Framework
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[]; // The actual array of items (e.g., Task[])
}