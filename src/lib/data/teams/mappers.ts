
import { User, TeamMember, Team } from '@/lib/types';
import { UserRole } from '@/lib/types/user';
import { v4 as uuidv4 } from 'uuid';

export interface DbTeam {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface DbTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface DbUser {
  id: string;
  email: string;
  display_name?: string;
  name?: string;
  avatar_url?: string;
}

export const dbTeamToTeam = (dbTeam: DbTeam): Team => {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: dbTeam.description,
    logoUrl: dbTeam.logo_url,
    ownerId: dbTeam.owner_id,
    createdAt: dbTeam.created_at,
    updatedAt: dbTeam.updated_at
  };
};

export const dbUserToUser = (dbUser: DbUser): User => {
  return {
    id: dbUser.id,
    email: dbUser.email,
    displayName: dbUser.display_name,
    name: dbUser.name || dbUser.display_name || dbUser.email.split('@')[0],
    avatarUrl: dbUser.avatar_url,
    role: UserRole.USER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
    isActive: true,
    permissions: ['read:own', 'write:own', 'delete:own']
  };
};

export const dbTeamMemberToTeamMember = (dbTeamMember: DbTeamMember, user?: User): TeamMember => {
  return {
    id: dbTeamMember.id,
    teamId: dbTeamMember.team_id,
    userId: dbTeamMember.user_id,
    role: dbTeamMember.role,
    joinedAt: dbTeamMember.joined_at,
    user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
