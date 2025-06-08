
import { Team, TeamConfig } from '@/lib/types/teamTypes';

// Team configuration registry
export const TEAM_CONFIGS: Record<string, TeamConfig> = {
  'oakland-athletics': {
    features: ['walkman', 'protest_memories', 'mascot_gallery', 'memories', 'community', 'templates'],
    eras: ['early_years', 'dynasty_70s', 'bash_brothers', 'moneyball', 'playoff_runs', 'farewell'],
    theme: 'oakland',
    walkman_enabled: true,
    protest_memories_enabled: true,
    mascot_gallery_enabled: true,
    community_features_enabled: true,
    custom_colors: {
      primary: '#003831',
      secondary: '#EFB21E',
      accent: '#FFFFFF',
      emotions: {
        joy: '#FCD34D',
        heartbreak: '#3B82F6',
        anger: '#EF4444',
        nostalgia: '#92400E',
        hope: '#10B981',
        protest: '#DC2626'
      }
    },
    custom_fonts: {
      display: 'Oswald',
      body: 'Inter',
      nostalgia: 'Courier Prime'
    }
  },
  'san-francisco-giants': {
    features: ['memories', 'community', 'templates'],
    eras: ['ny_giants', 'early_sf', 'bonds_era', 'championship_decade'],
    theme: 'giants',
    walkman_enabled: false,
    protest_memories_enabled: false,
    mascot_gallery_enabled: false,
    community_features_enabled: true,
    custom_colors: {
      primary: '#FD5A1E',
      secondary: '#27251F',
      accent: '#FFFFFF',
      emotions: {
        joy: '#FF8C00',
        heartbreak: '#4682B4',
        anger: '#DC143C',
        nostalgia: '#D2691E',
        hope: '#32CD32',
        celebration: '#FFD700'
      }
    },
    custom_fonts: {
      display: 'Georgia',
      body: 'Inter',
      nostalgia: 'Times New Roman'
    }
  }
};

// Helper functions
export const getTeamConfig = (teamSlug: string): TeamConfig => {
  return TEAM_CONFIGS[teamSlug] || TEAM_CONFIGS['oakland-athletics'];
};

export const hasTeamFeature = (teamSlug: string, feature: string): boolean => {
  const config = getTeamConfig(teamSlug);
  return config.features.includes(feature as any);
};

export const getTeamTheme = (teamSlug: string): string => {
  const config = getTeamConfig(teamSlug);
  return config.theme;
};

export const getTeamColors = (teamSlug: string) => {
  const config = getTeamConfig(teamSlug);
  return config.custom_colors;
};

export const getTeamEras = (teamSlug: string): string[] => {
  const config = getTeamConfig(teamSlug);
  return config.eras;
};

// Sample team data
export const SAMPLE_TEAMS: Partial<Team>[] = [
  {
    id: 'oakland-athletics-id',
    name: 'Oakland Athletics',
    slug: 'oakland-athletics',
    sport: 'Baseball',
    league: 'MLB',
    division: 'AL West',
    founded_year: 1901,
    stadium: 'Oakland Coliseum',
    description: 'The last team standing in Oakland',
    primary_color: '#003831',
    secondary_color: '#EFB21E',
    accent_color: '#FFFFFF',
    team_config: TEAM_CONFIGS['oakland-athletics']
  },
  {
    id: 'san-francisco-giants-id',
    name: 'San Francisco Giants',
    slug: 'san-francisco-giants',
    sport: 'Baseball',
    league: 'MLB',
    division: 'NL West',
    founded_year: 1883,
    stadium: 'Oracle Park',
    description: 'San Francisco Giants - Even Year Magic',
    primary_color: '#FD5A1E',
    secondary_color: '#27251F',
    accent_color: '#FFFFFF',
    team_config: TEAM_CONFIGS['san-francisco-giants']
  }
];
