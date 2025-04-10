

/**
 * Image loading utility functions
 */

/**
 * Get a fallback image URL based on category or tag
 * @param tags Array of tags for the card
 * @param title Card title as backup for categorization
 */
export function getFallbackImageUrl(tags: string[] = [], title: string = ''): string {
  // Define a set of reliable local images we can use as fallbacks
  const localImages = {
    basketball: '/lovable-uploads/c381b388-5693-44a6-852b-93af5f0d5217.png',
    football: '/lovable-uploads/7bb9f93e-4a42-4b96-9429-8b2966efd3a6.png',
    baseball: '/lovable-uploads/38b125d7-2257-4d56-98fa-c1ff2a7be7ea.png',
    anime: '/lovable-uploads/79a099b9-c77a-491e-9755-ba25419791f5.png',
    vintage: '/lovable-uploads/a38aa501-ea2d-4416-9699-1e69b1826233.png',
    default: '/lovable-uploads/93353027-d213-4314-8ab9-0d38bb552e8a.png'
  };
  
  // Prioritize certain tags if they exist
  const lowerCaseTags = tags.map(tag => tag.toLowerCase());
  const lowerCaseTitle = title.toLowerCase();
  
  // Check for basketball-related content
  if (lowerCaseTags.some(tag => tag.includes('basketball') || tag.includes('nba') || tag.includes('lakers'))) {
    return localImages.basketball;
  }
  
  // Check for football-related content
  if (lowerCaseTags.some(tag => tag.includes('football') || tag.includes('nfl'))) {
    return localImages.football;
  }
  
  // Check for baseball-related content
  if (lowerCaseTags.some(tag => tag.includes('baseball') || tag.includes('mlb'))) {
    return localImages.baseball;
  }
  
  // Check for anime-related content
  if (lowerCaseTags.some(tag => tag.includes('anime') || tag.includes('manga') || tag.includes('gundam'))) {
    return localImages.anime;
  }
  
  // Check for vintage-related content
  if (lowerCaseTags.some(tag => tag.includes('vintage') || tag.includes('retro'))) {
    return localImages.vintage;
  }
  
  // If no specific tag matches, try to extract a category from the title
  if (lowerCaseTitle.includes('basketball') || lowerCaseTitle.includes('nba') || lowerCaseTitle.includes('laker')) {
    return localImages.basketball;
  }
  
  if (lowerCaseTitle.includes('football') || lowerCaseTitle.includes('nfl')) {
    return localImages.football;
  }
  
  if (lowerCaseTitle.includes('gundam') || lowerCaseTitle.includes('anime')) {
    return localImages.anime;
  }
  
  // Default fallback if nothing else matches
  return localImages.default;
}

/**
 * Check if an image URL is valid
 * @param url The URL to check
 * @returns Boolean indicating if the URL seems valid
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  
  // Check if it's a valid URL format that points to an image
  // Include support for local uploads
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

