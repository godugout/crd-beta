
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Team member roles
 */
export enum TeamMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

/**
 * Team member interface
 */
export interface TeamMember extends BaseEntity {
  userId: string;
  teamId: string;
  role: TeamMemberRole;
  invitedBy?: string;
  joinedAt?: string;
  user?: User;
}

/**
 * Team interface
 */
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  members?: TeamMember[];
  ownerId: string;
  visibility: 'public' | 'private' | 'unlisted';
  
  // Additional team properties from DbTeam
  logo_url?: string;
  banner_url?: string;
  status?: string;
  website?: string;
  email?: string;
  specialties?: string[];
  
  // Team fields
  team_code?: string;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  founded_year?: number;
  city?: string;
  state?: string;
  country?: string;
  stadium?: string;
  mascot?: string;
  league?: string;
  division?: string;
  is_active?: boolean;
  
  // For display purposes in TeamGallery
  memberCount?: number;
}
