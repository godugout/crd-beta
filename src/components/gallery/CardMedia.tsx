
import React, { useState } from 'react';
import { Eye, ZoomIn } from 'lucide-react';
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

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
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
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <div className="text-center px-4">
              <div className="mb-1">Image not available</div>
              <div className="text-xs opacity-75">{card.title}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={card.imageUrl || card.thumbnailUrl}
        alt={card.title}
        className={cn(
          "w-full aspect-[3/4] object-cover transition-all duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          "absolute top-0 left-0"
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Overlay with actions */}
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
      
      {/* Card details at bottom */}
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
    </div>
  );
};

export default CardMedia;
