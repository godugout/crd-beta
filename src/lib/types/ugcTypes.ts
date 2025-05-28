
export interface UGCAsset {
  id: string;
  title: string;
  description: string;
  assetType: 'template' | 'element' | 'effect' | 'sound';
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  imageUrl: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  price?: number;
  isApproved: boolean;
  downloadCount: number;
  rating: number;
  marketplace: {
    isListed: boolean;
    price: number;
    currency: string;
  };
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  stats: {
    totalAssets: number;
    totalDownloads: number;
    totalEarnings: number;
    averageRating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UGCReport {
  id: string;
  assetId: string;
  reporterId: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

export type UGCModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';

export interface UGCSubmission {
  id: string;
  assetId: string;
  submitterId: string;
  status: UGCModerationStatus;
  moderatorId?: string;
  moderatorNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}
