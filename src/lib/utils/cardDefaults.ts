
/**
 * Default values for Card objects across the application
 * This centralizes the default values to ensure consistency
 */

// Default designMetadata structure for new cards
export const DEFAULT_DESIGN_METADATA = {
  cardStyle: {
    template: 'classic',
    effect: 'classic',
    borderRadius: '4px',
    borderColor: '#333333',
    frameColor: '#333333',
    frameWidth: 2,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  textStyle: {
    titleColor: '#FFFFFF',
    titleAlignment: 'left',
    titleWeight: 'bold',
    descriptionColor: '#FFFFFF',
  },
  marketMetadata: {
    isPrintable: true,
    isForSale: false,
    includeInCatalog: true
  },
  cardMetadata: {
    category: 'general',
    cardType: 'standard',
    series: 'default'
  }
};

// Fallback image to use when a card image is invalid or missing
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475';

// Function to ensure a card has all required fields with default values
export const getCardDefaults = () => ({
  title: 'Untitled Card',
  description: '',
  imageUrl: FALLBACK_IMAGE,
  thumbnailUrl: FALLBACK_IMAGE,
  tags: [],
  userId: 'anonymous',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  effects: [],
  designMetadata: DEFAULT_DESIGN_METADATA
});
