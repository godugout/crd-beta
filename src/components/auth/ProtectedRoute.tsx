
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProtectedRouteProps {
  requiredRole?: string;
  redirectPath?: string;
  children?: React.ReactNode;
}

/**
 * A wrapper component for routes that need authentication
 * or specific user roles to access
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  redirectPath = '/login',
  children
}) => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // Show loading state while auth status is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg font-medium">Authenticating...</span>
      </div>
    );
  }
  
  // Redirect if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // Check if a specific role is required
  if (requiredRole && user) {
    const hasRequiredRole = user.role === requiredRole;
    
    // Role check failed, redirect to unauthorized or home
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Fixed the Boolean issue by using a proper JavaScript boolean comparison
  if (process.env.MAINTENANCE_MODE === 'true') {
    return <Navigate to="/maintenance" replace />;
  }
  
  // Authentication successful, render the protected content
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
