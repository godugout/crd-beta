
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
}

