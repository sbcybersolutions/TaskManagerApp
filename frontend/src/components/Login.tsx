// frontend/src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import our custom auth hook
import '../index.css'; // Import global styles for consistent look

interface LoginProps {
  onLoginSuccess: () => void; // Callback function to navigate after successful login
  onNavigateToRegister: () => void; // Callback to navigate to registration
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  // State for form input fields
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Access authentication context values and functions
  const { login, loading, error } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    const success = await login(username, password); // Call the login function from AuthContext
    if (success) {
      onLoginSuccess(); // If login is successful, trigger the navigation callback
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Username input field */}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>

        {/* Password input field */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'} {/* Show loading text when submitting */}
        </button>
      </form>

      {/* Link to navigate to the registration page */}
      <p className="auth-switch-text">
        Don't have an account?{' '}
        <button onClick={onNavigateToRegister} className="auth-switch-button">
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;