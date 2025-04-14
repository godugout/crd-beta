
import { useAuth } from '@/hooks/useAuth';
import { UserPermission, ROLE_PERMISSIONS } from '@/lib/types';
import { UserRole } from '@/lib/types/UserTypes';

/**
 * Hook to check user permissions based on their role or specific permissions
 */
export function usePermissions() {
  const { user } = useAuth();
  
  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: UserPermission): boolean => {
    // If user has explicit permissions array, check that first
    if (user?.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }
    
    // Otherwise, fall back to role-based permissions
    if (user?.role) {
      const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
      return rolePermissions.includes(permission);
    }
    
    return false;
  };
  
  /**
   * Check if user has admin role
   */
  const isAdmin = (): boolean => {
    return user?.role === UserRole.ADMIN;
  };
  
  /**
   * Check if user has moderator role or higher
   */
  const isModerator = (): boolean => {
    return user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;
  };
  
  return {
    hasPermission,
    isAdmin,
    isModerator,
  };
}
