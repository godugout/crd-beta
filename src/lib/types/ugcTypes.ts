
import { ElementType, ElementCategory } from './cardElements';

/**
 * Status of a user-generated content item in the moderation pipeline
 */
export type UGCModerationStatus = 
  | 'pending'      // Initial state, waiting for AI or manual review
  | 'approved'     // Content has been approved and is public
  | 'rejected'     // Content has been rejected
  | 'flagged'      // Content needs additional human review
  | 'appealed'     // User has appealed a rejection
  | 'restricted';  // Content is available with restrictions

/**
 * Reasons for content moderation actions
 */
export type UGCModerationReason = 
  | 'inappropriate'
  | 'copyright'
  | 'quality'
  | 'duplicate'
  | 'trademark'
  | 'other';

/**
 * Metadata about a moderation decision
 */
export interface ModerationMetadata {
  status: UGCModerationStatus;
  moderator?: string;
  reason?: UGCModerationReason;
  notes?: string;
  reviewDate?: string;
  aiConfidenceScore?: number;
  appealAllowed?: boolean;
}

/**
 * Pricing model for marketplace items
 */
export type PricingModel = 'free' | 'one-time' | 'subscription';

/**
 * License type for marketplace items
 */
export type LicenseType = 'standard' | 'extended' | 'commercial' | 'custom';

/**
 * Marketplace metadata for a UGC item
 */
export interface MarketplaceMetadata {
  isForSale: boolean;
  price?: number;
  pricingModel?: PricingModel;
  license?: LicenseType;
  allowModifications?: boolean;
  downloadLimit?: number;
  featured?: boolean;
  featuredUntil?: string;
  salesCount?: number;
  rating?: number;
  ratingCount?: number;
}

/**
 * Performance impact assessment of an asset
 */
export interface PerformanceMetrics {
  fileSize: number;          // Size in bytes
  renderComplexity: number;  // Scale of 1-10
  memoryUsage: number;       // Estimated memory usage in MB
  recommendedMaxUses: number; // Recommended max uses per card
}

/**
 * User-generated content base interface
 */
export interface UGCAsset {
  id: string;
  title: string;
  description?: string;
  assetUrl: string;
  thumbnailUrl?: string;
  assetType: ElementType;
  category: ElementCategory;
  tags: string[];
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  moderation: ModerationMetadata;
  marketplace?: MarketplaceMetadata;
  isPublic: boolean;
  isOfficial: boolean;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  performance?: PerformanceMetrics;
}

/**
 * User-generated content report
 */
export interface UGCReport {
  id: string;
  assetId: string;
  reporterId: string;
  reason: UGCModerationReason;
  details: string;
  status: 'open' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

/**
 * Creator profile for the marketplace
 */
export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  socialLinks?: Record<string, string>;
  featured?: boolean;
  verificationStatus: 'unverified' | 'verified' | 'featured';
  joinedAt: string;
  assetCount: number;
  totalSales: number;
  rating: number;
  ratingCount: number;
  earnings?: number;
  payoutInfo?: Record<string, any>;
}
