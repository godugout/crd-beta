import { Team, TeamMember, User, UserRole } from '@/lib/types/user';

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
  const currentTime = new Date().toISOString();
  
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || dbUser.email.split('@')[0],
    avatarUrl: dbUser.avatar_url,
    username: dbUser.username,
    isVerified: true,
    isActive: true,
    permissions: [],
    createdAt: currentTime,
    updatedAt: currentTime
  };
};

/**
 * Maps a database team member to the application TeamMember type
 */
export const mapTeamMemberFromDb = (dbMember: DbTeamMember): TeamMember => {
  const currentTime = new Date().toISOString();
  
  return {
    id: dbMember.id,
    teamId: dbMember.team_id,
    userId: dbMember.user_id,
    role: dbMember.role as "owner" | "admin" | "member" | "viewer", // Cast to correct type
    joinedAt: dbMember.joined_at,
    createdAt: currentTime,
    updatedAt: currentTime,
    user: dbMember.user ? mapUserFromDb(dbMember.user) : undefined
  };
};

export const mapToUser = (data: any) => {
  return {
    id: data.id || '',
    email: data.email || '',
    name: data.name || '',
    avatarUrl: data.avatar_url || '',
    username: data.username || '',
    isVerified: true,
    isActive: true,
    permissions: [],
    role: data.role || 'fan', // Add required role property
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
  };
};

export const mapToTeamMember = (data: any, user: any = null) => {
  return {
    id: data.id || '',
    teamId: data.team_id || '',
    userId: data.user_id || '',
    role: data.role || 'member',
    joinedAt: data.joined_at || new Date().toISOString(),
    createdAt: data.created_at || new Date().toISOString(), // Add required property
    updatedAt: data.updated_at || new Date().toISOString(), // Add required property
    user: user
  };
};

export function mapApiUserToUser(apiUser: any): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name || apiUser.displayName || '',
    avatarUrl: apiUser.avatarUrl || apiUser.avatar || '',
    username: apiUser.username || '',
    isVerified: apiUser.isVerified || false,
    isActive: apiUser.isActive || true,
    permissions: apiUser.permissions || [],
    createdAt: apiUser.createdAt || new Date().toISOString(),
    updatedAt: apiUser.updatedAt || new Date().toISOString(),
    // Add required role property
    role: apiUser.role || UserRole.USER
  };
}
