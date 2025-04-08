
import React from 'react';
import { DigitalAsset } from '@/services/digitalAssetService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Loader, AlertTriangle, ImageOff, FileText, FileAudio, FileVideo, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetGridProps {
  assets: DigitalAsset[];
  isLoading: boolean;
  error: string | null;
  selectedAsset: DigitalAsset | null;
  onSelectAsset: (asset: DigitalAsset) => void;
  hasMore: boolean;
  loadMore: () => void;
  className?: string;
}

const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  isLoading,
  error,
  selectedAsset,
  onSelectAsset,
  hasMore,
  loadMore,
  className = '',
}) => {
  // Function to get the appropriate icon based on mime type
  const getAssetIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageOff className="h-10 w-10 text-gray-400" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileText className="h-10 w-10 text-gray-400" />;
    } else if (mimeType.startsWith('audio/')) {
      return <FileAudio className="h-10 w-10 text-gray-400" />;
    } else if (mimeType.startsWith('video/')) {
      return <FileVideo className="h-10 w-10 text-gray-400" />;
    } else {
      return <File className="h-10 w-10 text-gray-400" />;
    }
  };

  // Render loading state
  if (isLoading && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading assets...</p>
      </div>
    );
  }

  // Render error state
  if (error && assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
        <p className="text-gray-600 mb-2">Failed to load assets</p>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  // Render empty state
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <File className="h-10 w-10 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">No assets found</p>
        <p className="text-gray-500 text-sm">Upload files or change your filters</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {assets.map((asset) => (
          <Card
            key={asset.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all hover:shadow-md border",
              selectedAsset?.id === asset.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-gray-300"
            )}
            onClick={() => onSelectAsset(asset)}
          >
            <div className="aspect-square relative">
              {asset.mimeType.startsWith('image/') ? (
                <OptimizedImage
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.title || asset.originalFilename}
                  className="w-full h-full object-contain bg-gray-50"
                  placeholderSrc={asset.thumbnailUrl}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  {getAssetIcon(asset.mimeType)}
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs truncate font-medium" title={asset.title || asset.originalFilename}>
                {asset.title || asset.originalFilename}
              </p>
              <p className="text-xs text-gray-500">
                {(asset.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AssetGrid;
