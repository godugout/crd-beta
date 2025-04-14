
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  PREMIUM = 'premium',
  CREATOR = 'creator',
  MODERATOR = 'moderator'
}

export interface UserProfile {
  id: string;
  email: string;
  avatarUrl?: string;
  name?: string;
  displayName?: string;
  role: UserRole;
  bio?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  signature?: string;
  logoUrl?: string;
  // For artists
  cardsCreated?: number;
  seriesCreated?: number;
  totalSales?: number;
  // For fans
  cardsCollected?: number;
  decksCreated?: number;
  purchaseCount?: number;
}
