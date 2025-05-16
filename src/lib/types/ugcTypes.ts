
import { ElementType, ElementCategory } from './cardElements';

/**
 * UGC Asset interface
 */
export interface UGCAsset {
  id: string;
  title: string;
  description?: string;
  assetUrl: string;
  thumbnailUrl?: string;
  assetType: ElementType;
  category: ElementCategory;
  creatorId: string;
  tags: string[];
  isPublic: boolean;
  isApproved: boolean;
  isOfficial?: boolean; // Added for AssetMarketplace
  moderationStatus: UGCModerationStatus;
  marketplace?: { // Added for AssetMarketplace
    price?: number;
    forSale?: boolean;
    salesCount?: number;
  };
  stats: {
    views: number;
    downloads: number;
    likes: number;
    uses: number;
  };
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * UGC Moderation Status type
 */
export type UGCModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

/**
 * Creator Profile interface
 */
export interface CreatorProfile {
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  assetCount: number;
  followersCount: number;
  followingCount: number;
  verified: boolean;
  createdAt: string;
  socialLinks?: Record<string, string>;
}

/**
 * UGC Report interface
 */
export interface UGCReport {
  id: string;
  assetId: string;
  reporterId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  moderatorId?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}
