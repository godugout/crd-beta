
import React, { useState, useEffect } from 'react';
import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getFallbackImageUrl, isValidImageUrl } from '@/lib/utils/imageUtils';

interface CardMediaProps {
  card: Card;
  onView: (cardId: string) => void;
  className?: string;
}

const CardMedia: React.FC<CardMediaProps> = ({ card, onView, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSource, setImageSource] = useState('');
  
  // Select the best available image source with fallback
  useEffect(() => {
    // Reset states when card changes
    setIsLoaded(false);
    setIsError(false);
    
    // Try using the primary sources
    const primarySource = card.imageUrl || card.thumbnailUrl;
    
    if (isValidImageUrl(primarySource)) {
      setImageSource(primarySource as string);
    } else {
      // Use our fallback logic based on tags and title
      const fallbackUrl = getFallbackImageUrl(card.tags, card.title);
      console.log(`Using fallback image for ${card.title}:`, fallbackUrl);
      setImageSource(fallbackUrl);
    }
  }, [card.imageUrl, card.thumbnailUrl, card.tags, card.title]);

  // Handle image load success
  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSource);
    setIsLoaded(true);
    setIsError(false);
  };

  // Handle image load error - use fallback immediately
  const handleImageError = () => {
    console.error('Failed to load image:', imageSource);
    
    // Get a category-specific fallback
    const fallbackUrl = getFallbackImageUrl(card.tags, card.title);
    
    // Only switch to fallback if we're not already using it
    if (imageSource !== fallbackUrl) {
      console.log('Switching to fallback image for:', card.title, fallbackUrl);
      setImageSource(fallbackUrl);
    } else {
      console.error('Fallback image also failed to load:', fallbackUrl);
      setIsError(true);
    }
  };

  return (
    <div 
      className={cn("relative overflow-hidden rounded-lg aspect-[2.5/3.5] cursor-pointer group", className)}
      onClick={() => onView(card.id)}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
          <div className="h-12 w-12 text-slate-300" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-200 to-slate-300 flex items-center justify-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-4">
            <div className="font-medium truncate max-w-full">{card.title}</div>
          </div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageSource}
        alt={card.title}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isError ? "hidden" : ""
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {/* Glass drawer overlay with card info - slides up on hover */}
      {isLoaded && !isError && (
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/30 backdrop-blur-sm p-3 text-white">
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
