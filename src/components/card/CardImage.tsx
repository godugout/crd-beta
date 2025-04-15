
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface CardImageProps {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  fit = 'cover',
  className,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full transition-opacity duration-300",
            fit === 'cover' ? 'object-cover' : 'object-contain',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default CardImage;
