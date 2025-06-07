
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { imageStorageService, ImageVariant } from '@/lib/services/imageStorageService';

interface SmartImageProps {
  src: string;
  alt: string;
  assetId?: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: 'low' | 'medium' | 'high' | 'original';
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  showLoadingState?: boolean;
  enableBlurTransition?: boolean;
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  assetId,
  className,
  width,
  height,
  quality = 'medium',
  loading = 'lazy',
  fallbackSrc = '/images/card-placeholder.png',
  onLoad,
  onError,
  showLoadingState = true,
  enableBlurTransition = true
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [variants, setVariants] = useState<ImageVariant[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine optimal image size based on display dimensions
  const getOptimalVariant = (variants: ImageVariant[], targetWidth?: number): string => {
    if (!targetWidth || variants.length === 0) return src;

    // Sort variants by width
    const sortedVariants = [...variants].sort((a, b) => a.width - b.width);
    
    // Find the best variant for the target width
    // Use a variant that's slightly larger than needed for crisp display
    const scaleFactor = window.devicePixelRatio || 1;
    const optimalWidth = targetWidth * scaleFactor * 1.2; // 20% larger for crisp display
    
    let bestVariant = sortedVariants[0];
    for (const variant of sortedVariants) {
      if (variant.width >= optimalWidth) {
        bestVariant = variant;
        break;
      }
      bestVariant = variant; // Use the largest available if none are big enough
    }

    return bestVariant.storageUrl;
  };

  // Load variants if assetId is provided
  useEffect(() => {
    if (assetId) {
      imageStorageService.getImageVariants(assetId).then(setVariants);
    }
  }, [assetId]);

  // Update src when variants are loaded or display size changes
  useEffect(() => {
    if (variants.length > 0 && width) {
      const optimalSrc = getOptimalVariant(variants, width);
      if (optimalSrc !== currentSrc) {
        setCurrentSrc(optimalSrc);
        setIsLoading(true);
      }
    }
  }, [variants, width, currentSrc]);

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback if not already using it
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      const error = new Error(`Failed to load image: ${currentSrc}`);
      onError?.(error);
    } else {
      const error = new Error('Failed to load fallback image');
      onError?.(error);
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Image is in view, start loading
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [loading]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Loading state */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-all duration-300',
          enableBlurTransition && isLoading && 'blur-sm',
          hasError && 'opacity-50',
          'w-full h-full object-cover'
        )}
        style={{
          opacity: isLoading ? 0.7 : 1,
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default SmartImage;
