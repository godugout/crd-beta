
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Image, XCircle } from 'lucide-react';
import ImageUploader from '@/components/dam/ImageUploader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AssetGallery from '@/components/dam/AssetGallery';

interface ImageSelectorProps {
  imageUrl: string;
  onImageSelected: (url: string) => void;
  onImageRemove: () => void;
  title?: string;
  className?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  imageUrl,
  onImageSelected,
  onImageRemove,
  title = 'Card Image',
  className = ''
}) => {
  const [isAssetGalleryOpen, setIsAssetGalleryOpen] = useState(false);
  
  const handleImageUploadComplete = (url: string) => {
    onImageSelected(url);
  };

  const handleAssetSelect = (asset: any) => {
    onImageSelected(asset.publicUrl);
    setIsAssetGalleryOpen(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{title}</Label>
      <div className="flex flex-col items-center space-y-4">
        {imageUrl ? (
          <div className="relative max-w-xs w-full">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full rounded-lg shadow-md"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white"
                onClick={() => setIsAssetGalleryOpen(true)}
              >
                <Image className="h-4 w-4 mr-1" />
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white text-red-500"
                onClick={onImageRemove}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="space-y-4">
              <ImageUploader 
                onUploadComplete={handleImageUploadComplete}
                title="Upload Card Image"
                maxSizeMB={10}
              />

              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">or</div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAssetGalleryOpen(true)}
                >
                  <Image className="h-4 w-4 mr-2" />
                  Select from Asset Gallery
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Asset Gallery Dialog */}
      <Dialog open={isAssetGalleryOpen} onOpenChange={setIsAssetGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Image from Gallery</DialogTitle>
          </DialogHeader>
          <AssetGallery 
            onSelectAsset={handleAssetSelect}
            selectable={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageSelector;
