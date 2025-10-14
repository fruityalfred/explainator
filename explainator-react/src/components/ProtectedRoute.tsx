/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */

import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, accessToken, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    // Verify user on mount if we have a token
    if (accessToken && !isAuthenticated) {
      fetchCurrentUser();
    }
  }, [accessToken, isAuthenticated, fetchCurrentUser]);

  if (!isAuthenticated && !accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
