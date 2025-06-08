
import { TeamMember } from '@/lib/types/teamTypes';
import { Team } from '@/lib/types/teamTypes';

/**
 * Maps a team record from the database to the Team interface
 */
export const mapTeamFromDb = (team: any): Team => ({
  id: team.id,
  name: team.name,
  slug: team.slug,
  city_id: team.city_id,
  sport: team.sport,
  league: team.league,
  division: team.division,
  founded_year: team.founded_year,
  stadium: team.stadium,
  description: team.description,
  logo_url: team.logo_url,
  primary_color: team.primary_color,
  secondary_color: team.secondary_color,
  accent_color: team.accent_color,
  team_config: team.team_config || {},
  is_active: team.is_active,
  created_at: team.created_at,
  updated_at: team.updated_at
});

/**
 * Maps a team member record from the database to the TeamMember interface
 */
export const mapTeamMemberFromDb = (member: any): TeamMember => ({
  id: member.id,
  teamId: member.team_id,
  userId: member.user_id,
  role: member.role,
  joinedAt: member.joined_at,
  user: member.users ? {
    id: member.users.id,
    displayName: member.users.display_name,
    email: member.users.email,
    avatarUrl: member.users.avatar_url
  } : undefined
});
