
import React, { useState } from 'react';
import { Eye, ZoomIn, Image } from 'lucide-react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CardMediaProps {
  card: Card;
  onView: (cardId: string) => void;
  className?: string;
}

/**
 * Component for displaying card media with loading states and optimized image loading
 */
const CardMedia: React.FC<CardMediaProps> = ({ card, onView, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  // Prioritize image sources: imageUrl → thumbnailUrl → fallback
  const imageSource = card.imageUrl || card.thumbnailUrl || '/placeholder.svg';

  // Handle image load success
  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSource);
    setIsLoaded(true);
  };

  // Handle image load error
  const handleImageError = () => {
    console.error('Failed to load image:', imageSource);
    setIsError(true);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {/* Placeholder while loading */}
      {!isLoaded && !isError && (
        <div className="w-full h-0 pb-[140%] bg-slate-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {isError && (
        <div className="w-full h-0 pb-[140%] bg-slate-100 flex items-center justify-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <Image className="h-12 w-12 mb-2" />
            <div className="text-center px-4">
              <div className="mb-1">Image not available</div>
              <div className="text-xs opacity-75">{card.title}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageSource}
        alt={card.title}
        className={cn(
          "w-full h-0 pb-[140%] object-cover transition-all duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError ? "hidden" : ""
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        style={{ position: isLoaded ? 'relative' : 'absolute', top: 0, left: 0 }}
      />
      
      {/* Overlay with actions */}
      {isLoaded && !isError && (
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/80 hover:bg-white"
            onClick={() => onView(card.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/80 hover:bg-white"
            onClick={() => onView(card.id)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Card details at bottom */}
      {isLoaded && !isError && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <h3 className="font-medium text-sm line-clamp-1">{card.title}</h3>
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                {card.tags[0]}
              </span>
              {card.tags.length > 1 && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  +{card.tags.length - 1}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardMedia;
