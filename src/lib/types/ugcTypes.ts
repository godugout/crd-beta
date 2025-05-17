
import { User } from './user';

/**
 * Interface for user-generated content assets
 */
export interface UGCAsset {
  id: string;
  name: string;
  title?: string; // Add title property
  description?: string;
  assetUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  creator?: User;
  assetType?: string; // Add assetType property
  tags?: string[];
  marketplace?: {
    price?: number;
    forSale?: boolean;
    featured?: boolean; // Add featured property
    isForSale?: boolean; // Alias for forSale
    salesCount?: number;
  };
}

/**
 * Enum for UGC moderation status
 */
export enum UGCModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged'
}

/**
 * Interface for UGC reports
 */
export interface UGCReport {
  id: string;
  assetId: string;
  reporterId: string;
  reason: string;
  status: UGCModerationStatus;
  details?: string; // Add details property
  createdAt: string;
  updatedAt: string;
  asset?: UGCAsset;
  reporter?: User;
}

/**
 * Interface for UGC marketplace settings
 */
export interface UGCMarketplaceSettings {
  commissionRate: number;
  minPrice: number;
  maxPrice: number;
  allowedAssetTypes: string[];
  moderationRequired: boolean;
}

/**
 * Interface for UGC categories
 */
export interface UGCCategory {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  assetCount?: number;
}
