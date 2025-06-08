
import { TeamMember } from '@/lib/types/teamTypes';
import { Team } from '@/lib/types/teamTypes';

/**
 * Maps a team record from the database to the Team interface
 */
export const mapTeamFromDb = (team: any): Team => ({
  id: team.id,
  name: team.name || `Team ${team.id}`,
  slug: team.slug || (team.name || team.id).toLowerCase().replace(/\s+/g, '-'),
  city_id: team.owner_id || 'unknown-city', // Map owner_id back to city_id for our interface
  sport: 'Baseball', // Default value since it's not in the database
  league: team.league || 'MLB',
  division: team.division,
  founded_year: team.founded_year,
  stadium: team.stadium,
  description: team.description,
  logo_url: team.logo_url,
  primary_color: team.primary_color || '#000000',
  secondary_color: team.secondary_color || '#FFFFFF',
  accent_color: team.accent_color,
  team_config: team.team_config || { features: [], eras: [], theme: 'default' },
  is_active: team.is_active !== false, // Default to true if not specified
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
