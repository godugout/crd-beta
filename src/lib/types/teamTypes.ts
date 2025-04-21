
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Team interface
 */
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
}

/**
 * Team member interface
 */
export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
}

/**
 * Team invitation interface
 */
export interface TeamInvitation extends BaseEntity {
  teamId: string;
  invitedEmail: string;
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  role: 'admin' | 'member' | 'viewer';
  expiresAt: string;
}
