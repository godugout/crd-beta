
/**
 * Town type definitions for the Towns feature
 */

export interface Town {
  id: string;
  name: string;
  slug: string;
  description?: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  logo_url?: string;
  banner_url?: string;
  status?: string;
  website?: string;
  email?: string;
  specialties?: string[];
  
  // Town fields
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  founded_year?: number;
  city?: string;
  state?: string;
  country?: string;
  mascot?: string;
  
  // For display purposes
  memberCount?: number;
}

export interface TownGroup {
  id: string;
  townId: string;
  name: string;
  description?: string;
  logo_url?: string;
  created_at?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface TownMember {
  id: string;
  townId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user?: {
    id: string;
    displayName: string;
    email?: string;
    avatarUrl?: string;
  };
}

export interface TownDisplayData {
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
  logo_url?: string;
}
