import { User } from './user';

/**
 * Interface for team data
 */
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
  primaryColor?: string;
  secondaryColor?: string;
  tags?: string[];
  // Extended fields needed by code in other places
  visibility?: 'public' | 'private' | 'team';
  banner_url?: string;
  bannerUrl?: string;
  website?: string;
  email?: string;
  status?: string;
  specialties?: string[];
  settings?: Record<string, any>;
}

/**
 * Interface for team members
 */
export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user?: User;
  email?: string;
  avatarUrl?: string; // Add avatarUrl property for team members
}

/**
 * Interface for team invitation
 */
export interface TeamInvitation {
  id: string;
  teamId: string;
  team?: Team;
  inviterId: string;
  inviter?: User;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

/**
 * Interface for team settings
 */
export interface TeamSettings {
  teamId: string;
  allowMemberInvites: boolean;
  allowMemberCardCreation: boolean;
  requireContentApproval: boolean;
  defaultCollectionVisibility: 'public' | 'team' | 'private';
  brandingSettings: {
    useCustomBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoPosition: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    defaultTemplate?: string;
  };
  notificationSettings: {
    newMember: boolean;
    newContent: boolean;
    contentUpdates: boolean;
  };
}

// Add UserRole.VIEWER for backward compatibility
export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer'
}
