
import { TeamMember, User, UserRole } from '@/lib/types';
import { Team } from '@/lib/types/TeamTypes';

/**
 * Maps a team record from the database to the Team interface
 */
export const mapTeamFromDb = (team: any): Team => ({
  id: team.id,
  name: team.name,
  description: team.description,
  logo_url: team.logo_url,
  banner_url: team.banner_url,
  owner_id: team.owner_id,
  status: team.status,
  website: team.website,
  email: team.email,
  specialties: team.specialties,
  created_at: team.created_at,
  updated_at: team.updated_at
});

/**
 * Maps a team member record from the database to the TeamMember interface
 */
export const mapTeamMemberFromDb = (member: any): TeamMember => {
  const user: User = {
    id: member.user_id,
    email: member.users?.email,
    displayName: member.users?.display_name,
    name: member.users?.full_name,
    avatarUrl: member.users?.avatar_url,
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    id: member.id,
    teamId: member.team_id,
    userId: member.user_id,
    role: member.role,
    joinedAt: member.joined_at,
    user
  };
};
