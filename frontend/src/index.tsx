// frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot for React 18+
import './index.css'; // Import global styles
import AppWithAuthProvider from './App'; // Import the AppWithAuthProvider wrapper

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppWithAuthProvider /> {/* Render our App wrapped with AuthProvider */}
  </React.StrictMode>
);
