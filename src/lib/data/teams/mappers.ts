// Add UserRole import if missing
import { User, UserRole } from '@/lib/types/user';

// Find the function that creates a user without a role and update it
export const mapTeamMemberToUser = (member: any): User => {
  return {
    id: member.id || `member-${Date.now()}`,
    email: member.email || '',
    name: member.name || '',
    avatarUrl: member.avatarUrl || '',
    username: member.username || '',
    isVerified: true,
    isActive: true,
    permissions: [],
    createdAt: member.createdAt || new Date().toISOString(),
    updatedAt: member.updatedAt || new Date().toISOString(),
    role: UserRole.USER, // Add the missing role property
  };
};
