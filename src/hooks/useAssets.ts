
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { assetApi } from '@/lib/api/assetApi';
import { DigitalAsset, AssetUploadOptions } from '@/lib/dam/assetService';

export const ASSET_QUERY_KEYS = {
  all: ['assets'] as const,
  list: (filters?: { tags?: string[]; collectionId?: string }) => 
    [...ASSET_QUERY_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...ASSET_QUERY_KEYS.all, 'detail', id] as const,
};

export function useAssets(options?: { tags?: string[]; collectionId?: string }) {
  return useQuery({
    queryKey: ASSET_QUERY_KEYS.list(options),
    queryFn: () => assetApi.getAssets(options),
  });
}

export function useUploadAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, options }: { file: File; options?: AssetUploadOptions }) => {
      return assetApi.uploadAsset(file, options);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_QUERY_KEYS.all });
      toast.success('Asset uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    }
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (assetId: string) => assetApi.deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_QUERY_KEYS.all });
      toast.success('Asset deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Deletion failed: ${error.message}`);
    }
  });
}

export function useUpdateAssetTags() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ assetId, tags }: { assetId: string; tags: string[] }) => 
      assetApi.updateAssetTags(assetId, tags),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ASSET_QUERY_KEYS.detail(variables.assetId) });
      queryClient.invalidateQueries({ queryKey: ASSET_QUERY_KEYS.all });
      toast.success('Tags updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Update failed: ${error.message}`);
    }
  });
}

// Custom hook for managing selected assets
export function useSelectedAssets() {
  const [selectedAssets, setSelectedAssets] = React.useState<DigitalAsset[]>([]);
  
  const toggleSelect = React.useCallback((asset: DigitalAsset) => {
    setSelectedAssets(prev => {
      const isSelected = prev.some(a => a.id === asset.id);
      return isSelected 
        ? prev.filter(a => a.id !== asset.id) 
        : [...prev, asset];
    });
  }, []);
  
  const clearSelection = React.useCallback(() => {
    setSelectedAssets([]);
  }, []);
  
  return {
    selectedAssets,
    toggleSelect,
    clearSelection,
    isSelected: React.useCallback((assetId: string) => 
      selectedAssets.some(asset => asset.id === assetId), [selectedAssets])
  };
}
