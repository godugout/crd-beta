
import { FALLBACK_FRONT_IMAGE_URL } from './cardDefaults';

// Explicitly define fallback image paths with web-safe absolute paths
export const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';
export const FALLBACK_UNSPLASH_BACKUP = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

// Enhanced error handling for image loading
export const handleImageLoadError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackUrl: string = FALLBACK_UNSPLASH_BACKUP
) => {
  const imgElement = event.currentTarget;
  imgElement.onerror = null; // Prevent infinite error loop
  
  // Attempt multiple fallback strategies
  const fallbackUrls = [
    fallbackUrl, 
    FALLBACK_FRONT_IMAGE_URL, 
    FALLBACK_UNSPLASH_BACKUP
  ];

  const tryNextFallback = (urls: string[]) => {
    if (urls.length > 0) {
      const nextUrl = urls.shift();
      imgElement.src = nextUrl || FALLBACK_UNSPLASH_BACKUP;
    }
  };

  imgElement.addEventListener('error', () => tryNextFallback(fallbackUrls));
  
  return fallbackUrl;
};
