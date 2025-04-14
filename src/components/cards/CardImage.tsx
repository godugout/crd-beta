
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/lib/types';
import { getFallbackImageUrl, isValidImageUrl } from '@/lib/utils/imageUtils';

interface CardImageProps {
  /**
   * Card data to display the image from
   */
  card: Card;
  
  /**
   * Optional classNames to apply to the container
   */
  className?: string;
  
  /**
   * Optional alt text for the image
   */
  alt?: string;
  
  /**
   * Whether the image should fill its container
   * @default true
   */
  fill?: boolean;
  
  /**
   * Whether to use lazy loading for the image
   * @default true
   */
  lazyLoad?: boolean;
}

/**
 * Card image component that handles image loading, fallbacks, and errors
 */
export const CardImage: React.FC<CardImageProps> = ({
  card,
  className,
  alt,
  fill = true,
  lazyLoad = true,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // Select the best available image source with fallback
  const imageSource = React.useMemo(() => {
    // Try using the primary sources
    const primarySource = card.imageUrl || card.thumbnailUrl;
    
    if (isValidImageUrl(primarySource)) {
      return primarySource as string;
    } else {
      // Use fallback logic based on tags and title
      return getFallbackImageUrl(card.tags, card.title);
    }
  }, [card.imageUrl, card.thumbnailUrl, card.tags, card.title]);
  
  // Handle image load events
  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };
  
  const handleImageError = () => {
    setIsError(true);
  };
  
  return (
    <div className={cn(
      "relative overflow-hidden w-full h-full",
      className
    )}>
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="h-8 w-8 text-slate-300" />
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center text-slate-500 p-2">
          <span className="text-sm font-medium truncate max-w-full">{card.title || 'Card'}</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={imageSource}
        alt={alt || card.title || 'Card'}
        className={cn(
          "transition-opacity duration-300",
          fill ? "w-full h-full object-cover" : "",
          isLoaded ? "opacity-100" : "opacity-0",
          isError ? "hidden" : ""
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={lazyLoad ? "lazy" : "eager"}
      />
    </div>
  );
};
