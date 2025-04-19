
// Create a centralized constants file for default images
export const FALLBACK_FRONT_IMAGE_URL = '/images/card-placeholder.png';
export const FALLBACK_BACK_IMAGE_URL = '/images/card-back-placeholder.png';
export const FALLBACK_UNSPLASH_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

// Add a function to handle image loading errors
export const handleImageLoadError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackUrl: string = FALLBACK_UNSPLASH_IMAGE_URL
) => {
  const imgElement = event.currentTarget;
  imgElement.onerror = null; // Prevent infinite error loop
  imgElement.src = fallbackUrl;
};
