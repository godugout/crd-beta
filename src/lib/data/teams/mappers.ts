
import { Team, TeamMember } from '@/lib/types';
import { UserRole } from '@/lib/types/user';

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
    members: rawTeam.members || [],
    createdAt: rawTeam.created_at,
    updatedAt: rawTeam.updated_at,
    ownerId: rawTeam.owner_id,
    settings: rawTeam.settings || {},
    isPublic: rawTeam.is_public !== false,
    // Only copy coverImage if needed for legacy support
    ...(rawTeam.cover_image ? { coverImage: rawTeam.cover_image } : {})
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
    role: rawMember.role || UserRole.VIEWER, // Using VIEWER instead of USER/Member
    // Only include name if needed for legacy support
    ...(rawMember.name ? { name: rawMember.name } : {}),
    email: rawMember.email,
    avatarUrl: rawMember.avatar_url,
    joinedAt: rawMember.joined_at || rawMember.created_at,
    createdAt: rawMember.created_at,
    updatedAt: rawMember.updated_at,
    permissions: rawMember.permissions || []
  };
}

// Make exports available for teamService and teamMembersService
export const mapTeamFromDb = mapToTeam;
export const mapTeamMemberFromDb = mapToTeamMember;
