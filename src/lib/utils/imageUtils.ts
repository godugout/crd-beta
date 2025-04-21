
/**
 * Returns a fallback image URL based on card tags or title
 */
export const getFallbackImageUrl = (tags?: string[], title?: string): string => {
  // Default fallback image
  const defaultFallback = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  
  if (!tags || tags.length === 0) {
    return defaultFallback;
  }
  
  // Try to get a relevant image based on tags
  const tag = tags[0].toLowerCase();
  
  // Map of categories to fallback images
  const fallbackImages: Record<string, string> = {
    'baseball': 'https://images.unsplash.com/photo-1508344928928-7165b5c2cb0d',
    'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
    'football': 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4',
    'soccer': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
    'hockey': 'https://images.unsplash.com/photo-1580138593486-3cc436fec3d4',
    'vintage': 'https://images.unsplash.com/photo-1594736292631-6df61984a1a8',
    'modern': 'https://images.unsplash.com/photo-1618022649120-ab48d3c5ab0e',
    'rare': 'https://images.unsplash.com/photo-1597538015050-2f28c13d5bc3',
    'collectible': 'https://images.unsplash.com/photo-1606068498010-465e7fdccae6',
    'game': 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69'
  };
  
  // Check if any tag matches our categories
  for (const t of tags) {
    const lowercaseTag = t.toLowerCase();
    if (fallbackImages[lowercaseTag]) {
      return fallbackImages[lowercaseTag];
    }
  }
  
  // If no matching tag, try to use title
  if (title) {
    const lowercaseTitle = title.toLowerCase();
    for (const [category, url] of Object.entries(fallbackImages)) {
      if (lowercaseTitle.includes(category)) {
        return url;
      }
    }
  }
  
  // If all else fails, return default fallback
  return defaultFallback;
};
