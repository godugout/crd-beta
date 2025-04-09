
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { assetService, DigitalAsset, AssetUploadOptions } from '@/lib/dam/assetService';
import { useAuth } from '@/context/auth';

// Define the DAM Context interface
interface DamContextType {
  assets: DigitalAsset[];
  isLoading: boolean;
  error: string | null;
  uploadAsset: (file: File, options?: AssetUploadOptions) => Promise<string | null>;
  deleteAsset: (assetId: string) => Promise<boolean>;
  fetchAssets: (options?: { tags?: string[]; collectionId?: string }) => Promise<void>;
  refreshAssets: () => Promise<void>;
  selectedAssets: DigitalAsset[];
  selectAsset: (asset: DigitalAsset) => void;
  unselectAsset: (assetId: string) => void;
  clearSelection: () => void;
  applyTagToAssets: (tag: string, assetIds: string[]) => Promise<boolean>;
}

// Create the context with a default value
const DamContext = createContext<DamContextType | undefined>(undefined);

// Define the Provider Props
interface DamProviderProps {
  children: React.ReactNode;
}

export const DamProvider: React.FC<DamProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<DigitalAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assets with optional filtering
  const fetchAssets = useCallback(async (options?: { tags?: string[]; collectionId?: string }) => {
    if (!user) {
      setAssets([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedAssets = await assetService.getAssets(options);
      setAssets(fetchedAssets);
    } catch (err: any) {
      setError(err?.message || 'Failed to load assets');
      toast.error('Error loading assets');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Refresh assets - uses the same logic as fetchAssets but with current state
  const refreshAssets = useCallback(() => fetchAssets(), [fetchAssets]);

  // Upload a new asset
  const uploadAsset = useCallback(async (file: File, options?: AssetUploadOptions): Promise<string | null> => {
    if (!user) {
      toast.error('You must be logged in to upload assets');
      return null;
    }
    
    try {
      const result = await assetService.uploadAsset(file, options);
      
      if (!result) {
        toast.error('Failed to upload asset');
        return null;
      }

      // Refresh assets to include the newly uploaded one
      refreshAssets();
      
      return result.url;
    } catch (err: any) {
      toast.error('Error uploading asset');
      console.error('Upload error:', err);
      return null;
    }
  }, [user, refreshAssets]);

  // Delete an asset
  const deleteAsset = useCallback(async (assetId: string): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to delete assets');
      return false;
    }
    
    try {
      const success = await assetService.deleteAsset(assetId);
      
      if (success) {
        // Update local state by filtering out the deleted asset
        setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
        // Also remove from selected assets if it was selected
        setSelectedAssets(prevSelected => prevSelected.filter(asset => asset.id !== assetId));
        toast.success('Asset deleted successfully');
      } else {
        toast.error('Failed to delete asset');
      }
      
      return success;
    } catch (err: any) {
      toast.error('Error deleting asset');
      console.error('Delete error:', err);
      return false;
    }
  }, [user]);

  // Asset selection methods
  const selectAsset = useCallback((asset: DigitalAsset) => {
    setSelectedAssets(prev => {
      if (prev.some(a => a.id === asset.id)) {
        return prev; // Already selected
      }
      return [...prev, asset];
    });
  }, []);

  const unselectAsset = useCallback((assetId: string) => {
    setSelectedAssets(prev => prev.filter(asset => asset.id !== assetId));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAssets([]);
  }, []);

  // Apply a tag to multiple assets
  const applyTagToAssets = useCallback(async (tag: string, assetIds: string[]): Promise<boolean> => {
    // In a real implementation, this would update the assets in the database
    // For now, let's just update the local state
    if (assetIds.length === 0) return false;
    
    try {
      // Update local state
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          if (assetIds.includes(asset.id)) {
            // Add tag if it's not already present
            const tags = Array.isArray(asset.tags) ? [...asset.tags] : [];
            if (!tags.includes(tag)) {
              tags.push(tag);
            }
            return { ...asset, tags };
          }
          return asset;
        })
      );
      
      toast.success(`Applied tag "${tag}" to ${assetIds.length} assets`);
      return true;
    } catch (err) {
      console.error('Error applying tags:', err);
      toast.error('Failed to apply tags');
      return false;
    }
  }, []);

  // Initialize assets on mount
  React.useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user, fetchAssets]);

  const value = {
    assets,
    isLoading,
    error,
    uploadAsset,
    deleteAsset,
    fetchAssets,
    refreshAssets,
    selectedAssets,
    selectAsset,
    unselectAsset,
    clearSelection,
    applyTagToAssets
  };

  return <DamContext.Provider value={value}>{children}</DamContext.Provider>;
};

// Custom hook to use the DAM context
export const useDam = () => {
  const context = useContext(DamContext);
  if (context === undefined) {
    throw new Error('useDam must be used within a DamProvider');
  }
  return context;
};
