
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UGCManager } from '@/lib/ugc/UGCManager';
import { ModerationService } from '@/lib/ugc/ModerationService';
import { UGCAsset, CreatorProfile } from '@/lib/types/ugcTypes';
import { ElementType, ElementCategory } from '@/lib/types/cardElements';
import { toast } from 'sonner';

// Query key factory
export const UGC_QUERY_KEYS = {
  assets: ['ugc', 'assets'] as const,
  assetsList: (filters?: any) => [...UGC_QUERY_KEYS.assets, 'list', filters] as const,
  asset: (id: string) => [...UGC_QUERY_KEYS.assets, id] as const,
  creatorProfile: (userId: string) => ['ugc', 'creator', userId] as const,
  moderationStats: ['ugc', 'moderation', 'stats'] as const,
  pendingReports: ['ugc', 'moderation', 'reports'] as const,
};

export function useUGCSystem() {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get public assets with filtering
  const usePublicAssets = (filters?: {
    assetType?: ElementType;
    category?: ElementCategory;
    tags?: string[];
    creatorId?: string;
    featured?: boolean;
    sortBy?: 'latest' | 'popular' | 'rating';
    limit?: number;
    offset?: number;
  }) => {
    return useQuery({
      queryKey: UGC_QUERY_KEYS.assetsList(filters),
      queryFn: () => UGCManager.getPublicAssets(filters),
    });
  };

  // Upload new asset
  const uploadAsset = useMutation({
    mutationFn: async ({
      file,
      metadata
    }: {
      file: File;
      metadata: {
        title: string;
        description?: string;
        assetType: ElementType;
        category: ElementCategory;
        tags: string[];
        isPublic?: boolean;
        forSale?: boolean;
        price?: number;
      };
    }) => {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);

      try {
        const result = await UGCManager.uploadAsset(file, metadata);
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500); // Reset after a delay
        return result;
      } catch (error) {
        clearInterval(progressInterval);
        setUploadProgress(0);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UGC_QUERY_KEYS.assets });
      toast.success('Asset uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });

  // Get creator profile
  const useCreatorProfile = (userId: string) => {
    return useQuery({
      queryKey: UGC_QUERY_KEYS.creatorProfile(userId),
      queryFn: () => UGCManager.getCreatorProfile(userId),
      enabled: !!userId
    });
  };

  // Update creator profile
  const updateCreatorProfile = useMutation({
    mutationFn: (profile: Partial<CreatorProfile> & { userId: string }) => {
      return UGCManager.updateCreatorProfile(profile);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: UGC_QUERY_KEYS.creatorProfile(variables.userId) });
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Profile update failed: ${error.message}`);
    }
  });

  // Report an asset
  const reportAsset = useMutation({
    mutationFn: ({
      assetId,
      reason,
      details
    }: {
      assetId: string;
      reason: string;
      details: string;
    }) => {
      return ModerationService.reportAsset(assetId, reason, details);
    },
    onSuccess: () => {
      toast.success('Report submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Report submission failed: ${error.message}`);
    }
  });

  // Appeal a rejected asset
  const appealRejection = useMutation({
    mutationFn: ({
      assetId,
      appealText
    }: {
      assetId: string;
      appealText: string;
    }) => {
      return ModerationService.appealRejection(assetId, appealText);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: UGC_QUERY_KEYS.asset(variables.assetId) });
      toast.success('Appeal submitted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Appeal submission failed: ${error.message}`);
    }
  });

  // Get moderation stats (for admin dashboard)
  const useModerationStats = () => {
    return useQuery({
      queryKey: UGC_QUERY_KEYS.moderationStats,
      queryFn: () => ModerationService.getModerationStats(),
    });
  };

  // Get pending reports (for admin review)
  const usePendingReports = (limit = 20, offset = 0) => {
    return useQuery({
      queryKey: [...UGC_QUERY_KEYS.pendingReports, { limit, offset }],
      queryFn: () => ModerationService.getPendingReports(limit, offset),
    });
  };

  // Moderate an asset (admin action)
  const moderateAsset = useMutation({
    mutationFn: ({
      assetId,
      status,
      moderatorId,
      reason,
      notes
    }: {
      assetId: string;
      status: 'approved' | 'rejected' | 'flagged';
      moderatorId: string;
      reason?: string;
      notes?: string;
    }) => {
      return ModerationService.moderateAsset(assetId, status as any, moderatorId, reason as any, notes);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: UGC_QUERY_KEYS.asset(variables.assetId) });
      queryClient.invalidateQueries({ queryKey: UGC_QUERY_KEYS.moderationStats });
      toast.success('Moderation decision applied');
    },
    onError: (error: Error) => {
      toast.error(`Moderation failed: ${error.message}`);
    }
  });

  return {
    // Queries
    usePublicAssets,
    useCreatorProfile,
    useModerationStats,
    usePendingReports,
    
    // Mutations
    uploadAsset,
    updateCreatorProfile,
    reportAsset,
    appealRejection,
    moderateAsset,
    
    // State
    uploadProgress
  };
}
