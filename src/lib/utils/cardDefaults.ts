
// Explicitly define fallback image paths with web-safe absolute URLs that are guaranteed to exist
export const FALLBACK_FRONT_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_BACK_IMAGE_URL = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6';
export const FALLBACK_IMAGE_URL = FALLBACK_FRONT_IMAGE_URL; // Alias for broader use
export const FALLBACK_UNSPLASH_BACKUP = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
export const FALLBACK_UNSPLASH_IMAGE_URL = FALLBACK_UNSPLASH_BACKUP; // Backward compatibility

// Enhanced error handling for image loading
export const handleImageLoadError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackUrl: string = FALLBACK_UNSPLASH_BACKUP
) => {
  console.error('Image load error, applying fallback:', event.currentTarget.src);
  const imgElement = event.currentTarget;
  imgElement.onerror = null; // Prevent infinite error loop
  
  // Try a reliable external URL if local file fails
  imgElement.src = fallbackUrl;
  
  return fallbackUrl;
};

// Add default design metadata that many components are importing
export const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'standard',
    effect: 'classic',
    borderRadius: '12px',
    borderWidth: 0,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    frameWidth: 0,
    frameColor: '#000000'
  },
  textStyle: {
    fontFamily: 'Inter, sans-serif',
    titleSize: 18,
    descriptionSize: 14,
    textColor: '#FFFFFF',
    textShadow: true,
    titleColor: '#FFFFFF',
    titleAlignment: 'center',
    titleWeight: 'bold',
    descriptionColor: '#EEEEEE',
    descriptionAlignment: 'center',
  },
  cardMetadata: {
    borderRadius: 12,
    borderWidth: 0,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    overlayOpacity: 0.3,
    overlayColor: 'rgba(0,0,0,0.3)',
    showOverlay: true,
    category: 'sports',
    series: 'default',
    cardType: 'standard',
    cardNumber: '001', // Added for InfoPanel
    artist: 'Unknown' // Added for InfoPanel
  },
  marketMetadata: {
    price: 0,
    currency: 'USD',
    available: true,
    editionSize: 1,
    editionNumber: 1,
    isPrintable: true,
    isForSale: false,
    includeInCatalog: true
  }
};
