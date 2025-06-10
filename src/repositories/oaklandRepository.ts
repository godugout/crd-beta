
import { supabase } from '@/integrations/supabase/client';
import { 
  OaklandMemory, 
  AudioMemory, 
  OaklandMascot, 
  JumbotronContent,
  FeaturedOaklandContent 
} from '@/lib/types/oaklandTypes';

// Audio Memories Repository
export const audioMemoryOperations = {
  async getAll(): Promise<AudioMemory[]> {
    const { data, error } = await supabase
      .from('audio_memories')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByUser(userId: string): Promise<AudioMemory[]> {
    const { data, error } = await supabase
      .from('audio_memories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByEra(era: string): Promise<AudioMemory[]> {
    const { data, error } = await supabase
      .from('audio_memories')
      .select('*')
      .eq('era', era)
      .eq('visibility', 'public')
      .order('plays_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFeatured(): Promise<AudioMemory[]> {
    const { data, error } = await supabase
      .from('audio_memories')
      .select('*')
      .eq('is_featured', true)
      .eq('visibility', 'public')
      .order('plays_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(audioMemory: Omit<AudioMemory, 'id' | 'created_at' | 'updated_at'>): Promise<AudioMemory> {
    const { data, error } = await supabase
      .from('audio_memories')
      .insert(audioMemory)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async incrementPlays(id: string): Promise<void> {
    const { error } = await supabase
      .from('audio_memories')
      .update({ plays_count: supabase.sql`plays_count + 1` })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Mascots Repository
export const mascotOperations = {
  async getAll(): Promise<OaklandMascot[]> {
    const { data, error } = await supabase
      .from('oakland_mascots')
      .select('*')
      .order('fan_favorites', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getFeatured(): Promise<OaklandMascot[]> {
    const { data, error } = await supabase
      .from('oakland_mascots')
      .select('*')
      .eq('is_featured', true)
      .order('fan_favorites', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByEra(era: string): Promise<OaklandMascot[]> {
    const { data, error } = await supabase
      .from('oakland_mascots')
      .select('*')
      .eq('era', era)
      .order('fan_favorites', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async adoptMascot(id: string): Promise<void> {
    const { error } = await supabase
      .from('oakland_mascots')
      .update({ adoption_count: supabase.sql`adoption_count + 1` })
      .eq('id', id);
    
    if (error) throw error;
  },

  async favoriteMascot(id: string): Promise<void> {
    const { error } = await supabase
      .from('oakland_mascots')
      .update({ fan_favorites: supabase.sql`fan_favorites + 1` })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Jumbotron Repository
export const jumbotronOperations = {
  async getActive(): Promise<JumbotronContent[]> {
    const { data, error } = await supabase
      .from('jumbotron_content')
      .select('*')
      .eq('is_active', true)
      .eq('moderation_status', 'approved')
      .or(`scheduled_start.is.null,scheduled_start.lte.${new Date().toISOString()}`)
      .or(`scheduled_end.is.null,scheduled_end.gte.${new Date().toISOString()}`)
      .order('priority', { ascending: false })
      .order('vote_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getByCategory(category: string): Promise<JumbotronContent[]> {
    const { data, error } = await supabase
      .from('jumbotron_content')
      .select('*')
      .eq('category', category)
      .eq('moderation_status', 'approved')
      .order('vote_count', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(content: Omit<JumbotronContent, 'id' | 'created_at' | 'updated_at'>): Promise<JumbotronContent> {
    const { data, error } = await supabase
      .from('jumbotron_content')
      .insert(content)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async vote(id: string): Promise<void> {
    const { error } = await supabase
      .from('jumbotron_content')
      .update({ vote_count: supabase.sql`vote_count + 1` })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Featured Content Repository
export const featuredContentOperations = {
  async getFeaturedContent(): Promise<FeaturedOaklandContent[]> {
    const { data, error } = await supabase
      .from('mv_featured_oakland_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
  },

  async refreshFeaturedContent(): Promise<void> {
    const { error } = await supabase.rpc('refresh_materialized_view', {
      view_name: 'mv_featured_oakland_content'
    });
    
    if (error) throw error;
  }
};

// Enhanced Oakland Memories Operations
export const enhancedOaklandMemoryOperations = {
  async getWithAudioAndMascot(id: string): Promise<OaklandMemory & { audio_memory?: AudioMemory; mascot?: OaklandMascot }> {
    const { data, error } = await supabase
      .from('oakland_memories')
      .select(`
        *,
        audio_memory:audio_memories(*),
        mascot:oakland_mascots(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByPlayerMentioned(player: string): Promise<OaklandMemory[]> {
    const { data, error } = await supabase
      .from('oakland_memories')
      .select('*')
      .eq('player_mentioned', player)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getBySeasonYear(year: number): Promise<OaklandMemory[]> {
    const { data, error } = await supabase
      .from('oakland_memories')
      .select('*')
      .eq('season_year', year)
      .eq('visibility', 'public')
      .order('game_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};
