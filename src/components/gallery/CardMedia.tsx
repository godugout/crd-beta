
import React, { useState } from 'react';
import { Eye, ZoomIn } from 'lucide-react';
import { Card } from '@/lib/types';
import { Button } from '@/components/ui/button';

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
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !isError && (
        <div className="w-full h-0 pb-[100%] bg-slate-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {isError && (
        <div className="w-full h-0 pb-[100%] bg-slate-100 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <div className="mb-2">Image not available</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={card.imageUrl}
        alt={card.title}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
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
    </div>
  );
};

export default CardMedia;
