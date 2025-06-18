import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

/**
 * PrivateRoute component
 * Protects routes by checking authentication status.
 * If the user is not authenticated, redirects to the login page.
 * Usage: <PrivateRoute><ProtectedComponent /></PrivateRoute>
 */
export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  // Render the protected children if authenticated
  return children;
}

// Notes:
// - This component is used to wrap protected routes.
// - It is simple and easy to understand for a 10th-grade reader. 