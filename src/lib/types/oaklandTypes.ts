
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
  
  // Era Classification
  era: 'early_years' | 'dynasty_70s' | 'bash_brothers' | 'moneyball' | 'playoff_runs' | 'farewell';
  
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

export interface AudioMemory {
  id: string;
  user_id: string;
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
}
