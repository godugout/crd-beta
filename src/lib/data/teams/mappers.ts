
import { Team, TeamMember, User } from '@/lib/types';

export interface DbTeam {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  // Additional fields
  is_verified?: boolean;
  type?: string;
  website_url?: string;
  social_links?: Record<string, string>;
}

export interface DbTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  invited_by?: string;
  status?: string;
  permissions?: string[];
  user?: DbUser;
}

export interface DbUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  username?: string;
}

/**
 * Maps a database team to the application Team type
 */
export const mapTeamFromDb = (dbTeam: DbTeam): Team => {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: dbTeam.description || '',
    logoUrl: dbTeam.logo_url,
    ownerId: dbTeam.owner_id,
    createdAt: dbTeam.created_at,
    updatedAt: dbTeam.updated_at
  };
};

/**
 * Maps a database user to the application User type
 */
export const mapUserFromDb = (dbUser: DbUser): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || dbUser.email.split('@')[0],
    avatarUrl: dbUser.avatar_url,
    username: dbUser.username,
    isVerified: true,
    isActive: true,
    permissions: []
  };
};

/**
 * Maps a database team member to the application TeamMember type
 */
export const mapTeamMemberFromDb = (dbMember: DbTeamMember): TeamMember => {
  return {
    id: dbMember.id,
    teamId: dbMember.team_id,
    userId: dbMember.user_id,
    role: dbMember.role as "owner" | "admin" | "member" | "viewer", // Cast to correct type
    joinedAt: dbMember.joined_at,
    user: dbMember.user ? mapUserFromDb(dbMember.user) : undefined
  };
};
