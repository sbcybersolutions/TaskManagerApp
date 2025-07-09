// frontend/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Base URL for your Django backend API
// Read from environment variables, defaulting to local if not set.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';


// Define the shape of the user object that will be stored in the context
interface User {
  username: string;
  email: string;
  // Add other user properties you might get from the token or user profile API
}

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null; // The authenticated user object, or null if not logged in
  accessToken: string | null; // The JWT access token
  refreshToken: string | null; // The JWT refresh token
  login: (username: string, password: string) => Promise<boolean>; // Function to handle user login
  register: (username: string, email: string, password: string, password2: string) => Promise<boolean>; // Function to handle user registration
  logout: () => void; // Function to handle user logout
  loading: boolean; // Indicates if an auth operation is in progress
  error: string | null; // Stores any authentication error messages
}

// Create the AuthContext with a default (null) value.
// The actual provider will wrap our application.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode; // ReactNode allows any valid React child (components, elements, etc.)
}

// AuthProvider component
// This component will wrap our entire application and provide the authentication state
// and functions to all its children.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State to store the authenticated user
  const [user, setUser] = useState<User | null>(null);
  // State to store the access token
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  // State to store the refresh token
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  // State to manage loading status during API calls
  const [loading, setLoading] = useState<boolean>(false);
  // State to store error messages
  const [error, setError] = useState<string | null>(null);

  // Base URL for your Django backend API
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Make sure this matches your Django server URL

  // Effect to load tokens from localStorage on initial component mount
  // and set the user if tokens exist (simple check, proper validation would be better)
  useEffect(() => {
    if (accessToken) {
      try {
        // A very basic way to decode JWT (not for security, just to get user data)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        setUser({ username: payload.username, email: payload.email });
      } catch (e) {
        console.error("Failed to decode access token from localStorage:", e);
        logout(); // Clear invalid tokens
      }
    }
  }, [accessToken]); // Dependency array: run only when accessToken changes

  // Function to handle user login
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        setUser({ username: data.username, email: data.email }); // Set user from token payload
        setLoading(false);
        return true; // Login successful
      } else {
        setError(data.detail || 'Login failed.');
        setLoading(false);
        return false; // Login failed
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error or server unavailable.');
      setLoading(false);
      return false; // Login failed due to network error
    }
  }, []); // Empty dependency array means this function is stable and won't re-create

  // Function to handle user registration
  const register = useCallback(async (username: string, email: string, password: string, password2: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        // Optionally, log in the user immediately after registration
        // await login(username, password); // Uncomment if you want auto-login
        return true; // Registration successful
      } else {
        // Handle specific validation errors from Django
        const errorMessages = Object.values(data).flat().join(' ');
        setError(errorMessages || 'Registration failed.');
        setLoading(false);
        return false; // Registration failed
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error or server unavailable.');
      setLoading(false);
      return false; // Registration failed due to network error
    }
  }, [login]); // Dependency on login function if auto-login is enabled

  // Function to handle user logout
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setError(null); // Clear any previous errors on logout
  }, []);

  // The context value that will be provided to consumers
  const contextValue: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    login,
    register,
    logout,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};