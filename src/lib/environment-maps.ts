
import { ValidEnvironmentPreset } from '@/utils/environmentPresets';

interface EnvironmentMap {
  id: string;
  name: string;
  path: string;
  preview: string;
  author?: string;
  intensity?: number;
}

const environmentMaps: Record<string, EnvironmentMap> = {
  studio: {
    id: 'studio',
    name: 'Studio',
    path: '/environments/studio.hdr',
    preview: '/environment-previews/studio.jpg',
    author: 'CRD',
    intensity: 1.0
  },
  natural: {
    id: 'natural',
    name: 'Natural',
    path: '/environments/natural.hdr',
    preview: '/environment-previews/natural.jpg',
    intensity: 0.8
  },
  dramatic: {
    id: 'dramatic',
    name: 'Dramatic',
    path: '/environments/dramatic.hdr',
    preview: '/environment-previews/dramatic.jpg',
    intensity: 1.2
  },
  display_case: {
    id: 'display_case',
    name: 'Display Case',
    path: '/environments/display_case.hdr',
    preview: '/environment-previews/display_case.jpg',
    intensity: 0.9
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    path: '/environments/sunset.hdr',
    preview: '/environment-previews/sunset.jpg',
    intensity: 1.1
  }
};

export const getEnvironmentMapById = (id: string): EnvironmentMap => {
  return environmentMaps[id] || environmentMaps.studio;
};

export const getEnvironmentMapFromPreset = (preset: ValidEnvironmentPreset): EnvironmentMap => {
  switch (preset) {
    case 'studio':
      return environmentMaps.studio;
    case 'natural':
      return environmentMaps.natural;
    case 'dramatic':
      return environmentMaps.dramatic;
    case 'display_case':
      return environmentMaps.display_case;
    case 'sunset':
      return environmentMaps.sunset;
    // Fallbacks for other presets
    case 'dawn':
      return environmentMaps.natural;
    case 'night':
      return environmentMaps.dramatic;
    case 'warehouse':
    case 'apartment':
    case 'lobby':
      return environmentMaps.display_case;
    case 'forest':
    case 'park':
    case 'city':
      return environmentMaps.natural;
    default:
      return environmentMaps.studio;
  }
};

export default environmentMaps;
