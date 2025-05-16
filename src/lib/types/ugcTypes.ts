
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
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
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
