
import { HDRPaths } from './types';

export const HDR_LOCAL_PATHS: HDRPaths = {
  studio: {
    '1k': '/environments/scenes/photo_studio_1k.hdr',
    '2k': '/environments/scenes/photo_studio_2k.hdr',
    '4k': '/environments/scenes/photo_studio_4k.hdr',
    '8k': '/environments/scenes/photo_studio_8k.hdr'
  },
  gallery: {
    '1k': '/environments/scenes/art_gallery_1k.hdr',
    '2k': '/environments/scenes/art_gallery_2k.hdr', 
    '4k': '/environments/scenes/art_gallery_4k.hdr',
    '8k': '/environments/scenes/art_gallery_8k.hdr'
  },
  stadium: {
    '1k': '/environments/scenes/sports_stadium_1k.hdr',
    '2k': '/environments/scenes/sports_stadium_2k.hdr',
    '4k': '/environments/scenes/sports_stadium_4k.hdr',
    '8k': '/environments/scenes/sports_stadium_8k.hdr'
  },
  twilight: {
    '1k': '/environments/scenes/twilight_road_1k.hdr',
    '2k': '/environments/scenes/twilight_road_2k.hdr',
    '4k': '/environments/scenes/twilight_road_4k.hdr',
    '8k': '/environments/scenes/twilight_road_8k.hdr'
  },
  quarry: {
    '1k': '/environments/scenes/stone_quarry_1k.hdr',
    '2k': '/environments/scenes/stone_quarry_2k.hdr',
    '4k': '/environments/scenes/stone_quarry_4k.hdr',
    '8k': '/environments/scenes/stone_quarry_8k.hdr'
  },
  coastline: {
    '1k': '/environments/scenes/ocean_coastline_1k.hdr',
    '2k': '/environments/scenes/ocean_coastline_2k.hdr',
    '4k': '/environments/scenes/ocean_coastline_4k.hdr',
    '8k': '/environments/scenes/ocean_coastline_8k.hdr'
  },
  hillside: {
    '1k': '/environments/scenes/forest_hillside_1k.hdr',
    '2k': '/environments/scenes/forest_hillside_2k.hdr',
    '4k': '/environments/scenes/forest_hillside_4k.hdr',
    '8k': '/environments/scenes/forest_hillside_8k.hdr'
  },
  milkyway: {
    '1k': '/environments/scenes/starry_night_1k.hdr',
    '2k': '/environments/scenes/starry_night_2k.hdr',
    '4k': '/environments/scenes/starry_night_4k.hdr',
    '8k': '/environments/scenes/starry_night_8k.hdr'
  },
  esplanade: {
    '1k': '/environments/scenes/royal_esplanade_1k.hdr',
    '2k': '/environments/scenes/royal_esplanade_2k.hdr',
    '4k': '/environments/scenes/royal_esplanade_4k.hdr',
    '8k': '/environments/scenes/royal_esplanade_8k.hdr'
  },
  neonclub: {
    '1k': '/environments/scenes/cyberpunk_neon_1k.hdr',
    '2k': '/environments/scenes/cyberpunk_neon_2k.hdr',
    '4k': '/environments/scenes/cyberpunk_neon_4k.hdr',
    '8k': '/environments/scenes/cyberpunk_neon_8k.hdr'
  },
  industrial: {
    '1k': '/environments/scenes/industrial_workshop_1k.hdr',
    '2k': '/environments/scenes/industrial_workshop_2k.hdr',
    '4k': '/environments/scenes/industrial_workshop_4k.hdr',
    '8k': '/environments/scenes/industrial_workshop_8k.hdr'
  }
};

// Fix: HDR_FALLBACK_URLS should contain string arrays for multiple fallback options
interface HDRFallbackPaths {
  [key: string]: {
    [resolution: string]: string[];
  };
}

export const HDR_FALLBACK_URLS: HDRFallbackPaths = {
  studio: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/photo_studio_01_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/photo_studio_01_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/photo_studio_01_8k.hdr']
  },
  gallery: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/museum_of_ethnography_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/museum_of_ethnography_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/museum_of_ethnography_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/museum_of_ethnography_8k.hdr']
  },
  stadium: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/cape_hill_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/cape_hill_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/cape_hill_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/cape_hill_8k.hdr']
  },
  twilight: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/evening_road_01_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/evening_road_01_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/evening_road_01_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/evening_road_01_8k.hdr']
  },
  quarry: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/quarry_01_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/quarry_01_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/quarry_01_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/quarry_01_8k.hdr']
  },
  coastline: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/venice_sunset_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/venice_sunset_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/venice_sunset_8k.hdr']
  },
  hillside: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/forest_slope_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/forest_slope_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/forest_slope_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/forest_slope_8k.hdr']
  },
  milkyway: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/starry_night_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/starry_night_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/starry_night_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/starry_night_8k.hdr']
  },
  esplanade: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/royal_esplanade_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/royal_esplanade_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/royal_esplanade_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/royal_esplanade_8k.hdr']
  },
  neonclub: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neon_photostudio_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/neon_photostudio_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/neon_photostudio_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/neon_photostudio_8k.hdr']
  },
  industrial: {
    '1k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr'],
    '2k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/industrial_workshop_foundry_2k.hdr'],
    '4k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/industrial_workshop_foundry_4k.hdr'],
    '8k': ['https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/8k/industrial_workshop_foundry_8k.hdr']
  }
};

export const ENVIRONMENT_TYPE_MAP: Record<string, string> = {
  'cosmic': 'milkyway',
  'space': 'milkyway',
  'nightsky': 'milkyway',
  'night': 'milkyway',
  'underwater': 'coastline',
  'ocean': 'coastline',
  'forest': 'hillside',
  'nature': 'hillside',
  'cyberpunk': 'neonclub',
  'cyber': 'neonclub',
  'neon': 'neonclub',
  'luxury': 'esplanade',
  'lounge': 'esplanade',
  'cardshop': 'industrial',
  'store': 'industrial',
  'mall': 'industrial',
  'retro': 'industrial'
};
