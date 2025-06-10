// Enhanced Oakland types to match the new database schema
export interface OaklandMemory {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  memory_type: 'game' | 'tailgate' | 'championship' | 'protest' | 'community' | 'farewell' | 'player_moment' | 'season_highlight';
  
  // Game/Event Details
  game_date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  season_year?: number;
  weather_conditions?: string;
  crowd_size_estimate?: number;
  
  // Era Classification
  era: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  
  // Media & Content
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  ticket_stub_image?: string;
  
  // Personal Context
  attendees: string[];
  personal_significance?: string;
  historical_context?: string;
  player_mentioned?: string;
  memory_quality?: 'vivid' | 'clear' | 'fuzzy' | 'fragments';
  
  // Fan Expression & Emotions
  emotions: string[];
  fan_expressions: string[];
  
  // Relationships
  audio_memory_id?: string;
  mascot_mentioned?: string;
  social_media_links?: Record<string, any>;
  
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
}

export interface AudioMemory {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration?: number;
  transcript?: string;
  memory_type: 'game_reaction' | 'story' | 'chant' | 'protest_speech' | 'celebration';
  tags: string[];
  cassette_label?: string;
  plays_count: number;
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  game_date?: string;
  opponent?: string;
  is_featured: boolean;
  visibility: 'public' | 'private' | 'community';
  created_at: string;
  updated_at: string;
}

export interface OaklandMascot {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  model_3d_url?: string;
  personality_traits: string[];
  catchphrases: string[];
  backstory?: string;
  protest_message?: string;
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  is_featured: boolean;
  fan_favorites: number;
  adoption_count: number;
  created_at: string;
  updated_at: string;
}

export interface JumbotronContent {
  id: string;
  user_id: string;
  message: string;
  display_type: 'scroll' | 'flash' | 'typewriter' | 'matrix';
  color_scheme: 'green' | 'gold' | 'red' | 'white' | 'protest_red';
  priority: number;
  scheduled_start?: string;
  scheduled_end?: string;
  is_active: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected';
  vote_count: number;
  category: 'cheer' | 'protest' | 'memory' | 'announcement' | 'tribute';
  related_memory_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FeaturedOaklandContent {
  content_type: 'memory' | 'audio' | 'mascot';
  id: string;
  title: string;
  description?: string;
  era?: string;
  created_at: string;
  media_url?: string;
  user_id?: string;
}

export interface OaklandExpression {
  id: string;
  category: 'cheer' | 'chant' | 'protest' | 'nostalgia' | 'inside_joke' | 'player_call';
  text_content: string;
  audio_url?: string;
  emotion_tags: string[];
  usage_count: number;
  source: 'fan_submitted' | 'historical' | 'broadcast';
  decade?: '70s' | '80s' | '90s' | '2000s' | '2010s' | '2020s';
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  created_at: string;
}

export interface OaklandTemplate {
  id: string;
  name: string;
  category: 'nostalgia' | 'protest' | 'community' | 'celebration' | 'championship';
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  description?: string;
  preview_url?: string;
  config: Record<string, any>;
  tags: string[];
  usage_count: number;
  created_at: string;
}

export interface OaklandEvent {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  event_type: 'game' | 'tailgate' | 'protest' | 'community' | 'farewell' | 'championship';
  memories_count: number;
  featured_memory_id?: string;
  is_historical: boolean;
  era?: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  created_at: string;
}
