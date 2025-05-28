import { TeamMember, User, UserRole } from '@/lib/types';
import { Team } from '@/lib/types/teamTypes';

/**
 * Maps a team record from the database to the Team interface
 */
export const mapTeamFromDb = (team: any): Team => ({
  id: team.id,
  name: team.name,
  description: team.description,
  logoUrl: team.logo_url,
  logo_url: team.logo_url,
  banner_url: team.banner_url,
  ownerId: team.owner_id, // Keep only ownerId
  status: team.status,
  website: team.website,
  email: team.email,
  specialties: team.specialties,
  createdAt: team.created_at,
  updatedAt: team.updated_at,
  visibility: team.visibility || 'public', // Default visibility
  
  // Team fields
  team_code: team.team_code,
  primary_color: team.primary_color,
  secondary_color: team.secondary_color,
  tertiary_color: team.tertiary_color,
  founded_year: team.founded_year,
  city: team.city,
  state: team.state,
  country: team.country,
  stadium: team.stadium,
  mascot: team.mascot,
  league: team.league,
  division: team.division,
  is_active: team.is_active
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
