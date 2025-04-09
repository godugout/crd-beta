
import React, { useState, useEffect } from 'react';
import { assetService, DigitalAsset } from '@/lib/dam/assetService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetGalleryProps {
  onSelectAsset?: (asset: DigitalAsset) => void;
  cardId?: string;
  collectionId?: string;
  tags?: string[];
  className?: string;
  selectable?: boolean;
  showActions?: boolean;
  onDelete?: (assetId: string) => void;
  onRefresh?: () => void;
}

const AssetGallery: React.FC<AssetGalleryProps> = ({
  onSelectAsset,
  cardId,
  collectionId,
  tags,
  className = '',
  selectable = true,
  showActions = true,
  onDelete,
  onRefresh
}) => {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const fetchedAssets = await assetService.getAssets({ 
        cardId,
        collectionId,
        tags
      });
      setAssets(fetchedAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadAssets();
  }, [cardId, collectionId, JSON.stringify(tags)]);
  
  const handleAssetClick = (asset: DigitalAsset) => {
    if (selectable) {
      setSelectedAssetId(asset.id);
      if (onSelectAsset) {
        onSelectAsset(asset);
      }
    }
  };
  
  const handleDeleteAsset = async (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('Are you sure you want to delete this asset?');
    if (confirmed) {
      const success = await assetService.deleteAsset(assetId);
      if (success) {
        setAssets(assets.filter(asset => asset.id !== assetId));
        if (onDelete) {
          onDelete(assetId);
        }
      }
    }
  };
  
  const handleRefresh = () => {
    loadAssets();
    if (onRefresh) {
      onRefresh();
    }
  };
  
  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  if (assets.length === 0) {
    return (
      <div className={`text-center py-12 border rounded-lg bg-gray-50 ${className}`}>
        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No images found</p>
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Assets</h3>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <Card 
            key={asset.id}
            className={cn(
              "cursor-pointer overflow-hidden",
              selectable && selectedAssetId === asset.id && "ring-2 ring-blue-500"
            )}
            onClick={() => handleAssetClick(asset)}
          >
            <div className="relative aspect-[3/4]">
              {asset.mimeType.startsWith('image/') ? (
                <img 
                  src={asset.publicUrl} 
                  alt={asset.title || 'Asset'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {showActions && (
                <div className="absolute top-1 right-1">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-7 w-7 p-0 rounded-full opacity-80 hover:opacity-100"
                    onClick={(e) => handleDeleteAsset(asset.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            <CardContent className="p-2">
              <p className="text-sm truncate">{asset.title || 'Untitled'}</p>
              <p className="text-xs text-gray-500">
                {new Date(asset.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssetGallery;
