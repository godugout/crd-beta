
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  srcMobile?: string;
  srcTablet?: string;
  srcDesktop?: string;
  fallbackSrc?: string;
  lowQualitySrc?: string;
  loadingStrategy?: 'lazy' | 'eager' | 'auto';
}

export const ResponsiveImage = React.forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({ 
    className, 
    src, 
    srcMobile, 
    srcTablet, 
    srcDesktop,
    fallbackSrc = '/placeholder.svg',
    lowQualitySrc,
    loadingStrategy = 'auto',
    alt = '',
    ...props 
  }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const { isMobile, isLowBandwidth, lazyLoadImages, getImageQuality } = useMobileOptimization();

    // Determine the appropriate image source based on device
    const getAppropriateSource = () => {
      if (error) return fallbackSrc;
      
      if (isLowBandwidth && lowQualitySrc) {
        return lowQualitySrc;
      }
      
      if (isMobile && srcMobile) {
        return srcMobile;
      } else if (!isMobile && window.innerWidth < 1024 && srcTablet) {
        return srcTablet;
      } else if (!isMobile && srcDesktop) {
        return srcDesktop;
      }
      
      return src || fallbackSrc;
    };

    // Determine loading strategy
    const determineLoadingStrategy = () => {
      if (loadingStrategy !== 'auto') return loadingStrategy;
      return (lazyLoadImages && isMobile) ? 'lazy' : 'eager';
    };

    // For images that need URL modification for quality (e.g., CDN images)
    const optimizeImageUrl = (imageUrl: string) => {
      if (!isMobile || !imageUrl) return imageUrl;
      
      const quality = getImageQuality();
      
      // Handle common CDN URL patterns
      if (imageUrl.includes('cloudinary.com')) {
        // Add quality parameter for Cloudinary
        return imageUrl.replace(/\/upload\//, `/upload/q_${quality}/`);
      } else if (imageUrl.includes('imgix.net')) {
        // Add quality parameter for Imgix
        return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}q=${quality}`;
      }
      
      return imageUrl;
    };

    const imageSrc = optimizeImageUrl(getAppropriateSource());
    const loading = determineLoadingStrategy();

    return (
      <div className={cn('relative overflow-hidden', className)}>
        <img
          ref={ref}
          src={imageSrc}
          alt={alt}
          loading={loading}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setError(true);
            console.error(`Failed to load image: ${imageSrc}`);
          }}
          className={cn(
            'transition-opacity duration-300',
            !loaded && 'opacity-0',
            loaded && 'opacity-100'
          )}
          {...props}
        />
        {!loaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
      </div>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';
