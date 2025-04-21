
// Import directly from the main types file
import { UserRole as BaseUserRole } from '../types';

// Re-export the UserRole
export { BaseUserRole as UserRole };

export interface UserProfile {
  id: string;
  email: string;
  avatarUrl?: string;
  name?: string;
  displayName?: string;
  role: BaseUserRole;
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
