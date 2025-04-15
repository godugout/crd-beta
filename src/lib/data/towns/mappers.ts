
import { TownMember, Town } from '@/lib/types/town';

/**
 * Maps a town record from the database to the Town interface
 */
export const mapTownFromDb = (team: any): Town => ({
  id: team.id,
  name: team.name,
  slug: team.team_code?.toLowerCase() || team.id,
  description: team.description,
  logo_url: team.logo_url,
  banner_url: team.banner_url,
  owner_id: team.owner_id,
  status: team.status,
  website: team.website,
  email: team.email,
  specialties: team.specialties,
  created_at: team.created_at,
  updated_at: team.updated_at,
  primary_color: team.primary_color,
  secondary_color: team.secondary_color,
  tertiary_color: team.tertiary_color,
  founded_year: team.founded_year,
  city: team.city,
  state: team.state,
  country: team.country,
  mascot: team.mascot
});

/**
 * Maps a town member record from the database to the TownMember interface
 */
export const mapTownMemberFromDb = (member: any): TownMember => {
  return {
    id: member.id,
    townId: member.team_id,
    userId: member.user_id,
    role: member.role,
    joinedAt: member.joined_at,
    user: member.users ? {
      id: member.users.id,
      displayName: member.users.display_name || member.users.email?.split('@')[0],
      email: member.users.email,
      avatarUrl: member.users.avatar_url
    } : undefined
  };
};
