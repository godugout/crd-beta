
/**
 * Image loading utility functions
 */

// Define a set of reliable images from Unsplash that we know work
const RELIABLE_IMAGES = {
  basketball: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1000',
  football: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=1000',
  baseball: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=1000',
  anime: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000',
  vintage: 'https://images.unsplash.com/photo-1637666589313-f22b900e9c2d?q=80&w=1000',
  pokemon: 'https://images.unsplash.com/photo-1613771404273-1bound29e8d20?q=80&w=1000',
  default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000'
};

/**
 * Get a fallback image URL based on category or tag
 * @param tags Array of tags for the card
 * @param title Card title as backup for categorization
 */
export function getFallbackImageUrl(tags: string[] = [], title: string = ''): string {
  // Prioritize certain tags if they exist
  const lowerCaseTags = tags.map(tag => tag.toLowerCase());
  const lowerCaseTitle = title.toLowerCase();
  
  // Check for basketball-related content
  if (lowerCaseTags.some(tag => tag.includes('basketball') || tag.includes('nba') || tag.includes('lakers'))) {
    return RELIABLE_IMAGES.basketball;
  }
  
  // Check for football-related content
  if (lowerCaseTags.some(tag => tag.includes('football') || tag.includes('nfl'))) {
    return RELIABLE_IMAGES.football;
  }
  
  // Check for baseball-related content
  if (lowerCaseTags.some(tag => tag.includes('baseball') || tag.includes('mlb'))) {
    return RELIABLE_IMAGES.baseball;
  }
  
  // Check for anime-related content
  if (lowerCaseTags.some(tag => tag.includes('anime') || tag.includes('manga') || tag.includes('gundam'))) {
    return RELIABLE_IMAGES.anime;
  }
  
  // Check for vintage-related content
  if (lowerCaseTags.some(tag => tag.includes('vintage') || tag.includes('retro'))) {
    return RELIABLE_IMAGES.vintage;
  }
  
  // Check for pokemon-related content
  if (lowerCaseTags.some(tag => tag.includes('pokemon') || tag.includes('tcg'))) {
    return RELIABLE_IMAGES.pokemon;
  }
  
  // If no specific tag matches, try to extract a category from the title
  if (lowerCaseTitle.includes('basketball') || lowerCaseTitle.includes('nba') || lowerCaseTitle.includes('laker')) {
    return RELIABLE_IMAGES.basketball;
  }
  
  if (lowerCaseTitle.includes('football') || lowerCaseTitle.includes('nfl')) {
    return RELIABLE_IMAGES.football;
  }
  
  if (lowerCaseTitle.includes('pokemon') || lowerCaseTitle.includes('tcg')) {
    return RELIABLE_IMAGES.pokemon;
  }
  
  if (lowerCaseTitle.includes('gundam') || lowerCaseTitle.includes('anime')) {
    return RELIABLE_IMAGES.anime;
  }
  
  // Default fallback if nothing else matches
  return RELIABLE_IMAGES.default;
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
    (url.startsWith('http') || url.startsWith('/')) && 
    (url.includes('.jpg') || 
     url.includes('.jpeg') || 
     url.includes('.png') || 
     url.includes('.webp') || 
     url.includes('.gif') ||
     url.includes('unsplash.com') || 
     url.includes('source.unsplash.com') ||
     url.includes('lovable-uploads'))
  );
}
