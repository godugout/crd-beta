
import React from 'react';
import { Label } from '@/components/ui/label';

interface CardTextOverlayProps {
  imageUrl: string;
}

const CardTextOverlay: React.FC<CardTextOverlayProps> = ({ imageUrl }) => {
  return (
    <div className="text-center py-8">
      <h3 className="text-xl font-semibold mb-4">Text Overlay</h3>
      <p className="text-gray-500 mb-6">
        This feature is coming soon. You'll be able to add text overlays to your CRDs.
      </p>
      
      {imageUrl ? (
        <div className="aspect-[2.5/3.5] max-w-xs mx-auto border-2 border-litmus-green overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="Card preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[2.5/3.5] max-w-xs mx-auto border border-dashed rounded-lg flex items-center justify-center bg-gray-50">
          <p className="text-gray-400">Upload an image to preview</p>
        </div>
      )}
    </div>
  );
};

export default CardTextOverlay;
