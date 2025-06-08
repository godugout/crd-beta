
export interface City {
  id: string;
  name: string;
  slug: string;
  state?: string;
  country: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  city_id: string;
  sport: string;
  league?: string;
  division?: string;
  founded_year?: number;
  stadium?: string;
  description?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color?: string;
  team_config: TeamConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  city?: City; // Optional populated field
}

export interface TeamConfig {
  features: TeamFeature[];
  eras: string[];
  theme: string;
  walkman_enabled?: boolean;
  protest_memories_enabled?: boolean;
  mascot_gallery_enabled?: boolean;
  community_features_enabled?: boolean;
  custom_colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    emotions?: Record<string, string>;
  };
  custom_fonts?: {
    display?: string;
    body?: string;
    nostalgia?: string;
  };
}

export type TeamFeature = 'walkman' | 'protest_memories' | 'mascot_gallery' | 'memories' | 'community' | 'templates';

export interface FanMemory {
  id: string;
  user_id: string;
  team_id: string;
  title: string;
  description?: string;
  memory_type: 'game' | 'tailgate' | 'championship' | 'protest' | 'community' | 'farewell' | 'player_moment' | 'season_highlight';
  
  // Game/Event Details
  game_date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  
  // Era Classification (team-specific)
  era?: string;
  
  // Media & Content
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  
  // Personal Context
  attendees: string[];
  personal_significance?: string;
  historical_context?: string;
  
  // Fan Expression & Emotions
  emotions: string[];
  fan_expressions: string[];
  
  // Metadata
  tags: string[];
  visibility: 'public' | 'private' | 'community';
  template_id?: string;
  effect_settings: Record<string, any>;
  
  // Community Features
  is_featured: boolean;
  community_reactions: Record<string, any>;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Optional populated fields
  team?: Team;
}

export interface FanExpression {
  id: string;
  team_id: string;
  category: 'cheer' | 'chant' | 'protest' | 'nostalgia' | 'inside_joke' | 'player_call';
  text_content: string;
  audio_url?: string;
  emotion_tags: string[];
  usage_count: number;
  source: 'fan_submitted' | 'historical' | 'broadcast';
  decade?: string;
  era?: string;
  created_at: string;
  team?: Team;
}

export interface TeamTemplate {
  id: string;
  team_id: string;
  name: string;
  category: 'nostalgia' | 'protest' | 'community' | 'celebration' | 'championship';
  era?: string;
  description?: string;
  preview_url?: string;
  config: Record<string, any>;
  tags: string[];
  usage_count: number;
  created_at: string;
  team?: Team;
}

export interface TeamEvent {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  event_type: 'game' | 'tailgate' | 'protest' | 'community' | 'farewell' | 'championship';
  memories_count: number;
  featured_memory_id?: string;
  is_historical: boolean;
  era?: string;
  created_at: string;
  team?: Team;
}

export interface AudioMemory {
  id: string;
  user_id: string;
  team_id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration: number;
  transcript?: string;
  memory_type: 'game_reaction' | 'story' | 'chant' | 'protest_speech' | 'celebration';
  tags: string[];
  cassette_label: string;
  plays_count: number;
  created_at: string;
  team?: Team;
}
