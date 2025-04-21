
// Default values for cards and rendering
export const FALLBACK_FRONT_IMAGE_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
export const FALLBACK_BACK_IMAGE_URL = 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6';
export const FALLBACK_IMAGE_URL = FALLBACK_FRONT_IMAGE_URL;

// Make card back texture URL configurable
export const CARD_BACK_TEXTURE_URL = '/lovable-uploads/card-back-texture.jpg';

// Default card dimensions (standard trading card ratio)
export const CARD_DIMENSIONS = {
  width: 2.5,
  height: 3.5,
  thickness: 0.05
};

// Safety wrapper for numeric operations (prevents toFixed errors)
export const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return fallback;
  }
  return Number(value);
};

// Format a number safely with decimal places
export const safeFixed = (value: any, decimals: number = 2, fallback: number = 0): string => {
  const num = safeNumber(value, fallback);
  return num.toFixed(decimals);
};
