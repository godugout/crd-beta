
// Create a centralized constants file for default images
export const FALLBACK_FRONT_IMAGE_URL = '/images/card-placeholder.png';
export const FALLBACK_BACK_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_UNSPLASH_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_IMAGE_URL = FALLBACK_FRONT_IMAGE_URL; // Add alias for broader use

// Add a function to handle image loading errors
export const handleImageLoadError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>, 
  fallbackUrl: string = FALLBACK_UNSPLASH_IMAGE_URL
) => {
  const imgElement = event.currentTarget;
  imgElement.onerror = null; // Prevent infinite error loop
  imgElement.src = fallbackUrl;
};

// Add default design metadata that many components are trying to import
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
    // Adding required properties
    category: 'sports',
    series: 'default',
    cardType: 'standard'
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
