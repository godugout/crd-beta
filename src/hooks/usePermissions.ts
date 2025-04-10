
import { useUser } from '@/hooks/useUser';
import { UserPermission, ROLE_PERMISSIONS } from '@/lib/types';

export const usePermissions = () => {
  const { user } = useUser();
  
  const hasPermission = (permission: UserPermission): boolean => {
    if (!user) return false;
    
    // If user has explicit permissions array, check there first
    if (user.permissions && Array.isArray(user.permissions) && user.permissions.includes(permission)) {
      return true;
    }
    
    // Otherwise check role-based permissions
    if (user.role && ROLE_PERMISSIONS[user.role]) {
      return ROLE_PERMISSIONS[user.role].includes(permission);
    }
    
    // Default to regular user permissions if no role specified
    return ROLE_PERMISSIONS.user.includes(permission);
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isModerator = (): boolean => {
    return user?.role === 'moderator' || user?.role === 'admin';
  };
  
  return {
    hasPermission,
    isAdmin,
    isModerator
  };
};
