
/**
 * Image loading utility functions
 */

/**
 * Get a fallback image URL based on category or tag
 * @param tags Array of tags for the card
 * @param title Card title as backup for categorization
 */
export function getFallbackImageUrl(tags: string[] = [], title: string = ''): string {
  // Prioritize certain tags if they exist
  const lowerCaseTags = tags.map(tag => tag.toLowerCase());
  const lowerCaseTitle = title.toLowerCase();
  
  if (lowerCaseTags.some(tag => tag.includes('basketball') || tag.includes('nba') || tag.includes('lakers'))) {
    return 'https://source.unsplash.com/random/400x600?basketball';
  }
  
  if (lowerCaseTags.some(tag => tag.includes('football') || tag.includes('nfl'))) {
    return 'https://source.unsplash.com/random/400x600?football';
  }
  
  if (lowerCaseTags.some(tag => tag.includes('baseball') || tag.includes('mlb'))) {
    return 'https://source.unsplash.com/random/400x600?baseball';
  }
  
  if (lowerCaseTags.some(tag => tag.includes('anime') || tag.includes('manga') || tag.includes('gundam'))) {
    return 'https://source.unsplash.com/random/400x600?robot';
  }
  
  if (lowerCaseTags.some(tag => tag.includes('vintage') || tag.includes('retro'))) {
    return 'https://source.unsplash.com/random/400x600?vintage';
  }
  
  // If no specific tag matches, try to extract a category from the title
  if (lowerCaseTitle.includes('basketball') || lowerCaseTitle.includes('nba') || lowerCaseTitle.includes('laker')) {
    return 'https://source.unsplash.com/random/400x600?basketball';
  }
  
  if (lowerCaseTitle.includes('football') || lowerCaseTitle.includes('nfl')) {
    return 'https://source.unsplash.com/random/400x600?football';
  }
  
  // Default fallback
  return 'https://source.unsplash.com/random/400x600?card';
}

/**
 * Check if an image URL is valid
 * @param url The URL to check
 * @returns Boolean indicating if the URL seems valid
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  
  // Check if it's a valid URL format that points to an image
  return (
    url.startsWith('http') && 
    (url.includes('.jpg') || 
     url.includes('.jpeg') || 
     url.includes('.png') || 
     url.includes('.webp') || 
     url.includes('.gif') ||
     url.includes('unsplash.com') || 
     url.includes('source.unsplash.com'))
  );
}
