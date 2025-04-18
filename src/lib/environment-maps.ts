
import { LightingPreset } from '@/hooks/useCardLighting';

export interface EnvironmentMap {
  id: LightingPreset;
  name: string;
  path: string;
  thumbnail: string;
  description: string;
}

// Define environment maps for different lighting presets
export const ENVIRONMENT_MAPS: EnvironmentMap[] = [
  {
    id: 'studio',
    name: 'Studio',
    path: '/environments/studio.hdr',
    thumbnail: '/environments/thumbnails/studio.jpg',
    description: 'Professional studio lighting with clean, balanced illumination'
  },
  {
    id: 'natural',
    name: 'Natural',
    path: '/environments/natural.hdr',
    thumbnail: '/environments/thumbnails/natural.jpg',
    description: 'Soft, natural daylight with subtle ambient occlusion'
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    path: '/environments/dramatic.hdr',
    thumbnail: '/environments/thumbnails/dramatic.jpg',
    description: 'High contrast lighting with deep shadows and bright highlights'
  },
  {
    id: 'display_case',
    name: 'Display Case',
    path: '/environments/display_case.hdr',
    thumbnail: '/environments/thumbnails/display_case.jpg',
    description: 'Museum-quality display lighting optimized for collectibles'
  }
];

// Helper to get environment map by ID
export const getEnvironmentMapById = (id: LightingPreset): EnvironmentMap => {
  return ENVIRONMENT_MAPS.find(env => env.id === id) || ENVIRONMENT_MAPS[0];
};

// Function to preload environment maps for better performance
export const preloadEnvironmentMaps = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create an array to track loading progress
    const loadingPromises: Promise<HTMLImageElement>[] = [];
    
    // Preload thumbnails
    ENVIRONMENT_MAPS.forEach(env => {
      const imagePromise = new Promise<HTMLImageElement>((resolveImage) => {
        const img = new Image();
        img.onload = () => resolveImage(img);
        img.onerror = () => resolveImage(img); // Don't fail if an image fails to load
        img.src = env.thumbnail;
      });
      
      loadingPromises.push(imagePromise);
    });
    
    // Resolve the main promise when all images are loaded
    Promise.all(loadingPromises)
      .then(() => {
        console.log('Environment map thumbnails preloaded');
        resolve(true);
      })
      .catch(() => {
        console.warn('Some environment map thumbnails failed to preload');
        resolve(false);
      });
  });
};
