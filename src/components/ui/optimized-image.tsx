import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useInView } from 'react-intersection-observer';
import { useConnectivity } from '@/hooks/useConnectivity';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** URL for lower quality placeholder shown while main image loads */
  placeholderSrc?: string;
  
  /** URL for full-quality image */
  src: string;
  
  /** Alt text for accessibility */
  alt: string;
  
  /** Low quality placeholder blur amount (0-20) */
  blurAmount?: number;
  
  /** Whether to use progressive loading technique */
  progressive?: boolean;
  
  /** Whether to use WebP format when supported */
  useWebP?: boolean;
  
  /** Custom loading indicator to show instead of the default */
  loadingIndicator?: React.ReactNode;
  
  /** Callback when image successfully loads */
  onLoadSuccess?: () => void;
  
  /** Callback when image fails to load */
  onLoadError?: (error: Error) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to fade in the image when it loads */
  fadeIn?: boolean;
  
  /** Custom animation duration in ms */
  animationDuration?: number;
}

export function OptimizedImage({
  placeholderSrc,
  src,
  alt,
  blurAmount = 5,
  progressive = true, 
  useWebP = true,
  loadingIndicator,
  onLoadSuccess,
  onLoadError,
  className = "",
  fadeIn = true,
  animationDuration = 300,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hasHighQuality, setHasHighQuality] = useState(false);
  const { lazyLoadImages, isLowBandwidth, shouldOptimizeAnimations, getImageQuality } = useMobileOptimization();
  const { isOnline } = useConnectivity();
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Use intersection observer for lazy loading
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Load 200px before it comes into view
  });
  
  // Combine refs
  const setRefs = (node: HTMLImageElement | null) => {
    imageRef.current = node;
    inViewRef(node);
  };
  
  // Decide whether to show the progressive loading placeholder
  const shouldShowPlaceholder = placeholderSrc && progressive && !loaded;
  
  // Decide what image source to use
  const imageSrc = (() => {
    // If we're offline and have a placeholder, use that
    if (!isOnline && placeholderSrc) return placeholderSrc;
    
    // If we're on a low-bandwidth connection and have a placeholder, use that
    if (isLowBandwidth && placeholderSrc && !hasHighQuality) return placeholderSrc;
    
    // Otherwise use the main source
    return src;
  })();
  
  // Handle image loading
  const handleImageLoad = () => {
    setLoaded(true);
    setHasHighQuality(true);
    if (onLoadSuccess) onLoadSuccess();
  };
  
  // Handle image error
  const handleImageError = () => {
    setError(true);
    if (onLoadError) onLoadError(new Error(`Failed to load image: ${src}`));
  };
  
  // Try to load high-quality version after placeholder loads
  // but only if we're online and either not on low bandwidth or placeholder is already loaded
  useEffect(() => {
    if (!inView || !progressive || !placeholderSrc || hasHighQuality) return;
    
    const shouldLoadHighQuality = isOnline && (!isLowBandwidth || loaded);
    if (!shouldLoadHighQuality) return;
    
    const highQualityImage = new Image();
    highQualityImage.src = src;
    highQualityImage.onload = () => {
      setHasHighQuality(true);
      // Replace the src on the visible image
      if (imageRef.current) {
        imageRef.current.src = src;
      }
    };
    
    return () => {
      highQualityImage.onload = null;
    };
  }, [inView, progressive, isOnline, isLowBandwidth, loaded, placeholderSrc, hasHighQuality]);
  
  // Determine loading state for image display
  const isLoading = !loaded && !error;
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {loadingIndicator || (
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
          )}
        </div>
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-400 mb-2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
          <p className="text-gray-500 text-sm">Failed to load image</p>
        </div>
      )}
      
      {/* The actual image */}
      <img
        ref={setRefs}
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover",
          fadeIn && shouldOptimizeAnimations 
            ? loaded 
              ? `opacity-100 transition-opacity duration-${animationDuration}`
              : "opacity-0" 
            : "",
          error ? "hidden" : ""
        )}
        style={shouldShowPlaceholder ? { filter: `blur(${blurAmount}px)` } : undefined}
        loading={lazyLoadImages ? "lazy" : "eager"}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  );
}
