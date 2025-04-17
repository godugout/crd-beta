
import { useContext } from 'react';
import { AuthContext } from '@/context/auth/AuthContext';
import { UserPermission, UserRole, ROLE_PERMISSIONS, UserPermissionValues } from '@/lib/types/user';

export function usePermissions() {
  const { user } = useContext(AuthContext);
  
  const hasPermission = (permission: UserPermission): boolean => {
    if (!user) return false;
    
    // If the user has explicit permissions list, check there first
    if (user.permissions && user.permissions.includes(permission)) {
      return true;
    }
    
    // Otherwise, check the role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  };
  
  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role;
  };
  
  return {
    hasPermission,
    hasRole,
    // Shorthand helpers for common permission checks
    canCreateCard: hasPermission(UserPermissionValues.CREATE_CARD),
    canEditCard: hasPermission(UserPermissionValues.EDIT_CARD),
    canDeleteCard: hasPermission(UserPermissionValues.DELETE_CARD),
    canViewDashboard: hasPermission(UserPermissionValues.VIEW_DASHBOARD),
    canManageUsers: hasPermission(UserPermissionValues.MANAGE_USERS),
    hasAdminAccess: hasPermission(UserPermissionValues.ADMIN_ACCESS),
    // Role shortcuts
    isAdmin: hasRole(UserRole.ADMIN),
    isArtist: hasRole(UserRole.ARTIST),
    isFan: hasRole(UserRole.FAN),
    isModerator: hasRole(UserRole.MODERATOR)
  };
}
