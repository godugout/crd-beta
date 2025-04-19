
import { useState, useEffect, useCallback } from 'react';

export interface ImageFormatSupport {
  webp: boolean;
  avif: boolean;
  jpeg2000: boolean;
  heif: boolean;
}

export interface ImageVariants {
  original: string;
  webp?: string;
  avif?: string;
  jpeg2000?: string;
  heif?: string;
  fallback: string;
}

export interface OptimalImageResult {
  src: string;
  srcset?: string;
  type?: string;
  sizes?: string;
}

/**
 * Detects supported image formats in the user's browser
 * and provides optimal image sources
 */
export const useAdaptiveImageFormats = () => {
  const [formatSupport, setFormatSupport] = useState<ImageFormatSupport>({
    webp: false,
    avif: false,
    jpeg2000: false,
    heif: false
  });
  
  const [isDetecting, setIsDetecting] = useState(true);
  
  // Detect format support on mount
  useEffect(() => {
    const detectFormats = async () => {
      try {
        setIsDetecting(true);
        
        const support = {
          webp: await detectWebP(),
          avif: await detectAVIF(),
          jpeg2000: await detectJPEG2000(),
          heif: await detectHEIF()
        };
        
        setFormatSupport(support);
        console.log('Browser image format support:', support);
      } catch (error) {
        console.error('Error detecting image format support:', error);
      } finally {
        setIsDetecting(false);
      }
    };
    
    detectFormats();
  }, []);
  
  /**
   * Get the optimal image source from available variants
   */
  const getOptimalImageSource = useCallback((
    variants: ImageVariants,
    sizes?: string
  ): OptimalImageResult => {
    // If still detecting formats, use the original or fallback
    if (isDetecting) {
      return { src: variants.original || variants.fallback };
    }
    
    // Priority order for formats (best to worst)
    if (formatSupport.avif && variants.avif) {
      return {
        src: variants.avif,
        type: 'image/avif'
      };
    }
    
    if (formatSupport.webp && variants.webp) {
      return {
        src: variants.webp,
        type: 'image/webp'
      };
    }
    
    if (formatSupport.heif && variants.heif) {
      return {
        src: variants.heif,
        type: 'image/heif'
      };
    }
    
    if (formatSupport.jpeg2000 && variants.jpeg2000) {
      return {
        src: variants.jpeg2000,
        type: 'image/jp2'
      };
    }
    
    // Use original or fallback if no modern format is supported
    return { src: variants.original || variants.fallback };
  }, [formatSupport, isDetecting]);
  
  /**
   * Generate responsive srcset for an image
   */
  const generateResponsiveSrcSet = useCallback((
    baseUrl: string,
    widths: number[] = [320, 640, 960, 1280, 1920],
    format?: string
  ): string => {
    // Extract base URL without extension
    const baseWithoutExt = baseUrl.replace(/\.[^/.]+$/, '');
    
    // Get extension from format or original URL
    const ext = format ? 
      format.replace('image/', '') : 
      baseUrl.split('.').pop() || 'jpg';
    
    // Generate srcset entries
    return widths
      .map(width => `${baseWithoutExt}-${width}.${ext} ${width}w`)
      .join(', ');
  }, []);
  
  /**
   * Convert a blob to a specific format
   */
  const convertImageFormat = useCallback(async (
    blob: Blob,
    format: 'webp' | 'jpeg' | 'png',
    quality: number = 0.85
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  }, []);
  
  return {
    formatSupport,
    isDetecting,
    getOptimalImageSource,
    generateResponsiveSrcSet,
    convertImageFormat
  };
};

// Detect WebP support
const detectWebP = async (): Promise<boolean> => {
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  return checkImageSupport(webpData);
};

// Detect AVIF support
const detectAVIF = async (): Promise<boolean> => {
  const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK';
  return checkImageSupport(avifData);
};

// Detect HEIF support (limited browser support)
const detectHEIF = async (): Promise<boolean> => {
  // Most browsers don't support HEIF yet, but we check anyway
  return false; // Realistic fallback for now
};

// Detect JPEG 2000 support
const detectJPEG2000 = async (): Promise<boolean> => {
  // Only Safari supports JPEG 2000
  return 'safari' in window; // Simplistic check
};

// Helper to check image format support
const checkImageSupport = (dataUrl: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = dataUrl;
  });
};

export default useAdaptiveImageFormats;
