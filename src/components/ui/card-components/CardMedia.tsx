
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface CardMediaProps {
  /**
   * URL of the image to display
   */
  src: string;
  
  /**
   * Alternative text for the image
   */
  alt: string;
  
  /**
   * Optional aspect ratio for the image container
   * @default "aspect-[2.5/3.5]"
   */
  aspectRatio?: string;
  
  /**
   * Optional classes to apply to the container
   */
  className?: string;
  
  /**
   * Optional callback for when the image is clicked
   */
  onClick?: () => void;
  
  /**
   * Whether to enable lazy loading of the image
   * @default true
   */
  lazyLoad?: boolean;
  
  /**
   * Placeholder to show while image is loading
   * @default undefined
   */
  placeholderSrc?: string;
}

/**
 * A optimized media component for displaying card images with lazy loading
 */
export const CardMedia = ({
  src,
  alt,
  aspectRatio = "aspect-[2.5/3.5]",
  className,
  onClick,
  lazyLoad = true,
  placeholderSrc
}: CardMediaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px'
  });

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
  };

  // Determine what image to load
  const imageSrc = (lazyLoad && !inView) ? placeholderSrc : src;

  return (
    <div 
      ref={ref}
      className={cn(
        aspectRatio,
        "relative overflow-hidden rounded-lg",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 mx-auto mb-2" 
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
            <p>Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* The image */}
      {(inView || !lazyLoad) && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={lazyLoad ? "lazy" : "eager"}
        />
      )}
    </div>
  );
};
