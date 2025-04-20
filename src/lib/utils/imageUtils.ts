
export const getCardImageFallback = (tags?: string[], title?: string, type: 'front' | 'back' = 'front'): string => {
  const defaultFrontImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475';
  const defaultBackImage = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';

  if (!tags || tags.length === 0) {
    return type === 'back' ? defaultBackImage : defaultFrontImage;
  }

  const fallbackImages: Record<string, { front: string; back: string }> = {
    'baseball': { 
      front: 'https://images.unsplash.com/photo-1508344928928-7165b5c2cb0d',
      back: 'https://images.unsplash.com/photo-1546519638-68e109498ffc'
    },
    'basketball': {
      front: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
      back: 'https://images.unsplash.com/photo-1530577197743-7adf14294584'
    },
    'vintage': {
      front: 'https://images.unsplash.com/photo-1594736292631-6df61984a1a8',
      back: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
    }
  };

  // Try to match tags with specific image types
  for (const tag of tags) {
    const lowercaseTag = tag.toLowerCase();
    if (fallbackImages[lowercaseTag]) {
      return type === 'back' ? fallbackImages[lowercaseTag].back : fallbackImages[lowercaseTag].front;
    }
  }

  return type === 'back' ? defaultBackImage : defaultFrontImage;
};

export const getFallbackImageUrl = (type: 'front' | 'back' = 'front'): string => {
  return type === 'back' 
    ? 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    : 'https://images.unsplash.com/photo-1518770660439-4636190af475';
};

