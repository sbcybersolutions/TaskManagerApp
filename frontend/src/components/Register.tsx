// frontend/src/components/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import our custom auth hook
import '../index.css'; // Import global styles for consistent look

interface RegisterProps {
  onRegisterSuccess: () => void; // Callback function to navigate after successful registration
  onNavigateToLogin: () => void; // Callback to navigate to login
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
  // State for form input fields
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');

  // Access authentication context values and functions
  const { register, loading, error } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission
    // Call the register function from AuthContext
    const success = await register(username, email, password, password2);
    if (success) {
      onRegisterSuccess(); // If registration is successful, trigger the navigation callback
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {/* Display error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Username input field */}
        <div className="form-group">
          <label htmlFor="reg-username">Username:</label>
          <input
            type="text"
            id="reg-username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>

        {/* Email input field */}
        <div className="form-group">
          <label htmlFor="reg-email">Email:</label>
          <input
            type="email"
            id="reg-email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>

        {/* Password input field */}
        <div className="form-group">
          <label htmlFor="reg-password">Password:</label>
          <input
            type="password"
            id="reg-password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>

        {/* Confirm Password input field */}
        <div className="form-group">
          <label htmlFor="reg-password2">Confirm Password:</label>
          <input
            type="password"
            id="reg-password2"
            className="form-input"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            aria-label="Confirm Password"
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'} {/* Show loading text when submitting */}
        </button>
      </form>

      {/* Link to navigate to the login page */}
      <p className="auth-switch-text">
        Already have an account?{' '}
        <button onClick={onNavigateToLogin} className="auth-switch-button">
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;