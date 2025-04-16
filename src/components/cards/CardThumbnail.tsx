
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card as CardType } from '@/lib/types';

export interface CardThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
  card?: CardType; // Added card prop to support both usage patterns
  enableEffects?: boolean; // Added for compatibility with other components
  activeEffects?: string[]; // Added for compatibility with other components
}

const CardThumbnail: React.FC<CardThumbnailProps> = ({
  src,
  alt,
  className,
  onClick,
  priority = false,
  card, // New card prop
  enableEffects = false,
  activeEffects = []
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  
  // If card prop is provided, use its imageUrl or thumbnailUrl
  const imageUrl = card ? (card.thumbnailUrl || card.imageUrl) : src;
  const imageAlt = card ? card.title : alt;
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10 bg-gray-200" />
      )}
      
      {hasError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
          <span className="text-sm">Image unavailable</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={imageAlt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            onClick ? 'cursor-pointer' : ''
          )}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          onClick={handleClick}
        />
      )}
      
      {/* Apply effects if enabled */}
      {enableEffects && activeEffects && activeEffects.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Effects would be rendered here */}
        </div>
      )}
    </div>
  );
};

export default CardThumbnail;
