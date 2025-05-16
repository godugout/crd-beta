
import { Team, TeamMember } from '@/lib/types';
import UserRole from '@/lib/enums/userRoles';

/**
 * Map raw team data to Team interface
 * @param rawTeam Raw team data from database
 * @returns Team object
 */
export function mapToTeam(rawTeam: any): Team {
  return {
    id: rawTeam.id,
    name: rawTeam.name,
    description: rawTeam.description || '',
    logoUrl: rawTeam.logo_url,
    coverImage: rawTeam.cover_image,
    members: rawTeam.members || [],
    createdAt: rawTeam.created_at,
    updatedAt: rawTeam.updated_at,
    ownerId: rawTeam.owner_id,
    settings: rawTeam.settings || {},
    isPublic: rawTeam.is_public !== false
  };
}

/**
 * Map raw team member data to TeamMember interface
 * @param rawMember Raw team member data from database
 * @returns TeamMember object
 */
export function mapToTeamMember(rawMember: any): TeamMember {
  return {
    id: rawMember.id,
    userId: rawMember.user_id,
    teamId: rawMember.team_id,
    role: rawMember.role || UserRole.Member, // Using Member instead of USER
    name: rawMember.name,
    email: rawMember.email,
    avatarUrl: rawMember.avatar_url,
    joinedAt: rawMember.joined_at || rawMember.created_at,
    createdAt: rawMember.created_at,
    updatedAt: rawMember.updated_at,
    permissions: rawMember.permissions || []
  };
}
