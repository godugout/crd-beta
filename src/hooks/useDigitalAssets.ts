
import { useState, useEffect, useCallback } from 'react';
import { digitalAssetService, DigitalAsset, AssetUploadResult } from '@/services/digitalAssetService';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

interface UseDigitalAssetsProps {
  folder?: string;
  mimeType?: string;
  tags?: string[];
  limit?: number;
  autoFetch?: boolean;
}

export function useDigitalAssets({
  folder,
  mimeType,
  tags,
  limit = 20,
  autoFetch = true
}: UseDigitalAssetsProps = {}) {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const fetchAssets = useCallback(async (resetPagination = false) => {
    if (!user) {
      setAssets([]);
      setHasMore(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const currentOffset = resetPagination ? 0 : offset;
      if (resetPagination) {
        setOffset(0);
      }
      
      const { assets: fetchedAssets, count } = await digitalAssetService.getUserAssets({
        limit,
        offset: currentOffset,
        folder,
        mimeType,
        tags,
      });
      
      if (resetPagination) {
        setAssets(fetchedAssets);
      } else {
        setAssets(prevAssets => [...prevAssets, ...fetchedAssets]);
      }
      
      setTotalCount(count);
      setHasMore(currentOffset + fetchedAssets.length < count);
    } catch (err: any) {
      console.error('Error fetching assets:', err);
      setError(err.message || 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, [user, limit, offset, folder, mimeType, tags]);
  
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setOffset(prevOffset => prevOffset + limit);
  }, [hasMore, isLoading, limit]);
  
  const refresh = useCallback(() => {
    fetchAssets(true);
  }, [fetchAssets]);
  
  const uploadAsset = useCallback(async (
    file: File,
    assetFolder?: string,
    metadata: Record<string, any> = {},
    generateThumbnail = true
  ): Promise<AssetUploadResult> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }
    
    try {
      setIsUploading(true);
      
      const result = await digitalAssetService.uploadAsset(
        file,
        assetFolder || folder || 'uploads',
        metadata,
        generateThumbnail
      );
      
      if (result.success && result.asset) {
        setAssets(prevAssets => [result.asset!, ...prevAssets]);
        setTotalCount(prevCount => prevCount + 1);
      } else {
        toast.error(result.error || 'Failed to upload file');
      }
      
      return result;
    } catch (err: any) {
      console.error('Error uploading asset:', err);
      return { success: false, error: err.message || 'Failed to upload file' };
    } finally {
      setIsUploading(false);
    }
  }, [user, folder]);
  
  const deleteAsset = useCallback(async (assetId: string): Promise<boolean> => {
    try {
      const success = await digitalAssetService.deleteAsset(assetId);
      
      if (success) {
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
        setTotalCount(prevCount => Math.max(0, prevCount - 1));
        toast.success('Asset deleted successfully');
      } else {
        toast.error('Failed to delete asset');
      }
      
      return success;
    } catch (err: any) {
      console.error('Error deleting asset:', err);
      toast.error(err.message || 'Failed to delete asset');
      return false;
    }
  }, []);
  
  const updateAsset = useCallback(async (
    assetId: string, 
    updates: Partial<DigitalAsset>
  ): Promise<boolean> => {
    try {
      const success = await digitalAssetService.updateAsset(assetId, updates);
      
      if (success) {
        setAssets(prevAssets => 
          prevAssets.map(asset => 
            asset.id === assetId ? { ...asset, ...updates } : asset
          )
        );
        toast.success('Asset updated successfully');
      } else {
        toast.error('Failed to update asset');
      }
      
      return success;
    } catch (err: any) {
      console.error('Error updating asset:', err);
      toast.error(err.message || 'Failed to update asset');
      return false;
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchAssets(true);
    }
  }, [autoFetch, fetchAssets]);
  
  // Refetch when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchAssets(true);
    }
  }, [folder, mimeType, JSON.stringify(tags)]);
  
  return {
    assets,
    isLoading,
    error,
    totalCount,
    hasMore,
    isUploading,
    loadMore,
    refresh,
    uploadAsset,
    deleteAsset,
    updateAsset,
    setAssets,
  };
}
