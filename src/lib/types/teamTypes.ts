
import { BaseEntity } from './index';
import { User } from './user';

/**
 * Team interface for team-related data
 */
export interface Team extends BaseEntity {
  name: string;
  description?: string;
  logoUrl?: string;
  logo_url?: string;  // For backward compatibility
  banner_url?: string;  // For backward compatibility
  ownerId: string;
  status?: string;
  website?: string;
  email?: string;
  specialties?: string[];
  visibility?: 'public' | 'private' | 'team';
  
  // Team specific fields
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
}

/**
 * Team member interface for team-user relationship
 */
export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer' | string;
  joinedAt: string;
  user?: User;
  isActive?: boolean;
}

/**
 * Team display data interface for UI components
 */
export interface TeamDisplayData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  memberCount?: number;
  owner_id: string;
  primary_color?: string;
  secondary_color?: string;
  founded_year?: number;
  city?: string;
  state?: string;
  stadium?: string;
  league?: string;
  division?: string;
  logo_url?: string;
  imageUrl?: string;
}
