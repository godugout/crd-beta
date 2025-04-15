
import React from 'react';
import { X } from 'lucide-react';
import { MobileTouchButton } from '@/components/ui/mobile-controls';
import { ResponsiveImage } from '@/components/ui/responsive-image';

interface ImagePreviewProps {
  previewUrl: string | null;
  previewUrls: string[];
  onClear: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ previewUrl, previewUrls, onClear }) => {
  if (!previewUrl) return null;

  if (previewUrls.length <= 1) {
    return (
      <div className="relative w-full aspect-[2.5/3.5] rounded-xl overflow-hidden shadow-card">
        <ResponsiveImage 
          src={previewUrl} 
          alt="Card preview" 
          className="w-full h-full object-cover" 
        />
        <MobileTouchButton
          onClick={onClear}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-subtle hover:bg-gray-100 transition-colors"
          variant="outline"
          size="sm"
          hapticFeedback={false}
        >
          <X className="h-4 w-4 text-cardshow-slate" />
        </MobileTouchButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {previewUrls.slice(0, 6).map((url, index) => (
          <div key={index} className="relative aspect-[2.5/3.5] rounded-lg overflow-hidden shadow-md">
            <ResponsiveImage 
              src={url}
              alt={`Processed image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      {previewUrls.length > 6 && (
        <div className="text-center text-sm text-gray-500">
          +{previewUrls.length - 6} more images processed
        </div>
      )}
      <div className="flex justify-center">
        <MobileTouchButton
          onClick={onClear}
          className="flex items-center gap-2"
          variant="secondary"
          size="sm"
          hapticFeedback={false}
        >
          <X className="h-4 w-4" />
          Clear All Images
        </MobileTouchButton>
      </div>
    </div>
  );
};

export default ImagePreview;
