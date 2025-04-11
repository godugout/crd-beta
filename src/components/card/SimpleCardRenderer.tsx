
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertOctagon, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleCardRendererProps {
  imageUrl: string;
  title: string;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

const SimpleCardRenderer: React.FC<SimpleCardRendererProps> = ({
  imageUrl,
  title,
  tags,
  onClick,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Reset states when image URL changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [imageUrl]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageUrl);
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error('Failed to load image:', imageUrl);
    setIsError(true);
  };

  return (
    <div 
      className={cn("card-container relative overflow-hidden rounded-lg aspect-[2.5/3.5]", className)}
      onClick={onClick}
    >
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-slate-300" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center px-4 text-slate-400">
            <ImageIcon className="h-12 w-12 mb-2 mx-auto" />
            <div className="mb-1">Image not available</div>
            <div className="text-xs opacity-75">{title}</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageUrl}
        alt={title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError ? "hidden" : ""
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Card details at bottom */}
      {isLoaded && !isError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {tags[0]}
              </span>
              {tags.length > 1 && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  +{tags.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleCardRenderer;
