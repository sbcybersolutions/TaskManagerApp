// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import './index.css'; // Global styles
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import Login from './components/Login'; // Import Login component
import Register from './components/Register'; // Import Register component
import TaskList from './components/TaskList'; // Import TaskList component
import TaskForm from './components/TaskForm'; // Import TaskForm component
import { Task } from './types'; // Import Task interface

// Define a simple type for the current page/view
type Page = 'login' | 'register' | 'dashboard';

// Dashboard Component
// This component will be shown when the user is authenticated.
// It manages displaying the task list or the task form.
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth(); // Access user info and logout function from context
  // State to control whether the TaskForm is visible and which task to edit
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Function to handle opening the form for a new task
  const handleCreateNewTask = () => {
    setTaskToEdit(null); // Ensure no task is selected for editing
    setShowTaskForm(true); // Show the form
  };

  // Function to handle opening the form for editing an existing task
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task); // Set the task to be edited
    setShowTaskForm(true); // Show the form
  };

  // Function to handle successful save (create/update) from TaskForm
  const handleTaskSaveSuccess = () => {
    setShowTaskForm(false); // Hide the form
    setTaskToEdit(null); // Clear task to edit
    // TaskList will re-fetch tasks due to its useEffect dependency on accessToken,
    // or we could explicitly trigger a refresh if TaskList had a refresh prop.
  };

  // Function to handle canceling edit mode
  const handleCancelEdit = () => {
    setShowTaskForm(false); // Hide the form
    setTaskToEdit(null); // Clear task to edit
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-heading">Welcome, {user?.username}!</h2>
      <p className="dashboard-text">Your email: {user?.email}</p>
      <button onClick={logout} className="logout-button">Logout</button>

      <div className="task-management-section">
        <h3 className="section-title">Your Tasks</h3>
        {showTaskForm ? (
          // Render TaskForm if showTaskForm is true
          <TaskForm
            taskToEdit={taskToEdit}
            onSaveSuccess={handleTaskSaveSuccess}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          // Otherwise, render TaskList and the "Add New Task" button
          <>
            <button onClick={handleCreateNewTask} className="add-task-button">
              Add New Task
            </button>
            <TaskList onEditTask={handleEditTask} /> {/* Pass edit handler to TaskList */}
          </>
        )}
      </div>
    </div>
  );
};

// Main App component (unchanged from previous step, but now Dashboard is more complex)
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      setCurrentPage('dashboard');
    } else if (!user && !authLoading) {
      setCurrentPage('login');
    }
  }, [user, authLoading]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <Login
            onLoginSuccess={() => setCurrentPage('dashboard')}
            onNavigateToRegister={() => setCurrentPage('register')}
          />
        );
      case 'register':
        return (
          <Register
            onRegisterSuccess={() => setCurrentPage('login')}
            onNavigateToLogin={() => setCurrentPage('login')}
          />
        );
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Login onLoginSuccess={() => setCurrentPage('dashboard')} onNavigateToRegister={() => setCurrentPage('register')} />;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Task Manager</h1>
      </header>
      <main className="app-main">
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Task Manager App</p>
      </footer>
    </div>
  );
}

// Wrap the App component with AuthProvider to make auth context available
const AppWithAuthProvider: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuthProvider;