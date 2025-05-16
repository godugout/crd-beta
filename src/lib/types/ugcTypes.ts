
import { User } from './user';
import { ElementType, ElementCategory } from './cardElements';

/**
 * Interface for user-generated content assets
 */
export interface UGCAsset {
  id: string;
  name: string;
  description?: string;
  assetUrl: string;
  thumbnailUrl?: string;
  type: ElementType | string;
  category: ElementCategory | string;
  tags?: string[];
  creatorId: string;
  creator?: User;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
  marketMetadata?: {
    price?: number;
    forSale?: boolean;
    featured?: boolean;
    isForSale?: boolean; // Property for AssetMarketplace
    salesCount?: number;
  };
  downloadCount?: number;
  reviewCount?: number;
  averageRating?: number;
  metadata?: Record<string, any>;
  verificationStatus?: 'pending' | 'approved' | 'rejected';
}

/**
 * Interface for creator profiles
 */
export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  assetsCreated: number;
  followers: number;
  following: number;
  totalSales?: number;
  featuredAssets?: UGCAsset[];
  rating?: number;
}

/**
 * Interface for asset collections
 */
export interface UGCCollection {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  creator?: User;
  coverImageUrl?: string;
  assetIds: string[];
  assets?: UGCAsset[];
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
}

/**
 * Interface for content moderation reports
 */
export interface UGCReport {
  id: string;
  reporterId: string;
  reporter?: User;
  assetId: string;
  asset?: UGCAsset;
  reason: 'inappropriate' | 'copyright' | 'spam' | 'other';
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  moderatorId?: string;
  moderatorNotes?: string;
  resolvedAt?: string;
}

/**
 * Interface for asset reviews
 */
export interface UGCReview {
  id: string;
  assetId: string;
  userId: string;
  user?: User;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  helpful: number;
  unhelpful: number;
}
