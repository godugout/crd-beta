
import { User, UserRole } from '@/lib/types/user';

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

// Helper function to convert a User to a UserProfile
export const userToProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    displayName: user.displayName || user.name || user.username || '',
    avatarUrl: user.avatarUrl,
    role: user.role || UserRole.USER, // Ensure role is always defined
    bio: user.bio || '',
  };
};
