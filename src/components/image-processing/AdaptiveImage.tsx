
import React, { useState, useEffect } from 'react';
import { useAdaptiveImageFormats, ImageVariants } from '@/hooks/useAdaptiveImageFormats';
import { cn } from '@/lib/utils';

interface AdaptiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  variants?: ImageVariants;
  fallbackSrc?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Adaptive Image component that:
 * - Serves most efficient format based on browser capabilities
 * - Supports responsive srcSet with multiple sizes
 * - Provides loading indicators and fallbacks
 * - Uses progressive/blur loading techniques for better UX
 */
const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  src,
  variants,
  fallbackSrc = '/placeholder-image.jpg',
  alt = '',
  width,
  height,
  priority = false,
  blur = false,
  className = '',
  sizes,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isBlurring, setIsBlurring] = useState(blur);
  
  const { getOptimalImageSource, generateResponsiveSrcSet } = useAdaptiveImageFormats();
  
  const imageVariants: ImageVariants = variants || {
    original: src || '',
    fallback: fallbackSrc
  };
  
  const { src: optimalSrc, type } = getOptimalImageSource(imageVariants, sizes);
  
  // Handle successful load
  const handleLoad = () => {
    setIsLoaded(true);
    
    if (blur) {
      // Remove blur effect after a short delay for smooth transition
      setTimeout(() => setIsBlurring(false), 100);
    }
    
    if (onLoad) {
      onLoad();
    }
  };
  
  // Handle error
  const handleError = () => {
    setHasError(true);
    
    if (onError) {
      onError();
    }
  };
  
  // Generate srcset if sizes are provided
  const srcSet = sizes && optimalSrc ? generateResponsiveSrcSet(optimalSrc, 
    [320, 640, 960, 1280, 1920], 
    type
  ) : undefined;
  
  // Reset state if src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setIsBlurring(blur);
  }, [src, blur]);

  return (
    <div className={cn(
      "relative overflow-hidden",
      className
    )}>
      {/* Low quality placeholder or loading state */}
      {!isLoaded && !hasError && (
        <div className={cn(
          "absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse",
          isBlurring ? "opacity-100" : "opacity-0"
        )}/>
      )}
      
      {/* The actual image */}
      <img
        src={hasError ? fallbackSrc : optimalSrc}
        srcSet={!hasError ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isBlurring && isLoaded ? "blur-sm" : "blur-0"
        )}
        {...props}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center p-4">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Image could not be loaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveImage;
