
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface CardThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

const CardThumbnail: React.FC<CardThumbnailProps> = ({
  src,
  alt,
  className,
  onClick,
  priority = false
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
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
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            onClick ? 'cursor-pointer' : ''
          )}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default CardThumbnail;
