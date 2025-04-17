
// Add UserRole import if missing
import { User, UserRole } from '@/lib/types/user';
import { Team, TeamMember } from '@/lib/types';

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

// Add the missing database mapping functions
export const mapTeamFromDb = (dbTeam: any): Team => {
  return {
    id: dbTeam.id || '',
    name: dbTeam.name || '',
    description: dbTeam.description || '',
    logoUrl: dbTeam.logo_url || '',
    ownerId: dbTeam.owner_id || '',
    createdAt: dbTeam.created_at || new Date().toISOString(),
    updatedAt: dbTeam.updated_at || new Date().toISOString(),
  };
};

export const mapTeamMemberFromDb = (dbMember: any): TeamMember => {
  return {
    id: dbMember.id || '',
    teamId: dbMember.team_id || '',
    userId: dbMember.user_id || '',
    role: dbMember.role || 'member',
    joinedAt: dbMember.joined_at || new Date().toISOString(),
  };
};
