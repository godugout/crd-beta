
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserPermission } from '@/lib/types';
import { usePermissions } from '@/hooks/usePermissions';
import { Loader } from 'lucide-react';
import { logger } from '@/lib/monitoring/logger';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: UserPermission;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  adminOnly = false,
  redirectTo = '/auth'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { hasPermission, isAdmin } = usePermissions();
  const location = useLocation();

  // Track access attempts for monitoring
  React.useEffect(() => {
    if (user) {
      logger.info('Protected route access', { 
        context: { 
          path: location.pathname,
          userId: user.id,
          requiredPermission,
          adminOnly
        }
      });
    }
  }, [location.pathname, user, requiredPermission, adminOnly]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    logger.info('Unauthorized access attempt', { context: { path: location.pathname } });
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (adminOnly && !isAdmin()) {
    logger.warn('Non-admin attempted to access admin route', { 
      context: { path: location.pathname, userId: user?.id }
    });
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    logger.warn('User lacks required permission', { 
      context: { 
        path: location.pathname, 
        userId: user?.id,
        requiredPermission
      }
    });
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
