
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface OaklandMemory {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  memory_type: string;
  game_date?: string;
  opponent?: string;
  score?: string;
  location?: string;
  section?: string;
  era?: string;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  attendees?: string[];
  personal_significance?: string;
  historical_context?: string;
  emotions?: string[];
  fan_expressions?: string[];
  tags?: string[];
  visibility?: string;
  template_id?: string;
  effect_settings?: Record<string, any>;
  is_featured?: boolean;
  community_reactions?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useOaklandMemories = () => {
  const [memories, setMemories] = useState<OaklandMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('oakland_memories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      const transformedMemories: OaklandMemory[] = (data || []).map(memory => ({
        id: memory.id,
        user_id: memory.user_id,
        title: memory.title,
        description: memory.description,
        memory_type: memory.memory_type,
        game_date: memory.game_date,
        opponent: memory.opponent,
        score: memory.score,
        location: memory.location,
        section: memory.section,
        era: memory.era,
        image_url: memory.image_url,
        audio_url: memory.audio_url,
        video_url: memory.video_url,
        attendees: memory.attendees || [],
        personal_significance: memory.personal_significance,
        historical_context: memory.historical_context,
        emotions: memory.emotions || [],
        fan_expressions: memory.fan_expressions || [],
        tags: memory.tags || [],
        visibility: memory.visibility,
        template_id: memory.template_id,
        effect_settings: (memory.effect_settings as Record<string, any>) || {},
        is_featured: memory.is_featured,
        community_reactions: (memory.community_reactions as Record<string, any>) || {},
        created_at: memory.created_at,
        updated_at: memory.updated_at,
      }));

      setMemories(transformedMemories);
    } catch (err) {
      console.error('Error fetching Oakland memories:', err);
      setError(err instanceof Error ? err.message : 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  return { memories, loading, error, refetch: fetchMemories };
};
